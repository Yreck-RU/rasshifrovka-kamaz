(function ($) {
	'use strict';

	function DeliveryCalculator(element)
	{
		this.element = $(element);
		let self = this;

		let config = _config.get(element.id);
		$.extend(self, config);

		self.header = $('<div />', {
			class: 'calculator-header'
		});

		self.element.append(self.header);

		self.distance_block = $('<div />', {
			class: 'calculator-header-inner',
			html: self.language.distance
		});

		self.distance = $('<span />', {
			'data-after': self.language.kilometer_after,
			html: new Intl.NumberFormat('ru-RU', {
				minimumFractionDigits: 2
			}).format(0)
		});

		self.distance_block.append(self.distance);
		self.header.append(self.distance_block);

		self.travel_time_block = $('<div />', {
			class: 'calculator-header-inner',
			html: self.language.travel_time
		});

		self.travel_time = $('<span />', {
			html: '00:00'
		});

		self.travel_time_block.append(self.travel_time);
		self.header.append(self.travel_time_block);

		self.haul_cost_block = $('<div />', {
			class: 'calculator-header-inner',
			html: self.language.haul_cost
		});

		self.haul_cost = $('<span />', {
			'data-after': self.language.price_after,
			html: new Intl.NumberFormat('ru-RU', {
				minimumFractionDigits: 2
			}).format(0)
		});

		self.haul_cost_block.append(self.haul_cost);
		self.header.append(self.haul_cost_block);

		self.ymap_block = $('<div />', {
			class: 'calculator-map-block',
			id: 'map'
		});

		self.element.append(self.ymap_block);

		self.script = $('#' + self.script_id);
		let script_src = self.script.data('src');

		self.script.attr('src', script_src);
		self.script.removeAttr('data-src');

		self.script.on('load', function () {
			self.ymap_block.addClass('loader');

			ymaps.ready(function () { self.init_map(); });
		});

		self.script.on('error', function () {
			self.ymap_block.addClass('alert alert-error');

			self.ymap_block.html($('<h4 />', {
				html: self.language.ymap_error_title
			}));

			self.ymap_block.append($('<span />', {
				html: self.language.ymap_error_desc
			}));
		});

		self.haul_wrapper = $('<form />', {
			class: 'calculator-haul-wrapper'
		});

		self.element.append(self.haul_wrapper);

		self.haul_input = $('<input />', {
			type: 'text', name: 'phone',
			placeholder: '+_ (___) ___-__-__'
		});

		self.haul_wrapper.append(self.haul_input);

		self.haul_input.inputmasks({
			inputmask: {
				definitions: {
					'#': {
						validator: '[0-9]',
						cardinality: 1
					},
					showMaskOnHover: true,
					autoUnmask: true
				}
			},
			replace: '#',
			listKey: 'mask',
			match: /[0-9]/,
			list: window._config.get('formates')
		});

		self.btn_send = $('<button />', {
			type: 'button',
			html: self.language.btn_send
		});

		self.btn_send.on('click', function () {
			self.haul_send();
		});

		self.loader = new $.fn.Loader(
			self.btn_send.get(0), 'haul-theme'
		);

		self.haul_wrapper.append(self.btn_send);

		self.element.append($('<div />', {
			class: 'form-personal-data',
			html: self.language.personal_data
		}));

		self.validate = self.haul_wrapper.validate({
			errorClass: 'validate-error',
			errorPlacement: function () { },
			rules: {
				phone: {
					required: true
				}
			},
			submitHandler: function () {
				return false;
			}
		});
	};

	DeliveryCalculator.prototype.init_map = function ()
	{
		let self = this;

		self.ymap = new ymaps.Map('map', {
			center: [55.740776, 52.406384],
			zoom: 9
		});

		let routePanelControl = new ymaps.control.RoutePanel({
			options: {
				title: self.language.title,
				showHeader: true,
				maxWidth: 300
			}
		});

		let zoomControl = new ymaps.control.ZoomControl({
			options: {
				size: 'small',
				float: 'none',
				position: {
					bottom: 145,
					right: 10
				}
			}
		});

		routePanelControl.routePanel.options.set({
			allowSwitch: false,
			reverseGeocoding: true,
			types: { auto: true }
		});

		if (self.hasOwnProperty('route_start'))
		{
			routePanelControl.routePanel.state.set({
				from: self.route_start,
				type: 'masstransit',
				fromEnabled: false,
				toEnabled: true
			});
		}

		self.ymap.controls.add(routePanelControl);
		self.ymap.controls.add(zoomControl);

		routePanelControl.routePanel.getRouteAsync().then(function (route) {
			route.model.setParams({ results: 1 }, true);

			route.model.events.add('requestsuccess', function () {
				let activeRoute;

				if (activeRoute = route.getActiveRoute())
				{
					let distance = activeRoute.properties.get('distance'),
						duration = activeRoute.properties.get('duration'),
						value = (distance.value / 1000).toFixed(2);

					self.distance.html(new Intl.NumberFormat('ru-RU', {
						minimumFractionDigits: 2
					}).format(value));

					self.travel_time.html(duration.text);

					self.haul_cost.html(new Intl.NumberFormat('ru-RU', {
						minimumFractionDigits: 2
					}).format(value * self.price));

					var point = route.getWayPoints().get(1),
						request = point.properties.get('coordinates');

					self.geolocation = {
						address: point.properties.get('address'),
						latitude: request[0],
						longitude: request[1],
						name: point.properties.get('name'),
						distance: value,
						duration: duration.text,
						price: (value * self.price).toFixed(2)
					};
				}
			});
		});

		self.ymap_block.removeClass('loader');
		self.ymap.container.fitToViewport();
	};

	DeliveryCalculator.prototype.haul_send = function ()
	{
		let self = this;

		self.haul_wrapper.attr('onsubmit', 'return false;');

		if (self.haul_wrapper.valid() === false)
		{
			return;
		}

		self.loader.start();

		window.captcha.trigger(function (token) {
			var phone = self.haul_input.val(),
				phone = phone.replace(/[^0-9]/g, ''),
				data = {
					'g-recaptcha-response': token,
					phone: Number(phone),
					task: 'ajax.delivery_calculator',
					format: 'json'
				};

			if (self.hasOwnProperty('geolocation'))
			{
				data.geolocation = self.geolocation;
			}

			$.ajax({
				data: data,
				method: 'POST',
				dataType: 'json',
				success: function (result) {
					if (result.success !== true)
					{
						alert(result.message);
						console.error(result.message);

						return;
					}

					self.haul_wrapper.replaceWith($('<div />', {
						class: 'success-text',
						html: result.message
					}));

					if (typeof ym !== 'undefined')
					{
						ym(38120235, 'reachGoal', 'dostavka')
					}

					if (typeof gtag !== 'undefined')
					{
						gtag('event', 'dostavka', { 'event_category': 'glavnaya' });
					}
				},
				complete: function () {
					self.loader.stop();
				}
			});
		});
	};

	$.fn.deliverycalculator = function ()
	{
		this.each(function () {
			let data = new DeliveryCalculator(this);
			$(this).data('calculator', data);
		});
	};

})(jQuery);