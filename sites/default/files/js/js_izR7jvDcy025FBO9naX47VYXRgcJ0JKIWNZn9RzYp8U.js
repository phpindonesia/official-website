/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
window.CKEDITOR_BASEPATH = Drupal.settings.ckeditor.editor_path;
(function ($) {
    Drupal.ckeditor = (typeof(CKEDITOR) != 'undefined');

    Drupal.ckeditorToggle = function(textarea_ids, TextTextarea, TextRTE){
        if (!CKEDITOR.env.isCompatible) {
            return;
        }

        for (i=0; i<textarea_ids.length; i++){
            if (typeof(CKEDITOR.instances) != 'undefined' && typeof(CKEDITOR.instances[textarea_ids[i]]) != 'undefined'){
                Drupal.ckeditorOff(textarea_ids[i]);
                $('#switch_' + textarea_ids[0]).text(TextRTE);
            }
            else {
                Drupal.ckeditorOn(textarea_ids[i]);
                $('#switch_' + textarea_ids[0]).text(TextTextarea);
            }
        }
    };

    /**
 * CKEditor starting function
 *
 * @param string textarea_id
 */
    Drupal.ckeditorInit = function(textarea_id) {
        var ckeditor_obj = Drupal.settings.ckeditor;
        $("#" + textarea_id).next(".grippie").css("display", "none");
        $("#" + textarea_id).addClass("ckeditor-processed");

        var textarea_settings = false;
        ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].toolbar = eval(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].toolbar);
        textarea_settings = ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]];

        var drupalTopToolbar = $('#toolbar', Drupal.overlayChild ? window.parent.document : document);

        textarea_settings['on'] =
        {
            configLoaded  : function(ev)
            {
                ev.editor.addCss(ev.editor.config.extraCss);
            },
            instanceReady : function(ev)
            {
                var body = $(ev.editor.document.$.body);

                ev.editor.dataProcessor.writer.setRules('p', {
                    breakAfterOpen: false
                });

                if (typeof(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].custom_formatting) != 'undefined') {
                    var dtd = CKEDITOR.dtd;
                    for ( var e in CKEDITOR.tools.extend( {}, dtd.$block, dtd.$listItem, dtd.$tableContent ) ) {
                        ev.editor.dataProcessor.writer.setRules( e, ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].custom_formatting);
                    }
                    ev.editor.dataProcessor.writer.setRules( 'pre',
                    {
                        indent: ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].output_pre_indent
                    });
                }

                if (ev.editor.config.bodyClass)
                    body.addClass(ev.editor.config.bodyClass);
                if (ev.editor.config.bodyId)
                    body.attr('id', ev.editor.config.bodyId);
                if (typeof(Drupal.smileysAttach) != 'undefined')
                    ev.editor.dataProcessor.writer.indentationChars = '    ';
            },
            focus : function(ev)
            {
                Drupal.ckeditorInstance = ev.editor;
                Drupal.ckeditorActiveId = ev.editor.name;
            }
            ,
            afterCommandExec: function(ev)
            {
                if (ev.data.name != 'maximize') { return; }
                if (ev.data.command.state == CKEDITOR.TRISTATE_ON) { drupalTopToolbar.hide(); } else { drupalTopToolbar.show(); }
            }
        };

        if (typeof Drupal.settings.ckeditor.scayt_language != 'undefined'){
            textarea_settings['scayt_sLang'] = Drupal.settings.ckeditor.scayt_language;
        }

        if (typeof textarea_settings['js_conf'] != 'undefined'){
            for (var add_conf in textarea_settings['js_conf']){
                textarea_settings[add_conf] = eval(textarea_settings['js_conf'][add_conf]);
            }
        }

        //remove width 100% from settings because this may cause problems with theme css
        if (textarea_settings.width == '100%') textarea_settings.width = '';

        if (CKEDITOR.loadFullCore) {
            CKEDITOR.on('loaded', function() {
                textarea_settings = Drupal.ckeditorLoadPlugins(textarea_settings);
                Drupal.ckeditorInstance = CKEDITOR.replace(textarea_id, textarea_settings);
            });
            CKEDITOR.loadFullCore();
        }
        else {
            textarea_settings = Drupal.ckeditorLoadPlugins(textarea_settings);
            Drupal.ckeditorInstance = CKEDITOR.replace(textarea_id, textarea_settings);
        }
    }

    Drupal.ckeditorOn = function(textarea_id, run_filter) {

        run_filter = typeof(run_filter) != 'undefined' ? run_filter : true;

        if (typeof(textarea_id) == 'undefined' || textarea_id.length == 0 || $("#" + textarea_id).length == 0) {
            return;
        }
        if ((typeof(Drupal.settings.ckeditor.load_timeout) == 'undefined') && (typeof(CKEDITOR.instances[textarea_id]) != 'undefined')) {
            return;
        }
        if (typeof(Drupal.settings.ckeditor.elements[textarea_id]) == 'undefined') {
            return;
        }
        var ckeditor_obj = Drupal.settings.ckeditor;

        if (!CKEDITOR.env.isCompatible) {
            return;
        }

        if (run_filter && ($("#" + textarea_id).val().length > 0) && typeof(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]) != 'undefined' && ((ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]['ss'] == 1 && typeof(Drupal.settings.ckeditor.autostart) != 'undefined' && typeof(Drupal.settings.ckeditor.autostart[textarea_id]) != 'undefined') || ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]['ss'] == 2)) {
            $.ajax({
                type: 'POST',
                url: Drupal.settings.ckeditor.xss_url,
                async: false,
                data: {
                    text: $('#' + textarea_id).val(),
                    input_format: ckeditor_obj.textarea_default_format[textarea_id],
                    token: Drupal.settings.ckeditor.ajaxToken
                },
                success: function(text){
                    $("#" + textarea_id).val(text);
                    Drupal.ckeditorInit(textarea_id);
                }
            })
        }
        else {
            Drupal.ckeditorInit(textarea_id);
        }
    };

    /**
 * CKEditor destroy function
 *
 * @param string textarea_id
 */
    Drupal.ckeditorOff = function(textarea_id) {
        if (!CKEDITOR.instances || typeof(CKEDITOR.instances[textarea_id]) == 'undefined') {
            return;
        }
        if (!CKEDITOR.env.isCompatible) {
            return;
        }
        if (Drupal.ckeditorInstance && Drupal.ckeditorInstance.name == textarea_id)
            delete Drupal.ckeditorInstance;

        $("#" + textarea_id).val(CKEDITOR.instances[textarea_id].getData());
        CKEDITOR.instances[textarea_id].destroy(true);

        $("#" + textarea_id).next(".grippie").css("display", "block");
    };

