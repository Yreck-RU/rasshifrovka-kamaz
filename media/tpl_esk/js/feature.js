class ProductFeatureElement extends HTMLElement
{
	#_config;
	#_tooltip;
	#_loader;
	#_id = 0;

	constructor()
	{
		super();

		this.#_config = _config.get('feature_tooltip');

		this.#_loader = new $.fn.Loader(this);
		this.#_id = Number(this.dataset.id);

		this.#_tooltip = new $.fn.tooltip.Constructor(this, {
			container: 'body',
			selector: true,
			html: true,
			placement: 'bottom',
			trigger: 'manual'
		});

		this.addEventListener('click', _ => {
			this.#_loader.start();

			window.captcha.trigger((token) => {
				this.#_captcha(token);
			});
		});

		document.addEventListener('click', _ => {
			if (event.target !== this)
			{
				this.#_tooltip.hide();
			}
		});
	}

	#_captcha(token)
	{
		$.ajax({
			data: {
				'g-recaptcha-response': token,
				task: 'ajax.product_feature',
				id: this.#_id,
				format: 'json'
			},
			method: 'POST',
			dataType: 'json',
			success: (result) => { this.#_success(result) },
			complete: _ => { this.#_loader.stop() }
		});
	}

	#_success(result)
	{
		if (result.success !== true)
		{
			alert(result.message);
			console.error(result.message);
		}
		else if (result.type === 'remove')
		{
			this.title = this.#_config.title_add;
			this.classList.remove('active');
		}
		else if (result.type === 'add')
		{
			this.title = this.#_config.title_remove;
			this.classList.add('active');
		}

		const a_feature = document.querySelector(
			'a.feature-btn'
		);

		if (result.total > 0)
		{
			
			a_feature.dataset.total = result.total;
		}
		else
		{
			a_feature.removeAttribute('data-total');
		}

		this.#_tooltip.options.title = $('<a />', {
			href: this.#_config.href,
			class: 'tooltip-link-page',
			html: this.#_config.html
		}).prop('outerHTML');

		this.#_tooltip.show();
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-feature', ProductFeatureElement);
});