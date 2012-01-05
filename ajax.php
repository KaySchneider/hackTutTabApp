<?php
session_start();
/**
 * this is the ajax callback for the tutorial
 * This is not to use in an production system
 * it causes some security risk
 */

/**
 * include here the classes
 * parseSignedRequest
 */
include_once('php/facebook.php'); 
require('config.php');
/*
 * get the signed request from facebook
 * use the facebook php sdk to do this ;)
 * 
 */
$config = array();
$config['appId'] = APP_ID;
$config['secret'] = APP_SECRET;

$facebook = new Facebook($config);
//get the data of the signed request from facebook sdk 
$signedRequest = $facebook->getSignedRequest();

if(!isset($_POST['mode'])) {
    die("nothing to do");
}

/**
 * in an ajax request you can access the params via post or get as usual
 */
switch($_POST['mode']) {
    case "getSignedRequest":
        echo json_encode($signedRequest);
    break;
}
?>
