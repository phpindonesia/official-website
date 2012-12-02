Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Terdapat kesalahan pada AJAX HTTP", "HTTP Result Code: !status":"Kode hasil HTTP: !status", "An AJAX HTTP request terminated abnormally.":"Permintaan AJAX HTTP diakhiri tak normal.", "Path: !uri":"Path: !uri", "StatusText: !statusText":"Teks Status : !statusText", "ResponseText: !responseText":"Teks tanggapan: !responseText", "ReadyState: !readyState":"ReadyState: !readyState", "Loading":"Memuat", "(active tab)":"(tab aktif)", "Hide":"Sembunyikan", "Show":"Perlihatkan", "Configure":"Konfigurasi", "Edit summary":"Ubah ringkasan", "Not in menu":"Tidak di menu", "Please wait...":"Mohon tunggu...", "Not in book":"Tidak ada dalam buku", "New book":"Buku baru", "No revision":"Tidak ada revisi", "Not published":"Tidak dipublikasikan", "@number comments per page":"@number komentar per halaman", "Searching for matches...":"Mencari kecocokan...", "Select all rows in this table":"Pilih semua baris dalam tabel ini", "Deselect all rows in this table":"Hapus pilihan pada semua baris dalam tabel ini", "Re-order rows by numerical weight instead of dragging.":"Atur ulang baris menurut ukuran numerik bukan dari hasil menyeret.", "Show row weights":"Tampilkan baris bobot", "Hide row weights":"Sembunyikan baris bobot", "Drag to re-order":"Drag untuk mengatur urutan", "Changes made in this table will not be saved until the form is submitted.":"Perubahan yang dilakukan pada tabel ini tidak akan disimpan sebelum anda mengirim form ini.", "Not restricted":"Tidak aman", "The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\u002Fem\u003E button is clicked.":"Perubahan atas blok ini tidak akan disimpan sebelum anda klik tombol \u003Cem\u003ESimpan blok\u003C\u002Fem\u003E.", "Edit":"Edit", "Automatic alias":"Alias otomatis", "Done":"Selesai", "This permission is inherited from the authenticated user role.":"Kewenangan ini adalah turunan dari pemeran pengguna terdaftar.", "Customize dashboard":"Sesuaikan dashboard"}} };;
(function ($) {
  Drupal.advanced_forum = Drupal.advanced_forum || {};

  Drupal.behaviors.advanced_forum = {
    attach: function(context) {
      // Retrieve the collapsed status from a stored cookie.
      // cookie format is: page1=1,2,3/page2=1,4,5/page3=5,6,1...
      var cookie = $.cookie('Drupal.advanced_forum.collapsed');
      var pages = cookie ? cookie.split('/') : new Array();
      // Create associative array where key=page path and value=comma-separated list of collapsed forum ids
      Drupal.advanced_forum.collapsed_page = new Array();
      if (pages) {
        for (x in pages) {
          tmp = pages[x].split('=');
          Drupal.advanced_forum.collapsed_page[tmp[0]] = tmp[1].split(',');
        }
      }

      // Get data for current page
      Drupal.advanced_forum.collapsed_current = Drupal.advanced_forum.collapsed_page[encodeURIComponent(window.location.pathname)];
      if (!Drupal.advanced_forum.collapsed_current)
        Drupal.advanced_forum.collapsed_current = new Array();

      var handleElement = $('.forum-collapsible', context);

      // Set initial collapsed state
      handleElement.once('forum-collapsible', Drupal.advanced_forum.init);

      handleElement.addClass('clickable').click(function(event) {
        event.preventDefault();

        // Get forum id
        var id = $(this).attr('id').split('-')[2];
        if ( $(this).hasClass('container-collapsed')) {
          Drupal.advanced_forum.expand(id, Drupal.settings.advanced_forum.effect);
          // Reset collapsed status
          Drupal.advanced_forum.collapsed_current.splice($.inArray(id, Drupal.advanced_forum.collapsed_current),1);
        }
        else {
          Drupal.advanced_forum.collapse(id, Drupal.settings.advanced_forum.effect);
          // Set collapsed status
          Drupal.advanced_forum.collapsed_current.push(id);
        }

        // Put status back
        Drupal.advanced_forum.collapsed_page[encodeURIComponent(window.location.pathname)] = Drupal.advanced_forum.collapsed_current;

        // Build cookie string
        cookie = '';
        for(x in Drupal.advanced_forum.collapsed_page) {
          cookie += '/' + x + '=' + Drupal.advanced_forum.collapsed_page[x];
        }
        // Save new cookie
        $.cookie(
          'Drupal.advanced_forum.collapsed',
          cookie.substr(1),
          {
            path: '/',
            // The cookie should "never" expire.
            expires: 36500
          }
          );
      });
    }
  };

  /**
   * Initialize and set collapsible status.
   * Initial collapsing/expanding effect is set to 'toggle' to avoid flickers.
   */
  Drupal.advanced_forum.init = function() {
    // get forum id
    var id = $(this).attr('id').split('-')[2];

    // Check if item is collapsed
    if ($.inArray(id, Drupal.advanced_forum.collapsed_current) > -1) {
      $(this)
        .addClass('container-collapsed')
        .parent().addClass('container-collapsed');
      Drupal.advanced_forum.collapse(id, 'toggle');
      return;
    }

    $(this)
      .removeClass('container-collapsed')
      .parent().removeClass('container-collapsed');
    Drupal.advanced_forum.expand(id, 'toggle');
  };

  Drupal.advanced_forum.collapse = function(id, effect) {
    switch(effect) {
      case 'fade':
         $('#forum-table-' + id).fadeOut('fast');
         break;
      case 'slide':
        $('#forum-table-' + id).slideUp('fast');
        break;
      default:
        $('#forum-table-' + id).hide();
    }
    $('#forum-collapsible-' + id)
      .addClass('container-collapsed')
      .parent().addClass('container-collapsed');
  };

  Drupal.advanced_forum.expand = function(id, effect) {
    switch(effect) {
      case 'fade':
         $('#forum-table-' + id).fadeIn('fast');
         break;
      case 'slide':
        $('#forum-table-' + id).slideDown('fast');
        break;
      default:
        $('#forum-table-' + id).show();
    }
    $('#forum-collapsible-' + id)
      .removeClass('container-collapsed')
      .parent().removeClass('container-collapsed');
  };

})(jQuery);
;

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
