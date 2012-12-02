<?php

/**
 * @file
 * Page display functions for for Gigya module.
 */

/**
 * Page callback for the user/%user/edit/gigya page.
 *
 * @see gigya_menu()
 *
 * @return
 *   Gigya connect page HTML.
 */
function gigya_connect() {
  drupal_set_title(t('Edit your Social Network connections'));
  return theme('gigya_connect_display');
}

/**
 * socialize-login page callback.
 *
 * @see gigya_menu()
 */
function gigya_login_ajax() {
  global $base_path;
  global $base_url;
  $parms = $_GET;
  unset($parms['q']);
  $dest =  variable_get('gigya_login_uiconfig_urlredirect', '');
  if (!empty($dest)) {
    $dest = $base_url . '/' . $dest;
  }
  else {
    $current_page = parse_url($_SERVER['HTTP_REFERER']);
    //make sure we don't have an external url here if it an external one we redirect to the front page
    if (url_is_external($current_page['path'])) {
      $dest = '<front>';
    }
    else {
      $dest = ltrim($current_page['path'], '/');
    }
  }

  //Check if the user is not logged in.
  if (!user_is_logged_in()) {
    //drupal_set_message(t('gigya_login_ajax u: @uid', array('@uid' => $user->uid)));
    $_SESSION['gigya_suppress_notifylogin_js'] = TRUE;
    module_load_include('inc', 'gigya');
    if ($_gigya_user = GigyaUser::userFromUrl()) {
      $bio = $_gigya_user->getUserInfo();

      // Check to see if the Gigya user is a Drupal user.
      if (is_numeric($_gigya_user->uid) && $user = user_load($_gigya_user->uid)) {
        $account = clone $user;
        if (!variable_get('user_email_verification', TRUE) || $account->login) {
          // We can suppress the notify login JS because the user is clearly
          // already logged into gigya.
          //$_SESSION['gigya_suppress_notifylogin_js'] = TRUE;
          // Log the user in.
          $form_state = array();
          $form_state['values'] = NULL;
          $form_state['uid'] = $account->uid;
          user_login_submit(array(), $form_state);
        }
        else {
          drupal_set_message(t('You must validate your email address for this account before logging in.'));
        }
        drupal_goto($dest);
      }
      // Not a Drupal user, try to register them if we're allowed to.
      elseif (variable_get('user_register', 1)) {
        $form_state['redirect'] = $dest;
        $form_state['values'] = array();
        if ($_gigya_user = GigyaUser::userFromUrl()) {
          // Check if we have an email from gigya user and if not redirect to the complete registrationpage.
          $bio = $_gigya_user->getUserInfo();
          if (empty($bio['email'])) {
            // Redirect the user to the complete your registration form.
            drupal_goto('socialize-email-reg', array('query' => $parms));
          }
        }
        $uname = $bio['email'];
        $user_may_existes = (bool) db_select('users')->fields('users', array('uid'))->condition('mail', db_like($uname), 'LIKE')->range(0, 1)->execute()->fetchField() || (bool) db_select('users')->fields('users', array('uid'))->condition('name', db_like($uname), 'LIKE')->range(0, 1)->execute()->fetchField();
        if ($user_may_existes) {
          drupal_goto('socialize-link', array('query' => $parms));
        }
        else {
          $form_state['values']['name'] = $uname;
        }
        $form_state['values']['mail'] = $bio['email'];

        // Allow other modules to change this info before we create the user.
        drupal_alter('gigya_create_user', $form_state, $bio);
        drupal_form_submit('user_register_form', $form_state);

        if (form_get_errors()) {
          if (variable_get('gigya_debug', 0)) {
            $messages = drupal_get_messages('error');
            $output = print_r($messages, TRUE);
            // We were unable to register a valid new user.
            // Send the error messages to watchdog.
            watchdog('gigya', 'Unable to auto-create user account:' . $output);
          }

          gigya_redirect_to_complete_registration_page();
        }
        // The register process is done , so we redirect the user to the $form_state destination.
        drupal_redirect_form(array(), $form_state['redirect']);
      }
      else {
        drupal_set_message(t('Only site administrators can create new user accounts.'), 'error');
      }
    }
  }
  drupal_goto($dest);
}

/**
 * socialize-logout page callback.
 *
 * @see gigya_menu()
 */
function gigya_logout() {
  $dest = drupal_get_destination();
  $dest = ($dest['destination'] === $_GET['q'] ? '/' : $dest);
  drupal_add_js(array('gigya' => array('gigyaLogOutDest' => $dest['destination'])), 'setting');
  session_destroy();
  return '';
}

/**
 * Handles AJAX requests to Gigya.
 *
 * Currently only used to set session variables for the Javascript.
 *
 * @param string $op
 *   Could by 'notify-login' or 'link-accounts-complete' or 'logout'.
 */
function gigya_ajax($op) {
  switch ($op) {
  case 'notify-login':
    $_SESSION['gigya_suppress_notifylogin_js'] = TRUE;
    break;
  case 'link-accounts-complete':
    $_SESSION['link_accounts'] = FALSE;
    break;
  case 'logout':
    break;
  }
  exit();
}


/**
 * Get the user friends list from Gigya.
 *
 * @param $account
 *   The user object.
 *
 * @return
 *   HTML for friends list.
 */
function gigya_get_friends($account) {
  $title = isset($account->title) ? $account->title : $account->name;
  drupal_set_title(check_plain($title));

  module_load_include('inc', 'gigya');
  $site_friends = array();
  $this_gigya_user = new GigyaUser($account->uid);
  if ($friends = $this_gigya_user->getFriends(array('siteUsersOnly' => TRUE))) {
    if (!empty($friends['friends'])) {
      foreach ($friends['friends'] as $friend) {
        if ($friend['isSiteUser'])
          $site_friends[] = $friend;
      }
    }
  }
  return theme('gigya_friends', array('friends' => $site_friends));
}

