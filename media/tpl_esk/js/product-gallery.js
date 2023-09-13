/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class ProductGalleryElement extends HTMLElement
{
	#_lightbox = new GalleryLightbox;

	#_image = this.querySelector(
		'div.gallery-full-inner img'
	);

	connectedCallback()
	{
		this.#_image.addEventListener(
			'click', _ => this.#_lightbox.show()
		);

		const thumbs = this.querySelectorAll(
			'div.thumb-item-inner img'
		);

		Array.from(thumbs).forEach((thumb, key) => {
			thumb.addEventListener('click', _ => this.#_lightbox.show(key));
		});
	}
}

class GalleryLightbox extends Collection
{
	#_config = config.get('product-gallery');
	#_element = document.createElement('div');
	#_background = document.createElement('img');
	#_header = document.createElement('div');
	#_counter = document.createElement('div');
	#_title = document.createElement('div');
	#_btn_close = document.createElement('button');
	#_content = document.createElement('div');
	#_fullscreen = document.createElement('div');
	#_fullimage = document.createElement('img');
	#_thumb = document.createElement('div');
	#_btn_prev = document.createElement('button');
	#_thumb_list = document.createElement('div');
	#_btn_next = document.createElement('button');
	#_scroll = document.createElement('div');
	#_sidebar = document.createElement('div');
	#_offer = document.createElement('div');
	#_index = 0;

