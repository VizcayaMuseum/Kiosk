//Redirect functions
function redirectFunc() {
    window.top.location.reload();
}

function refreshButton() {
    window.top.location.reload();
}

function refreshPopup() {
    location.reload();
}

function redirectHomeFunc() {
    window.top.location.href = "../index.html";
}

/*Barge Toggles*/
function barge1916Button() {
    window.top.location.assign("../1916barge.html?0");
}
function barge2017Button() {
    window.top.location.assign("../barge.html?0");
}

/*Herm Toggles*/ /*DON'T USE WINDOW.TOP*/
function herm1916Button() {
    window.parent.location.replace("../1916Herm.html");
}
function herm2017Button() {
    window.parent.location.replace("../2017herm.html");
}

/*Sculptures Toggles*/
function sculptures1916Button() {
    window.parent.location.assign("../1916Mermaids.html");
}
function sculptures2017Button() {
    window.parent.location.assign("../mermaids.html");
}

/* Zoom In
*****************************************************/
function zoomIn() {
    viewer.controls.scene.cameraP.zoom += 0.1;
    //let camera = e.viewer.scene.getActiveCamera();
    //viewer.scene.camera.zoom += 0.1;
}

/* Zoom Out
*****************************************************/
function zoomOut() {
    viewer.controls.scene.cameraP.zoom -= 0.1;
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
        .onUpdate(function () {
            if (direction == 'up' || direction == 'down') {
                viewer.scene.view.pitch = currentAmountObject.amount;
            } else if (direction == 'left' || direction == 'right') {
                viewer.scene.view.yaw = currentAmountObject.amount;
            }
        })
        .start(); // Start the tween immediately.
}

/* Move Up
*****************************************************/
function moveUp() {

    // movement direction
    const direction = 'down';

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
function moveDown() {
    // movement direction
    const direction = 'up';

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
function moveLeft() {

    // movement direction
    const direction = 'right';

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
function moveRight() {
    // movement direction
    const direction = 'left';

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


/* Movements for three.js GLTF models ***************************************/

function gltfMoveUp() {

    scene.rotation.x += 0.1;
}

function gltfMoveDown() {

    scene.rotation.x -= 0.1;
}

function gltfMoveRight() {

    scene.rotation.y += 0.1;
}

function gltfMoveLeft() {

    scene.rotation.y -= 0.1;
}

function gltfZoomIn() {

    camera.scale.z += 0.01;

}

function gltfZoomOut() {

    camera.scale.z -= 0.01;
}

//Movements for the GLTF mermiad
function merGltfMoveUp() {

    scene.rotation.x -= 0.1;
}

function merGltfMoveDown() {

    scene.rotation.x += 0.1;
}

//Movements for mermaid potree 
function potreeMerMoveRight() {


    sceneSG.scenePointCloud.rotation.z += 0.1;
}

function potreeMerMoveLeft() {

    sceneSG.scenePointCloud.rotation.z -= 0.1;
}

function potreeMerMoveUp() {

    sceneSG.scenePointCloud.rotation.y += 0.1;
}

function potreeMerMoveDown() {

    sceneSG.scenePointCloud.rotation.y -= 0.1;
}

//Movements for herm potree
function potreeHermMoveUp() {

    sceneSG.scenePointCloud.rotation.y -= 0.1;
}

function potreeHermMoveDown() {

    sceneSG.scenePointCloud.rotation.y += 0.1;
}