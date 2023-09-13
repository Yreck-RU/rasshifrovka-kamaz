/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://paket.rusbid.de/
 */

class Validator extends EventTarget
{
	#_config = config.get('validator');
	#_fields = new Object;
	#_invalid_data = new Object;
	#_valid_data = new Object;

	/////////////////////////////////////////////////////////////

	constructor(config = {})
	{
		super();

		this.#_config = Object.assign({
			validatorInput: 'control-input-inner',
			validatorClass: 'group-validate-inner',
			validatorError: 'error',
			validatorSuccess: 'success',
			displayMessage: true
		}, this.#_config, config);
	}

	get config()
	{
		return this.#_config;
	}

	getMessage(name)
	{
		return this.#_config[name];
	}

	hasMessage(name)
	{
		return this.#_config.hasOwnProperty(name);
	}

	addField(name, element)
	{
		let result = this.#_getFieldClass(name);

		result = new result(name, element);
		this.#_fields[name] = result;

		return result;
	}

	getField(name)
	{
		if (!this.hasField($name))
		{
			return false;
		}

		return this.#_fields[name];
	}

	removeField(name)
	{
		if (!this.hasField($name))
		{
			return false;
		}

		delete this.#_fields[name];
		return true;
	}

	hasField(name)
	{
		return this.#_fields.hasOwnProperty(name);
	}

	getValidData()
	{
		return this.#_valid_data;
	}

	getInvalidData()
	{
		return this.#_invalid_data;
	}

	validate(data)
	{
		if (!data instanceof Object)
		{
			throw new Error('Data valid empty!');
		}

		const fields = Object.entries(this.#_fields);
		let result = new Object;

		for (const [name, field] of fields)
		{
			let value;

			if (data.hasOwnProperty(name))
			{
				value = data[name];
			}

			if (!value instanceof HTMLElement)
			{
				value = String(value).trim();
				value = value.replace(/\s{2,}/g, ' ');
			}

			if (!field.validate(value, this))
			{
				this.#_invalid_data[name] = value;
				result[name] = false;
			}
			else
			{
				this.#_valid_data[name] = value;
				result[name] = true;
			}
		}

		result = Object.values(result);
		return (result.indexOf(false) === -1);
	}

	#_getFieldClass(name)
	{
		if (ValidatorHelper.hasFieldClass(name))
		{
			return ValidatorHelper.getFieldClass(name);
		}

		return BaseField;
	}
}