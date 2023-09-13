/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ProductNavtabElement extends HTMLElement
{
	#_element = document.createElement('div');
	#_parent = this.parentElement;
	#_height;
	#_offset;
	#_state = false;

	#_items = document.querySelectorAll(
		'button.tablist-button-inner'
	);

	connectedCallback()
	{
		this.#_height = (this.clientHeight / 16) + 'rem';
		this.#_offset = (this.offsetTop + 200);

		document.addEventListener('scroll', _ => {
			if (window.outerWidth < 768) return;

			if (pageYOffset > this.#_offset && !this.#_state)
			{
				this.#_element.style.height = this.#_height;
				this.#_parent.insertBefore(this.#_element, this);

				this.classList.add('fixed');
				setTimeout(_ => this.classList.add('in'), 150);
				this.#_state = true;
			}
			else if (pageYOffset < this.#_offset && this.#_state)
			{
				this.classList.remove('in');
				this.#_state = false;

				setTimeout(_ => {
					this.classList.remove('fixed');

					if (this.#_parent.contains(this.#_element))
					{
						this.#_parent.removeChild(this.#_element);
					}
				}, 150);
			}
		});

		this.#_items.forEach((item) => {
			item.addEventListener('click', _ => this.#_clickItem(item));
		});
	}

	#_clickItem(item)
	{
		this.#_items.forEach((item) => {
			item.classList.remove('active');
		});

		item.classList.add('active');

		if (!item.dataset.hasOwnProperty('id'))
		{
			return;
		}

		const section = document.querySelector(
			'#' + item.dataset.id
		);

		if (!(section instanceof HTMLElement))
		{
			return;
		}

		section.scrollIntoView({
			behavior: 'smooth', block: 'center'
		});
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-navtab', ProductNavtabElement);
	const items = document.querySelectorAll('.equipment-item-inner');

	items.forEach((item) => {
		const img = item.querySelector('.item-image-inner');
		if (!(img instanceof HTMLElement)) return;

		const title = item.querySelector('.item-title-inner');
		const desc = item.querySelector('.item-desc-inner');
		let is_mobile = (self.innerWidth < 768);
		let is_hover = false;

		const alert = new AlertModel;
		alert.title = title.innerHTML;

		window.addEventListener('scroll', _ => {
			offset_resize(img, desc);
		});

		window.addEventListener('resize', _ => {
			is_mobile = (self.innerWidth < 768);
			offset_resize(img, desc);
		});

		img.addEventListener('click', _ => {
			if (!is_mobile) return;

			alert.innerHTML = desc.innerHTML;
			alert.show();
		});

		img.addEventListener('mouseover', _ => {
			if (is_mobile) return;
			if (is_hover) return;

			desc.classList.add('active');
			offset_resize(img, desc);

			setTimeout(_ => {
				desc.classList.add('in');
				is_hover = true;
			}, 10);
		});

		img.addEventListener('mouseout', _ => {
			if (is_mobile) return;
			if (!is_hover) return;

			desc.classList.remove('in');

			setTimeout(_ => {
				desc.classList.remove('active');
				desc.removeAttribute('style');
				is_hover = false;
			}, 100);
		});

		const offset_resize = function (img, desc)
		{
			let top = (img.offsetTop + img.height + 12);
			desc.style.top = (top / 16) + 'rem';

			let left = (img.offsetLeft + 9);
			left -= (desc.offsetWidth / 2);

			left = (left / 16).toFixed(2);
			desc.style.left = left + 'rem';
		};
	});
});