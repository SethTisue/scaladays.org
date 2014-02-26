$.getJSON('https://scaladays.prismic.io/api', function(data) {
    var ref = data.refs[0].ref;
    var url = 'https://scaladays.prismic.io/api/documents/search?page=1&pageSize=100&ref='+ref;

    $.getJSON(url, function(data) {

        // Organize documents
        $(data.results).each(function(index, it) {
            switch(it.type){
                case 'speaker':
                    speakers[it.id] = it;
                    break;
                case 'track':
                    days[it.data.track.day.value].tracks[it.id] = it;
                    break;
                case 'sponsor':
                    sponsors[it.data.sponsor.type.value].list = it;
                    break;
                case 'article':
                    about = it;
                    break;
            }
        });

        Schedule(days);
        Sponsors(sponsors);
        TrackDetails.init();
    });
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
var groupTpl        = tpl('groupTpl');
var sponsorTpl      = tpl('sponsorTpl');

// Collections
var speakers = {},
    days = {
        'Day1': {
            id: 'june-16',
            title: 'Monday June 16th',
            time: '16:30-22:00',
            tracks: {}
        },
        'Day2': {
            id: 'june-17',
            title: 'Tuesday June 17th',
            time: '08:00-22:00',
            tracks: {}
        },
        'Day3': {
            id: 'june-18',
            title: 'Wednesday June 18th',
            time: '08:00-18:00',
            tracks: {}
        }
    },
    sponsors = {
        "Hosted by": {
            title: "Hosted by",
            list: {}
        },
        "Platinium": {
            title: "Platinium",
            list: {}
        },
        "Gold": {
            title: "Gold",
            list: {}
        },
        "Silver": {
            title: "Silver",
            list: {}
        },
        "Friends": {
            title: "Friends",
            list: {}
        }
    },
    about;

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
    data.data.track.speakersList = speakers;
    data.data.track.url = 'schedule/'+data.data.track.title.value.replace(/[^a-z]/ig, '-');
    switch(data.type){
        case 'track':
            return BindTrack(trackTpl(data.data.track), data.data.track);
        case 'keynote':
            return keynoteTpl(data.data.track);
        case 'register':
            return registerTpl(data.data.track);
        case 'eat':
            return eatTpl(data.data.track);
        case 'drink':
            return drinkTpl(data.data.track);
    }
};

function BindTrack(track, data){
    var times = parseTime(data.hour.value);
    var top = (times[0]-currentTimes[0])*hourSize + (times[1]-currentTimes[1])*hourSize/60
    var height = (times[2]-times[0])*hourSize + (times[3]-currentTimes[1])*hourSize/60
    track.css({
        top: top+"px",
        height: height+"px"
    });
    TrackDetails.register(data.url, data, track);
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
                routes[url][1].scrollReveal();
            } else {
                dom.hide();
            }
        }
    }
}());


function Sponsors(data){
    var sponsors = $('#sponsors');
    forEach(data, function(_group, name) {
        sponsors.append(SponsorGroup(_group));
    });
}

function SponsorGroup(data){
    var group = groupTpl(data);
    forEach(data, function(_sponsor) {
        group.append(Sponsor(_sponsor));
    });
    return group;
};

function Sponsor(data){
    return sponsorTpl(data);
};


function findTalksForSpeaker(id, but) {
    var talks = [];
    // As a french, I might go on strike
    // to request `for comprehension` in JS!
    forEach(days, function(day) {
        forEach(day.tracks, function(track) {
            forEach(track.speakers, function(speaker) {
                if (speaker.id == id && track.id != but){
                    talks.push(track);
                }
            });
        });
    });
    return talks;
}

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
    loop();

}