/**
* Loading selected CKEditor plugins
*
* @param object textarea_settings
*/
    Drupal.ckeditorLoadPlugins = function(textarea_settings) {
        textarea_settings.extraPlugins = '';
        if (typeof CKEDITOR.plugins != 'undefined') {
            for (var plugin in textarea_settings['loadPlugins']) {
                textarea_settings.extraPlugins += (textarea_settings.extraPlugins) ? ',' + textarea_settings['loadPlugins'][plugin]['name'] : textarea_settings['loadPlugins'][plugin]['name'];
                CKEDITOR.plugins.addExternal(textarea_settings['loadPlugins'][plugin]['name'], textarea_settings['loadPlugins'][plugin]['path']);
            }
        }
        return textarea_settings;
    }

    /**
 * Returns true if CKEDITOR.version >= version
 */
    Drupal.ckeditorCompareVersion = function (version){
        var ckver = CKEDITOR.version;
        ckver = ckver.match(/(([\d]\.)+[\d]+)/i);
        version = version.match(/((\d+\.)+[\d]+)/i);
        ckver = ckver[0].split('.');
        version = version[0].split('.');
        for (var x in ckver) {
            if (ckver[x]<version[x]) {
                return false;
            }
            else if (ckver[x]>version[x]) {
                return true;
            }
        }
        return true;
    };

    Drupal.ckeditorInsertHtml = function(html) {
        if (!Drupal.ckeditorInstance)
            return false;

        if (Drupal.ckeditorInstance.mode == 'wysiwyg') {
            Drupal.ckeditorInstance.insertHtml(html);
            return true;
        }
        else {
            alert(Drupal.t('Content can only be inserted into CKEditor in the WYSIWYG mode.'));
            return false;
        }
    };

