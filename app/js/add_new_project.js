var myModul = (function () {
   
   var init = function(){
      _setUpListners();
   };
   
   var _setUpListners = function(){
      $('#add-new-project').on('click', _showModalWindow); //открыть модальное окно
   };
      $('#modalWindow-addNewProject-label,  .modalWindow-addNewProject-input-img').on('click', function(){
         $('#fileUpload').trigger('click');
      })
   
   var _showModalWindow =  function(ev){
      //console.log('Вызов модального окна');
      ev.preventDefault();
      $('#modalWindow-addNewProject').bPopup();
   };
   
   return {
      init: init
   };
   
})();

myModul.init();