// billingt:Jun-20-2016 

function UnhideLogin(){
  var currentURL = window.location.href;
  var i = currentURL.search("/set-preferences.html");
  var end; if (i>0) {end = i} else end = currentURL.length;
  var currentDomain  = document.domain;
  var redirectUrl = getUrlParameter("redirect") || currentURL;
  // paley:Apr-26-2022 Replace link to Phoenix login page with link to our own.
  //var redirectString = "https://" + currentDomain + "/login.html?redirect="+ encodeURIComponent("https"+currentURL.substring(currentURL.search(":"),end));
  var redirectString = "/loginBioCyc.shtml?redirect="+ encodeURIComponent(redirectUrl);
  window.location.replace(redirectString);
}

function notifyIE() {
   var today    = new Date();
   var exp_date = new Date();
   var email_obj = document.getElementById("email");

   exp_date.setDate(today.getDate() + 14 )
   set_cookie("notifiedIE","Y", exp_date);
}

function notifiedIE() {
   var accepted = get_cookie("notifiedIE");
   var proceed = false;

   if ( accepted == "Y" ) {
       proceed = true;
   } 
   return(proceed);
}

function ieWarning() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

//    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    if (msie > 0 ) // Turn off EDGE / IE11+ checking for TF
    {
    //    alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
      if ( !notifiedIE() ) {
        notifyIE();
        alert("NOTICE:  Due to ongoing changes in the BioCyc website, we strongly suggest that you immediately switch from using Internet Explorer to Chrome, Firefox, Safari, Edge, or other Mozilla-based browsers. ");
      }
    }
    else  // If another browser, return 0
    {
//        alert('otherbrowser');
    }
    return false;
}
ieWarning();

