//Модуль добавления нового проекта
var addNewProject = (function () {
   
   //Универсальная функция AJAX запроса для валидации формы
   var _ajaxFormValidation = function(form){
      var result = true;
      if(!validation.validateForm(form)){
         result = false;
      };
      return result;
   };
   
   //Универсальная функция AJAX запроса к серверу для выполнения задачи
   var _ajaxForServer = function(form, url){
      
         var data = form.serialize(),//создаю ассоциативный массив DATA и сохраняем в него данные из формы
             result = $.ajax({ //Создаю переменную RESULT с запросом на сервер
                              url: url, //указываю путь к файлу обработчику
                              type: 'POST', //указываю способ передачи данных
                              dataType: 'JSON', //указываю формат передачи данных сервер
                              data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
                     }).fail(function(ans){
                           form.find('.error-mes').show();
                     });
         console.log(data);
         return result;
   };
   
   //Универсальная функция запуска JS валидации, отправки данных на сервер и вывода результа пользователю
   var _validation_server_ansver = function(url, modalWindowForm){
      
      var form = modalWindowForm,
          url = url,//путь к файлу обработчику
          resultValidation = _ajaxFormValidation(form); //Результат проверки формы на заполненность полей
         
      if (resultValidation === true){
         
         var serverAnsver =  _ajaxForServer(form, url);//Результат обращения к серверу на добавление проекта
         
         serverAnsver.done(function(ans) {
         
            var succesBox = form.find('.succes-mes'),
                errorBox = form.find('.error-mes'),
                formGroup = form.find('.form-group'),
                addButton = form.find('.add-button');
            
            if(ans.status === 'ok'){
               errorBox.hide();
               formGroup.hide();
               addButton.hide();
               succesBox.show();
            }else{
               succesBox.hide();
               errorBox.show();
            };
         });
      };
   };
   
   //Функция вывода модального окна
   var _showModalWindow =  function(modalWindow, modalWindowForm, url){
      
         modalWindow.bPopup({
            onClose: function(){
               modalWindowForm.find('.server-mes').hide();
               modalWindowForm.find('.form-group').show();
               modalWindowForm.find('.add-button').show();
               modalWindowForm.find('input').val('');
               modalWindowForm.find('textarea').val('');
               $('.modalWindow-addNewProject-input').qtip('destroy', true);
               $('.modalWindow-addNewProject-textarea').qtip('destroy', true);
               $('.modalWindow-autorization-input').qtip('destroy', true);
               $('.modalWindow-autorization-textarea').qtip('destroy', true);
            }
         });
         
         modalWindowForm.on('submit', function(event){
         event.preventDefault();
         _validation_server_ansver(url, modalWindowForm);
      });
   };
   
   //Функция запуска проверки формы ОБРАТНОЙ СВЯЗИ при её отправке
   var _submitForm_contactWithMe = function(ev){
      
      ev.preventDefault();//Сброс стандартного поведения кнопки отправки даных формы
      
      var form = $(this),
          url = 'php/contact_with_me.php',//путь к файлу обработчику
          resultValidation = _ajaxFormValidation(form); //Результат проверки формы на заполненность полей
   };
   
   //Функция прослушивания событий
   var _setUpListners = function(){
      
      $('#add-new-project').on('click', function(ev){
      ev.preventDefault();
      
      var modalWindow = $('#modalWindow-addNewProject'),
          modalWindowForm = modalWindow.find('#modalWindow-addNewProject-form'),
          url = 'php/add_new_project.php';
         
      _showModalWindow(modalWindow, modalWindowForm, url);
      });
      
      $('#login').on('click', function(ev){
      ev.preventDefault();
      
      var modalWindow = $('#modalWindow-autorization'),
          modalWindowForm = modalWindow.find('#modalWindow-autorization-form'),
          url = 'php/autorization.php';
         
      _showModalWindow(modalWindow, modalWindowForm, url);
      });
      
      $('#contactForms').on('submit', _submitForm_contactWithMe);
      
      $('#modalWindow-addNewProject-label, .modalWindow-addNewProject-input-img').on('click', function(){
         $('#fileUpload').trigger('click');
      });
      
      $('#fileUpload').on('change', function(){
         $('.modalWindow-addNewProject-input-fake').val($(this).val()).qtip('destroy', true);
      });
      
   };
   
   //Функция инициализации модуля
   var init = function(){
      _setUpListners();
   };
   
   //Возвращаем объекты из модуля (публичные методы)
   return {
      init: init
   };
   
   })();

addNewProject.init();