	constructor()
	{
		super();

		document.addEventListener('wheel', (e) => {
			if (e.target === this.#_fullimage) e.preventDefault();
		}, { passive: false });

		this.#_element.classList.add('page-lightbox-inner');

		this.#_background.classList.add('lightbox-background-inner');
		this.#_element.appendChild(this.#_background);

		this.#_header.classList.add('lightbox-header-inner');
		this.#_element.appendChild(this.#_header);

		this.#_counter.classList.add('header-counter-inner');
		this.#_counter.innerHTML = '/';
		this.#_counter.dataset.current = 1;
		this.#_counter.dataset.total = this.#_config.images.length;
		this.#_header.appendChild(this.#_counter);

		this.#_title.classList.add('header-title-inner');
		this.#_title.innerHTML = this.#_config.title;
		this.#_header.appendChild(this.#_title);

		this.#_btn_close.setAttribute('type', 'button');
		this.#_btn_close.classList.add('header-close-inner');
		this.#_btn_close.addEventListener('click', _ => this.hide());
		this.#_header.appendChild(this.#_btn_close);

		this.#_content.classList.add('lightbox-content-inner');
		this.#_element.appendChild(this.#_content);

		this.#_fullscreen.classList.add('lightbox-fullscreen-inner');
		this.#_element.appendChild(this.#_fullscreen);

		this.#_fullimage.classList.add('fullscreen-image-inner');
		this.#_fullimage.addEventListener('click', _ => this.#_clickSelectedHide());
		this.#_fullscreen.appendChild(this.#_fullimage);

		this.#_thumb.classList.add('content-thumb-inner');
		this.#_content.appendChild(this.#_thumb);

		this.#_btn_prev.setAttribute('type', 'button');
		this.#_btn_prev.classList.add('thumb-button-inner');
		this.#_btn_prev.classList.add('button-prev-inner');
		this.#_btn_prev.addEventListener('click', _ => this.#_movePrev());
		this.#_thumb.appendChild(this.#_btn_prev);

		this.#_thumb_list.classList.add('thumb-list-inner');
		this.#_thumb.appendChild(this.#_thumb_list);

		this.#_btn_next.setAttribute('type', 'button');
		this.#_btn_next.classList.add('thumb-button-inner');
		this.#_btn_next.classList.add('button-next-inner');
		this.#_btn_next.addEventListener('click', _ => this.#_moveNext());
		this.#_thumb.appendChild(this.#_btn_next);

		this.#_scroll.classList.add('content-scroll-inner');
		this.#_content.appendChild(this.#_scroll);

		this.#_sidebar.classList.add('content-sidebar-inner');
		this.#_content.appendChild(this.#_sidebar);

		if (this.#_config.hasOwnProperty('price'))
		{
			this.#_offer.classList.add('sidebar-offer-inner');
			this.#_sidebar.appendChild(this.#_offer);

			const o_price = document.createElement('div');
			o_price.classList.add('offer-price-inner');
			this.#_offer.appendChild(o_price);

			const p_title = document.createElement('div');
			p_title.classList.add('price-title-inner');
			p_title.innerHTML = this.#_config.t_price;
			o_price.appendChild(p_title);

			const p_value = document.createElement('div');
			p_value.classList.add('price-value-inner');
			p_value.innerHTML = this.#_config.price;
			o_price.appendChild(p_value);

			if (this.#_config.hasOwnProperty('leasing'))
			{
				const o_leasing = document.createElement('div');
				o_leasing.classList.add('offer-leasing-inner');
				this.#_offer.appendChild(o_leasing);

				const l_title = document.createElement('div');
				l_title.classList.add('leasing-title-inner');
				l_title.innerHTML = this.#_config.t_leasing;
				o_leasing.appendChild(l_title);

				const l_value = document.createElement('div');
				l_value.classList.add('leasing-value-inner');
				l_value.innerHTML = this.#_config.leasing;
				o_leasing.appendChild(l_value);
			}

			const p_request = document.createElement('purchase-request');
			p_request.setAttribute('type', 'button');
			p_request.setAttribute('data-id', this.#_config.id);
			p_request.classList.add('offer-purchase-inner');
			this.#_offer.appendChild(p_request);

			const span = document.createElement('span');
			span.classList.add('purchase-text-inner');
			span.innerHTML = this.#_config.p_request;
			p_request.appendChild(span);
		}
		else
		{
			const p_request = document.createElement('purchase-request');
			p_request.setAttribute('type', 'button');
			p_request.setAttribute('data-id', this.#_config.id);
			p_request.classList.add('offer-purchase-inner');
			this.#_sidebar.appendChild(p_request);

			const span = document.createElement('span');
			span.classList.add('purchase-text-inner');
			span.innerHTML = this.#_config.p_request;
			p_request.appendChild(span);
		}

		this.#_config.images.forEach(
			(thumb, i) => this.append(thumb, i)
		);
	}

	show(index = 0)
	{
		if (!document.body.contains(this.#_element))
		{
			document.body.appendChild(this.#_element);
		}

		setTimeout(_ => {
			this.#_element.classList.add('show');

			if (this.has(index))
			{
				this.#_clickActive(this.item(index));
			}
		}, 100);
	}

	hide()
	{
		this.#_element.classList.remove('show');

		setTimeout(_ => {
			if (document.body.contains(this.#_element)) document.body.removeChild(this.#_element);
		}, 200);
	}

	append(result, index)
	{
		result.element = document.createElement('div');
		result.element.classList.add('list-image-inner');
		this.#_thumb_list.appendChild(result.element);

		result.thumb = document.createElement('img');
		result.thumb.src = result.sm;
		result.element.appendChild(result.thumb);

		result.thumb.addEventListener(
			'click', _ => this.#_clickActive(result, false)
		);

		result.img = document.createElement('img');
		result.img.classList.add('scroll-image-inner');
		result.img.src = result.lg;
		this.#_scroll.appendChild(result.img);

		result.img.addEventListener(
			'click', _ => this.#_clickSelectedShow(result)
		);

		result.index = (index + 1);
		this.#_counter.dataset.total = (index + 1);

		super.append(result);
	}

	#_clickActive(result, state = true)
	{
		const items = this.filter(
			(item) => item.element.classList.contains('active')
		);

		items.each((item) => {
			item.element.classList.remove('active');
		});

		result.element.classList.add('active');

		result.img.scrollIntoView({
			behavior: 'smooth', block: 'center'
		});

		if (state) result.thumb.scrollIntoView({
			behavior: 'smooth', block: 'center'
		});

		this.#_index = (result.index - 1);
		this.#_counter.dataset.current = result.index;
		this.#_background.src = result.lg;
	}

	#_clickSelectedShow(result)
	{
		this.#_header.classList.add('hidden');
		this.#_content.classList.add('hidden');

		this.#_background.src = result.lg;
		this.#_fullimage.src = result.lg;

		this.#_fullscreen.classList.add('show');

		setTimeout(_ => {
			this.#_fullscreen.classList.add('in');
		}, 100);
	}

	#_clickSelectedHide()
	{
		this.#_fullscreen.classList.remove('show');
		this.#_header.classList.remove('hidden');
		this.#_content.classList.remove('hidden');

		setTimeout(_ => {
			this.#_fullimage.removeAttribute('src');
			this.#_fullscreen.classList.remove('in');
		}, 100);
	}

	#_movePrev()
	{
		const prev = (this.#_index - 1);
		if (prev < 0) return;

		const result = this.item(prev);
		this.#_clickActive(result);
	}

	#_moveNext()
	{
		const next = (this.#_index + 1);
		if (next > this.length - 1) return;

		const result = this.item(next);
		this.#_clickActive(result);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-gallery', ProductGalleryElement);
});