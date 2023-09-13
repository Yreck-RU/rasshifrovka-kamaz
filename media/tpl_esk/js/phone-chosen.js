/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class PhoneChosenElement extends HTMLElement
{
	#_formats = config.get('phone-format');

	#_button;
	#_image;
	#_span;
	#_dropdown;
	#_format;
	#_input;
	#_selected;
	#_value = {};
	#_select;

	constructor()
	{
		super();

		this.#_selected = document.createElement('div');
		this.#_selected.classList.add('chosen-selected-inner');

		this.#_button = document.createElement('button');
		this.#_button.classList.add('selected-button-inner');
		this.#_selected.appendChild(this.#_button);

		this.#_button.addEventListener(
			'click', _ => this.#_showDropdown()
		);

		this.#_image = document.createElement('img');
		this.#_image.classList.add('button-flag-inner');
		this.#_image.setAttribute('width', 15);
		this.#_image.setAttribute('height', 15);
		this.#_button.appendChild(this.#_image);

		this.#_span = document.createElement('span');
		this.#_span.classList.add('button-text-inner');
		this.#_button.appendChild(this.#_span);

		this.#_format = document.createElement('div');
		this.#_format.classList.add('chosen-format-inner');

		this.#_input = document.createElement('input');
		this.#_input.setAttribute('type', 'number');
		this.#_input.classList.add('format-input-inner');
		this.#_format.appendChild(this.#_input);

		this.#_input.addEventListener('keyup', _ => {
			const event = new CustomEvent('change');
			this.dispatchEvent(event);
		});

		this.#_dropdown = document.createElement('div');
		this.#_dropdown.classList.add('selected-dropdown-inner');
		this.#_dropdown.setAttribute('role', 'list');
		this.#_selected.appendChild(this.#_dropdown);

		for (const item of this.#_formats)
		{
			item.element = document.createElement('div');
			item.element.classList.add('dropdown-item-inner');
			item.element.setAttribute('title', item.title);
			item.element.setAttribute('role', 'option');
			this.#_dropdown.appendChild(item.element);

			item.element.addEventListener(
				'click', _ => this.#_selectedPhone(item)
			);

			item.image = document.createElement('img');
			item.image.setAttribute('src', item.flag);
			item.image.setAttribute('alt', item.title);
			item.image.setAttribute('width', 15);
			item.image.setAttribute('height', 15);
			item.image.setAttribute('aria-label', item.title);
			item.image.classList.add('item-flag-inner');
			item.element.appendChild(item.image);

			item.span = document.createElement('span');
			item.span.classList.add('item-prefix-inner');
			item.span.innerHTML = item.prefix;
			item.element.appendChild(item.span);

			if (Number(item.default) === 1)
			{
				this.#_selectedPhone(item)
			}
		}
	}

	connectedCallback()
	{
		this.appendChild(this.#_selected);
		this.appendChild(this.#_format);
	}

	get toInt()
	{
		return Number(this.#_select.prefix + this.#_input.value);
	}

	get toString()
	{
		let result = this.#_select.mask;
		let value = Object.values(this.#_value);

		for (let i = 0; i < value.length; i++)
		{
			result = result.replace(/#/, value[i]);
		}

		result = result.replace(/\)/, ') ');
		return result.replace(/#/g, '_');
	}

	get valid()
	{
		let result = this.#_select.mask;
		let value = this.#_input.value;

		result = result.replace(/[^#]/g, '');
		return (result.length === value.length);
	}

	#_prepareFormat(mask)
	{
		this.#_input.setAttribute(
			'placeholder', mask.replace(/#/g, '_')
		);

		/*
		while (this.#_format.hasChildNodes())
		{
			this.#_format.removeChild(this.#_format.firstChild);
		}

		mask = mask.replace(
			/([-])/g, '<div class="format-separate-inner">$1</div>'
		);

		mask = mask.replace(
			/([()])/g, '<div class="format-bracket-inner">$1</div>'
		);

		mask = mask.replace(
			/([\d+])/g, '<div class="format-number-inner" data-value="$1"></div>'
		);

		this.#_format.innerHTML = mask.replace(
			/#/g, '<input type="text" class="format-input-inner empty">'
		);

		const inputs = this.#_format.querySelectorAll(
			'input.format-input-inner'
		);

		for (const [key, input] of inputs.entries())
		{
			input.addEventListener('keyup-', (e) => {
				const key_prev = (key - 1);
				const key_next = (key + 1);

				console.log('keyup', inputs[key_next]);

				if (e.keyCode === 8)// Backspace
				{
					input.classList.add('empty');
					input.value = '';

					delete this.#_value[key];

					if (inputs.hasOwnProperty(key_prev))
					{
						inputs[key_prev].focus();
					}

					const event = new CustomEvent('change');
					this.dispatchEvent(event);
				}
				else if (e.keyCode === 37)// ArrowLeft
				{
					if (inputs.hasOwnProperty(key_prev))
					{
						inputs[key_prev].focus();
					}
				}
				else if (e.keyCode === 39)// ArrowRight
				{
					if (inputs.hasOwnProperty(key_next))
					{
						inputs[key_next].focus();
					}
				}
				else if (inputs.hasOwnProperty(key_next))
				{
					inputs[key_next].focus();
				}

				const event = new CustomEvent('change');
				this.dispatchEvent(event);
			});

			input.addEventListener('keydown', (e) => {
				if (e.repeat === true) return;

				let value = e.key.replace(/[^\d]/g, '');
				input.value = value;

				console.log(231, value);

				if (value.length > 0)
				{
					this.#_value[key] = value;

					console.log('keydown', inputs[key + 1]);
					inputs[key + 1].focus();

					input.classList.remove('empty');
				}
				else
				{
					// input.classList.add('empty');
					// input.value = '';
				}
			});

			input.addEventListener('keypress-', (e) => {
				console.log('keypress', e, input);
			});
		}
		*/
	}

	#_selectedPhone(item)
	{
		item.element.classList.add('active');
		this.#_value = new Object;

		this.#_image.src = item.flag;
		this.#_image.ariaLabel = item.title;
		this.#_span.innerHTML = item.prefix;
		this.#_hideDropdown();

		this.#_select = item;
		this.#_prepareFormat(item.mask);

		this.dispatchEvent(new CustomEvent(
			'selected', { detail: item }
		));
	}

	#_showDropdown()
	{
		this.#_dropdown.classList.add('active');
	}

	#_hideDropdown()
	{
		this.#_dropdown.classList.remove('active');
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('phone-chosen', PhoneChosenElement);
});