class RequiredRule extends BaseRule
{
	validate(value)
	{
		if (value === undefined)
		{
			// console.log(7, value);
			return false;
		}

		if (value === null)
		{
			// console.log(13, value);
			return false;
		}

		if (String(value).length < 1)
		{
			// console.log(19, value);
			return false;
		}

		return true;
	}
}

ValidatorHelper.addRuleClass('required', RequiredRule);