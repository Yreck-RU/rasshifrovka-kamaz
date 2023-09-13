class FeedbackZvonokElement extends HTMLElement
{
	#_chosen;
	#_button;
	#_loader;
	#_disabled = true;
	#_request = new FetchRequest;

	connectedCallback()
	{
		this.#_chosen = this.querySelector('phone-chosen');

		this.#_chosen.addEventListener(
			'change', _ => this.#_changePhone()
		);

		this.#_chosen.addEventListener(
			'selected', _ => this.#_changePhone()
		);

		this.#_button = this.querySelector(
			'button.form-button-inner'
		);

		this.#_button.addEventListener(
			'click', _ => this.#_submitForm()
		);

		this.#_loader = new Loader(this.#_button);

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

	#_changePhone()
	{
		this.#_disabled = !this.#_chosen.valid;

		if (this.#_disabled === true)
		{
			this.#_button.classList.add('disabled');
		}
		else
		{
			this.#_button.classList.remove('disabled');
		}
	}

	#_submitForm()
	{
		if (this.#_disabled === true)
		{
			this.#_button.classList.add('disabled');
			return;
		}

		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('option', 'com_shop');
			data.append('task', 'xhr.feedback_zvonok');
			data.append('recaptcha', token);
			data.append('phone', this.#_chosen.toInt);
			data.append('format', 'json');

			this.#_request.send(location.href, data);
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('feedback-zvonok', FeedbackZvonokElement);
});