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

Drupal.behaviors.tableSelect = {
  attach: function (context, settings) {
    // Select the inner-most table in case of nested tables.
    $('th.select-all', context).closest('table').once('table-select', Drupal.tableSelect);
  }
};

Drupal.tableSelect = function () {
  // Do not add a "Select all" checkbox if there are no rows with checkboxes in the table
  if ($('td input:checkbox', this).length == 0) {
    return;
  }

  // Keep track of the table, which checkbox is checked and alias the settings.
  var table = this, checkboxes, lastChecked;
  var strings = { 'selectAll': Drupal.t('Select all rows in this table'), 'selectNone': Drupal.t('Deselect all rows in this table') };
  var updateSelectAll = function (state) {
    // Update table's select-all checkbox (and sticky header's if available).
    $(table).prev('table.sticky-header').andSelf().find('th.select-all input:checkbox').each(function() {
      $(this).attr('title', state ? strings.selectNone : strings.selectAll);
      this.checked = state;
    });
  };

  // Find all <th> with class select-all, and insert the check all checkbox.
  $('th.select-all', table).prepend($('<input type="checkbox" class="form-checkbox" />').attr('title', strings.selectAll)).click(function (event) {
    if ($(event.target).is('input:checkbox')) {
      // Loop through all checkboxes and set their state to the select all checkbox' state.
      checkboxes.each(function () {
        this.checked = event.target.checked;
        // Either add or remove the selected class based on the state of the check all checkbox.
        $(this).closest('tr').toggleClass('selected', this.checked);
      });
      // Update the title and the state of the check all box.
      updateSelectAll(event.target.checked);
    }
  });

  // For each of the checkboxes within the table that are not disabled.
  checkboxes = $('td input:checkbox:enabled', table).click(function (e) {
    // Either add or remove the selected class based on the state of the check all checkbox.
    $(this).closest('tr').toggleClass('selected', this.checked);

    // If this is a shift click, we need to highlight everything in the range.
    // Also make sure that we are actually checking checkboxes over a range and
    // that a checkbox has been checked or unchecked before.
    if (e.shiftKey && lastChecked && lastChecked != e.target) {
      // We use the checkbox's parent TR to do our range searching.
      Drupal.tableSelectRange($(e.target).closest('tr')[0], $(lastChecked).closest('tr')[0], e.target.checked);
    }

    // If all checkboxes are checked, make sure the select-all one is checked too, otherwise keep unchecked.
    updateSelectAll((checkboxes.length == $(checkboxes).filter(':checked').length));

    // Keep track of the last checked checkbox.
    lastChecked = e.target;
  });
};

Drupal.tableSelectRange = function (from, to, state) {
  // We determine the looping mode based on the the order of from and to.
  var mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

  // Traverse through the sibling nodes.
  for (var i = from[mode]; i; i = i[mode]) {
    // Make sure that we're only dealing with elements.
    if (i.nodeType != 1) {
      continue;
    }

    // Either add or remove the selected class based on the state of the target checkbox.
    $(i).toggleClass('selected', state);
    $('input:checkbox', i).each(function () {
      this.checked = state;
    });

    if (to.nodeType) {
      // If we are at the end of the range, stop.
      if (i == to) {
        break;
      }
    }
    // A faster alternative to doing $(i).filter(to).length.
    else if ($.filter(to, [i]).r.length) {
      break;
    }
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.css('width'));
  }
};

})(jQuery);
;
