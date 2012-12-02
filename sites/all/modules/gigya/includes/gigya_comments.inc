<?php

/**
 * @file
 * gigya_comments.inc
 *
 * Gigya Comments functionality.
 */

/**
 * Helper function to get the Gigya comments params for the Javascript.
 *
 * @param int $nid
 *   The node ID.
 *
 *  @return array
 *    An associative array containing the comments parameters.
 */
function gigya_comments_ui_parmes($nid) {
  $catid = variable_get('gigya_comments_categoryid', '');
  $cid = variable_get('gigya_comments_container', 'comments');
  $comments_params = array(
      'categoryID' => $catid,
      'streamID' => $nid,
      'containerID' => $cid,
      'cid' => '',
  );

  // Merge extra parameters from configuration.
  $extra_comments = variable_get('gigya_comments_extra', array());
  if (!empty($extra_comments)) {
    array_merge($comments_params, $extra_comments);
  }

  // Allow modules to alter the object before adding the JS to the page.
  drupal_alter('gigya_comments', $comments_params);

  return $comments_params;
}

/**
 * Add the Gigya comments UI.
 *
 * @param int $nid
 *   @todo document this argument.
 */
function gigya_comments_add_ui($nid) {
  drupal_add_js(drupal_get_path('module', 'gigya') . '/js/gigya_comments.js', array('type' => 'file', 'scope' => 'footer'));
  $parms = gigya_comments_ui_parmes($nid);
  drupal_add_js(array('gigya_comments' => array('commentsUIparams' => $parms)), 'setting');
}

/**
 * Handles AJAX requests to the Gigya component.
 */
function gigya_comments_ajax() {
  if (user_access('post comments')) {
    $uid = filter_xss($_POST['uid']);
    $comment_text = filter_xss($_POST['commentText']);
    $usig = filter_xss($_POST['UIDSignature']);
    $timestamp = filter_xss($_POST['timestamp']);
    $nid = filter_xss($_POST['nid']);
    //$sec = variable_get('gigya_SecretKey', '');
    //$valid = SigUtils::validateUserSignature($uid, $timestamp, $sec, $usig);
    global $user;
    $user = user_load($uid);
    $comment['name'] = $user->name;
    $comment['nid'] = $nid;
    $comment['is_anonymous'] = 0;
    $comment['status'] = COMMENT_PUBLISHED;
    $comment['language'] = LANGUAGE_NONE;
    $comment['comment_body'] = array(
        LANGUAGE_NONE => array(
            0 => array(
                'value' => $comment_text,
                'format' => 'filtered_html',
            )
        )
    );
    $comm_obj = (object) $comment;
    comment_submit($comm_obj);
    comment_save($comm_obj);
    return drupal_json_output(array('added' => TRUE));
  }

  return drupal_json_output(array('added' => FALSE));
}