/**
 * Ajax support
 */
    if (typeof(Drupal.Ajax) != 'undefined' && typeof(Drupal.Ajax.plugins) != 'undefined') {
        Drupal.Ajax.plugins.CKEditor = function(hook, args) {
            if (hook === 'submit' && typeof(CKEDITOR.instances) != 'undefined') {
                for (var i in CKEDITOR.instances)
                    CKEDITOR.instances[i].updateElement();
            }
            return true;
        };
    }

    //Support for Panels [#679976]
    Drupal.ckeditorSubmitAjaxForm = function () {
        if (typeof(CKEDITOR.instances) != 'undefined' && typeof(CKEDITOR.instances['edit-body']) != 'undefined') {
            Drupal.ckeditorOff('edit-body');
        }
    };

/**
 * Drupal behaviors
 */
    Drupal.behaviors.ckeditor = {
        attach:
        function (context) {
            if ((typeof(CKEDITOR) == 'undefined') || !CKEDITOR.env.isCompatible) {
                return;
            }

            // make sure the textarea behavior is run first, to get a correctly sized grippie
            if (Drupal.behaviors.textarea && Drupal.behaviors.textarea.attach) {
                Drupal.behaviors.textarea.attach(context);
            }

            $(context).find("textarea.ckeditor-mod:not(.ckeditor-processed)").each(function () {
                var ta_id=$(this).attr("id");
                if (CKEDITOR.instances && typeof(CKEDITOR.instances[ta_id]) != 'undefined'){
                    Drupal.ckeditorOff(ta_id);
                }

                if ((typeof(Drupal.settings.ckeditor.autostart) != 'undefined') && (typeof(Drupal.settings.ckeditor.autostart[ta_id]) != 'undefined')) {
                    Drupal.ckeditorOn(ta_id);
                }

                if (typeof(Drupal.settings.ckeditor.input_formats[Drupal.settings.ckeditor.elements[ta_id]]) != 'undefined') {
                    $('.ckeditor_links').show();
                }

                var sel_format = ta_id.substr(0, ta_id.lastIndexOf("-")) + "-format--2";
                $('#'+sel_format).change(function(){
                    Drupal.settings.ckeditor.elements[ta_id] = $(this).val();
                    if (CKEDITOR.instances && typeof(CKEDITOR.instances[ta_id]) != 'undefined') {
                        $('#'+ta_id).val(CKEDITOR.instances[ta_id].getData());
                    }
                    Drupal.ckeditorOff(ta_id);
                    if (typeof(Drupal.settings.ckeditor.input_formats[$(this).val()]) != 'undefined'){
                        if ($('#'+ta_id).hasClass('ckeditor-processed')) {
                            Drupal.ckeditorOn(ta_id, false);
                        }
                        else {
                            Drupal.ckeditorOn(ta_id);
                        }
                        $('#switch_'+ta_id).show();
                    }
                    else {
                        $('#switch_'+ta_id).hide();
                    }
                });
            });
        },
        detach:
        function(context, settings, trigger){
            $(context).find("textarea.ckeditor-mod.ckeditor-processed").each(function () {
              var ta_id=$(this).attr("id");
              if (CKEDITOR.instances[ta_id])
                $('#'+ta_id).val(CKEDITOR.instances[ta_id].getData());
              if(trigger != 'serialize') {
                Drupal.ckeditorOff(ta_id);
                $(this).removeClass('ckeditor-processed');
              }
            });
        }
    };
})(jQuery);

/**
 * IMCE support
 */
