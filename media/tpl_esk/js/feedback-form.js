/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class FeedbackFormElement extends HTMLElement
{
	#_config = config.get('feedback-form');

	#_input_name;
	#_input_phone;
	#_input_email;
	#_input_comment;

	#_switch;
	#_send_btn;
	#_loader;
	#_request = new FetchRequest;

	#_validator = new Validator({
		validatorClass: 'group-validate-inner'
	});

	connectedCallback()
	{
		this.#_switch = this.querySelector('switch-checkbox');
		this.#_switch.label = config.get('policy-text');

		this.#_switch.addEventListener('change', (e) => {
			if (e.detail === true) {
				this.#_send_btn.classList.add('disabled');
			}
			else {
				this.#_send_btn.classList.remove('disabled');
			}
		});

		this.#_input_name = this.querySelector(
			'input#' + this.#_config.input_name
		);

		this.#_input_phone = this.querySelector('phone-chosen');

		this.#_input_email = this.querySelector(
			'input#' + this.#_config.input_email
		);

		this.#_input_comment = this.querySelector(
			'textarea#' + this.#_config.input_comment
		);

		this.#_send_btn = this.querySelector(
			'button.footer-button-inner'
		);

		this.#_send_btn.addEventListener(
			'click', _ => this.#_submitForm()
		);

		this.#_loader = new Loader(this.#_send_btn);

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

	#_submitForm()
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

			data.append('task', 'xhr.feedback_form');
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
	customElements.define('feedback-form', FeedbackFormElement);
});