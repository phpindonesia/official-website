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

;
(function ($) {
/**
 * @todo Undocumented Code!
 */
Drupal.behaviors.gigyaNotifyFriends = {
  attach: function(context, settings) {
    $('.friends-ui:not(.gigyaNotifyFriends-processed)', context).addClass('gigyaNotifyFriends-processed').each(
      function () {
        gigya.services.socialize.getUserInfo({callback:Drupal.gigya.notifyFriendsCallback});
        gigya.services.socialize.addEventHandlers({ onConnect:Drupal.gigya.notifyFriendsCallback, onDisconnect:Drupal.gigya.notifyFriendsCallback});
      }
    );
  }
};

/**
 * @todo Undocumented Code!
 */
Drupal.behaviors.gigyaInit = {
  attach: function(context, settings) {
    if (typeof Drupal.settings.gigya.notifyLoginParams !== 'undefined') {
      Drupal.settings.gigya.notifyLoginParams.callback = Drupal.gigya.notifyLoginCallback;
      gigya.services.socialize.getUserInfo({callback: Drupal.gigya.initResponse});
    }

    // Attach event handlers.
    gigya.services.socialize.addEventHandlers({onLogin:Drupal.gigya.loginCallback});

    // Display LoginUI if necessary.
    if (typeof Drupal.settings.gigya.loginUIParams !== 'undefined') {
      $.each(Drupal.settings.gigya.loginUIParams, function (index, value) {
        gigya.services.socialize.showLoginUI(value);
      });
    }

    // Display ConnectUI if necessary.
    if (typeof Drupal.settings.gigya.connectUIParams !== 'undefined') {
      gigya.services.socialize.showAddConnectionsUI(Drupal.settings.gigya.connectUIParams);
    }

    // Call ShareUI if it exists.
      if (typeof Drupal.settings.gigya.shareUIParams !== 'undefined') {
      //build a media object
      var mediaObj = {type: 'image', href: Drupal.settings.gigya.shareUIParams.linkBack};
      if ((Drupal.settings.gigya.shareUIParams.imageBhev === 'url') && (Drupal.settings.gigya.shareUIParams.imageUrl !== '')) {
         mediaObj.src = Drupal.settings.gigya.shareUIParams.imageUrl;
      }
      else if (Drupal.settings.gigya.shareUIParams.imageBhev === 'default') {
        if ($('meta[property=og:image]').length > 0) {
          mediaObj.src = $('meta[property=og:image]').attr('content');
        }
        else {
          mediaObj.src = $('#block-system-main img').eq(0).attr('src') || $('img').eq(0).attr('src');
        }
      }
      else {
        mediaObj.src = $('#block-system-main img').eq(0).attr('src') || $('img').eq(0).attr('src');
      }
      // Step 1: Construct a UserAction object and fill it with data.
      var ua = new gigya.services.socialize.UserAction();
      ua.setLinkBack(Drupal.settings.gigya.shareUIParams.linkBack);
      ua.setTitle(Drupal.settings.gigya.shareUIParams.title);
      ua.setDescription(Drupal.settings.gigya.shareUIParams.description);
      ua.addMediaItem(mediaObj);
      var params = {};
      if (typeof Drupal.settings.gigya.shareUIParams.extraParams !== 'undefined') {
        params = Drupal.settings.gigya.shareUIParams.extraParams;
      }
      params.userAction = ua;
      gigya.services.socialize.showShareUI(params);
      }
  }
};

/**
 * @todo Undocumented Code!
 */
Drupal.gigya.logout = function () {
  document.location.href = Drupal.settings.gigya.gigyaLogOutDest;
};

/**
 * @todo Undocumented Code!
 */
Drupal.behaviors.gigyaLogut = {
  attach: function (context, settings) {
    if (Drupal.settings.gigya.gigyaLogOutDest !== undefined) {
      gigya.services.socialize.logout({callback: Drupal.gigya.logout()});
      }
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
