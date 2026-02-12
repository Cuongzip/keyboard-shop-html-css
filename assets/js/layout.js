const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// handle add box show for header
window.addEventListener("scroll", () => {
    const headerEl = $(".header");
    if (window.scrollY === 0) headerEl.classList.remove("header--box-shadow");
    else headerEl.classList.add("header--box-shadow");
});
