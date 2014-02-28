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
    var statics = $(".statics", day);
    // render tracks
    forEach(data.tracks, function(_track) {
        if (_track.type == 'track')
            tracks.append(Track(_track));
        else
            statics.append(Track(_track));
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

        requestAnimFrame(loop);
    }

    // =========================

    window.onresize = function(){
        fullHeight = window.innerHeight;
        titles = $(".day").map(function(i,el){
            return {
                el: $(el).find("header")[0],
                top: ($(el).offset().top),
                bottom: ($(el).offset().top + $(el).height() - 50)
            }
        });
    }

    window.onresize();
    if (!('ontouchstart' in window)) loop();

}
