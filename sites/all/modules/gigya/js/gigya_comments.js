(function ($) {
  /**
   * @todo Undocumented Code!
   */
  Drupal.gigya.addDrupalComment = function(eventObj) {
    jQuery.ajax({
      type: 'POST',
      url: '/gigya/comments/',
      dataType: 'json',
      data: {
        'ajax': true,
        'commentText': eventObj.commentText,
        'UIDSignature': eventObj.user.UIDSignature,
        'uid': eventObj.user.UID,
        'timestamp': eventObj.user.signatureTimestamp,
        'nid': Drupal.settings.gigya_comments.commentsUIparams.streamID
      }
    });
  };

  /**
   * @todo Undocumented Code!
   */
  Drupal.behaviors.gigya_comments =  {
    attach: function(context) {
      if (typeof Drupal.settings.gigya_comments != 'undefined') {
        Drupal.settings.gigya_comments.commentsUIparams.onCommentSubmitted = Drupal.gigya.addDrupalComment;
        gigya.services.socialize.showCommentsUI(Drupal.settings.gigya_comments.commentsUIparams);
      }
      else {
        return false;
      }
    }
  };
})(jQuery);

