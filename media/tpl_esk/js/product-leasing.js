/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ProductLeasingElement extends HTMLElement
{
	// ��������� �������
	#_config = config.get('product-leasing');

	// ��������� �������������
	#_selected;

	// �������������
	#_buttons = new Set;

	// ���. ������
	#_services = new Set;

	// ������ ���������� ������� (���.)
	#_ivalue = this.querySelector(
		'div#' + this.#_config.ivalue
	);

	// ������ ���������� ������� (%)
	#_ipercent = this.querySelector(
		'div#' + this.#_config.ipercent
	);

	// (nouislider) ������ ���������� ������� (%)
	#_inouislider;

	// ����� �������� �������
	#_tvalue = this.querySelector(
		'div#' + this.#_config.tvalue
	);

	// (nouislider) ����� �������� �������
	#_tnouislider;

	// ��������� ������ (��������) (���.)
	#_lvalue = this.querySelector(
		'div#' + this.#_config.lvalue
	);

	// ��������� ������ (��������) (%)
	#_lpercent = this.querySelector(
		'div#' + this.#_config.lpercent
	);

	// (nouislider) ��������� ������ (��������) (%)
	#_lnouislider;

	// ������ ��� (%)
	#_vpercent = this.querySelector(
		'div#' + this.#_config.vpercent
	);

	// (nouislider) ������ ��� (%)
	#_vatnouislider;

	// ������ ������ �� ������� (%)
	#_tpercent = this.querySelector(
		'div#' + this.#_config.tpercent
	);

	// (nouislider) ������ ������ �� ������� (%)
	#_taxnouislider;

	/////////////////////////////////////////////////

	// ����������� ������
	#_monthpay = this.querySelector(
		'div.monthpay .item-value-inner'
	);

	// ����� ��������
	#_sumtreaty = this.querySelector(
		'div.sumtreaty .item-value-inner'
	);

	// ������ ����� ����������
	#_sumrise = this.querySelector(
		'div.sumrise .item-value-inner'
	);

	// ������� ����� ����������
	#_ysumrise = this.querySelector(
		'div.ysumrise .item-value-inner'
	);

	// ������� ����������
	#_yrise = this.querySelector(
		'div.yrise .item-value-inner'
	);

	// �������� �� ������� �����
	#_savingtax = this.querySelector(
		'div.savingtax .item-value-inner'
	);

	// ������� ���
	#_vatrefund = this.querySelector(
		'div.vatrefund .item-value-inner'
	);

	// �������� ������ �� �������
	#_incometax = this.querySelector(
		'div.incometax .item-value-inner'
	);

	// ������ "�������� ������"
	#_sendbtn = this.querySelector(
		'button.result-button-inner'
	);

	// ����� ����������� ���������� ������
	#_request = new LeasingRequest;

	// ������ ��������
	#_schedulepay = this.querySelector(
		'div.schedulepay-grid-inner'
	);

	// �����-��������� �������������� �����
	#_intl = new Intl.NumberFormat('ru-RU', {
		maximumFractionDigits: 0
	});

	connectedCallback()
	{
		const inouislider = this.querySelector(
			'div.item-nouislider-inner.initialpay'
		);

		this.#_inouislider = noUiSlider.create(inouislider, {
			step: 1,
			connect: 'lower',
			start: 0,
			range: {
				min: 0,
				max: 49
			},
			pips: {
				mode: 'range',
				density: 10
			}
		});

		this.#_inouislider.on('slide', (values) => {
			this.#_selected.initialpay = Number(values[0]);
			this.#_changeProfile(this.#_selected);
		});

		////////////////////////////////////////////////////////////////

		const tnouislider = this.querySelector(
			'div.item-nouislider-inner.term'
		);

		this.#_tnouislider = noUiSlider.create(tnouislider, {
			step: 1,
			connect: 'lower',
			start: 12,
			range: {
				min: 12,
				max: 84
			},
			pips: {
				mode: 'range',
				density: 10
			}
		});

		this.#_tnouislider.on('slide', (values) => {
			this.#_selected.term = Number(values[0]);
			this.#_changeProfile(this.#_selected);
		});

		////////////////////////////////////////////////////////////////

		const lnouislider = this.querySelector(
			'div.item-nouislider-inner.lastpay'
		);

		this.#_lnouislider = noUiSlider.create(lnouislider, {
			step: 1,
			connect: 'lower',
			start: 0,
			range: {
				min: 0,
				max: 40
			},
			pips: {
				mode: 'range',
				density: 10
			}
		});

		this.#_lnouislider.on('slide', (values) => {
			this.#_selected.lastpay = Number(values[0]);
			this.#_changeProfile(this.#_selected);
		});

		////////////////////////////////////////////////////////////////

		const vatnouislider = this.querySelector(
			'div.item-nouislider-inner.ratevat'
		);

		this.#_vatnouislider = noUiSlider.create(vatnouislider, {
			step: 1,
			connect: 'lower',
			start: 0,
			range: {
				min: 0,
				max: 20
			},
			pips: {
				mode: 'range',
				density: 10
			}
		});

		this.#_vatnouislider.on('slide', (values) => {
			this.#_selected.ratevat = Number(values[0]);
			this.#_changeProfile(this.#_selected);
		});

		////////////////////////////////////////////////////////////////

		const taxnouislider = this.querySelector(
			'div.item-nouislider-inner.ratetax'
		);

		this.#_taxnouislider = noUiSlider.create(taxnouislider, {
			step: 1,
			connect: 'lower',
			start: 0,
			range: {
				min: 0,
				max: 20
			},
			pips: {
				mode: 'range',
				density: 10
			}
		});

		this.#_taxnouislider.on('slide', (values) => {
			this.#_selected.ratetax = Number(values[0]);
			this.#_changeProfile(this.#_selected);
		});

		this.#_sendbtn.addEventListener(
			'click', _ => this.#_request.show(this.#_selected, this.#_services)
		);

		////////////////////////////////////////////////////////////////

		const buttons = this.querySelectorAll(
			'button.preset-button-inner'
		);

		for (let button of buttons)
		{
			const id = Number(button.dataset.id);
			const data = this.#_config.profiles[id];

			button = new LeasingPreset(button, data,
				(item) => {
					this.#_inouislider.set([item.initialpay]);
					this.#_tnouislider.set([item.term]);
					this.#_lnouislider.set([item.lastpay]);
					this.#_vatnouislider.set([item.ratevat]);
					this.#_taxnouislider.set([item.ratetaxratetax]);

					this.#_selected = item;
					this.#_changeProfile(item);
				}
			);

			if (Number(data.default) === 1)
			{
				this.#_inouislider.set([data.initialpay]);
				this.#_tnouislider.set([data.term]);
				this.#_lnouislider.set([data.lastpay]);
				this.#_vatnouislider.set([data.ratevat]);
				this.#_taxnouislider.set([data.ratetax]);

				this.#_selected = button;
			}

			this.#_buttons.add(button);
		}

		const services = this.querySelectorAll(
			'div.list-item-inner[data-title]'
		);

		for (let service of services)
		{
			service = new LeasingService(service);
			this.#_services.add(service);
		}
	}

	// ���������� ��������� �������������
	#_changeProfile(item)
	{
		const buttons = this.querySelectorAll(
			'button.preset-button-inner.active'
		);

		buttons.forEach(
			(button) => button.classList.remove('active')
		);

		item.element.classList.add('active');

		// ������ ���������� ������� (���.)
		this.#_ivalue.innerHTML = this.#_intl.format(
			item.getInitialPay(this.#_config.price)
		);

		// ������ ���������� ������� (%)
		this.#_ipercent.innerHTML = item.initialpay;

		// ����� �������� �������
		this.#_tvalue.innerHTML = item.term;

		// ��������� ������ (��������) (���.)
		this.#_lvalue.innerHTML = this.#_intl.format(
			item.getLastPay(this.#_config.price)
		);

		// ��������� ������ (��������) (%)
		this.#_lpercent.innerHTML = item.lastpay;

		// ������ ��� (%)
		this.#_vpercent.innerHTML = item.ratevat;

		// ������ ������ �� ������� (%)
		this.#_tpercent.innerHTML = item.ratetax;

		// �������� "����������� ������"
		this.#_monthpay.innerHTML = this.#_intl.format(
			item.getMonthlyPay(this.#_config.price)
		);

		// �������� "����� ��������"
		this.#_sumtreaty.innerHTML = this.#_intl.format(
			item.getAmountContract(this.#_config.price)
		);

		// �������� "������ ����� ����������"
		this.#_sumrise.innerHTML = this.#_intl.format(
			item.getAmountAppreciation(this.#_config.price)
		);

		// �������� "������� ����� ����������"
		this.#_ysumrise.innerHTML = this.#_intl.format(
			item.getYearSumAppreciation(this.#_config.price)
		);

		const intl = new Intl.NumberFormat('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});

		// �������� "������� ����������"
		this.#_yrise.innerHTML = intl.format(
			item.getYearAppreciation(this.#_config.price)
		);

		// �������� "�������� �� ������� �����"
		this.#_savingtax.innerHTML = this.#_intl.format(
			item.getTaxSaving(this.#_config.price)
		);

		// �������� "������� ���"
		this.#_vatrefund.innerHTML = this.#_intl.format(
			item.getVatRefund(this.#_config.price)
		);

		// �������� "�������� ������ �� �������"
		this.#_incometax.innerHTML = this.#_intl.format(
			item.getTaxCut(this.#_config.price)
		);

		/*
		while (this.#_schedulepay.hasChildNodes())
		{
			this.#_schedulepay.removeChild(this.#_schedulepay.firstChild);
		}

		const payments = item.getSchedulePayments(
			Number(this.#_config.price)
		);

		const length = Math.ceil((payments.length / 4));

		for (var i = 0, j = 0; i < 4; i++, j += length)
		{
			const column = document.createElement('div');
			column.classList.add('grid-column-inner');
			this.#_schedulepay.appendChild(column);

			const items = payments.slice(j, j + length);

			for (let item of items)
			{
				item.element = document.createElement('div');
				item.element.classList.add('column-month-inner');
				column.appendChild(item.element);

				item.m_title = document.createElement('div');
				item.m_title.classList.add('month-title-inner');
				item.element.appendChild(item.m_title);

				if (item.type === 'initialpay')
				{
					item.m_title.innerHTML = this.#_config.initialpay;
				}
				else if (item.type === 'lastpay')
				{
					item.m_title.innerHTML = this.#_config.lastpay;
				}
				else if (item.type === 'month')
				{
					item.m_title.innerHTML = item.index + ' ' + this.#_config.month;
				}

				item.m_value = document.createElement('div');
				item.m_value.classList.add('month-value-inner');
				item.m_value.setAttribute('data-after', this.#_config.prefix);
				item.m_value.innerHTML = this.#_intl.format(item.value);
				item.element.appendChild(item.m_value);
			}
		}
		*/
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-leasing', ProductLeasingElement);
});