class MaxRule extends BaseRule
{
	validate(value)
	{
		if (isNaN(Number(value)))
		{
			return false;
		}

		if (!this.hasOwnProperty('value'))
		{
			return false;
		}

		if (isNaN(Number(this.value)))
		{
			return false;
		}

		const max = Number(this.value);
		return (max > Number(value));
	}

	values()
	{
		const result = super.values();
		result.value = Number(this.value);

		return result;
	}
}

ValidatorHelper.addRuleClass('max', MaxRule);