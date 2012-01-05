var pageControl = function () {
    (function (pageObj) {
        userEnsureInitObj(pageObj,"init");    
    })(this);
    this.signedRequest = null;
    this.pageBox = $('._pageBox');
    this.hideAllPages();
    facebookHelper.registForLoginChange(this,'receiveLoginChange');
    
}

/**
 * extend the object facebookHelper from the snipFrameBaseMehtod
 */
pageControl.prototype = new baseMethod(['pageControlObj']);

/*
* receive the login change
*/
pageControl.prototype.receiveLoginChange = function (change) {
    this.signedRequest = change.authResponse.signedRequest;
    //call again the init process
    this.init();    
}

/**
 * start the pageControl first when the facebook sdk is loaded
 */
pageControl.prototype.init = function () {
    this.hideAllPages();
    this.getSignedRequest();
    this.addEvents();
}
 
 
/**
 * get the parsed signed_request object
 * from the ajax backend
 */
pageControl.prototype.getSignedRequest = function () {
    /**
     * send the unparsed signed_request to the ajax backend
     */
    (function(pCObj){
        var dataString = { 
            mode:'getSignedRequest',
            signed_request:signedRequest
         
        };
   
        $.ajax({
            type: "POST",
            url: "ajax.php",
            data: dataString,
            dataType:'json',
            success: function(data)
            {
                //set on success the parsed data out of the signed request
                pCObj.signedRequest = data;
                pCObj.showCurrentPageMode();
            }
        });
    })(this);
}

/**
 * getter for the parsed signed request object
 */
pageControl.prototype.getParsedRequest = function () {
    if(this.signedRequest != null) {
        return this.signedRequest;
    } else {
        return false;
    }
}

/**
 *add some events to the page
 */
pageControl.prototype.addEvents = function () {
    $('#askPermissions').click(function () {
        //show the facebook Authorize dialog when the user click on this element
        facebookHelper.authorize(yes,no);
    });
   
}
function yes() {
    //call again the init
    pageControlObj.init();
}

function no() {
    alert("you must login to the app to use it... sorry");
}

/**
 * this method hides all the pageBoxes
 */
pageControl.prototype.hideAllPages = function () {
    $(this.pageBox).hide();
}

/**
 * show the current activated pageBox
 * //fan//noFan
 */
pageControl.prototype.showCurrentPageMode = function () {
    if(this.signedRequest.page.liked === false) {
        //noFan
        $('#noFan').show();
    } else if(this.signedRequest.page.liked === true) {
        //isFan 
        //check here if the user has granted the app permissions
        if( facebookHelper.checkAppAuth() == true) {
            //the user has granted the app permissions
            $('#userHasAppPermitted').show();
        } else {
            //the user hasnt granted the app permissions, he is only an page Fan
            $('#isFan').show();
        }
    }
    
}

/**
* if the all.js is loaded make the init
*/
window.fbAsyncInit = function() {
    FB.init({
        appId  : appId,
        status : true, // check login status
        cookie : true, // enable cookies to allow the server to access the session
        xfbml  : true,  // parse XFBML
        oauth : true
    });

    FB.Canvas.setAutoResize();
    fbApiInit = true; //init flag
    

};

/**
 * make sure that the facebook init is done
 * before maken an facebook call through the js 
 * facebook sdk ( all.js ) 
 */
function fbEnsureInit(callback) {
    if(!window.fbApiInit) {
        setTimeout(function() {
            fbEnsureInit(callback);
        }, 50);
    } else {
        if(callback) {
            callback();
        }
    }
}
        
