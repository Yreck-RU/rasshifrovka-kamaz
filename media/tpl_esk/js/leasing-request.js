/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class LeasingRequest
{
	// настройки плагина
	#_config = config.get('leasing-request');

	// модальное окно оформления заявки
	#_model = new AlertModel({
		title: this.#_config.model_title
	});

	#_validator = new Validator({
		validatorClass: 'field-validate-inner'
	});

	#_switch;

	// выбранная предустановка
	#_selected;

	// колекция доп. услуг
	#_services;

	#_input_name;
	#_input_phone;
	#_input_email;
	#_input_comment;
	#_send_btn;
	#_loader;
	#_request = new FetchRequest;

	constructor()
	{
		let field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		let label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.classList.add('required');
		label.innerHTML = this.#_config.field_name;
		field.appendChild(label);

		let control = document.createElement('div');
		control.classList.add('field-control-inner');
		field.appendChild(control);

		this.#_input_name = document.createElement('input');
		this.#_input_name.setAttribute('type', 'text');
		this.#_input_name.setAttribute('placeholder', this.#_config.field_name_hint);
		this.#_input_name.classList.add('control-input-inner');
		control.appendChild(this.#_input_name);

		///////////////////////////////////////////////////////

		field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.classList.add('required');
		label.innerHTML = this.#_config.field_phone;
		field.appendChild(label);

		this.#_input_phone = document.createElement('phone-chosen');
		this.#_input_phone.classList.add('phone-chosen-inner');
		field.appendChild(this.#_input_phone);

		///////////////////////////////////////////////////////

		field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.innerHTML = this.#_config.field_email;
		field.appendChild(label);

		control = document.createElement('div');
		control.classList.add('field-control-inner');
		field.appendChild(control);

		this.#_input_email = document.createElement('input');
		this.#_input_email.setAttribute('type', 'text');
		this.#_input_email.setAttribute('placeholder', this.#_config.field_email_hint);
		this.#_input_email.classList.add('control-input-inner');
		control.appendChild(this.#_input_email);

		///////////////////////////////////////////////////////

		field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.innerHTML = this.#_config.field_comment;
		field.appendChild(label);

		control = document.createElement('div');
		control.classList.add('field-control-inner');
		field.appendChild(control);

		this.#_input_comment = document.createElement('textarea');
		this.#_input_comment.setAttribute('placeholder', this.#_config.field_comment_hint);
		this.#_input_comment.classList.add('control-input-inner');
		control.appendChild(this.#_input_comment);

		///////////////////////////////////////////////////////

		this.#_switch = document.createElement('switch-checkbox');
		this.#_switch.classList.add('switch-checkbox-inner');
		this.#_switch.label = config.get('policy-text');
		this.#_model.appendChild(this.#_switch);

		this.#_switch.addEventListener('change', (e) => {
			if (e.detail === true) {
				this.#_send_btn.classList.add('disabled');
			}
			else {
				this.#_send_btn.classList.remove('disabled');
			}
		});

		///////////////////////////////////////////////////////

		this.#_send_btn = document.createElement('button');
		this.#_send_btn.classList.add('body-button-inner');
		this.#_send_btn.classList.add('disabled');
		this.#_model.appendChild(this.#_send_btn);

		this.#_send_btn.addEventListener('click', _ => this.#_sendForm());

		const btn_text = document.createElement('span');
		btn_text.classList.add('button-text-inner');
		btn_text.innerHTML = this.#_config.send_btn;
		this.#_send_btn.appendChild(btn_text);

		this.#_loader = new Loader(this.#_send_btn);

		///////////////////////////////////////////////////////

		this.#_request.addEventListener('complete', _ => {
			this.#_loader.stop();
			this.#_model.hide();
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

		let v_field = this.#_validator.addField(
			'name', this.#_input_name.parentElement
		);

		v_field.addRule('required');

		v_field = this.#_validator.addField(
			'phone', this.#_input_phone
		);

		v_field.addRule('phone');

		v_field = this.#_validator.addField(
			'email', this.#_input_email
		);

		v_field = this.#_validator.addField(
			'comment', this.#_input_comment
		);
	}

	show(selected, services)
	{
		this.#_selected = selected;
		this.#_services = services;

		this.#_model.show();
	}

	#_sendForm()
	{
		if (this.#_switch.checked !== true) {
			this.#_send_btn.classList.add('disabled');
			return false;
		}

		let _data = {
			name: this.#_input_name.value,
			phone: this.#_input_phone,
			email: this.#_input_email.value,
			comment: this.#_input_comment.value
		};

		if (!this.#_validator.validate(_data)) {
			return false;
		}

		_data = this.#_validator.getValidData();
		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.leasing_request');
			data.append('recaptcha', token);
			data.append('name', _data.name);
			data.append('phone', _data.phone.toInt);

			if (_data.email.length > 0)
			{
				data.append('email', _data.email);
			}

			if (_data.comment.length > 0)
			{
				data.append('comment', _data.comment);
			}

			data.append('format', 'json');

			// Размер авансового платежа (руб.)
			data.append('ivalue', this.#_selected.getInitialPay(
				Number(this.#_config.price)
			));

			// Размер авансового платежа (%)
			data.append('ipercent', this.#_selected.initialpay);

			// Строк действия лизинга
			data.append('term', this.#_selected.term);

			// Последний платеж (выкупной) (руб.)
			data.append('lvalue', this.#_selected.getLastPay(
				Number(this.#_config.price)
			));

			// Последний платеж (выкупной) (%)
			data.append('lpercent', this.#_selected.lastpay);

			// Ставка НДС (%)
			data.append('ratevat', this.#_selected.ratevat);

			// Ставка налога на прибыль (%)
			data.append('ratetax', this.#_selected.ratetax);

			//////////////////////////////////////////////////////////////////

			// Ежемесячный платеж
			data.append('monthpay', this.#_selected.getMonthlyPay(
				Number(this.#_config.price)
			).toFixed(0));

			// Сумма договора
			data.append('sumtreaty', this.#_selected.getAmountContract(
				Number(this.#_config.price)
			).toFixed(0));

			// Полная сумма удорожания
			data.append('sumrise', this.#_selected.getAmountAppreciation(
				Number(this.#_config.price)
			).toFixed(0));

			// Годовая сумма удорожания
			data.append('ysumrise', this.#_selected.getYearSumAppreciation(
				Number(this.#_config.price)
			).toFixed(0));

			// Годовое удорожание
			data.append('yrise', this.#_selected.getYearAppreciation(
				Number(this.#_config.price)
			).toFixed(2));

			// Экономия по налогам всего
			data.append('savingtax', this.#_selected.getTaxSaving(
				Number(this.#_config.price)
			).toFixed(0));

			// пересчет "Возврат НДС"
			data.append('vatrefund', this.#_selected.getVatRefund(
				Number(this.#_config.price)
			).toFixed(0));

			// пересчет "Снижение налога на прибыль"
			data.append('incometax', this.#_selected.getTaxCut(
				Number(this.#_config.price)
			).toFixed(0));

			const items = Array.from(this.#_services).filter(
				(item) => item.active === true
			);

			for (const item of items)
			{
				data.append('service[]', item.title);
			}

			this.#_request.send(location.href, data);
		});
	}
}