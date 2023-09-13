/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class RabotaFormElement extends HTMLElement
{
	#_config = config.get('rabota-form');

	#_input_name;
	#_input_phone;
	#_input_email;
	#_input_message;
	#_input_file;

	#_checkbox;
	#_button;
	#_loader;
	#_disabled = [true, true, true];
	#_request = new FetchRequest;

	connectedCallback()
	{
		this.#_checkbox = this.querySelector('switch-checkbox');
		this.#_checkbox.label = config.get('policy-text');

		this.#_checkbox.addEventListener('change', (e) => {
			this.#_disabled[2] = e.detail;
			this.#_changeDisabled();
		});

		this.#_input_name = this.querySelector(
			'input#' + this.#_config.input_name
		);

		this.#_input_name.addEventListener('keyup', _ => {
			this.#_disabled[0] = (this.#_input_name.value < 1);
			this.#_changeDisabled();
		});

		this.#_input_phone = this.querySelector('phone-chosen');

		this.#_input_phone.addEventListener('change', _ => {
			this.#_disabled[1] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		this.#_input_phone.addEventListener('selected', _ => {
			this.#_disabled[1] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		this.#_input_email = this.querySelector(
			'input#' + this.#_config.input_email
		);

		this.#_input_message = this.querySelector(
			'textarea#' + this.#_config.input_message
		);

		this.#_input_file = this.querySelector('file-chosen');

		this.#_button = this.querySelector(
			'button.footer-button-inner'
		);

		this.#_button.addEventListener(
			'click', _ => this.#_submitForm()
		);

		this.#_loader = new Loader(this.#_button);

		this.#_request.addEventListener('complete', _ => {
			this.#_loader.stop();
		});
	}

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

		//this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.rabota_form');
			data.append('recaptcha', token);
			data.append('name', this.#_input_name.value);
			data.append('email', this.#_input_email.value);
			data.append('comment', this.#_input_message.value);
			data.append('phone', this.#_input_phone.toInt);

			if (this.#_input_file.valid)
			{
				data.append('file', this.#_input_file.file);
			}

			data.append('format', 'json');
			this.#_request.send(location.href, data);
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('rabota-form', RabotaFormElement);
});