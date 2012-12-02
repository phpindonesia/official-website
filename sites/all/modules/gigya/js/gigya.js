(function ($) {

  /**
   * @todo Undocumented Code!
   */
  $.extend({
    getUrlVars: function () {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function (name) {
      return $.getUrlVars()[name];
    }
  });

  Drupal.gigya = Drupal.gigya || {};

  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.logoutResponse = function (response) {
    if (response['status'] == 'OK') {
      document.getElementById('logoutMessage').innerHTML = "Successfully logged out, redirecting";
      window.location = Drupal.settings.gigya.logoutLocation;
    }
  };

  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.loginCallback = function (response) {
    urlObj = {'signature':response['UIDSignature'], 'timestamp':response['signatureTimestamp'], 'UID':response['UID'], 'email': response.user.email};
    if(response['provider'] != 'site' && Drupal.settings.gigya.loginDestination != undefined){
      var query = $.param(urlObj, true);
      window.location = Drupal.settings.gigya.loginDestination + '?' + query;
    }
  };

  /**
   * Callback for the getUserInfo function.
   *
   * Takes the getUserInfo object and renders the HTML to display an array
   * of the user object
   *
   * TODO: probably should be removed in production, since its just for dumping
   * user output.
   */
  Drupal.gigya.getUserInfoCallback = function (response) {
    if (response.status == 'OK') {
      var user = response['user'];
      // Variable which will hold property values.
      var str="<pre>";
      for (prop in user) {
        if (prop == 'birthYear' && user[prop] == 2009) {
          user[prop] = '';
        }
        if (prop == 'identities') {
          for (ident in user[prop]) {
            for (provide in user[prop][ident]) {
             str+=provide + " SUBvalue :"+ user[prop][ident][provide]+"\n";
            }
          }
        }
        // Concate prop and its value from object.
        str+=prop + " value :"+ user[prop]+"\n";
      }
      str+="</pre>";

      document.getElementById('userinfo').innerHTML = str;
    }
  };

  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.showAddConnectionsUI = function (connectUIParams) {
    gigya.services.socialize.showAddConnectionsUI(connectUIParams);
  };

  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.notifyLoginCallback = function (response) {
    if (response['status'] == 'OK') {
      setTimeout("$.get(Drupal.settings.basePath + 'socialize-ajax/notify-login')", 1000);
    }
  };


  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.initResponse = function (response) {
    if (null != response.user) {
      if (response.user.UID != Drupal.settings.gigya.notifyLoginParams.siteUID || !response.user.isLoggedIn) {
        gigya.services.socialize.notifyLogin(Drupal.settings.gigya.notifyLoginParams);
      }
    }
  }

})(jQuery);

