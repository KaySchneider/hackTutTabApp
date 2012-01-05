<?php
session_start();
/**
 * this the source code for an small tutorial and not for production system 
 * This is not "MVC" driven! ;)
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

$color = "silver";

/**
 * Demonstration to catch the data iin app_data
 */
if (isset($signedRequest['app_data'])) {
    $data = explode("|", $signedRequest['app_data']);
    if ($data[0] == 'color') {
        $color = htmlspecialchars($data[1]);
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/jquery-1.6.2.min.js" /></script>
        <script src="js/facebookHelper.js" /></script>
        <script src="js/pageControl.js" /></script>
</head>
<body style="background:<?php echo $color ?>">
    <a href="<?php echo PAGE_URL ?>&app_data=color|red" target="_top">CHANGE BACKGROUND</a>
    <?php
    if (!isset($signedRequest['page'])) {
        echo "YOU ARE NOT ON AN FACEBOOK PAGE TAB :)";
        ?>
        <!-- adding the application to an page tab this is new since 11.2011 -->
        <a href="#" onclick=window.open("http://www.facebook.com/dialog/pagetab?app_id=<?php echo APP_ID ?>&redirect_uri=http://apps.facebook.com/hacktutapptab/","PageTab","width=500,height=200");>
           Dialog</a>
           <?php
       }
       ?> 
    <div id="noFan" class="_pageBox">
        <!-- Show this content if the user isnt an fan of this page -->
        <h2>NO Fan</h2>
    </div>
    <div id="isFan" class="_pageBox">
        <!-- Show this content if the user isnt an fan of this page -->
        <h2>is Fan</h2>
        <div id="askPermissions" class="">
            Click here to pass the userRights!
        </div>
    </div>
    <div id="userHasAppPermitted"  class="_pageBox">
        <!-- Show this content Box if the user has permitted the app  -->
        <h2>you have the app permitted</h2>
    </div>
   
        
    <div id="fb-root"></div>
    <script type="text/javascript">
        var appId = <?php echo APP_ID ?>;
        //save the original signed request in an javascript param
        var signedRequest = "<?php echo $_REQUEST['signed_request'] ?>";
        
        var pageControlObj;
        $('document').ready(function() {
            //make an instance of the Object pageControl in the file js/pageControl.js
            pageControlObj = new pageControl();
        });
        
        /**
         * load the all.js from the javscript facebook sdk asynchronusly
         */
        (function() {
            var e = document.createElement('script');
            e.src = document.location.protocol + '//connect.facebook.net/<?php echo $signedRequest['user']['locale']; ?>/all.js'; //insert here the locale of the user, than the correct langauge of the all.js will be loaded
            e.async = true;
            document.getElementById('fb-root').appendChild(e);
        }()); 
          
    </script>
    <a href="https://github.com/KaySchneider/hackTutTabApp">View the app Source Code on github</a> <br/>
    <a href="http://hackthegraph.blogspot.com/2012/01/facebook-tab-app-tutorial.html">View the tutorial written in german</a>
</body>
</html>
