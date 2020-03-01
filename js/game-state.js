const MAX_LIVES = 3;
const GUESS_THRESHOLD = 2.4;
const BOD_RADIUS = 0.8;

class GameState {
	constructor(ui, panorama) {
		this.ui = ui;
		this.panorama = panorama;
		this.availableLocations = [];
	}

	addLocation(location) {
		this.availableLocations.push(location);
	}

	reset() {
		this.currentRound = 0;
		this.currentLocation = null;

		this.playerLives = MAX_LIVES;
		this.playerGuesses = [];
		this.playerPoints = 0;

		this.isAlive = true;

		this.locationPool = [];
		for (let location of this.availableLocations)
			this.locationPool.push(location);

		this.ui.$scoreLives.text(this.playerLives);
		this.ui.$scoreRounds.text(this.currentRound);
		this.ui.$scoreAccuracy.text(this.playerAccuracy);
	}

	startGame(isClassic) {
		this.reset();
		this.ui.enterGame(isClassic, () => this.nextRound());
	}

	restartGame() {
		// Remove the glowing border from the game frame.
		this.ui.setGameGlowBorder('transparent');

		// Hide the game over frame.
		this.ui.$gameOverSpirit.css('opacity', 0);
		this.ui.$gameOver.fadeOut(400, () => {
			// Reset the game state.
			this.reset();

			// Show the game map/image frames.
			this.ui.$gameMap.show();
			this.ui.$gameImage.show();

			// Invoke the next round.
			this.nextRound();
		});
	}

	nextRound() {
		this.ui.$scoreAccuracy.text(this.playerAccuracy);

		if (this.isAlive) {
			if (this.locationPool.length > 0) {
				// Update the player score information.
				this.currentRound++;
				this.ui.$scoreRounds.text(this.currentRound);

				// Select the next location from the pool.
				let locationIndex = Math.floor(Math.random() * this.locationPool.length);
				this.currentLocation = this.locationPool.splice(locationIndex, 1)[0];

				// Set the panorama to the new location.
				this.panorama.setLocation(this.currentLocation.id);

				// Remove the glow effect from the game frame.
				this.ui.setGameGlowBorder('transparent');

				// Hide/clear the guess map.
				this.ui.hideMap();
				this.ui.clearMap();
				this.ui.resetMapZoom();

				// Enable the map, allowing users to place a marker.
				this.ui.enableMap();

				// Hide the 'Next round' button.
				this.ui.$buttonNextRound.hide();

				// Show the 'View-location' and 'Submit guess' buttons.
				this.ui.$buttonViewLocation.show();
				this.ui.$buttonSubmitGuess.show().disable();

			} else {
				this.ui.showGameOver(true, this.playerPoints);
			}
		} else {
			this.ui.showGameOver(false, this.playerPoints);
		}
	}

	processGuess() {
		// Disable the map, preventing further input.
		this.ui.disableMap();

		// Calculate the player's accuracy.
		let choice = this.ui.mapMarker.getLatLng();
		let dist = Util.pointDistance(this.currentLocation.lat, this.currentLocation.lng, choice.lat, choice.lng);

		let circleColour = 'blue';
		let circleRadius = GUESS_THRESHOLD;

		let distFactor = 1 - (dist / GUESS_THRESHOLD);
		if (distFactor > 0) {
			if (distFactor < BOD_RADIUS) {
				circleColour = 'yellow';
			} else {
				circleColour = 'green';
				circleRadius = BOD_RADIUS;
				distFactor = 1;

				this.ui.setGameGlowBorder('green');
			}

			// Increment the players score.
			this.playerPoints++;
		} else {
			distFactor = 0;
			this.removeLife();

			circleColour = 'red';
			this.ui.showMapPath(this.currentLocation, choice, circleColour);
			this.ui.setGameGlowBorder('red');
		}

		// Set the zone information on the map.
		this.ui.setMapInfo(this.currentLocation.zone, this.currentLocation.name);

		// Convert the factor into a 0-100 percentage and store it.
		let distPct = distFactor * 100;
		this.playerGuesses.push(distPct);

		// Show a circle where the actual answer was and pan to it.
		this.ui.showMapCircle(this.currentLocation, circleColour, circleRadius);
		this.ui.panMap(this.currentLocation);

		// Hide the 'Submit guess' and 'View Location' buttons.
		this.ui.$buttonSubmitGuess.hide();
		this.ui.$buttonViewLocation.hide();

		// Show the 'Next Round' button and enable it.
		this.ui.$buttonNextRound.enable().show();
	}

	removeLife() {
		this.playerLives--;
		this.isAlive = this.playerLives > 0;
		this.ui.$scoreLives.text(this.playerLives);
	}

	get playerAccuracy() {
		if (this.playerGuesses.length === 0)
			return 0;

		let sum = 0;
		for (let guess of this.playerGuesses)
			sum += guess;

		return Math.ceil(sum / this.playerGuesses.length);
	}
}