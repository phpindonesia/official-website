(function ($) {
  /**
   * @todo Undocumented Code!
   */
  Drupal.behaviors.gigyaFiledSettingHideShow = {
    attach: function (context, settings) {
      $('.reactions-override').each( function () {
        if (!$(this).is(':checked')) {
          $(this).parent().next('.gigya-reaction-field-settings').hide();
        }
      });
      $('.reactions-override').once().click(function() {
        $(this).parent().next('.gigya-reaction-field-settings').slideToggle();
      });
      $('.sharebar-override').each( function () {
        if (!$(this).is(':checked')) {
          $(this).parent().next('.gigya-sharebar-field-settings').hide();
        }
      });
      $('.sharebar-override').once().click(function() {
        $(this).parent().next('.gigya-sharebar-field-settings').slideToggle();
      });
      }
  };
})(jQuery);
