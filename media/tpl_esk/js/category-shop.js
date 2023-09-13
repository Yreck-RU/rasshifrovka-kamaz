/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class CategoryShopElement extends HTMLElement
{
	static #_types = new Object;

	#_config = config.get('category-shop');
	#_filters = new Collection;
	#_result = new CategoryResult;
	#_toggle = false;
	#_countlinkShow = (self.innerWidth < 768 ? 3 : 10);
	#_content;
	#_itoggle;
	#_hclose;
	#_backdrop;
	#_clear;
	#_sidebar;
	#_sorting;
	#_limit;
	#_btn_send;
	#_btn_clear;

	static addOptionType(name, _class)
	{
		this.#_types[name] = _class;
	}

	static getOptionType(name)
	{
		if (!this.hasOptionType(name))
		{
			return false;
		}

		return this.#_types[name];
	}

	static removeOptionType(name)
	{
		if (!this.hasOptionType(name))
		{
			return false;
		}

		delete this.#_types[name];
		return true;
	}

	static hasOptionType(name)
	{
		return this.#_types.hasOwnProperty(name);
	}

	connectedCallback()
	{
		window.addEventListener('resize', _ => {
			this.#_countlinkShow = (self.innerWidth < 768 ? 3 : 10);
		});

		const filters = this.querySelectorAll(
			'div.content-item-inner[data-type]'
		);

		for (let filter of filters)
		{
			let type = filter.dataset.type;

			if (!CategoryShopElement.hasOptionType(type))
			{
				console.error('Type "' + type + '" not found!');
				return;
			}

			type = CategoryShopElement.getOptionType(type);

			filter = new type(filter, this.#_config,
				(mouse) => this.#_sendRequest(mouse)
			);

			this.#_filters.append(filter);
		}

		const main_tag = this.querySelector(
			'div.main-tag-inner'
		);

		const tag_links = main_tag.querySelectorAll(
			'a.tag-link-inner'
		);

		const button_show = this.querySelector(
			'button.tag-button-inner.show'
		);

		const button_hide = this.querySelector(
			'button.tag-button-inner.hide'
		);

		if (button_show instanceof HTMLElement)
		{
			button_show.addEventListener('click', _ => {
				const length = this.#_countlinkShow;
				const items = Array.from(tag_links);

				items.slice(length).forEach((item) => {
					item.classList.remove('hidden');
				});

				button_show.style.display = 'none';
				button_hide.style.display = 'inline-block';
			});
		}

		if (button_hide instanceof HTMLElement)
		{
			button_hide.addEventListener('click', _ => {
				const length = this.#_countlinkShow;
				const items = Array.from(tag_links);

				items.slice(length).forEach((item) => {
					item.classList.add('hidden');
				});

				button_show.style.display = 'inline-block';
				button_hide.style.display = 'none';
			});
		}

		this.#_content = this.querySelector(
			'div.filter-content-inner'
		);

		this.#_sidebar = this.querySelector(
			'div.category-sidebar-inner'
		);

		this.#_sorting = this.querySelector(
			'select-chosen.select-chosen-inner.sorting'
		);

		this.#_sorting.addEventListener(
			'change', (e) => this.#_changeSelect(e)
		);

		this.#_limit = this.querySelector(
			'select-chosen.select-chosen-inner.limit'
		);

		this.#_limit.addEventListener(
			'change', (e) => this.#_changeSelect(e)
		);

		const views = this.querySelectorAll(
			'button.view-item-inner'
		);

		views.forEach((button) => {
			button.addEventListener('click', _ => {
				const request = new FetchRequest;
				const data = request.getFormData;

				data.append('option', 'com_shop');
				data.append('task', 'catalog.view');
				data.append('value', button.dataset.type);
				data.append('format', 'json');

				request.addEventListener(
					'success', _ => location.reload()
				);

				request.send(location.href, data);
			});
		});

		this.#_backdrop = document.createElement('div');
		this.#_backdrop.classList.add('sidebar-backdrop-inner');

		this.#_backdrop.addEventListener(
			'click', _ => this.#_toggleFilter()
		);

		this.#_itoggle = this.querySelector(
			'button.sorting-toggle-inner'
		);

		this.#_itoggle.addEventListener(
			'click', _ => this.#_toggleFilter()
		);

		this.#_hclose = this.querySelector(
			'button.header-close-inner'
		);

		this.#_hclose.addEventListener(
			'click', _ => this.#_toggleFilter()
		);

		this.#_clear = this.querySelector(
			'button.filter-clear-inner'
		);

		if (this.#_clear instanceof HTMLButtonElement)
		{
			const l_clear = new Loader(this.#_clear);

			this.#_clear.addEventListener(
				'click', _ => this.#_clickClear(l_clear)
			);
		}

		this.#_btn_send = this.querySelector(
			'button.footer-button-inner.send'
		);

		const l_send = new Loader(this.#_btn_send);

		this.#_btn_send.addEventListener(
			'click', _ => this.#_clickSend(l_send)
		);

		this.#_btn_clear = this.querySelector(
			'button.footer-button-inner.clear'
		);

		const l_clear = new Loader(this.#_btn_clear);

		this.#_btn_clear.addEventListener(
			'click', _ => this.#_clickClear(l_clear)
		);
	}

	#_getRequestData(request)
	{
		const result = request.getFormData;

		result.append('option', 'com_shop');
		result.append('format', 'json');

		this.#_filters.each((option) => {
			this.#_prepareDataRequest(option, result);
		});

		return result;
	}

	#_changeSelect(event)
	{
		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');

		const classList = event.target.classList;

		if (classList.contains('sorting'))
		{
			data.append('task', 'catalog.sorting');
		}
		else if (classList.contains('limit'))
		{
			data.append('task', 'catalog.limit');
		}

		data.append('value', event.detail.value);
		data.append('format', 'json');

		request.addEventListener(
			'success', _ => location.reload()
		);

		request.send(location.href, data);
	}

	#_sendRequest(mouse)
	{
		this.#_result.resize(mouse);

		const request = new FetchRequest;
		const data = this.#_getRequestData(request);
		data.append('task', 'catalog.filter');

		request.addEventListener('success', (e) => {
			if (mouse.reload)
			{
				if (e.detail.hasOwnProperty('link'))
				{
					location.href = e.detail.link;
				}
				else
				{
					location.reload();
				}
				
				return;
			}

			this.#_result.show(e.detail, this.#_content);

			const span = this.#_btn_send.querySelector(
				'span.button-text-inner'
			);

			span.dataset.total = Number(e.detail.total);

			const filters = this.#_filters.filter(
				(filter) => (filter instanceof CategoryFilterList)
			);

			filters.each((filter) => {
				let totals = e.detail.totals;

				if (filter.type === 'labellist')
				{
					totals = e.detail.labels;
				}
				else if (filter.type === 'warrantielist')
				{
					totals = e.detail.warranties;
				}

				filter.updateTotal(totals)
			});
		});

		request.send(location.href, data);
	}

	#_prepareDataRequest(option, data)
	{
		let name = 'options[' + option.id + ']';

		if (option.type === 'labellist')
		{
			name = 'labels';
		}
		else if (option.type === 'warrantielist')
		{
			name = 'warranties';
		}

		option.values.forEach((val, key) => {
			data.append(name + '[' + key + ']', val);
		});
	}

	#_clickSend(loader)
	{
		loader.start();

		const request = new FetchRequest;
		const data = this.#_getRequestData(request);
		data.append('task', 'catalog.send');

		request.addEventListener('complete', _ => loader.stop());

		request.addEventListener('success', (e) => {
			location.href = e.detail.link;
		});

		request.send(location.href, data);
	}

	#_clickClear(loader)
	{
		loader.start();
		this.#_filters.each((filter) => filter.clear());

		const request = new FetchRequest;
		const data = this.#_getRequestData(request);
		data.append('task', 'catalog.clear');

		request.addEventListener('success', (e) => {
			location.href = e.detail.link;
		});

		request.send(location.href, data);
	}

	#_toggleFilter()
	{
		if (this.#_toggle)
		{
			if (this.#_sidebar.contains(this.#_backdrop))
			{
				this.#_sidebar.removeChild(this.#_backdrop);
			}

			this.#_sidebar.classList.remove('in');
			setTimeout(_ => this.#_sidebar.classList.remove('active'), 100);
		}
		else
		{
			if (!this.#_sidebar.contains(this.#_backdrop))
			{
				this.#_sidebar.appendChild(this.#_backdrop);
			}

			this.#_sidebar.classList.add('active');
			setTimeout(_ => this.#_sidebar.classList.add('in'), 100);
		}

		this.#_toggle = !this.#_toggle;
	}
}

class CategoryFilterList
{
	#_element;
	#_config;
	#_id = 0;
	#_type;
	#_h_title;
	#_question;
	#_search_input;
	#_search_clear;
	#_search_empty;
	#_collapse;
	#_collapse_list;
	#_checked_all;
	#_btn_more;
	#_options = new Collection;
	#_active = false;
	#_is_search = false;
	#_q_hover = false;
	#_q_alert = new AlertModel;
	#_parent;
	#_q_text;

	constructor(element, config, reload)
	{
		this.#_element = element;
		this.#_config = config;

		this.#_parent = element.parentElement;

		this.#_id = Number(element.dataset.id);
		this.#_type = element.dataset.type;

		element.removeAttribute('data-id');
		element.removeAttribute('data-type');

		const options = element.querySelectorAll(
			'div.list-item-inner'
		);

		for (let option of options)
		{
			option = new FilterOption(option, this.#_type, reload);
			this.#_options.append(option);
		}

		this.#_h_title = element.querySelector(
			'div.header-title-inner'
		);

		this.#_question = element.querySelector(
			'img.header-question-inner'
		);

		if (this.#_question !== null)
		{
			this.#_q_alert.title = this.#_h_title.dataset.title;

			this.#_q_text = element.querySelector(
				'div.question-text-inner'
			);

			this.#_questionShow();
		}

		this.#_collapse = element.querySelector(
			'div.item-collapse-inner'
		);

		this.#_collapse_list = element.querySelector(
			'div.collapse-list-inner'
		);

		const hidden = this.#_collapse.ariaHidden;
		this.#_active = (hidden === 'false');

		this.#_h_title.addEventListener(
			'click', _ => this.#_toggleCollapse()
		);

		this.#_search_input = element.querySelector(
			'input.search-input-inner'
		);

		this.#_search_clear = element.querySelector(
			'button.search-clear-inner'
		);

		this.#_search_clear.addEventListener(
			'click', _ => this.#_clearSearch()
		);

		if (this.#_search_input !== null)
		{
			this.#_search_empty = document.createElement('div');
			this.#_search_empty.classList.add('list-empty-inner');
			this.#_search_empty.innerHTML = this.#_config.search_empty;

			const parent = this.#_search_input.parentElement;

			this.#_search_input.addEventListener(
				'focus', _ => parent.classList.add('focus')
			);

			this.#_search_input.addEventListener(
				'blur', _ => parent.classList.remove('focus')
			);

			this.#_search_input.addEventListener(
				'keyup', _ => this.#_serachKeyup()
			);
		}

		this.#_checked_all = element.querySelector(
			'div.collapse-checked-all-inner'
		);

		if (this.#_checked_all !== null)
		{
			this.#_checked_all.addEventListener(
				'click', (e) => this.#_toggleCheckedAll(e, reload)
			);
		}

		this.#_btn_more = element.querySelector(
			'button.item-more-inner'
		);

		if (this.#_btn_more !== null)
		{
			this.#_btn_more.addEventListener(
				'click', _ => this.#_toggleMoreItem()
			);
		}
	}

	updateTotal(totals)
	{
		let options = this.#_options.filter(
			(option) => option.active === false
		);

		options.each(
			(option) => option.disabled = true
		);

		options = options.filter(
			(option) => totals.hasOwnProperty(option.id)
		);

		options.each((option) => {
			const total = Number(totals[option.id]);
			option.total = total;
			option.disabled = (total < 1);
		});
	}

	get id()
	{
		return this.#_id;
	}

	get type()
	{
		return this.#_type;
	}

	get values()
	{
		let collection = this.#_options;

		collection = collection.filter(
			(option) => !option.disabled
		);

		collection = collection.filter(
			(option) => option.active
		);

		return collection.map(
			(option) => Number(option.id)
		).array;
	}

	clear()
	{
		const options = this.#_options.filter(
			(option) => option.active
		);

		options.each(
			(option) => option.active = false
		);
	}

	#_serachKeyup()
	{
		const value = this.#_search_input.value;
		const collection = this.#_options;

		if (String(value).length <= 0)
		{
			this.#_search_clear.dispatchEvent(
				new CustomEvent('click')
			);

			return;
		}

		this.#_is_search = true;
		this.#_search_clear.style.display = 'block';

		if (this.#_btn_more !== null)
		{
			this.#_btn_more.ariaHidden = 'true';
		}

		let regex;

		try
		{
			regex = new RegExp(value, 'i');
		}
		catch (e)
		{
			return;
		}

		let items = collection.filter(
			(option) => option.disabled
		);

		items.each(
			(option) => option.hidden = true
		);

		items = collection.filter(
			(option) => !regex.test(option.title)
		);

		items.each((option) => {
			option.title = option.title;
			option.hidden = true;
		});

		items = collection.filter(
			(option) => regex.test(option.title)
		);

		items.each((option) => {
			option.title = option.title.replace(regex, '<b>$&</b>');
			option.hidden = false;
		});

		if (items.length > 0)
		{
			if (this.#_checked_all !== null)
			{
				this.#_checked_all.ariaHidden = 'false';
			}

			if (this.#_collapse_list.contains(this.#_search_empty))
			{
				this.#_collapse_list.removeChild(this.#_search_empty);
			}
		}
		else
		{
			if (this.#_checked_all !== null)
			{
				this.#_checked_all.ariaHidden = 'true';
			}

			if (!this.#_collapse_list.contains(this.#_search_empty))
			{
				this.#_collapse_list.appendChild(this.#_search_empty);
			}
		}
	}

	#_clearSearch()
	{
		this.#_search_input.value = '';
		const collection = this.#_options;

		this.#_is_search = false;
		this.#_search_clear.style.display = 'none';

		collection.each((option) => {
			option.title = option.title;
			option.hidden = false;
		});

		if (this.#_btn_more !== null)
		{
			this.#_btn_more.ariaHidden = 'false';
			const pressed = this.#_btn_more.ariaPressed;

			this.#_options.slice(5).each((option) => {
				option.hidden = (pressed === 'false');
			});
		}

		if (this.#_checked_all !== null)
		{
			this.#_checked_all.ariaHidden = 'false';
		}

		if (this.#_collapse_list.contains(this.#_search_empty))
		{
			this.#_collapse_list.removeChild(this.#_search_empty);
		}
	}

	#_toggleCollapse()
	{
		const parent = this.#_h_title.parentElement;

		if (this.#_active === true)
		{
			this.#_collapse.classList.remove('in');
			parent.classList.remove('active');

			setTimeout(_ => {
				this.#_collapse.ariaHidden = 'true';
			}, 10);
		}
		else
		{
			this.#_collapse.ariaHidden = 'false';
			parent.classList.add('active');

			setTimeout(_ => {
				this.#_collapse.classList.add('in');
			}, 10);
		}

		this.#_active = !this.#_active;
	}

	#_toggleCheckedAll(event, reload)
	{
		const selected = this.#_checked_all.ariaChecked;
		const state = (selected !== 'true');

		let collection = this.#_options.filter(
			(option) => !option.disabled
		);

		if (this.#_is_search === true)
		{
			collection.each((option) => {
				option.active = false
			});

			collection = collection.filter(
				(option) => !option.hidden
			);
		}
		
		collection.each((option) => {
			option.active = state
		});

		if (state)
		{
			this.#_checked_all.ariaChecked = 'true';
		}
		else
		{
			this.#_checked_all.ariaChecked = 'false';
		}

		reload.apply(this, [event]);
	}

	#_toggleMoreItem()
	{
		const pressed = this.#_btn_more.ariaPressed;

		this.#_options.slice(5).each((option) => {
			option.hidden = (pressed === 'true');
		});

		if (pressed === 'true')
		{
			this.#_btn_more.ariaPressed = 'false';
			this.#_btn_more.innerHTML = this.#_config.more_visible;
		}
		else
		{
			this.#_btn_more.ariaPressed = 'true';
			this.#_btn_more.innerHTML = this.#_config.more_hidden;
		}
	}

	#_questionShow()
	{
		let is_mobile = (self.innerWidth < 768);

		this.#_parent.addEventListener('scroll', _ => {
			this.#_questionOffsetUpdate();
		});

		window.addEventListener('resize', _ => {
			is_mobile = (self.innerWidth < 768);
			this.#_questionOffsetUpdate();
		});

		this.#_question.addEventListener('click', _ => {
			if (!is_mobile) return;

			this.#_q_alert.innerHTML = this.#_q_text.innerHTML;
			this.#_q_alert.show();
		});

		this.#_question.addEventListener('mouseover', _ => {
			if (is_mobile) return;
			if (this.#_q_hover) return;

			this.#_q_text.classList.add('active');
			this.#_questionOffsetUpdate();

			setTimeout(_ => {
				this.#_q_text.classList.add('in');
				this.#_q_hover = true;
			}, 10);
		});

		this.#_question.addEventListener('mouseout', _ => {
			if (is_mobile) return;
			if (!this.#_q_hover) return;

			this.#_q_text.classList.remove('in');

			setTimeout(_ => {
				this.#_q_text.classList.remove('active');
				this.#_q_text.removeAttribute('style');
				this.#_q_hover = false;
			}, 100);
		});
	}

	#_questionOffsetUpdate()
	{
		let top = (this.#_h_title.offsetTop + 7);

		top = ((top - this.#_parent.scrollTop));
		top = (top - (this.#_q_text.offsetHeight / 2));
		this.#_q_text.style.top = (top / 16) + 'rem';

		let width = this.#_element.clientWidth;
		let left = this.#_element.offsetLeft;

		left = ((width + left) / 16).toFixed(2);
		this.#_q_text.style.left = left + 'rem';
	}
}

CategoryShopElement.addOptionType('optionlist', CategoryFilterList);
CategoryShopElement.addOptionType('labellist', CategoryFilterList);
CategoryShopElement.addOptionType('warrantielist', CategoryFilterList);

class FilterOption
{
	#_element;
	#_clear;
	#_id = 0;
	#_total = 0;
	#_title;
	#_active;
	#_disabled;

	constructor(element, type, reload)
	{
		this.#_element = element;

		this.#_id = Number(element.dataset.id);
		this.#_total = Number(element.dataset.total);
		this.#_title = element.dataset.title;

		element.removeAttribute('data-id');
		element.removeAttribute('data-title');

		const disabled = element.ariaDisabled;
		this.#_disabled = (disabled === 'true');

		const checked = element.ariaChecked;
		this.#_active = (checked === 'true');

		element.addEventListener('click', (e) => {
			this.active = !this.#_active;
			reload.apply(this, [e]);
		});

		const category = document.querySelector(
			'category-shop.content-category-inner'
		);

		if (type === 'optionlist')
		{
			type = 'option';
		}
		else if (type === 'labellist')
		{
			type = 'label';
		}
		else if (type === 'warrantielist')
		{
			type = 'warrantie';
		}

		this.#_clear = category.querySelector(
			'button[data-' + type + '-id="' + this.#_id + '"]'
		);

		if (this.#_clear instanceof HTMLButtonElement)
		{
			this.#_clear.addEventListener('click', _ => {
				const parent = this.#_clear.parentElement;
				const f_item = parent.parentElement;
				f_item.removeChild(parent);

				const event = new CustomEvent('click');
				event.reload = true;

				element.dispatchEvent(event);
			});
		}
	}

	get id()
	{
		return Number(this.#_id);
	}

	get total()
	{
		return Number(this.#_total);
	}

	get active()
	{
		return this.#_active;
	}

	get disabled()
	{
		return this.#_disabled;
	}

	get hidden()
	{
		const hidden = this.#_element.ariaHidden;
		return (hidden === 'true');
	}

	get title()
	{
		return this.#_title;
	}

	set title(value)
	{
		const div = this.#_element.querySelector(
			'span.item-title-inner'
		);

		div.innerHTML = value;
	}

	set total(value)
	{
		this.#_element.dataset.total = Number(value);
	}

	set hidden(value)
	{
		if (value === true)
		{
			this.#_element.ariaHidden = 'true';
		}
		else
		{
			this.#_element.ariaHidden = 'false';
		}
	}

	set active(value)
	{
		if (value === true)
		{
			this.#_element.ariaChecked = 'true';
		}
		else
		{
			this.#_element.ariaChecked = 'false';
		}

		this.#_active = value;
	}

	set disabled(value)
	{
		if (value === true)
		{
			this.#_element.ariaDisabled = 'true';
		}
		else
		{
			this.#_element.ariaDisabled = 'false';
		}

		this.#_disabled = value;
	}
}

class CategoryFilterRange
{
	#_element;
	#_config;
	#_parent;
	#_header;
	#_h_title;
	#_question;
	#_q_text;
	#_collapse;
	#_nouislider;
	#_input_min;
	#_input_max;
	#_clear;
	#_sef;
	#_active = false;
	#_id = 0;
	#_type;
	#_min = 0;
	#_max = 0;
	#_q_hover = false;
	#_q_alert = new AlertModel;

	constructor(element, config, reload)
	{
		this.#_element = element;
		this.#_config = config;

		this.#_parent = element.parentElement;

		this.#_id = Number(element.dataset.id);
		this.#_type = element.dataset.type;

		element.removeAttribute('data-id');
		element.removeAttribute('data-type');

		this.#_h_title = element.querySelector(
			'div.header-title-inner'
		);

		this.#_question = element.querySelector(
			'img.header-question-inner'
		);

		if (this.#_question !== null)
		{
			this.#_q_alert.title = this.#_h_title.dataset.title;

			this.#_q_text = element.querySelector(
				'div.question-text-inner'
			);

			this.#_questionShow();
		}

		this.#_collapse = element.querySelector(
			'div.item-collapse-inner'
		);

		this.#_min = Number(this.#_collapse.dataset.min);
		this.#_max = Number(this.#_collapse.dataset.max);

		let v_min = 0;
		let v_max = 0;

		if (this.#_collapse.dataset.hasOwnProperty('valueMin'))
		{
			v_min = Number(this.#_collapse.dataset.valueMin);
		}

		if (this.#_collapse.dataset.hasOwnProperty('valueMax'))
		{
			v_max = Number(this.#_collapse.dataset.valueMax);
		}

		const category = document.querySelector(
			'category-shop.content-category-inner'
		);

		this.#_clear = category.querySelector(
			'button[data-range-id="' + this.#_id + '"]'
		);

		if (this.#_clear instanceof HTMLButtonElement)
		{
			this.#_clear.addEventListener('click', _ => {
				const parent = this.#_clear.parentElement;
				const f_item = parent.parentElement;
				f_item.removeChild(parent);

				this.clear();

				event.element = this.#_collapse;
				event.reload = true;

				reload.apply(this, [event]);
			});
		}

		this.#_collapse.removeAttribute('data-min');
		this.#_collapse.removeAttribute('data-max');

		const control = document.createElement('div');
		control.classList.add('collapse-control-inner');
		this.#_collapse.appendChild(control);

		this.#_input_min = document.createElement('input');
		this.#_input_min.setAttribute('type', 'number');
		this.#_input_min.setAttribute('step', 0.01);
		this.#_input_min.setAttribute('placeholder', this.#_min);
		this.#_input_min.classList.add('control-input-inner');
		this.#_input_min.value = (v_min > 0 ? v_min : '');
		control.appendChild(this.#_input_min);

		this.#_input_min.addEventListener(
			'keyup', (e) => this.#_keyUpInput(e, reload)
		);

		this.#_input_max = document.createElement('input');
		this.#_input_max.setAttribute('type', 'number');
		this.#_input_max.setAttribute('step', 0.01);
		this.#_input_max.setAttribute('placeholder', this.#_max);
		this.#_input_max.classList.add('control-input-inner');
		this.#_input_max.value = (v_max > 0 ? v_max : '');
		control.appendChild(this.#_input_max);

		this.#_input_max.addEventListener(
			'keyup', (e) => this.#_keyUpInput(e, reload)
		);

		const hidden = this.#_collapse.ariaHidden;
		this.#_active = (hidden === 'false');

		this.#_h_title.addEventListener(
			'click', _ => this.#_toggleCollapse()
		);

		this.#_nouislider = document.createElement('div');
		this.#_collapse.appendChild(this.#_nouislider);

		this.#_sef = noUiSlider.create(this.#_nouislider, {
			step: 0.01,
			start: [
				(v_min > 0 ? v_min : this.#_min),
				(v_max > 0 ? v_max : this.#_max)
			],
			connect: true,
			range: {
				min: this.#_min,
				max: this.#_max
			},
			pips: {
				mode: 'range',
				density: 10,
				format: {
					to: (value) => value,
					from: (value) => value
				}
			}
		});

		this.#_sef.on('slide', (values) => {
			this.#_changeNoUiSlider(values);
		});

		this.#_sef.on('end', _ => {
			event.element = this.#_collapse;
			reload.apply(this, [event]);
		});
	}

	get id()
	{
		return this.#_id;
	}

	get type()
	{
		return this.#_type;
	}

	get values()
	{
		const min = Number(this.#_input_min.value);
		const max = Number(this.#_input_max.value);
		const result = [];

		if (min > 0) result[0] = min;
		if (max > 0) result[1] = max;

		return result;
	}

	clear()
	{
		this.#_input_min.value = '';
		this.#_input_max.value = '';

		this.#_sef.set([
			Number(this.#_min),
			Number(this.#_max)
		]);
	}

	#_toggleCollapse()
	{
		const parent = this.#_h_title.parentElement;

		if (this.#_active === true)
		{
			this.#_collapse.classList.remove('in');
			parent.classList.remove('active');

			setTimeout(_ => {
				this.#_collapse.ariaHidden = 'true';
			}, 10);
		}
		else
		{
			this.#_collapse.ariaHidden = 'false';
			parent.classList.add('active');

			setTimeout(_ => {
				this.#_collapse.classList.add('in');
			}, 10);
		}

		this.#_active = !this.#_active;
	}

	#_changeNoUiSlider(values)
	{
		const min = Number(values[0]);
		const max = Number(values[1]);

		if (min === this.#_min)
		{
			this.#_input_min.value = '';
		}
		else
		{
			this.#_input_min.value = min;
		}

		if (max === this.#_max)
		{
			this.#_input_max.value = '';
		}
		else
		{
			this.#_input_max.value = max;
		}
	}

	#_keyUpInput(event)
	{
		const input = event.target;

		if (isNaN(Number(input.value)))
		{
			input.setAttribute('type', 'number');
			input.value = '';
		}

		if (Number(input.value) < this.#_min)
		{
			input.value = Number(this.#_min);
		}

		if (Number(input.value) > this.#_max)
		{
			input.value = Number(this.#_max);
		}

		this.#_sef.set([
			Number(this.#_input_min.value),
			Number(this.#_input_max.value)
		]);
	}

	#_questionShow()
	{
		let is_mobile = (self.innerWidth < 768);

		this.#_parent.addEventListener('scroll', _ => {
			this.#_questionOffsetUpdate();
		});

		window.addEventListener('resize', _ => {
			is_mobile = (self.innerWidth < 768);
			this.#_questionOffsetUpdate();
		});

		this.#_question.addEventListener('click', _ => {
			if (!is_mobile) return;

			this.#_q_alert.innerHTML = this.#_q_text.innerHTML;
			this.#_q_alert.show();
		});

		this.#_question.addEventListener('mouseover', _ => {
			if (is_mobile) return;
			if (this.#_q_hover) return;

			this.#_q_text.classList.add('active');
			this.#_questionOffsetUpdate();

			setTimeout(_ => {
				this.#_q_text.classList.add('in');
				this.#_q_hover = true;
			}, 10);
		});

		this.#_question.addEventListener('mouseout', _ => {
			if (is_mobile) return;
			if (!this.#_q_hover) return;

			this.#_q_text.classList.remove('in');

			setTimeout(_ => {
				this.#_q_text.classList.remove('active');
				this.#_q_text.removeAttribute('style');
				this.#_q_hover = false;
			}, 100);
		});
	}

	#_questionOffsetUpdate()
	{
		let top = (this.#_h_title.offsetTop + 7);

		top = ((top - this.#_parent.scrollTop));
		top = (top - (this.#_q_text.offsetHeight / 2));
		this.#_q_text.style.top = (top / 16) + 'rem';

		let width = this.#_element.clientWidth;
		let left = this.#_element.offsetLeft;

		left = ((width + left) / 16).toFixed(2);
		this.#_q_text.style.left = left + 'rem';
	}
}

CategoryShopElement.addOptionType('optionrange', CategoryFilterRange);

class CategoryResult
{
	#_element;
	#_message;
	#_link;
	#_btn_close;

	constructor()
	{
		this.#_element = document.createElement('div');
		this.#_element.classList.add('content-request-inner');

		this.#_message = document.createElement('div');
		this.#_message.classList.add('request-message-inner');
		this.#_element.appendChild(this.#_message);

		this.#_link = document.createElement('a');
		this.#_link.classList.add('request-link-inner');
		this.#_element.appendChild(this.#_link);

		this.#_btn_close = document.createElement('button');
		this.#_btn_close.setAttribute('type', 'button');
		this.#_btn_close.classList.add('request-close-inner');

		this.#_btn_close.addEventListener(
			'click', _ => this.hide()
		);

		this.#_element.appendChild(this.#_btn_close);
	}

	resize(mouse)
	{
		let target = mouse.target;

		if (mouse.hasOwnProperty('element'))
		{
			target = mouse.element;
		}

		let top = (target.offsetTop - 6);
		let parent = target.parentElement;

		top = ((top - parent.scrollTop));
		this.#_element.style.top = (top / 16) + 'rem';

		let width = target.clientWidth;
		let left = target.offsetLeft;

		left = (width + (left + 20)) / 16;
		this.#_element.style.left = left + 'rem';
	}

	show(detail, content)
	{
		this.#_message.innerHTML = detail.data;
		this.#_link.setAttribute('href', detail.link);
		this.#_link.innerHTML = detail.title;

		if (!content.contains(this.#_element))
		{
			content.appendChild(this.#_element);

			setTimeout(_ => {
				this.#_element.classList.add('in');
			}, 100);
		}
	}

	hide()
	{
		const parent = this.#_element.parentElement;
		if (parent === null) return;

		this.#_element.classList.remove('in');

		setTimeout(_ => {
			parent.removeChild(this.#_element);
		}, 100);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('category-shop', CategoryShopElement);
});