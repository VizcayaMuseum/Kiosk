var video = document.getElementById("transition-video");
var annotationsArr;
var annotationsCount;
var currentAnnotationIndex;
var currentAnnotation;

// Document Ready
$(document).ready(function() {
    // display transition video before redirecting to page
    $("a.landing-links").click(function(event) {
        event.preventDefault();
        displayTransitionVideo(this.href);
    });

    // toggle initial infobox when page loads
    resetScene();

    // initialize these variables
    annotationsArr = viewer.scene.annotations;
    annotationsCount = annotationsArr.length;
    currentAnnotationIndex = 0;
    currentAnnotation = annotationsArr[currentAnnotationIndex];
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
    resetSceneAnnotation.displayInfoBox();
}

// find first Annotation - should match initial viewpoint
function findSceneResetAnnotation(annotation, index, array) {
    return index == 0;
}

// Toggle info box display
function toggleInfoBox() {
    // adjust render area width
    var renderArea = $('#potree_render_area');
    var infoBox = $('#infoBox');
    var infoBoxIsVisible = renderArea.css("right") !== "0px";

    if (infoBoxIsVisible){ // then hide infoBox and extend renderArea
        renderArea.css("transition", "right 2s");
        renderArea.css("right", "0px");
        infoBox.css("transition", "right 2s");
        infoBox.css("right", "-380px");
    } else { // show infoBox and reduce renderArea
        renderArea.css("transition", "right 2s");
        renderArea.css("right", "380px");
        infoBox.css("transition", "right 2s");
        infoBox.css("right", "0px");
    }
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

/* Autoplay Annotations
*****************************************************/
// autoplay annotations
function autoplayAnnotations() {
    // increase index within annotationsCount
    if (currentAnnotationIndex <= annotationsCount) {
        currentAnnotationIndex++;
    } else { // restart at 0
        currentAnnotationIndex = 0;
    }
    
    // actions for moving to next annotation
    console.log(currentAnnotation);
    currentAnnotation.moveHere(viewer.scene.camera);
    currentAnnotation.displayInfoBox();

    // update current annotation
    currentAnnotation = annotationsArr[currentAnnotationIndex];
}

// autoplay annotations with setTimeout
// setInterval(autoplayAnnotations, 6000);