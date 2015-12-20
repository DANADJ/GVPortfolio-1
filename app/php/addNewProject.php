<?
$data = array();// создаю массив DATA
$data['projectName'] = $_POST['projectName']; //создаю переменную и помещаю в неё значение ячейки projectName из переданного массива DATA с данными из формы
$data['projectImg'] = $_POST['projectImg']; //создаю переменную и помещаю в неё значение ячейки projectImg из переданного массива DATA с данными из формы
$data['projectUrl'] = $_POST['projectUrl'];  //создаю переменную и помещаю в неё значение ячейки projectUrl из переданного массива DATA с данными из формы
$data['projectDescription'] = $_POST['projectDescription'];  //создаю переменную и помещаю в неё значение ячейки projectDescription из переданного массива DATA с данными из формы
$dataStatus = array(); //создаю ответный массив в котором будет хрониться статус добавления проекта!
$dataStatus['status'] = 'ok';//

//проверяю значения пришедшие из формы
if($data['projectName'] === '' || $data['projectImg'] === '' || $data['projectUrl'] === '' || $data['projectDescription'] === ''){//если хотя бы одна ячейка формы не заполнена...
   $dataStatus['status'] = 'error';//...присваиваю переменной Status ответного массива значение Error
}
header("content-Type: application/json");//Не понимаю эту строчку
echo json_encode($dataStatus);
exit(json_encode());

?>