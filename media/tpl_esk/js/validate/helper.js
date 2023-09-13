class ValidatorHelper extends Object
{
	static #_rules = new Object;
	static #_fields = new Object;

	static addRuleClass(name, _class)
	{
		this.#_rules[name] = _class;
	}

	static getRuleClass(name)
	{
		if (!this.hasRuleClass(name))
		{
			return false;
		}

		return this.#_rules[name];
	}

	static removeRuleClass(name)
	{
		if (!this.hasRuleClass(name))
		{
			return false;
		}

		delete this.#_rules[name];
		return true;
	}

	static hasRuleClass(name)
	{
		return this.#_rules.hasOwnProperty(name);
	}

	/////////////////////////////////////////////////////////////

	static addFieldClass(name, _class)
	{
		this.#_fields[name] = _class;
	}

	static getFieldClass(name)
	{
		if (!this.hasFieldClass(name))
		{
			return false;
		}

		return this.#_fields[name];
	}

	static removeFieldClass(name)
	{
		if (!this.hasFieldClass(name))
		{
			return false;
		}

		delete this.#_fields[name];
		return true;
	}

	static hasFieldClass(name)
	{
		return this.#_fields.hasOwnProperty(name);
	}
}