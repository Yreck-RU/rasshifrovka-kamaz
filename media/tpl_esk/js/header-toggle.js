/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class HeaderToggleElement extends HTMLElement
{
	#_menu = document.querySelector('div.top-menu-inner');
	#_header = document.querySelector('div.page-header-inner');
	#_close = document.querySelector('button.header-close-inner');
	#_backdrop = document.createElement('div');
	#_active = false;

	connectedCallback()
	{
		this.#_backdrop.classList.add('header-backdrop-inner');
		this.#_backdrop.addEventListener('click', _ => this.#_toggleMenuVisible());
		this.#_close.addEventListener('click', _ => this.#_toggleMenuVisible());

		this.addEventListener('click', this.#_toggleMenuVisible);
	}

	#_toggleMenuVisible()
	{
		if (this.#_active === true)
		{
			this.#_menu.classList.remove('active');
			this.#_backdrop.classList.remove('active');

			setTimeout(_ => {
				if (this.#_header.contains(this.#_backdrop)) this.#_header.removeChild(this.#_backdrop);
			}, 200);
		}
		else
		{
			if (!this.#_header.contains(this.#_backdrop)) this.#_header.appendChild(this.#_backdrop);

			setTimeout(_ => {
				this.#_backdrop.classList.add('active');
				this.#_menu.classList.add('active');
			}, 100);
		}

		this.#_active = !this.#_active;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('header-toggle', HeaderToggleElement);
});