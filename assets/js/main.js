/*
*=================================
* Hugo UILite Portfolio v0.8
*=================================
*
* Free version https://uicard.io/products/hugo-uilite
* Pro version https://uicard.io/products/hugo-uilite-pro
* Demo https://demo.uicard.io/hugo-uilite-portfolio-demo/
*
* Coded By UICardio
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
*/


let menuBtn = $("#menuBar");

menuBtn.click(function() {
  $('.hamburger-menu').toggleClass('animate');

  if ($(".secondaryMenu").hasClass("active")) {

    $(".secondaryMenu").removeClass("active");
    setTimeout(function() {
      $(".primaryMenu").addClass("active");
    }, 400);

  } else {
    $(".primaryMenu").removeClass("active");

    setTimeout(function() {
      $(".secondaryMenu").addClass("active");
    }, 350);
  }
});

function scrollTo(target) {
  const top = $(target).offset().top;
  const duration = 500;
  const changeHash = function() {
    location.hash = target
  };
  $("html, body").animate({ scrollTop: top }, duration, changeHash);
}

$(document).ready(function() {
  var elements = $(".sidebar > .main-info .rv");
  let time = 0;

  for (let i = 0; i < elements.length; i++) {
    setTimeout(function() {
      $(elements[i]).addClass("bs");
    }, time);
    time += 20;
  };

  setTimeout(function() {
    $(".main-content").addClass("active");
  }, time);

  $("#sidebar a.btn[href='#contact']").on("click", function (event) {
    event.preventDefault();

    scrollTo($.attr(this, "href"));
  });

  $("#top-btn").on("click", function (event) {
    event.preventDefault();
    $('body,html').animate({
        scrollTop: 0
    }, 500, function() { location.hash = ''; });
  });
});

// from hugo-academic theme: https://github.com/gcushen/hugo-academic
// Load citation modal on 'Cite' click.
$('.js-cite-modal').click(function(e) {
  e.preventDefault();
  let filename = $(this).attr('data-filename');
  let modal = $('#modal');
  modal.find('.modal-body code').load( filename , function( response, status, xhr ) {
    if ( status == 'error' ) {
      let msg = "Error: ";
      $('#modal-error').html( msg + xhr.status + " " + xhr.statusText );
    } else {
      $('.js-download-cite').attr('href', filename);
    }
  });
  modal.modal('show');
});

// Copy citation text on 'Copy' click.
$('.js-copy-cite').click(function(e) {
  e.preventDefault();
  let code_node = e.currentTarget.closest('.modal-content').querySelector('.modal-body code');
  let text = code_node.textContent;
  let copyToast = e.currentTarget.closest('.modal').querySelector('.toast');
  let toast = new bootstrap.Toast(copyToast);
  try {
    // Write text to clipboard
    navigator.clipboard.writeText(text);
    // Show info toast
    toast.show()
  } catch(e) {
    console.log('Error: citation copy failed.');
  }
});
