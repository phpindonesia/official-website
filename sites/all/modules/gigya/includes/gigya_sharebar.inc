<?php

/**
 * @file
 * gigya_sharebar.inc
 *
 * Adds support for the Gigya share bar on node pages.
 */

/**
 * gigya_sharebar hook_node_view() code.
 *
 * @see gigya_node_view()
 */
function _gigya_sharebar_node_view($node, $view_mode, $langcode) {

  $node->content['gigya_sharebar'] = array(
      '#markup' => theme('gigya_sharebar'),
      '#weight' => 10,
  );

  // Get the Link Back.
  $linkback = url($_GET['q'], array('absolute' => TRUE));

  // Get the user message.
  $user_message = variable_get('sharebar_user_message', '');
  $user_message = token_replace($user_message, array('node' => $node));

  // Get the title.
  $title = variable_get('sharebar_title', '');
  $title = token_replace($title, array('node' => $node));

  // TODO Get the teaser.
  $teaser = variable_get('sharebar_description', '');
  $teaser = token_replace($teaser, array('node' => $node));

  // Get the action link title.
  $action_link_title = variable_get('sharebar_action_link_title', '');
  $action_link_title = token_replace($action_link_title, array('node' => $node));

  // Get the action link href.
  $action_link_href = variable_get('sharebar_action_link_href', '');
  $action_link_href = token_replace($action_link_href, array('node' => $node));

  //Get show counts
  $show_counts = variable_get('sharebar_showcounts', 'right');

  // Get the buttons (networks) used for Gigya Sharebar.
  $buttons = variable_get('sharebar_buttons', gigya_sharebar_button_defaults());
  $buttons = array_flip($buttons);
  unset($buttons[0]);

  // Facebook like is special.
  if (in_array('facebook_like', $buttons)) {
    drupal_add_js(array('gigya_sharebar' => array('facebookLikeButton' => array('action' => 'Like', 'position' => 'first'))), 'setting');
    unset($buttons['facebook_like']);
  }

  $share_buttons = implode($buttons, ',');

  // Set all the above as Drupal settings.
  $settings =  array('gigya_sharebar' => array(
      'linkBack' => $linkback,
      'userMessage' => $user_message,
      'title' => $title,
      'description' => $teaser,
      'actionLinkTitle' => $action_link_title,
      'actionLinkHREF' => $action_link_href,
      'shareButtons' => $share_buttons,
      'showCounts' => $show_counts,
  )
  );
  //hook to alter the comment settings befor we add the as javascript
  drupal_alter('gigya_sharebar', $settings);
  drupal_add_js($settings, 'setting');
}


/**
 * Returns HTML for the Gigya Sharebar.
 *
 * @ingroup themeable
 */
function theme_gigya_sharebar() {
  $output = '<div id="gigya-sharebar"></div>';
  return $output;
}

/**
 * Helper function; returns a list of default sharebar buttons.
 *
 * @return
 *   An array of default sharebar buttons.
 */
function gigya_sharebar_button_defaults() {
  $defaults = array('share', 'email');
  $networks = gigya_sharebar_selected_networks();
  if (in_array('facebook', $networks)) {
    $defaults[] = 'facebook';
  }
  if (in_array('twitter', $networks)) {
    $defaults[] = 'twitter';
  }

  return $defaults;
}

/**
 * Helper function; returns the list of networks selected for use with Gigya.
 *
 * @return
 *   Array of networks selected for use with Gigya.
 */
function gigya_sharebar_selected_networks() {
  // Retrieve selected networks
  $networks = variable_get('gigya_selected_networks', array());

  // Transform into selected network string.
  $networks = array_flip($networks);

  // Unset the last unselected network.
  unset($networks[0]);
  return $networks;
}

