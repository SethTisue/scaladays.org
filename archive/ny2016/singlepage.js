$(function() {
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
      };
    }

    var popupScheduleUsingUrl = function() {
        var eventid = this.id.substring(8);
        var id = "#schedulePopupExtras-" + eventid;
        window.location.hash = "!" + id;
        $('.schedulePopupVisible').toggleClass('schedulePopupVisible');
        return false;
    }

    var handleHashChange = function() {
        var id = window.location.hash.slice(2);
        if (id.startsWith("#schedulePopupExtras-")) {
            $(id).toggleClass('schedulePopupExtras schedulePopupVisible');
            return true;
        } else {
            $('.schedulePopupVisible').toggleClass('schedulePopupExtras schedulePopupVisible');
        }
        return false;
    }

    var closePopup = function() {
        window.history.back();
        return false;
    }

    if (handleHashChange()) {
        var closeHash = "#schedule";
        closePopup = function() {
            closePopup = function() {
                window.history.back();
                return false;
            }
            window.location.hash  = closeHash;
            return false;
        }
        var id = window.location.hash.slice(2);
        if (id.startsWith("#schedulePopupExtras-")) {
            closeHash = '#eventid-' + id.slice(21);
            $(closeHash)[0].scrollIntoView(true);
        }
    }

    $(window).bind( 'hashchange', function (event){
        handleHashChange();
    });


    $('.scheduleClickToPop').click(popupScheduleUsingUrl);

    $('.close').click(closePopup);

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 27:
                closePopup();
                break;
        }
    };

$("[id='scheduleday-Wednesday (16th Sep.)']").removeClass("hide");
$("[id='scheduleday-Thursday (17th Sep.)']").addClass("hide");
$("[id='scheduleday-Friday (18th Sep.)']").addClass("hide");

$(".toggle-left").click(function(){
  $(".toggle-btn").removeClass("toggle-btn-mid");
  $(".toggle-btn").removeClass("toggle-btn-right");
  $(".toggle-btn").addClass("toggle-btn-left");

  $(".toggle-left").removeClass("toggle-text-inactive");
  $(".toggle-left").addClass("toggle-text-active");
  $(".toggle-mid").removeClass("toggle-text-active");
  $(".toggle-mid").addClass("toggle-text-inactive");
  $(".toggle-right").removeClass("toggle-text-active");
  $(".toggle-right").addClass("toggle-text-inactive");

  $(".date-1").removeClass("hide");
  $(".date-2").addClass("hide");
  $(".date-3").addClass("hide");

  $("[id='scheduleday-Wednesday (16th Sep.)']").removeClass("hide");
  $("[id='scheduleday-Thursday (17th Sep.)']").addClass("hide");
  $("[id='scheduleday-Friday (18th Sep.)']").addClass("hide");

});


$(".toggle-mid").click(function(){
  $(".toggle-btn").removeClass("toggle-btn-left");
  $(".toggle-btn").removeClass("toggle-btn-right");
  $(".toggle-btn").addClass("toggle-btn-mid");

  $(".toggle-mid").removeClass("toggle-text-inactive");
  $(".toggle-mid").addClass("toggle-text-active");
  $(".toggle-left").removeClass("toggle-text-active");
  $(".toggle-left").addClass("toggle-text-inactive");
  $(".toggle-right").removeClass("toggle-text-active");
  $(".toggle-right").addClass("toggle-text-inactive");


  $(".date-2").removeClass("hide");
  $(".date-1").addClass("hide");
  $(".date-3").addClass("hide");

  $("[id='scheduleday-Wednesday (16th Sep.)']").addClass("hide");
  $("[id='scheduleday-Thursday (17th Sep.)']").removeClass("hide");
  $("[id='scheduleday-Friday (18th Sep.)']").addClass("hide");
  $("#day3").addClass("hide");
});


$(".toggle-right").click(function(){
  $(".toggle-btn").removeClass("toggle-btn-left");
  $(".toggle-btn").removeClass("toggle-btn-mid");
  $(".toggle-btn").addClass("toggle-btn-right");

  $(".toggle-right").removeClass("toggle-text-inactive");
  $(".toggle-right").addClass("toggle-text-active");
  $(".toggle-left").removeClass("toggle-text-active");
  $(".toggle-left").addClass("toggle-text-inactive");
  $(".toggle-mid").removeClass("toggle-text-active");
  $(".toggle-mid").addClass("toggle-text-inactive");


  $(".date-3").removeClass("hide");
  $(".date-1").addClass("hide");
  $(".date-2").addClass("hide");

  $("[id='scheduleday-Wednesday (16th Sep.)']").addClass("hide");
  $("[id='scheduleday-Thursday (17th Sep.)']").addClass("hide");
  $("[id='scheduleday-Friday (18th Sep.)']").removeClass("hide");
});


//Nav

$("nav").click(function(){
  $(".navigation").toggleClass("nav-active");
  $("nav").toggleClass("nav-bg-close");
});


});
