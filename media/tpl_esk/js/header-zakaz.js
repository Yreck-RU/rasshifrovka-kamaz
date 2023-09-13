/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class HeaderZakazElement extends HTMLElement
{
	#_config = config.get('header-zakaz');
	#_model = new AlertModel;
	#_input_name;
	#_input_phone;
	#_input_email;
	#_input_comment;
	#_send_btn;
	#_switch;
	#_loader;
	#_request = new FetchRequest;

	#_validator = new Validator({
		validatorClass: 'field-validate-inner'
	});

	connectedCallback()
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
			if (e.detail === true)
			{
				this.#_send_btn.classList.add('disabled');
			}
			else
			{
				this.#_send_btn.classList.remove('disabled');
			}
		});

		///////////////////////////////////////////////////////

		this.#_send_btn = document.createElement('button');
		this.#_send_btn.classList.add('body-button-inner');
		this.#_send_btn.classList.add('disabled');
		this.#_model.appendChild(this.#_send_btn);

		this.#_send_btn.addEventListener(
			'click', _ => this.#_sendForm()
		);

		const btn_text = document.createElement('span');
		btn_text.classList.add('button-text-inner');
		btn_text.innerHTML = this.#_config.send_btn;
		this.#_send_btn.appendChild(btn_text);

		this.#_loader = new Loader(this.#_send_btn);

		///////////////////////////////////////////////////////

		this.#_model.title = this.#_config.model_title;
		this.addEventListener('click', _ => this.#_model.show());

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

	#_sendForm()
	{
		if (this.#_switch.checked !== true)
		{
			this.#_send_btn.classList.add('disabled');
			return false;
		}

		let _data = {
			name: this.#_input_name.value,
			phone: this.#_input_phone,
			email: this.#_input_email.value,
			comment: this.#_input_comment.value
		};

		if (!this.#_validator.validate(_data))
		{
			return false;
		}

		_data = this.#_validator.getValidData();
		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.header_zakaz');
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
			this.#_request.send(location.href, data);
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('header-zakaz', HeaderZakazElement);
});