/**
 * Wrapper for the Gigya Javascript userInfo function.
 *
 * Injects the gigya getUserInfo Javascript function.
 *
 * @param $account
 *   The user object.
 *
 * @return
 *   The user info from Gigya.
 */
function gigya_get_user($account) {
  $title = isset($account->title) ? $account->title : $account->name;
  drupal_set_title(check_plain($title));

  // Add the onload functions .
  $behavior_js = 'Drupal.behaviors.gigyaGetUserInfo = { attach: function(context, settings) { gigya.services.socialize.getUserInfo(Drupal.settings.gigya.conf, {callback:Drupal.gigya.getUserInfoCallback}); }}';
  drupal_add_js($behavior_js, array('type' => 'inline', 'scope' => JS_DEFAULT));

  $userinfo = '<div id="userinfo"></div>';
  return $userinfo;
}

/**
 * Handle the Gigya registration process.
 *
 * @parm boolean $link_account
 *   If set to true we need to display the link account form.
 *
 * @return string
 *   An html for the user_register_form if $link_account == FALSE and the email
 *   address is not in our database, if $link_account == TRUE or the email
 *   address is existing in our database, return the link accounts form.
 */
function gigya_register($link_account = FALSE) {
  global $user;

  // If we are already logged on, go to the user page instead.
  if ($user->uid) {
    drupal_goto('user/' . $user->uid);
  }

  // If We cant get the gigya user from the url step out.
  if (!($_gigya_user = GigyaUser::userFromUrl())) {
    drupal_goto();
  }

  // Get the user info from gigya.
  $bio = $_gigya_user->getUserInfo();
  $link_accounts_form = NULL;
  $registration_form = NULL;
  if (!empty($bio['email'])) {
    $user_may_existes = (bool) db_select('users')->fields('users', array('uid'))->condition('mail', db_like($bio['email']), 'LIKE')->range(0, 1)->execute()->fetchField() || (bool) db_select('users')->fields('users', array('uid'))->condition('uid', $account->uid, '<>')->condition('name', db_like($bio['email']), 'LIKE')->range(0, 1)->execute()->fetchField();
    if ($user_may_existes || $link_account) {
      // If $link_account == TRUE or the email address is existing in our db return the link accounts form.
      drupal_set_title(t('Link Account'));
      $link_accounts_form = theme('gigya_link_accounts', drupal_get_form('gigya_link_accounts_form'));
    }
    else {
      drupal_set_title(t('Create Account'));
      $registration_form = drupal_get_form('gigya_registration_form');
    }
  }
  // if $link_account == FALSE and the email address is not in our db return the user_register_form.
  else {
    drupal_set_title(t('Create Account'));
    $registration_form = drupal_get_form('gigya_registration_form');
  }

  return theme('gigya_register', array('bio' => $bio, 'registration_form' => $registration_form, 'link_accounts_form' => $link_accounts_form));
}

/**
 * @todo Properly document this function.
 */
function gigya_link_accounts() {
  $link_accounts_form = theme('gigya_link_accounts', drupal_get_form('gigya_link_accounts_form'));
  return $link_accounts_form;
}

/**
 * Menu callback; presents the registration form.
 */
function gigya_registration_form($form_state) {
  $form = array();
  $form['gigya_rigestration']['mail'] = array(
    '#type' => 'textfield',
    '#title' => t('Email address'),
    '#required' => TRUE,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Confirm'),
  );
  $parms = $_GET;
  unset($parms['q']);
  if (!empty($parms['email'])) {
    $form['link_accounts'] = array(
      '#markup' => l(t('Or link to an existing account'), 'socialize-link', array('query' => $parms)),
    );
  }
  return $form;
}

/**
 * Validates registration form.
 */
function gigya_registration_form_validate($form, &$form_state) {
  $parms = $_GET;
  unset($parms['q']);
  $uname = $form_state['values']['mail'];
  $user_may_existes = (bool) db_select('users')->fields('users', array('uid'))->condition('mail', db_like($uname), 'LIKE')->range(0, 1)->execute()->fetchField() || (bool) db_select('users')->fields('users', array('uid'))->condition('name', db_like($uname), 'LIKE')->range(0, 1)->execute()->fetchField();
  if ($user_may_existes) {
    $parms['email'] = $uname;
    $parms['fromReg'] = 'true';
    drupal_goto('socialize-link', array('query' => $parms));
  }
}

/**
 * Form submit handler; @todo insert proper description here.
 */
function gigya_registration_form_submit($form, &$form_state) {
  $form_state['values']['name'] = $form_state['values']['mail'];
  drupal_form_submit('user_register_form', $form_state);
  if (form_get_errors()) {
    if (variable_get('gigya_debug', 0)) {
      $messages = drupal_get_messages('error');
      $output = print_r($messages, TRUE);
      // We were unable to register a valid new user.
      // Send the error messages to watchdog.
      watchdog('gigya', 'Unable to auto-create user account:' . $output);
    }

    gigya_redirect_to_complete_registration_page();
  }
  drupal_goto();
}

/*
 * @todo Properly document this function.
 */
function gigya_email_registration() {
  if ($_gigya_user = GigyaUser::userFromUrl()) {
    $bio = $_gigya_user->getUserInfo();
    $registration_form = drupal_get_form('gigya_registration_form');
    return theme('gigya_register', array('bio' => $bio, 'registration_form' => $registration_form));
  }
  drupal_goto();
}

