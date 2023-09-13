/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

document.addEventListener('DOMContentLoaded', _ => {
	const header = document.querySelector('div.page-header-inner');
	const top = header.querySelector('div.header-top-inner');
	const element = document.createElement('div');
	const height = (top.clientHeight / 16) + 'rem';
	const parent = top.parentElement;
	let state = false;

	document.addEventListener('scroll', _ => {
		if (window.outerWidth < 768) return;

		if (pageYOffset > 100 && !state)
		{
			element.style.height = height;
			parent.insertBefore(element, top);

			top.classList.add('fixed');
			setTimeout(_ => top.classList.add('in'), 150);
			state = true;
		}
		else if (pageYOffset < 100 && state)
		{
			top.classList.remove('in');
			state = false;

			setTimeout(_ => {
				top.classList.remove('fixed');
				if (parent.contains(element)) parent.removeChild(element);
			}, 150);
		}
	});
});