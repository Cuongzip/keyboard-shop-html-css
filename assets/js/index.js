const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// handle add box show for header
window.addEventListener("scroll", () => {
    const headerEl = $(".header");
    if (window.scrollY === 0) headerEl.classList.remove("header--box-shadow");
    else headerEl.classList.add("header--box-shadow");
});

// handle carousel
const nextBtnEl = $(".carousel__next");
const prevBtnEl = $(".carousel__prev");
const slideEl = $(".carousel__slide");
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

// handle product carousel
function getNum(string) {
    return Number(string.slice(0, -2));
}

const productCarouselEls = $$(".products-carousel");

for (let productCarouselEl of productCarouselEls) {
    const productEl = productCarouselEl.querySelector(".product");
    const viewportEl = productCarouselEl.querySelector(
        ".products-carousel__viewport",
    );
    const trackEl = productCarouselEl.querySelector(
        ".products-carousel__track",
    );
    const paginationEl = productCarouselEl.querySelector(
        ".products-carousel__pagination",
    );

    const style = window.getComputedStyle(productEl);

    const productWidth = getNum(style.getPropertyValue("--product-width"));

    const productSpace = getNum(style.getPropertyValue("--space"));

    let activePage = 0;
    let oldCardsPerPage = 0;
    let focusedIndex = 0;

    const resizeObserver = new ResizeObserver((entries) => {
        const cardsPerPage = Math.floor(
            productCarouselEl.clientWidth / (productWidth + productSpace),
        );

        const countPage = Math.ceil(trackEl.childElementCount / cardsPerPage);

        if (oldCardsPerPage === cardsPerPage) return;

        const viewportWidth = cardsPerPage * (productWidth + productSpace);
        viewportEl.style.width = viewportWidth - 14 + "px";

        activePage = Math.floor(focusedIndex / cardsPerPage);

        let html = "";
        for (let i = 0; i < countPage; i++) {
            html += `<li data-page="${i}" class="products-carousel__pagination-item ${i === activePage && " products-carousel__pagination-item--active"}"></li>`;
        }
        paginationEl.innerHTML = html;

        trackEl.style.transform = `translateX(${-activePage * viewportWidth + "px"})`;

        const changePage = (page) => {
            trackEl.style.transform = `translateX(${-page * viewportWidth + "px"})`;
            paginationEl.children[activePage].classList.remove(
                "products-carousel__pagination-item--active",
            );
            paginationEl.children[page].classList.add(
                "products-carousel__pagination-item--active",
            );
            activePage = page;
            focusedIndex = cardsPerPage * activePage;
        };

        for (let dot of paginationEl.children) {
            dot.addEventListener("click", () =>
                changePage(dot.getAttribute("data-page")),
            );
        }

        oldCardsPerPage = cardsPerPage;
    });

    resizeObserver.observe(productCarouselEl);
}
