/*
 * basic - A signature theme from Designova
 * Author: Designova, http://www.designova.net
 * Copyright (C) 2015 Designova
 * This is a premium product. For licensing queries please contact info@designova.net
 */
/*global $:false */
/*global window: false */
(function() {
    "use strict";
    $(function($) {

        //Detecting viewpot dimension
        var vH = $(window).height();
        var vW = $(window).width();
        //Adjusting Intro Components Spacing based on detected screen resolution
        $('.fullwidth').css('width', vW);
        $('.fullheight').css('height', vH);
        $('.halfwidth').css('width', vW / 2);
        $('.halfheight').css('height', vH / 2);

        
        $('.news-head').setAllToMaxHeight();
        //Mobile Only Navigation (multi level)
                $('ul.slimmenu').slimmenu({
                    resizeWidth: '992',
                    collapserTitle: '',
                    easingEffect: 'easeInOutQuint',
                    animSpeed: 'medium',
                });

                $('.slimmenu li a:not(.sub-collapser)').on('click',function(){
                            $('ul.slimmenu').removeClass('expanded').slideUp();
                });


        //PRELOADER
        $('body, html').addClass('preloader-running');
        $('#mastwrap').css('visibility', 'hidden');
        $(window).load(function() {
            $("#status").fadeOut();
            $("#preloader").delay(1000).fadeOut(1000);
            $('body, html').removeClass('preloader-running');
            $('body, html').addClass('preloader-done');
            $("#mastwrap").delay(1000).css('visibility',
                'visible');
        });

//Sub Menu Trigger
        $('.main-menu li a.sub-menu-trigger').on('mouseenter', function(){
            $(this).next('.sub-menu').stop().slideDown(1000);
        });
        $('.main-menu li').on('mouseleave', function(){
            $('.sub-menu').stop().slideUp(1000);
        });

//COMMON UX
    $('.team-block').on('mouseenter', function(){
        $(this).find('.team-overlay').slideDown();
    });
    $('.team-block').on('mouseleave', function(){
        $(this).find('.team-overlay').slideUp();
    });

//PORTFOLIO UX
        (function( $ ){
           $.fn.filterPanelTrigger = function() {
                if($(".works-filter-panel").is(":hidden"))
                {
                    $('.works-filter-panel').slideDown();
                    $('.filter-notification a').empty().append( "Hide Filters" );
                }
                else{
                    $('.works-filter-panel').slideUp();
                    $('.filter-notification a').empty().append( "Show Filters" );
                }
           }; 
        })( jQuery );
        $('.filter-notification a').on('click', function(){
            $().filterPanelTrigger();
        });
        //$('.works-filter-panel').on('mouseleave', function(){
            //$().filterPanelTrigger();
        //});
        $('.works-filter li a').on('click', function(){
            $('.works-filter li a').removeClass('filter-active');
            $(this).addClass('filter-active');
            $('html, body').animate({
                scrollTop: $("#works-container").offset().top-100
            }, 1000);
        });
        

        
//ISOTOPE
        
        //ISOTOPE GLOBALS
        var $container1 = $('.works-container');


        //ISOTOPE INIT
        $(window).load(function() {

           //checking if all images are loaded
            $container1.imagesLoaded( function() {

                //init isotope once all images are loaded
                $container1.isotope({
                    // options
                    itemSelector: '.works-item',
                    layoutMode: 'masonry',
                    transitionDuration: '0.8s'
                });


                //forcing a perfect masonry layout after initial load
                setTimeout(function() {
                $container1.isotope('layout');
                }, 100);


                // triggering filtering
                $('.works-filter li a').on('click', function() {
                    $('.works-filter li a').removeClass('active');
                    $(this).addClass('active');

                    var selector = $(this).attr('data-filter');
                    $('.works-container').isotope({
                        filter: selector
                    });
                    setTimeout(function() {
                        $container1.isotope('layout');
                    }, 700);
                    return false;
                });


                //Isotope ReLayout on Window Resize event.
                $(window).on('resize', function() {
                    $container1.isotope('layout');
                });

                //Isotope ReLayout on device orientation changes
                window.addEventListener("orientationchange", function() {
                    $container1.isotope('layout');
                }, false);

            });

        });




//VENOBOX
    $('.venobox, .image-lightbox-link').venobox({
        numeratio: true,
        infinigall: true
    });   
        

//CAROUSEL
 $(".project-carousel").owlCarousel({
                    loop:true,
                    margin:0,
                    dots:false,
                    nav:true,
                    navText: false,
                    responsive:{
                        0:{
                            items:1
                        },
                        600:{
                            items:1
                        },
                        1000:{
                            items:1
                        }
                    }
                });


 //PARALLAX
        //Initialize Each Parallax Layer  
        function parallaxInit() {
            $.stellar({
                positionProperty: 'transform'
            });
        }

        if (!device.tablet() && !device.mobile()) {

            //Activating Parallax effect if non-mobile device is detected
            $(window).bind('load', function() {
                parallaxInit();
            });


        } else {

            //Dectivate Parallax effect if mobile device is detected (bg image is displayed)
            $('.parallax, .parallax-layer').addClass('no-parallax');

        }   

    });
    // $(function ($)  : ends
})();
//  JSHint wrapper $(function ($)  : ends