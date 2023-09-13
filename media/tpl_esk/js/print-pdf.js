/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class PrintPdfElement extends HTMLElement
{
	#_loader;
	#_iframe;
	#_request = new FetchRequest;

	connectedCallback()
	{
		if (!this.dataset.hasOwnProperty('id'))
		{
			throw new Error('Attribute "data-id" not found!');
		}

		if (!this.dataset.hasOwnProperty('type'))
		{
			throw new Error('Attribute "data-type" not found!');
		}

		this.#_loader = new Loader(this);

		this.#_request.addEventListener(
			'complete', _ => this.#_loader.stop()
		);

		this.#_request.addEventListener(
			'success', (e) => this.#_prepareResponse(e)
		);

		this.addEventListener(
			'click', _ => this.#_sendRequest()
		);
	}

	#_sendRequest()
	{
		this.#_loader.start();

		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.print_pdf');
			data.append('recaptcha', token);
			data.append('type', this.dataset.type);
			data.append('id', this.dataset.id);
			data.append('format', 'json');

			this.#_request.send(location.href, data);
		});
	}

	#_prepareResponse(event)
	{
		const content = atob(event.detail.data);
		const byte = new Array(content.length);

		for (let i = 0; i < content.length; i++)
		{
			byte[i] = content.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byte);

		let localPdf = new Blob(
			[byteArray], { type: 'application/pdf' }
		);

		this.#_iframe = document.createElement('iframe');
		this.#_iframe.src = URL.createObjectURL(localPdf);
		this.#_iframe.style.display = 'none';

		document.body.appendChild(this.#_iframe);

		this.#_iframe.addEventListener('load', _ => {
			this.#_iframe.contentWindow.print();
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('print-pdf', PrintPdfElement);
});