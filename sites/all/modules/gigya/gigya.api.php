<?php

/**
 * @file
 * Provides API documentation for the Gigya module.
 *
 * All Gigya API calls go through drupal_alter functions so that other modules
 * could modify or add parameters. Below is a list of all relevant functions and
 * a short explanation regarding each of them.
 */

/*
 * Implements hook_gigya_global_conf_alter().
 *
 * This hook is called before adding the Gigya global configuration parameters
 * to the Javascript settings. The default parameters are the list of providers
 * and the language. A list of available parameters can be found at the @link
 * http://developers.gigya.com/020_Client_API/010_Objects/Conf_object
 * Gigya developers site. @endlink Note that these parameters are not handled
 * as standard Drupal Javascript settings, but instead are included as an object
 * in the HTML head section of the page.
 */
function hook_gigya_global_conf_alter($gigya_js_settings) {
  global $language;
  if ($language->language == 'fr') {
    //If the site language is French change Gigya language to French
    $gigya_js_settings['lang'] = 'fr';
  }
}

/*
 * Implements hook_gigya_notify_login_user_info_alter().
 *
 * This hook is called before calling gigya_notify_login function. The parameter
 * that is passed to the alter function is the user info that gets sent to gigya
 * Valid fields are nickname, photoURL, thumbnailURL, firstName, lastName,
 * gender, age, email. The relevant Gigya developers site page is @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.notifyLogin
 * @endlink
 */
function hook_notify_login_user_info_alter($gigya_user_info) {
  $gigya_user_info['email'] = 'email@this_site.com';
}

/*
 * Implements hook_gigya_loginui_alter().
 *
 * This hook is called before adding the gigya.socialize.showLoginUI
 * configuration parameters to the Javascript settings. A list of available
 * parameters can be found in the Gigya developers site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/Socialize.showLoginUI
 * @endlink
 */
function hook_gigya_loginui_alter($gigya_login_params) {
  $gigya_login_params['showWhatsThis'] = TRUE;
  $gigya_login_params['whatsThisText'] = t('Some explanation text about the login widget');
}

/*
 * Implements hook_gigya_connectui_alter().
 *
 * This hook is called before adding the gigya.socialize.showAddConnectionsUI
 * configuration parameters to the Javascript settings. A list of available
 * parameters can be found in the Gigya developers site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.showAddConnectionsUI
 * @endlink
 */
function hook_gigya_loginui_alter($gigya_connect_params) {
  $gigya_connect_params['showWhatsThis'] = TRUE;
  $gigya_connect_params['whatsThisText'] = t('Some explanation text about the login widget');
}

/*
 * Implements hook_gigya_sharebar_alter().
 *
 * This hook is called before adding the socialize.showShareBarUI configuration
 * parameters to the Javascript settings. A developer guide to the Share Bar
 * plugin is available here: @link
 * http://developers.gigya.com/010_Developer_Guide/18_Plugins/015_Share_Bar
 * @endlink A list of available parameters can be found at the Gigya developers
 * site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.showAddConnectionsUI
 * @endlink
 */
function hook_gigya_sharebar_alter($share_settings) {
  $share_settings['grayedOutScreenOpacity'] = 30;
}

/*
 * Implements hook_gigya_reactions_alter().
 *
 * This hook is called before adding the socialize.showReactionsBarUI
 * configuration parameters to the Javascript settings. A developer guide to the
 * Reactions plugin is available here: @link
 * http://developers.gigya.com/010_Developer_Guide/18_Plugins/030_The_Reactions_Plugin
 * @endlink A list of available parameters can be found at the Gigya developers
 * site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.showReactionsBarUI
 * @endlink
 */
function hook_gigya_reactions_alter($reactions_settings) {
  $reactions_settings['promptShare'] = FALSE;
}

/*
 * Implements hook_gigya_shareui_alter().
 *
 * This hook is called before adding the socialize.showShareUI configuration
 * parameters to the Javascript settings. A list of available parameters can be
 * found at the Gigya developers site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.showShareUI
 * @endlink Note this is used for “action sharing”, defined by Drupal’s rules
 * mechanism.
 */
function hook_gigya_shareui_alter($shareui_params) {
  $shareui_params['showSuccessMessage'] = FALSE;
}

/*
 * Implements hook_gigya_comments_alter().
 *
 * This hook is called before adding the socialize.showCommentsUI configuration
 * parameters to the Javascript settings. A developer guide to the Comments
 * plugin is available here: @link
 * http://developers.gigya.com/010_Developer_Guide/18_Plugins/020_The_Comments_Plugin
 * @endlink A list of available parameters can be found at the Gigya developers
 * site: @link
 * http://developers.gigya.com/020_Client_API/020_Methods/socialize.showCommentsUI
 * @endlink
 */
function hook_gigya_comments_alter($comments_params) {
  $comments_paremes['useSiteLogin'] = TRUE;
  $comments_paremes['onSiteLoginClicked'] = 'onSiteLoginHandler'; // Registering to the onSiteLoginClicked event
}

