var mainJS = (function () {

	/*Функция установки класса .active*/
	function addActiveClass(elem) {
		var activeBefore = document.querySelector('.active'),
			activeAfter = elem.target.closest('LI');
		if (activeBefore && activeBefore !== activeAfter) {
			activeBefore.classList.toggle('active');
			activeAfter.classList.toggle('active');
		} else {
			activeAfter.classList.toggle('active');
		}
	}

	/*Функция прослушивания события клика*/
	function _setUpListners() {
		document.querySelector('.accordeon').addEventListener('click', addActiveClass);
	}

	/*Функция инициализации модуля*/
	function init() {
		_setUpListners();
	}

	/*Возвращаем объект из модуля*/
	return {
		init: init
	}
})();

mainJS.init();