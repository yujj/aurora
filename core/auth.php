<?php 

error_reporting(1);
    $conf_path = $_SERVER['DOCUMENT_ROOT'].'/smoke/conf.inc.php';
if(file_exists($conf_path)){
    include_once($conf_path);
}
error_reporting(0);
session_start();
 

$auth = '';
if (isset($_POST['mail']) && isset($_POST['pass'])) {
        include_once(SERVER_FULL_PATH . 'libs/LdapProxy.inc.php');
	$hLDAP = new LdapProxy();
	$bAutorize = $hLDAP->authorization($_POST['mail'], $_POST['pass'], 'otp');
	if ($bAutorize) {
			$_POST['mail'] = $hDBTM->real_escape_string($_POST['mail']);
			$aUser = queryTM("SELECT `id` FROM `users` WHERE `login` = '{$_POST['mail']}'");
			if (count($aUser) && isset($aOTPUsers[$aUser[0]['id']])) {
			$_SESSION['user-id'] = $aUser[0]['id'];
		}
	} 
	if (!isset($_SESSION['user-id'])) {
		$auth .= '<div class="alert alert-danger">Авторизация не пройдена</div>';
	}else{
		$auth .= '<div class="alert alert-success">Вы авторизованы как '.$_POST['mail'].'</div>';
	}
}



if (!isset($_SESSION['user-id'])) {
    $auth = '
      <form method="post" id="authform">
        <h4>Авторизация LDAP</h4>
	<table class="table">
        <tr><td>Mail: </td><td><input type="text" name="mail" /></td></tr>
        <tr><td>Pass: </td><td><input type="password" name="pass" /></td></tr>
        <tr><td align="center" colspan="2"><input type="submit" name="go" value=" Войти " /></td></tr>
        </table>
      </form>
    ';
}else{
    $auth .= '<button class="btn" id="ftpConnect">Подключиться</button>';
}
