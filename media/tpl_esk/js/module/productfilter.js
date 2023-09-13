class ProductFilterElement extends HTMLElement
{
	#_config;
	#_owl;

	connectedCallback()
	{
		this.#_config = _config.get(this.id);

		this.#_owl = $(this).find('div.owl-carousel');
		this.#_owl.owlCarousel(this.#_config);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-filter', ProductFilterElement);
});