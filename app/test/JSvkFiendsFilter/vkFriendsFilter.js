;
var myApp = (function () {

	/*Переменные*/
	var dataLS = getLocalStorage(),//Данные из LS
		dataVK,//Данные из VK.COM
		arrForFind,//Массив для поиска отфильтрованный от уже добавленных друзей
		parentList,//Список из которого был взят перетягиваемый элемент
		target,//Перетягиваемый элемент
		offsetX = 0,//Смещение от указателя до перетягиваемого элемента
		offsetY = 0,//Смещение от указателя до перетягиваемого элемента
		conteiner = document.getElementById('conteiner'),//Тело всего приложения
		inputFind = document.getElementById('findFriend'),//Поле поиска друзей в списке VK
		inputName = document.getElementById('nameList'),//Поле ввода названия Моего списка друзей
		myListFriends = document.getElementById('myListFriends'),//Мои список в DOM
		loadPage = pageReady();//Промис полной загрузки страницы

	/*Функция запуска не асинхронного кода*/
	function start() {
		inputName.value = dataLS.nameList;//Ввожу название моего списка полученного из LS в поле имени списка
		_addEventListeners();//Запускаю прослушку событий
		showFriends('myListFriends', dataLS.list);//Отображую список друзей полученный из LS
	}

	/*Проверка полной загрузки страницы*/
	function pageReady() {
		return new Promise(function (resolve) {
			if (document.readyState == 'complete') {
				start();//Запускаю код не зависящий от сервера VK.COM
				resolve();
			} else {
				start();//Запускаю код не зависящий от сервера VK.COM
				window.onload = resolve;
			}
		})
	}

	/*Функция подключения к SDK VK.COM*/
	function connectVK() {
		return new Promise(function (resolve, reject) {
			VK.init({
				apiId: 5573718
			});
			let cbLogin = function (response) {
				if (response.session) {
					resolve(response);
				} else {
					reject(new Error('Отмена авторизации!'));
				}
			};
			VK.Auth.login(cbLogin, 2);
		})
	}

	/*Функция получения списка друзей пользователя из VK.COM*/
	function getFriends() {
		return new Promise(function (resolve, reject) {
			VK.Api.call('friends.get', {'fields': 'nickname, photo_100'}, function (answer) {
				if (answer.error) {
					reject(new Error('error'));
				} else {
					dataVK = answer.response;
					resolve(answer.response);
				}
			})
		})
	}

	/*Функция получения данных из LocalStorage*/
	function getLocalStorage() {
		if (localStorage.myListFriends) {
			return JSON.parse(localStorage.myListFriends);
		} else {
			return {
				nameList: '',
				list: []
			};
		}
	}

	/*Функция вывода списка дрeзей на экран*/
	function showFriends(conteiner, listObj) {
		if (listObj) {
			var templateFn = Handlebars.compile(document.getElementById('listFriends').innerHTML);
			document.getElementById(conteiner).innerHTML = templateFn({list: listObj});
		}
	}

	/*Функция отфильтровки списка друзей VK от списка друзей LS и дальнейшего вывода актуального списка*/
	function filterVKListFriends(vkListFriends) {
		if (dataLS.list.length != 0) {//Если список друзей в LS не пуст...
			dataLS.list.forEach(function (val) {//...буру UID каждого друга в списке LS...
				var elem = vkListFriends.find(function (val) {//...и нахожу такой-же в загруженном списке из VK...
					return val.uid == this;
				}, val.uid);
				if (elem) {//...если такой элемент есть...
					elem.added = true;//...добавляю ему свойство ДОБАВЛЕННЫЙ, которое проверяется в шаблоне Handlebars
				}
			});
			showFriends('vkListFriends', vkListFriends);//передаю получившийся массив выводящей функции
		} else {
			showFriends('vkListFriends', vkListFriends);//передаю массив выводящей функции как есть, если массива в LS нет
		}
	}

	/*Функция отслеживания отпускания левой клавиши мыши и запуска соответствующего действия*/
	function whereMouseUp(event) {
		event.preventDefault();
		if (event.target.id == 'close') {
			window.close();
		} else if (event.target.id == 'saveList') {
			save();
		} else if (event.target.id == 'addOrDelButton' && event.target.closest('ul').id == 'vkListFriends') {
			addOrDel(event.target.closest('li'), true);
			arrForFind = filter(Array.prototype.slice.call(document.querySelectorAll('#vkListFriends .listItem')));//Перефильтровываю массив для поиска
		} else if (event.target.id == 'addOrDelButton' && event.target.closest('ul').id == 'myListFriends') {
			addOrDel(event.target.closest('li'), false);
			arrForFind = filter(Array.prototype.slice.call(document.querySelectorAll('#vkListFriends .listItem')));//Перефильтровываю массив для поиска
		} else if (event.target.id == 'addAll') {
			addAll('#vkListFriends', true);
			arrForFind = filter(Array.prototype.slice.call(document.querySelectorAll('#vkListFriends .listItem')));//Перефильтровываю массив для поиска
		} else if (event.target.id == 'delAll') {
			addAll('#myListFriends', false);
			arrForFind = filter(Array.prototype.slice.call(document.querySelectorAll('#vkListFriends .listItem')));//Перефильтровываю массив для поиска
		} else if (target) {//Если кнопка отпущена и перетягиваемый элемент существовал
			finishDragAndDrop(event);
		}
	}

	/*Функция сохранения данных в LocalStorage*/
	function save() {
		if (confirm('Сохранить новый созданный список?')) {
			if (dataLS.list.length != 0) {
				dataLS.nameList = inputName.value;
			} else {
				dataLS.nameList = '';
			}
			localStorage.myListFriends = JSON.stringify(dataLS);
		}
	}

	/*CB функция проверки отсутствия класса*/
	function cbAddAll(elem) {
		return !elem.classList.contains(this);
	}

	/*Функция добавления или удаления всех друзей в/из формируемого списка*/
	function addAll(list, action) {
		var actionList = Array.prototype.slice.call(document.querySelectorAll(list + ' .listItem'));//Создаю полноценный массив с
		// элементами списка друзей VK.COM
		if (actionList.some(cbAddAll, 'added')) {//если есть хоть один элемент не добавленый в свой список, то обрабатываю его/их
			actionList = actionList.filter(cbAddAll, 'added');//удаляю из рабоего массива уже добавленных друзей
			if (!actionList.every(cbAddAll, 'hidden')) {//если хоть у одного есть класс HIDDEN, значит работает поиск,
				actionList = actionList.filter(cbAddAll, 'hidden');//удаляю из рабочего массива друзей не проходящих поиск
			}
			actionList.forEach(function (elem) {
				addOrDel(elem, action);//добавляю всех дурезей из рабочего массива в свой список
			});
		}//если все друзья добавлены ничего не делаю
	}

	/*Функция добавления или удаления элемента по одному*/
	function addOrDel(elem, action) {//принимает на вход елемент DOM дерева, и флаг добавления/удаления
		var dataId = elem.getAttribute('data-id'), //получаю ID добавляемого друга
			elemLS;//готовлю переменную под обрабатываемый элемент
		if (action) {//если нужно добавить элемент
			myListFriends.appendChild(elem.cloneNode(true));//добавляю его в мой список в DOM именно клон элемента
			elemLS = dataVK.find(function (elem) {//нахожу этого друга в списке данных из VK...
				return elem.uid == this;
			}, dataId);
			dataLS.list.push(elemLS);//... и добавляю его в список данных в LS
		} else {//если нужно удолить элемент
			myListFriends.removeChild(elem);//удаляю его из моего списка в DOM
			elemLS = dataLS.list.findIndex(function (elem) {//нахожу этого друга в списке в LS по его ID
				return elem.uid == this;
			}, dataId);
			dataLS.list.splice(elemLS, 1);//... и удаляю его из этого списка
		}
		document.querySelector('[data-id ="' + dataId + '"]').classList.toggle('added');//Нахожу в списке VK в DOM этого друга и
		// отображаю/скрываю его
	}

	/*Функция поиска*/
	/*В вёрстке используется два скрывающих класса ADDED и HIDDEN. Первый всегда скрывает те элементы которые добавлены
	 * в МОЙ СПИСОК, второй скрывает элементы который не проходят проверку поиска*/
	function findFriend() {
		//console.time('allTime');
		var strInput = inputFind.value.toLowerCase();//получаю введёный символ в строке поиска и привожу его в нижнему регистру
		arrForFind.forEach(function (elem) {//перебираю поисковы массив и удалаю всем скрывающий класс HIDDEN если есть
			elem.classList.add('hidden');
		});
		arrForFind.forEach(function (elem) {//перебираю посковый массив и скрываю элементы котрые не прошли проверку
			if (elem.lastElementChild.innerText.toLowerCase().includes(strInput)) {
				elem.classList.remove('hidden');
			}
		});
		//console.timeEnd('allTime');

		//Варинат ниже, на удивление работает в 5 раз дольше
		/*console.time('allTime');
		 arrForFind.forEach(function (elem) {//перебираю посковый массив и скрываю элементы котрые не прошли проверку
		 elem.classList.add('hidden');
		 if (elem.lastElementChild.innerText.toLowerCase().includes(strInput)) {
		 elem.classList.remove('hidden');
		 }
		 });
		 console.timeEnd('allTime');*/
	}

	/*Функция отслеживания нажатия и удержания левой клавиши мыши*/
	function mouseDown(event) {
		if (!event.target.classList.contains('addOrDelButton')) {//если кнопка нажата не на добавляющий/удаляющий элемент...
			if (event.target.parentNode.classList.contains('listItem')) {//...то если род.элем имеет сласс listItem...
				target = event.target.closest('li');//...Создаю перетягиваемый элемент
				parentList = target.closest('ul').id;//...Запоминаю в каком списке он был взят
				offsetX = event.offsetX;//...Получаю размеры смещения
				offsetY = event.offsetY;
			}
		}
	}

	/*Функция отслеживания перетаскивания элемента*/
	function mouseMove(event) {
		if (target) {//если кнопка мыши не опущена и началось перетягивание
			target.style.top = (event.clientY - offsetY + 'px');//то меняю координаты перетягиваемого элемента
			target.style.left = (event.clientX - offsetX + 'px');
			target.style.position = 'fixed';//Вывоожу его из обзего потока DOM
			target.style.boxShadow = '0 0 10px gray';//И слегка меняю внешний вид
			target.style.borderRadius = '5px';
		}
	}

	/*Функция определения пространства над которым отпустили левую кнопку мыши*/
	function getFinishSpace(event) {
		target.classList.toggle('hidden');//Быстро скрываю перетаскиваемый элемент
		var space = document.elementFromPoint(event.clientX, event.clientY);//Получаю самый глубокий элемент под курсором
		target.classList.toggle('hidden');//Отображаю перетаскиваемый элемент
		if (space.closest('ul')) {//Если у элементы под курсором если родитель СПИСОК
			space = space.closest('ul').id;//Значит возвращаю его ID тем самым понимаю над какой область отпустили элементы
		}
		return space;//Возвращаю эту область
	}

	/*Функцыя отслеживания отпускания левой клавиши мыши*/
	function finishDragAndDrop(event) {
		var space = getFinishSpace(event);//узнаю над какой областью был отпущен элемент
		target.removeAttribute('style');
		if (space != parentList && space == 'myListFriends') {//если элемент был перенесён из списка VK в мой список
			addOrDel(target, true);
		} else if (space != parentList && space == 'vkListFriends') {//если элемент перенесён из моего списка в список VK
			addOrDel(target, false);
		}
		target = null;
	}

	/*Функция прослушивания событий*/
	function _addEventListeners() {
		conteiner.addEventListener('mouseup', whereMouseUp);//Слежу за кликами во всём теле приложения
		conteiner.addEventListener('mousedown', mouseDown);//Слежу за удержанием клавиши мыши
		conteiner.addEventListener('mousemove', mouseMove);//Слежу за перетягиванием элемента
		inputFind.addEventListener('input', findFriend);//слежу за вводом в строку поиска
	}

	/*Функция отфильтровки поискового масива от лишних элементов*/
	function filter(array) {
		return array.filter(function (elem) {
			return !elem.classList.contains('added');
		});
	}

	/*Ход выполнения*/
	function source() {
		loadPage.then(function () {//Жду полной загрузки страницы
			return connectVK();//Подключаюсь к SDK VK.COM
		}).then(function () {
			return getFriends();//Получаю список друзей пользователя из VK.COM
		}).then(function (answer) {
			filterVKListFriends(answer);//Фильтрую и вывожу список друзей пользователя из VK.COM
			arrForFind = filter(Array.prototype.slice.call(document.querySelectorAll('#vkListFriends .listItem')));//создаю массив
			//для поиска и отфильтровываю от него друзей которые уже добавлены в МОЙ СПИСОК
		})
	}


	/*Функция иницииализации модуля*/
	function init() {
		source();
	}

	return {init: init};
})
();

myApp.init();