<!DOCTYPE html>
<head>
<?php print $head; ?>
<title><?php print $head_title; ?></title>
<?php print $styles; ?>
<?php print $scripts; ?>
<!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<script type="text/javascript">
 var oneall_js_protocol = (("https:" == document.location.protocol) ? "https" : "http");
 document.write(unescape("%3Cscript src='" + oneall_js_protocol + "://phpindonesia.api.oneall.com/socialize/library.js' type='text/javascript'%3E%3C/script%3E"));
</script>
</head>
<body class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
</body>
</html>