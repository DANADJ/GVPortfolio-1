'use strict';

//Модуль валидации и вывода ТУЛЛТИПов

var validation = function () {

     //Функция создания тултипов
     var _createQtip = function _createQtip(element, position) {
          //Позиция тултипа
          if (position === 'right') {
               position = {
                    my: 'left center',
                    at: 'right center'
               };
          } else {
               position = {
                    my: 'right center',
                    at: 'left center',
                    adjust: {
                         method: 'shift none'
                    }
               };
          }
          //Инициализация тултипа
          element.qtip({
               content: {
                    text: function text() {
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
                         width: 9
                    }
               }
          }).trigger('show');
     };

     //Универсальная функция проверки поля формы
     var validateForm = function validateForm(form) {

          var inputElements = form.find('input, textarea').not('input[type="file"], input[type="hidden"], input[type="checkbox"]'),
              qtipBlocks = form.find('.qtipBlock'),
              valid = true;

          $.each(inputElements, function (index, val) {
               var element = $(val),
                   indexQtip = index,
                   qtipBlock = $(qtipBlocks[indexQtip]),
                   value = element.val(),
                   position = qtipBlock.attr('qtip-position');
               if (value.length === 0 || value.length === '') {
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
}();