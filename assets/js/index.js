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

    // add reveal class for visible products
    const cardsPerPage = Math.floor(
        productCarouselEl.clientWidth / (productWidth + productSpace),
    );
    for (let i = 0; i < cardsPerPage; i++) {
        trackEl.children[i].classList.add("reveal");
    }

    // handle event resize
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

// animation
const revealEls = $$(".reveal");

const intersectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            if (el.classList.contains("product")) {
                const siblings = [
                    ...el.parentElement.querySelectorAll(".product"),
                ];
                const index = siblings.indexOf(el);

                el.style.transitionDelay = `${index * 100}ms`;
            } else if (el.classList.contains("benefit")) {
                const siblings = [
                    ...el.parentElement.querySelectorAll(".benefit"),
                ];
                const index = siblings.indexOf(el);

                el.style.transitionDelay = `${index * 100}ms`;
            } else if (el.classList.contains("article")) {
                const siblings = [
                    ...el.parentElement.querySelectorAll(".article"),
                ];
                const index = siblings.indexOf(el);

                el.style.transitionDelay = `${index * 400}ms`;
            }
            el.classList.add("reveal--show");
            intersectionObserver.unobserve(el);
        });
    },
    { threshold: 0.2 },
);

revealEls.forEach((revealEl) => intersectionObserver.observe(revealEl));
