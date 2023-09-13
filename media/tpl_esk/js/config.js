(function ($) {
    'use strict';

    function Config(element_id)
    {
        $.extend(this, JSON.parse($('#' + element_id).html()));
    }

    Config.prototype.get = function (key)
    {
        if (!this.has(key)) {
            return;
        }

        return this[key];
    };

    Config.prototype.has = function (key)
    {
        return this.hasOwnProperty(key);
    };

    window.Config = Config;

})(jQuery);