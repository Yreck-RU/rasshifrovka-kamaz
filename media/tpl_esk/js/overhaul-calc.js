/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class OverhaulCalcElement extends HTMLElement
{
	#_config = config.get(this.id);
	#_request = new FetchRequest;
	#_disabled = [true, true];

	#_fields = this.querySelectorAll('select');

	#_field_name = this.querySelector(
		'#' + this.#_config.field_name
	);

	#_field_phone = this.querySelector(
		'#' + this.#_config.field_phone
	);

	#_deadline = this.querySelector(
		'#' + this.#_config.deadline_id
	);

	#_price = this.querySelector(
		'#' + this.#_config.price_id
	);

	#_button = this.querySelector(
		'#' + this.#_config.button_id
	);

	#_loader = new Loader(this.#_button);

	connectedCallback()
	{
		this.#_fields.forEach((select) => {
			jQuery(select).select2({
				minimumResultsForSearch: Infinity,
				placeholder: this.#_config.select_hint
			});

			jQuery(select).on(
				'change', (e) => this.#_chageSelect(e)
			);
		});

		this.#_field_name.addEventListener('keyup', _ => {
			this.#_disabled[0] = (this.#_field_name.value < 1);
			this.#_changeDisabled();
		});

		this.#_field_phone.addEventListener('change', _ => {
			this.#_disabled[1] = !this.#_field_phone.valid;
			this.#_changeDisabled();
		});

		this.#_field_phone.addEventListener('selected', _ => {
			this.#_disabled[1] = !this.#_field_phone.valid;
			this.#_changeDisabled();
		});

		this.#_button.addEventListener(
			'click', _ => this.#_submitForm()
		);

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
	}

	#_chageSelect(event)
	{
		let values = new Collection;

		this.#_fields.forEach((select) => {
			const options = select.selectedOptions;

			for (const option of options)
			{
				values.append(option);
			}
		});

		let deadline = values.map(
			(item) => Number(item.dataset.deadline)
		);

		deadline = deadline.array.reduce(
			(sum, a) => sum + a, 0
		);

		var intl = new Intl.NumberFormat('ru-RU');
		this.#_deadline.innerHTML = intl.format(deadline);
		this.#_deadline.dataset.after = this.#_declOfNum(deadline);

		let price = values.map(
			(item) => Number(item.dataset.price)
		);

		price = price.array.reduce(
			(sum, a) => sum + a, 0
		);

		var intl = new Intl.NumberFormat('ru-RU');
		this.#_price.innerHTML = intl.format(price);
	}

	#_declOfNum = function (n)
	{  
		n = Math.abs(n) % 100; 
		var n1 = n % 10;

		if (n > 10 && n < 20)
		{
			return this.#_config.day[2];
		}

		if (n1 > 1 && n1 < 5)
		{
			return this.#_config.day[1];
		}

		if (n1 == 1)
		{
			return this.#_config.day[0];
		}

		return this.#_config.day[2];
	};

	#_changeDisabled()
	{
		if (this.#_disabled.indexOf(true) === -1)
		{
			this.#_button.classList.remove('disabled');
		}
		else
		{
			this.#_button.classList.add('disabled');
		}
	}

	#_submitForm()
	{
		if (this.#_disabled.indexOf(true) !== -1)
		{
			this.#_button.classList.add('disabled');
			return;
		}

		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.overhaul_calc');
			data.append('recaptcha', token);
			data.append('calc_id', Number(this.dataset.id));
			data.append('name', this.#_field_name.value);
			data.append('phone', this.#_field_phone.toInt);
			data.append('format', 'json');

			this.#_fields.forEach((select) => {
				const id = Number(select.dataset.id);
				const options = select.selectedOptions;

				for (const option of options)
				{
					if (!Number(option.value))
					{
						return;
					}

					data.append('calcoptions[' + id + '][]', option.value);
				}
			});

			this.#_request.send(location.href, data);
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('overhaul-calc', OverhaulCalcElement);
});