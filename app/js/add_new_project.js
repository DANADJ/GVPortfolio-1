var myModul = (function () {
   //Функция инициализации модуля
   var init = function(){
      _setUpListners();
   };
   
   //Функция прослушивания событий
   var _setUpListners = function(){
      $('#add-new-project').on('click', _showModalWindow);
   
      $('#modalWindow-addNewProject-label, .modalWindow-addNewProject-input-img').on('click', function(){
         $('#fileUpload').trigger('click');
      });
   
      $('#fileUpload').on('change', function(){
         $('.modalWindow-addNewProject-input-fake').val($(this).val());
      });
      
      $('#modalWindow-addNewProject-form').on('submit', _addNewProject);
      
   };
   
   //Функция вывода модального окна
   var _showModalWindow =  function(ev){
      ev.preventDefault();
      var modalWindowAddNewProject = $('#modalWindow-addNewProject'),
          modalWindowAddNewProjectForm = modalWindowAddNewProject.find('#modalWindow-addNewProject-form');
      
         modalWindowAddNewProject.bPopup({
            onClose: function(){
               modalWindowAddNewProjectForm.find('.server-mes').hide();
               modalWindowAddNewProjectForm.find('input').val('');
               modalWindowAddNewProjectForm.find('textarea').val('');
            }
         });
   };
   
   //Универсальная функция обращения к серверу через AJAX
   var _AJAXforServer = function(form, url){
      var data = form.serialize(),//создаю ассоциативный массив DATA и сохраняем в него данные из формы
          result = $.ajax({ //Создаю переменную RESUL с запросом на сервер
                           url: url, //указываю путь к файлу обработчику
                           type: 'POST', //указываю способ передачи данных
                           dataType: 'JSON', //указываю формат передачи данных сервер
                           data: data //передаю ассоциативный массив с сохранёнными в нём данными из формы
                  }).fail(function(ans){
                                        console.log('Прблемы в PHP');
                                        form.find('.server-mes').text('На сервере произошла ошибка.')
                                            .show();
                  });
      return result;
   }
   
   //Функция добавления нового проекта
   var _addNewProject = function(ev){
      
      ev.preventDefault();//Сброс стандартного поведения кнопки отправки даных формы
      
      var form = $(this),
          url = "php/addNewProject.php",//путь к файлу обработчику
          serverAnsver =  _AJAXforServer(form, url);
      
      serverAnsver.done(function(ans) {
         
         var succesBox = form.find('.succes-mes'),
             errorBox = form.find('.error-mes');
         
         if(ans.status === 'ok'){
            errorBox.hide();
            succesBox.show();
         }else{
            succesBox.hide();
            errorBox.show();
         };
      });
   };
   
   //Возвращаем объект (публичные методы)
   return {
      init: init
   };
   
   })();

myModul.init();