/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class CompareShopElement extends HTMLElement
{
	#_config = config.get('compare-shop');
	#_selected = new Object;
	#_options = new Collection;
	#_render_feature = false;
	#_start = 0;
	#_end = 0;
	#_width = 0;

	#_h_overflow = this.querySelector(
		'div.header-overflow-inner'
	);

	#_slides = this.querySelectorAll(
		'div.overflow-slide-inner'
	);

	#_s_products = this.querySelectorAll(
		'div.slide-product-inner'
	);

	#_s_options = this.querySelectorAll(
		'div.slide-option-inner'
	);

	#_btn_prev = this.querySelector(
		'button.pagination-prev-inner'
	);

	#_btn_next = this.querySelector(
		'button.pagination-next-inner'
	);

	#_w_feature = this.querySelector(
		'div.wrapper-feature-inner'
	);

	#_f_sidebar = document.createElement('div');
	#_f_overflow = document.createElement('div');
	#_f_slide = document.createElement('div');

	connectedCallback()
	{
		this.#_resize();

		window.addEventListener('resize', _ => this.#_resize());

		const tabs = this.querySelectorAll(
			'button.navtab-button-inner'
		);

		tabs.forEach((button) => {
			this.#_prepareTab(button, tabs);
		});

		const options = this.querySelectorAll(
			'div.sidebar-item-inner'
		);

		options.forEach((option) => {
			this.#_prepareOption(option);
		});

		const button_all = this.querySelector(
			'.header-button-inner[data-type="all"]'
		);

		const button_only = this.querySelector(
			'.header-button-inner[data-type="only"]'
		);

		button_all.addEventListener('click', _ => {
			button_only.classList.remove('active');
			button_all.classList.add('active');

			const elements = this.querySelectorAll('div.difference');
			elements.forEach((i) => i.removeAttribute('style'));
		});

		button_only.addEventListener('click', _ => {
			button_all.classList.remove('active');
			button_only.classList.add('active');

			const elements = this.querySelectorAll('div.difference');
			elements.forEach((i) => i.style.display = 'none');
		});

		const button_clear = this.querySelector(
			'.footer-button-inner[data-type="clear"]'
		);

		button_clear.addEventListener('click', _ => {
			const alert = new AlertModel;
			alert.title = this.#_config.alert_clear_title;

			const p = document.createElement('p');
			p.innerHTML = this.#_config.alert_clear_desc;
			alert.appendChild(p);

			const div = document.createElement('div');
			div.classList.add('body-action-inner');
			alert.appendChild(div);

			const btn_send = document.createElement('button');
			btn_send.setAttribute('type', 'button');
			btn_send.classList.add('action-button-inner');
			btn_send.classList.add('button-success-inner');
			div.appendChild(btn_send);

			const send_span = document.createElement('span');
			send_span.classList.add('button-text-inner');
			send_span.innerHTML = this.#_config.btn_send;
			btn_send.appendChild(send_span);

			btn_send.addEventListener('click', _ => {
				const loader = new Loader(btn_send);
				loader.start();

				recaptcha.execute((token) => {
					const request = new FetchRequest;
					const data = request.getFormData;

					data.append('task', 'xhr.compare_clear');
					data.append('recaptcha', token);
					data.append('format', 'json');

					request.addEventListener(
						'error', _ => loader.stop()
					);

					request.addEventListener(
						'success', _ => location.reload()
					);

					request.send(location.href, data);
				});
			});

			const btn_close = document.createElement('button');
			btn_close.setAttribute('type', 'button');
			btn_close.classList.add('action-button-inner');
			div.appendChild(btn_close);

			const close_span = document.createElement('span');
			close_span.classList.add('button-text-inner');
			close_span.innerHTML = this.#_config.btn_close;
			btn_close.appendChild(close_span);

			btn_close.addEventListener('click', _ => alert.hide());
			alert.show();
		});

		this.#_btn_prev.addEventListener('click', _ => this.#_movePrex());
		this.#_btn_next.addEventListener('click', _ => this.#_moveNext());
	}

	#_prepareTab(button, tabs)
	{
		button.addEventListener('click', _ => {
			recaptcha.execute((token) => {
				const request = new FetchRequest;
				const data = request.getFormData;

				data.append('task', 'xhr.compare_change_type');
				data.append('recaptcha', token);
				data.append('format', 'json');

				if (button.dataset.hasOwnProperty('id'))
				{
					data.append('value', button.dataset.id);
				}
				else
				{
					data.append('value', 'all');
				}

				request.addEventListener('success', _ => {
					tabs.forEach((button) => {
						button.classList.remove('active');
					});

					button.classList.add('active');
					location.reload();
				});

				request.send(location.href, data);
			});
		});
	}

	#_prepareOption(option)
	{
		const item = {
			element: option,
			id: Number(option.dataset.id),
			active: false,
			focus: false
		};

		option.removeAttribute('data-id');

		item.items = this.querySelectorAll(
			'div[data-id="' + item.id + '"]'
		);

		option.addEventListener('click', _ => {
			item.element.classList.toggle('active');
			item.active = !item.active;

			this.#_selectedToggle(item);
		});

		option.addEventListener('mouseover', _ => {
			item.element.classList.add('focus');

			item.items.forEach((child) => {
				child.classList.add('focus');
			});
		});

		option.addEventListener('mouseout', _ => {
			item.element.classList.remove('focus');

			item.items.forEach((child) => {
				child.classList.remove('focus');
			});
		});

		this.#_options.append(item);
	}

	#_resize()
	{
		let c_width, flex;

		if (self.outerWidth < 768)
		{
			this.#_end = 1;
		}
		else if (self.outerWidth <= 992)
		{
			this.#_end = 2;
		}
		else if (self.outerWidth >= 992)
		{
			this.#_end = 3;
		}

		c_width = this.#_h_overflow.clientWidth;
		c_width = (c_width - ((this.#_end - 1) * 22));
		c_width = (c_width / this.#_end).toFixed(2);
		this.#_width = Number(c_width);

		flex = 'flex: 0 0 ' + (this.#_width / 16) + 'rem';

		let width = (this.#_start * this.#_width);
		width = (width + (this.#_start * 20));

		let x = 'translateX(-' + width + 'px)';

		this.#_slides.forEach((slide) => {
			slide.style.transform = x;
		});

		this.#_s_products.forEach((item) => {
			item.setAttribute('style', flex);
		});

		this.#_s_options.forEach((item) => {
			item.setAttribute('style', flex);
		});

		/*
		if (this.#_end > 1)
		{
			let end = (this.#_end + this.#_start);
			const length = (this.#_s_products.length - 1);

			end = (end > length ? length : end);
			console.log(200, this.#_start, end);

			for (let i = this.#_start; i < end; i++)
			{
				c_width = this.#_h_overflow.clientWidth;
				c_width = (c_width - ((this.#_end - 1) * 22));
				this.#_width = (c_width / this.#_end).toFixed(2);

				flex = 'flex: 0 0 ' + (this.#_width / 16) + 'rem';

				let item = this.#_s_products.item(i);
				item.classList.add('active');
				item.setAttribute('style', flex);

				setTimeout(_ => item.classList.add('in'), 100);

				// console.log(210, i, item);

				// item = this.#_s_options.item(i);
				// item.classList.add('active');
				// item.setAttribute('style', flex);
			}
		}
		*/
	}

	#_movePrex()
	{
		const prev = (this.#_start - 1);

		if (prev <= 0)
		{
			this.#_slides.forEach((slide) => {
				slide.removeAttribute('style');
			});

			this.#_start = 0;
			return;
		}

		this.#_start = (this.#_start - 1);

		let width = (this.#_start * this.#_width);
		width = (width + (this.#_start * 20));

		let x = 'translateX(-' + width + 'px)';

		this.#_slides.forEach((slide) => {
			slide.style.transform = x;
		});
	}

	#_moveNext()
	{
		const total = (this.#_s_products.length - 1);
		const next = (this.#_start + this.#_end);

		if (next > total) return;
		this.#_start = (this.#_start + 1);

		let width = (this.#_start * this.#_width);
		width = (width + (this.#_start * 20));

		let x = 'translateX(-' + width + 'px)';

		this.#_slides.forEach((slide) => {
			slide.style.transform = x;
		});
	}

	#_selectedToggle(item)
	{
		if (this.#_render_feature === false)
		{
			this.#_featureBlockRender();
		}

		if (this.#_selected.hasOwnProperty(item.id))
		{
			item.s_checked.parentElement.removeChild(item.s_checked);

			item.options.forEach((option) => {
				option.parentElement.removeChild(option);
			});

			delete this.#_selected[item.id];
			const keys = Object.keys(this.#_selected);

			if (keys.length < 1)
			{
				this.#_featureBlockEmpty();
			}
		}
		else
		{
			this.#_selected[item.id] = item;

			item.s_checked = document.createElement('div');
			item.s_checked.classList.add('sidebar-item-inner');
			item.s_checked.classList.add('active');
			this.#_f_sidebar.appendChild(item.s_checked);

			item.s_checked.addEventListener('click', _ => {
				const event = new CustomEvent('click');
				item.element.dispatchEvent(event);
			});

			item.checked = document.createElement('div');
			item.checked.classList.add('item-checked-inner');
			item.s_checked.appendChild(item.checked);

			item.s_text = document.createElement('div');
			item.s_text.classList.add('item-text-inner');
			item.s_text.innerHTML = item.element.dataset.title;
			item.s_checked.appendChild(item.s_text);

			const options = this.#_f_slide.querySelectorAll(
				'div.slide-option-inner'
			);

			item.options = new Array;

			item.items.forEach((option, i) => {
				const el = document.createElement('div');
				el.classList.add('option-item-inner');
				el.innerHTML = option.innerHTML;
				options.item(i).appendChild(el);
				item.options.push(el);
			});
		}
	}

	#_featureBlockRender()
	{
		while (this.#_w_feature.hasChildNodes())
		{
			this.#_w_feature.removeChild(this.#_w_feature.firstChild);
		}

		this.#_f_sidebar.classList.add('feature-sidebar-inner');
		this.#_w_feature.appendChild(this.#_f_sidebar);

		this.#_f_overflow.classList.add('feature-overflow-inner');
		this.#_w_feature.appendChild(this.#_f_overflow);

		this.#_f_slide.classList.add('overflow-slide-inner');
		this.#_f_overflow.appendChild(this.#_f_slide);

		const length = this.#_s_products.length;

		for (let i = 0; i < length; i++)
		{
			const el = document.createElement('div');
			el.classList.add('slide-option-inner');
			this.#_f_slide.appendChild(el);
		}

		this.#_slides = this.querySelectorAll(
			'div.overflow-slide-inner'
		);

		this.#_s_options = this.querySelectorAll(
			'div.slide-option-inner'
		);

		this.#_w_feature.classList.remove('feature-empty-inner');
		this.#_resize();

		this.#_render_feature = true;
	}

	#_featureBlockEmpty()
	{
		while (this.#_w_feature.hasChildNodes())
		{
			this.#_w_feature.removeChild(this.#_w_feature.firstChild);
		}

		this.#_w_feature.classList.add('feature-empty-inner');

		const f_title = document.createElement('div');
		f_title.classList.add('feature-title-inner');
		f_title.innerHTML = this.#_config.feature_title;
		this.#_w_feature.appendChild(f_title);

		const f_desc = document.createElement('div');
		f_desc.classList.add('feature-desc-inner');
		f_desc.innerHTML = this.#_config.feature_desc;
		this.#_w_feature.appendChild(f_desc);

		this.#_slides = this.querySelectorAll(
			'div.overflow-slide-inner'
		);

		this.#_s_options = this.querySelectorAll(
			'div.slide-option-inner'
		);

		this.#_resize();
		this.#_render_feature = false;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('compare-shop', CompareShopElement);
});