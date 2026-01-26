window.addEventListener("scroll", () => {
    const headerEl = document.querySelector(".header");
    if (window.scrollY === 0) headerEl.classList.remove("header--box-shadow");
    else headerEl.classList.add("header--box-shadow");
});

const nextBtnEl = document.querySelector(".carousel__next");
const prevBtnEl = document.querySelector(".carousel__prev");
const slideEl = document.querySelector(".carousel__slide");
let activeIndex = 0;
const slides = [
    {
        name: "AM RGB 65 R1.5",
        src: "./img/banners/AM-RGB-65-R1.5.png",
    },
    {
        name: "Freya Ultra",
        src: "./img/banners/ice-ring-63-RT.png",
    },
    {
        name: "AM RGB 65 R1.5",
        src: "./img/banners/AM-RGB-65-R1.5.png",
    },
];
const loadSlide = () => {
    const imgEl = slideEl.querySelector("img");
    const titleEl = slideEl.querySelector(".carousel__title");
    imgEl.src = slides[activeIndex].src;
    titleEl.innerText = slides[activeIndex].name;
};

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
