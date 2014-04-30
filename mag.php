<?php
error_reporting(1);
    $conf_path = $_SERVER['DOCUMENT_ROOT'].'/smoke/conf.inc.php';
if(file_exists($conf_path)){
    include_once($conf_path);
}
error_reporting(0);
session_start();

function urlencodeAsBrowser($url){
	include_once(SERVER_FULL_PATH . 'libs/idna_convert.class.php');
	$IDN         = new idna_convert();
	$domain = parse_url($url, PHP_URL_HOST);
	$encoded_domain = $IDN->encode($domain);
	$url = str_replace($domain, $encoded_domain, $url);

	$url = str_replace(
		array("%2F", "%3F", "%3D", "%40", "%3A", "%26", "%3B", "%2A", "%27"), 
		array("/",   "?",   "=",   "@",   ":",   "&",   ";",   "*",   "'"  ), 
		urlencode(urldecode($url)));
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
	curl_setopt($ch, CURLOPT_TIMEOUT, 60);
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
	$url = json_decode($_POST['url']);
	$page;
	$res = check_link($url);
	$page->siteCode = trim($res[1]);
	if($page->siteCode == '301'){
	    $url_301 = str_replace('http://', 'http://www.', $url);
	    $url_301 = str_replace('www.www.', '', $url_301);
	    $res = check_link($url_301);
	}

	$page->acceptEarly = false;
	if(preg_match("#Last-Modified: ([^\n]*)\n#siU", $res[4], $match)){
	    $lastmod = strtotime(trim($match[1]));
	    $early = strtotime("Wed, 26 Mar 2014 00:00:00 GMT");
	    $page->acceptEarly = ($lastmod < $early);
	    
	}
	


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

	$page->cmsmagazine = '';
	$page->cmsmagazineaccept = false;


		/*$res404 = check_link($url."sdfvfddd4.txt");
		$page->cmsmagazine .= ($res404[1] == '200'?'404 не настроена. ':'');*/

//	if(strpos($page->url, '6e8a796f731743be14649414df09d8f0.txt')){
		if(strpos($res[4], "\n6e8a796f731743be14649414df09d8f0")){
			$_c = $res[4];
			$_c = str_replace("\r", "",$_c);
			$_c = str_replace("\n", "endheader",$_c);
			$_c = preg_replace("#^.*endheaderendheader#iU", '',$_c);
			$_c = mb_substr($_c, 0, 2000);
			$page->cmsmagazine .= 'Содержимое: '. $_c;
			
/*			if($page->siteCode == '200' && $res404[1] != '200'){
			    $page->cmsmagazineaccept = true;
			}*/
			if($page->siteCode == '200' ){
			    $page->cmsmagazineaccept = true;
			}

			
		}/*else{
			$main_page_url = preg_replace('#(http[^/]+//[^/]+/).*$#siU','$1',$url);
			$main_page = check_link($main_page_url);
			$main_page = $main_page[4];
			if(strpos($main_page, '<meta name="cmsmagazine" content="6e8a796f731743be14649414df09d8f0" />')){
				$page->cmsmagazine = 'meta';
			}else{
				$page->cmsmagazine = 'none';
			}
		}*/

//	}

	$page->acceptEarly = ($page->acceptEarly && $page->cmsmagazineaccept);


	if(!$page->cmsmagazine){
		    $page->cmsmagazine = 'Содержимое не распознано';
	}
	
	if($page->siteCode == '301'){
		    $page->cmsmagazine = '301й редирект на другой адрес';
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

	include_once('ftp/ftp.class.php');

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
	}elseif($_POST['ftp_action'] == 'upload_mag'){
		$file = $_POST['ftp_filename'];
		$s = $_POST['ftp_stream'];
		$project = $_POST['project'];
		
		
		
		
		$ok = $ftp->upload($file, $s);
//		var_dump($ok);
		$dirs = $ftp->ftpDirList("", $project);
// 		echo "/upload_mag/\n";
// 		var_dump($dirs);
		foreach($dirs as $dir){
		    $ftp->cd($dir);
		    $ok = $ftp->upload($file, $s);

		}
		
		echo ($ok?"{true}":"{false}");
		
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



?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Подтверждение проектов</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
		<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
		<script type='text/javascript' src='jquery.json-2.2.min.js'></script>

		<script type='text/javascript' src='main_mag.js'></script>
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
#Alerts .alert{
    z-index: 999;
    position: relative;
}
		</style>
	</head>
	<body>
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="controls span1">
<textarea id="src" class="input-xlarge span12" rows="45" name="dseotext">


Вставляем сюда список провектов



</textarea>
				</div>
				<div class="span11">
					<ul class="nav nav-tabs" id="myTab">
						<li class="active"><a href="#results">Результаты проверки</a></li>
					</ul>
			
					<div class="tab-content">
						<div class="tab-pane active" id="results">
							<div id="Alerts" class="span12" style="height: 1px; overflow: visible; z-index: 999;"></div>
							<div id="urlchecks" class="span12"></div>
							<div class="row-fluid">
								<div class="controls span12">
									<h4>В виде текста</h4>
									<textarea id="dseo"  class="input-xlarge span12" rows="31"></textarea>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>

		<script type='text/javascript' src='bootstrap/js/bootstrap.min.js'></script>

	</body>
</html>