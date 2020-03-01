$(() => {
	const ui = new UI();
	const panorama = new Panorama(ui);
	const state = new GameState(ui, panorama);

	// Ruffles
	setTimeout(() => {
		let ruffles = $('#front-ruffles');
		ruffles.show();

		setTimeout(() => {
			ruffles.addClass('arf');
		}, 1);
	}, 5000);

	const loadGame = (isClassic) => {
		// Asynchronously load location data from server.
		$.ajax({
			url: isClassic ? 'locations_classic.json' : 'locations.json',
			async: true,
			dataType: 'json',
			success: (res) => {
				for (let zone of res.zones) {
					for (let location of zone.locations) {
						location.zone = zone.name;
						state.addLocation(location);
					}
				}
	
				panorama.setMode(isClassic);
				state.startGame(isClassic);
			}
		});
	};

	// Add button handlers.
	ui.$buttonViewMap.onButtonClick(() => ui.showMap());
	ui.$buttonPlay.onButtonClick(() => loadGame(false));
	ui.$buttonPlayClassic.onButtonClick(() => loadGame(true));
	ui.$buttonViewLocation.onButtonClick(() => ui.hideMap());
	ui.$buttonNextRound.onButtonClick(() => state.nextRound());
	ui.$buttonReplay.onButtonClick(() => state.restartGame());
	ui.$buttonSubmitGuess.onButtonClick(() => state.processGuess());

	// Enable Classic mode.
	if (window.location.hash === '#classic')
		ui.$buttonPlayClassic.enable();

	// Preload loading graphic.
	Util.loadImage('images/zeppy.png');
});