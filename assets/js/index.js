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
        src: "./imgs/banners/AM-RGB-65-R1.5.png",
    },
    {
        name: "Freya Ultra",
        src: "./imgs/banners/ice-ring-63-RT.png",
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

const getNum = (string) => {
    return Number(string.slice(0, -2));
};
const productCarouselEl = document.querySelector(".products-carousel");
const productEl = document.querySelector(".product");
const viewportEl = document.querySelector(".products-carousel__viewport");
const trackEl = document.querySelector(".products-carousel__track");
const paginationEl = document.querySelector(".products-carousel__pagination");

const style = window.getComputedStyle(productEl);

const productWidth = getNum(style.getPropertyValue("--product-width"));

const productSpace = getNum(style.getPropertyValue("--space")) * 2;

let activePage = 0;

const changePage = (page, viewportWidth) => {
    trackEl.style.transform = `translateX(${-page * viewportWidth + "px"})`;

    paginationEl.children[activePage].classList.remove(
        "products-carousel__pagination-item--active",
    );
    paginationEl.children[page].classList.add(
        "products-carousel__pagination-item--active",
    );

    activePage = page;
};

const resizeObserver = new ResizeObserver((entries) => {
    const countProduct = Math.floor(
        productCarouselEl.clientWidth / (productWidth + productSpace),
    );
    const viewportWidth = countProduct * (productWidth + productSpace);
    viewportEl.style.width = viewportWidth + "px";

    const countPage = Math.ceil(trackEl.childElementCount / countProduct);

    let html = "";
    for (let i = 0; i < countPage; i++) {
        html += `<li onclick="changePage(${i}, ${viewportWidth})" class="products-carousel__pagination-item ${i === activePage && " products-carousel__pagination-item--active"}"></li>`;
    }
    paginationEl.innerHTML = html;
});

resizeObserver.observe(productCarouselEl);
