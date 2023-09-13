(function ($) {

	window.loaded = 0;

	$(document).ajaxStart(function () {
		window.loaded++;

		console.log(8, window.loaded);
	});

	$(document).ajaxComplete(function () {
		window.loaded--;

		console.log(14, window.loaded);
	});

})(jQuery);