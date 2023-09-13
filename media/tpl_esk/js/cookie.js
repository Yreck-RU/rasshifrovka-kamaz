/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

document.addEventListener('DOMContentLoaded', _ => {
	const settings = config.get('accept-cookie');
	const is_cookie = localStorage.getItem('accept_cookie');

	if (settings.enabled === true && !Number(is_cookie))
	{
		const element = document.createElement('div');
		element.classList.add('page-cookie-inner');
		document.body.appendChild(element);

		const container = document.createElement('div');
		container.classList.add('container');
		element.appendChild(container);

		const message = document.createElement('div');
		message.classList.add('cookie-message-inner');
		container.appendChild(message);

		const text = document.createElement('div');
		text.classList.add('message-text-inner');
		text.innerHTML = settings.text;
		message.appendChild(text);

		const button = document.createElement('button');
		button.setAttribute('type', button);
		button.classList.add('message-button-inner');
		button.innerHTML = settings.btn_text;
		message.appendChild(button);

		button.addEventListener('click', _ => {
			localStorage.setItem('accept_cookie', 1);
			element.classList.remove('open');

			setTimeout(_ => document.body.removeChild(element), 2000);
		});

		setTimeout(_ => element.classList.add('open'), 2000);
	}
});