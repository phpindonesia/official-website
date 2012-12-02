<?php
/**
 * @file
 * Contains the administration interface for the Oneall Social Login Module.
 * The user may chose where to display the module and setup it's behavior.
 */

/**
 * Displays the settings page.
 */
function oneall_social_login_admin_settings ($form, &$form_state) {

  // Used to display the provider icons.
  drupal_add_css(drupal_get_path('module', 'oneall_social_login') . '/oneall_social_login.admin.css');

  // Read Settings.
  $settings = oneall_social_login_core_get_settings();

  // API Connection.
  $form['oneall_social_login_api_connection'] = array(
    '#type' => 'fieldset',
    '#title' => t('API Communication'),
    '#id' => 'oneall_social_login_api_connection',
  );

  // Default value for handler.
  if (!empty($form_state['values']['http_handler'])) {
    $default = $form_state['values']['http_handler'];
  }
  elseif (!empty($settings['http_handler'])) {
    $default = $settings['http_handler'];
  }
  else {
    $default = 'curl';
  }

  $form['oneall_social_login_api_connection']['http_handler'] = array(
    '#type' => 'select',
    '#title' => t('HTTPS Request Handler'),
    '#description' => t('You must allow outgoing HTTPS requests (port 443) and you either need the <a href="@link_curl" target="_blank">PHP cURL library</a> or the <a href="@link_fsockopen" target="_blank">PHP fsockopen function</a> .',
        array(
          '@link_curl' => 'http://www.php.net/manual/en/book.curl.php',
          '@link_fsockopen' => 'http://php.net/manual/en/function.fsockopen.php',
        )),
    '#options' => array(
      'curl' => t('PHP cURL library'),
      'fsockopen' => t('PHP fsockopen through drupal_http_request()'),
    ),
    '#default_value' => $default,
  );

  $form['oneall_social_login_api_connection']['verify'] = array(
    '#type' => 'button',
    '#value' => t('Autodetect'),
    '#weight' => 30,
    '#ajax' => array(
      'callback' => 'oneall_social_login_admin_ajax_api_connection_autodetect',
      'wrapper' => 'oneall_social_login_api_connection',
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // API Settings.
  $form['oneall_social_login_api_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('API Settings'),
    '#id' => 'oneall_social_login_api_settings',
    '#description' => t('<a href="@setup_oneall_social_login" target="_blank">Click here to create and view your API Credentials</a>', array(
      '@setup_oneall_social_login' => 'https://app.oneall.com/applications/',
    )),
  );

  // API Subdomain.
  $form['oneall_social_login_api_settings']['api_subdomain'] = array(
    '#id' => 'api_subdomain',
    '#type' => 'textfield',
    '#title' => t('API Subdomain:'),
    '#default_value' => (!empty($settings['api_subdomain']) ? $settings['api_subdomain'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Public Key.
  $form['oneall_social_login_api_settings']['api_key'] = array(
    '#id' => 'api_key',
    '#type' => 'textfield',
    '#title' => t('API Public Key:'),
    '#default_value' => (!empty($settings['api_key']) ? $settings['api_key'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Private Key.
  $form['oneall_social_login_api_settings']['api_secret'] = array(
    '#id' => 'api_secret',
    '#type' => 'textfield',
    '#title' => t('API Private Key:'),
    '#default_value' => (!empty($settings['api_secret']) ? $settings['api_secret'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Verify Settings Button.
  $form['oneall_social_login_api_settings']['verify'] = array(
    '#id' => 'oneall_social_login_check_api_button',
    '#type' => 'button',
    '#value' => t('Verify API Settings'),
    '#weight' => 1,
    '#ajax' => array(
      'callback' => 'oneall_social_login_admin_ajax_check_api_connection_settings',
      'wrapper' => 'oneall_social_login_api_settings',
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // Settings.
  $form['oneall_social_login_settings_side_panel'] = array(
    '#type' => 'fieldset',
    '#title' => t('Side Panel Settings'),
  );

  $form['oneall_social_login_settings_side_panel']['side_panel_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to login/register with their social network account, or with their already existing account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form'),
      'below' => t('Show the Social Login icons below the existing login form (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons the side panel'),
    ),
    '#default_value' => (empty($settings['side_panel_icons']) ? 'above' : $settings['side_panel_icons']),
  );

  $form['oneall_social_login_settings_side_panel']['side_panel_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['side_panel_caption']) ? t('Register/Login with:') : $settings['side_panel_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  $form['oneall_social_login_settings_login_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Login Page Settings'),
  );

  $form['oneall_social_login_settings_login_page']['login_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to login with their social network account, or with their already existing account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form'),
      'below' => t('Show the Social Login icons below the existing login form (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons on the login page'),
    ),
    '#default_value' => (empty($settings['login_page_icons']) ? 'below' : $settings['login_page_icons']),
  );

  $form['oneall_social_login_settings_login_page']['login_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['login_page_caption']) ? t('Login with:') : $settings['login_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  $form['oneall_social_login_settings_registration_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Registration Page Settings'),
  );

  $form['oneall_social_login_settings_registration_page']['registration_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to register by using their social network account, or by creating a regular account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form (Default, recommended)'),
      'below' => t('Show the Social Login icons below the existing login form'),
      'disable' => t('Do not show the Social Login icons on the registration page'),
    ),
    '#default_value' => (empty($settings['registration_page_icons']) ? 'above' : $settings['registration_page_icons']),
  );

  $form['oneall_social_login_settings_registration_page']['registration_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['registration_page_caption']) ? t('Instantly register with:') : $settings['registration_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  $form['oneall_social_login_settings_profile_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Edit Profile Page Settings'),
  );

  $form['oneall_social_login_settings_profile_page']['profile_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to link a social network account to their regular account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the profile settings'),
      'below' => t('Show the Social Login icons below the profile settings (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons on the profile page'),
    ),
    '#default_value' => (empty($settings['profile_page_icons']) ? 'below' : $settings['profile_page_icons']),
  );

  $form['oneall_social_login_settings_profile_page']['profile_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['profile_page_caption']) ? t('Link your account to a social network:') : $settings['profile_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  $form['oneall_social_login_settings_block'] = array(
    '#type' => 'fieldset',
    '#title' => t('Block Settings'),
    '#description' => t('Use the Structure\Blocks menu to add Social Login to any region of your theme.'),
  );

  $form['oneall_social_login_settings_block']['block_icons_loggedin'] = array(
    '#type' => 'select',
    '#title' => t('If the user is already logged in:'),
    '#options' => array(
      'hide' => t('Hide the Social Login Block (Default, recommended)'),
      'show' => t('Show the Social Login Block'),
    ),
    '#default_value' => (empty($settings['block_icons_loggedin']) ? 'hide' : $settings['block_icons_loggedin']),
  );

  // Enable the social networks/identity providers.
  $form['oneall_social_login_providers'] = array(
    '#type' => 'fieldset',
    '#title' => t('Enable the social networks/identity providers of your choice'),
  );

  // Include the list of providers.
  $oneall_social_login_available_providers = oneall_social_login_core_get_available_providers();

  // Add providers.
  foreach ($oneall_social_login_available_providers as $key => $provider_data) {
    $form['oneall_social_login_providers']['oneall_social_login_icon_' . $key] = array(
      '#title' => check_plain($provider_data['name']),
      '#type' => 'container',
      '#attributes' => array(
        'class' => array(
          'oneall_social_login_provider',
          'oneall_social_login_provider_' . $key,
        ),
        'style' => array(
          'float: left;',
          'margin: 5px;',
        ),
      ),
    );

    $form['oneall_social_login_providers']['provider_' . $key] = array(
      '#type' => 'checkbox',
      '#title' => check_plain($provider_data['name']),
      '#default_value' => (empty($settings['provider_' . $key]) ? 0 : 1),
      '#attributes' => array(
        'style' => array(
          'margin: 15px;',
        ),
      ),
    );

    $form['oneall_social_login_providers']['clear_' . $key] = array(
      '#type' => 'container',
      '#attributes' => array(
        'style' => array(
          'clear: both;',
        ),
      ),
    );
  }

  $form['#submit'][] = 'oneall_social_login_admin_settings_submit';
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save Settings'),
  );

  return $form;
}

/**
 * Callback handler to autodected the API connection handler.
 */
function oneall_social_login_admin_ajax_api_connection_autodetect ($form, &$form_state) {

  // Messages.
  $http_handler = '';

  // CURL Works.
  if (oneall_social_login_core_check_curl() === TRUE) {
    $http_handler = 'curl';
  }
  // CURL does not work.
  else {
    // FSOCKOPEN works.
    if (oneall_social_login_core_check_fsockopen() == TRUE) {
      $http_handler = 'fsockopen';
    }
  }

  // Working handler found.
  if (!empty($http_handler)) {
    $form['oneall_social_login_api_connection']['http_handler']['#value'] = $http_handler;
    drupal_set_message(t('Autodetected @handler - do not forget to save your changes!', array(
      '@handler' => drupal_strtoupper($http_handler),
    )), 'status oneall_social_login');
  }
  // Nothing works.
  else {
    drupal_set_message(t('Sorry, but your firewall blocks outoing requests on port 443. Please open port 443 for outgoing requests.'), 'error oneall_social_login');
  }
  return $form['oneall_social_login_api_connection'];
}

/**
 * Callback Handler to verify the API Settings.
 */
function oneall_social_login_admin_ajax_check_api_connection_settings ($form, &$form_state) {

  // Sanitize data.
  $api_subdomain = (isset($form_state['values']['api_subdomain']) ? trim(drupal_strtolower($form_state['values']['api_subdomain'])) : '');
  $api_key = (isset($form_state['values']) ? trim($form_state['values']['api_key']) : '');
  $api_secret = (isset($form_state['values']) ? trim($form_state['values']['api_secret']) : '');
  $handler = (isset($form['oneall_social_login_api_connection']['http_handler']['#value']) ? $form['oneall_social_login_api_connection']['http_handler']['#value'] : 'curl');
  $handler = (!in_array(array('curl', 'fsockopen') ? 'curl' : 'fsockopen'));

  // Message to be shown.
  $error_message = '';
  $success_message = '';

  // Some fields are empty.
  if (empty($api_subdomain) || empty($api_key) || empty($api_secret)) {
    $error_message = t('Please fill out each of the fields below');
  }
  // All fields filled out.
  else {
    // Wrapper for full domains.
    if (preg_match("/([a-z0-9\-]+)\.api\.oneall\.com/i", $api_subdomain, $matches)) {
      $api_subdomain = $matches[1];
    }

    // Wrong syntax.
    if (!preg_match("/^[a-z0-9\-]+$/i", $api_subdomain)) {
      $error_message = t('The subdomain has a wrong syntax! Have you filled it out correctly?');
    }
    // Syntax seems to be OK.
    else {

      // Build API Settings.
      $api_domain = 'https://' . $api_subdomain . '.api.oneall.com/tools/ping.json';
      $api_options = array(
        'api_key' => $api_key,
        'api_secret' => $api_secret,
      );

      // Send request.
      $result = oneall_social_login_core_do_api_request($handler, $api_domain, $api_options);
      if (!is_array($result)) {
        $error_message = t('Could not contact API. Your firewall probably blocks outoing requests on port 443');
      }
      else {
        switch ($result['http_code']) {
          case '401':
            $error_message = t('The API credentials are wrong!');
            break;

          case '404':
            $error_message = t('The subdomain does not exist. Have you filled it out correctly?');
            break;

          case '200':
            $success_message = t('The settings are correct - do not forget to save your changes!');
            break;

          default:
            $error_message = t('Unknown API Error');
            break;
        }
      }
    }
  }

  // Error.
  if (!empty($success_message)) {
    drupal_set_message($success_message, 'status oneall_social_login');
  }
  else {
    drupal_set_message($error_message, 'error oneall_social_login');
  }
  return $form['oneall_social_login_api_settings'];
}

/**
 * Saves the administration area settings.
 */
function oneall_social_login_admin_settings_submit ($form, &$form_state) {

  // Remove drupal stuff.
  form_state_values_clean($form_state);

  // Save values.
  foreach ($form_state['values'] as $setting => $value) {

    $value = trim($value);

    // API Subdomain.
    if ($setting == 'api_subdomain') {
      $value = drupal_strtolower($value);
    }

    $oaslsid = db_select('oneall_social_login_settings', 'o')->fields('o', array('oaslsid'))->condition('setting', $setting, '=')->execute()->fetchField();
    if (is_numeric($oaslsid)) {
      db_update('oneall_social_login_settings')->fields(array('value' => $value))->condition('oaslsid', $oaslsid, '=')->execute();
    }
    else {
      db_insert('oneall_social_login_settings')->fields(array('setting' => $setting, 'value' => $value))->execute();
    }
  }
  drupal_set_message(t('Settings saved successfully'), 'status oneall_social_login');
  cache_clear_all();
  menu_rebuild();
}
