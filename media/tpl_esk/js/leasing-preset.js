/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class LeasingPreset
{
	// ������ ������������ �������������
	#_element;

	// ������������� �������������
	#_id = 0;

	// 	�������������� ����� (���.)
	#_initialpay = 0;

	// ��������� ������ (%)
	#_lastpay = 0;

	// 	���������� ���������� ������ (% � ���.)	
	#_ratepercent = 0;

	// ������ ������ �� ������� (%)	
	#_ratetax = 0;

	// ������ ��� (%)
	#_ratevat = 0;

	// ���� �������� (���.)
	#_term = 0;

	constructor(element, data, reload)
	{
		this.#_element = element;

		this.#_id = Number(element.dataset.id);
		element.removeAttribute('data-id');

		this.#_initialpay = Number(data.initialpay);
		this.#_lastpay = Number(data.lastpay);
		this.#_ratepercent = Number(data.ratepercent);
		this.#_ratetax = Number(data.ratetax);
		this.#_ratevat = Number(data.ratevat);
		this.#_term = Number(data.term);

		element.addEventListener(
			'click', _ => reload.apply(this, [this])
		);
	}

	get element()
	{
		return this.#_element;
	}

	get id()
	{
		return this.#_id;
	}

	set initialpay(value)
	{
		this.#_initialpay = value;
	}

	get initialpay()
	{
		return this.#_initialpay;
	}

	set lastpay(value)
	{
		this.#_lastpay = value;
	}

	get lastpay()
	{
		return this.#_lastpay;
	}

	get ratepercent()
	{
		return this.#_ratepercent;
	}

	set ratetax(value)
	{
		this.#_ratetax = value;
	}

	get ratetax()
	{
		return this.#_ratetax;
	}

	set ratevat(value)
	{
		this.#_ratevat = value;
	}

	get ratevat()
	{
		return this.#_ratevat;
	}

	set term(value)
	{
		this.#_term = value;
	}

	get term()
	{
		return this.#_term;
	}

	getInitialPay(price)
	{
		return (price / 100 * this.#_initialpay);
	}

	getLastPay(price)
	{
		return (price / 100 * this.#_lastpay);
	}

	getTerm(initial = true)
	{
		if (!initial && this.#_lastpay)
        {
			return (this.#_term - 1);
        }

		return this.#_term;
	}

	getRatePercent(initial = true)
	{
		let exponent = this.getTerm(initial);
		let num = (1 + (this.#_ratepercent / 100));

		return Math.pow(num, exponent);
	}

	// �������� "����������� ������"
	getMonthlyPay(price = 0)
	{
		let i_pay = this.getInitialPay(price);
		let l_pay = (price / 100 * this.#_lastpay);
		let rate = this.getRatePercent();

		let result = (price - i_pay - l_pay / rate);
		result *= this.getRatePercent(false);

		rate = this.getRatePercent(false);

		let percent = (this.#_ratepercent / 100);
		result *= (percent / (rate - 1));

		return result;
	}

	// �������� "����� ��������"
	getAmountContract(price = 0)
	{
		let result = this.getInitialPay(price);
		result += (price / 100 * this.#_lastpay);

		let m_pay = this.getMonthlyPay(price);
		let term = this.getTerm(false);

		return (result + (m_pay * term));
	}

	// �������� "������ ����� ����������"
	getAmountAppreciation(price = 0)
	{
		return (this.getAmountContract(price) - price);
	}

	// �������� "������� ����� ����������"
	getYearSumAppreciation(price = 0)
	{
		let result = this.getAmountContract(price);
		return ((result - price) / (this.getTerm() / 12));
	}

	// �������� "������� ����������"
	getYearAppreciation(price = 0)
	{
		let result = this.getYearSumAppreciation(price);
		return (result / price * 100);
	}

	// �������� "�������� �� ������� �����"
	getTaxSaving(price = 0)
	{
		let v_refund = this.getVatRefund(price);
		let tax_cut = this.getTaxCut(price);

		return (v_refund + tax_cut);
	}

	// �������� "������� ���"
	getVatRefund(price = 0)
	{
		let result = this.getAmountContract(price);
		let ratevat = (this.#_ratevat / 100);

		return result / (1 + ratevat) * ratevat;
	}

	// �������� "�������� ������ �� �������"
	getTaxCut(price = 0)
	{
		let result = this.getAmountContract(price);
		let ratetax = (this.#_ratetax / 100);

		return result / (1 + ratetax) * ratetax;
	}

	// ������ ��������
	getSchedulePayments(price = 0)
	{
		let count = this.getTerm(true);
		let result = new Array;

		let m_pay = this.getMonthlyPay(price);
		let i_pay = this.getInitialPay(price);
		let l_pay = this.getLastPay(price);

		if (i_pay > 0)
		{
			result.push({
				type: 'initialpay',
				value: i_pay
			});
		}

		if (l_pay > 0) count = (count - 1);

		for (let i = 1; i <= count; i++)
		{
			result.push({
				type: 'month',
				index: i,
				value: m_pay
			});
		}

		if (l_pay > 0)
		{
			result.push({
				type: 'lastpay',
				value: l_pay
			});
		}

		return result;
	}
}