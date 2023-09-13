/**
 * @copyright   2022 motokraft. MIT License
 * @link https://github.com/motokraft/framework
 */

class AlertModel extends EventTarget
{
	#_element;
	#_content;
	#_header;
	#_title;
	#_close;
	#_body;

	constructor(config = {})
	{
		super();

		this.#_element = document.createElement('div');
		this.#_element.classList.add('page-alert-inner');

		this.#_element.addEventListener('click', _ => {
			if (!this.#_content.contains(event.target)) this.hide();
		});

		this.#_content = document.createElement('div');
		this.#_content.classList.add('alert-content-inner');

		if (config.hasOwnProperty('type'))
		{
			this.#_content.classList.add('content-' + config.type + '-inner');
		}

		if (config.hasOwnProperty('size'))
		{
			this.#_content.classList.add('size-' + config.size + '-inner');
		}

		this.#_element.appendChild(this.#_content);

		this.#_header = document.createElement('div');
		this.#_header.classList.add('content-header-inner');
		this.#_content.appendChild(this.#_header);

		this.#_title = document.createElement('div');
		this.#_title.classList.add('header-title-inner');
		this.#_header.appendChild(this.#_title);

		if (config.hasOwnProperty('title'))
		{
			this.#_title.innerHTML = config.title;
		}

		this.#_close = document.createElement('button');
		this.#_close.setAttribute('type', 'button');
		this.#_close.classList.add('header-close-inner');

		this.#_close.addEventListener('click', _ => this.hide());
		this.#_header.appendChild(this.#_close);

		this.#_body = document.createElement('div');
		this.#_body.classList.add('content-body-inner');
		this.#_content.appendChild(this.#_body);
	}

	set innerHTML(value)
	{
		this.#_body.innerHTML = value;
	}

	set title(value)
	{
		this.#_title.innerHTML = value;
	}

	get header()
	{
		return this.#_header;
	}

	appendChild(element)
	{
		this.#_body.appendChild(element);
	}

	show()
	{
		if (!document.body.contains(this.#_element))
		{
			document.body.appendChild(this.#_element);
		}

		setTimeout(_ => this.#_element.classList.add('show'), 100);
	}

	hide()
	{
		this.#_element.classList.remove('show');

		setTimeout(_ => {
			if (document.body.contains(this.#_element)) document.body.removeChild(this.#_element);
		}, 200);
	}
}