// REDS
var colors = {
	red :          "#F16665",
	redDkr :       "#E25758",
	redLtr :       "#F6ACAC",
	redText :      "#D64546",

	// BLUES
	blue :         "#53CDEC",
	blueDkr :      "#42b8d7",
	blueLtr :      "#c3eef8",
	blueText :     "#19aacf",
	blueTs :       "#7BDCF5",
	blueTeal :     "#187086",

	// navys
	navy :         "#103a51",

	// slates
	slate :        "#364550",
	slateDkr :     "#2a363e",
	slateLtr :     "#3e515e",
	slateText :    "#28353e",


	// GREYS
	grey :         "#899CA9",
	greyDkr :      "#6F7F89",
	greyLtr :      "#8BA1B0",
	greyText :     "#778a99",

	// GREENS
	green :        "#69af04",

	// whites
	white :        "#ffffff",
	whiteLtr :     "#f0f3f6",
	whiteDkr :     "#c2d2dc"
}

var mapStyle = [
  {
    "stylers": [
      { "color": colors.grey }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "elementType": "labels.text.fill",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.white }
    ]
  },{
    "featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.slate }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.greyDkr }
    ]
  },{
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": colors.whiteDkr }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": colors.blue }
    ]
  },{
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.slate }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.slate }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": colors.whiteDkr }
    ]
  }
];


var venuePosition = new google.maps.LatLng(52.5168394,13.4499112);
var hotelPosition = new google.maps.LatLng(52.524202, 13.417203);
var center = new google.maps.LatLng(52.520234, 13.429183);
var mapOptions = {
	center: center,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	scaleControl: false,
	scrollwheel: false,
	styles: mapStyle
}

var map = new google.maps.Map(document.getElementById("map"), mapOptions);
var markerVenue = new google.maps.Marker({
	position: venuePosition,
	map: map,
	title: 'Kosmos Berlin',
  icon: 'assets/images/red-marker.png'
});
var markerHotel = new google.maps.Marker({
  position: hotelPosition,
  map: map,
  title: 'Hotel Indigo',
  icon: 'assets/images/blue-marker.png'
});
