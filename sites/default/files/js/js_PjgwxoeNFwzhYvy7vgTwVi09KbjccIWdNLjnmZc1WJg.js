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
 * Loginza widget
 * @version 1.2.0
 * @updated 03.08.2011
 */
if ((typeof LOGINZA == "undefined") || !LOGINZA) {
	// инициализация объекта LOGINZA
    var LOGINZA = {
    	'loaded': false,
        'token_url': null,
        'selected_provider': null,
        'providers_set': null,
        'service_host': 'http://loginza.ru',
        'lang': null,
        'ajax': false,
        'mobile': false,
        'callback': null,
        'hash': ''
    };
}
// показать форму
LOGINZA.show = function () {
	// пред выбор провайдера
	LOGINZA.selected_provider = LOGINZA.getQueryStringValue(this, 'provider');
	// набор провайдеров в виджете
	LOGINZA.providers_set = LOGINZA.getQueryStringValue(this, 'providers_set');
	// получение token
	LOGINZA.token_url = LOGINZA.getQueryStringValue(this, 'token_url');
	// установка языка интерфейса
	LOGINZA.lang = LOGINZA.getQueryStringValue(this, 'lang');
	// мобильная версия
	LOGINZA.mobile = LOGINZA.getQueryStringValue(this, 'mobile');
	// определение устройства
	if (LOGINZA.mobile == 'auto') {
		var nav = window.navigator.userAgent;
		var mobua = ['iPhone', 'Android', 'iPad', 'Opera Mobi', 'Kindle/3.0'];
		LOGINZA.mobile = false;
		for (var i=0; i<mobua.length; i++){
			if (nav.indexOf(mobua[i]) >= 0) {
				LOGINZA.mobile = true;
				break;
			}
		}
	} else if (LOGINZA.mobile) {
		LOGINZA.mobile = true;
	} else {
		LOGINZA.mobile = false;
	}
	
	
	if (!LOGINZA.mobile && !LOGINZA.loaded) {
		var cldDiv = document.createElement("div");
		cldDiv.id = 'loginza_auth_form';
		cldDiv.style.overflow = 'visible';
		cldDiv.style.backgroundColor = 'transparent';
		cldDiv.style.zIndex = '10000';
		cldDiv.style.position = 'fixed';
		cldDiv.style.display = 'block';
		cldDiv.style.top = '0px';
		cldDiv.style.left = '0px';
		cldDiv.style.textAlign = 'center';
		cldDiv.style.height = '878px';
		cldDiv.style.width = '1247px';
		cldDiv.style.paddingTop = '125px';
		cldDiv.style.backgroundImage = 'url('+LOGINZA.service_host+'/img/widget/overlay.png)';
		
		var cntDiv = document.createElement("div");
		cntDiv.style.position = 'relative';
		cntDiv.style.display = 'inline';
		cntDiv.style.overflow = 'visible';
		
		var img = document.createElement("img");
		img.onclick = LOGINZA.close;
		img.style.position = 'relative';
		img.style.left = '348px';
		img.style.top = '-332px';
		img.style.cursor = 'hand';
		img.style.width = '7px';
		img.style.height = '7px';
		img.style.border = '0';
		img.alt = 'X';
		img.title = 'Close';
		img.src = LOGINZA.service_host+'/img/widget/close.gif';
		
		var iframe = document.createElement("iframe");
		iframe.id = 'loginza_main_ifr';
		iframe.width = '359';
		iframe.height = '350';
		
		if (LOGINZA.mobile) {
			iframe.width = '320';
			iframe.height = '480';
		}
		iframe.scrolling = 'no';
		iframe.frameBorder = '0';
		iframe.src = "javascript:'<html><body style=background-color:transparent><h1>Loading...</h1></body></html>'";
		
		// appends
		cntDiv.appendChild(img);
		cldDiv.appendChild(cntDiv);
		cldDiv.appendChild(iframe);
		
		try {
			cldDiv.style.paddingTop = (window.innerHeight-350)/2 + 'px';
		} catch (e) {
			cldDiv.style.paddingTop = '100px';
		}
		cldDiv.style.paddingLeft = 0;
		cldDiv.style.height = '2000px';
		cldDiv.style.width = document.body.clientWidth + 50 + 'px';
		// создание контейнера для формы
		document.body.appendChild(cldDiv);
		// форма загружена
		LOGINZA.loaded = true;
		
		// включена AJAX авторизация
		if (LOGINZA.ajax) {
			setInterval(LOGINZA.hashParser, 500);
		}
	}
	
	if (!LOGINZA.token_url) {
		alert('Error token_url value!');
	} else {
		var loginza_url = LOGINZA.service_host+'/api/widget.php?overlay=true&w='
		+document.body.clientWidth+
		'&token_url='+encodeURIComponent(LOGINZA.token_url)+
		'&provider='+encodeURIComponent(LOGINZA.selected_provider)+
		'&providers_set='+encodeURIComponent(LOGINZA.providers_set)+
		'&lang='+encodeURIComponent(LOGINZA.lang)+
		'&ajax='+(LOGINZA.ajax ? 'true' : 'false')+
		(LOGINZA.mobile ? '&mobile=true' : '');
		
		if (LOGINZA.mobile) {
			document.location = loginza_url;
		} else {
			// загрузка формы
			document.getElementById('loginza_main_ifr').setAttribute('src', loginza_url);
		}
	}
	
	if (!LOGINZA.mobile) {
		// показать форму
		document.getElementById('loginza_auth_form').style.display = '';
	}
	return false;
}
LOGINZA.close = function () {
	document.getElementById('loginza_auth_form').style.display = 'none';
}
// изменение размеров окна браузера
LOGINZA.resize = function () {
	var frm = document.getElementById('loginza_auth_form');
	if (frm) {
		frm.style.width = document.body.clientWidth + 50 + 'px';
		try {
			frm.style.paddingTop = (window.innerHeight-350)/2 + 'px';
		} catch (e) {
			frm.style.paddingTop = '100px';
		}
	}
}
// получение параметра из ссылки
LOGINZA.getQueryStringValue = function (link, key) {
	var url_str = link.href;
    var match = null;
    var query_str = url_str.match(/^[^?]*(?:\?([^#]*))?(?:$|#.*$)/)[1]
    var _query_regex = new RegExp("([^=]+)=([^&]*)&?", "g");
    while ((match = _query_regex.exec(query_str)) != null)
    {
        if (decodeURIComponent(match[1]) == key) {
            return decodeURIComponent(match[2]);
        }
    }
    return null;
}
LOGINZA.findClass = function (str, node) {
	if(document.getElementsByClassName) return (node || document).getElementsByClassName(str);
	else {
		var node = node || document, list = node.getElementsByTagName('*'), length = list.length, Class = str.split(/\s+/), classes = Class.length, array = [], i, j, key;
		for(i = 0; i < length; i++) {
			key = true;
			for(j = 0; j < classes; j++) if(list[i].className.search('\\b' + Class[j] + '\\b') == -1) key = false;
			if(key) array.push(list[i]);
		}
		return array;
	}
}
LOGINZA.addEvent = function (obj, type, fn){
	if (obj.addEventListener){
	      obj.addEventListener( type, fn, false);
	} else if(obj.attachEvent) {
	      obj.attachEvent( "on"+type, fn );
	} else {
	      obj["on"+type] = fn;
	}
}
LOGINZA.init = function () {
	// обработчик на открытие формы
	if (document.getElementById('loginza') && document.getElementById('loginza').href != undefined) {
		document.getElementById('loginza').onclick = LOGINZA.show;
	}
	var i, list = LOGINZA.findClass('loginza'), length = list.length;
	for(i = 0; i < length; i++) {
		if (list[i].href != undefined) {
			list[i].onclick = LOGINZA.show;
		}
	}
	// прочие обработчики
	LOGINZA.addEvent(window, 'resize', LOGINZA.resize);
	LOGINZA.addEvent(document, 'keydown', function(e) {
		e = e || window.event;
		if (e.keyCode == 27) {
			LOGINZA.close();
		}
		return true;
	});
}
LOGINZA.widget = function () {
	var iframeNode = document.getElementById('loginza_main_ifr');
	if (iframeNode.contentDocument) return iframeNode.contentDocument
	if (iframeNode.contentWindow) return iframeNode.contentWindow.document
	return iframeNode.document
}
LOGINZA.hashParser = function () {
	var func, param;
	try {
		var hash = LOGINZA.widget().location.hash.substr(1);
		var commands = hash.split(';');
		// набор якорь, функция для обработки нажатий по ссылкам
		var callbacks = [
		    ['token:', 'getToken']
		];
		// если хеш новый
		if (hash != LOGINZA.hash) {
			for (var k=0; k<commands.length; k++) {
				// вызов нужного callback в зависимости от переданного якоря
				for (var i=0; i<callbacks.length; i++) {
					func = callbacks[i][1];
					param = commands[k].substr(callbacks[i][0].length);
					
					if (commands[k].indexOf(callbacks[i][0])===0) {
						LOGINZA[func](param);
					}
				}
			}
			LOGINZA.hash = hash;
		}
	} catch (e) {}
}
LOGINZA.getToken = function (token) {
	LOGINZA.close();
	LOGINZA.callback(token);
}
LOGINZA.scriptMessage = function (event) {
	if (typeof LOGINZA[event.data] != 'undefined') {
		LOGINZA[event.data]();
	}
}
LOGINZA.redirect = function () {
	document.location = LOGINZA.service_host+'/api/redirect?rnd='+Math.random();
}
LOGINZA.addEvent(window, 'load', LOGINZA.init);
LOGINZA.addEvent(window, 'message', LOGINZA.scriptMessage);;
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
