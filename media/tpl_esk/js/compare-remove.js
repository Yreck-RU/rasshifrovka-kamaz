/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class CompareRemoveElement extends HTMLElement
{
	#_loader = new Loader(this);

	connectedCallback()
	{
		const id = Number(this.dataset.id);
		this.removeAttribute('data-id');

		this.addEventListener('click', _ => this.#_click(id));
	}

	#_click(product_id)
	{
		this.#_loader.start();

		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('task', 'xhr.compare_remove');
		data.append('value', product_id);
		data.append('format', 'json');

		request.addEventListener(
			'success', _ => location.reload()
		);

		recaptcha.execute((token) => {
			data.append('recaptcha', token);
			request.send(location.href, data);
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('compare-remove', CompareRemoveElement);
});