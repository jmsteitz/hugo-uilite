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
    time += 310;
  };

  setTimeout(function() {
    $(".main-content").addClass("active");
  }, time);

  $("#sidebar a.btn[href='#contact']").on("click", function (event) {
    event.preventDefault();

    scrollTo($.attr(this, "href"));
  });
});

// from hugo-academic theme
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
  // Get selection.
  let range = document.createRange();
  let code_node = document.querySelector('#modal .modal-body');
  range.selectNode(code_node);
  window.getSelection().addRange(range);
  try {
    // Execute the copy command.
    document.execCommand('copy');
  } catch(e) {
    console.log('Error: citation copy failed.');
  }
  // Remove selection.
  window.getSelection().removeRange(range);
});
