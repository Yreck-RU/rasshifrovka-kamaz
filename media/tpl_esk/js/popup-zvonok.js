/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class PopupZvonok extends Object
{
	#_config = config.get('popup-zvonok');
	#_time = parseInt(+new Date() / 1000);
	#_alert = new AlertModel;
	#_timerId;
	#_input_phone;
	#_btn_send;
	#_btn_close;
	#_send_loader;
	#_request = new FetchRequest;
	#_disabled = [true, true];

	run()
	{
		if (!this.#_config.enabled) return;

		this.#_request.addEventListener('complete', _ => {
			this.#_send_loader.stop();
			this.#_alert.hide();
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

		this.#_timerId = setInterval(
			_ => this.#_runInterval(), 1000
		);
	}

	#_runInterval()
	{
		const now_time = parseInt(+new Date() / 1000);
		const timeout = Number(this.#_config.timeout);

		if ((now_time - this.#_time) < timeout) return;
		clearInterval(this.#_timerId);

		if (this.#_config.hasOwnProperty('model_text'))
		{
			let text = document.createElement('div');
			text.classList.add('body-introtext-inner');
			text.innerHTML = this.#_config.model_text;
			text.style.color = '#353535';
			this.#_alert.appendChild(text);
		}

		///////////////////////////////////////////////////////

		const field = document.createElement('div');
		field.classList.add('body-field-inner');
		this.#_alert.appendChild(field);

		const label = document.createElement('label');
		label.classList.add('field-label-inner');
		label.classList.add('required');
		label.innerHTML = this.#_config.field_phone;
		field.appendChild(label);

		this.#_input_phone = document.createElement('phone-chosen');
		this.#_input_phone.classList.add('phone-chosen-inner');
		field.appendChild(this.#_input_phone);

		this.#_input_phone.addEventListener('change', _ => {
			this.#_disabled[0] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		this.#_input_phone.addEventListener('selected', _ => {
			this.#_disabled[0] = !this.#_input_phone.valid;
			this.#_changeDisabled();
		});

		///////////////////////////////////////////////////////

		let policy = document.createElement('switch-checkbox');
		policy.classList.add('switch-checkbox-inner');
		policy.label = config.get('policy-text');
		this.#_alert.appendChild(policy);

		policy.addEventListener('change', (e) => {
			this.#_disabled[1] = e.detail;
			this.#_changeDisabled();
		});

		///////////////////////////////////////////////////////

		this.#_btn_send = document.createElement('button');
		this.#_btn_send.setAttribute('type', 'button');
		this.#_btn_send.classList.add('body-button-inner');
		this.#_btn_send.classList.add('disabled');
		this.#_alert.appendChild(this.#_btn_send);

		this.#_btn_send.addEventListener(
			'click', _ => this.#_sendForm()
		);

		let btn_text = document.createElement('span');
		btn_text.classList.add('button-text-inner');
		btn_text.innerHTML = this.#_config.send_btn;
		this.#_btn_send.appendChild(btn_text);

		this.#_send_loader = new Loader(this.#_btn_send);

		///////////////////////////////////////////////////////

		this.#_btn_close = document.createElement('button');
		this.#_btn_close.setAttribute('type', 'button');
		this.#_btn_close.classList.add('body-notclose-inner');
		this.#_alert.appendChild(this.#_btn_close);

		this.#_btn_close.addEventListener(
			'click', _ => this.#_closeForm()
		);

		btn_text = document.createElement('span');
		btn_text.classList.add('close-text-inner');
		btn_text.innerHTML = this.#_config.btn_close;
		this.#_btn_close.appendChild(btn_text);

		///////////////////////////////////////////////////////

		this.#_alert.title = this.#_config.model_title;
		this.#_alert.header.style.gap = '0';

		const h_title = this.#_alert.header.querySelector(
			'div.header-title-inner'
		);

		h_title.style.width = '100%';
		h_title.style.textAlign = 'center';

		this.#_alert.show();
	}

	#_sendForm()
	{
		if (this.#_disabled.indexOf(true) !== -1)
		{
			this.#_btn_send.classList.add('disabled');
			return;
		}

		this.#_send_loader.start();
		const data = this.#_request.getFormData;

		data.append('option', 'com_shop');
		data.append('task', 'xhr.popup_zvonok');
		data.append('phone', this.#_input_phone.toInt);
		data.append('format', 'json');

		recaptcha.execute((token) => {
			data.append('recaptcha', token);
			this.#_request.send(location.href, data);
		});
	}

	#_closeForm()
	{
		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');
		data.append('task', 'xhr.popup_zvonok_close');
		data.append('format', 'json');

		request.addEventListener('success', _ => {
			this.#_alert.hide();
		});

		recaptcha.execute((token) => {
			data.append('recaptcha', token);
			request.send(location.href, data);
		});
	}

	#_changeDisabled()
	{
		if (this.#_disabled.indexOf(true) === -1)
		{
			this.#_btn_send.classList.remove('disabled');
		}
		else
		{
			this.#_btn_send.classList.add('disabled');
		}
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	(new PopupZvonok).run();
});