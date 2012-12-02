
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
/**
 * Javascript helpers for Facebook Streams.  Loaded by fb_stream.module.
 */
FB_Stream = function(){};

/**
 * Display a stream dialog on Facebook Connect pages, via
 * http://developers.facebook.com/docs/reference/javascript/FB.ui
 *
 * @param json is the json-encoded output of fb_stream_get_stream_dialog_data().
 */
FB_Stream.stream_publish = function(json) {
  var data_array = Drupal.parseJson(json);
  var len = data_array.length;
  for (var i=0; i < len; i++) {
    var data = data_array[i];
    data.method = 'stream.publish';
    FB.ui(data);
  }
};;
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

/**
 * Provide the summary information for the block settings vertical tabs.
 */
Drupal.behaviors.block_viewsSettingsSummary = {
  attach: function (context) {
    // The drupalSetSummary method required for this behavior is not available
    // on the Blocks administration page, so we need to make sure this
    // behavior is processed only if drupalSetSummary is defined.
    if (typeof jQuery.fn.drupalSetSummary == 'undefined') {
      return;
    }

    $('fieldset#edit-views', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').text()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });
  }
};

})(jQuery);
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
(function ($) {

/**
 * Provide the summary information for the block settings vertical tabs.
 */
Drupal.behaviors.blockSettingsSummary = {
  attach: function (context) {
    // The drupalSetSummary method required for this behavior is not available
    // on the Blocks administration page, so we need to make sure this
    // behavior is processed only if drupalSetSummary is defined.
    if (typeof jQuery.fn.drupalSetSummary == 'undefined') {
      return;
    }

    $('fieldset#edit-path', context).drupalSetSummary(function (context) {
      if (!$('textarea[name="pages"]', context).val()) {
        return Drupal.t('Not restricted');
      }
      else {
        return Drupal.t('Restricted to certain pages');
      }
    });

    $('fieldset#edit-node-type', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').text()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-role', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').text()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-user', context).drupalSetSummary(function (context) {
      var $radio = $('input[name="custom"]:checked', context);
      if ($radio.val() == 0) {
        return Drupal.t('Not customizable');
      }
      else {
        return $radio.next('label').text();
      }
    });
  }
};

/**
 * Move a block in the blocks table from one region to another via select list.
 *
 * This behavior is dependent on the tableDrag behavior, since it uses the
 * objects initialized in that behavior to update the row.
 */
Drupal.behaviors.blockDrag = {
  attach: function (context, settings) {
    // tableDrag is required and we should be on the blocks admin page.
    if (typeof Drupal.tableDrag == 'undefined' || typeof Drupal.tableDrag.blocks == 'undefined') {
      return;
    }

    var table = $('table#blocks');
    var tableDrag = Drupal.tableDrag.blocks; // Get the blocks tableDrag object.

    // Add a handler for when a row is swapped, update empty regions.
    tableDrag.row.prototype.onSwap = function (swappedRow) {
      checkEmptyRegions(table, this);
    };

    // A custom message for the blocks page specifically.
    Drupal.theme.tableDragChangedWarning = function () {
      return '<div class="messages warning">' + Drupal.theme('tableDragChangedMarker') + ' ' + Drupal.t('The changes to these blocks will not be saved until the <em>Save blocks</em> button is clicked.') + '</div>';
    };

    // Add a handler so when a row is dropped, update fields dropped into new regions.
    tableDrag.onDrop = function () {
      dragObject = this;
      // Use "region-message" row instead of "region" row because
      // "region-{region_name}-message" is less prone to regexp match errors.
      var regionRow = $(dragObject.rowObject.element).prevAll('tr.region-message').get(0);
      var regionName = regionRow.className.replace(/([^ ]+[ ]+)*region-([^ ]+)-message([ ]+[^ ]+)*/, '$2');
      var regionField = $('select.block-region-select', dragObject.rowObject.element);
      // Check whether the newly picked region is available for this block.
      if ($('option[value=' + regionName + ']', regionField).length == 0) {
        // If not, alert the user and keep the block in its old region setting.
        alert(Drupal.t('The block cannot be placed in this region.'));
        // Simulate that there was a selected element change, so the row is put
        // back to from where the user tried to drag it.
        regionField.change();
      }
      else if ($(dragObject.rowObject.element).prev('tr').is('.region-message')) {
        var weightField = $('select.block-weight', dragObject.rowObject.element);
        var oldRegionName = weightField[0].className.replace(/([^ ]+[ ]+)*block-weight-([^ ]+)([ ]+[^ ]+)*/, '$2');

        if (!regionField.is('.block-region-' + regionName)) {
          regionField.removeClass('block-region-' + oldRegionName).addClass('block-region-' + regionName);
          weightField.removeClass('block-weight-' + oldRegionName).addClass('block-weight-' + regionName);
          regionField.val(regionName);
        }
      }
    };

    // Add the behavior to each region select list.
    $('select.block-region-select', context).once('block-region-select', function () {
      $(this).change(function (event) {
        // Make our new row and select field.
        var row = $(this).closest('tr');
        var select = $(this);
        tableDrag.rowObject = new tableDrag.row(row);

        // Find the correct region and insert the row as the last in the region.
        table.find('.region-' + select[0].value + '-message').nextUntil('.region-message').last().before(row);

        // Modify empty regions with added or removed fields.
        checkEmptyRegions(table, row);
        // Remove focus from selectbox.
        select.get(0).blur();
      });
    });

    var checkEmptyRegions = function (table, rowObject) {
      $('tr.region-message', table).each(function () {
        // If the dragged row is in this region, but above the message row, swap it down one space.
        if ($(this).prev('tr').get(0) == rowObject.element) {
          // Prevent a recursion problem when using the keyboard to move rows up.
          if ((rowObject.method != 'keyboard' || rowObject.direction == 'down')) {
            rowObject.swap('after', this);
          }
        }
        // This region has become empty.
        if ($(this).next('tr').is(':not(.draggable)') || $(this).next('tr').length == 0) {
          $(this).removeClass('region-populated').addClass('region-empty');
        }
        // This region has become populated.
        else if ($(this).is('.region-empty')) {
          $(this).removeClass('region-empty').addClass('region-populated');
        }
      });
    };
  }
};

})(jQuery);
;
