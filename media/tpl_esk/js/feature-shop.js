/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class FeatureShopElement extends HTMLElement
{
	#_sorting;
	#_limit;

	#_views = this.querySelectorAll(
		'button.view-item-inner'
	);

	connectedCallback()
	{
		this.#_sorting = this.querySelector(
			'select-chosen.select-chosen-inner.sorting'
		);

		this.#_sorting.addEventListener(
			'change', (e) => this.#_changeSelect(e)
		);

		this.#_limit = this.querySelector(
			'select-chosen.select-chosen-inner.limit'
		);

		this.#_limit.addEventListener(
			'change', (e) => this.#_changeSelect(e)
		);

		this.#_views.forEach(
			(button) => this.#_prepareButton(button)
		);
	}

	#_prepareButton(button)
	{
		button.addEventListener('click', _ => {
			const request = new FetchRequest;
			const data = request.getFormData;

			data.append('option', 'com_shop');
			data.append('task', 'catalog.view');
			data.append('value', button.dataset.type);
			data.append('format', 'json');

			request.addEventListener(
				'success', _ => location.reload()
			);

			request.send(location.href, data);
		});
	}

	#_changeSelect(event)
	{
		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');

		const classList = event.target.classList;

		if (classList.contains('sorting'))
		{
			data.append('task', 'catalog.sorting');
		}
		else if (classList.contains('limit'))
		{
			data.append('task', 'catalog.limit');
		}

		data.append('value', event.detail.value);
		data.append('format', 'json');

		request.addEventListener(
			'success', _ => location.reload()
		);

		request.send(location.href, data);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('feature-shop', FeatureShopElement);
});