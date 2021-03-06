

$(".single-item").slick({
    mobileFirst: true,

    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },

        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],

    // prevArrow: '<div class=" btn shadow-lg rounded-pill prev-arrow">Previous</div>',
    // nextArrow: '<div class=" btn shadow-lg rounded-pill next-arrow">Next</div>'
});
$(".single-item-1").slick({
    mobileFirst: true,

    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },

        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],

    // prevArrow: '<div class=" btn shadow-lg rounded-pill prev-arrow">Previous</div>',
    // nextArrow: '<div class=" btn shadow-lg rounded-pill next-arrow">Next</div>'
});

const items = document.querySelectorAll(".animate_1");

const appearOptions = {
    threshold: 0.5,
    rootMargin: "-100px 0px 0px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fadeIn");
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

items.forEach((item) => {
    appearOnScroll.observe(item);
});
