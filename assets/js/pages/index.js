const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// handle carousel
const nextBtnEl = $(".carousel__next");
const prevBtnEl = $(".carousel__prev");
const slideEl = $(".carousel__slide");
let activeIndex = 0;
const slides = [
    {
        name: "80Retros GB65",
        label: "Tối giản nhưng đầy nội lực",
        subTitle: "Gasket mount êm mượt",
        src: "./assets/imgs/banners/80Retros-GB65.webp",
    },
    {
        name: "QK Alice Duo",
        label: "Chuẩn custom, đúng chất chơi",
        subTitle: "Âm gõ trầm ấm, ổn định",
        src: "./assets/imgs/banners/QK-Alice-Duo.webp",
    },
    {
        name: "rainy 75",
        label: "Trải nghiệm gõ đỉnh cao",
        subTitle: "Tối giản-Chính xác-Đã tai",
        src: "./assets/imgs/banners/rainy-75.webp",
    },
    {
        name: "AM RGB 65 R1.5",
        label: "Gõ chuẩn từng phím",
        subTitle: "Gõ nhanh hơn, tập trung hơn",
        src: "./assets/imgs/banners/AM-RGB-65-R1.5.webp",
    },
];
const imgEl = slideEl.querySelector("img");
const titleEl = slideEl.querySelector(".carousel__title");
const subTitleEl = slideEl.querySelector(".carousel__sub-title");
const labelEl = slideEl.querySelector(".carousel__label");
const btnEls = slideEl.querySelectorAll(".carousel__btn");

let animations = [];
const loadSlide = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    imgEl.src = slides[activeIndex].src;
    titleEl.innerText = slides[activeIndex].name;
    subTitleEl.innerText = slides[activeIndex].subTitle;
    labelEl.innerText = slides[activeIndex].label;

    // animation
    const baseTiming = {
        duration: 550,
        fill: "forwards",
    };

    const textKeyframes = [
        { opacity: 0, transform: "scale(1.5) translateY(20px)" },
        { opacity: 1, transform: "scale(1) translateY(0)" },
    ];

    animations.push(labelEl.animate(textKeyframes, { ...baseTiming }));
    animations.push(
        subTitleEl.animate(textKeyframes, { ...baseTiming, delay: 150 }),
    );
    animations.push(
        titleEl.animate(textKeyframes, { ...baseTiming, delay: 300 }),
    );

    const imgKeyframes = [
        { opacity: 0, transform: "scale(0.7)" },
        { opacity: 1, transform: "scale(1)" },
    ];
    animations.push(
        imgEl.animate(imgKeyframes, {
            ...baseTiming,
            duration: 500,
            delay: 600,
        }),
    );

    btnEls.forEach((btnEl, index) => {
        animations.push(
            btnEl.animate(
                [
                    { opacity: 0, transform: "translateY(20px)" },
                    { opacity: 1, transform: "translateY(0)" },
                ],
                {
                    ...baseTiming,
                    delay: 800 + index * 100,
                },
            ),
        );
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
