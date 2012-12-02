Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Terdapat kesalahan pada AJAX HTTP", "HTTP Result Code: !status":"Kode hasil HTTP: !status", "An AJAX HTTP request terminated abnormally.":"Permintaan AJAX HTTP diakhiri tak normal.", "Path: !uri":"Path: !uri", "StatusText: !statusText":"Teks Status : !statusText", "ResponseText: !responseText":"Teks tanggapan: !responseText", "ReadyState: !readyState":"ReadyState: !readyState", "Loading":"Memuat", "(active tab)":"(tab aktif)", "Hide":"Sembunyikan", "Show":"Perlihatkan", "Configure":"Konfigurasi", "Edit summary":"Ubah ringkasan", "Not in menu":"Tidak di menu", "Please wait...":"Mohon tunggu...", "Not in book":"Tidak ada dalam buku", "New book":"Buku baru", "No revision":"Tidak ada revisi", "Not published":"Tidak dipublikasikan", "@number comments per page":"@number komentar per halaman", "Searching for matches...":"Mencari kecocokan...", "Select all rows in this table":"Pilih semua baris dalam tabel ini", "Deselect all rows in this table":"Hapus pilihan pada semua baris dalam tabel ini", "Re-order rows by numerical weight instead of dragging.":"Atur ulang baris menurut ukuran numerik bukan dari hasil menyeret.", "Show row weights":"Tampilkan baris bobot", "Hide row weights":"Sembunyikan baris bobot", "Drag to re-order":"Drag untuk mengatur urutan", "Changes made in this table will not be saved until the form is submitted.":"Perubahan yang dilakukan pada tabel ini tidak akan disimpan sebelum anda mengirim form ini.", "Not restricted":"Tidak aman", "The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\u002Fem\u003E button is clicked.":"Perubahan atas blok ini tidak akan disimpan sebelum anda klik tombol \u003Cem\u003ESimpan blok\u003C\u002Fem\u003E.", "Edit":"Edit", "Automatic alias":"Alias otomatis", "Done":"Selesai", "This permission is inherited from the authenticated user role.":"Kewenangan ini adalah turunan dari pemeran pengguna terdaftar.", "Customize dashboard":"Sesuaikan dashboard"}} };;
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
(function($) {

  Drupal.behaviors.captchaAdmin = {
    attach : function(context) {

      // Helper function to show/hide noise level widget.
      var noise_level_shower = function(speed) {
        speed = (typeof speed == 'undefined') ? 'slow' : speed;
        if ($("#edit-image-captcha-dot-noise").is(":checked")
            || $("#edit-image-captcha-line-noise").is(":checked")) {
          $(".form-item-image-captcha-noise-level").show(speed);
        } else {
          $(".form-item-image-captcha-noise-level").hide(speed);
        }
      }
      // Add onclick handler to the dot and line noise check boxes.
      $("#edit-image-captcha-dot-noise").click(noise_level_shower);
      $("#edit-image-captcha-line-noise").click(noise_level_shower);
      // Show or hide appropriately on page load.
      noise_level_shower(0);

      // Helper function to show/hide smooth distortion widget.
      var smooth_distortion_shower = function(speed) {
        speed = (typeof speed == 'undefined') ? 'slow' : speed;
        if ($("#edit-image-captcha-distortion-amplitude").val() > 0) {
          $(".form-item-image-captcha-bilinear-interpolation").show(speed);
        } else {
          $(".form-item-image-captcha-bilinear-interpolation").hide(speed);
        }
      }
      // Add onchange handler to the distortion level select widget.
      $("#edit-image-captcha-distortion-amplitude").change(
          smooth_distortion_shower);
      // Show or hide appropriately on page load.
      smooth_distortion_shower(0)

    }
  };

})(jQuery);
;
