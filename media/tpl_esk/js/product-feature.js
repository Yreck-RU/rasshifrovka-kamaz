/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ProductFeatureElement extends HTMLElement
{
	#_mlink = document.querySelector(
		'a.main-link-inner.feature'
	);

	#_slink = document.querySelector(
		'a.sidebar-link-inner.feature'
	);

	#_span = this.querySelector(
		'span.action-text-inner'
	);

	#_id = 0;
	#_active = false;
	#_request = new FetchRequest;
	#_result = new FeatureResult;

	connectedCallback()
	{
		this.#_id = Number(this.dataset.id);
		this.removeAttribute('data-id');

		this.#_active = this.classList.contains('active');
		this.addEventListener('click', _ => this.#_send());

		this.#_request.addEventListener(
			'success', (e) => this.#_prepareResult(e.detail)
		);
	}

	#_send()
	{
		recaptcha.execute((token) => {
			const data = this.#_request.getFormData;

			data.append('task', 'xhr.product_feature');
			data.append('recaptcha', token);
			data.append('product_id', this.#_id);	
			data.append('format', 'json');

			this.#_request.send(location.href, data);
		});
	}

	#_prepareResult(result)
	{
		if (result.hasOwnProperty('total'))
		{
			this.#_mlink.classList.add('active');
			this.#_slink.dataset.total = result.total;
		}
		else
		{
			this.#_mlink.classList.remove('active');
			this.#_slink.removeAttribute('data-total');
		}

		if (this.#_active === true)
		{
			this.classList.remove('active');
		}
		else
		{
			this.classList.add('active');
		}

		this.#_active = !this.#_active;

		this.setAttribute('title', result.label);
		this.ariaLabel = result.label;
		this.#_span.innerHTML = result.label;

		const parent = this.parentElement.parentElement;
		this.#_result.show(result, parent);
	}
}

class FeatureResult
{
	#_element;
	#_message;
	#_link;
	#_btn_close;
	#_active = false;

	constructor()
	{
		document.addEventListener('click', (e) => {
			if (this.#_active === false) return;
			if (!this.#_element.contains(e.target)) this.hide();
		});

		this.#_element = document.createElement('div');
		this.#_element.classList.add('item-request-inner');

		this.#_message = document.createElement('div');
		this.#_message.classList.add('request-message-inner');
		this.#_element.appendChild(this.#_message);

		this.#_link = document.createElement('a');
		this.#_link.classList.add('request-link-inner');
		this.#_element.appendChild(this.#_link);

		this.#_btn_close = document.createElement('button');
		this.#_btn_close.setAttribute('type', 'button');
		this.#_btn_close.classList.add('request-close-inner');

		this.#_btn_close.addEventListener(
			'click', _ => this.hide()
		);

		this.#_element.appendChild(this.#_btn_close);
	}

	show(detail, content)
	{
		this.#_message.innerHTML = detail.data;
		this.#_link.setAttribute('href', detail.link);
		this.#_link.innerHTML = detail.title;

		if (!content.contains(this.#_element))
		{
			content.appendChild(this.#_element);
			this.#_active = true;

			setTimeout(_ => {
				this.#_element.classList.add('in');
			}, 100);
		}
	}

	hide()
	{
		const parent = this.#_element.parentElement;
		if (parent === null) return;

		this.#_element.classList.remove('in');
		this.#_active = false;

		setTimeout(_ => {
			parent.removeChild(this.#_element);
		}, 100);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-feature', ProductFeatureElement);
});