Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Terdapat kesalahan pada AJAX HTTP", "HTTP Result Code: !status":"Kode hasil HTTP: !status", "An AJAX HTTP request terminated abnormally.":"Permintaan AJAX HTTP diakhiri tak normal.", "Path: !uri":"Path: !uri", "StatusText: !statusText":"Teks Status : !statusText", "ResponseText: !responseText":"Teks tanggapan: !responseText", "ReadyState: !readyState":"ReadyState: !readyState", "Loading":"Memuat", "(active tab)":"(tab aktif)", "Hide":"Sembunyikan", "Show":"Perlihatkan", "Configure":"Konfigurasi", "Select all rows in this table":"Pilih semua baris dalam tabel ini", "Deselect all rows in this table":"Hapus pilihan pada semua baris dalam tabel ini", "Re-order rows by numerical weight instead of dragging.":"Atur ulang baris menurut ukuran numerik bukan dari hasil menyeret.", "Show row weights":"Tampilkan baris bobot", "Hide row weights":"Sembunyikan baris bobot", "Drag to re-order":"Drag untuk mengatur urutan", "Changes made in this table will not be saved until the form is submitted.":"Perubahan yang dilakukan pada tabel ini tidak akan disimpan sebelum anda mengirim form ini.", "Not restricted":"Tidak aman", "The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\u002Fem\u003E button is clicked.":"Perubahan atas blok ini tidak akan disimpan sebelum anda klik tombol \u003Cem\u003ESimpan blok\u003C\u002Fem\u003E.", "This permission is inherited from the authenticated user role.":"Kewenangan ini adalah turunan dari pemeran pengguna terdaftar."}} };;

(function($) {
  Drupal.behaviors.CToolsJumpMenu = {
    attach: function(context) {
      $('.ctools-jump-menu-hide')
        .once('ctools-jump-menu')
        .hide();

      $('.ctools-jump-menu-change')
        .once('ctools-jump-menu')
        .change(function() {
          var loc = $(this).val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });

      $('.ctools-jump-menu-button')
        .once('ctools-jump-menu')
        .click(function() {
          // Instead of submitting the form, just perform the redirect.

          // Find our sibling value.
          var $select = $(this).parents('form').find('.ctools-jump-menu-select');
          var loc = $select.val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });
    }
  }
})(jQuery);
;
