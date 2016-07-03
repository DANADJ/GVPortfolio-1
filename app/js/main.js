//Основоной модуль
var mainJS = (function () {

	//Универсальная функция AJAX запроса для валидации формы в JS
	var _ajaxFormJSValidation = function (form) {
		var resultJSValidation = true;
		if (!validation.validateForm(form)) {
			resultJSValidation = false;
		}
		return resultJSValidation;
	};

	//Универсальная функция AJAX запроса к серверу для выполнения задачи
	var _ajaxForServer = function (form, url) {
		var data = form.serialize();//создаю ассоциативный массив DATA и сохраняю в него данные из формы
		return $.ajax({ //создаю переменную с запросом на сервер
			url: url, //указываю путь к файлу обработчику
			type: 'POST', //указываю способ передачи данных
			dataType: 'JSON', //указываю формат передачи данных
			data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
		}).fail(function () {
			if (url !== 'php/contact_with_me.php') {
				form.find('#error-server').show();
			} else {
				var modalWindow_sendMessage = $('#form-message-status');
				modalWindow_sendMessage.find('#error-server').show();
				modalWindow_sendMessage.bPopup({
					onClose: function () {
						modalWindow_sendMessage.hide();
					}
				});
			}

		});
	};

	//Универсальная функция запуска JS валидации, отправки данных на сервер и вывода результа пользователю
	var _validation_server_answer = function (url, modalWindowForm) {
		var form = modalWindowForm,
			target_url = url,//путь к файлу обработчику
			resultValidation = _ajaxFormJSValidation(form); //результат проверки формы на заполненность полей в JS
		if (resultValidation === true) {
			var serverAnswer = _ajaxForServer(form, target_url);//массив с результатом обращения к серверу
			serverAnswer.done(function (ans) {
				var succesBox, errorBox, formGroup, addButton;
				if (target_url !== 'php/contact_with_me.php') {
					succesBox = form.find('#succes');
					errorBox = form.find('#error');
					formGroup = form.find('#form-inputs');
					addButton = form.find('#form-buttons');
					if (ans.status === 'ok') {
						errorBox.hide();
						formGroup.hide();
						addButton.hide();
						succesBox.show();
					} else {
						errorBox.show();
					}
				} else {
					var modalWindow_sendMessage = $('#form-message-status');
					succesBox = modalWindow_sendMessage.find('#succes');
					errorBox = modalWindow_sendMessage.find('#error-server');
					if (ans.status === 'ok') {
						//errorBox.hide();
						succesBox.show();
					} else {
						//succesBox.hide();
						errorBox.show();
					}
					modalWindow_sendMessage.bPopup({
						onClose: function () {
							modalWindow_sendMessage.hide();
						}
					});
				}
			});
		}
	};

	//Функция вывода модального окна
	var _showModalWindow = function (modalWindow, modalWindowForm) {
		modalWindow.bPopup({
			onClose: function () {
				modalWindowForm.find('.server-mes').hide();
				modalWindowForm.find('.form-group').show();
				modalWindowForm.find('.add-button').show();
				modalWindowForm.find('input').val('');
				modalWindowForm.find('textarea').val('');
				$('.qtipBlock').qtip('destroy', true);
			}
		});
	};

	//Функция запуска проверки формы ОБРАТНОЙ СВЯЗИ при её отправке
	var _submitForm_contactWithMe = function (event) {
		event.preventDefault();//cброс стандартного поведения кнопки отправки даных формы
		var form = $(this),
			url = 'php/contact_with_me.php';//путь к файлу обработчику
		_validation_server_answer(url, form);
	};

	//Функция прослушивания событий
	var _setUpListners = function () {

		//Прослушка нажатия кнопки добавления проекта
		$('.add-new-work').click(function (event) {
			event.preventDefault();
			var modalWindow = $('#form-add-work'),
				modalWindowForm = modalWindow.find('#form-add-work__form');
			_showModalWindow(modalWindow, modalWindowForm);
		});

		//Прослушка нажатия кнопки отправки формы добавления проекта
		$('#form-add-work__form').submit(function (event) {
			event.preventDefault();
			_validation_server_answer('php/add_new_project.php', $('#form-add-work__form'));
		});

		//Прослушка нажатия кнопки отправки формы авторизации
		$('#login-window__form').submit(function (event) {
			event.preventDefault();
			_validation_server_answer('php/login.php', $('#login-window__form'));
		});

		//Прослушка нажатия кнопки отправки формы обратной связи
		$('#feedback-form').on('submit', _submitForm_contactWithMe);

		//Прослушка нажатия на фэйковую форму загрузки картинки и генерации клика по полю загрузки файла
		$('#add-work__label, #add-work__fake-img, #add-work__fake-input').on('click', function () {
			$('#fileUpload').trigger('click');
		});

		//Прослушка выбора файла на поле загрузки файла и вставка его значения в фэйковое поле загрузки картинки
		$('#fileUpload').on('change', function () {
			$('#add-work__fake-input').val($(this).val()).qtip('destroy', true);
		});
		//Прослушка нажатия на кнопку мини-меню и вывода/скрытия меню
		$('#mini-menu').click(function () {
			$('#menu-navigation').toggle();
		});
	};

	//Функция инициализации модуля
	var init = function () {
		_setUpListners();
	};

	//Возвращаем объекты из модуля (публичные методы)
	return {
		init: init
	};
})();

mainJS.init();