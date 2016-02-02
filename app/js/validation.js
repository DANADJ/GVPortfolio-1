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
            event: 'keydown'
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
      
      var elements = form.find('input, textarea').not('input[type="file"], input[type="hidden"]'),
          valid = true;
      
      $.each(elements, function(index, val){
         var element = $(val),
             val = element.val(),
             pos = element.attr('qtip-position');
         
         if (val.length === 0){
            _createQtip(element, pos);
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