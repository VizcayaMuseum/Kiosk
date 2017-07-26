$("#includedContent").load(function(){
    //jQuery(window).load
    fastVid();
    // loadScene();
    loadVideo();
    loadBarge();
    skipFade();
    toggleFullscreen();
    toggleSlider();
    toggleHelp();
    hotspotSlider();    
    closeOverlay();
    resetScene();
});
 /**************end of document ready function ************/


/* Splash Video
*****************************************************/
function loadVideo(){
    $(".welcome").hide();
    $('#splash-video').play();
      console.log('Video should start here!');
};

function fastVid(){
    $("#splash-video").load().playbackRate = 1.75;
};

function loadBarge(){
    $('#splash-video').on('ended',function(){
        $("../examples/grotto.html").load();
      console.log('Video has ended!');
    });


/* Kiosk Time out
*****************************************************/


// function loadScene(){
//     document.getElementByClassName("landing-links").addEventListener("onended", loadVideo);
// };


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
    $('#hotspotCarousel').carousel("slow",{
	interval: 10000 })
};


/* Help Overlay 
*****************************************************/
function toggleHelp(){
    $("#help-overlay").slideToggle();      
};

function closeOverlay(){
    $("#help-overlay").hide();
}


/* HTML5 Fullscreen API
*****************************************************/
document.getElementById('fullscreen').addEventListener('click', function(){
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




// $(document).ready(function(){
//     $("#toggle").click(function() {
//     $("#hotspot-container").css("display", "inline-block");
// });
// });


/* Sidebar/Controlbar Actions 
*****************************************************/
//Comment out until controlbar functinality has been decided
// $('#back').hide();
// $('.potree_container').on("click", 'div.annotation', function () { 
// 	$('#back').show();
// 	$('#about').hide();  
// });


    // // About Us
    // $("#about a").click(function() {
    //     // Reset overlays
    //     $(".open").toggle().removeClass("open");
    //     // load overlay html
    //     $("#potree_render_area").append($('<div>').load("../pages/about-us.html", function() {
    //         // set css
    //         $("#about-overlay").addClass("open").toggle();
    //         $('#potree_render_area').css('right', '33%');
    //         // Handle Overlay - Close button
    //         $(".overlay .close-button").click(function() {
    //             $(".open").toggle().removeClass("open");
    //             $('#potree_render_area').css('right', '0');
    //         }); 
    //     }));
    // });



        // // Reset overlays
        // $(".open").toggle().removeClass("open");
        // // load overlay html and set css
        // $("#potree_render_area").append($('<div>').load("../pages/help.html", function() {
        //     // set css
        //     $("#help-overlay").addClass("open").toggle();
        //     $('#potree_render_area').css('right', '33%');
        //     // Handle Overlay - Close button
        //     $(".overlay .close-button").click(function() {
        //         $(".open").toggle().removeClass("open");
        //         $('#potree_render_area').css('right', '0');
        //     });           
        // }));





