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
	$(".palettes").html("<ul><li><span class='back none'>2</span><span class='front'>2</span></li>"+
		"<li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>1</span><span class='front'>1</span></li>"+
		"<li><span class='back none'>4</span><span class='front'>4</span></li></ul>"+
		"<ul><li><span class='back none'>0</span><span class='front'>0</span></li>"+
		"<li><span class='back none'>6</span><span class='front'>6</span></li></ul>"+
		"<ul><li><span class='back none'>1</span><span class='front'>1</span></li>"+
		"<li><span class='back none'>6</span><span class='front'>6</span></li></ul>");
	$(".legend").remove();
	return void 0;
}


// 2014 June 14th 9am, Berlin time
var end = 1402902000000;

// days, hours, minutes
var _second = 1000,
	_minute = _second * 60,
	_hour = _minute * 60,
	_day = _hour * 24;

// elements
var palettes = $(".palettes li").each(function(i, el) {
	$(el)
		.append("<span class='front none'/>")
		.append("<span class='back none'>0</span>")
		.append("<span class='front'>0</span>");
});

// default values
var values = [0,0,0,0,0,0,0,0];

var focused = true;
window.onfocus = function() { focused = true; }
window.onblur = function() { focused = false; }

function refresh() {

	if (!focused) { // Bug in chrome: hidden tabs are 100% when animating
		setTimeout(function() {
			refresh();
		}, 200);
		return void 0;
	}

	// what time is it?
	var date = new Date();

	var diff = end - date,
		days = Math.floor((diff % (_day * 365)) / _day),
		hours = Math.floor((diff % _day) / _hour),
		minutes = Math.floor((diff % _hour) / _minute),
		seconds = Math.floor((diff % _minute) / _second);

	// match time and palettes
	var nums = [
		Math.floor(days/100),
		Math.floor(days%100/10),
		days % 10,
		Math.floor(hours/10),
		hours % 10,
		Math.floor(minutes/10),
		minutes % 10,
		Math.floor(seconds/10),
		seconds % 10
	];

	// animate each palette
	palettes.each(function(i, el) {
		// only if value changed
		if (values[i] != nums[i]) {
			if (i == 3) {
				values[i] = values[i] > 0 ? values[i]-1 : 2;
			} else if (i == 5 || i == 7) {
				values[i] = values[i] > 0 ? values[i]-1 : 5;
			} else {
				values[i] = values[i] > 0 ? values[i]-1 : 9;
			}
			// add new palette
			$(el).append("<span class='back'>"+values[i]+"</span>")
				.append("<span class='front'>"+values[i]+"</span>");

			// remove unused palettes
			$("span",el).eq(-16).remove();
			$("span",el).eq(-15).remove();
		}
	});

	setTimeout(function() {
		refresh();
	}, 200);
}

setTimeout(function() {
	$("#counter").addClass("start");
	refresh();
}, 1000);

}());
