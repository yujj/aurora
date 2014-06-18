<?php

error_reporting(1);

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if( $data ){
    require 'vendor/autoload.php';
    require 'core/request.php';
    echo json_encode(dispatch($data));
}else{
    require 'templates/main.html';
}