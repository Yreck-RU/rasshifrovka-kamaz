/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class SwitchCheckboxElement extends HTMLElement
{
	#_checked;
	#_label;
	#_active = false;

	constructor()
	{
		super();

		this.#_checked = document.createElement('div');
		this.#_checked.classList.add('checkbox-checked-inner');

		this.#_checked.addEventListener(
			'click', _ => this.#_toggleChecked()
		);

		this.#_label = document.createElement('div');
		this.#_label.classList.add('checkbox-label-inner');
	}

	connectedCallback()
	{
		this.appendChild(this.#_checked);
		this.appendChild(this.#_label);
	}

	set label(value)
	{
		this.#_label.innerHTML = value;
	}

	get checked()
	{
		return this.#_active === true;
	}

	#_toggleChecked()
	{
		if (this.#_active === true)
		{
			this.#_checked.classList.remove('active');
		}
		else
		{
			this.#_checked.classList.add('active');
		}

		this.dispatchEvent(new CustomEvent(
			'change', { detail: this.#_active }
		));

		this.#_active = !this.#_active;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('switch-checkbox', SwitchCheckboxElement);
});