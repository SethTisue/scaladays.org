;(function(){

  // This one is different from the previous one:
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame   ||
        window.msRequestAnimationFrame     ||
        window.oRequestAnimationFrame     ||
        function(f){
          setTimeout(f,60);
        };
  })();

  // Scroll effect on schedule
  var lastPosition = -1,
    wHeight = 0,
    titles = [],
    details = {},
    rooms = document.getElementById('rooms');

  function loop(){
    if (lastPosition == window.pageYOffset) {
      requestAnimFrame(loop);
      return false;
    } else lastPosition = window.pageYOffset;

    titles.each(function(i, title){
      if (lastPosition > title.top && lastPosition < title.bottom){
        title.el.className = "fixed";
      } else if (lastPosition > title.bottom) {
        title.el.className = "after";
      } else {
        title.el.className = "";
      }
    });

    if (lastPosition > titles[0].top && lastPosition < titles[2].bottom){
      rooms.className = "fixed";
    } else if (lastPosition > titles[2].bottom) {
      rooms.className = "after";
    } else {
      rooms.className = "";
    }

    requestAnimFrame(loop);
  }

  var wHeight, titles;
  window.onresize = function(){
    wHeight = window.innerHeight;
    titles = $(".day").map(function(i,el){
      return {
        el: $(el).find("header")[0],
        top: ($(el).offset().top - 50),
        bottom: ($(el).offset().top + $(el).height() - 110)
      }
    });
  }
  window.onresize();

  loop();


  $("#schedule").on("click", ".track", function(){
    $("#details").show();
  });
  $("#details .close").on("click", function(){
    $("#details").hide();
  });

}());
