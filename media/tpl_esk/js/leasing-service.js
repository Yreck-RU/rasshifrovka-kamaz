/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class LeasingService
{
	// кнопка переключения предустановки
	#_element;

	// элемент выделения
	#_checked;

	// заголовок услуги
	#_title;

	// определяет состояние выбранного
	#_active = false;

	constructor(element)
	{
		this.#_element = element;

		this.#_checked = element.querySelector(
			'div.item-checked-inner'
		);

		this.#_title = element.dataset.title;
		element.removeAttribute('data-title');

		element.addEventListener(
			'click', _ => this.#_toggleService()
		);
	}

	get title()
	{
		return this.#_title;
	}

	get active()
	{
		return this.#_active;
	}

	#_toggleService()
	{
		if (this.#_active === true)
		{
			this.#_checked.classList.remove('active');
		}
		else
		{
			this.#_checked.classList.add('active');
		}

		this.#_active = !this.#_active;
	}
}