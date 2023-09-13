class CompareWrapperElement extends HTMLElement
{
	#_config;
	#_btn_all_clear;
	#_checked_all;
	#_checked_difference;
	#_btn_clear;
	#_features;
	#_header_splide;
	#_feature_splide;
	#_footer_splide;
	#_feature_init = false;
	#_feature_title;
	#_feature_columns = new Array;

	connectedCallback()
	{
		if (this.classList.contains('empty'))
		{
			return;
		}

		this.#_config = _config.get(this.id);

		this.#_btn_all_clear = this.querySelector(
			'button.btn-compare-clear'
		);

		let dfrhsrtyjsdtxykdyuk = {
			language: this.#_config.language_all
		};

		let all_clear_modal = new Modal(this.#_btn_all_clear, dfrhsrtyjsdtxykdyuk);

		all_clear_modal.on('render_body', function () {

			all_clear_modal.modal_body.html($('<div />', {
				html: all_clear_modal.language.clear_text,
				css: {
					'line-height': '20px',
					'text-align': 'center',
					'margin-bottom': '20px'
				}
			}));

			all_clear_modal.btn_send = $('<button />', {
				html: all_clear_modal.language.btn_send,
				class: 'modal-compare-clear-btn',
				type: 'button'
			});

			all_clear_modal.btn_close = $('<button />', {
				html: all_clear_modal.language.btn_close,
				class: 'modal-compare-close-btn',
				type: 'button'
			});

			all_clear_modal.modal_body.append($('<div />', {
				html: [
					all_clear_modal.btn_send,
					all_clear_modal.btn_close
				],
				css: {
					display: 'flex',
					gap: '1.25rem'
				}
			}));

			all_clear_modal.btn_send.on('click', function () {
				$.ajax({
					method: 'POST',
					dataType: 'json',
					data: {
						option: 'com_shop',
						task: 'ajax.compare_all_clear',
						format: 'json'
					},
					success: (result) => {
						if (result.success !== true)
						{
							alert(result.message);
							console.error(result.message);

							return true;
						}

						location.reload();
					}
				});
			});

			all_clear_modal.btn_close.on('click', function () {
				all_clear_modal.modal_close.trigger('click');
			});
		});

		this.#_checked_all = this.querySelector(
			'div.checkbox-item-inner[data-type="all"]'
		);

		this.#_checked_all.addEventListener(
			'click', _ => { this.#_clickAll() }
		);

		this.#_checked_difference = this.querySelector(
			'div.checkbox-item-inner[data-type="difference"]'
		);

		this.#_checked_difference.addEventListener(
			'click', _ => { this.#_clickDifference() }
		);

		this.#_btn_clear = this.querySelector(
			'button.link-item-inner'
		);

		if (this.#_btn_clear instanceof HTMLButtonElement)
		{
			let esfse = {
				language: this.#_config.language_type
			};

			let clear_modal = new Modal(this.#_btn_clear, esfse);

			clear_modal.on('render_body', function () {

				clear_modal.modal_body.html($('<div />', {
					html: clear_modal.language.clear_text,
					css: {
						'line-height': '20px',
						'text-align': 'center',
						'margin-bottom': '20px'
					}
				}));

				clear_modal.btn_send = $('<button />', {
					html: clear_modal.language.btn_send,
					class: 'modal-compare-clear-btn',
					type: 'button'
				});

				clear_modal.btn_close = $('<button />', {
					html: clear_modal.language.btn_close,
					class: 'modal-compare-close-btn',
					type: 'button'
				});

				clear_modal.modal_body.append($('<div />', {
					html: [
						clear_modal.btn_send,
						clear_modal.btn_close
					],
					css: {
						display: 'flex',
						gap: '1.25rem'
					}
				}));

				clear_modal.btn_send.on('click', function () {
					$.ajax({
						method: 'POST',
						dataType: 'json',
						data: {
							option: 'com_shop',
							task: 'ajax.compare_type_clear',
							format: 'json'
						},
						success: (result) => {
							if (result.success !== true)
							{
								alert(result.message);
								console.error(result.message);

								return true;
							}

							location.href = result.redirect;
						}
					});
				});

				clear_modal.btn_close.on('click', function () {
					clear_modal.modal_close.trigger('click');
				});
			});
		}

		// eurosp6o_prod
		// 80My8&um

		this.#_features = this.querySelectorAll(
			'div.list-item-inner[data-id]'
		);

		for (const feature of this.#_features)
		{
			feature.active = false;
			feature.values = new Array;

			const items = this.querySelectorAll(
				'div.item-feature-inner[data-id="' + feature.dataset.id + '"]'
			);

			for (const item of items)
			{
				const parent = item.parentElement;
				const id = parent.dataset.productId;

				feature.values[id] = item.dataset.value;
			}

			feature.addEventListener(
				'click', _ => { this.#_clickFeature(feature); }
			);
		}

		this.#_footer_splide = new Splide(
			'div#' + this.#_config.footer_splide,
			Object.assign({ arrows: false }, this.#_config.splide)
		);

		this.#_header_splide = new Splide(
			'div#' + this.#_config.header_splide,
			this.#_config.splide
		);

		this.#_header_splide.sync(this.#_footer_splide);

		this.#_header_splide.mount();
		this.#_footer_splide.mount();

		const columns = this.querySelectorAll(
			'li.product-item-inner[data-product-id]'
		);

		for (const column of columns)
		{
			const slide = document.createElement('li');
			slide.classList.add('splide__slide');
			slide.classList.add('product-item-inner');
			slide.dataset.productId = column.dataset.productId;

			this.#_feature_columns.push(slide);
		}

		const content = this.querySelector(
			'.compare-content-inner'
		);

		const header = this.querySelector(
			'.compare-header-inner'
		);

		const footer = this.querySelector(
			'.compare-footer-inner'
		);

		let offsetTop = 0;

		const map_parent = (parent) => {
			offsetTop += parent.offsetTop;

			if (parent.parentElement !== null
				&& (parent.parentElement !== document.body))
			{
				map_parent(parent.parentElement);
			}
		};

		let height = header.clientHeight, height_1 = 0, state = false;
		map_parent(footer.parentElement);

		const fixed_minus = (window.innerWidth >= 576 ? 100 : 250);
		const in_minus = (window.innerWidth >= 576 ? 0 : 200);


		document.addEventListener('scroll', _ => {
			if (pageYOffset >= (offsetTop - fixed_minus))
			{
				if (!state)
				{
					header.classList.add('fixed');

					if (height_1 === 0)
					{
						height_1 = header.clientHeight;
					}

					content.style.paddingTop = (height - height_1) + 'px';
					state = true;
				}
			}
			else
			{
				state = false;
				content.removeAttribute('style');
				header.classList.remove('fixed');
			}

			if (pageYOffset > (offsetTop - in_minus))
			{
				header.classList.add('in');
			}
			else
			{
				header.classList.remove('in');
			}
		});
	}

	#_clickAll()
	{
		this.#_checked_difference.classList.remove('active');
		this.#_checked_all.classList.add('active');

		let items = this.querySelectorAll(
			'div.difference'
		);

		for (const item of items)
		{
			item.removeAttribute('style');
		}
	}

	#_clickDifference()
	{
		this.#_checked_all.classList.remove('active');
		this.#_checked_difference.classList.add('active');

		let items = this.querySelectorAll(
			'div.difference'
		);

		for (const item of items)
		{
			item.style.display = 'none';
		}
	}

	#_clickFeature(feature)
	{
		if (this.#_feature_init === false)
		{
			this.#_feature_init = true;
			this.#_featureInit();
		}

		if (feature.active === true)
		{
			feature.classList.remove('active');
			this.#_feature_title.removeChild(feature.title_item);

			feature.elements.forEach((element) => {
				element.parentElement.removeChild(element);
			});

			let count = 0;

			for (const _item of this.#_features)
			{
				if (_item === feature)
				{
					continue;
				}

				if (!_item.active)
				{
					continue;
				}

				count = (count + 1);
			}

			if (count <= 0)
			{
				const el_splide = this.querySelector(
					'div#' + this.#_config.feature_splide
				);

				while (el_splide.hasChildNodes())
				{
					el_splide.removeChild(el_splide.firstChild);
				}

				el_splide.classList.add('empty');

				const f_title = document.createElement('div');
				f_title.classList.add('favorite-alert-inner');
				f_title.innerHTML = this.#_config.favorite_empty;
				el_splide.appendChild(f_title);

				this.#_feature_init = false;
			}
		}
		else
		{
			feature.classList.add('active');

			feature.title_item = document.createElement('div');
			feature.title_item.classList.add('title-item-inner');
			feature.title_item.classList.add('active');
			feature.title_item.innerHTML = feature.dataset.title;
			this.#_feature_title.appendChild(feature.title_item);

			feature.title_item.addEventListener('click', _ => {
				this.#_clickFeature(feature);
			});

			feature.elements = new Array;

			for (const column of this.#_feature_columns)
			{
				const id = Number(column.dataset.productId);

				const _item = document.createElement('div');
				_item.classList.add('item-feature-inner');
				column.appendChild(_item);

				feature.elements.push(_item);

				if (feature.values.hasOwnProperty(id))
				{
					_item.innerHTML = feature.values[id];
				}
				else
				{
					_item.innerHTML = '-';
				}				
			}
		}

		feature.active = !feature.active;
	}

	#_featureInit()
	{
		const el_splide = this.querySelector(
			'div#' + this.#_config.feature_splide
		);

		while (el_splide.hasChildNodes())
		{
			el_splide.removeChild(el_splide.firstChild);
		}

		el_splide.classList.remove('empty');

		this.#_feature_title = document.createElement('div');
		this.#_feature_title.classList.add('favorite-title-inner');
		el_splide.appendChild(this.#_feature_title);

		const splide = document.createElement('div');
		splide.classList.add('splide');
		splide.id = this.#_config.feature_splide + '_demo';
		el_splide.appendChild(splide);

		const track = document.createElement('div');
		track.classList.add('splide__track');
		splide.appendChild(track);

		const list = document.createElement('ul');
		list.classList.add('splide__list');
		track.appendChild(list);

		for (const column of this.#_feature_columns)
		{
			list.appendChild(column);
		}

		this.#_feature_splide = new Splide('#' + splide.id,
			Object.assign({ arrows: false }, this.#_config.splide)
		);

		this.#_feature_splide.mount();
		this.#_header_splide.sync(this.#_feature_splide);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('compare-wrapper', CompareWrapperElement);
});