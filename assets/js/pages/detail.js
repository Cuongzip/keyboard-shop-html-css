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
let marginLeft = Number(firstItemEl.style.marginLeft.slice(0, -2));
let imgPerPage = Number((viewportEl.clientWidth / imgWidth).toFixed());

const handleChangeImg = () => {
    bigImgEl.src = imgEls[activeIndex].querySelector("img").src;
    const activeImgEls = $(".gallery-carousel__img--active");
    activeImgEls.classList.remove("gallery-carousel__img--active");
    imgEls[activeIndex].classList.add("gallery-carousel__img--active");

    const start = Math.abs(marginLeft / imgWidth);
    const end = start + imgPerPage - 1;

    if (activeIndex < start) marginLeft += (start - activeIndex) * imgWidth;

    if (activeIndex > end) marginLeft += (end - activeIndex) * imgWidth;

    firstItemEl.style.marginLeft = marginLeft + "px";

    if (activeIndex === 0)
        prevBtnEl.classList.add("gallery-carousel__btn--disable");
    else prevBtnEl.classList.remove("gallery-carousel__btn--disable");

    if (activeIndex === imgEls.length - 1)
        nextBtnEl.classList.add("gallery-carousel__btn--disable");
    else nextBtnEl.classList.remove("gallery-carousel__btn--disable");
};

imgEls.forEach((imgEl, index) => {
    imgEl.addEventListener("click", () => {
        activeIndex = index;
        handleChangeImg();
    });
});

prevBtnEl.addEventListener("click", () => {
    if (activeIndex === 0) return;
    activeIndex--;
    handleChangeImg();
});

nextBtnEl.addEventListener("click", () => {
    if (activeIndex === imgEls.length - 1) return;
    activeIndex++;
    handleChangeImg();
});

const observe = new ResizeObserver((entries) => {
    const newImgWidth = firstItemEl.clientWidth;
    const NewImgPerPage = Number(
        (viewportEl.clientWidth / newImgWidth).toFixed(),
    );

    const value =
        Math.abs(marginLeft / imgWidth) + imgPerPage - 1 == activeIndex &&
        NewImgPerPage != imgPerPage
            ? NewImgPerPage - imgPerPage
            : 0;

    marginLeft = (marginLeft / imgWidth + value) * newImgWidth;
    firstItemEl.style.marginLeft = marginLeft + "px";

    imgPerPage = NewImgPerPage;
    imgWidth = newImgWidth;
});
observe.observe(firstItemEl);

// handle drag for big img

let bigImgStartX = 0;
let bigImgIsPress = false;
let bigImgSsDrag = 0;

bigImgEl.addEventListener("pointerdown", (e) => {
    bigImgStartX = e.clientX;
    bigImgIsPress = true;
    bigImgEl.setPointerCapture(e.pointerId);
});

bigImgEl.addEventListener("pointermove", (e) => {
    if (!bigImgIsPress) return;
    const diff = e.clientX - bigImgStartX;
    if (Math.abs(diff) > 8) bigImgSsDrag = diff > 0 ? -1 : 1;
});

bigImgEl.addEventListener("pointerup", (e) => {
    bigImgIsPress = false;
    if (
        (activeIndex > 0 && bigImgSsDrag === -1) ||
        (activeIndex < imgEls.length - 1 && bigImgSsDrag === 1)
    ) {
        activeIndex += bigImgSsDrag;
        handleChangeImg();
        bigImgSsDrag = 0;
    }

    bigImgEl.releasePointerCapture(e.pointerId);
});

// handle drag for gallery

let startX = 0;
let isPress = false;
let isDrag = 0;
let downTarget = null;

viewportEl.addEventListener("pointerdown", (e) => {
    downTarget = e.target;
    startX = e.clientX;
    isPress = true;
    viewportEl.setPointerCapture(e.pointerId);
});

viewportEl.addEventListener("pointermove", (e) => {
    if (!isPress) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 8) isDrag = diff > 0 ? -1 : 1;

    firstItemEl.style.transition = "none";
    firstItemEl.style.marginLeft = marginLeft + diff + "px";
});

viewportEl.addEventListener("pointerup", (e) => {
    isPress = false;
    viewportEl.releasePointerCapture(e.pointerId);

    if (!isDrag) {
        const imgEL = downTarget.closest(".gallery-carousel__img");
        if (imgEL) imgEL.dispatchEvent(new Event("click"));
        return;
    }

    firstItemEl.style.transition = "all ease 0.6s";

    if (
        (activeIndex > 0 && isDrag === -1) ||
        (activeIndex < imgEls.length - 1 && isDrag === 1)
    ) {
        activeIndex += isDrag;
        handleChangeImg();
    } else {
        firstItemEl.style.marginLeft = marginLeft + "px";
    }
    isDrag = 0;
});
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
quantityInputEl.addEventListener("input", () => {
    quantityInputEl.value = quantityInputEl.value.replace(/\D/g, "");
});

// tabs
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
