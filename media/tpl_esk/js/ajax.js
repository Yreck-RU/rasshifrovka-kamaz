(function ($) {
    'use strict';

    console.log(3, window.config);

	$.ajaxSetup({
		headers: {
            // "X-CSRF-Token": config.get('csrf_token')
		}
	});

	var _messages_ajax = function (event, jqxhr, settings, result)
    {
        
	};

	$(document).ajaxError(_messages_ajax);
	$(document).ajaxSuccess(_messages_ajax);
})(jQuery);
