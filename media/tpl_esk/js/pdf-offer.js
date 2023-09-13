(function ($) {
	'use strict';

	$(document).ready(function () {
		$('.btn-pdf-offer').on('click', function () {
			let link = $(this).data('link');
			window.open(link, '_blank');
		});
	});

})(jQuery);