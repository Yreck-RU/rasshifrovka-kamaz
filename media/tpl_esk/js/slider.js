/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ESKSliderElement extends HTMLElement
{
	#_index = 0;
	#_total = 0;
	#_list;
	#_btn_prev;
	#_btn_next;

	connectedCallback()
	{
		this.#_list = this.querySelector(
			'div.track-list-inner'
		);

		const sliders = this.querySelectorAll(
			'div.list-slide-inner'
		);

		const length = sliders.length;
		this.#_total = (length - 1);

		const pagination = document.createElement('div');
		pagination.classList.add('slider-pagination-inner');
		this.appendChild(pagination);

		this.#_btn_prev = document.createElement('button');
		this.#_btn_prev.setAttribute('type', 'button');
		this.#_btn_prev.setAttribute('role', 'presentation');
		this.#_btn_prev.classList.add('pagination-button-inner');
		this.#_btn_prev.classList.add('button-prev-inner');
		pagination.appendChild(this.#_btn_prev);

		this.#_btn_prev.addEventListener(
			'click', _ => this.#_movePrev()
		);

		this.#_btn_next = document.createElement('button');
		this.#_btn_next.setAttribute('type', 'button');
		this.#_btn_next.setAttribute('role', 'presentation');
		this.#_btn_next.classList.add('pagination-button-inner');
		this.#_btn_next.classList.add('button-next-inner');
		pagination.appendChild(this.#_btn_next);

		this.#_btn_next.addEventListener(
			'click', _ => this.#_moveNext()
		);

		// setInterval(_ => this.#_moveNext(), 5000);
	}

	#_movePrev()
	{
		const prev = (this.#_index - 1);

		if (prev < 0)
		{
			this.#_list.style.transform = 'translateX(-' + this.#_total + '00%)';
			this.#_index = this.#_total;

			return;
		}

		this.#_list.style.transform = 'translateX(-' + prev + '00%)';
		this.#_index = prev;
	}

	#_moveNext()
	{
		const next = (this.#_index + 1);

		if (next > this.#_total)
		{
			this.#_index = 0;
			this.#_list.removeAttribute('style');

			return;
		}

		this.#_list.style.transform = 'translateX(-' + next + '00%)';
		this.#_index = next;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('esk-slider', ESKSliderElement);
});