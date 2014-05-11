<?php
error_reporting(1);
    $conf_path = $_SERVER['DOCUMENT_ROOT'].'/smoke/conf.inc.php';
if(file_exists($conf_path)){
    include_once($conf_path);
}
error_reporting(0);
session_start();

function urlencodeAsBrowser($url){
/*	include_once(SERVER_FULL_PATH . 'libs/idna_convert.class.php');
	$IDN         = new idna_convert();
	$domain = parse_url($url, PHP_URL_HOST);
	$encoded_domain = $IDN->encode($domain);
	$url = str_replace($domain, $encoded_domain, $url);
*/
	$url = str_replace(
		array("%2F", "%3F", "%3D", "%40", "%3A", "%26", "%3B", "%2A", "%27", "%23"), 
		array("/",   "?",   "=",   "@",   ":",   "&",   ";",   "*",   "'", "#"  ), 
		urlencode(urldecode($url)));
	$url = preg_replace('%^([^#]+)#.*$%siU', '$1', $url);
	return $url;
}

if(isset($_GET['test'])){
  $urls = array(
	'http://www.electroprogress.ru/catalog/izmerit/1074' => 'http://www.electroprogress.ru/catalog/izmerit/1074',
	'http://electroprogress.ru/catalog/izmerit/1074' => 'http://electroprogress.ru/catalog/izmerit/1074',
	'http://analizatory-kachestva-elektroenergii.electroprogress.ru/' => 'http://analizatory-kachestva-elektroenergii.electroprogress.ru/',
	'http://xn----8sbwhc1awfp1bybg.xn--p1ai/' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/',
	'http://купить-шкафы.рф/' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/',
	'http://xn----8sbwhc1awfp1bybg.xn--p1ai/product_list/vstroennaya-mebel-dlya-prihozhej' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/product_list/vstroennaya-mebel-dlya-prihozhej',
	'http://купить-шкафы.рф/product_list/vstroennaya-mebel-dlya-prihozhej' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/product_list/vstroennaya-mebel-dlya-prihozhej',
	'http://xn----8sbwhc1awfp1bybg.xn--p1ai/кириллица_урл?dcsd=sdcd&vdfvf' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sdcd&vdfvf',
	'http://купить-шкафы.рф/кириллица_урл?dcsd=sdcd&vdfvf' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sdcd&vdfvf',
	'http://купить-шкафы.рф/кириллица_урл?dcsd=sdcd&amp;vdfvf' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sdcd&amp;vdfvf',
	'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sdcd&vdfvf' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sdcd&vdfvf',
	'http://купить-шкафы.рф/кириллица_урл?dcsd=sd\'cd&amp;vdfvf' => 'http://xn----8sbwhc1awfp1bybg.xn--p1ai/%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB?dcsd=sd\'cd&amp;vdfvf',
	'http://www.кто.рф/' => 'http://www.xn--j1ail.xn--p1ai/',
	'http://www.electroprogress.ru/catalog/izmerit/1074#hash' => 'http://www.electroprogress.ru/catalog/izmerit/1074',

  );
  foreach($urls as $url => $res){
	$r = urlencodeAsBrowser($url);
	echo "<div style='border: 1px dashed #999;'>";
	if($res == $r){
		echo "<span style='color: lime;'>OK</span>";
		$res='';
	}else{
		echo "<span style='color: red;'>ERROR</span>";
	}
	echo "<br><p>$url => </p><p>$r == </p><p>$res</p></div>";
  }

exit;
}

function check_link($url) {
	//PUNYCODE
	$url = urlencodeAsBrowser($url);

	//CURL
	$main        = array();
	$ch          = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	$header[] = "X-DUSYA: On";
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	curl_setopt($ch, CURLOPT_NETRC, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 0);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	$stuff = curl_exec($ch);
	curl_close($ch);
	$parts   = explode("\n", $stuff);
	$main    = explode(" ", $parts[0], 3);
	$main[4] = $stuff;
	return $main;
}

