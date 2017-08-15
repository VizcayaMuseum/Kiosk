// jQuery(window).load(function(){
//     "use strict";
//     toggleContrast();
// });
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
// viewer.scene.view.position
// viewer.scene.view.getPivot()


/* Reset Scene
*****************************************************/
// var bargeAnnotation = document.getElementById("reset");

//     bargeAnnotation.addEventListener('click', event => {
//         alert('reached grotto, do something here');
//         bargeAnnotation.position = new THREE.Vector3(1.74, 6.21, -0.46);                
//         });

// var resetbtn = document.getElementById("reset");
// var grottoAnnotation = new Potree.Annotation({})
// var bargeAnnotation = new Potree.Annotation({})

// function resetScene (){
//     if (window.location.href.indexOf("barge.html") ) {
//         $(resetbtn).append(function(){
//             bargeAnnotation.addEventListener('click', event => {
//             console.log('reached grotto, do something here');
//             })
//             bargeAnnotation.position = new THREE.Vector3(1.74, 6.21, -0.46);                
//             });
//     } else if (window.location.href.indexOf("grotto.html") ) {
//         $(resetbtn).append(function(){
//             grottoAnnotation.addEventListener('click', event => {
//             console.log('reached grotto, do something here');
//             })
//             grottoAnnotation.position = new THREE.Vector3(1.74, 6.21, -0.46);                
//             });
//         alert("you are on the grotto page");
//     } else {
//         //reset
//         alert("you are on some other kind of page");
//         }

// };




// Original  
function resetScene (){

    var resetbtn = document.getElementById("reset");

        if (window.location.href.indexOf("barge.html") > -1) {
            $(resetbtn).append(function(){
            alert("you are on the barge page");
            // set annotation behavior to button here                
                });
        } else if (window.location.href.indexOf("grotto.html") ) {
            alert("you are on the grotto page");
            // set a different annotation behavior to button here 
        } else {
            alert("you are on some other kind of page");
            // set last annotation behavior to button here 
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


/* High Contrast - Under construction
*****************************************************/
function toggleTheme (){
    $("#theme").attr("href", "../css/hiContrast.css");
};



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


