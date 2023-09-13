class BaseRule extends Object
{
	#_name;
	#_field;

	constructor(name, field, data = {})
	{
		super();

		this.#_name = name;
		this.#_field = field;

		Object.assign(this, data);
	}

	values()
	{
		return {
			rule: this.#_name
		};
	}

	get field()
	{
		return this.#_field;
	}

	get name()
	{
		return this.#_name;
	}
}