<?php

error_reporting(1);

if( ! empty( $_SERVER[ 'HTTP_X_REQUESTED_WITH' ] ) && strtolower( $_SERVER[ 'HTTP_X_REQUESTED_WITH' ]) == 'xmlhttprequest' ) {
    include('core/request.php');
}else{
    include('templates/main.html');
}