if (isset($_POST['url'])) {
	$url = $_POST['url'];
	$page;
	$res = check_link($url);
	if ( preg_match('#<meta[^>]+content=["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4])
          || preg_match('#<meta charset=["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4]) 
	) {
		$res[4] = iconv("cp1251", "UTF-8", $res[4]);
	} //preg_match('#<meta[^>]+content=["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4])
	elseif (preg_match('#<meta[^>]+content=["\'][^>]*koi8-r[^>]*["\'][^>]*>#siU', $res[4])) {
		$res[4] = iconv("koi8-r", "UTF-8", $res[4]);
	} //preg_match('#<meta[^>]+content=["\'][^>]*koi8-r[^>]*["\'][^>]*>#siU', $res[4])

	$page->url      = $url;
	$page->siteCode = trim($res[1]);

	$page->badScripts = '';
	$text = $res[4];
	if(preg_match('#VaRVaRa Searcher#siU', $text, $m) || preg_match('#Go From Here#siU', $text, $m)){
		$page->badScripts .= $m[0];
		//$page->badScripts = $text;
	}
	preg_match('%<head[^>]*>(.*)</head>%siU', $res[4], $matches);
	$text = $matches[1];
	preg_match('#<title>(.*)</title>#siU', $text, $matches);
	$page->siteTitle = trim($matches[1]);
	if (preg_match('#<meta[^>]+name[^>]{1,7}keywords[^>]*>#siU', $text, $matches)) {
		preg_match('#<meta[^>]+content="(.*)"[^>]*>#siU', $matches[0], $m) or preg_match('#<meta[^>]+content=\'(.*)\'[^>]*>#siU', $matches[0], $m);
		$page->siteKeywords = trim($m[1]);
	} //preg_match('#<meta[^>]+name[^>]{1,7}keywords[^>]*>#siU', $text, $matches)
	else {
		$page->siteKeywords = '';
	}
	
	if (preg_match('#<meta[^>]+name[^>]{1,7}description[^>]*>#siU', $text, $matches)) {
		preg_match('#<meta[^>]+content="(.*)"[^>]*>#siU', $matches[0], $m) or preg_match('#<meta[^>]+content=\'(.*)\'[^>]*>#siU', $matches[0], $m);
		$page->siteDescription = trim($m[1]);
	} //preg_match('#<meta[^>]+name[^>]{1,7}description[^>]*>#siU', $text, $matches)
	else {
		$page->siteDescription = '';
	}
	
	preg_match('#<h1[^>]*>(.*)</h1>#siU', $res[4], $matches);
	$page->siteH1 = trim(strip_tags($matches[1]));

	$page->seo_text1 = '';
	if(preg_match('#<!--{text1}-->(.*)<!--{/text1}-->#siU', $res[4], $matches)){
		$page->site_seo_text1 = trim($matches[1]);
	}
	
	$page->seo_text2 = '';
	if(preg_match('#<!--{text2}-->(.*)<!--{/text2}-->#siU', $res[4], $matches)){
		$page->site_seo_text2 = trim($matches[1]);
	}
	
	
	
	if (preg_match('#<!--origUrl="(.*)"-->#siU', $text, $matches))
		$page->origurl = $matches[1];
	else
		$page->origurl = '--Can`t get \'original URI, please add some code to your d-seo.php --';
	// Считаем сеотэги.
	$tagreport = '';
	$tags      = array(
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'h7',
		'h8',
		'h9',
		'h10',
		'h11',
		'h12',
		'h13',
		'strong',
		'b',
		'em',
		'i',
		'u',
		'noindex'
	);
	$seotags   = strtolower($res[4]);
	foreach ($tags as $tag) {
		$cnt = substr_count($seotags, '</' . $tag . '>');
		$cnt2 = substr_count($seotags, '<' . $tag . '>');
		$cnt2 += substr_count($seotags, '<' . $tag . ' ');
		if($cnt != $cnt2){
			$tagreport .= "&lt;$tag&gt;: <span style='color:red'>$cnt2</span>;&nbsp;&nbsp;&nbsp;";
			$tagreport .= "&lt;/$tag&gt;: <span style='color:red'>$cnt</span>;&nbsp;&nbsp;&nbsp;";
		}else
		if ($cnt > 0) {
			$tagreport .= "$tag: <span style='color:red'>$cnt</span>;&nbsp;&nbsp;&nbsp;";
		} //$cnt > 0
	} //$tags as $tag
	$cnt  = substr_count($seotags, '<!--/noindex-->');
	$cnt2 = substr_count($seotags, '<!--noindex-->');
	if($cnt != $cnt2){
		$tagreport .= "&lt;!--$tag--&gt;: <span style='color:red'>$cnt2</span>;&nbsp;&nbsp;&nbsp;";
		$tagreport .= "&lt;!--/$tag--&gt;: <span style='color:red'>$cnt</span>;&nbsp;&nbsp;&nbsp;";
	}else
	if ($cnt > 0) {
		$tagreport .= "!--$tag--: <span style='color:red'>$cnt</span>;&nbsp;&nbsp;&nbsp;";
	} //$cnt > 0

	$page->tagreport = $tagreport;

	if(strpos($page->url, '6e8a796f731743be14649414df09d8f0.txt')){
		if(strpos($res[4], "\n6e8a796f731743be14649414df09d8f0")){
			$page->cmsmagazine = 'file';
		}else{
			$main_page_url = preg_replace('#(http[^/]+//[^/]+/).*$#siU','$1',$url);
			$main_page = check_link($main_page_url);
			$main_page = $main_page[4];
			if(strpos($main_page, '<meta name="cmsmagazine" content="6e8a796f731743be14649414df09d8f0" />')){
				$page->cmsmagazine = 'meta';
			}else{
				$page->cmsmagazine = 'none';
			}
		}
		$res404 = check_link($url."sdfvfddd4");
		$page->cmsmagazine .= ' 404test: '.$res404[1];
	}


	//
	echo json_encode($page);
	exit();
} //isset($_POST['url'])

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


if(isset($_POST['ftp_action'])){
	if (!isset($_SESSION['user-id'])) {
		echo '{false}';
		exit();
	}
	include_once('ftp/ftp.class.php');
	if($_POST['ftp_action'] == 'connect' || 1){
		$ftp_data = $_POST['ftp_data'];
		$server = $ftp_data['host'];
		$project = $ftp_data['project'];
		$port = isset($ftp_data['port'])?$ftp_data['port']:'21';
		$user = $ftp_data['login'];
		$password = $ftp_data['password'];
		$passive = !(isset($ftp_data['mode']) && $ftp_data['mode'] == 'active');
		$currentDir = (isset($ftp_data['path'])?$ftp_data['path']:'/');
		$ftp = new ftp($server, $port, $user, $password, $passive);
		$ftp->setCurrentDir($currentDir);
		if($_POST['ftp_action'] == 'connect') echo "loggedOn: ".$ftp->loggedOn;
		elseif($_POST['ftp_action'] == 'load'){
			$file = $_POST['ftp_filename'];
			$s = $ftp->download($file);
			if($s !== false){
				$bakfname = 'backups/'.$project.'/'.$file.'.'.date('Y-m-d_H:i').'_'.$_SERVER['REMOTE_ADDR'].'r.txt';
				$bakfdir = dirname($bakfname);
				mkdir($bakfdir, 0777, true);
				if(!file_exists($bakfname)){
					file_put_contents($bakfname, $s);
				}
				$encoding = $_POST['ftp_encoding'];
				if($encoding != 'utf8'){
					$s = iconv('windows-1251', 'utf-8', $s);
				}
				echo $s;
			}else{
				echo '{false}';
			}
		}elseif($_POST['ftp_action'] == 'upload'){
			$file = $_POST['ftp_filename'];
			$encoding = $_POST['ftp_encoding'];
			$s = $_POST['ftp_stream'];
			if($encoding != 'utf8'){
				$s = iconv('utf-8', 'windows-1251', $s);
			}
			$bakfname = 'backups/'.$project.'/'.$file.'.'.date('Y-m-d_H:i').'_'.$_SERVER['REMOTE_ADDR'].'w.txt';
			$bakfdir = dirname($bakfname);
			mkdir($bakfdir, 0777, true);
			if(!file_exists($bakfname)){
				file_put_contents($bakfname, $s);
			}
			$ok = $ftp->upload($file, $s);
			echo ($ok?"{true}":"{false}");
		}
	}else{
	}
	exit();
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

if(isset($_POST['bugreport_submit']) && $_POST['bugreport_submit'] == 'true'){
	$message ="Е-mail: {$_POST['bugreport_problem']}
IP: {$_SERVER['REMOTE_ADDR']}
Проблема:
{$_POST['bugreport_problem']}

Правки:
{$_POST['bugreport_text']}
";

$mailed = mail('y.yurin@demis.ru', 'd-seo-checker bugreport', $message);
echo $mailed?'отправлено':'ошибка';
$file = str_replace('/index.php', '/bugreports/'.date("Y-m-d H:i:s").'.txt' , __FILE__);
file_put_contents($file, $message);

exit();
}



?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Проверка метатэгов</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
		<script type='text/javascript' src='//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js'></script>

		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/2.33.0/codemirror.css">
		<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/2.33.0/codemirror.js"></script>
<!-- 		<script src="CodeMirror-2.32/mode/xml/xml.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/mode/javascript/javascript.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/mode/css/css.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/mode/clike/clike.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/mode/php/php.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/lib/util/formatting.js"></script> -->
<!-- 		<script src="CodeMirror-2.32/mode/htmlmixed/htmlmixed.js"></script> -->

		<script type='text/javascript' src='main.js'></script>
		<style type="text/css">
body{
  padding: 15px 0 0px 0;
}
td.query{
  background: url('img/loading.gif') no-repeat right center;
}
.label a, .badge a{
  color: white;
}
#ftpEditorAlerts{
  height: 1px;
  position: fixed;
  top: 70px;
  right: 45px;
  width: 28%;
  z-index: 200;
}
.feditor .CodeMirror {
  width: 100%;
}
.feditor .CodeMirror {border-top: 1px solid #DDD; border-bottom: 1px solid #DDD;}
.feditor .activeline {background: #e8f2ff !important;}
.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
.CodeMirror-fullscreen {
	display: block;
	position: absolute;
	top: 0; left: 0;
	width: 100%;
	z-index: 100;
	background: white;
}
.collapse.fullscreen{
	position: static;
}
#src{
	-webkit-transition: left 0.1s ease-in;
	width: 40%;
	position: fixed;
	top: 17px;
	right: 92%;
        z-index: 50;
}

#src:focus{
	left:1%;
}
#urlchecks .label{
overflow: hidden;
max-width: 900px;
display: inline-block;
}
.tagreport{
    min-width: 90px;
}
		</style>
	</head>
	<body>
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="controls span1">
<textarea id="src" class="input-xlarge span12" rows="45" name="dseotext">


Вставляем сюда правки по авроре.
1 http://ya.ru/
2 http://bertal.ru/
3 http://otp.demis.ru/
</textarea>
				</div>
				<div class="span11">
					<ul class="nav nav-tabs" id="myTab">
						<li><a href="#options">Настройки</a></li>
						<li><a href="#ftp">FTP</a></li>
						<li class="active"><a href="#results">Результаты проверки</a></li>
						<li><a href="#report404">Отчёты в таск</a></li>
						<li><a href="#dseocode">Код для d-seo</a></li>
						<li><a href="#phparrays">PHP массивы</a></li>
						<!--<li><a href="#dseomerger">dseomerger (Beta)</a></li>-->
						<!--<li><a href="#csstools">CSS Tools</a></li>-->
						<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">Ссылки<span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="http://help.yandex.ru/webmaster/?id=1122752" target="_blank">Яндекс schema.org</a></li>
								<li><a href="http://help.yandex.ru/webmaster/?id=1122760" target="_blank">Картинки в schema.org</a></li>
								<li><a href="http://webmaster.yandex.ru/microtest.xml" target="_blank">Валидатор микроразметки</a></li>
								<li class="divider"></li>
								<li><a href="http://api.yandex.ru/maps/tools/constructor/" target="_blank">Карта проезда</a></li>
								<li><a href="http://site.yandex.ru/searches/new/" target="_blank">Яндекс поиск по сайту</a></li>
								<li class="divider"></li>
								<li><a href="http://webmaster.yandex.ru/robots.xml" target="_blank">Анализатор robots.txt</a></li>
								<li><a href="http://webmaster.yandex.ru/sitemaptest.xml" target="_blank">Проверка sitemap.xml</a></li>
								<li class="divider"></li>
								<li><a href="http://bertal.ru/" target="_blank">bertal.ru</a></li>
								<li><a href="http://web-sniffer.net/" target="_blank">web-sniffer.net</a></li>
								<li class="divider"></li>
								<li><a href="http://www.weare.ru/cgi-bin/clearhtml.cgi" target="_blank">Чистилка HTML</a></li>
								<li><a href="http://beta.phpformatter.com/" target="_blank">Форматирование PHP кода</a></li>
								<li class="divider"></li>
								<li><a href="http://antivirus-alarm.ru/proverka/" target="_blank">antivirus-alarm.ru</a></li>
								<li><a href="http://sucuri.net/" target="_blank">sucuri.net</a></li>
								<li class="divider"></li>
								<li><a href="http://nic.ru/whois/" target="_blank">Whois (nic.ru)</a></li>
								<li><a href="http://2ip.ru/whois/" target="_blank">Whois (2ip.ru)</a></li>
								<li><a href="http://2ip.ru/anonim/" target="_blank">Анонимайзер</a></li>
							</ul>
						</li>
						<li><a href="#bugs">Баги</a></li>
						<li><a href="#xenureport">Xenu report</a></li>
					</ul>
			
					<div class="tab-content">
						<div class="tab-pane" id="options">
							<div class="row-fluid">
								<div class="span3 options">
									<h3>Опции</h3>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox" checked id="cbTitle">Title</label>
										</span>
										<input class="span7" value="$aSEOData['title']" id="txtTitle" type="text">
									</div>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox" checked id="cbDescription">Description</label>
										</span>
										<input class="span7" value="$aSEOData['descr']" id="txtDescription" type="text">
									</div>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox" checked id="cbKeywords">Keywords</label>
										</span>
										<input class="span7" value="$aSEOData['keywr']" id="txtKeywords" type="text">
									</div>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox"  id="cbH1">H1</label>
										</span>
										<input class="span7" value="$aSEOData['h1']" id="txtH1" type="text">
									</div>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox"  id="cbSeoText">Text</label>
										</span>
										<input class="span7" value="$aSEOData['text']" id="txtSeoText" type="text">
									</div>
									<div class="input-prepend">
										<span class="span5 add-on">
										<label class="checkbox"><input type="checkbox"  id="cbSeoTextAlt">Text(Alt)</label>
										</span>
										<input class="span7" value="$aSEOData['text_alt']" id="txtSeoTextAlt" type="text">
									</div>
									<button class="btn" id="optionsReset">Сбросить</button>
								</div>
							</div>
						</div>
						<div class="tab-pane active" id="results">
							<div id="urlchecks" class="span12"></div>
							<div class="row-fluid">
								<div class="controls span12">
									<h4>Код для switch(){}</h4>
									<textarea id="dseo"  class="input-xlarge span12" rows="31"></textarea>
								</div>
							</div>
							
						</div>
						<div class="tab-pane" id="report404">
							<div class="row-fluid">
								<textarea id="report404text" class="input-xlarge span12" rows="15"></textarea>
							</div>
							<div class="row-fluid">
								<textarea id="reportTagsText" class="input-xlarge span12" rows="15"></textarea>
							</div>
						</div>
						<div class="tab-pane" id="dseocode">
<textarea class="input-xlarge span12" rows="14">

if(isset($_SERVER['X_DUSYA']) || isset($_SERVER['HTTP_X_DUSYA'])) {
$sContent = str_replace('<head>', '<head><!--origUrl="' . $sSEOUrl . '"-->' , $sContent);
}
if (isset($aSEOData['h1']) &amp;&amp; !empty($aSEOData['h1'])) {
$sContent = preg_replace('#(<h1[^>]*>).*(</h1>)#siU', '$1'.$aSEOData['h1'].'$2', $sContent);
}
if (isset($aSEOData['text']) &amp;&amp; !empty($aSEOData['text'])) {
//$sContent = preg_replace('##siU', '', $sContent);
}
if (isset($aSEOData['text_alt']) &amp;&amp; !empty($aSEOData['text_alt'])) {
//$sContent = preg_replace('##siU', '', $sContent);
}

</textarea>
						</div>
						<div class="tab-pane" id="phparrays">
							<div class="controls span4">
								<textarea id="phparrays1" class="input-xlarge span12" rows="7"></textarea>
							</div>
							<div class="controls span4">
								<textarea id="phparrays2" class="input-xlarge span12" rows="7"></textarea>
							</div>
							<div class="controls span4">
								<textarea id="phparrays3" class="input-xlarge span12" rows="7"></textarea>
							</div>
						</div>
						<div class="tab-pane" id="ftp">
							<div class="row-fluid">
								<div class="span6">
									<div id="ftp-status" class="label">FTP</div>
								</div>
								<div class="span6">
									<?php echo $auth; ?>
								</div>
							</div>
							<div id="accordionFtpEditor">

<ul class="nav nav-tabs" id="myTab2" >
</ul>
 
<div class="tab-content">
</div>
							</div>


						</div>
						<div class="tab-pane" id="dseomerger">
							<div class="row-fluid">
								<div class="controls span6">
									<h4>Исходный</h4>
									<textarea id="dseomergersrc" class="input-xlarge span12" rows="70"></textarea>
								</div>
								<div class="controls span6">
									<h4>Новый</h4>
									<textarea id="dseomergerdst" class="input-xlarge span12" rows="70"></textarea>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="csstools">
							<div class="row-fluid">
								<div class="controls span12">
									<p>Указываем урл страницы и получаем список файлов и css правила, которые надо в них добавить</p>
									<input type="text" class="input-xxlarge" placeholder="Адрес страницы" id="csstools-url">
									<button type="button" class="btn btn-large" id="csstools-parse">Парсить</button>
									<div class="row-fluid" id="csstools-results"></div>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="bugs">
							<div class="row-fluid">
								<div class="controls span12">
									<form method="post" class="span11 well" id="bugreport_form"><fieldset>
									<legend>Сообщение об ошибке</legend>
									<label>Текст рекомендаций, в которых обнаружен баг:</label>
									<textarea name="bugreport_text" class="span12" rows="12"></textarea>
							
									<label>Кратко опишите суть проблемы:</label>
									<textarea name="bugreport_problem" class="span12" rows="12"></textarea>
									<label>E-mail (не обязательно):</label>
									<input type="text" name="bugreport_email" />
									<button type="submit" class="btn btn-primary pull-right" name="bugreport_submit" value="true">Отправить</button>
									</fieldset></form>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="xenureport">
							<div class="row-fluid">
								<div class="controls span12">
									<label>Отчёт XENU</label>
									<textarea name="xenu_in_text" id="xenu_in_text" class="span12" rows="12"></textarea>
							
									<label>3xx</label>
									<textarea name="xenu_out_text_301" id="xenu_out_text_301" class="span12" rows="12"></textarea>
						
									<label>404</label>
									<textarea name="xenu_out_text_404" id="xenu_out_text_404" class="span12" rows="12"></textarea>
									
									<label>другие</label>
									<textarea name="xenu_out_text_xxx" id="xenu_out_text_302" class="span12" rows="12"></textarea>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="ftpEditorAlerts"></div>
		<div id="feditorTemplate">
			<ul class="lia"><li><a href="#{fileid}">{filename}</a></li></ul>
			<div id="{fileid}" class="tab-pane feditor" data-filename="{filename}" data-encoding="{encoding}">
				<div class="span12 btn-toolbar" style="margin: 3px 0;">
					<div class="btn-group">
						<button class="btn btn-primary btn-large fread">Прочитать</button>
						<button class="btn btn-inverse btn-large dropdown-toggle" data-toggle="dropdown">Кодировка<span class="caret"></span></button>
						<ul class="dropdown-menu pull-right">
							<li><a class="freadutf8">UTF-8</a></li>
							<li><a class="freadcp1251">windows-1251</a></li>
						</ul>
					</div>
					<div class="btn-group">
						<button class="btn btn-danger btn-large disabled fwrite">Записать</button>
						<button class="btn btn-danger btn-large disabled dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
						<ul class="dropdown-menu pull-right">
							<li><a class="fwriteutf8">UTF-8</a></li>
							<li><a class="fwritecp1251">windows-1251</a></li>
						</ul>
					</div>
					<div class="btn-group">
						<button class="btn btn-mini fformatselected">Форматировать выделенное<br/>(html, css, js, а PHP портит)</button>
					</div>
					<div class="btn-group">
						<button class="btn btn-mini ffullscreen">FullSreen(F11)</button>
					</div>
					<div class="btn-group pull-right">
						<button class="btn btn-mini fcreate">Создать</button>
					</div>
				</div>
				<textarea class="input-xlarge span12 ftext" id="ftext{fileid}" ></textarea>
			</div>
		</div>
		<script type='text/javascript' src='//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js'></script>
		<script src="http://malsup.github.com/jquery.form.js"></script> 
	</body>
</html>