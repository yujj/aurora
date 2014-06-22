<?php
require '../vendor/autoload.php';
require '../core/request.php'; 


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
    'http://www.кто.рф/?id=кириллица_урл' => 'http://www.xn--j1ail.xn--p1ai/?id=%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D1%83%D1%80%D0%BB',
    'http://www.electroprogress.ru/catalog/izmerit/1074#hash' => 'http://www.electroprogress.ru/catalog/izmerit/1074',

);
foreach($urls as $url => $res){
    $r = urlencodeAndPunycodeAsBrowser($url);
    echo "<div style='border: 1px dashed #999;'>";
    if($res == $r){
	    echo "<span style='color: lime;'>OK</span>";
	    $res='';
    }else{
	    echo "<span style='color: red;'>ERROR</span>";
    }
    echo "<br><p>$url => </p><p>$r == </p><p>$res</p></div>";
}
