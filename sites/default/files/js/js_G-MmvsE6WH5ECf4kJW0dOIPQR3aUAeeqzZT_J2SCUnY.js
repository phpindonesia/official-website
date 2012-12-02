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
