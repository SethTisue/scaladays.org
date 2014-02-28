$.getJSON('data.json', function(data) {

    days = data;
    Schedule(days);
    TrackDetails.init();

});


$.fn.scrollReveal = function(){
    $("<a href='#'>&nbsp;</a>").insertAfter(this).focus().remove();
}

// Templating
function tpl(id, data){
    var str = document.getElementById(id).innerHTML;
    return new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +     
        str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return $(p.join(''));");
}

// Templates
var dayTpl          = tpl('dayTpl');
var trackTpl        = tpl('trackTpl');
var keynoteTpl      = tpl('keynoteTpl');
var registerTpl     = tpl('registerTpl');
var eatTpl          = tpl('eatTpl');
var drinkTpl        = tpl('drinkTpl');
var detailsTpl      = tpl('detailsTpl');


// Collections
var days;

// Sick of jQuery.each that put index first...
function forEach(list, callback){
    if ({}.toString.call(list) === '[object Array]'){
        for (var i=0;i<list.length;i++) callback(list[i],i);
    } else {
        for (var i in list) callback(list[i],i);
    }
    return list;
}


function Schedule(data){
    var schedule = $("#schedule");
    forEach(data, function(_day) {
        schedule.append(Day(_day));
    });
    BindSchedule(schedule);
}


function Day(data){
    var day = dayTpl(data);
    BindDay(day, data);
    var tracks = $(".tracks", day);
    // render tracks
    forEach(data.tracks, function(_track) {
        tracks.append(Track(_track));
    });
    return day;
}

var hourSize = 120, currentTimes;
function parseTime(str) {
    var times = str.split("-");
    var s = times[0].split(":");
    var e = times[1].split(":");

    return [
        parseFloat(s[0]),
        parseFloat(s[1]),
        parseFloat(e[0]),
        parseFloat(e[1])
    ];
}

function BindDay(day, data) {
    currentTimes = parseTime(data.time);
    // Set height
    var height = (currentTimes[2]-currentTimes[0]+1)*hourSize;
    day.css('height', height+'px');
    // Draw time
    var timeSide = $('aside', day);
    for (var i = currentTimes[0]; i<currentTimes[2];i++){
        $('<span class="time">'+(i>12?(i-12)+"pm":i+"am")+'<span>')
            .css('top', (i-currentTimes[0])*hourSize+'px')
            .appendTo(timeSide);
    }
    return day;
}


function Track(data){
    // Reference to all speakers
    switch(data.type){
        case 'track':
            data.url = 'schedule/'+data.title.replace(/[^a-z]/ig, '-');
            return BindTrack(trackTpl(data), data);
        case 'keynote':
            data.url = 'schedule/'+data.title.replace(/[^a-z]/ig, '-');
            return BindTrack(keynoteTpl(data), data);
        case 'pause':
        switch(data.style){
            case 'register':
                return BindTrack(registerTpl(data), data);
            case 'eat':
                return BindTrack(eatTpl(data), data);
            case 'drink':
                return BindTrack(drinkTpl(data), data);
        }
    }
};

function BindTrack(track, data){
    if (data.url)
        TrackDetails.register(data.url, data, track);

    var times = parseTime(data.time);
    var top = ( (times[0]-currentTimes[0])*60 + (times[1]-currentTimes[1]) ) * hourSize/60
    var height = ( (times[2]-times[0])*60 + (times[3]-times[1]) ) * hourSize/60
    track.css({
        top: top+"px",
        height: height+"px"
    });

    return track;
}

