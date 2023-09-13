(function ($) {
	'use strict';

	function Images(element)
	{
		let config = _config.get(element.id);
		$.extend(this, config);

		this.element = $(element);
		var self = this;

		self.owl = this.element.find('.owl-carousel');
		self.thumb = this.element.find('#' + self.thumb_id);

		self.owl.owlCarousel(self);

		if (window.outerWidth < 992)
		{
			self.thumb.addClass('owl-carousel owl-theme');

			self.thumb.owlCarousel({
				items: 3, margin: 10,
				responsive: {
					0: {
						items: 3
					},
					480: {
						items: 4
					},
					768: {
						items: 5
					}
				},
				onInitialized: function () {
					this._items[0].addClass('selected');
				}
			});
		}
	};

	Images.prototype.onInitialized = function ()
	{
		let self = this,
			data = self.options.element.data();

		self.owl_label = $('<div />', {
			class: 'owl-label-outer'
		});

		if (data.hasOwnProperty('labelTitle'))
		{
			self.owl_label.html(data.labelTitle);
		}

		if (data.hasOwnProperty('labelColor'))
		{
			self.owl_label.css('color', data.labelColor);
		}

		if (data.hasOwnProperty('labelBgColor'))
		{
			self.owl_label.css(
				'background-color', data.labelBgColor
			);
		}

		self.$element.prepend(self.owl_label);
		var items = self.options.thumb.find('img');

		$.map(items, function (item, key) {
			$(item).on('click', function () {
				self.options.toggleThumb(item, key);
			});
		});

		var owl_item = $(items[0]).parent('.owl-item');

		if (owl_item.length > 0)
		{
			owl_item.addClass('selected');
		}
		else
		{
			$(items[0]).addClass('selected');
		}

		self._items[0].addClass('selected');

		var scr = $.map(self._items, function (item) {
			return item.find('img').data('xxl');
		});

		var lightbox = new $.fn.Lightbox(
			scr, self.options, items.clone()
		);

		$.map(self._items, function (item, key) {
			item.on('click', function () {
				lightbox.show(item.find('img'), key);
			});
		});
	};

	Images.prototype.onDragged = function (e)
	{
		let self = this;

		$.each(self._items, function () {
			$(this).removeClass('selected');
		});

		let item = self._items[e.item.index];
		item.addClass('selected');

		$.each(self.settings.images, function (k) {
			self.options.thumb.toggleClass(
				'selected', (k === e.item.index)
			);
		});
	};

	Images.prototype.toggleThumb = function (item, key)
	{
		var images = this.thumb.find('img');

		$.map(images, function (image) {
			var owl_item = $(image).parent();
			owl_item.removeClass('selected');
			$(image).removeClass('selected');
		});

		var owl_item = $(item).parent('.owl-item');

		if (owl_item.length > 0)
		{
			owl_item.addClass('selected');
		}
		else
		{
			$(item).addClass('selected');
		}

		this.owl.trigger('to.owl.carousel', key);

		var owl_data = this.owl.data('owl.carousel');
		owl_data._items[key].addClass('selected');
	};

	$.fn.images = function ()
	{
		return this.each(function ()
		{
			var data = new Images(this);
			$(this).data('images', data);
		});
	};

})(jQuery);
