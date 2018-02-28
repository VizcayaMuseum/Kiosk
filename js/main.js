var video = document.getElementById("transition-video");

// Document Ready
$(document).ready(function() {
    // prevent landing page buttons from redirecting to page
    // display transition video first
    $("a.landing-links").click(function(event) {
        event.preventDefault();
        displayTransitionVideo(this.href);
    });
});

// Handle event - Exiting fullscreen mode on splash page
// TODO - switch to using "on()", "bind" is deprecated
$(document, '#transition-video').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var fullscreen = state ? 'FullscreenOn' : 'FullscreenOff';

    // when exiting full screen, pause and hide the video
    if (fullscreen == 'FullscreenOff') {
        video.pause();
        $("#transition-video").hide();
    }
});

/* Transition Video
*****************************************************/
function displayTransitionVideo(redirectPage){
        
    // set source of video based on redirectPage
    if(redirectPage.includes("house")) {
        video.src = "assets/video/vizcayaFlyThrough_HiRes.mp4";
    } else if(redirectPage.includes("barge")) {
        video.src = "assets/video/bargeIntroShort.mp4";
    } else if(redirectPage.includes("grotto")) {
        video.src = "assets/video/poolCutScene.mp4";
    }
    
    // display video in full screen
    toggleFullscreen(video);
    $("#transition-video").show();
    $("#transition-video").trigger("play");

    // redirect to page after video is done playing
    $("#transition-video").on("ended", function() {
        window.location.href = redirectPage;
    });
};

/* Kiosk Time out
*****************************************************/
// viewer.scene.view.position
// viewer.scene.view.getPivot()


/* Reset Scene
*****************************************************/
// Reset the scene to the original camera position and target
function resetScene () {
    var resetbtn = document.getElementById("reset-scene");
    var annotationsArr = viewer.scene.annotations;
    var resetSceneAnnotation = annotationsArr.find(findSceneResetAnnotation);
    
    // call resetScene function
    // set camera back to original position and target
    resetSceneAnnotation.moveHere(viewer.scene.camera);
    // removes infoBox if it's set
    resetSceneAnnotation.hideInfoBox();
};

// find Annotation with title "Scene Reset"
function findSceneResetAnnotation(annotation, index, array) {
    return annotation.title_en == "Reset Scene";
}

/* Nav Bar Functionality
*****************************************************/
/* Zoom In
*****************************************************/
function zoomIn(){
    var currentFOV = viewer.getFOV();
    viewer.setFOV(currentFOV - 5);
}

/* Zoom Out
*****************************************************/
function zoomOut(){
    var currentFOV = viewer.getFOV();
    viewer.setFOV(currentFOV + 5);
}

/* Move Up
*****************************************************/
function moveUp(){
    viewer.scene.view.pitch += .2;
}

/* Move Down
*****************************************************/
function moveDown(){
    viewer.scene.view.pitch -= .2;
}

/* Move Left
*****************************************************/
function moveLeft(){
    viewer.scene.view.yaw += .2;
}

/* Move Right
*****************************************************/
function moveRight(){
    viewer.scene.view.yaw -= .2;
}

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

