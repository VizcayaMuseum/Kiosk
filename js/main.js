jQuery(window).load(function(){
// $("#includedContent").load(function(){
    "use strict";
    //jQuery(window).load
    // loadVideo();
    // loadBarge();
    // toggleFullscreen();
    // toggleSlider();
    // toggleHelp();
    // hotspotSlider();
    // closeOverlay();
    // resetScene();
    // toggleContrast();
});
 /**************end of document ready function ************/


/* Splash Video
*****************************************************/
// function loadVideo(){
//     $("#controlbar-container").append().css("display", "none");
//     $("#splash-video").trigger("play");
//     document.querySelector("video").playbackRate= 1.95;
//       alert('Video should start here!');
// };


// function loadBarge(){
//       $("#splash-video").on("ended", function() {
//        window.location.href = '../examples/grotto.html"';
//        $("#splash-video").css("display", "none");
//     });
// };


/* Kiosk Time out
*****************************************************/

viewer.scene.view.position
viewer.scene.view.getPivot()


/* Reset Scene
*****************************************************/
function resetScene (){

var resetbtn = document.getElementById("reset");

    if (window.location.href.indexOf("barge.html") > -1) {

        $(resetbtn).append(function(){
				sceneVZP.addAnnotation([-0.16, 30.21, 18.83], {
                    "actions": [{
                    "onclick": function(){
                        sceneVZP.view.lookAt(new THREE.Vector3(1.74, 6.21, -0.46));
                        // From original potree annotation example
                        //viewer.scene.view.position(-0.16, 30.21, 18.83);
                        //viewer.scene.view.getPivot(1.74, 6.21, -0.46);
                        alert("you are on the barge page");
                    }
                    }] 
				});                  
            });
    } else if (window.location.href.indexOf("grotto.html") ) {
        //reset 
        alert("you are on the grotto page");
    } else {
        //reset
        alert("you are on some other kind of page");
        }


};


/* Hotspot Scene Toggle - does not work in firefox
*****************************************************/
function toggleSlider(){
    $("#hotspot-container").slideToggle();
}


/* Carousel Slider
*****************************************************/
function hotspotSlider (){
    $("#hotspotCarousel").carousel("slow",{
        interval: 10000 });
}


/* High Contrast - CSS under construction
*****************************************************/
function toggleContrast (){
    $("#accessible").toggleClass("hiContrast");
}


/* Help Overlay
*****************************************************/
function toggleHelp(){
    $("#help-overlay").slideToggle();
}

function closeOverlay(){
    $("#help-overlay").hide();
}


/* HTML5 Fullscreen API
*****************************************************/
document.getElementById("fullscreen").addEventListener("click", function(){
toggleFullscreen();
});

function toggleFullscreen(elem) {
elem = elem || document.documentElement;
if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
} else {
    if (document.exitFullscreen) {
    document.exitFullscreen();
    } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
    }
}

}


