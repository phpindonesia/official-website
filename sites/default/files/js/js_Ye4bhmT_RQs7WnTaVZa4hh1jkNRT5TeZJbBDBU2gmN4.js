
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
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the uri fragment identifier. 
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($('.error' + anchor, $fieldset).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
