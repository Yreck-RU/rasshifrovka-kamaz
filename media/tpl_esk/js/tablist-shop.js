/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class TablistShopElement extends HTMLElement
{
	#_tablist = this.querySelectorAll(
		'button[type="button"][role="tab"]'
	);

	#_tabs = new Set;

	connectedCallback()
	{
		for (const button of this.#_tablist)
		{
			const tabpanel = this.querySelector(
				'div#' + button.dataset.tabid
			);

			this.#_tabs.add(new TablistItem(
				button, tabpanel, _ => {
					this.#_tabs.forEach((i) => i.active = i.has(button));
				}
			));
		}
	}
}

class TablistItem
{
	#_element;
	#_tabpanel;
	#_active = false;

	constructor(element, tabpanel, toggle)
	{
		this.#_element = element;
		this.#_tabpanel = tabpanel;

		element.addEventListener(
			'click', _ => toggle.apply(this, [this])
		);
	}

	set active(value)
	{
		if (value)
		{
			this.#_element.ariaSelected = 'true';
			this.#_tabpanel.ariaHidden = 'false';

			setTimeout(_ => {
				this.#_tabpanel.classList.add('in');
			}, 50);
		}
		else
		{
			this.#_element.ariaSelected = 'false';
			this.#_tabpanel.classList.remove('in');

			setTimeout(_ => {
				this.#_tabpanel.ariaHidden = 'true';
			}, 50);
		}

		this.#_active = value;
	}

	get active()
	{
		return this.#_active
	}

	has(value)
	{
		return (this.#_element === value);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('tablist-shop', TablistShopElement);
});