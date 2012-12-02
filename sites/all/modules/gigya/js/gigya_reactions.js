(function ($) {
  /**
   * @todo Undocumented Code!
   */
  Drupal.behaviors.gigyaReactions = {
    attach: function (context, settings) {
      if (typeof Drupal.settings.gigyaReactions != 'undefined') {
        //add all reactions to an array
        eval('var reactions = [' + Drupal.settings.gigyaReactions.reactions + ']');
        //build a media object
        var mediaObj = {type: 'image', href: Drupal.settings.gigyaReactions.ua.linkBack};
        if ((Drupal.settings.gigyaReactions.ua.imageBhev === 'url') && (Drupal.settings.gigyaReactions.ua.imageUrl !== '')) {
           mediaObj.src = Drupal.settings.gigyaReactionsImage.imageUrl;
        }
        else if (Drupal.settings.gigyaReactions.ua.imageBhev === 'default') {
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
        //build user actions
        var ua = new gigya.socialize.UserAction();
        ua.setTitle(Drupal.settings.gigyaReactions.title);
        ua.setLinkBack(Drupal.settings.gigyaReactions.linkBack);
        ua.addMediaItem(mediaObj);
        //reaction bar parms
        var parms = Drupal.settings.gigyaReactions;
        delete parms.ua;
        parms.reactions = reactions;
        parms.userAction = ua;
        //call the reaction bar
        gigya.socialize.showReactionsBarUI(parms);
      }
    }
  };
})(jQuery);

