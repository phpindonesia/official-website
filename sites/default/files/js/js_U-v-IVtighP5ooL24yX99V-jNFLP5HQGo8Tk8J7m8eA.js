Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Terdapat kesalahan pada AJAX HTTP", "HTTP Result Code: !status":"Kode hasil HTTP: !status", "An AJAX HTTP request terminated abnormally.":"Permintaan AJAX HTTP diakhiri tak normal.", "Path: !uri":"Path: !uri", "StatusText: !statusText":"Teks Status : !statusText", "ResponseText: !responseText":"Teks tanggapan: !responseText", "ReadyState: !readyState":"ReadyState: !readyState", "Loading":"Memuat", "(active tab)":"(tab aktif)", "Hide":"Sembunyikan", "Show":"Perlihatkan", "Configure":"Konfigurasi", "Edit summary":"Ubah ringkasan", "Not in menu":"Tidak di menu", "Please wait...":"Mohon tunggu...", "Not in book":"Tidak ada dalam buku", "New book":"Buku baru", "No revision":"Tidak ada revisi", "Not published":"Tidak dipublikasikan", "@number comments per page":"@number komentar per halaman", "Searching for matches...":"Mencari kecocokan...", "Select all rows in this table":"Pilih semua baris dalam tabel ini", "Deselect all rows in this table":"Hapus pilihan pada semua baris dalam tabel ini", "Re-order rows by numerical weight instead of dragging.":"Atur ulang baris menurut ukuran numerik bukan dari hasil menyeret.", "Show row weights":"Tampilkan baris bobot", "Hide row weights":"Sembunyikan baris bobot", "Drag to re-order":"Drag untuk mengatur urutan", "Changes made in this table will not be saved until the form is submitted.":"Perubahan yang dilakukan pada tabel ini tidak akan disimpan sebelum anda mengirim form ini.", "Not restricted":"Tidak aman", "The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\u002Fem\u003E button is clicked.":"Perubahan atas blok ini tidak akan disimpan sebelum anda klik tombol \u003Cem\u003ESimpan blok\u003C\u002Fem\u003E.", "Edit":"Edit", "Automatic alias":"Alias otomatis", "This permission is inherited from the authenticated user role.":"Kewenangan ini adalah turunan dari pemeran pengguna terdaftar."}} };;
(function ($) {

  Drupal.behaviors.captcha = {
    attach: function (context) {

      // Turn off autocompletion for the CAPTCHA response field.
      // We do it here with Javascript (instead of directly in the markup)
      // because this autocomplete attribute is not standard and
      // it would break (X)HTML compliance.
      $("#edit-captcha-response").attr("autocomplete", "off");

    }
  };

  Drupal.behaviors.captchaAdmin = {
    attach: function (context) {
    	// Add onclick handler to checkbox for adding a CAPTCHA description
    	// so that the textfields for the CAPTCHA description are hidden
    	// when no description should be added.
      // @todo: div.form-item-captcha-description depends on theming, maybe
      // it's better to add our own wrapper with id (instead of a class).
    	$("#edit-captcha-add-captcha-description").click(function() {
    		if ($("#edit-captcha-add-captcha-description").is(":checked")) {
    			// Show the CAPTCHA description textfield(s).
    			$("div.form-item-captcha-description").show('slow');
    		}
    		else {
    			// Hide the CAPTCHA description textfield(s).
    			$("div.form-item-captcha-description").hide('slow');
    		}
    	});
    	// Hide the CAPTCHA description textfields if option is disabled on page load.
    	if (!$("#edit-captcha-add-captcha-description").is(":checked")) {
    		$("div.form-item-captcha-description").hide();
    	}
    }

  };

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the uri fragment identifier. 
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($('.error' + anchor, $fieldset).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
