//Модуль добавления нового проекта
var addNewProject;
addNewProject = (function () {

    //Универсальная функция AJAX запроса для валидации формы
    var _ajaxFormJSValidation = function (form) {
        var resultJSValidation = true;
        if (!validation.validateForm(form)) {
            resultJSValidation = false;
        }
        return resultJSValidation;
    };

    //Универсальная функция AJAX запроса к серверу для выполнения задачи
    var _ajaxForServer = function (form, url) {

        var data = form.serialize(),//создаю ассоциативный массив DATA и сохраняем в него данные из формы
            phpAnswer = $.ajax({ //Создаю переменную RESULT с запросом на сервер
                url: url, //указываю путь к файлу обработчику
                type: 'POST', //указываю способ передачи данных
                dataType: 'JSON', //указываю формат передачи данных сервер
                data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
            }).fail(function () {
                form.find('.error-mes').show();
            });
        return phpAnswer;
    };

    //Универсальная функция запуска JS валидации, отправки данных на сервер и вывода результа пользователю
    var _validation_server_answer = function (url, modalWindowForm) {

        var form = modalWindowForm,
            target_url = url,//путь к файлу обработчику
            resultValidation = _ajaxFormJSValidation(form); //Результат проверки формы на заполненность полей
            console.log(resultValidation);
        if (resultValidation === true) {

            var serverAnswer = _ajaxForServer(form, target_url);//Массив с результатом обращения к серверу

            serverAnswer.done(function (ans) {

                var succesBox, errorBox, formGroup, addButton;

                if (target_url !== 'php/contact_with_me.php') {
                    console.log(form);
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
    var _showModalWindow = function (modalWindow, modalWindowForm, url) {

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

        modalWindowForm.on('submit', function (event) {
            event.preventDefault();
            _validation_server_answer(url, modalWindowForm);
        });
    };

    //Функция запуска проверки формы ОБРАТНОЙ СВЯЗИ при её отправке
    var _submitForm_contactWithMe = function (ev) {

        ev.preventDefault();//Сброс стандартного поведения кнопки отправки даных формы

        var form = $(this),
            url = 'php/contact_with_me.php';//путь к файлу обработчику

        _validation_server_answer(url, form);
    };

    //Функция прослушивания событий
    var _setUpListners = function () {

        //Прослушка нажатия кнопки добавления проекта
        $('#add-new-project').on('click', function (ev) {
            ev.preventDefault();

            var modalWindow = $('#modalWindow-addNewProject'),
                modalWindowForm = modalWindow.find('#modalWindow-addNewProject-form'),
                url = 'php/add_new_project.php';

            _showModalWindow(modalWindow, modalWindowForm, url);
        });

        //Прослушка нажатия кнопки авторизации
        $('#login').on('click', function (ev) {
            ev.preventDefault();

            var modalWindow = $('#modalWindow-autorization'),
                modalWindowForm = modalWindow.find('#modalWindow-autorization-form'),
                url = 'php/login.php';

            _showModalWindow(modalWindow, modalWindowForm, url);

        });

        //Прослушка кнопки отправки формы
        $('#contactForms').on('submit', _submitForm_contactWithMe);

        $('#modalWindow-addNewProject-label, .modalWindow-addNewProject-input-img').on('click', function () {
            $('#fileUpload').trigger('click');
        });

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

addNewProject.init();
//Модуль валидации и вывода ТУЛЛТИПов
var validation = (function() {
   
   //Функция создания тултипов
   var _createQtip = function(element, position){
      //Позиция тултипа
      if(position === 'right'){
         position = {
            my: 'left center',
            at: 'right center'
         }
      }else{
            position = {
               my: 'right center',
               at: 'left center',
               adjust: {
                  method: 'shift none'
               }
            }
         }
      //Инициализация тултипа
      element.qtip({
         content: {
            text: function(){
               return $(this).attr('qtip-content');
            }
         },
         show: {
            event: 'show'
         },
         hide: {
            event: 'keydown click dbclick'
         },
         position: position,
         style: {
            classes: 'qtip-red qtip-rounded qtip-shadow',
            tip: {
               height: 7,
               width:9
            }
         }
      }).trigger('show');
   };
   
   //Универсальная функция проверки поля формы
   var validateForm = function(form){
      
      var inputElements = form.find('input, textarea').not('input[type="file"], input[type="hidden"]'),
          qtipBlocks = form.find('.qtipBlock'),
          valid = true;
      
      $.each(inputElements, function(index, val){
         var element = $(val),
             indexQtip = index,
             qtipBlock = $(qtipBlocks[indexQtip]),
             val = element.val(),
             position = qtipBlock.attr('qtip-position');
         
         if (val.length === 0){
            _createQtip(qtipBlock, position);
            valid = false;
         }
      });
      
      return valid;
   };

   //Возвращаем объект (публичные методы)
   return {
      validateForm: validateForm
   };
   
})();