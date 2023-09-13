class WebAssetConfig extends Object
{
	#data;

	constructor()
	{
		super();

		let script = document.querySelector(
			'script[type="application/json"]'
		);

		this.#data = JSON.parse(script.innerHTML);
	}

	get(name, _default)
	{
		if (!this.has(name))
		{
			return _default;
		}

		return this.#data[name];
	}

	has(name)
	{
		return this.#data.hasOwnProperty(name);
	}
}

window.config = new WebAssetConfig;