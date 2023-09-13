(function ($) {
    'use strict';

    $(document).ready(function () {
        var _click = function ()
        {
            event.preventDefault();
            var href = $(this).attr('href');

            document.getElementById(href.substr(1)).scrollIntoView({
                behavior: 'smooth', block: 'start'
            });
        };

        $('.anchor').on('click', _click);
    });

})(jQuery);
