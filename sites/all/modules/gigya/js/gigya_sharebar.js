(function ($) {
  /**
   * @todo Undocumented Code!
   */
  Drupal.behaviors.gigyaShareBar = {
    attach: function (context, settings) {
      if (typeof Drupal.settings.gigyaSharebar != 'undefined') {
        //build a media object
        var mediaObj = {type: 'image', href: Drupal.settings.gigyaSharebar.ua.linkBack};
        if ((Drupal.settings.gigyaSharebar.ua.imageBhev === 'url') && (Drupal.settings.gigyaSharebar.ua.imageUrl !== '')) {
           mediaObj.src = Drupal.settings.gigyaSharebar.ua.imageUrl;
        }
        else if (Drupal.settings.gigyaSharebar.ua.imageBhev === 'default') {
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
        ua.setUserMessage(Drupal.settings.gigyaSharebar.ua.userMessage);
        ua.setLinkBack(Drupal.settings.gigyaSharebar.ua.linkBack);
        ua.setTitle(Drupal.settings.gigyaSharebar.ua.title);
        ua.setSubtitle(Drupal.settings.gigyaSharebar.ua.subtitle);
        ua.addActionLink(Drupal.settings.gigyaSharebar.ua.title, Drupal.settings.gigyaSharebar.ua.linkBack);
        ua.setDescription(Drupal.settings.gigyaSharebar.description);
        ua.addMediaItem(mediaObj);
        // Step 2: Define the Share Bar Plugin's params object.
        var params = Drupal.settings.gigyaSharebar;
        delete params.ua;
        params.userAction = ua;
        // Step 3: Load the Share Bar Plugin.
        gigya.services.socialize.showShareBarUI(params);
      }
    }
  };
})(jQuery);

