// initialize these variables
const annotationsArr = viewer.scene.annotations;
let annotationsCount,
    currentAnnotationIndex,
    currentAnnotation;

// Document Ready
$(document).ready(function() {
    annotationsCount = annotationsArr.length;
    currentAnnotationIndex = 0;
    currentAnnotation = annotationsArr[currentAnnotationIndex]
});

/* Reset Scene
*****************************************************/
// Reset the scene to the original camera position and target
function resetScene () {
    let resetSceneAnnotation = annotationsArr.find(findSceneResetAnnotation);
    
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
    const renderArea = $('#potree_render_area');
    const infoBox = $('#infoBox');
    const infoBoxIsVisible = renderArea.css("right") !== "0px";

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

//Redirect functions
function redirectFunc() {

    window.top.location.href = "../1916barge.html";
}

function redirectHomeFunc() {

    window.top.location.href = "../index.html";
}

//For control panel
function controlToggle() {

    $("#handicap_icon").click(function () {

        $("#control_panel").toggle();
    });
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
    const tween = new TWEEN.Tween(currentAmountObject)
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
    const direction = 'up';

    // set target element
    const targetElement = viewer.scene.view.pitch;

    // NOTE: we need values as a property in an object for tween to work
    const currentPitchObject = {
        'amount': viewer.scene.view.pitch
    };
    const newPitchObject = {
        'amount': viewer.scene.view.pitch + .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Down
*****************************************************/
function moveDown(){
    // movement direction
    const direction = 'down';

    // set target element
    const targetElement = viewer.scene.view.pitch;

    // NOTE: we need values as a property in an object for tween to work
    const currentPitchObject = {
        'amount': viewer.scene.view.pitch
    };
    const newPitchObject = {
        'amount': viewer.scene.view.pitch - .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Left
*****************************************************/
function moveLeft(){
    // movement direction
    const direction = 'left';

    // set target element
    const targetElement = viewer.scene.view.yaw;

    // NOTE: we need values as a property in an object for tween to work
    const currentPitchObject = {
        'amount': viewer.scene.view.yaw
    };
    const newPitchObject = {
        'amount': viewer.scene.view.yaw + .25
    };

    // call tween function
    tweenFunction(direction, targetElement, currentPitchObject, newPitchObject);
}

/* Move Right
*****************************************************/
function moveRight(){
    // movement direction
    const direction = 'right';

    // set target element
    const targetElement = viewer.scene.view.yaw;

    // NOTE: we need values as a property in an object for tween to work
    const currentPitchObject = {
        'amount': viewer.scene.view.yaw
    };
    const newPitchObject = {
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
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

//Timeout function
var timeoutID;

function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("touchstart", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("mouseover", resetTimer, false);
    this.addEventListener("mouseout", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);

    startTimer();
}

function startTimer() {

    timeoutID = window.setTimeout(goInactive, 300000);
}

function resetTimer(e) {
    window.clearTimeout(timeoutID);

    goActive();
}

function goInactive() {

    window.top.location.href = "../index.html";
}

function goActive() {
    startTimer();
}


/* add event listeners for bottom menu image carousel
*****************************************************/
function handleBottomMenuImageClicks() {
    $("#bottom-menu-image-carousel a").on('touchend click', function(event) {
        const type = $(this).data('modal-type');
        const modalTitle = $(this).find(".image-text-en").text();

        // display video in modal
        if(type == "video") {
            const videoUrl = $(this).data('video-url');
            displayVideoInModal(videoUrl, modalTitle);
        } else if(type == "iframe") { // else display iframe in modal
            const iframeUrl = $(this).data('iframe-url');
            displayIframeInModal(iframeUrl, modalTitle);
        } else { // just use href from a tag
            document.location.href = $(this).attr('href');
        }
    });
}

/* Create Modal
*****************************************************/
function createModal(modalTitle) {
    const domBody = document.body;

    // modal
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modelModal');
    modal.setAttribute('class', 'modal fade bd-example-modal-lg');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'myLargeModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    const modalDialog = document.createElement('div');
    modalDialog.setAttribute('class', 'modal-dialog modal-lg');
    modalDialog.setAttribute('role', 'document');
    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    const modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    $(modalHeader).html(`
        <h4 class="modal-title" id="myLargeModalLabel">` + modalTitle + `</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">X</span>
        </button>
    `);
    const modalBody = document.createElement('div');
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
    let modal = createModal(modalTitle);
    
    // iframe
    const iframe = document.createElement( 'iframe' );
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
    let modal = createModal(modalTitle);

    // video
    const video = document.createElement( 'video' );
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