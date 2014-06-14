<?php

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
	
	$res = check_link($url);
	if ( preg_match('#<meta[^>]+content\s*=\s*["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4])
          || preg_match('#<meta charset\s*=\s*["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4]) 
	) {
		$res[4] = iconv("cp1251", "UTF-8", $res[4]);
	} //preg_match('#<meta[^>]+content=["\'][^>]*(1251|windows)[^>]*["\'][^>]*>#siU', $res[4])
	elseif (preg_match('#<meta[^>]+content=["\'][^>]*koi8-r[^>]*["\'][^>]*>#siU', $res[4])) {
		$res[4] = iconv("koi8-r", "UTF-8", $res[4]);
	} //preg_match('#<meta[^>]+content=["\'][^>]*koi8-r[^>]*["\'][^>]*>#siU', $res[4])

	$page = new stdClass();
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

	$result = json_encode($page);
	
	echo $result;
	exit();
} //isset($_POST['url'])

