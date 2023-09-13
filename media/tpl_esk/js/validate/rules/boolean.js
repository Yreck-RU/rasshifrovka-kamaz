class BooleanRule extends BaseRule
{
	validate(value)
	{
		const data = [
			'1', 1, 'true', true, 'on', 'ues',
			'0', 0, 'false', false, 'off', 'no'
		];

		if (data.indexOf(value) === -1)
		{
			// console.log(12, value, this);
			return false;
		}

		if (!this.hasOwnProperty('value'))
		{
			// console.log(18, value, this);
			return true;
		}

		// console.log(22, value, this);
		return (value === this.value);
	}
}

ValidatorHelper.addRuleClass('boolean', BooleanRule);