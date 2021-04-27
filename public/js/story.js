jQuery(document).ready(function($) {
  $(".document").click(function() {
    window.location = $(this).data("href");
  });
});