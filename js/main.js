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

    // toggle initial infobox from first annotation when page loads
    viewer.scene.annotations[0].displayInfoBox();
    
    // initialize these variables
    annotationsArr = viewer.scene.annotations;
    annotationsCount = annotationsArr.length;
    currentAnnotationIndex = 0;
    currentAnnotation = annotationsArr[currentAnnotationIndex];
});

// Handle event - Exiting fullscreen mode on splash page
// TODO - switch to using "on()", "bind" is deprecated
// $(document, '#transition-video').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
//     var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
//     var fullscreen = state ? 'FullscreenOn' : 'FullscreenOff';

//     // when exiting full screen, pause and hide the video
//     if (fullscreen == 'FullscreenOff') {
//         video.pause();
//         $("#transition-video").hide();
//         $('.skip').hide();
//         $(".welcome").show();
//     }
// });

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

    // hide .welcome div
    $(".welcome").hide();

    // display and trigger play video
    $("#transition-video").show();
    $("#transition-video").trigger("play");

    // redirect to page after video is done playing
    $("#transition-video").on("ended", function() {
        window.location.href = redirectPage;
    });

    // display skip button and bind click event
    $('.skip').show();
    $('.skip').click(function() { 
        window.location.href = redirectPage;
    });
}

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

    if (infoBoxIsVisible) { // then hide infoBox and extend renderArea
        renderArea.css("transition", "right 3s");
        renderArea.css("right", "0px");
        infoBox.css("transition", "right 3s");
        infoBox.css("right", "-380px");
    } else { // show infoBox and reduce renderArea
        renderArea.css("transition", "right 3s");
        renderArea.css("right", "380px");
        infoBox.css("transition", "right 3s");
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

/* Tween function used with camera movement - arrow buttons
*****************************************************/
function tweenFunction(direction, target, currentAmountObject, newAmountObject) {
    // Setup the animation loop.
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

    // declare and initalize tween
    var tween = new TWEEN.Tween(currentAmountObject)
        .to(newAmountObject, 1000)
        .easing(TWEEN.Easing.Quintic.Out)
        .onUpdate(function() {
            if(direction == 'up' || direction == 'down') {
                viewer.scene.view.pitch = currentAmountObject.amount;
            } else if (direction == 'left' || direction == 'right') {
                viewer.scene.view.yaw = currentAmountObject.amount;
            }
        })
        .start(); // Start the tween immediately.
}

/* Move Up
*****************************************************/
function moveUp(){
    // movement direction
    var direction = 'up';

    // set target element
    var targetElement = viewer.scene.view.pitch;

    // NOTE: we need values as a property in an object for tween to work
    var currentPitchObject = {
        'amount': viewer.scene.view.pitch
    };
    var newPitchObject = {
        'amount': viewer.scene.view.pitch + .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Down
*****************************************************/
function moveDown(){
    // movement direction
    var direction = 'down';

    // set target element
    var targetElement = viewer.scene.view.pitch;

    // NOTE: we need values as a property in an object for tween to work
    var currentPitchObject = {
        'amount': viewer.scene.view.pitch
    };
    var newPitchObject = {
        'amount': viewer.scene.view.pitch - .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Left
*****************************************************/
function moveLeft(){
    // movement direction
    var direction = 'left';

    // set target element
    var targetElement = viewer.scene.view.yaw;

    // NOTE: we need values as a property in an object for tween to work
    var currentPitchObject = {
        'amount': viewer.scene.view.yaw
    };
    var newPitchObject = {
        'amount': viewer.scene.view.yaw + .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Right
*****************************************************/
function moveRight(){
    // movement direction
    var direction = 'right';

    // set target element
    var targetElement = viewer.scene.view.yaw;

    // NOTE: we need values as a property in an object for tween to work
    var currentPitchObject = {
        'amount': viewer.scene.view.yaw
    };
    var newPitchObject = {
        'amount': viewer.scene.view.yaw - .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
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