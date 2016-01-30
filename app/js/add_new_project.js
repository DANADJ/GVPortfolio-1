var myModul = (function () {
   //Функция инициализации модуля
   var init = function(){
      _setUpListners();
   };
   
   //Функции прослушивания событий
   var _setUpListners = function(){
      $('#add-new-project').on('click', _showModalWindowAddNewProject);
   
      $('#modalWindow-addNewProject-label, .modalWindow-addNewProject-input-img').on('click', function(){
         $('#fileUpload').trigger('click');
      });
   
      $('#fileUpload').on('change', function(){
         $('.modalWindow-addNewProject-input-fake').val($(this).val());
      });
      
      $('#modalWindow-addNewProject-form').on('submit', _addNewProject);
      
   };
   
   //Функция вывода модального окна длбавления проекта
   var _showModalWindowAddNewProject =  function(ev){
      ev.preventDefault();
      var modalWindowAddNewProject = $('#modalWindow-addNewProject'),
          modalWindowAddNewProjectForm = modalWindowAddNewProject.find('#modalWindow-addNewProject-form');
      
         modalWindowAddNewProject.bPopup({
            onClose: function(){
               modalWindowAddNewProjectForm.find('.server-mes').hide();
               modalWindowAddNewProjectForm.find('.form-group').show();
               modalWindowAddNewProjectForm.find('.add-button').show();
               modalWindowAddNewProjectForm.find('input').val('');
               modalWindowAddNewProjectForm.find('textarea').val('');
            }
         });
   };
   
   //Функция AJAX запроса для валидации формы
   var _ajaxFormValidation = function(form){
      var result = true;
      if(!validation.validateForm(form)){
         result = false;
         };
      return result;
      };
   
   //Универсальная функция обращения к серверу через AJAX
   var _ajaxForServer = function(form, url){
      
         var data = form.serialize(),//создаю ассоциативный массив DATA и сохраняем в него данные из формы
             result = $.ajax({ //Создаю переменную RESUL с запросом на сервер
                              url: url, //указываю путь к файлу обработчику
                              type: 'POST', //указываю способ передачи данных
                              dataType: 'JSON', //указываю формат передачи данных сервер
                              data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
                     }).fail(function(ans){
                                           console.log('Прблемы в PHP');
                                           form.find('.error-mes .server-mes-content')
                                               .text('На сервере произошла ошибка.');
                                           form.find('.error-mes')
                                               .show();
                     });
         return result;
   }
   
   //Функция добавления нового проекта
   var _addNewProject = function(ev){
      
      ev.preventDefault();//Сброс стандартного поведения отправки даных формы
      
      var form = $(this),
          url = "php/addNewProject.php",//путь к файлу обработчику
          resultValidation = _ajaxFormValidation(form); //Результат проверки формы на заполненность полей
         
      if (resultValidation === true){
         
         var serverAnsver =  _ajaxForServer(form, url);//Результат обращения к серверу на добавление проекта
         
         serverAnsver.done(function(ans) {
         
            var succesBox = form.find('.succes-mes'),
                errorBox = form.find('.error-mes'),
                formGroup = form.find('.form-group'),
                addButton = form.find('.add-button');
               
            console.log (ans.status)
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
   //Возвращаем объект (публичные методы)
   return {
      init: init
   };
   
   })();

myModul.init();