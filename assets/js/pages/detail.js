const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// option
const radioEls = $$("input[type='radio']");

radioEls.forEach((radioEl) => {
    radioEl.addEventListener("change", () => {
        const labelEl = radioEl
            .closest(".product__group")
            .querySelector(".product__label span:last-child");

        labelEl.innerText = radioEl.dataset.option;
        if (!radioEl.dataset.index) return;

        activeIndex = radioEl.dataset.index;
        handleChangeImg();
    });
});

// gallery carousel
const bigImgEl = $(".product-detail__big-img img");
const viewportEl = $(".gallery-carousel__viewport");

const imgEls = $$(".gallery-carousel__img");
const firstItemEl = $(".gallery-carousel__item:first-child");

const prevBtnEl = $(".gallery-carousel__btn--prev");
const nextBtnEl = $(".gallery-carousel__btn--next");

let activeIndex = 0;
let imgWidth = firstItemEl.clientWidth;
let imgPerPage = Number((viewportEl.clientWidth / imgWidth).toFixed());
const handleChangeImg = () => {
    bigImgEl.src = imgEls[activeIndex].querySelector("img").src;
    const activeImgEls = $(".gallery-carousel__img--active");
    activeImgEls.classList.remove("gallery-carousel__img--active");
    imgEls[activeIndex].classList.add("gallery-carousel__img--active");

    const marginLeft = Number(firstItemEl.style.marginLeft.slice(0, -2));
    const start = Math.abs(marginLeft / imgWidth);
    const end = start + imgPerPage - 1;
    if (activeIndex < start) {
        firstItemEl.style.marginLeft =
            marginLeft + (start - activeIndex) * imgWidth + "px";
    }

    if (activeIndex > end) {
        firstItemEl.style.marginLeft =
            marginLeft + (end - activeIndex) * imgWidth + "px";
    }
};

imgEls.forEach((imgEl, index) => {
    imgEl.addEventListener("click", () => {
        activeIndex = index;
        handleChangeImg();
    });
});

prevBtnEl.addEventListener("click", () => {
    activeIndex--;
    if (activeIndex < 0) activeIndex = imgEls.length - 1;
    handleChangeImg();
});

nextBtnEl.addEventListener("click", () => {
    activeIndex++;
    if (activeIndex >= imgEls.length) activeIndex = 0;
    handleChangeImg();
});

const observe = new ResizeObserver((entries) => {
    const marginLeft = Number(firstItemEl.style.marginLeft.slice(0, -2));
    const newImgWidth = firstItemEl.clientWidth;
    const newImgPerPage = Number(
        (viewportEl.clientWidth / newImgWidth).toFixed(),
    );
    if (marginLeft != 0)
        firstItemEl.style.marginLeft =
            (marginLeft / imgWidth + (newImgPerPage - imgPerPage)) *
                newImgWidth +
            "px";

    imgWidth = newImgWidth;
    imgPerPage = newImgPerPage;
});
observe.observe(firstItemEl);
// quantity
const increaseEl = $(".quantity__btn--increase");
const decreaseEl = $(".quantity__btn--decrease");
const quantityInputEl = $(".quantity__input");

increaseEl.addEventListener("click", () => {
    let value = Number(quantityInputEl.value) + 1;
    if (value > 999) value = 1;
    quantityInputEl.value = value;
});
decreaseEl.addEventListener("click", () => {
    let value = Number(quantityInputEl.value) - 1;
    if (value < 1) value = 1;
    quantityInputEl.value = value;
});

// tab
const navItemEls = $$(".tabs__nav-item ");
navItemEls.forEach((navItemEl) => {
    navItemEl.addEventListener("click", () => {
        const activeTabEl = $(".tab--active");
        const navItemActiveEl = $(".tabs__nav-item--active");
        const tabEl = $(`.${navItemEl.dataset.tab}-tab`);
        activeTabEl.classList.remove("tab--active");
        navItemActiveEl.classList.remove("tabs__nav-item--active");
        tabEl.classList.add("tab--active");
        navItemEl.classList.add("tabs__nav-item--active");
    });
});
