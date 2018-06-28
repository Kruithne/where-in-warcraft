class Util {
	static loadImage(url, callback) {
		$('<img/>').attr('src', url).one('load', () => {
			if (typeof(callback) === 'function')
				callback(url);
		}).each(function() {
			if (this.complete)
				$(this).trigger('load');
		});
	}

	static pointDistance(x1, y1, x2, y2) {
		let deltaX = x1 - x2;
		let deltaY = y1 - y2;

		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}
}

jQuery.fn.extend({
	loadBackgroundSmooth: function(url) {
		Util.loadImage(url || this.attr('data-bg'), (url) => {
			this.css('background-image', 'url(' + url + ')').css('opacity', 1);
		});
	},

	onButtonClick: function(callback) {
		return this.on('click', (e) => {
			if (!this.isDisabled()) {
				this.disable();
				callback();
			}

			e.stopPropagation();
		});
	},

	enable: function() {
		return this.removeClass('disabled');
	},

	disable: function() {
		return this.addClass('disabled');
	},

	isDisabled: function() {
		return this.hasClass('disabled');
	},

	fadeInFlex: function(speed, callback) {
		return this.css('display', 'flex').animate({ opacity: 1}, speed || 400, callback);
	}
});
