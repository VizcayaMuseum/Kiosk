 //OKVideo
 $(document).ready(function(){
            /* plays the BG Vimeo or Youtube video if non-mobile device is detected*/ 
            $("body").okvideo({ source: '59472319', //set your video source here
                                        autoplay:true,
                                        loop: true,
                                        highdef:true,
                                        hd:true, 
                                        adproof: true,
                                        volume:50 // control the video volume by setting a value from 0 to 99
                                     });
          
 })