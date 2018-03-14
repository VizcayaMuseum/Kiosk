// initialize these variables
try {
    const annotationsArr = viewer.scene.annotations;
} catch(e) {
    const annotationsArr = '';
}
let annotationsCount,
    currentAnnotationIndex,
    currentAnnotation;

// Document Ready
$(document).ready(function() {
    // display transition video before redirecting to page
    $("a.landing-links").on('touchstart click', function(event) {
        event.preventDefault();
        displayTransitionVideo(this.href);
    });

    // initialize these variables
    annotationsCount = annotationsArr.length;
    currentAnnotationIndex = 0;
    currentAnnotation = annotationsArr[currentAnnotationIndex]
});

/* Transition Video
*****************************************************/
function displayTransitionVideo(redirectPage){
    const video = document.getElementById("transition-video");

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

    // display skip button and bind touch and click event
    $('.skip').show();
    $('.skip').on('touchstart click', function() { 
        window.location.href = redirectPage;
    });
}

/* Reset Scene
*****************************************************/
// Reset the scene to the original camera position and target
function resetScene () {
    var resetbtn = document.getElementById("reset-scene");
    var resetSceneAnnotation = annotationsArr.find(findSceneResetAnnotation);
    
    // call resetScene function
    // set camera back to original position and target
    resetSceneAnnotation.moveHere(viewer.scene.camera);
    resetSceneAnnotation.displayInfoBox();
    viewer.scene.camera.zoom = 1;
}

// find first Annotation - should match initial viewpoint
function findSceneResetAnnotation(annotation, index, array) {
    return index == 0;
}

// Toggle info box display
function toggleInfoBox() {
    const infoBoxWidth = 288;

    // adjust render area width
    var renderArea = $('#potree_render_area');
    var infoBox = $('#infoBox');
    var infoBoxIsVisible = renderArea.css("right") !== "0px";

    if (infoBoxIsVisible) { // then hide infoBox and extend renderArea
        renderArea.css("transition", "right 3s");
        renderArea.css("right", "0px");
        infoBox.css("transition", "right 3s");
        infoBox.css("right", "-" + infoBoxWidth + "px");
    } else { // show infoBox and reduce renderArea
        renderArea.css("transition", "right 3s");
        renderArea.css("right", infoBoxWidth + "px");
        infoBox.css("transition", "right 3s");
        infoBox.css("right", "0px");
    }
}
    
/* Nav Bar Functionality
*****************************************************/
/* Zoom In
*****************************************************/
function zoomIn(){
    viewer.scene.camera.zoom += 0.1;
}

/* Zoom Out
*****************************************************/
function zoomOut(){
    viewer.scene.camera.zoom -= 0.1;
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
    $("#bottom-menu-image-carousel").toggle();
}

/* Carousel Slider
*****************************************************/
function hotspotSlider() {
    // Add swipe support for carousel
    $('#bottom-menu-image-carousel').smoothTouchScroll();
    
    // add click handler for saving last clicked image state
    $('#bottom-menu-image-carousel a').on('touchstart click', function() {
        // remove class active on all
        $('#bottom-menu-image-carousel a').removeClass('active');
        // add only on selected item
        $(this).addClass('active');
    });
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

/* add event listeners for bottom menu image carousel
*****************************************************/
function handleBottomMenuImageClicks() {
    $("#bottom-menu-image-carousel a").on('touchstart click', function(event) {
        var type = $(this).data('modal-type');
        var modalTitle = $(this).find(".image-text-en").text();

        // display video in modal
        if(type == "video") {
            var videoUrl = $(this).data('video-url');
            console.log($(this).data());
            displayVideoInModal(videoUrl, modalTitle);
        } else if(type == "iframe") { // else display iframe in modal
            var iframeUrl = $(this).data('iframe-url');
            displayIframeInModal(iframeUrl, modalTitle);
        } else { // just use href from a tag
            document.location.href = $(this).attr('href');
        }
    });
}

/* Create Modal
*****************************************************/
function createModal(modalTitle) {
    var domBody = document.body;

    // modal
    var modal = document.createElement('div');
    modal.setAttribute('id', 'modelModal');
    modal.setAttribute('class', 'modal fade bd-example-modal-lg');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'myLargeModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    var modalDialog = document.createElement('div');
    modalDialog.setAttribute('class', 'modal-dialog modal-lg');
    modalDialog.setAttribute('role', 'document');
    var modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    var modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    $(modalHeader).html(`
        <h4 class="modal-title" id="myLargeModalLabel">` + modalTitle + `</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">X</span>
        </button>
    `);
    var modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'modal-body');

    // add elements into page
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    domBody.appendChild(modal);

    return modal;
}

/* Display iframe inside a Modal
*****************************************************/
function displayIframeInModal(iframeUrl, modalTitle) {
    // modal
    var modal = createModal(modalTitle);
    
    // iframe
    var iframe = document.createElement( 'iframe' );
    iframe.src = iframeUrl;

    // add iframe into modal
    $(modal).find('.modal-body').append(iframe);

    // toggle the modal and then add event handler for 
    // removing the modal from the DOM when it's closed
    $(modal).modal('show').on('hide.bs.modal', function (event) {
        $(this).remove();
    });
}

/* Display video inside a Modal
*****************************************************/
function displayVideoInModal(videoUrl, modalTitle) {
    // modal
    var modal = createModal(modalTitle);

    // video
    var video = document.createElement( 'video' );
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = true;

    // add iframe into modal
    $(modal).find('.modal-body').append(video);

    // toggle the modal and then add event handler for 
    // removing the modal from the DOM when it's closed
    $(modal).modal('show').on('hide.bs.modal', function (event) {
        $(this).remove();
    });
}
        
/* Autoplay Annotations
*****************************************************/
function autoplayAnnotations() {
    // increase index within annotationsCount
    if (currentAnnotationIndex <= annotationsCount) {
        currentAnnotationIndex++;
    } else { // restart at 0
        currentAnnotationIndex = 0;
    }
    
    // actions for moving to next annotation
    currentAnnotation.moveHere(viewer.scene.camera);
    currentAnnotation.displayInfoBox();

    // update current annotation
    currentAnnotation = annotationsArr[currentAnnotationIndex];
}

// autoplay annotations with setTimeout
// setInterval(autoplayAnnotations, 6000);