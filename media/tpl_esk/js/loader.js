const LOADER_BUTTON_INNER = 'button-loader-inner';
const LOADER_SPINNER_INNER = 'loading-spinner-inner';

class Loader extends EventTarget
{
	#_element;
	#_spinner;
	#_active = false;

	constructor(element)
	{
		super();

		this.#_element = element;

		this.#_spinner = document.createElement('div');
		this.#_spinner.classList.add(LOADER_SPINNER_INNER);

		let spin_one = document.createElement('div');
		spin_one.classList.add('spinner-one-inner');
		this.#_spinner.appendChild(spin_one);

		let spin_two = document.createElement('div');
		spin_two.classList.add('spinner-two-inner');
		this.#_spinner.appendChild(spin_two);

		let spin_tree = document.createElement('div');
		spin_tree.classList.add('spinner-tree-inner');
		this.#_spinner.appendChild(spin_tree);
	}

	start()
	{
		if (this.#_active === true) return;

		this.#_element.classList.add(LOADER_BUTTON_INNER);
		this.#_element.appendChild(this.#_spinner);
		this.#_active = true;
	}

	stop()
	{
		if (this.#_active === false) return;

		this.#_element.classList.remove(LOADER_BUTTON_INNER);
		this.#_element.removeChild(this.#_spinner);
		this.#_active = false;
	}

	isActive(state)
	{
		return (this.#_active === state);
	}
}