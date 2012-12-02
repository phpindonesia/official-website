/*
 * jQuery FlexSlider v1.8
 * http://flex.madebymufffin.com
 * Copyright 2011, Tyler Smith
 */
(function(a){a.flexslider=function(c,b){var d=c;d.init=function(){d.vars=a.extend({},a.flexslider.defaults,b);d.data("flexslider",true);d.container=a(".slides",d);d.slides=a(".slides > li",d);d.count=d.slides.length;d.animating=false;d.currentSlide=d.vars.slideToStart;d.animatingTo=d.currentSlide;d.atEnd=(d.currentSlide==0)?true:false;d.eventType=("ontouchstart" in document.documentElement)?"touchstart":"click";d.cloneCount=0;d.cloneOffset=0;d.manualPause=false;d.vertical=(d.vars.slideDirection=="vertical");d.prop=(d.vertical)?"top":"marginLeft";d.args={};d.transitions="webkitTransition" in document.body.style;if(d.transitions){d.prop="-webkit-transform"}if(d.vars.controlsContainer!=""){d.controlsContainer=a(d.vars.controlsContainer).eq(a(".slides").index(d.container));d.containerExists=d.controlsContainer.length>0}if(d.vars.manualControls!=""){d.manualControls=a(d.vars.manualControls,((d.containerExists)?d.controlsContainer:d));d.manualExists=d.manualControls.length>0}if(d.vars.randomize){d.slides.sort(function(){return(Math.round(Math.random())-0.5)});d.container.empty().append(d.slides)}if(d.vars.animation.toLowerCase()=="slide"){if(d.transitions){d.setTransition(0)}d.css({overflow:"hidden"});if(d.vars.animationLoop){d.cloneCount=2;d.cloneOffset=1;d.container.append(d.slides.filter(":first").clone().addClass("clone")).prepend(d.slides.filter(":last").clone().addClass("clone"))}d.newSlides=a(".slides > li",d);var m=(-1*(d.currentSlide+d.cloneOffset));if(d.vertical){d.newSlides.css({display:"block",width:"100%","float":"left"});d.container.height((d.count+d.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){d.css({position:"relative"}).height(d.slides.filter(":first").height());d.args[d.prop]=(d.transitions)?"translate3d(0,"+m*d.height()+"px,0)":m*d.height()+"px";d.container.css(d.args)},100)}else{d.args[d.prop]=(d.transitions)?"translate3d("+m*d.width()+"px,0,0)":m*d.width()+"px";d.container.width((d.count+d.cloneCount)*200+"%").css(d.args);setTimeout(function(){d.newSlides.width(d.width()).css({"float":"left",display:"block"})},100)}}else{d.transitions=false;d.slides.css({width:"100%","float":"left",marginRight:"-100%"}).eq(d.currentSlide).fadeIn(d.vars.animationDuration)}if(d.vars.controlNav){if(d.manualExists){d.controlNav=d.manualControls}else{var e=a('<ol class="flex-control-nav"></ol>');var s=1;for(var t=0;t<d.count;t++){e.append("<li><a>"+s+"</a></li>");s++}if(d.containerExists){a(d.controlsContainer).append(e);d.controlNav=a(".flex-control-nav li a",d.controlsContainer)}else{d.append(e);d.controlNav=a(".flex-control-nav li a",d)}}d.controlNav.eq(d.currentSlide).addClass("active");d.controlNav.bind(d.eventType,function(i){i.preventDefault();if(!a(this).hasClass("active")){(d.controlNav.index(a(this))>d.currentSlide)?d.direction="next":d.direction="prev";d.flexAnimate(d.controlNav.index(a(this)),d.vars.pauseOnAction)}})}if(d.vars.directionNav){var v=a('<ul class="flex-direction-nav"><li><a class="prev" href="#">'+d.vars.prevText+'</a></li><li><a class="next" href="#">'+d.vars.nextText+"</a></li></ul>");if(d.containerExists){a(d.controlsContainer).append(v);d.directionNav=a(".flex-direction-nav li a",d.controlsContainer)}else{d.append(v);d.directionNav=a(".flex-direction-nav li a",d)}if(!d.vars.animationLoop){if(d.currentSlide==0){d.directionNav.filter(".prev").addClass("disabled")}else{if(d.currentSlide==d.count-1){d.directionNav.filter(".next").addClass("disabled")}}}d.directionNav.bind(d.eventType,function(i){i.preventDefault();var j=(a(this).hasClass("next"))?d.getTarget("next"):d.getTarget("prev");if(d.canAdvance(j)){d.flexAnimate(j,d.vars.pauseOnAction)}})}if(d.vars.keyboardNav&&a("ul.slides").length==1){function h(i){if(d.animating){return}else{if(i.keyCode!=39&&i.keyCode!=37){return}else{if(i.keyCode==39){var j=d.getTarget("next")}else{if(i.keyCode==37){var j=d.getTarget("prev")}}if(d.canAdvance(j)){d.flexAnimate(j,d.vars.pauseOnAction)}}}}a(document).bind("keyup",h)}if(d.vars.mousewheel){d.mousewheelEvent=(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll":"mousewheel";d.bind(d.mousewheelEvent,function(y){y.preventDefault();y=y?y:window.event;var i=y.detail?y.detail*-1:y.wheelDelta/40,j=(i<0)?d.getTarget("next"):d.getTarget("prev");if(d.canAdvance(j)){d.flexAnimate(j,d.vars.pauseOnAction)}})}if(d.vars.slideshow){if(d.vars.pauseOnHover&&d.vars.slideshow){d.hover(function(){d.pause()},function(){if(!d.manualPause){d.resume()}})}d.animatedSlides=setInterval(d.animateSlides,d.vars.slideshowSpeed)}if(d.vars.pausePlay){var q=a('<div class="flex-pauseplay"><span></span></div>');if(d.containerExists){d.controlsContainer.append(q);d.pausePlay=a(".flex-pauseplay span",d.controlsContainer)}else{d.append(q);d.pausePlay=a(".flex-pauseplay span",d)}var n=(d.vars.slideshow)?"pause":"play";d.pausePlay.addClass(n).text((n=="pause")?d.vars.pauseText:d.vars.playText);d.pausePlay.bind(d.eventType,function(i){i.preventDefault();if(a(this).hasClass("pause")){d.pause();d.manualPause=true}else{d.resume();d.manualPause=false}})}if("ontouchstart" in document.documentElement){var w,u,l,r,o,x,p=false;d.each(function(){if("ontouchstart" in document.documentElement){this.addEventListener("touchstart",g,false)}});function g(i){if(d.animating){i.preventDefault()}else{if(i.touches.length==1){d.pause();r=(d.vertical)?d.height():d.width();x=Number(new Date());l=(d.vertical)?(d.currentSlide+d.cloneOffset)*d.height():(d.currentSlide+d.cloneOffset)*d.width();w=(d.vertical)?i.touches[0].pageY:i.touches[0].pageX;u=(d.vertical)?i.touches[0].pageX:i.touches[0].pageY;d.setTransition(0);this.addEventListener("touchmove",k,false);this.addEventListener("touchend",f,false)}}}function k(i){o=(d.vertical)?w-i.touches[0].pageY:w-i.touches[0].pageX;p=(d.vertical)?(Math.abs(o)<Math.abs(i.touches[0].pageX-u)):(Math.abs(o)<Math.abs(i.touches[0].pageY-u));if(!p){i.preventDefault();if(d.vars.animation=="slide"&&d.transitions){if(!d.vars.animationLoop){o=o/((d.currentSlide==0&&o<0||d.currentSlide==d.count-1&&o>0)?(Math.abs(o)/r+2):1)}d.args[d.prop]=(d.vertical)?"translate3d(0,"+(-l-o)+"px,0)":"translate3d("+(-l-o)+"px,0,0)";d.container.css(d.args)}}}function f(j){d.animating=false;if(d.animatingTo==d.currentSlide&&!p&&!(o==null)){var i=(o>0)?d.getTarget("next"):d.getTarget("prev");if(d.canAdvance(i)&&Number(new Date())-x<550&&Math.abs(o)>20||Math.abs(o)>r/2){d.flexAnimate(i,d.vars.pauseOnAction)}else{d.flexAnimate(d.currentSlide,d.vars.pauseOnAction)}}this.removeEventListener("touchmove",k,false);this.removeEventListener("touchend",f,false);w=null;u=null;o=null;l=null}}if(d.vars.animation.toLowerCase()=="slide"){a(window).resize(function(){if(!d.animating){if(d.vertical){d.height(d.slides.filter(":first").height());d.args[d.prop]=(-1*(d.currentSlide+d.cloneOffset))*d.slides.filter(":first").height()+"px";if(d.transitions){d.setTransition(0);d.args[d.prop]=(d.vertical)?"translate3d(0,"+d.args[d.prop]+",0)":"translate3d("+d.args[d.prop]+",0,0)"}d.container.css(d.args)}else{d.newSlides.width(d.width());d.args[d.prop]=(-1*(d.currentSlide+d.cloneOffset))*d.width()+"px";if(d.transitions){d.setTransition(0);d.args[d.prop]=(d.vertical)?"translate3d(0,"+d.args[d.prop]+",0)":"translate3d("+d.args[d.prop]+",0,0)"}d.container.css(d.args)}}})}d.vars.start(d)};d.flexAnimate=function(g,f){if(!d.animating){d.animating=true;d.animatingTo=g;d.vars.before(d);if(f){d.pause()}if(d.vars.controlNav){d.controlNav.removeClass("active").eq(g).addClass("active")}d.atEnd=(g==0||g==d.count-1)?true:false;if(!d.vars.animationLoop&&d.vars.directionNav){if(g==0){d.directionNav.removeClass("disabled").filter(".prev").addClass("disabled")}else{if(g==d.count-1){d.directionNav.removeClass("disabled").filter(".next").addClass("disabled")}else{d.directionNav.removeClass("disabled")}}}if(!d.vars.animationLoop&&g==d.count-1){d.pause();d.vars.end(d)}if(d.vars.animation.toLowerCase()=="slide"){var e=(d.vertical)?d.slides.filter(":first").height():d.slides.filter(":first").width();if(d.currentSlide==0&&g==d.count-1&&d.vars.animationLoop&&d.direction!="next"){d.slideString="0px"}else{if(d.currentSlide==d.count-1&&g==0&&d.vars.animationLoop&&d.direction!="prev"){d.slideString=(-1*(d.count+1))*e+"px"}else{d.slideString=(-1*(g+d.cloneOffset))*e+"px"}}d.args[d.prop]=d.slideString;if(d.transitions){d.setTransition(d.vars.animationDuration);d.args[d.prop]=(d.vertical)?"translate3d(0,"+d.slideString+",0)":"translate3d("+d.slideString+",0,0)";d.container.css(d.args).one("webkitTransitionEnd transitionend",function(){d.wrapup(e)})}else{d.container.animate(d.args,d.vars.animationDuration,function(){d.wrapup(e)})}}else{d.slides.eq(d.currentSlide).fadeOut(d.vars.animationDuration);d.slides.eq(g).fadeIn(d.vars.animationDuration,function(){d.wrapup()})}}};d.wrapup=function(e){if(d.vars.animation=="slide"){if(d.currentSlide==0&&d.animatingTo==d.count-1&&d.vars.animationLoop){d.args[d.prop]=(-1*d.count)*e+"px";if(d.transitions){d.setTransition(0);d.args[d.prop]=(d.vertical)?"translate3d(0,"+d.args[d.prop]+",0)":"translate3d("+d.args[d.prop]+",0,0)"}d.container.css(d.args)}else{if(d.currentSlide==d.count-1&&d.animatingTo==0&&d.vars.animationLoop){d.args[d.prop]=-1*e+"px";if(d.transitions){d.setTransition(0);d.args[d.prop]=(d.vertical)?"translate3d(0,"+d.args[d.prop]+",0)":"translate3d("+d.args[d.prop]+",0,0)"}d.container.css(d.args)}}}d.animating=false;d.currentSlide=d.animatingTo;d.vars.after(d)};d.animateSlides=function(){if(!d.animating){d.flexAnimate(d.getTarget("next"))}};d.pause=function(){clearInterval(d.animatedSlides);if(d.vars.pausePlay){d.pausePlay.removeClass("pause").addClass("play").text(d.vars.playText)}};d.resume=function(){d.animatedSlides=setInterval(d.animateSlides,d.vars.slideshowSpeed);if(d.vars.pausePlay){d.pausePlay.removeClass("play").addClass("pause").text(d.vars.pauseText)}};d.canAdvance=function(e){if(!d.vars.animationLoop&&d.atEnd){if(d.currentSlide==0&&e==d.count-1&&d.direction!="next"){return false}else{if(d.currentSlide==d.count-1&&e==0&&d.direction=="next"){return false}else{return true}}}else{return true}};d.getTarget=function(e){d.direction=e;if(e=="next"){return(d.currentSlide==d.count-1)?0:d.currentSlide+1}else{return(d.currentSlide==0)?d.count-1:d.currentSlide-1}};d.setTransition=function(e){d.container.css({"-webkit-transition-duration":(e/1000)+"s"})};d.init()};a.flexslider.defaults={animation:"fade",slideDirection:"horizontal",slideshow:true,slideshowSpeed:7000,animationDuration:600,directionNav:true,controlNav:true,keyboardNav:true,mousewheel:false,prevText:"Previous",nextText:"Next",pausePlay:false,pauseText:"Pause",playText:"Play",randomize:false,slideToStart:0,animationLoop:true,pauseOnAction:true,pauseOnHover:false,controlsContainer:"",manualControls:"",start:function(){},before:function(){},after:function(){},end:function(){}};a.fn.flexslider=function(b){return this.each(function(){if(a(this).find(".slides li").length==1){a(this).find(".slides li").fadeIn(400)}else{if(a(this).data("flexslider")!=true){new a.flexslider(a(this),b)}}})}})(jQuery);;
jQuery(document).ready(function() {

/* Slider */	
	
 jQuery('.flexslider').flexslider({
  controlNav: false,
  directionNav:true,
  animation: "fade",              //String: Select your animation type, "fade" or "slide"
  slideshow: true                //Boolean: Animate slider automatically
  });

});;

/**
 * @file
 *
 * Javascript specific to facebook connect pages.  This means pages
 * which are not canvas pages, and where fb_connect.module has
 * initialized the facebook api. The user may or may not have
 * authorized the app, this javascript will still be loaded.
 *
 * Note (!) much of the work done here is deprecated, and moved to fb.js
 * (where code works equally well on both connect pages and canvas
 * pages).  If your app needs the features here, please report your
 * use case to our issue queue (http://drupal.org/project/issues/fb),
 * otherwise these features may go away...
 */
(function ($) {
  Drupal.behaviors.fb_connect = {
    attach: function(context, settings) {
      // Logout of facebook when logging out of drupal.
      jQuery("a[href^='" + Drupal.settings.basePath + "user/logout']", context).click(FB_Connect.logoutHandler);
      jQuery("a[href^='" + Drupal.settings.fb_connect.front_url + "user/logout']", context).click(FB_Connect.logoutHandler); // front_url includes language.  I.e. "/en/"

      // Support markup for dialog boxes.
      FB_Connect.enablePopups(context);

      var events = jQuery(document).data('events');
      if (!events || !events.fb_session_change) {
        jQuery(document).bind('fb_session_change', FB_Connect.sessionChangeHandler);
      }
    }
  };
})(jQuery);

FB_Connect = function(){};

// JQuery pseudo-event handler.
FB_Connect.sessionChangeHandler = function(context, status) {
  jQuery('.block-fb_connect')
    .ajaxStart(function() {
      // This is an attempt to trigger the drupal progress indicator.  Not convinced that it works.
      jQuery(this).wrap('<div class="bar filled"></div>').wrap('<div class="bar filled"></div>');
    })
    .ajaxStop(function() {
      //jQuery(this).html('');
      // unwrap() not defined.
      jQuery(this).parent().removeClass('bar filled').parent().removeClass('bar filled');
    })
  ;

  // Call the default handler, too.
  FB_JS.sessionChangeHandler(context, status);
};

// click handler
FB_Connect.logoutHandler = function(event) {
  // If we need to reload, go to front page.
  Drupal.settings.fb.reload_url = Drupal.settings.fb_connect.front_url;

  if (typeof(FB) != 'undefined' && FB.getAuthResponse()) {
    try {
      FB.logout(function () {
        // Logged out of facebook.  Session change event will log us out of drupal and
      });
      // Facebook's invalid cookies persist if third-party cookies disabled.
      // Let's try to clean up the mess.
      // @TODO: is this still needed with newer oauth SDK???
      //FB_JS.deleteCookie('fbs_' + Drupal.settings.fb.apikey, '/', ''); // apikey

      if (FB.getUserID()) { // @TODO: still needed with newer oauth SDK???
        // Facebook needs more time to log us out. (http://drupal.org/node/1164048)
        return false;
      }
    }
    catch (e) {
      return false;
    }
  }
  else {
    debugger;
    return true;
  }
};

/**
 * Move new dialogs to visible part of screen.
 **/
FB_Connect.centerPopups = function() {
  var scrollTop = $(window).scrollTop();
  $('.fb_dialog:not(.fb_popup_centered)').each(function() {
    var offset = $(this).offset();
    if (offset.left == 0) {
      // This is some facebook cruft that cannot be centered.
    }
    else if (offset.top < 0) {
      // Not yet visible, don't center.
    }
    else if (offset.top < scrollTop) {
      $(this).css('top', offset.top + scrollTop + 'px');
      $(this).addClass('fb_popup_centered'); // Don't move this dialog again.
    }
  });
};


FB_Connect.enablePopups = function(context) {
  // Support for easy fbml popup markup which degrades when javascript not enabled.
  // Markup is subject to change.  Currently...
  // <div class=fb_fbml_popup_wrap><a title="POPUP TITLE">LINK MARKUP</a><div class=fb_fbml_popup><fb:SOME FBML>...</fb:SOME FBML></div></div>
  jQuery('.fb_fbml_popup:not(.fb_fbml_popup-processed)', context).addClass('fb_fbml_popup-processed').prev().each(
    function() {
      this.fbml_popup = $(this).next().html();
      this.fbml_popup_width = parseInt($(this).next().attr('width'));
      this.fbml_popup_height = parseInt($(this).next().attr('height'));
      //console.log("stored fbml_popup markup: " + this.fbml_popup); // debug
      $(this).next().remove(); // Remove FBML so facebook does not expand it.
    })
    // Handle clicks on the link element.
    .bind('click',
	  function (e) {
	    var popup;
	    //console.log('Clicked!  Will show ' + this.fbml_popup); // debug

	    // http://forum.developers.facebook.net/viewtopic.php?pid=243983
	    var size = FB.UIServer.Methods["fbml.dialog"].size;
	    if (this.fbml_popup_width) {
	      size.width=this.fbml_popup_width;
	    }
	    if (this.fbml_popup_height) {
	      size.height=this.fbml_popup_height;
	    }
	    FB.UIServer.Methods['fbml.dialog'].size = size;

	    // http://forum.developers.facebook.net/viewtopic.php?id=74743
	    var markup = this.fbml_popup;
	    if ($(this).attr('title')) {
	      markup = '<fb:header icon="true" decoration="add_border">' + $(this).attr('title') + '</fb:header>' + this.fbml_popup;
	    }
	    var dialog = {
	      method: 'fbml.dialog', // triple-secret undocumented feature.
	      display: 'dialog',
	      fbml: markup,
	      width: this.fbml_popup_width,
	      height: this.fbml_popup_height
	    };
	    var popup = FB.ui(dialog, function (response) {
	      console.log(response);
	    });

	    // Start a timer to keep popups centered.
	    // @TODO - avoid starting timer more than once.
	    window.setInterval(FB_Connect.centerPopups, 500);

	    e.preventDefault();
	  })
    .parent().show();
};

;
// $Id: fbconnect.js,v 1.4 2010/03/21 16:26:03 vectoroc Exp $

Drupal.fbconnect = Drupal.fbconnect || {};
Drupal.fbconnect.init = function () {
  Drupal.behaviors.fbconnect = function(context) {
    if (context != document) {
      jQuery(context).each(function() { FB.XFBML.parse(this); });
    }
    Drupal.fbconnect.initLogoutLinks(context);
  }

  if (Drupal.settings.fbconnect.loginout_mode == 'auto') {
    FB.Event.subscribe('auth.authResponseChange', Drupal.fbconnect.reload_ifUserConnected);
//    FB.Event.subscribe('auth.login', function(response) {
//      console.log('event auth.login');
//    });
  }

  Drupal.behaviors.fbconnect(document);
}

Drupal.fbconnect.logout = function(keep_fbaccount_logged) {
  var logout_url = Drupal.settings.basePath + 'user/logout';
  if (!keep_fbaccount_logged) {
    FB.logout(function(response) {
      window.location.href = logout_url;
    });
  }
  else {
    window.location.href = logout_url;
  }
}

Drupal.fbconnect.reload_ifUserConnected = function(state) {
  var user = Drupal.settings.fbconnect.user;

  if (!state.authResponse || user.uid) return;
  if (state.authResponse.uid != user.fbuid) {
    window.location.reload();
  }
};

Drupal.fbconnect.initLogoutLinks = function(context) {
  var loginout_mode = Drupal.settings.fbconnect.loginout_mode;
  var user          = Drupal.settings.fbconnect.user;
  var basePath      = Drupal.settings.basePath;
  var logout_url    = basePath + 'user/logout';
  var links         = jQuery('a[href="'+ logout_url +'"]', context).not('.logout_link_inited');

  if (loginout_mode == 'manual') return;

  links.addClass('logout_link_inited').bind('click',function() {
    var fbuid = FB.getAuthResponse() && FB.getAuthResponse().uid;

    if (!user.fbuid || user.fbuid != fbuid) return;
    if (loginout_mode == 'auto') {
      Drupal.fbconnect.logout();
    }
    else if (loginout_mode == 'ask') {
      var t_args  = {'!site_name' : Drupal.settings.fbconnect.invite_name};
      var buttons = [
          {
            'label': Drupal.t('Facebook and !site_name', t_args),
            'click': function() {
              this.close();
              Drupal.fbconnect.logout();
            }
          }, {
            'name': 'cancel',
            'label': Drupal.t('!site_name Only', t_args),
            'click': function() {
              this.close();
              Drupal.fbconnect.logout(true);
            }
          }
      ];

      var dialog = new Drupal.fbconnect.PopupDialog({
        'title'   : Drupal.t('Logout'),
        'message' : Drupal.t('Do you also want to logout from your Facebook account?'),
        'buttons' : buttons
      });
    }

    return false;
  });
};

Drupal.fbconnect.DoFastRegistration =  function(link) {
  FB.login(function(response) {
    if (response.authResponse && response.status == 'connected') {
      FB.api('/me/permissions', function(perms_response) {
        if(perms_response['data'][0]['email']) {
          window.location.href = link.href;
        }
      });
    }
  }, {scope:'email'});
};


function facebook_onlogin_ready() {
  // http://github.com/facebook/connect-js/issues/194
  if (!FB.getAuthResponse()) {
    return;
  }
  jQuery("#fbconnect-autoconnect-form").submit();
}

/**
 * Create a dialog.
 *
 * @param opts {Object} Options:
 * @see Drupal.fbconnect.PopupDialog.prototype.prepareDefaults
 *
 * @return {Object}
 */
Drupal.fbconnect.PopupDialog = function(options) {
  this.prepareDefaults(options);
  this.container = Drupal.theme('fb_popup_dialog', this.options);
  this.dialog = FB.Dialog.create({
    content : this.container,
    visible : false,
    loader  : true,
    onClose : this.__close_handler,
    closeIcon : true
  });

//  FB.XFBML.parse(dialog);

//  var popup = new FB.UI.PopupDialog(
//    oThis.options.title,
//    oThis.container,
//    oThis.options.showLoading,
//    oThis.options.hideUntilLoaded
//  );

  this.callback('load', this.dialog);
};

Drupal.fbconnect.PopupDialog.prototype.options = {};

Drupal.fbconnect.PopupDialog.prototype.createHandler = function(event, data) {
  var oThis = this;
  return function() { oThis.callback(event, data); };
};

Drupal.fbconnect.PopupDialog.prototype.callback = function(event, data) {
  data = data || {};
  switch (event) {
  case 'click':
    var btn = data;
    if (btn.click instanceof Function) btn.click.apply(this, [btn]);
    else if (btn.name == 'cancel') this.close();
    break;

  case 'close':
    this.close();
    /*var btn = this.findButton('cancel');
    if (btn) this.callback('click', btn); */
    break;

  case 'load':
    this.show();
    break;
  }
};

Drupal.fbconnect.PopupDialog.prototype.prepareDefaults = function(options) {
  var defaults = {
    'title'           : '',
    'message'         : ' - ',
    'buttons'         : {},
    'showLoading'     : false,
    'hideUntilLoaded' : false
  };
  jQuery.extend(this.options, defaults, options);

  this.__close_handler = this.createHandler('close', {});
  this.options.dialog = this;
  if (this.options.callback instanceof Function) {
    this.callback = this.options.callback;
  }
};

Drupal.fbconnect.PopupDialog.prototype.show = function() {
  if (this.dialog) {
    FB.Dialog.show(this.dialog);
  }
};

Drupal.fbconnect.PopupDialog.prototype.close = function() {
  if (this.dialog) {
    FB.Dialog.remove(this.dialog);
  }
};

Drupal.fbconnect.PopupDialog.prototype.findButton = function(name) {
  var button = null;
  jQuery.each(this.options.buttons, function(i, btn) {
    if (btn.name == name) {
      button = btn;
      return true;
    }
  });

  return button;
}

Drupal.theme.prototype.fb_popup_dialog_buttons = function(buttons, dialog) {
  buttons = buttons || {};
  var container = jQuery('<div class="dialog_buttons"></div>');

  jQuery.each(buttons, function(i, btn) {
    var button = jQuery('<input type="button" class="dialog_inputbutton">');
    if (!btn['name']) btn['name'] = i;
    if (btn.attr) button.attr(btn.attr);
    if (btn['class']) button.addClass(btn['class']);
    if (btn['name'] == 'cancel') button.addClass('dialog_inputaux');
    button.addClass('fb_button_' + i);
    button.attr('value', btn.label);
    button.click(dialog.createHandler('click', btn));
    button.appendTo(container);
  });

  return container.get(0);
};

Drupal.theme.prototype.fb_popup_dialog = function(options) {
  options = options || {buttons:{}};
  var container = document.createDocumentFragment();
  var elements  =  [
     '<h2 class="dialog_header"><span>',
    options.title.toString(),
    '</span></h2>',
       '<div class="dialog_stripes"></div>',
    '<div class="dialog_content">',
    options.message.toString(),
    '</div>'
  ];

  jQuery(elements.join("\n")).each(function() {
    container.appendChild(this);
  });
  if (options.buttons) {
    container.appendChild(
      Drupal.theme('fb_popup_dialog_buttons', options.buttons, options.dialog)
    );
  }

  return container;
};


Drupal.theme.prototype.fbml_name = function(fbuid, options) {
  var output = ['<fb:name uid="', fbuid, '"'];
  var defaults = {
    'useyou' : false,
    'linked' : false
  };

  options = jQuery.extend({}, defaults, options);

  output.push('" useyou="'+ (!!options.useyou ? 'true' : 'false') +'"');
  output.push('" linked="'+ (!!options.linked ? 'true' : 'false') +'"');
  output.push('></fb:name>');

  return output.join('');
};

Drupal.theme.prototype.fbml_profile_pic = function(fbuid, options) {
  var output = ['<fb:profile-pic uid="', fbuid, '"'];
  options = options || {};

  if (options.width)  output.push('" width="'+ options.width +'"');
  if (options.height) output.push('" height="'+ options.height +'"');
  if (options.size)   output.push('" size="'+ options.size +'"');

  output.push('" facebook-logo="'+ (!!options['facebook-logo'] ? 'true' : 'false') +'"')
  output.push('" linked="'+ (!!options.linked ? 'true' : 'false') +'"');
  output.push('></fb:profile-pic>');

  return output.join('');
};

jQuery(document).bind('fb:init', Drupal.fbconnect.init);
;
(function ($) {

  Drupal.behaviors.captcha = {
    attach: function (context) {

      // Turn off autocompletion for the CAPTCHA response field.
      // We do it here with Javascript (instead of directly in the markup)
      // because this autocomplete attribute is not standard and
      // it would break (X)HTML compliance.
      $("#edit-captcha-response").attr("autocomplete", "off");

    }
  };

  Drupal.behaviors.captchaAdmin = {
    attach: function (context) {
    	// Add onclick handler to checkbox for adding a CAPTCHA description
    	// so that the textfields for the CAPTCHA description are hidden
    	// when no description should be added.
      // @todo: div.form-item-captcha-description depends on theming, maybe
      // it's better to add our own wrapper with id (instead of a class).
    	$("#edit-captcha-add-captcha-description").click(function() {
    		if ($("#edit-captcha-add-captcha-description").is(":checked")) {
    			// Show the CAPTCHA description textfield(s).
    			$("div.form-item-captcha-description").show('slow');
    		}
    		else {
    			// Hide the CAPTCHA description textfield(s).
    			$("div.form-item-captcha-description").hide('slow');
    		}
    	});
    	// Hide the CAPTCHA description textfields if option is disabled on page load.
    	if (!$("#edit-captcha-add-captcha-description").is(":checked")) {
    		$("div.form-item-captcha-description").hide();
    	}
    }

  };

})(jQuery);
;
