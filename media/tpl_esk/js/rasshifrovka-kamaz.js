//==================================================================================================================================================
//Спойлеры - "Начало"
//==================================================================================================================================================

const spollersArray = document.querySelectorAll('._rasshifrovka-kamaz-spoilers');
if (spollersArray.length > 0) {

	for (let i = 0; i < spollersArray.length; i++) {
		let spollerArray = spollersArray[i];
		let spollerArrayUls = spollerArray.querySelectorAll('ul');
		
		for (let i = 0; i < spollerArrayUls.length; i++) {
			let spollerArrayUl = spollerArrayUls[i];
			const h = spollerArrayUl.clientHeight;
			spollerArrayUl.classList.toggle('_active');
			spollerArrayUl.style.height = 0 + "px";

			let spollerArrayUlButton = spollerArrayUl.previousElementSibling;
			spollerArrayUlButton.classList.add('_title');
			spollerArrayUlButton.addEventListener("click", function (e) {
				spollerArrayUlButton.classList.toggle('_active');
				spollerArrayUl.classList.toggle('_active');
				
				if (spollerArrayUlButton.classList.contains('_active')) {
					spollerArrayUl.style.height = h + "px";
				} else {
					spollerArrayUl.style.height = 0 + "px";
				}
			});
		}
	}

}

//==================================================================================================================================================
//Спойлеры - "Конец"
//==================================================================================================================================================
