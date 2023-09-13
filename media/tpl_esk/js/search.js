(function ($) {
    'use strict';

	function Search(element)
	{
        this.element = $(element);
        this.items = new Array;

        let config = _config.get(element.id);
        $.extend(this, config);

        let self = this;

        self.wrapper = $('<div />', {
            class: 'search-wrapper'
        });

        self.input = self.element.find('input');

        self.input.on('keyup', function () {
			self.change(this.value);
        });

        self.input.on('click', function () {
            if (!$.isEmptyObject(self.items)) {
                self.render();
			}
        });

        $(document).mouseup(function (e) {
            if (!self.element.is(e.target) &&
                !self.element.has(e.target).length)
            {
                self.close();
            }
        });        
	};

	Search.prototype.change = function ()
	{
        let self = this;

        if (self.input.val().length < 3)
        {
            self.close();
            return;
		}

        if (self.hasOwnProperty('timerId'))
        {
			clearTimeout(self.timerId);
			delete self.timerId;
		}

        self.timerId = setTimeout($.proxy(function () {
            var self = this;

            if (self.hasOwnProperty('xhr'))
            {
                self.xhr.abort();
                delete self.xhr;
            }

            self.xhr = $.ajax({
                data: {
                    task: 'search.autocomplete',
                    q: self.input.val(),
                    format: 'json'
                },
                method: 'POST',
                dataType: 'json',
                url: self.element.attr('action'),
                success: function (result) {
                    if (result.success !== true)
                    {
                        if (result.hasOwnProperty('message'))
                        {
                            alert(result.message);
                            console.error(result.message);
						}

                        return;
                    }

                    let empty = true;

                    if (result.hasOwnProperty('categories'))
                    {
                        self.categories = result.categories;
                        empty = false;
                    }

                    if (result.hasOwnProperty('items'))
                    {
                        self.items = result.items;
                        empty = false;
                    }

                    if (empty === false)
                    {
                        self.render();
                    }
                },
                complete: function () {
                    clearTimeout(self.timerId);
                    delete self.timerId;
                }
			});
        }, self), 300);
    };

    Search.prototype.render = function ()
    {
        let self = this, show = false;
        self.wrapper.empty();

        if (self.hasOwnProperty('categories'))
        {
            show = self.renderCategories();
        }

        if (self.hasOwnProperty('items'))
        {
            show = self.renderItems();
        }

        if (show === true)
        {
            self.element.addClass('open');
            self.element.append(self.wrapper);
        }
    };

    Search.prototype.renderCategories = function ()
    {
        let self = this, block;

        block = $('<div />', {
            class: 'search-categories-block'
        });

        let map_item = function (data)
        {
            data.element = $('<a />', {
                class: 'search-category-inner',
                html: data.title,
                href: data.link
            });

            block.append(data.element);
        };

        self.categories.map(map_item);
        self.wrapper.append(block);

        return true;
    };

    Search.prototype.renderItems = function ()
    {
        let self = this, block;

        block = $('<div />', {
            class: 'search-results-block'
        });

        block.append($('<div />', {
            class: 'search-result-header',
            html: self.title
        }));

        let map_item = function (data)
        {
            data.element = $('<a />', {
                class: 'search-result-inner',
                href: data.link
            });

            data.element.append($('<img />', {
                src: data.src
            }));

            data.body = $('<div />', {
                class: 'search-result-body'
            });

            data.body.append($('<div />', {
                class: 'search-result-title',
                html: data.title
            }));

            data.o_block = $('<ul />', {
                class: 'search-result-options'
            });

            let map_option = function (option)
            {
                option.element = $('<li />', {
                    'data-before': option.title,
                    html: option.value
                });

                data.o_block.append(option.element);
            };

            data.options.map(map_option);

            data.body.append(data.o_block);
            data.element.append(data.body);
            block.append(data.element);

            data.element.on('click', function () {
                self.close();
            });
        };

        self.items.map(map_item);
        self.wrapper.append(block);

        return true;
    };

    Search.prototype.highlighter = function (text)
    {
        let self = this, value = self.input.val(),
            regexp = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;

        value = value.replace(regexp, '\\$&');
        let reg = new RegExp('(' + value + ')', 'ig');

        let func_cell = function ($1, match) {
            return '<b>' + match + '</b>';
        };

        return text.replace(reg, func_cell);
    };

    Search.prototype.close = function ()
    {
        let self = this;

        self.element.removeClass('open');
        self.wrapper.remove();
    };

	$.fn.search = function ()
	{
		let map_item = function ()
		{
			let data = new Search(this);
			$(this).data('search', data);
		};

		return this.each(map_item);
	};

})(jQuery);
