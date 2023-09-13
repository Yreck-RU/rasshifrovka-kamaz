class MinRule extends BaseRule
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

		const min = Number(this.value);
		return (Number(value) > min);
	}

	values()
	{
		const result = super.values();
		result.value = Number(this.value);

		return result;
	}
}

ValidatorHelper.addRuleClass('min', MinRule);