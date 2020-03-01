class Panorama {
	constructor(ui) {
		this.ui = ui;
		this.isClassic = false;

		this.offset = 0;
		this.anchor = 0;
		this.isDragging = false;

		this._init();
	}

	setMode(isClassic) {
		this.isClassic = isClassic;
	}

	setLocation(id) {
		// Load the panorama for this location.
		const dir = this.isClassic ? 'locations_classic' : 'locations';
		this.ui.$gameCanvas.css({ opacity: 0 });
		this.ui.$gameCanvas.loadBackgroundSmooth('images/' + dir + '/' + id + '.jpg');
	}

	_init() {
		this.ui.$gameImage.on('mousedown touchstart', (e) => this._onMouseDown(e));

		$(document)
			.on('mousemove touchmove', (e) => this._onMouseMove(e))
			.on('mouseup touchend touchcancel', (e) => this._onMouseUp(e));
	}

	_onMouseMove(e) {
		if (this.isDragging) {
			let touchX = e.clientX || e.touches[0].clientX;
			let offset = this.offset + (touchX - this.anchor);
			this.ui.$gameCanvas.css('background-position-x', offset + 'px');
			e.preventDefault();
		}
	}

	_onMouseDown(e) {
		this.anchor = e.clientX || e.touches[0].clientX;
		this.isDragging = true;
		e.preventDefault();
	}

	_onMouseUp(e) {
		if (this.isDragging) {
			let touchX = e.clientX || e.changedTouches[0].clientX;

			this.isDragging = false;
			this.offset = this.offset + (touchX - this.anchor);
			e.preventDefault();
		}
	}
}