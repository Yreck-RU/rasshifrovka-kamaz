class PhoneRule extends BaseRule
{
	validate(value)
	{
		return (value.valid === true);
	}
}

ValidatorHelper.addRuleClass('phone', PhoneRule);