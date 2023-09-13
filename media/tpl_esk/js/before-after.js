/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class BeforeAfterElement extends HTMLElement
{
	#_image = this.querySelector(
		'div.slider-image-inner'
	);

	#_toggle = document.createElement('div');
	#_active = false;

	connectedCallback()
	{
		this.#_toggle.classList.add('slider-toggle-inner');
		this.appendChild(this.#_toggle);

		this.#_toggle.addEventListener(
			'mousedown', _ => this.#_active = true
		);

		this.#_toggle.addEventListener(
			'mouseup', _ => this.#_active = false
		);

		this.#_toggle.addEventListener(
			'touchstart', _ => this.#_active = true
		);

		this.#_toggle.addEventListener(
			'touchend', _ => this.#_active = false
		);

		document.body.addEventListener(
			'mousemove', (e) => this.#_prepareMouse(e)
		);

		document.body.addEventListener(
			'touchmove-', (e) => this.#_prepareMouse(e)
		);
	}

	#_prepareMouse(event)
	{
		if (this.#_active === false) return;

		const rect = this.getBoundingClientRect();
		const offset = (event.pageX - rect.left);

		const width = (this.offsetWidth - 5);
		const min = Math.min(offset, width);
		const shift = (Math.max(0, min) / 16);

		this.#_image.style.width = shift + 'rem';
		this.#_toggle.style.left = shift + 'rem';

		event.stopPropagation();
		event.preventDefault();
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('before-after', BeforeAfterElement);
});