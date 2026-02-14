const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const rangeEl = $(".range");
const processEl = $(".range__process");
const dotEls = $$(".range__dot");

const maxPriceEl = $("#max-price");
const minPriceEl = $("#min-price");
const maxPrice = Number(maxPriceEl.dataset.max);
const minPrice = Number(maxPriceEl.dataset.min);

const handleLimited = (e) => {
    const inputEl = e.target;
    let raw = inputEl.value.replace(/\D/g, "");
    if (!raw) {
        inputEl.value = "";
        return;
    }

    let value = Number(raw);

    if (value > maxPrice) value = maxPrice;
    if (value < minPrice) value = minPrice;

    inputEl.value = value.toLocaleString("de-DE");
};
maxPriceEl.addEventListener("input", handleLimited);
minPriceEl.addEventListener("input", handleLimited);

const getNum = (string) => {
    return Number(string.slice(0, -1));
};
dotEls.forEach((dotEl) => {
    let isDragging = false;
    let startX = 0;
    let left = 0;
    dotEl.addEventListener("pointerdown", (e) => {
        isDragging = true;
        dotEl.setPointerCapture(e.pointerId);
        startX = e.clientX;
        left = getNum(dotEl.style.left);
    });

    dotEl.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const percent = ((e.clientX - startX) / rangeEl.clientWidth) * 100;
        let newLeft = left + percent;
        if (newLeft > 100) newLeft = 100;
        if (newLeft < 0) newLeft = 0;

        dotEl.style.left = newLeft + "%";

        processEl.style.width =
            Math.abs(
                getNum(dotEls[0].style.left) - getNum(dotEls[1].style.left),
            ) + "%";

        const min = Math.min(
            getNum(dotEls[0].style.left),
            getNum(dotEls[1].style.left),
        );
        const max = Math.max(
            getNum(dotEls[0].style.left),
            getNum(dotEls[1].style.left),
        );
        processEl.style.left = min + "%";

        maxPriceEl.value = Math.floor(maxPrice * (max / 100)).toLocaleString(
            "de-DE",
        );
        minPriceEl.value = Math.floor(maxPrice * (min / 100)).toLocaleString(
            "de-DE",
        );
    });

    dotEl.addEventListener("pointerup", (e) => {
        isDragging = false;
        dotEl.releasePointerCapture(e.pointerId);
    });
});
