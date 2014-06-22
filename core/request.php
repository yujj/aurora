<?php

use GuzzleHttp\Exception\ClientException;

function dispatch($data){
    if(isset($data->url)){
	return http_get($data->url);
    }
}

function http_get($url){
    $url = urlencodeAndPunycodeAsBrowser($url);
    $result = array(
	statusCode => 0,
	effectiveUrl => $url,
	redirects => array(),
	isRedirectsLimitReached => false,
	contentType => '',
	body => '',
    );
    
    $res;
    
    do{
	
	$res = GuzzleHttp\get($url, [
	    'allow_redirects' => false,
	    'exceptions' => false,
	    'headers' => [
		'X-DUSYA' => 'On',
		'Cookie' => 'DUR_DEBUG=true;',
	    ],
	]);
	
	$statusCode = $result['statusCode'] = $res->getStatusCode();
	
	$is_redirect = ($statusCode > 300) && ($statusCode < 304);
	
	if($is_redirect){
	    
	    $location = $res->getHeader('Location');
	    $location = GuzzleHttp\Url::fromString($location);

	    // Combine location with the original URL if it is not absolute.
	    if (!$location->isAbsolute()) {
		$originalUrl = GuzzleHttp\Url::fromString($url);
		// Remove query string parameters and just take what is present on
		// the redirect Location header
		$originalUrl->getQuery()->clear();
		$location = $originalUrl->combine($location);
	    }
	    
	    $url = $result['effectiveUrl'] = (string)$location;
	    
	    $result['redirects'][] = array(
		    'statusCode' => $statusCode,
		    'effectiveUrl' => $url,
	    );
	    
	    $result['isRedirectsLimitReached'] = count($result['redirects']) > 5;
	}

	
    
    }while($is_redirect && !$result['isRedirectsLimitReached']);
    
    $result['contentType'] = $contentType = $res->getHeader('content-type');
    $body = (string)$res->getBody();

    $charset = preg_replace('#^.*charset=(.*)$#siU', '$1', $contentType);

    if($charset && $charset != 'utf8'){
	$body = iconv($charset, 'utf8', $body);
    }


    $result['body'] = $body;
    
    return $result;
    
}

function urlencodeAndPunycodeAsBrowser($url){
	mb_internal_encoding('utf-8');
	
	$Punycode = new True\Punycode();
	
	$url = parse_url($url);
	
	$url['host'] = $Punycode->encode($url['host']);
	$path = $url['path'];
	$path = str_replace(
	    array("%2F",  "%3D", "%40", "%3A", "%3B", "%2A", "%27"), 
	    array("/",      "=",   "@",   ":",   ";",   "*",   "'"), 
	    urlencode(urldecode($path)));	
	$url['path'] = $path;
	
	if(isset($url['query'])){
	    $query = $url['query'];
	    $query = str_replace(
		array("%2F", "%3F", "%3D", "%40", "%3A", "%26", "%3B", "%2A", "%27", "%23"), 
		array("/",   "?",   "=",   "@",   ":",   "&",   ";",   "*",   "'", "#"  ), 
		urlencode(urldecode($query)));	
	    $url['query'] = $query;
	}
	
	unset($url['fragment']);
	
	
	$url = unparse_url($url);
	
	return $url;
}

function unparse_url($parsed_url) { 
  $scheme   = isset($parsed_url['scheme']) ? $parsed_url['scheme'] . '://' : ''; 
  $host     = isset($parsed_url['host']) ? $parsed_url['host'] : ''; 
  $port     = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : ''; 
  $user     = isset($parsed_url['user']) ? $parsed_url['user'] : ''; 
  $pass     = isset($parsed_url['pass']) ? ':' . $parsed_url['pass']  : ''; 
  $pass     = ($user || $pass) ? "$pass@" : ''; 
  $path     = isset($parsed_url['path']) ? $parsed_url['path'] : ''; 
  $query    = isset($parsed_url['query']) ? '?' . $parsed_url['query'] : ''; 
  $fragment = isset($parsed_url['fragment']) ? '#' . $parsed_url['fragment'] : ''; 
  return "$scheme$user$pass$host$port$path$query$fragment"; 
} 
