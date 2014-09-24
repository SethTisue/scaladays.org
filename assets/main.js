;(function(){

var is_mobile = !!('ontouchstart' in window);
var s = document.createElement('p').style,
    supportsTransitions = 'transition' in s ||
                          'WebkitTransition' in s ||
                          'MozTransition' in s ||
                          'msTransition' in s ||
                          'OTransition' in s;

// Way too slow on mobile
if (is_mobile || !supportsTransitions){
	$(".palettesSF").html("<ul><li><span class='back none'>2</span><span class='front'>2</span></li>"+
		"<li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>1</span><span class='front'>1</span></li>"+
		"<li><span class='back none'>5</span><span class='front'>5</span></li></ul>"+
		"<ul><li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>2</span><span class='front'>2</span></li></ul>"+
		"<ul><li><span class='back none'>1</span><span class='front'>1</span></li>"+
		"<li><span class='back none'>7</span><span class='front'>7</span></li></ul>");
	
	$(".palettesAM").html("<ul><li><span class='back none'>2</span><span class='front'>2</span></li>"+
		"<li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>1</span><span class='front'>1</span></li>"+
		"<li><span class='back none'>5</span><span class='front'>5</span></li></ul>"+
		"<ul><li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>6</span><span class='front'>6</span></li></ul>"+
		"<ul><li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>8</span><span class='front'>8</span></li></ul>");
	$(".legend").remove();
	return void 0;
}

var sanfranDate = new Date("Tue Mar 16 2015 09:00:00 GMT-0800");
var sfMil = sanfranDate.getTime();

var amDate = new Date("Mon Jun 8 2015 09:00:00 GMT+0100");
var amMil = amDate.getTime();

var endSF = sfMil;
var endAM = amMil;

// days, hours, minutes
var _second = 1000,
	_minute = _second * 60,
	_hour = _minute * 60,
	_day = _hour * 24;

// elements
var palettesSF = $(".palettesSF li").each(function(i, el) {
	$(el)
		.append("<span class='front none'/>")
		.append("<span class='back none'>0</span>")
		.append("<span class='front'>0</span>");
});
var palettesAM = $(".palettesAM li").each(function(i, el) {
	$(el)
		.append("<span class='front none'/>")
		.append("<span class='back none'>0</span>")
		.append("<span class='front'>0</span>");
});

// default values
var valuesSF = [0,0,0,0,0,0,0,0];
var valuesAM = [0,0,0,0,0,0,0,0];

var focused = true;
window.onfocus = function() { focused = true; }
window.onblur = function() { focused = false; }

function refresh(sfEnd, amEnd) {

	if (!focused) { // Bug in chrome: hidden tabs are 100% when animating
		setTimeout(function() {
			refresh(sfEnd, amEnd);
		}, 200);
		return void 0;
	}

	// what time is it?
	var date = new Date();

	var diffSF = sfEnd - date,
		daysSF = Math.floor((diffSF % (_day * 365)) / _day),
		hoursSF = Math.floor((diffSF % _day) / _hour),
		minutesSF = Math.floor((diffSF % _hour) / _minute),
		secondsSF = Math.floor((diffSF % _minute) / _second);

	// match time and palettes
	var numsSF = [
		Math.floor(daysSF/100),
		Math.floor(daysSF%100/10),
		daysSF % 10,
		Math.floor(hoursSF/10),
		hoursSF % 10,
		Math.floor(minutesSF/10),
		minutesSF % 10,
		Math.floor(secondsSF/10),
		secondsSF % 10
	];

	var diffAM = amEnd - date,
		daysAM = Math.floor((diffAM % (_day * 365)) / _day),
		hoursAM = Math.floor((diffAM % _day) / _hour),
		minutesAM = Math.floor((diffAM % _hour) / _minute),
		secondsAM = Math.floor((diffAM % _minute) / _second);

	// match time and palettes
	var numsAM = [
		Math.floor(daysAM/100),
		Math.floor(daysAM%100/10),
		daysAM % 10,
		Math.floor(hoursAM/10),
		hoursAM % 10,
		Math.floor(minutesAM/10),
		minutesAM % 10,
		Math.floor(secondsAM/10),
		secondsAM % 10
	];
	// animate each palette
	palettesAM.each(function(i, el) {
		// only if value changed
		if (valuesAM[i] != numsAM[i]) {
			if (i == 3) {
				valuesAM[i] = valuesAM[i] > 0 ? valuesAM[i]-1 : 2;
			} else if (i == 5 || i == 7) {
				valuesAM[i] = valuesAM[i] > 0 ? valuesAM[i]-1 : 5;
			} else {
				valuesAM[i] = valuesAM[i] > 0 ? valuesAM[i]-1 : 9;
			}
			// add new palette
			$(el).append("<span class='back'>"+valuesAM[i]+"</span>")
				.append("<span class='front'>"+valuesAM[i]+"</span>");

			// remove unused palettes
			$("span",el).eq(-16).remove();
			$("span",el).eq(-15).remove();
		}
	});
	// animate each palette
	palettesSF.each(function(i, el) {
		// only if value changed
		if (valuesSF[i] != numsSF[i]) {
			if (i == 3) {
				valuesSF[i] = valuesSF[i] > 0 ? valuesSF[i]-1 : 2;
			} else if (i == 5 || i == 7) {
				valuesSF[i] = valuesSF[i] > 0 ? valuesSF[i]-1 : 5;
			} else {
				valuesSF[i] = valuesSF[i] > 0 ? valuesSF[i]-1 : 9;
			}
			// add new palette
			$(el).append("<span class='back'>"+valuesSF[i]+"</span>")
				.append("<span class='front'>"+valuesSF[i]+"</span>");

			// remove unused palettes
			$("span",el).eq(-16).remove();
			$("span",el).eq(-15).remove();
		}
	});


	setTimeout(function() {
		refresh(sfEnd, amEnd);
	}, 200);
}

setTimeout(function() {
	$("#counterSF").addClass("start");
	$("#counterAmsterdam").addClass("start");
	refresh(endSF, endAM);
}, 1000);

}());
