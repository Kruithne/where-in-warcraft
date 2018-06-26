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

	// Add button handlers.
	ui.$buttonViewMap.onButtonClick(() => ui.showMap());
	ui.$buttonPlay.onButtonClick(() => state.startGame());
	ui.$buttonViewLocation.onButtonClick(() => ui.hideMap());
	ui.$buttonNextRound.onButtonClick(() => state.nextRound());
	ui.$buttonReplay.onButtonClick(() => state.restartGame());
	ui.$buttonSubmitGuess.onButtonClick(() => state.processGuess());

	// Asynchronously load location data from server.
	$.ajax({
		url: 'locations.json',
		async: true,
		dataType: 'json',
		success: (res) => {
			for (let zone of res.zones) {
				for (let location of zone.locations) {
					location.zone = zone.name;
					state.addLocation(location);
				}
			}

			ui.enablePlay();
		}
	});
});