var ckeditor_imceSendTo = function (file, win){
    var cfunc = win.location.href.split('&');

    for (var x in cfunc) {
        if (cfunc[x].match(/^CKEditorFuncNum=\d+$/)) {
            cfunc = cfunc[x].split('=');
            break;
        }
    }
    CKEDITOR.tools.callFunction(cfunc[1], file.url);
    win.close();
}
;
﻿/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function(){if(window.CKEDITOR&&window.CKEDITOR.dom)return;if(!window.CKEDITOR)window.CKEDITOR=(function(){var a={timestamp:'C6HH5UF',version:'3.6.4',revision:'7575',rnd:Math.floor(Math.random()*900)+100,_:{},status:'unloaded',basePath:(function(){var d=window.CKEDITOR_BASEPATH||'';if(!d){var e=document.getElementsByTagName('script');for(var f=0;f<e.length;f++){var g=e[f].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(g){d=g[1];break;}}}if(d.indexOf(':/')==-1)if(d.indexOf('/')===0)d=location.href.match(/^.*?:\/\/[^\/]*/)[0]+d;else d=location.href.match(/^[^\?]*\/(?:)/)[0]+d;if(!d)throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return d;})(),getUrl:function(d){if(d.indexOf(':/')==-1&&d.indexOf('/')!==0)d=this.basePath+d;if(this.timestamp&&d.charAt(d.length-1)!='/'&&!/[&?]t=/.test(d))d+=(d.indexOf('?')>=0?'&':'?')+'t='+this.timestamp;return d;}},b=window.CKEDITOR_GETURL;if(b){var c=a.getUrl;a.getUrl=function(d){return b.call(a,d)||c.call(a,d);};}return a;})();var a=CKEDITOR;if(!a.event){a.event=function(){};a.event.implementOn=function(b){var c=a.event.prototype;for(var d in c){if(b[d]==undefined)b[d]=c[d];}};a.event.prototype=(function(){var b=function(d){var e=d.getPrivate&&d.getPrivate()||d._||(d._={});return e.events||(e.events={});},c=function(d){this.name=d;this.listeners=[];};c.prototype={getListenerIndex:function(d){for(var e=0,f=this.listeners;e<f.length;e++){if(f[e].fn==d)return e;}return-1;}};return{on:function(d,e,f,g,h){var i=b(this),j=i[d]||(i[d]=new c(d));if(j.getListenerIndex(e)<0){var k=j.listeners;if(!f)f=this;if(isNaN(h))h=10;var l=this,m=function(o,p,q,r){var s={name:d,sender:this,editor:o,data:p,listenerData:g,stop:q,cancel:r,removeListener:function(){l.removeListener(d,e);}};e.call(f,s);return s.data;};m.fn=e;m.priority=h;for(var n=k.length-1;n>=0;n--){if(k[n].priority<=h){k.splice(n+1,0,m);return;}}k.unshift(m);}},fire:(function(){var d=false,e=function(){d=true;},f=false,g=function(){f=true;};return function(h,i,j){var k=b(this)[h],l=d,m=f;d=f=false;if(k){var n=k.listeners;if(n.length){n=n.slice(0);for(var o=0;o<n.length;o++){var p=n[o].call(this,j,i,e,g);if(typeof p!='undefined')i=p;if(d||f)break;}}}var q=f||(typeof i=='undefined'?false:i);d=l;f=m;return q;};})(),fireOnce:function(d,e,f){var g=this.fire(d,e,f);delete b(this)[d];return g;},removeListener:function(d,e){var f=b(this)[d];if(f){var g=f.getListenerIndex(e);
if(g>=0)f.listeners.splice(g,1);}},hasListeners:function(d){var e=b(this)[d];return e&&e.listeners.length>0;}};})();}if(!a.editor){a.ELEMENT_MODE_NONE=0;a.ELEMENT_MODE_REPLACE=1;a.ELEMENT_MODE_APPENDTO=2;a.editor=function(b,c,d,e){var f=this;f._={instanceConfig:b,element:c,data:e};f.elementMode=d||0;a.event.call(f);f._init();};a.editor.replace=function(b,c){var d=b;if(typeof d!='object'){d=document.getElementById(b);if(d&&d.tagName.toLowerCase() in {style:1,script:1,base:1,link:1,meta:1,title:1})d=null;if(!d){var e=0,f=document.getElementsByName(b);while((d=f[e++])&&d.tagName.toLowerCase()!='textarea'){}}if(!d)throw '[CKEDITOR.editor.replace] The element with id or name "'+b+'" was not found.';}d.style.visibility='hidden';return new a.editor(c,d,1);};a.editor.appendTo=function(b,c,d){var e=b;if(typeof e!='object'){e=document.getElementById(b);if(!e)throw '[CKEDITOR.editor.appendTo] The element with id "'+b+'" was not found.';}return new a.editor(c,e,2,d);};a.editor.prototype={_init:function(){var b=a.editor._pending||(a.editor._pending=[]);b.push(this);},fire:function(b,c){return a.event.prototype.fire.call(this,b,c,this);},fireOnce:function(b,c){return a.event.prototype.fireOnce.call(this,b,c,this);}};a.event.implementOn(a.editor.prototype,true);}if(!a.env)a.env=(function(){var b=navigator.userAgent.toLowerCase(),c=window.opera,d={ie:/*@cc_on!@*/false,opera:!!c&&c.version,webkit:b.indexOf(' applewebkit/')>-1,air:b.indexOf(' adobeair/')>-1,mac:b.indexOf('macintosh')>-1,quirks:document.compatMode=='BackCompat',mobile:b.indexOf('mobile')>-1,iOS:/(ipad|iphone|ipod)/.test(b),isCustomDomain:function(){if(!this.ie)return false;var g=document.domain,h=window.location.hostname;return g!=h&&g!='['+h+']';},secure:location.protocol=='https:'};d.gecko=navigator.product=='Gecko'&&!d.webkit&&!d.opera;var e=0;if(d.ie){e=parseFloat(b.match(/msie (\d+)/)[1]);d.ie8=!!document.documentMode;d.ie8Compat=document.documentMode==8;d.ie9Compat=document.documentMode==9;d.ie7Compat=e==7&&!document.documentMode||document.documentMode==7;d.ie6Compat=e<7||d.quirks;}if(d.gecko){var f=b.match(/rv:([\d\.]+)/);if(f){f=f[1].split('.');e=f[0]*10000+(f[1]||0)*100+ +(f[2]||0);}}if(d.opera)e=parseFloat(c.version());if(d.air)e=parseFloat(b.match(/ adobeair\/(\d+)/)[1]);if(d.webkit)e=parseFloat(b.match(/ applewebkit\/(\d+)/)[1]);d.version=e;d.isCompatible=d.iOS&&e>=534||!d.mobile&&(d.ie&&e>=6||d.gecko&&e>=10801||d.opera&&e>=9.5||d.air&&e>=1||d.webkit&&e>=522||false);d.cssClass='cke_browser_'+(d.ie?'ie':d.gecko?'gecko':d.opera?'opera':d.webkit?'webkit':'unknown');
if(d.quirks)d.cssClass+=' cke_browser_quirks';if(d.ie){d.cssClass+=' cke_browser_ie'+(d.version<7?'6':d.version>=8?document.documentMode:'7');if(d.quirks)d.cssClass+=' cke_browser_iequirks';}if(d.gecko&&e<10900)d.cssClass+=' cke_browser_gecko18';if(d.air)d.cssClass+=' cke_browser_air';return d;})();var b=a.env;var c=b.ie;if(a.status=='unloaded')(function(){a.event.implementOn(a);a.loadFullCore=function(){if(a.status!='basic_ready'){a.loadFullCore._load=1;return;}delete a.loadFullCore;var e=document.createElement('script');e.type='text/javascript';e.src=a.basePath+'ckeditor.js';document.getElementsByTagName('head')[0].appendChild(e);};a.loadFullCoreTimeout=0;a.replaceClass='ckeditor';a.replaceByClassEnabled=1;var d=function(e,f,g,h){if(b.isCompatible){if(a.loadFullCore)a.loadFullCore();var i=g(e,f,h);a.add(i);return i;}return null;};a.replace=function(e,f){return d(e,f,a.editor.replace);};a.appendTo=function(e,f,g){return d(e,f,a.editor.appendTo,g);};a.add=function(e){var f=this._.pending||(this._.pending=[]);f.push(e);};a.replaceAll=function(){var e=document.getElementsByTagName('textarea');for(var f=0;f<e.length;f++){var g=null,h=e[f];if(!h.name&&!h.id)continue;if(typeof arguments[0]=='string'){var i=new RegExp('(?:^|\\s)'+arguments[0]+'(?:$|\\s)');if(!i.test(h.className))continue;}else if(typeof arguments[0]=='function'){g={};if(arguments[0](h,g)===false)continue;}this.replace(h,g);}};(function(){var e=function(){var f=a.loadFullCore,g=a.loadFullCoreTimeout;if(a.replaceByClassEnabled)a.replaceAll(a.replaceClass);a.status='basic_ready';if(f&&f._load)f();else if(g)setTimeout(function(){if(a.loadFullCore)a.loadFullCore();},g*1000);};if(window.addEventListener)window.addEventListener('load',e,false);else if(window.attachEvent)window.attachEvent('onload',e);})();a.status='basic_loaded';})();})();
;
