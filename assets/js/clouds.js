;(function(){

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame             ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame     ||
            window.msRequestAnimationFrame       ||
            window.oRequestAnimationFrame
})();

window.vendor = "",
    div = document.createElement('div'),
    props = ['transform', 'WebkitTransform',
            'MozTransform', 'OTransform', 'msTransform'],
    i = 0,
    cssTransform = false;
while (props[i]) {
    if (props[i] in div.style) {
        cssTransform = true;
        vendor = props[i].replace(/transform/i,'');
        vendor = vendor.toLowerCase();
        if(cssTransform && vendor) vendor = "-" + vendor + "-";
        break;
    }
    i++;
}

if (!!('ontouchstart' in window) || !requestAnimFrame || !cssTransform) return false;

document.body.className = "animate";

var lastPosition = -10,
    wHeight = window.innerHeight,

    keynotes = $("#keynotes"),

    mountains2 = $("#mountains2"),
    mountains = $("#mountains"),
    clouds = $("#clouds"),
    clouds2 = $("#clouds2"),
    clouds3 = $("#clouds3"),
    cloudsF = $("#cloudsF"),
    cloudsM = $("#m1"),
    beers = $(".beer"),
    beerLeft = $("#beerLeft"),
    beerRight = $("#beerRight"),

    group1 = $(".group1"),

    loop = function(){
        if (lastPosition == window.pageYOffset) {
            requestAnimFrame(loop);
            return false;
        } else lastPosition = window.pageYOffset;

        if (window.pageYOffset < 2000) {
            
            keynotes.css('opacity', 1.4-(window.pageYOffset/300) );

            clouds.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.2) +"px,0)" );
            cloudsF.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.2) +"px,0)" );
            cloudsM.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.2) +"px,0)" );
            clouds2.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.35) +"px,0)" );
            clouds3.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.5) +"px,0)" );

            mountains.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-1.8) +"px,0)" );
            mountains2.css(vendor+'transform', "translate3d(0, "+ (window.pageYOffset/-2) +"px,0)" );
            
            beerRight.css('opacity', -0.6+(window.pageYOffset/500) );
            beerLeft.css('opacity', -0.6+(window.pageYOffset/500) );
            beerLeft.css(vendor+'transform', "rotate(-7deg) translate("+(window.pageYOffset/-6) +"px, "+ (window.pageYOffset/-10) +"px)" );
            beerRight.css(vendor+'transform', "rotate(10deg) translate("+(window.pageYOffset/+6) +"px, "+ (window.pageYOffset/-10) +"px)" );


        } else {
         

        }


        requestAnimFrame(loop);
    };

window.onresize = function(){
    wHeight = window.innerHeight;
}
loop();

}());