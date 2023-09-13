(function ($) {
    'use strict';

	function FilePdf(element)
	{
		console.log(6, this);
        this.element = $(element);
	};

	$.fn.file = function ()
	{
		let map_item = function ()
		{
			let data = new Search(this);
			$(this).data('search', data);
		};

		return this.each(map_item);
	};

	$(document).ready(function () {
		let items = $('.file-inner-pdf');

		items.each(function () {
			let data = new FilePdf(this);
			$(this).data('file-pdf', data)
		});
	});

})(jQuery);
