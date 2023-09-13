/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ProductLeasingElement extends HTMLElement
{
	// настройки плагина
	#_config = config.get('product-leasing');

	// выбранная предустановка
	#_selected;

	// Предустановки
	#_buttons = new Set;

	// Доп. услуги
	#_services = new Set;

	// Размер авансового платежа (руб.)
	#_ivalue = this.querySelector(
		'div#' + this.#_config.ivalue
	);

	// Размер авансового платежа (%)
	#_ipercent = this.querySelector(
		'div#' + this.#_config.ipercent
	);

	// (nouislider) Размер авансового платежа (%)
	#_inouislider;

	// Строк действия лизинга
	#_tvalue = this.querySelector(
		'div#' + this.#_config.tvalue
	);

	// (nouislider) Строк действия лизинга
	#_tnouislider;

	// Последний платеж (выкупной) (руб.)
	#_lvalue = this.querySelector(
		'div#' + this.#_config.lvalue
	);

	// Последний платеж (выкупной) (%)
	#_lpercent = this.querySelector(
		'div#' + this.#_config.lpercent
	);

	// (nouislider) Последний платеж (выкупной) (%)
	#_lnouislider;

	// Ставка НДС (%)
	#_vpercent = this.querySelector(
		'div#' + this.#_config.vpercent
	);

	// (nouislider) Ставка НДС (%)
	#_vatnouislider;

	// Ставка налога на прибыль (%)
	#_tpercent = this.querySelector(
		'div#' + this.#_config.tpercent
	);

	// (nouislider) Ставка налога на прибыль (%)
	#_taxnouislider;

	/////////////////////////////////////////////////

	// Ежемесячный платеж
	#_monthpay = this.querySelector(
		'div.monthpay .item-value-inner'
	);

	// Сумма договора
	#_sumtreaty = this.querySelector(
		'div.sumtreaty .item-value-inner'
	);

	// Полная сумма удорожания
	#_sumrise = this.querySelector(
		'div.sumrise .item-value-inner'
	);

	// Годовая сумма удорожания
	#_ysumrise = this.querySelector(
		'div.ysumrise .item-value-inner'
	);

	// Годовое удорожание
	#_yrise = this.querySelector(
		'div.yrise .item-value-inner'
	);

	// Экономия по налогам всего
	#_savingtax = this.querySelector(
		'div.savingtax .item-value-inner'
	);

	// Возврат НДС
	#_vatrefund = this.querySelector(
		'div.vatrefund .item-value-inner'
	);

	// Снижение налога на прибыль
	#_incometax = this.querySelector(
		'div.incometax .item-value-inner'
	);

	// кнопка "Получить расчет"
	#_sendbtn = this.querySelector(
		'button.result-button-inner'
	);

	// класс реализующий оформление заявки
	#_request = new LeasingRequest;

	// График платежей
	#_schedulepay = this.querySelector(
		'div.schedulepay-grid-inner'
	);

	// языка-зависимое форматирование чисел
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

	// применение выбранной предустановки
	#_changeProfile(item)
	{
		const buttons = this.querySelectorAll(
			'button.preset-button-inner.active'
		);

		buttons.forEach(
			(button) => button.classList.remove('active')
		);

		item.element.classList.add('active');

		// Размер авансового платежа (руб.)
		this.#_ivalue.innerHTML = this.#_intl.format(
			item.getInitialPay(this.#_config.price)
		);

		// Размер авансового платежа (%)
		this.#_ipercent.innerHTML = item.initialpay;

		// Строк действия лизинга
		this.#_tvalue.innerHTML = item.term;

		// Последний платеж (выкупной) (руб.)
		this.#_lvalue.innerHTML = this.#_intl.format(
			item.getLastPay(this.#_config.price)
		);

		// Последний платеж (выкупной) (%)
		this.#_lpercent.innerHTML = item.lastpay;

		// Ставка НДС (%)
		this.#_vpercent.innerHTML = item.ratevat;

		// Ставка налога на прибыль (%)
		this.#_tpercent.innerHTML = item.ratetax;

		// пересчет "Ежемесячный платеж"
		this.#_monthpay.innerHTML = this.#_intl.format(
			item.getMonthlyPay(this.#_config.price)
		);

		// пересчет "Сумма договора"
		this.#_sumtreaty.innerHTML = this.#_intl.format(
			item.getAmountContract(this.#_config.price)
		);

		// пересчет "Полная сумма удорожания"
		this.#_sumrise.innerHTML = this.#_intl.format(
			item.getAmountAppreciation(this.#_config.price)
		);

		// пересчет "Годовая сумма удорожания"
		this.#_ysumrise.innerHTML = this.#_intl.format(
			item.getYearSumAppreciation(this.#_config.price)
		);

		const intl = new Intl.NumberFormat('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});

		// пересчет "Годовое удорожание"
		this.#_yrise.innerHTML = intl.format(
			item.getYearAppreciation(this.#_config.price)
		);

		// пересчет "Экономия по налогам всего"
		this.#_savingtax.innerHTML = this.#_intl.format(
			item.getTaxSaving(this.#_config.price)
		);

		// пересчет "Возврат НДС"
		this.#_vatrefund.innerHTML = this.#_intl.format(
			item.getVatRefund(this.#_config.price)
		);

		// пересчет "Снижение налога на прибыль"
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