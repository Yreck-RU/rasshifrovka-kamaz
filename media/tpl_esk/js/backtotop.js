/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://paket.rusbid.de/
 */

const button = document.querySelector(
	'button.page-backtotop-inner'
);

if (pageYOffset > 500)
{
	button.classList.add('active');
}

button.addEventListener('click', _ => {
	window.scroll({
		behavior: 'smooth', top: 0
	});

	button.classList.remove('active');
});

document.addEventListener('scroll', _ => {
	if (pageYOffset > 500)
	{
		button.classList.add('active');
	}
	else
	{
		button.classList.remove('active');
	}
});