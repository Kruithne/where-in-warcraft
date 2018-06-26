const PANORAMA_WIDTH = 4901;
const PANORAMA_HEIGHT = 615;
const SLICE_COUNT = 13;
const SLICE_WIDTH = PANORAMA_WIDTH / SLICE_COUNT;

class Panorama {
	constructor(ui) {
		this.ui = ui;

		this.bounds = 0;
		this.offset = 0;
		this.anchor = 0;
		this.isDragging = false;

		this.slices = $();
		this._init();
	}

	setLocation(id) {
		// Remove existing slices.
		this.slices.remove();

		// Render new slices for the given location.
		for (let i = 0; i < SLICE_COUNT; i++) {
			let slice = $('<div/>').addClass('slice').appendTo(this.ui.$gameImage);
			let slicePath = 'images/locations/' + id + '/' + i + '.jpg';

			Util.loadImage(slicePath, (url) => {
				slice.css({
					'background-image': 'url(' + url + ')',
					opacity: 1,
				});
			});
		}

		// Re-cache slice elements.
		this.slices = $('.slice');

		// Update slice rendering.
		this._updateRendering();
	}

	_init() {
		this.ui.$gameImage.on('mousedown touchstart', (e) => this._onMouseDown(e));

		$(window).on('resize', () => this._updateRendering());
		$(document)
			.on('mousemove touchmove', (e) => this._onMouseMove(e))
			.on('mouseup touchend touchcancel', (e) => this._onMouseUp(e));
	}

	_onMouseMove(e) {
		if (this.isDragging) {
			let touchX = e.clientX || e.touches[0].clientX;
			let offset = this._restrictBounds(this.offset + (touchX - this.anchor));
			this.slices.css('transform', 'translateX(' + (offset) + 'px)');
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
			this.offset = this._restrictBounds(this.offset + (touchX - this.anchor));
			e.preventDefault();
		}
	}

	_updateRendering() {
		let state = this;
		this.bounds = -this.ui.$gameImage.width();

		this.slices.each(function() {
			let slice = $(this);
			let width = Math.ceil(SLICE_WIDTH * (slice.height() / PANORAMA_HEIGHT));

			slice.width(width);
			state.bounds += width;
		});

		this.offset = this._restrictBounds(this.offset);
		this.slices.css('transform', 'translateX(' + (this.offset) + 'px)');
	}

	_restrictBounds(value) {
		return Math.max(-this.bounds, Math.min(value, 0));
	}
}