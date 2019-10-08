
$("#b-button").on("click", function(){
  $("#b-button").fadeOut(1000);
  $("#heading1").delay(1000);
  $("#heading1").fadeIn(1000);
  $(".game").delay(2000);
  $(".game").fadeIn(1000);
});

$("#btnStart").on("click", function(){
  $(".deck").fadeIn(500);
  $(".players").slideDown(500);
});



