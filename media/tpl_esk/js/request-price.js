/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class RequestPriceElement extends HTMLElement
{
	#_config = config.get('request-price');
	#_model = new AlertModel;
	#_input_name;
	#_input_phone;
	#_input_email;
	#_input_comment;
	#_send_btn;
	#_loader;
	#_request = new FetchRequest;
	#_disabled = [true, true, true];

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

		this.#_input_name = document.createElement('input');
		this.#_input_name.setAttribute('type', 'text');
		this.#_input_name.setAttribute('placeholder', this.#_config.field_name_hint);
		this.#_input_name.classList.add('field-input-inner');
		field.appendChild(this.#_input_name);

		this.#_input_name.addEventListener('keyup', _ => {
			this.#_disabled[0] = (this.#_input_name.value < 1);
			this.#_changeDisabled();
		});

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

		this.#_input_phone.addEventListener('change', (e) => {
			this.#_disabled[1] = !e.target.valid;
			this.#_changeDisabled();
		});

		this.#_input_phone.addEventListener('selected', (e) => {
			this.#_disabled[1] = !e.target.valid;
			this.#_changeDisabled();
		});

		///////////////////////////////////////////////////////

		field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.innerHTML = this.#_config.field_email;
		field.appendChild(label);

		this.#_input_email = document.createElement('input');
		this.#_input_email.setAttribute('type', 'text');
		this.#_input_email.setAttribute('placeholder', this.#_config.field_email_hint);
		this.#_input_email.classList.add('field-input-inner');
		field.appendChild(this.#_input_email);

		///////////////////////////////////////////////////////

		field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_model.appendChild(field);

		label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.innerHTML = this.#_config.field_comment;
		field.appendChild(label);

		this.#_input_comment = document.createElement('textarea');
		this.#_input_comment.setAttribute('placeholder', this.#_config.field_comment_hint);
		this.#_input_comment.classList.add('field-input-inner');
		field.appendChild(this.#_input_comment);

		///////////////////////////////////////////////////////

		let _switch = document.createElement('switch-checkbox');
		_switch.classList.add('switch-checkbox-inner');
		_switch.label = config.get('policy-text');
		this.#_model.appendChild(_switch);

		_switch.addEventListener('change', (e) => {
			this.#_disabled[2] = e.detail;
			this.#_changeDisabled();
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

		this.#_model.title = this.#_config.model_title;
		this.addEventListener('click', _ => this.#_model.show());

		this.#_request.addEventListener('complete', _ => {
			this.#_loader.stop();
			this.#_model.hide();
		});
	}

	#_sendForm()
	{
		if (this.#_disabled.indexOf(true) !== -1)
		{
			this.#_send_btn.classList.add('disabled');
			return;
		}

		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.request_price');
			data.append('recaptcha', token);
			data.append('product_id', this.dataset.id);
			data.append('name', this.#_input_name.value);
			data.append('phone', this.#_input_phone.toInt);
			data.append('phone_id', this.#_input_phone.getId);
			data.append('email', this.#_input_email.value);
			data.append('comment', this.#_input_comment.value);		
			data.append('format', 'json');

			this.#_request.send(location.href, data);
		});
	}

	#_changeDisabled()
	{
		if (this.#_disabled.indexOf(true) === -1)
		{
			this.#_send_btn.classList.remove('disabled');
		}
		else
		{
			this.#_send_btn.classList.add('disabled');
		}
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('request-price', RequestPriceElement);
});