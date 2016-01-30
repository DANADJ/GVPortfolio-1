var contact_with_me = (function(){

   //Функция ajax запроса для валидации формы
   var _ajaxForm = function(form, url){
      console.log('ajax запрос с проверкой.');
      if(!validation.validateForm(form)){
         return false;
      };
   };
   
   //Функция проверки формы при её отправке
   var _submitForm = function(ev){
      
      ev.preventDefault();//Сброс стандартного поведения кнопки отправки даных формы
      
      var form = $(this),
          url = 'php/contact_with_me.php',//путь к файлу обработчику
          defObj = _ajaxForm(form, url);
   };
   
   //Функция прослушивания событий
   var _setUpListners = function(){
      $('#contactForms').on('submit', _submitForm);
   };
   
   //Функция инициализации модуля
   var init = function(){
      _setUpListners();
   };
   
   return {
      init: init
   };
   
})();

contact_with_me.init();