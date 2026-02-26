const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const quantityEls = $$(".quantity");

quantityEls.forEach((quantityEl) => {
    const increaseEl = quantityEl.querySelector(".quantity__btn--increase");
    const decreaseEl = quantityEl.querySelector(".quantity__btn--decrease");
    const inputEl = quantityEl.querySelector(".quantity__input");
    increaseEl.addEventListener("click", () => {
        let value = Number(inputEl.value) + 1;
        if (value > 999) value = 1;
        inputEl.value = value;
    });
    decreaseEl.addEventListener("click", () => {
        let value = Number(inputEl.value) - 1;
        if (value < 1) value = 1;
        inputEl.value = value;
    });
    inputEl.addEventListener("input", () => {
        inputEl.value = inputEl.value.replace(/\D/g, "");
    });
});
