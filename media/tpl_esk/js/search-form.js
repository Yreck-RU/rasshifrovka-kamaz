/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class SearchFormElement extends HTMLElement
{
	#_config = config.get('search-form');
	#_request = false;
	#_is_focus = false;
	#_active = false;
	#_backdrop;
	#_result;
	#_form;
	#_close;
	#_button;
	#_input;
	#_send;
	#_timerId;
	#_btn_loader;
	#_send_loader;
	#_selected;

	connectedCallback()
	{
		this.#_backdrop = document.createElement('div');
		this.#_backdrop.classList.add('search-backdrop-inner');

		this.#_result = document.createElement('div');
		this.#_result.classList.add('search-result-inner');

		this.#_form = this.querySelector(
			'div.content-form-inner'
		);

		const s_toggle = document.querySelector(
			'button.sidebar-link-inner.search'
		);

		s_toggle.addEventListener(
			'click', _ => this.#_toggleSearch()
		);

		const r_toggle = document.querySelector(
			'button.main-search-toggle-inner'
		);

		r_toggle.addEventListener(
			'click', _ => this.#_toggleSearch()
		);

		this.#_close = this.querySelector(
			'button.header-close-inner'
		);

		this.#_close.addEventListener(
			'click', _ => this.#_toggleSearch()
		);

		this.#_button = this.#_form.querySelector(
			'button.form-button-inner'
		);

		this.#_btn_loader = new Loader(this.#_button);

		this.#_input = this.#_form.querySelector(
			'input.form-input-inner'
		);

		this.#_send = this.#_form.querySelector(
			'button.form-send-inner'
		);

		this.#_send_loader = new Loader(this.#_send);

		this.#_button.addEventListener(
			'click', _ => this.#_showType()
		);

		this.#_input.addEventListener(
			'focus', _ => this.#_inputFocus((result) => {
				this.#_renderResult(result);
				this.classList.add('active');
			})
		);

		this.#_backdrop.addEventListener(
			'click', _ => this.#_backdropBlur()
		);

		this.#_send.addEventListener('click', _ => {
			this.#_sendQuerySearch(this.#_input.value);
		});

		this.#_input.addEventListener(
			'keyup', _ => this.#_inputKeyUp()
		);
	}

	#_showType()
	{
		this.#_btn_loader.start();

		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');
		data.append('task', 'search.load_type');
		data.append('format', 'json');

		request.addEventListener('complete', _ => {
			this.#_btn_loader.stop();
		});

		request.addEventListener('success', _ => {
			this.#_renderResultType(event.detail);
		});

		request.send(location.href, data);
	}

	#_inputFocus(func)
	{
		if (this.#_is_focus === true) return;
		this.#_is_focus = true;

		if (!this.contains(this.#_result))
		{
			this.appendChild(this.#_result);
		}

		if (!this.contains(this.#_backdrop))
		{
			this.appendChild(this.#_backdrop);
		}

		const request = this.#_getFetchRequest();
		const data = this.#_getFetchRequestData(request);

		request.addEventListener('success', (e) => {
			func.apply(request, [e.detail]);
		});

		let link = new URL(
			this.#_config.link, location.origin
		);

		request.send(link.toString(), data);
	}

	#_backdropBlur()
	{
		if (this.#_is_focus === false) return;
		this.#_is_focus = false;

		this.classList.remove('active');

		setTimeout(_ => {
			if (this.contains(this.#_result)) this.removeChild(this.#_result);
			if (this.contains(this.#_backdrop)) this.removeChild(this.#_backdrop);
		}, 200);
	}

	#_inputKeyUp()
	{
		if (event.keyCode === 13)
		{
			this.#_sendQuerySearch(this.#_input.value);
			return;
		}

		if (this.#_input.value)
		{
			this.#_send.classList.remove('disabled');
		}
		else
		{
			this.#_send.classList.add('disabled');
		}

		if (this.#_timerId > 0)
		{
			clearTimeout(this.#_timerId);
		}

		this.#_timerId = setTimeout(_ => {
			this.#_funcTimeoutKeyUp();
		}, 300);
	}

	#_funcTimeoutKeyUp()
	{
		const request = this.#_getFetchRequest();
		const data = this.#_getFetchRequestData(request);

		request.addEventListener('success', (e) => {
			this.#_renderResult(e.detail);
			this.classList.add('active');
		});

		request.send(location.href, data);
	}

	#_renderResult(result)
	{
		const tablist = document.createElement('div');
		tablist.classList.add('result-tablist-inner');

		const tabcontent = document.createElement('div');
		tabcontent.classList.add('result-tabcontent-inner');

		if (result.data !== null && result.data.length > 0)
		{
			this.#_renderResultProduct(result, tablist, tabcontent);
		}
		else
		{
			this.#_renderProductEmpty(tablist, tabcontent);
		}

		if (result.hasOwnProperty('categories'))
		{
			this.#_renderResultCategory(result, tablist, tabcontent);
		}
		else
		{
			this.#_renderCategoryEmpty(tablist, tabcontent);
		}

		if (result.hasOwnProperty('histories'))
		{
			this.#_renderResultHistory(result, tablist, tabcontent);
		}
		else
		{
			this.#_renderHistoryEmpty(tablist, tabcontent);
		}

		if (tablist.firstChild instanceof HTMLButtonElement)
		{
			tablist.firstChild.classList.add('active');
		}

		if (tabcontent.firstChild instanceof HTMLDivElement)
		{
			tabcontent.firstChild.classList.add('active');
		}

		this.#_result.appendChild(tablist);
		this.#_result.appendChild(tabcontent);
	}

	#_renderResultProduct(result, tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-result-inner');

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		tabitem.appendChild(i_text);

		if (this.#_input.value.length > 0)
		{
			i_text.innerHTML = this.#_config.product_list;
		}
		else
		{
			i_text.innerHTML = this.#_config.popular_list;
		}

		tablist.appendChild(tabitem);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);

		for (let product of result.data)
		{
			product.element = document.createElement('a');
			product.element.setAttribute('href', product.link);
			product.element.classList.add('item-product-inner');
			element.appendChild(product.element);

			product.img = document.createElement('img');
			product.img.setAttribute('src', product.image);
			product.img.classList.add('product-image-inner');
			product.element.appendChild(product.img);

			product.body = document.createElement('div');
			product.body.classList.add('product-body-inner');
			product.element.appendChild(product.body);

			product.b_title = document.createElement('div');
			product.b_title.classList.add('body-title-inner');
			product.b_title.innerHTML = product.title;
			product.body.appendChild(product.b_title);

			product.b_option = document.createElement('div');
			product.b_option.classList.add('body-option-inner');
			product.body.appendChild(product.b_option);

			if (!product.hasOwnProperty('values')) continue;

			for (let value of product.values)
			{
				const o_item = document.createElement('div');
				o_item.classList.add('option-item-inner');
				product.b_option.appendChild(o_item);

				const o_span = document.createElement('span');
				o_span.classList.add('item-text-inner');
				o_span.innerHTML = value;
				o_item.appendChild(o_span);
			}
		}
	}

	#_renderResultCategory(result, tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-category-inner');
		tablist.appendChild(tabitem);

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		i_text.innerHTML = this.#_config.category_title;
		tabitem.appendChild(i_text);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);

		for (let item of result.categories)
		{
			item.element = document.createElement('a');
			item.element.setAttribute('href', item.link);
			item.element.classList.add('item-category-inner');
			element.appendChild(item.element);

			item.text = document.createElement('div');
			item.text.classList.add('item-text-inner');
			item.text.innerHTML = item.title;
			item.element.appendChild(item.text);
		}
	}

	#_renderResultHistory(result, tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-history-inner');
		tablist.appendChild(tabitem);

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		i_text.innerHTML = this.#_config.history_title;
		tabitem.appendChild(i_text);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);

		for (let item of result.histories)
		{
			item.element = document.createElement('div');
			item.element.classList.add('item-history-inner');
			element.appendChild(item.element);

			item.text = document.createElement('div');
			item.text.classList.add('history-text-inner');
			item.text.innerHTML = item.title;
			item.element.appendChild(item.text);

			if (item.hasOwnProperty('type'))
			{
				const span = document.createElement('div');
				span.classList.add('history-type-inner');
				span.innerHTML = item.type;
				item.element.appendChild(span);
			}

			item.btn = document.createElement('button');
			item.btn.setAttribute('tpye', 'button');
			item.btn.classList.add('history-remove-inner');
			item.element.appendChild(item.btn);

			item.btn.addEventListener(
				'click', _ => this.#_clickHistoryRemove(item, element)
			);

			item.element.addEventListener(
				'click', _ => this.#_clickHistorySelect(item)
			);
		}
	}

	#_renderProductEmpty(tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-result-inner');
		tablist.appendChild(tabitem);

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		i_text.innerHTML = this.#_config.product_list;
		tabitem.appendChild(i_text);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		element.classList.add('empty');
		element.innerHTML = this.#_config.search_result_empty;
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);
	}

	#_renderCategoryEmpty(tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-category-inner');
		tablist.appendChild(tabitem);

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		i_text.innerHTML = this.#_config.category_title;
		tabitem.appendChild(i_text);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		element.classList.add('empty');
		element.innerHTML = this.#_config.search_result_empty;
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);
	}

	#_renderHistoryEmpty(tablist, tabcontent)
	{
		const tabitem = document.createElement('button');
		tabitem.setAttribute('tpye', 'button');
		tabitem.classList.add('tablist-item-inner');
		tabitem.classList.add('item-history-inner');
		tablist.appendChild(tabitem);

		const i_text = document.createElement('span');
		i_text.classList.add('item-text-inner');
		i_text.innerHTML = this.#_config.history_title;
		tabitem.appendChild(i_text);

		const element = document.createElement('div');
		element.classList.add('tabcontent-item-inner');
		element.classList.add('empty');
		element.innerHTML = this.#_config.history_empty;
		tabcontent.appendChild(element);

		tabitem.addEventListener(
			'click', _ => this.#_activeTabItem(tabitem, element)
		);
	}

	#_sendQuerySearch(value, _data = {})
	{
		if (value === undefined)
		{
			return;
		}
		else if (value === null)
		{
			return;
		}
		else if (value === '')
		{
			return;
		}

		let link = new URL(
			this.#_config.link, location.origin
		);

		link.searchParams.set('q', value);

		if (_data.hasOwnProperty('name')
			&& _data.hasOwnProperty('id'))
		{
			link.searchParams.set(_data.name, _data.id);
		}
		else if (this.#_selected instanceof Object)
		{
			link.searchParams.set(
				this.#_selected.name, this.#_selected.id
			);
		}

		this.#_send_loader.start();

		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');
		data.append('task', 'search.history_add');
		data.append('q', value);

		if (this.#_selected instanceof Object)
		{
			data.append(
				'type_name', this.#_selected.name
			);

			data.append(
				'type_id', this.#_selected.id
			);
		}

		if (_data.hasOwnProperty('name'))
		{
			data.append('type_name', _data.name);
		}

		if (_data.hasOwnProperty('id'))
		{
			data.append('type_id', _data.id);
		}

		data.append('format', 'json');
		console.log(550, link.toString());

		request.addEventListener('success', _ => {
			location.href = link.toString();
		});

		const _link = new URL(
			this.#_config.link, location.origin
		);

		request.send(_link, data);
	}

	#_clickHistoryRemove(item, element)
	{
		const request = new FetchRequest;
		const data = request.getFormData;

		data.append('option', 'com_shop');
		data.append('task', 'search.history_clear');
		data.append('id', Number(item.id));
		data.append('format', 'json');

		request.addEventListener('success', _ => {
			element.removeChild(item.element);

			const items = element.querySelectorAll(
				'div.item-history-inner'
			);

			if (items.length < 1)
			{
				while (element.hasChildNodes())
				{
					element.removeChild(element.firstChild);
				}

				const alert = document.createElement('div');
				alert.classList.add('item-alert-inner');
				alert.innerHTML = this.#_config.history_empty;
				element.appendChild(alert);
			}
		});

		request.send(location.href, data);
	}

	#_clickHistorySelect(item)
	{
		if (event.target === item.btn) return;

		this.#_sendQuerySearch(item.title, {
			name: item.type_name, id: item.type_id
		});
	}

	#_renderResultType(result)
	{
		const element = new AlertModel({
			size: 'lg', type: 'search-type'
		});

		if (result.hasOwnProperty('data') && result.data.length > 0)
		{
			const t_inner = document.createElement('div');
			t_inner.classList.add('body-tag-inner');
			element.appendChild(t_inner);

			const tag_item = document.createElement('button');
			tag_item.setAttribute('type', 'button');
			tag_item.classList.add('tag-item-inner');
			t_inner.appendChild(tag_item);

			const span = document.createElement('span');
			span.classList.add('item-text-inner');
			span.innerHTML = result.search_all;
			tag_item.appendChild(span);

			tag_item.addEventListener(
				'click', _ => this.#_selectedType({
					type: 'type_id', title: result.search_all
				}, element)
			);

			for (const tag of result.data)
			{
				tag.name = 'type_id';

				tag.element = document.createElement('button');
				tag.element.setAttribute('type', 'button');
				tag.element.classList.add('tag-item-inner');
				tag.element.innerHTML = tag.image;
				t_inner.appendChild(tag.element);

				tag.span = document.createElement('span');
				tag.span.classList.add('item-text-inner');
				tag.span.innerHTML = tag.title;
				tag.element.appendChild(tag.span);

				tag.element.addEventListener(
					'click', _ => this.#_selectedType(tag, element)
				);
			}
		}

		if (result.hasOwnProperty('categories'))
		{
			const c_inner = document.createElement('div');
			c_inner.classList.add('body-category-inner');
			element.appendChild(c_inner);

			for (const category of result.categories)
			{
				category.name = 'page_id';

				category.element = document.createElement('button');
				category.element.setAttribute('type', 'button');
				category.element.classList.add('category-item-inner');
				category.element.innerHTML = category.image;
				c_inner.appendChild(category.element);

				category.span = document.createElement('span');
				category.span.classList.add('item-text-inner');
				category.span.innerHTML = category.title;
				category.element.appendChild(category.span);

				category.element.addEventListener(
					'click', _ => this.#_selectedType(category, element)
				);
			}
		}

		element.title = result.title;
		element.show();
	}

	#_selectedType(item, element)
	{
		this.#_selected = item;

		const span = this.#_button.querySelector('span');
		span.innerHTML = item.title;

		this.#_backdropBlur();
		element.hide();
	}

	#_activeTabItem(tabitem, element)
	{
		if (tabitem.classList.contains('active')) return;
		const parent = tabitem.parentElement;

		const buttons = parent.querySelectorAll(
			'button.tablist-item-inner'
		);

		for (const button of buttons)
		{
			button.classList.remove('active');
		}

		const sibling = element.parentElement;

		const tabs = sibling.querySelectorAll(
			'div.tabcontent-item-inner'
		);

		for (const tab of tabs)
		{
			tab.classList.remove('active');
		}

		tabitem.classList.add('active');
		element.classList.add('active');
	}

	#_clearResult()
	{
		while (this.#_result.hasChildNodes()) this.#_result.removeChild(this.#_result.firstChild);
	}

	#_getFetchRequest()
	{
		const request = new FetchRequest;

		request.addEventListener('complete', _ => {
			this.#_clearResult();
		});

		return request;
	}

	#_getFetchRequestData(request)
	{
		const result = request.getFormData;

		result.append('option', 'com_shop');
		result.append('task', 'search.autocomplete');
		result.append('format', 'json');

		if (this.#_input.value.length > 0)
		{
			result.append('q', this.#_input.value);
		}

		if (this.#_selected instanceof Object)
		{
			result.append(
				this.#_selected.name, this.#_selected.id
			);
		}

		return result;
	}

	#_toggleSearch()
	{
		if (this.#_active === true)
		{
			document.body.removeAttribute('style');
			this.classList.remove('in');
			this.classList.remove('fixed');

			setTimeout(_ => this.classList.remove('active'), 200);
		}
		else
		{
			this.classList.add('fixed');
			setTimeout(_ => this.classList.add('in'), 100);

			this.#_inputFocus((result) => {
				document.body.style.overflow = 'hidden';

				this.#_renderResult(result);
				this.classList.add('active');
			});
		}

		this.#_active = !this.#_active;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('search-form', SearchFormElement);
});