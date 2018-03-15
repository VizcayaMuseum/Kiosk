// Document Ready
$(document).ready(function() {
    // display transition video before redirecting to page
    $("a.landing-links").on('touchstart click', function(event) {
        event.preventDefault();
        displayTransitionVideo(this.href);
    });
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