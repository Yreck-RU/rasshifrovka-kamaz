class BaseField extends EventTarget
{
	#_name;
	#_element;
	#_rules = new Object;

	constructor(name, element)
	{
		super();

		this.#_name = name;
		this.#_element = element;
	}

	get name()
	{
		return this.#_name;
	}

	get element()
	{
		return this.#_element;
	}

	getParentElement()
	{
		return this.#_element;
	}

	addRule(name, data = {})
	{
		if (!ValidatorHelper.hasRuleClass(name))
		{
			throw new Error('Rule ' + name + ' not found!');
		}

		const result = ValidatorHelper.getRuleClass(name);

		if (!result.prototype instanceof BaseRule)
		{
			throw new Error('Rule ' + name + ' BaseRule!');
		}

		this.#_rules[name] = new result(name, this, data);
	}

	getRule(name)
	{
		if (!this.hasRule(name))
		{
			return false;
		}

		return this.#_rules[name];
	}

	removeRule(name)
	{
		if (!this.hasRule(name))
		{
			return false;
		}

		delete this.#_rules[name];
		return true;
	}

	hasRule(name)
	{
		return this.#_rules.hasOwnProperty(name);
	}

	getRules()
	{
		return this.#_rules;
	}

	validate(value, validator)
	{
		const parent = this.#_element.parentElement;

		const elements = parent.querySelectorAll(
			'div.' + validator.config.validatorClass
		);

		elements.forEach(
			(div) => parent.removeChild(div)
		);

		for (const rule of Object.values(this.#_rules))
		{
			if (!rule.validate(value))
			{
				this.#_prepareError(rule, validator);
				return false;
			}

			this.#_prepareSuccess(validator);
		}

		return true;
	}

	#_prepareSuccess(validator)
	{
		if (this.#_element.classList.contains(
			validator.config.validatorError
		)) {
			this.#_element.classList.remove(
				validator.config.validatorError
			);
		}

		if (!this.#_element.classList.contains(
			validator.config.validatorSuccess
		)) {
			this.#_element.classList.add(
				validator.config.validatorSuccess
			);
		}
	}

	#_prepareError(rule, validator)
	{
		if (this.#_element.classList.contains(
			validator.config.validatorSuccess
		)) {
			this.#_element.classList.remove(
				validator.config.validatorSuccess
			);
		}

		if (!this.#_element.classList.contains(
			validator.config.validatorError
		))
		{
			this.#_element.classList.add(
				validator.config.validatorError
			);
		}

		this.#_prepareMessage(rule, validator);
	}

	#_prepareMessage(rule, validator)
	{
		if (!validator.config.displayMessage)
		{
			return;
		}

		const result = document.createElement('div');
		result.innerHTML = this.#_getMessage(rule, validator);
		this.#_element.parentElement.appendChild(result);

		result.classList.add(
			validator.config.validatorClass
		);

		result.classList.add(
			validator.config.validatorError
		);
	}

	#_getMessage(rule, validator)
	{
		let result, errors = [
			this.name + ':' + rule.name,
			this.name, rule.name
		];

		errors = errors.filter(
			(key) => validator.hasMessage(key)
		);

		if (errors.length < 1)
		{
			throw new Error('Message not found!');
		}

		result = validator.getMessage(errors[0]);

		const entries = Object.entries(rule.values());
		entries.push(['field', this.#_name]);

		for (let [name, value] of entries)
		{
			result = result.replace(':' + name, value);
		}

		return result;
	}
}