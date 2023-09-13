class GoogleReCAPTCHA extends EventTarget
{
	#_config = config.get('captcha');
	#_script;
	#_url;
	#_alert = new AlertModel;

	constructor()
	{
		super();

		this.#_url = new URL('https://www.google.com');
		this.#_url.pathname = '/recaptcha/api.js';
		this.#_url.searchParams.set('render', this.#_config.key);

		this.#_script = document.createElement('script');
		this.#_script.src = this.#_url.toString();

		this.#_script.addEventListener('error', _ => {
			this.#_alert.title = this.#_config.title;
			this.#_alert.innerHTML = this.#_config.message;
			this.#_alert.show();

			console.error(this.#_config.message);

			const event = new CustomEvent('error');
			this.dispatchEvent(event);
		});
	}

	execute(func)
	{
		if (!self.hasOwnProperty('grecaptcha'))
		{
			this.#_loadScript(func);
		}
		else
		{
			grecaptcha.ready(_ => {
				grecaptcha.execute(this.#_config.key).then(func)
			});
		}
	}

	#_loadScript(func)
	{
		this.#_script.addEventListener('load', _ => {
			grecaptcha.ready(_ => {
				grecaptcha.execute(this.#_config.key).then(func)
			});
		});

		document.body.appendChild(this.#_script);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	window.recaptcha = new GoogleReCAPTCHA;
});