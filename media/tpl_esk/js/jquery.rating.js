(function ($) {
	'use strict';

	function Rating(element)
	{
		this.element = $(element);
		this._click = false;
		var self = this;

		self.items = self.element.find('.star-block');
		self.active = self.items.filter('.active');

		self.items.on('click', function () {
			self.click_event(this);
		});

		self.items.on('mouseover', function () {
			self.mouseover_event(this);
		});

		self.items.on('mouseout', function () {
			self.mouseout_event();
		});
	};

	Rating.prototype.click_event = function (el)
	{
		var self = this, index = $(el).index();

		$.ajax({
			data: {
				option: 'com_ajax',
				plugin: 'shop',
				group: 'system',
				task: 'rating_content',
				id: self.element.data('id'),
				value: (index + 1),
				format: 'json'
			},
			method: 'POST',
			dataType: 'json',
			success: function (result) {
				alert(result.message);

				if (result.success === true)
				{
					self.items.unbind('click');
					self.items.unbind('mouseover');
					self.items.unbind('mouseout');
				}
				else
				{
					console.error(result.message);
				}
			}
		});
	};

	Rating.prototype.mouseover_event = function (el)
	{
		var index = $(el).index(), _items;

		this.items.removeClass('active');
		_items = this.items.slice(0, (index + 1));
		_items.addClass('active');
	};

	Rating.prototype.mouseout_event = function ()
	{
		this.items.removeClass('active');
		this.active.addClass('active');
	};

	$.fn.rating = function ()
	{
		this.each(function () {
			var data = new Rating(this);
			$(this).data('rating', data);
		});
	};

	$(document).ready(function () {
		$('.stars-block').rating();
	});

})(jQuery);