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
const trackEl = $(".gallery-carousel__track");

const itemEls = $$(".gallery-carousel__item");

const prevBtnEl = $(".gallery-carousel__btn--prev");
const nextBtnEl = $(".gallery-carousel__btn--next");

const getNum = (string) => {
    return Number(string.slice(0, -2));
};
const style = window.getComputedStyle(viewportEl);

const minWidth = getNum(style.getPropertyValue("--item-width"));
const gap = getNum(style.getPropertyValue("--gap"));

let activeIndex = 0;

let itemWidth = minWidth;
let startIndex = 0;
let viewportWidth = viewportEl.clientWidth;
let itemsPerPage = Math.floor((viewportWidth + gap) / (minWidth + gap));

const handleChangeImg = () => {
    bigImgEl.src = itemEls[activeIndex].querySelector("img").src;

    $(".gallery-carousel__item--active").classList.remove(
        "gallery-carousel__item--active",
    );

    itemEls[activeIndex].classList.add("gallery-carousel__item--active");

    if (activeIndex < startIndex) startIndex -= 1;

    if (activeIndex > startIndex + itemsPerPage - 1) startIndex += 1;

    trackEl.style.transform = `translateX(${-startIndex * (itemWidth + gap) + "px"})`;

    if (activeIndex === 0)
        prevBtnEl.classList.add("gallery-carousel__btn--disable");
    else prevBtnEl.classList.remove("gallery-carousel__btn--disable");

    if (activeIndex === itemEls.length - 1)
        nextBtnEl.classList.add("gallery-carousel__btn--disable");
    else nextBtnEl.classList.remove("gallery-carousel__btn--disable");
};

itemEls.forEach((itemEl, index) => {
    itemEl.addEventListener("click", () => {
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
    if (activeIndex === itemEls.length - 1) return;
    activeIndex++;
    handleChangeImg();
});

const observe = new ResizeObserver((entries) => {
    viewportWidth = viewportEl.clientWidth;
    const newItemsPerPage = Math.floor(
        (viewportWidth + gap) / (minWidth + gap),
    );
    const totalGap = (newItemsPerPage - 1) * gap;

    itemWidth = (1 / newItemsPerPage) * (viewportWidth - totalGap);
    viewportEl.style.setProperty("--item-width", itemWidth + "px");

    if (
        startIndex != 0 &&
        itemsPerPage != newItemsPerPage &&
        activeIndex === startIndex + itemsPerPage - 1
    ) {
        startIndex += itemsPerPage - newItemsPerPage;
    }

    trackEl.style.transform = `translateX(${-startIndex * (itemWidth + gap) + "px"})`;

    itemsPerPage = newItemsPerPage;
});
observe.observe(viewportEl);

// handle drag for big img

let bigImgStartX = 0;
let bigImgIsPress = false;
let bigImgIsDrag = 0;

bigImgEl.addEventListener("pointerdown", (e) => {
    bigImgStartX = e.clientX;
    bigImgIsPress = true;
    bigImgEl.setPointerCapture(e.pointerId);
});

bigImgEl.addEventListener("pointermove", (e) => {
    if (!bigImgIsPress) return;
    const diff = e.clientX - bigImgStartX;
    if (Math.abs(diff) > 8) bigImgIsDrag = diff > 0 ? -1 : 1;
});

bigImgEl.addEventListener("pointerup", (e) => {
    bigImgIsPress = false;
    if (
        (activeIndex > 0 && bigImgIsDrag === -1) ||
        (activeIndex < itemEls.length - 1 && bigImgIsDrag === 1)
    ) {
        activeIndex += bigImgIsDrag;
        handleChangeImg();
        bigImgIsDrag = 0;
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

    trackEl.style.transition = "none";
    viewportEl.setPointerCapture(e.pointerId);
});

viewportEl.addEventListener("pointermove", (e) => {
    if (!isPress) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 8) isDrag = diff > 0 ? -1 : 1;

    trackEl.style.transform = `translateX(${-startIndex * (itemWidth + gap) + diff + "px"})`;
});

viewportEl.addEventListener("pointerup", (e) => {
    isPress = false;
    viewportEl.releasePointerCapture(e.pointerId);

    if (!isDrag) {
        const itemEl = downTarget.closest(".gallery-carousel__item");
        if (itemEl) itemEl.dispatchEvent(new Event("click"));
        return;
    }

    trackEl.style.transition = "all ease 0.6s";

    if (
        (activeIndex > 0 && isDrag === -1) ||
        (activeIndex < itemEls.length - 1 && isDrag === 1)
    ) {
        activeIndex += isDrag;
        handleChangeImg();
    } else {
        trackEl.style.transform = `translateX(${-startIndex * (itemWidth + gap) + "px"})`;
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

const summaryBtnEl = $(".summary-btn");

summaryBtnEl.addEventListener("click", () => {
    location.href = "#tabs";
});
