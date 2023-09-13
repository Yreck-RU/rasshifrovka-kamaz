class CatalogShopElement extends HTMLElement
{
	#_button;
	#_tablist;
	#_tabcontent;
	#_active = false;
	#_tabId;

	connectedCallback()
	{
		this.#_button = document.querySelector(
			'button.main-catalog-inner'
		);

		this.#_button.addEventListener(
			'click', _ => (this.#_active ? this.hide() : this.show())
		);

		const s_catalog = document.querySelector(
			'button.sidebar-link-inner.catalog'
		);

		s_catalog.addEventListener(
			'click', _ => (this.#_active ? this.hide() : this.show())
		);

		const c_close = this.querySelector(
			'button.header-close-inner'
		);

		c_close.addEventListener('click', _ => this.hide());

		document.addEventListener('click', _ => {
			if (event.target === this.#_button) return;
			if (event.target === s_catalog) return;
			if (!this.contains(event.target)) this.hide();
		});

		this.#_tablist = document.querySelector(
			'div.catalog-tablist-inner'
		);

		this.#_tabcontent = document.querySelector(
			'div.catalog-tabcontent-inner'
		);

		const items = this.#_tablist.querySelectorAll(
			'a.tablist-item-inner[data-tab-id]'
		);

		const tabs = this.#_tabcontent.querySelectorAll(
			'div.tabcontent-item-inner[id]'
		);

		if (self.innerWidth >= 768)
		{
			tabs.item(0).classList.add('active');
			tabs.item(0).classList.add('in');
		}

		this.#_tabId = tabs.item(0).id;
		const selected = new Object;
		let active;

		for (const item of items)
		{
			const tabId = item.dataset.tabId;
			const tab = this.querySelector('#' + tabId);

			selected[tabId] = false;

			item.addEventListener('click', _ => {
				if (self.innerWidth < 768)
				{
					event.preventDefault();
				}

				if (active === tabId) return;

				for (const _tab of tabs)
				{
					_tab.classList.remove('in');
					_tab.classList.remove('active');
				}

				tab.classList.add('active');
				setTimeout(_ => tab.classList.add('in'), 50);

				this.#_tabId = tabId;
				active = tabId;
			});

			const h_title = tab.querySelector(
				'div.header-title-inner'
			);

			const button_prev = h_title.querySelector(
				'button.title-close-inner'
			);

			button_prev.addEventListener('click', _ => {
				tab.classList.remove('in');
				tab.classList.remove('active');
			});

			const button_close = tab.querySelector(
				'button.header-close-inner'
			);

			button_close.addEventListener('click', _ => {
				this.hide();

				tab.classList.remove('in');
				tab.classList.remove('active');
			});

			const mores = tab.querySelectorAll(
				'button.category-more-inner'
			);

			mores.forEach((more) => more.addEventListener('click', _ => {
				const parent = more.parentElement;
				const textOff = more.dataset.off;
				const textNo = more.dataset.no;

				const items = parent.querySelectorAll(
					'a.category-link-inner'
				);

				Array.from(items).slice(11).forEach((item) => {
					if (selected[tabId] === true)
					{
						item.classList.add('hidden');
					}
					else
					{
						item.classList.remove('hidden');
					}
				});

				if (selected[tabId] === true)
				{
					more.innerHTML = textOff;
					more.classList.remove('active');
				}
				else
				{
					more.innerHTML = textNo;
					more.classList.add('active');
				}

				selected[tabId] = !selected[tabId];
			}));

			item.addEventListener('mouseover', _ => {
				if (this.#_tabId === tabId) return;

				for (const _tab of tabs)
				{
					_tab.classList.remove('in');
					_tab.classList.remove('active');
				}

				tab.classList.add('active');
				setTimeout(_ => tab.classList.add('in'), 50);

				this.#_tabId = tabId;
			});

			if (item.classList.contains('active'))
			{
				this.#_tabId = tabId;
			}
		}
	}

	show()
	{
		if (this.#_active) return;

		this.#_button.classList.add('active');
		this.classList.add('active');

		setTimeout(_ => {
			this.classList.add('in');
			this.#_active = true;
		}, 50);
	}

	hide()
	{
		if (!this.#_active) return;

		this.#_active = false;
		this.classList.remove('in');
		this.#_button.classList.remove('active');

		setTimeout(_ => this.classList.remove('active'), 50);
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	customElements.define('catalog-shop', CatalogShopElement);
});