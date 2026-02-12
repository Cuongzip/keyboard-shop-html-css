const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// handle carousel
const nextBtnEl = $(".carousel__next");
const prevBtnEl = $(".carousel__prev");
const slideEl = $(".carousel__slide");
let activeIndex = 0;
const slides = [
    {
        name: "AM RGB 65 R1.5 ",
        label: "Tối giản nhưng đầy nội lực",
        subTitle: "Gasket mount êm mượt",
        src: "./assets/imgs/banners/3.png",
    },
    {
        name: "GINKGO65 PRO",
        label: "Chuẩn custom, đúng chất chơi",
        subTitle: "Âm gõ trầm ấm, ổn định",
        src: "./assets/imgs/banners/2.png",
    },
    {
        name: "AM RGB 65 R1.5 ",
        label: "Gõ chuẩn từng phím",
        subTitle: "Gõ nhanh hơn, tập trung hơn",
        src: "./assets/imgs/banners/3.png",
    },
];
const loadSlide = () => {
    const imgEl = slideEl.querySelector("img");
    const titleEl = slideEl.querySelector(".carousel__title");
    const subTitleEl = slideEl.querySelector(".carousel__sub-title");
    const labelEl = slideEl.querySelector(".carousel__label");
    const btnEls = slideEl.querySelectorAll(".carousel__btn");

    imgEl.src = slides[activeIndex].src;
    titleEl.innerText = slides[activeIndex].name;
    subTitleEl.innerText = slides[activeIndex].subTitle;
    labelEl.innerText = slides[activeIndex].label;

    // animation
    const scaleKeyframe = [
        {
            opacity: 0,
            transform: "scale(1.6)",
        },
        {
            opacity: 1,
            transform: " scale(1)",
        },
    ];
    const scaleTiming = {
        duration: 800,
        iterations: 1,
        fill: "forwards",
    };
    labelEl.animate(scaleKeyframe, { ...scaleTiming });
    subTitleEl.animate(scaleKeyframe, { ...scaleTiming });
    titleEl.animate(scaleKeyframe, { ...scaleTiming });

    const imgElKeyframe = [
        {
            opacity: 0,
            transform: "scale(0.5)",
        },
        {
            opacity: 1,
            transform: " scale(1)",
        },
    ];
    imgEl.animate(imgElKeyframe, { ...scaleTiming });

    btnEls.forEach((btnEl, index) => {
        const btnElKeyframe = [
            { opacity: 0 },
            {
                opacity: 0,
                offset: 0.4 + index / 10,
            },
            {
                opacity: 1,
            },
        ];
        btnEl.animate(btnElKeyframe, {
            ...scaleTiming,
        });
    });
};

window.addEventListener("load", loadSlide);

nextBtnEl.addEventListener("click", () => {
    activeIndex++;
    if (activeIndex > slides.length - 1) activeIndex = 0;
    loadSlide();
});
prevBtnEl.addEventListener("click", () => {
    activeIndex--;
    if (activeIndex < 0) activeIndex = slides.length - 1;
    loadSlide();
});

// scale carousel
const carouselEl = $(".carousel");
const carouselContentEl = $(".carousel__content");
const baseWidth = 1440;

const resizeObserverCarousel = new ResizeObserver((entries) => {
    let scale = Math.min(1, carouselEl.clientWidth / baseWidth);

    if (window.innerWidth <= 739) scale += 0.35;

    carouselContentEl.style.zoom = scale;
});

resizeObserverCarousel.observe(carouselEl);


