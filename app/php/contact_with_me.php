<?
$data = array();// создаю массив DATA
$data['name'] = $_POST['name']; //создаю переменную и помещаю в неё значение ячейки name из переданного массива DATA с данными из формы
$data['email'] = $_POST['email']; //создаю переменную и помещаю в неё значение ячейки email из переданного массива DATA с данными из формы
$data['message'] = $_POST['message'];  //создаю переменную и помещаю в неё значение ячейки message из переданного массива DATA с данными из формы
$data['captcha'] = $_POST['captcha'];  //создаю переменную и помещаю в неё значение ячейки captcha из переданного массива DATA с данными из формы
$dataStatus = array(); //создаю ответный массив в котором будет храниться статус добавления проекта!
$dataStatus['status'] = 'ok';//

//проверяю значения пришедшие из формы
if($data['name'] === '' || $data['email'] === '' || $data['message'] === '' || $data['captcha'] === ''){//если хотя бы одна ячейка формы не заполнена...
   $dataStatus['status'] = 'error';//...присваиваю переменной Status ответного массива значение Error
} else {

};
header("content-Type: application/json");//Не понимаю эту строчку
echo json_encode($dataStatus);
exit(json_encode());

?>