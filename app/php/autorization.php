<?
$data = array();// создаю массив DATA
$data['admin-name'] = $_POST['admin-name']; //создаю переменную и помещаю в неё значение ячейки admin-name из переданного массива DATA с данными из формы
$data['password'] = $_POST['password']; //создаю переменную и помещаю в неё значение ячейки password из переданного массива DATA с данными из формы

$dataStatus = array(); //создаю ответный массив в котором будет храниться статус добавления проекта!
$dataStatus['status']; //создаю в ответном массиве ячейку с именем STATUS

//проверяю значения пришедшие из формы
if($data['admin-name'] !== '' || $data['password'] !== ''){//если обе ячейки формы не пусты...
   if($data['admin-name'] === 'admin' || $data['password'] === 'admin'){ //...проверяю их на совпадение с ЛОГИН/ПАРОЛЕМ...
      $dataStatus['status'] = 'ok';//... и присваиваю STATUS = ok
   };
} else {
   $dataStatus['status'] = 'error';//... иначе, присваиваю переменной Status ответного массива значение Error
};
header("content-Type: application/json");//Не понимаю эту строчку
echo json_encode($dataStatus);
exit(json_encode());

?>