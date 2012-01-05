function fbEnsureInitObj(obj, method) {
    if(!window.fbApiInit) {
        setTimeout(function() {
            fbEnsureInitObj(obj,method);
        }, 50);
    } else {
        if(obj) {
            obj.__call(method);
        }
    }
}


function userEnsureInitObj(obj, method) {
    if(!window.userCheck) {
        setTimeout(function() {
            userEnsureInitObj(obj,method);
        }, 50);
    } else {
        if(obj) {
            obj.__call(method);
        }
    }
}


/**
 * get this base class an object name 
 * then you become the new obj extended the base obj
 */
baseMethod = function (namespace) {
    this.basenamespace = namespace;
    this.__call = function (methodName, params) {
        var evalCall = "";
        var sep = "";
        $(this.basenamespace).each(function (item,value) {
            if(item > 0 ) {
                sep = ".";
            }
            evalCall = evalCall + sep + value + "";
        });
        if(params != undefined) {
             
            evalCall = evalCall + "." + methodName+ "(params)";
        } else {
            evalCall = evalCall + "." + methodName+ "()";
        }
        
        eval( evalCall );
    }
    
}

var facebookHelper = function(namespace) {
    //this.prototype = new snipFrameBaseMethod()
    // addParent(this, snipFrameBaseMethod);  
    this.user_authorized = '';
    this.signed_request = '';
    this.authMethod = 'new';
    this.userId = false;
    this.userData = false;
    this.namespace = namespace;
    this.accessToken = false;
    this.authResponse = false;
    this.callBack = false;
    this.observerObjects = new Array();
   
    this.checkFacebook();
}


/**
 * extend the object facebookHelper from the snipFrameBaseMehtod
 */
facebookHelper.prototype = new baseMethod(['facebookHelper']);

/***
 * this method checks if the user has granted the application
 * 
 */
facebookHelper.prototype.checkAppPerms = function (callbackTrue,callbackFalse) {
    /**
     * return true, if the accessToken is set
     * in the application
     */
    (function (fbHelper) {
        FB.getLoginStatus(function(response) {
            //the user is connected with the app
            if (response.status === 'connected') {
                fbHelper.accessToken = response.authResponse.accessToken;
                fbHelper.userId = response.authResponse.userID;
                fbHelper.getUserData();
                window.userCheck = true;
                return true;
            } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            //but not connected to the app
            window.userCheck = true;
                return false;
            } else {
            // the user isn't even logged in to Facebook.
            window.userCheck = true;
            console.log("hey dude, log into facebook");
            //return false;
        }
        });
       
    })(this);
}



facebookHelper.prototype.authorize = function(function_yes, function_no)
{
    (function (fbHelper)  {
        /**
         * check here if the user is already connected
         * and later we check if the user has visited 
         * a new tab
         */
        FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.authResponse) {
                console.log(response);
                fbHelper.userId = response.authResponse.userID;
                fbHelper.accessToken = response.authResponse.accessToken;
                fbHelper.signed_request = response.authResponse.signedRequest;
                window.userCheck = true;
                // logged in and connected user, someone you know
                function_yes();
            } else {
                //set the window user check to false
                window.userCheck = false;
                // no user session available, someone you dont know
                fbHelper.doAuth(function_yes,function_no);
            }
        });
       
    })(this);
    
}


/**
 *
 * do the auth function
 */
facebookHelper.prototype.doAuth = function (function_yes,function_no) {
    //if the user isnt connected, show him the connect to the app dialog
    (function(fbHelper){
        FB.login(function(response) {
            if (response.authResponse) {
                window.userCheck = true;
                fbHelper.userId = response.authResponse.userID;
                fbHelper.accessToken = response.authResponse.accessToken;
                fbHelper.signed_request = response.authResponse.signedRequest;
                fbHelper.sendLoginChangesEvent(response);
                function_yes();
            } else {
                function_no();
            }
        })
    })(this);
}

/**
 *checks if the facebook Obj is avaiable,
 *if it is avaiable, set fbIsOn = true
 */
facebookHelper.prototype.checkFacebook = function () {
    (function (fbHelperObj) {
        fbEnsureInitObj(fbHelperObj,"setFacebookOn");    
    })(this);
    
}

facebookHelper.prototype.setFacebookOn = function () {
    this.fbIsOn = true;
    //set the user Data in the object
    (function(fbHelper) {
        //check if the user has permitted the app
        fbHelper.checkAppPerms()
        
    })(this);
    
}

facebookHelper.prototype.sendLoginChangesEvent = function (response) {
    var max = this.observerObjects.length;
    max  = max-1;
    //iterate over the observerObjects
    for(i=0;i<=max;i++) {
        /**
         * call the __call method in the object!
         */
        this.observerObjects[i][0].__call(this.observerObjects[i][1],response);
    }
}

/**
 * every object you regist here to listen to the login changes must
 * be a child of the object baseMethod
 */
facebookHelper.prototype.registForLoginChange = function (object, method) {
    var registArr = new Array(object, method);
    this.observerObjects.push(registArr);
}

facebookHelper.prototype.getUserDataId = function (userId, obj, method) {
    //if fb isnt here return true
    this.callBack = [obj, method];
    if(this.fbIsOn == false) {
        return true;
    }
    (function (fbHelperNew) {
        FB.api('/'+userId+'?access_token=' , function(response,obj, method) {
            if(fbHelperNew.callBack) {
                fbHelperNew.callBack[0].__call(fbHelperNew.callBack[1], response);
            }
        });
    })(this);
}


/**
 * call the userData from facebook
 */
facebookHelper.prototype.getUserData = function () {
    if(this.fbIsOn == false) {
        return true;
    }
   
    (function (fbHelper) {
        FB.api('/me?access_token=' + this.accessToken , function(response) {
            console.log(response);
            fbHelper.userData = response;
        });
    })(this);
    
}

/**
 * getter for the userid
 */
facebookHelper.prototype.getUserId = function () {
    return this.userId;  
}

/**
 *
 */
facebookHelper.prototype.checkAppAuth = function () {
    console.log(this.accessToken,this);
    if (this.fbIsOn == false) {
        console.log("facebook isnt ready, please wait until it`s done");
        return 'hu';
    } else if(this.accessToken == false ) {
       return false;
    } else {
        return true;
    }
}

/**
 * getter for the userName
 */    
facebookHelper.prototype.getUserName = function () {
    if(this.userData == false) {
        return false;
    }
    return this.userData.first_name;
}


facebookHelper = new facebookHelper(['facebookHelper']);