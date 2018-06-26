const UI_ANIM_SPEED = 400;

class UI {
	constructor() {
		this._isMapEnabled = false;
		this._init();
	}

	_init() {
		// Containers and structure elements.
		this.$gameIntro = $('#intro');
		this.$gameBanners = $('.game-banner');
		this.$gameFrame = $('#game-frame');
		this.$gameContent = $('#game-content');
		this.$gameImage = $('#game-image');
		this.$gameMap = $('#game-map');

		// Game-over frame elements.
		this.$gameOver = $('#game-over');
		this.$gameOverSpirit = $('#game-over-spirit');
		this.$gameOverTitle = this.$gameOver.children('h2');
		this.$gameOverRounds = $('#game-over-rounds').children('span');
		this.$gameOverAccuracy = $('#game-over-accuracy').children('span');

		// Score components for top header.
		this.$scoreRounds = $('#game-score-round').children('.value');
		this.$scoreAccuracy = $('#game-score-accuracy').children('.value');
		this.$scoreLives = $('#game-score-lives').children('.value');

		// Button elements.
		this.$buttonViewMap = $('#game-button-map');
		this.$buttonViewLocation = $('#game-button-location');
		this.$buttonSubmitGuess = $('#game-button-confirm');
		this.$buttonNextRound = $('#game-button-next');
		this.$buttonReplay = $('#game-button-replay');
		this.$buttonPlay = $('#btn-play');

		// Asynchronously load smooth background images.
		$('.smooth').each(function() { $(this).loadBackgroundSmooth() });
	}

	_initializeMap() {
		this.map = L.map('game-map', {
			attributionControl: false,
			crs: L.CRS.Simple
		}).setView([-120.90349875311426, 124.75], 2);

		L.tileLayer('images/tiles/{z}/{x}/{y}.png', { maxZoom: 6, }).addTo(this.map);
		this.map.on('click', (e) => this._onMapClick(e));
	}

	_onMapClick(e) {
		console.log(JSON.stringify(e.latlng));

		if (this._isMapEnabled) {
			// Remove existing marker.
			if (this.mapMarker)
				this.mapMarker.remove();

			this.mapMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
			this.$buttonSubmitGuess.enable();
		}
	}

	panMap(location) {
		this.map.panTo([
			location.lat, location.lng
		], {
			duration: 1,
			easeLinearity: 0.1
		});
	}

	showMapPath(pointA, pointB, colour) {
		if (this.mapPath)
			this.mapPath.remove();

		this.mapPath = L.polyline([
			[pointA.lat, pointA.lng],
			[pointB.lat, pointB.lng]
		], { color: colour || 'red' }).addTo(this.map);
	}
	
	showMapCircle(location, colour, radius) {
		if (this.mapCircle)
			this.mapCircle.remove();

		this.mapCircle = L.circle([location.lat, location.lng], {
			color: colour,
			fillColor: colour,
			fillOpacity: 0.5,
			radius: radius
		}).addTo(this.map);
	}

	clearMap() {
		if (this.mapMarker)
			this.mapMarker.remove();

		if (this.mapPath)
			this.mapPath.remove();

		if (this.mapCircle)
			this.mapCircle.remove();
	}

	enableMap() {
		this._isMapEnabled = true;
	}

	disableMap() {
		this._isMapEnabled = false;
	}

	showMap() {
		// Ensure the 'Re-view' location button is enabled.
		this.$buttonViewLocation.enable();

		// Enable the 'Submit Guess' button if we have a location.
		if (this.mapMarker)
			this.$buttonSubmitGuess.enable();

		// Bring the map to the front and fade it in.
		this.$gameMap.css({ 'z-index': 4, opacity: 1 });
		
		// Fade out the panorama frame.
		this.$gameImage.css({ opacity: 0 });
	}

	hideMap() {
		// Ensure the 'Make guess' button is enabled.
		this.$buttonViewMap.enable();

		// Send the map to the back and fade it out.
		this.$gameMap.css({'z-index': 1, opacity: 0});

		// Fade in the panorama frame.
		this.$gameImage.css({ opacity: 1 });
	}

	enablePlay() {
		this.$buttonPlay.enable();
	}

	enterGame(callback) {
		this.$gameIntro.fadeOut(UI_ANIM_SPEED, () => {
			// Show the containing frame
			this.$gameFrame.show();

			// Extend the top/bottom banners into view.
			this.$gameBanners.addClass('extended');

			// Fade in the game content container.
			this.$gameContent.fadeInFlex(UI_ANIM_SPEED);

			// Initialize the guess map.
			this._initializeMap();

			// Invoke callback.
			callback();
		});
	}

	setGameGlowBorder(colour) {
		this.$gameContent.css('box-shadow', 'inset ' + colour + ' 0 0 80px');
	}

	showGameOver(victory, score) {
		// Fade the exterior border to white.
		this.setGameGlowBorder('white');

		this.$gameMap.fadeOut(UI_ANIM_SPEED);
		this.$gameImage.fadeOut(UI_ANIM_SPEED, () => {
			if (victory)
				this.$gameOverTitle.text('You completed every location.');
			else
				this.$gameOverTitle.text('You ran out of lives.');

			// Show score information from header bar.
			this.$gameOverRounds.text(score);
			this.$gameOverAccuracy.text(this.$scoreAccuracy.text());

			// Enable the replay button.
			this.$buttonReplay.enable();

			// Show the spirit healer graphic.
			this.$gameOverSpirit.css('display', 'block').loadBackgroundSmooth();

			// Show the game over screen.
			this.$gameOver.fadeInFlex();
		});
	}
}