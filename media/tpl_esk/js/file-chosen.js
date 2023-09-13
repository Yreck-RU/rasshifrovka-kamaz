/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class FileChosenElement extends HTMLElement
{
	#_config = config.get('file-chosen');
	#_button;
	#_placeholder;
	#_input_file;
	#_file;

	connectedCallback()
	{
		this.#_placeholder = document.createElement('div');
		this.#_placeholder.classList.add('chosen-placeholder-inner');
		this.#_placeholder.innerHTML = this.#_config.placeholder;
		this.appendChild(this.#_placeholder);

		this.#_button = document.createElement('button');
		this.#_button.setAttribute('type', 'button');
		this.#_button.classList.add('chosen-button-inner');
		this.#_button.innerHTML = this.#_config.btn_select;
		this.appendChild(this.#_button);

		this.#_button.addEventListener(
			'click', _ => this.#_showDialogFile()
		);

		this.#_input_file = document.createElement('input');
		this.#_input_file.setAttribute('type', 'file');
		this.#_input_file.style.display = 'none';

		this.#_input_file.addEventListener(
			'change', _ => this.#_changeSelectFile()
		);
	}

	get file()
	{
		return this.#_file;
	}

	get valid()
	{
		return (this.#_file instanceof File);
	}

	#_showDialogFile()
	{
		if (!document.body.contains(this.#_input_file))
		{
			document.body.appendChild(this.#_input_file);
		}

		this.#_input_file.click();
	}

	#_changeSelectFile()
	{
		const files = this.#_input_file.files;
		const hint = this.#_placeholder;

		if (files.length < 1)
		{
			hint.innerHTML = this.#_config.placeholder;
			this.#_file = undefined;

			return;
		}

		this.#_file = files.item(0);
		hint.innerHTML = this.#_file.name;

		if (document.body.contains(this.#_input_file))
		{
			document.body.removeChild(this.#_input_file);
		}
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('file-chosen', FileChosenElement);
});