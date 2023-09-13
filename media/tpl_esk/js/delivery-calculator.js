/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class DeliveryCalculatorElement extends HTMLElement
{
	#_config = config.get('delivery-calculator');
	#_request = new FetchRequest;
	#_script = document.createElement('script');
	#_distance;
	#_time;
	#_price;
	#_map;
	#_input_name;
	#_input_phone;
	#_button;
	#_loader;
	#_geolocation = new Object;
	#_disabled = [true, true];

	connectedCallback()
	{
		this.#_script.addEventListener('load', _ => {
			ymaps.ready(_ => this.#_yaMapLoader());
		});

		this.#_script.addEventListener('error', _ => {
			console.warn('Yandex Map JS API error!');
		});

		const link = new URL('https://api-maps.yandex.ru/2.1');
		link.searchParams.set('apikey', this.#_config.api_map_key);
		link.searchParams.set('lang', 'ru_RU');

		this.#_script.src = link.toString();
		document.body.appendChild(this.#_script);

		this.#_distance = this.querySelector(
			'span.item-value-inner.distance'
		);

		this.#_time = this.querySelector(
			'span.item-value-inner.time'
		);

		this.#_price = this.querySelector(
			'span.item-value-inner.price'
		);

		this.#_map = this.querySelector(
			'div.calculator-map-inner'
		);

		this.#_input_name = this.querySelector(
			'input#' + this.#_config.name_id
		);

		this.#_input_phone = this.querySelector(
			'phone-chosen#' + this.#_config.phone_id
		);

		this.#_button = this.querySelector(
			'button.form-button-inner'
		);

		this.#_button.addEventListener(
			'click', _ => this.#_submitForm()
		);

		this.#_loader = new Loader(this.#_button);

		this.#_input_name.addEventListener('keyup', _ => {
			this.#_disabled[0] = (this.#_input_name.value < 1);
			this.#_changeDisabled();
		});

		this.#_input_phone.addEventListener('change', _ => {
			this.#_disabled[1] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		this.#_input_phone.addEventListener('selected', _ => {
			this.#_disabled[1] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		this.#_request.addEventListener('complete', _ => {
			this.#_loader.stop();
		});

		this.#_request.addEventListener('success', (e) => {
			if (typeof ym === 'function')
			{
				ym(e.detail.data.ya_counter,
					'reachGoal', e.detail.data.ya_name
				);
			}

			if (typeof gtag === 'function')
			{
				gtag('event', e.detail.data.gtag_name, {
					event_category: e.detail.data.gtag_cat
				});
			}
		});

		this.#_validBtnText();
	}

	#_yaMapLoader()
	{
		const ymap = new ymaps.Map(this.#_map, {
			center: [55.740776, 52.406384],
			zoom: 9
		});

		let routePanelControl = new ymaps.control.RoutePanel({
			options: {
				title: this.#_config.title,
				showHeader: true,
				maxWidth: 300,
				autofocus: false
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

		if (this.#_config.route_start !== null)
		{
			routePanelControl.routePanel.state.set({
				from: this.#_config.route_start,
				type: 'masstransit',
				fromEnabled: false,
				toEnabled: true
			});
		}

		ymap.controls.add(routePanelControl);
		ymap.controls.add(zoomControl);

		routePanelControl.routePanel.getRouteAsync().then((route) => {
			route.model.setParams({ results: 1 }, true);

			route.model.events.add('requestsuccess', _ => {
				let activeRoute;

				if (activeRoute = route.getActiveRoute())
				{
					let distance = activeRoute.properties.get('distance'),
						duration = activeRoute.properties.get('duration'),
						value = (distance.value / 1000).toFixed(2);

					let intl = Intl.NumberFormat('ru-RU', {
						minimumFractionDigits: 2
					});

					this.#_distance.innerHTML = intl.format(value);
					this.#_time.innerHTML = duration.text;

					this.#_price.innerHTML = intl.format(
						value * this.#_config.price
					);

					var point = route.getWayPoints().get(1),
						request = point.properties.get('coordinates');

					this.#_geolocation = {
						address: point.properties.get('address'),
						latitude: Number(request[0]),
						longitude: Number(request[1]),
						name: point.properties.get('name'),
						distance: Number(value),
						duration: duration.text,
						price: Number((value * this.#_config.price).toFixed(2))
					};
				}
			});
		});
	}

	#_submitForm()
	{
		if (this.#_disabled.indexOf(true) !== -1)
		{
			this.#_validBtnText();

			this.#_button.classList.add('disabled');
			return;
		}

		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.delivery_calculator');
			data.append('recaptcha', token);
			data.append('name', this.#_input_name.value);
			data.append('phone', this.#_input_phone.toInt);

			const names = Object.keys(this.#_geolocation);

			for (const name of names)
			{
				const value = this.#_geolocation[name];
				data.append('geolocation[' + name + ']', value);
			}

			data.append('format', 'json');
			this.#_request.send(location.href, data);
		});
	}

	#_changeDisabled()
	{
		if (this.#_disabled.indexOf(true) === -1)
		{
			this.#_button.classList.remove('disabled');
			this.#_button.removeAttribute('title');
		}
		else
		{
			this.#_button.classList.add('disabled');
			this.#_validBtnText();
		}
	}

	#_validBtnText()
	{
		const validator = config.get('validator');

		if (this.#_disabled[0] === true)
		{
			this.#_button.setAttribute('title', validator.name);
		}
		else if (this.#_disabled[1] === true)
		{
			this.#_button.setAttribute('title', validator.phone);
		}
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('delivery-calculator', DeliveryCalculatorElement);
});