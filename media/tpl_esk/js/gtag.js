window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

(function ($) {
	'use strict';

	function GTAnalytics(element)
	{
		this.element = $(element);
		let self = this;

		self.element.on('load', function () {
			self.element.removeAttr('data-src');
			self.element.removeAttr('id');

			gtag('js', new Date());

			var url = new URL(self.src);
			gtag('config', url.searchParams.get('id'));
		});

		self.element.on('error', function () {
			console.error('Error loading Google Analytics');
		});

		self.src = self.element.data('src');
		self.element.attr('src', self.src);
	};

	$.fn.gtag = function ()
	{
		let map_item = function ()
		{
			let data = new GTAnalytics(this);
			$(this).data('gtm', data);
		};

		this.each(map_item);
	};

})(jQuery);