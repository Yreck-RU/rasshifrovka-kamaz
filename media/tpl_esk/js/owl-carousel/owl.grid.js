/**
 * Grid
 * @since 1.0.0
 */
; (function ($, window, document, undefined)
{
    Grid = function (carousel)
    {
        this._core = carousel;

        this._handlers = {
            'initialized.owl.carousel': function (e) {
                var stage = e.relatedTarget.$stage;
                var items = stage.find('.owl-item');

                stage.css('grid-template-columns',
                    'repeat(' + items.length + ', 1fr)'
                );
            }
        };

        this._core.$element.on(this._handlers);
    };

    $.fn.owlCarousel.Constructor.Plugins['Grid'] = Grid;
})(window.Zepto || window.jQuery, window, document);