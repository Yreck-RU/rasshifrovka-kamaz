(function ($) {
	'use strict';

	function Lightbox(images, options, thumbs)
	{
		this.images = images;
		this.options = options;
		this.thumbs = thumbs;

		this.classes = {
			active: 'in',
			body: 'owl-lightbox-body',
			loader: 'loader',
			error: 'error-load',
			popup_open: 'owl-lightbox-open',
			popup_wrap: 'owl-lightbox-wrapper',
			popup_content: 'owl-lightbox-content',
			popup_body: 'owl-lightbox-body',
			body_left: 'owl-lightbox-body-left',
			body_head: 'owl-lightbox-body-head',
			// body_footer: 'owl-lightbox-body-footer',
			body_right: 'owl-lightbox-body-right',
			popup_figure: 'owl-lightbox-lightbox-figure',
			popup_img: 'owl-lightbox-lightbox-img',
			popup_btn_close: 'owl-lightbox-close',
			popup_btn_next: 'owl-lightbox-next',
			popup_btn_prev: 'owl-lightbox-prev'
		};

		var self = this;

		self.popup = $('<div />', {
			class: self.classes.popup_wrap
		});

		self.content = $('<div />', {
			class: self.classes.popup_content
		});

		self.popup.html(self.content);

		self.body = $('<div />', {
			class: self.classes.popup_body
		});

		self.content.html(self.body);

		self.body_left = $('<div />', {
			class: self.classes.body_left
		});

		self.body.html(self.body_left);

		self.body_head = $('<div />', {
			class: self.classes.body_head,
			css: { position: 'relative' }
		});

		self.body_left.append(self.body_head);

		self.btn_prev = $('<button />', {
			type: 'button',
			class: 'owl-lightbox-btn-prev'
		});

		self.btn_prev.on('click', function () {
			self.prev();
		});

		self.body_head.append(self.btn_prev);

		self.body_panzoom = $('<div />', {
			class: 'panzoom'
		});

		self.body_head.append(self.body_panzoom);

		self.btn_next = $('<button />', {
			type: 'button',
			class: 'owl-lightbox-btn-next'
		});

		self.btn_next.on('click', function () {
			self.next();
		});

		self.body_head.append(self.btn_next);

		self.image = $('<img />', {
			class: self.classes.popup_img,
			src: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
		});

		self.image.on('load', function () {
			self.body.removeClass(self.classes.loader);
		});

		self.image.on('error', function () {
			self.body.removeClass(self.classes.loader);

			self.body.html($('<div />', {
				class: 'owl-lightbox-error',
				html: 'Image loading error!'
			}));
		});

		self.body_panzoom.html(self.image);

		/////////////////////////////////////////////////////////////////

		/*
		self.body_footer = $('<div />', {
			class: self.classes.body_footer
		});

		self.body_left.append(self.body_footer);

		self.panzoom_out = $('<button />', {
			type: 'button',
			class: 'owl-lightbox-panzoom-out'
		});

		self.body_footer.append(self.panzoom_out);

		self.panzoom_in = $('<button />', {
			type: 'button',
			class: 'owl-lightbox-panzoom-in'
		});

		self.body_footer.append(self.panzoom_in);
		*/

		/////////////////////////////////////////////////////////////////

		self.body_right = $('<div />', {
			class: self.classes.body_right
		});

		self.body.append(self.body_right);

		self.right_title = $('<div />', {
			class: 'owl-lightbox-body-title',
			html: self.options.title
		});

		self.body_right.append(self.right_title);

		self.right_close = $('<button />', {
			type: 'button',
			class: self.classes.popup_btn_close
		});

		self.right_close.on('click', function () {
			self.hide();
		});

		self.body_right.append(self.right_close);

		if (self.options.is_clarify === true)
		{
			self.body_right.append($('<div />', {
				class: 'owl-lightbox-body-price',
				html: self.options.price,
				'data-before': self.options.price_before,
				'data-after': self.options.price_after
			}));

			self.btn_product_buy = $('<button />', {
				type: 'button', class: 'btn-clarify',
				html: self.options.btn_clarify
			});

			self.body_right.append(self.btn_product_buy);

			self.btn_product_buy.clarify(
				_config.get(self.options.clarify_id)
			);
		}
		else if (self.options.is_price === true)
		{
			self.body_right.append($('<div />', {
				class: 'owl-lightbox-body-price',
				html: self.options.price,
				'data-before': self.options.price_before,
				'data-after': self.options.price_after
			}));

			self.btn_product_buy = $('<product-buy />', {
				'data-id': self.options.id,
				html: self.options.btn_product_buy,
				class: 'btn-product-buy'
			});

			self.body_right.append(self.btn_product_buy);
		}
		else
		{
			self.btn_request_price = $('<product-request-price />', {
				'data-id': self.options.id,
				class: 'btn-request-price',
				html: self.options.btn_request_price
			});

			self.body_right.append(self.btn_request_price);
		}

		if (self.options.is_leasing === true)
		{
			self.btn_leasing = $('<button />', {
				type: 'button',
				class: 'btn-product-leasing',
				html: self.options.btn_leasing
			});

			self.body_right.append(self.btn_leasing);

			self.btn_leasing.leasing(
				_config.get(self.options.leasing)
			);
		}

		if (thumbs.length > 0)
		{
			self.thumb_el = $('<div />', {
				class: 'owl-lightbox-body-thumb',
				html: thumbs
			});

			self.body_right.append(self.thumb_el);

			thumbs.on('click', function () {
				var index = $(this).index();

				self.setThumbActive(index);
				self.image.attr('src', self.images[index]);
			});
		}
	};

	Lightbox.prototype.show = function (img, index)
	{
		var self = this;

		self.setThumbActive(index);

		self.body.addClass(self.classes.loader);
		self.image.attr('src', img.data('xxl'));

		$('body').addClass(self.classes.popup_open);
		$('body').append(self.popup);

		/*
		var data = self.body_panzoom.data();

		if (!data.hasOwnProperty('__pz__'))
		{
			self.body_panzoom.panzoom({
				$zoomIn: self.panzoom_in,
				$zoomOut: self.panzoom_out,
				contain: true
			});

			self.body_panzoom.panzoom('zoom', true);

			self.body_panzoom.on('mousewheel.focal', function (e) {
				e.preventDefault();
				var delta = e.delta || e.originalEvent.wheelDelta;
				var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;

				self.body_panzoom.panzoom('zoom', zoomOut, {
					increment: 0.1, animate: false, focal: e
				});
			});
		}
		*/

		self.popup.css('display', 'block');
		self.popup.animate({ opacity: 1 }, 200);
	};

	Lightbox.prototype.hide = function ()
	{
		var self = this;

		$('body').removeClass(self.classes.popup_open);

		self.popup.animate({
			opacity: 0
		}, 200, function () {
			self.popup.css('display', 'none');
		});
	};

	Lightbox.prototype.prev = function ()
	{
		var self = this;

		if (isNaN(Number(self.active)))
		{
			return false;
		}

		if ((self.active - 1) < 0)
		{
			return false;
		}

		if (self.images.hasOwnProperty(self.active--))
		{
			self.setThumbActive(self.active);
			self.image.attr('src', self.images[self.active]);

			return true;
		}

		return false;
	};

	Lightbox.prototype.next = function ()
	{
		var self = this;

		if (isNaN(Number(self.active)))
		{
			return false;
		}

		if ((self.active + 1) > (self.images.length - 1))
		{
			return false;
		}

		if (self.images.hasOwnProperty(self.active++))
		{
			self.setThumbActive(self.active);
			self.image.attr('src', self.images[self.active]);

			return true;
		}

		return false;
	};

	Lightbox.prototype.setThumbActive = function (index)
	{
		var self = this;
		self.active = index;

		$.map(self.thumbs, function (item) {
			$(item).removeClass('selected');
		});

		$(self.thumbs[index]).addClass('selected');
	};

	$.fn.Lightbox = Lightbox;

})(jQuery);