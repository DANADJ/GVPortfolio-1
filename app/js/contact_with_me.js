var contact_with_me = (function(){
   //Функция инициализации модуля
   var init = function(){
      _setUpListners();
   };
   
   //Функция прослушивания событий
   var _setUpListners = function(){
      $('#contactForms').on('submit', _submitForm);
   };
   
   //Функция проверки формы при её отправке
   var _submitForm = function(ev){
      console.log('Функция проверки формы при её отправке.');
      ev.preventDefault();
      
      var form = $(this),
          url = 'contact_with_me.php',
          defObj = _ajaxForm(form, url);
   };
   
   //Функция ajax запроса
   var _ajaxForm = function(form, url){
      console.log('ajax запрос с проверкой.');
      if(!validation.validateForm(form)){
         return false;
      };
   };
   
   return {
      init: init
   };
   
})();

contact_with_me.init();