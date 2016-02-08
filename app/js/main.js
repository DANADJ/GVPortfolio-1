//Основоной модуль
var mainJS = (function () {

     //Универсальная функция AJAX запроса для валидации формы в JS
     var _ajaxFormJSValidation = function (form) {
          var resultJSValidation = true;
          if (!validation.validateForm(form)) {resultJSValidation = false;}
          return resultJSValidation;
     };

     //Универсальная функция AJAX запроса к серверу для выполнения задачи
     var _ajaxForServer = function (form, url) {
          var data = form.serialize(),//создаю ассоциативный массив DATA и сохраняю в него данные из формы
              phpAnswer = $.ajax({ //создаю переменную с запросом на сервер
                    url: url, //указываю путь к файлу обработчику
                    type: 'POST', //указываю способ передачи данных
                    dataType: 'JSON', //указываю формат передачи данных
                    data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
          }).fail(function () {
               form.find('.error-mes').show();
          });
          return phpAnswer;//возвращаю результат обращения к серверу
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
                         succesBox = form.find('.succes-mes');
                         errorBox = form.find('.error-mes');
                         formGroup = form.find('.form-group');
                         addButton = form.find('.add-button');
                         if (ans.status === 'ok') {
                             errorBox.hide();
                             formGroup.hide();
                             addButton.hide();
                             succesBox.show();
                         } else {
                             succesBox.hide();
                             errorBox.show();
                         }
                    } else {
                         var modalWindow_sendMessage = $('#modalWindow-sendMessage');
                         succesBox = modalWindow_sendMessage.find('.succes-mes');
                         errorBox = modalWindow_sendMessage.find('.error-mes');
                         modalWindow_sendMessage.bPopup({
                              onClose: function () {
                                   modalWindowForm.find('.server-mes').hide();
                              }
                         });
                         if (ans.status === 'ok') {
                             errorBox.hide();
                             succesBox.show();
                         } else {
                             succesBox.hide();
                             errorBox.show();
                         }
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
          $('#add-new-project').click(function (event) {
               event.preventDefault();
               var modalWindow = $('#modalWindow-addNewProject'),
                modalWindowForm = modalWindow.find('#modalWindow-addNewProject-form');

               _showModalWindow(modalWindow, modalWindowForm);
          });
	 
		//Прослушка нажатия кнопки отправки формы добавления проекта 
          $('#modalWindow-addNewProject-form').submit(function (event) {
               event.preventDefault();
               _validation_server_answer('php/add_new_project.php', $('#modalWindow-addNewProject-form'));
          });
		
          //Прослушка нажатия кнопки аторизации
		$('#login').click(function(event){
			event.preventDefault();
			var modalWindow = $('#modalWindow-autorization'),
				moalWindowForm = modalWindow.find('#modalWindow-autorization-form');
			
			_showModalWindow(modalWindow, moalWindowForm);
		});
	
		//Прослушка нажатия кнопки отправки формы авторизации
          $('#modalWindow-autorization-form').submit(function (event) {
               event.preventDefault();
               _validation_server_answer('php/login.php', $('#modalWindow-autorization-form'));
          });
	
          //Прослушка кнопки отправки формы
          $('#contactForms').on('submit', _submitForm_contactWithMe);
          
          //Прослушка нажатия на фэйковую форму загрузки картинки и генерации клика по полю загрузки файла
          $('#modalWindow-addNewProject-label, .modalWindow-addNewProject-input-img').on('click', function () {
               $('#fileUpload').trigger('click');
          });
               
          //Прослушка выбора файла на поле загрузки файла и вставка его значения в фэйковое поле загрузки картинки
          $('#fileUpload').on('change', function () {
               $('.modalWindow-addNewProject-input-fake').val($(this).val()).qtip('destroy', true);
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