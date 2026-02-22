const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
        trackEl.children[i].dataset.delay = i * 150;
    }

    // handle event resize
    let activePage = 0;
    let oldCardsPerPage = 0;
    let focusedIndex = 0;
    let viewportWidth = 0;
    let countPage = 0;
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

    const resizeObserver = new ResizeObserver((entries) => {
        const cardsPerPage = Math.floor(
            productCarouselEl.clientWidth / (productWidth + productSpace),
        );

        countPage = Math.ceil(trackEl.childElementCount / cardsPerPage);

        if (oldCardsPerPage === cardsPerPage) return;

        viewportWidth = cardsPerPage * (productWidth + productSpace);
        viewportEl.style.width = viewportWidth - 14 + "px";

        activePage = Math.floor(focusedIndex / cardsPerPage);

        let html = "";
        for (let i = 0; i < countPage; i++) {
            html += `<li data-page="${i}" class="products-carousel__pagination-item ${i === activePage && " products-carousel__pagination-item--active"}"></li>`;
        }
        paginationEl.innerHTML = html;

        for (let dot of paginationEl.children) {
            dot.addEventListener("click", () =>
                changePage(Number(dot.getAttribute("data-page"))),
            );
        }

        trackEl.style.transform = `translateX(${-activePage * viewportWidth + "px"})`;

        oldCardsPerPage = cardsPerPage;
    });

    resizeObserver.observe(productCarouselEl);

    // handle drag

    let startX = 0;
    let isPress = false;
    let isDrag = 0;
    let translateX = 0;
    let downTarget = null;

    viewportEl.addEventListener("pointerdown", (e) => {
        downTarget = e.target;
        startX = e.clientX;
        isPress = true;
        trackEl.style.transition = "none";
        translateX = Number(
            window.getComputedStyle(trackEl).transform.split(",")[4],
        );
        viewportEl.setPointerCapture(e.pointerId);
    });

    viewportEl.addEventListener("pointermove", (e) => {
        if (!isPress) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 8) isDrag = diff > 0 ? -1 : 1;

        trackEl.style.transform = `translateX(${translateX + diff + "px"})`;
    });

    viewportEl.addEventListener("pointerup", (e) => {
        isPress = false;
        viewportEl.releasePointerCapture(e.pointerId);
        trackEl.style.transition = "all ease 0.6s";

        if (!isDrag) {
            const link = downTarget.closest("a");
            if (link) {
                link.click();
            }

            trackEl.style.transform = `translateX(${translateX + "px"})`;
            return;
        }
        if (
            (activePage >= countPage - 1 && isDrag === 1) ||
            (activePage <= 0 && isDrag === -1)
        ) {
            trackEl.style.transform = `translateX(${translateX + "px"})`;
        } else {
            let newActivePage = activePage + isDrag;
            changePage(newActivePage);
        }
        isDrag = 0;
    });
}
