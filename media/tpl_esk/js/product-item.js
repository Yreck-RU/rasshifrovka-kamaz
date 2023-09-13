/*
(function ($) {
	'use strict';

	var print_offer = function () {
		printJS({
			printable: this.dataset.link,
			type: 'pdf',
			onPrintDialogClose: function () {
				if (typeof ym !== 'undefined') {
					ym(38120235, 'reachGoal', 'print')
				}

				if (typeof gtag !== 'undefined') {
					gtag('event', 'print', { 'event_category': 'product' });
				}
			}
		});
	};

	$(document).ready(function () {
		$('.btn-print-offer').on('click', print_offer);
	});

})(jQuery);
*/

class ProductItemElement extends HTMLElement
{
	#_request_price;

	#_link_compare;
	#_btn_compare;

	connectedCallback()
	{
		this.#_request_price = this.querySelector(
			'button.request-price'
		);

		this.#_btn_compare = this.querySelector(
			'button.action-button-inner.compare'
		);

		this.#_link_compare = document.querySelector(
			'a.right-link-inner.compare'
		);

		if (this.#_btn_compare !== null)
		{
			this.#_btn_compare.addEventListener(
				'click', _ => this.#_clickCompare()
			);
		}
	}

	#_clickCompare()
	{
		const request = new FetchRequest;

		request.set('option', 'com_shop');
		request.set('task', 'product.compare');
		request.set('format', 'json');

		request.addEventListener('complete_', _ => {
			// this.#_btn_loader.stop();
		});

		request.addEventListener('success', _ => {
			if (event.detail.type === 'remove')
			{
				this.#_btn_compare.classList.remove('active');
			}
			else if (event.detail.type === 'add')
			{
				this.#_btn_compare.classList.add('active');
			}

			this.#_btn_compare.title = event.detail.label;
			this.#_link_compare.dataset.total = event.detail.total;
		});

		const link = this.querySelector('a.body-title-inner');
		request.send(link.href, 'POST');
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('product-item', ProductItemElement);
	// console.log(document.querySelectorAll('product-item'));
});