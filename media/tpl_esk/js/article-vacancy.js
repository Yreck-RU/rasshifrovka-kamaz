/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

document.addEventListener('DOMContentLoaded', _ => {
	const items = document.querySelectorAll(
		'div.vacancy-item-inner'
	);

	let last_item;

	for (const item of items)
	{
		const header = item.querySelector(
			'div.item-header-inner'
		);

		header.addEventListener('click', _ => {
			if (last_item === item)
			{
				item.classList.remove('active');
				last_item = undefined;

				return;
			}

			items.forEach(
				(i) => i.classList.remove('active')
			);

			item.classList.add('active');
			last_item = item;
		});
	}
});