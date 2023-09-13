class EmailRule extends RequiredRule
{
	validate(value)
	{
		if (!super.validate(value))
		{
			return true;
		}

		return /\S+@\S+\.\S+/.test(value);
	}
}

ValidatorHelper.addRuleClass('email', EmailRule);