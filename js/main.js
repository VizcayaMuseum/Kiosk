$(window).on( "load", ( function() {
    "use strict";
    // loadVideo();
    // loadBarge();
    toggleSlider();
    toggleHelp();
    hotspotSlider();
    closeOverlay();
    // resetScene();
    toggleContrast();
}));
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




/* Reset Scene
*****************************************************/
// function resetScene (){
// var resetbutton = document.getElementById("reset");
// var house = $(document).load("../examples/house.html");

//     if (document.URL.contains("grotto.html") ) {
//         ("#reset").append(
//             console.log("resetscene code running");
//             sceneVZP.view.position.set(-3.49, 8.39, -0.42);
//             sceneVZP.view.lookAt(new THREE.Vector3(-3.05, 7.79, -0.60));
//     } else if (document.URL.contains("grotto.html") ) {
//             ("#reset").append(
//                 sceneVZP.view.position.set(-3.49, 8.39, -0.42);
//                 sceneVZP.view.lookAt(new THREE.Vector3(-3.05, 7.79, -0.60));
//             );
//     } else {
//             ("#reset").append(
//                 sceneVZP.view.position.set(-3.49, 8.39, -0.42);
//                 sceneVZP.view.lookAt(new THREE.Vector3(-3.05, 7.79, -0.60));
//             );
//         }
// };


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



/* Language Changer
*****************************************************/
// function findLanguage({ 
//     lng: 'en',
//     resGetPath: Potree.resourcePath + '/lang/__lng__/__ns__.json',
//     preload: ['en', 'fr', 'de', 'jp'],
//     getAsync: true,
//     debug: false
//     }, function(t) { 
//     // Start translation once everything is loaded
//     $("#hotspotCarousel").findLanguage();
// });
			
			
// setLanguage(lang){
//     findLanguage.setLng(lang);
//     $("#hotspotCarousel").findLanguage();
// }	



