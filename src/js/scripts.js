$(document).ready(function(){

  $('.specialists__slider').owlCarousel({
    loop:false,
    nav:true,
    dots: false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
            loop:false
        }
    }
})


});