// Show/hides the track details
// and manage routes for them
var TrackDetails = (function() {
    var dom = $("#details");
    var content = $("#content");
    var routes = {};

    return {
        init: function() {
            $('.close', dom).click(TrackDetails.close);
            window.onhashchange = function() {
                TrackDetails.route(window.location.hash);
            }
            document.body.onkeyup = function(e) {
                if (e.keyCode == 27) {
                    TrackDetails.close();
                }
            }
            TrackDetails.route(window.location.hash);
        },
        register: function(url, data, track) {
            routes[url] = [data, track];
        },
        show: function(data) {
            detailsTpl(data).appendTo(content.html(''));
            dom.show();
        },
        close: function() {
            dom.hide();
            window.location.hash = '#close';
        },
        route: function(url) {
            url = url.replace("#","");
            if (routes[url]) {
                // Show
                TrackDetails.show(routes[url][0]);
                // Scroll to it
                // routes[url][1].scrollReveal();
            } else {
                dom.hide();
            }
        }
    }
}());

function BindSchedule(schedule){

    // =========================
    // Room Horizontal Scrolling
    // =========================
    var fullWidth = document.body.offsetWidth,
        currentOffByColumns = 0,
        rooms = document.getElementById('rooms');

    function gotoColumn(column){
        column = column>=0?column:0;
        if (!checkOffByColumns(column)){
            gotoColumn(column-1);
        } else {
            currentOffByColumns = column;
            schedule[0].className = "off-"+ currentOffByColumns;
        }
    }

    function checkOffByColumns(column){
        if ( (column == 0)
            || (fullWidth <= 960  && column <= 3)
            || (fullWidth <= 1200 && column <= 2)
            || (fullWidth <= 1440 && column <= 1)
        ){
            return true;
        } else {
            return false
        }
    }


    $(rooms).on("click", "li", function(e){
        gotoColumn($(e.target).index());
    });

    // =========================
    // Scroll effect on schedule
    // =========================
    var lastPosition = -1,
        fullHeight = 0,
        titles = [],
        details = {};

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.msRequestAnimationFrame     ||
                window.oRequestAnimationFrame      ||
                function(f){
                    setTimeout(f,60);
                };
    })();

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

    // =========================
    // horizontal scroll
    // =========================
    var throttle = 0;
    schedule.mousewheel(function(e) {
        if (e.deltaX > 20 && !throttle){
            gotoColumn(currentOffByColumns+1);
            throttle = 1;
            setTimeout(function() { throttle = 0; },400);
        } else if (e.deltaX < -20 && !throttle){
            throttle = 1;
            setTimeout(function() { throttle = 0; },400);
            gotoColumn(currentOffByColumns-1);
        }
    });
    if (!!('ontouchstart' in window)) {
        var memo;
        schedule[0].ontouchstart = function(e) {
            memo = e.changedTouches[0].pageX;
            schedule[0].ontouchmove = function(e) {
                deltaX = memo - e.changedTouches[0].pageX;

                if (deltaX > 20 && !throttle){
                    gotoColumn(currentOffByColumns+1);
                    throttle = 1;
                    setTimeout(function() { throttle = 0; },400);
                } else if (deltaX < -20 && !throttle){
                    throttle = 1;
                    setTimeout(function() { throttle = 0; },400);
                    gotoColumn(currentOffByColumns-1);
                }
            }
        }
        schedule[0].ontouchend = function(e) {
            schedule[0].ontouchmove = null;
        }
    }

    // =========================

    window.onresize = function(){

        fullWidth = document.body.offsetWidth;
        gotoColumn(currentOffByColumns);

        fullHeight = window.innerHeight;
        titles = $(".day").map(function(i,el){
            return {
                el: $(el).find("header")[0],
                top: ($(el).offset().top - 50),
                bottom: ($(el).offset().top + $(el).height() - 110)
            }
        });
    }

    window.onresize();
    if (!('ontouchstart' in window)) loop();

}

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
* Licensed under the MIT License (LICENSE.txt).
*
* Version: 3.1.9
*
* Requires: jQuery 1.2.2+
*/

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail' in orgEvent ) { deltaY = orgEvent.detail * -1; }
        if ( 'wheelDelta' in orgEvent ) { deltaY = orgEvent.wheelDelta; }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        // * deltaMode 0 is by pixels, nothing to do
        // * deltaMode 1 is by lines
        // * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[ delta >= 1 ? 'floor' : 'ceil' ](delta / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));