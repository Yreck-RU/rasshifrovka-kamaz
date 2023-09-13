(function ($) {
	'use strict';

	function Event()
	{
		this._events = new Object;
	}

	Event.prototype.on = function (name, func)
	{
		var self = this;

		if (!self._events.hasOwnProperty(name))
		{
			self._events[name] = new Array;
		}

		self._events[name].push(func);
		return true;
	};

	Event.prototype.trigger = function (name, args)
	{
		var self = this, result = [];

		if (!self._events.hasOwnProperty(name))
		{
			return false;
		}

		$.each(self._events[name], function (key) {
			if (!$.isFunction(this))
			{
				return;
			}

			if (typeof args === 'undefined')
			{
				console.trace(39, args);
				return;
			}

			result.push(this.call(self, args, key));
		});

		return ($.inArray(false, result) === -1);
	};

	Event.prototype.deleteEvent = function (name, key)
	{
		var self = this;

		if (self._events.hasOwnProperty(name))
		{
			self._events[name].splice(key, 1);
			return true;
		}

		return false;
	};

	window._event = new Event;

})(jQuery);