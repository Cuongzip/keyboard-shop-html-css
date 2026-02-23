const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function getNum(string) {
    return Number(string.slice(0, -2));
}

const productCarouselEls = $$(".products-carousel");

for (let productCarouselEl of productCarouselEls) {
    const viewportEl = productCarouselEl.querySelector(
        ".products-carousel__viewport",
    );
    const trackEl = productCarouselEl.querySelector(
        ".products-carousel__track",
    );
    const paginationEl = productCarouselEl.querySelector(
        ".products-carousel__pagination",
    );

    const style = window.getComputedStyle(productCarouselEl);

    const gap = getNum(style.getPropertyValue("--gap"));
    const minWidth = getNum(style.getPropertyValue("--product-width"));

    // handle event resize
    let activePage = 0;
    let focusedIndex = 0;
    let countPage = 0;
    let viewportWidth = 0;
    let cardsPerPage = 0;

    const changePage = (page) => {
        trackEl.style.transform = `translateX(${-page * (viewportWidth + gap) + "px"})`;
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
        viewportWidth = viewportEl.clientWidth;

        const newCardsPerPage = Math.floor(
            (viewportWidth + gap) / (minWidth + gap),
        );
        const totalGap = (newCardsPerPage - 1) * gap;

        const productWidth = (1 / newCardsPerPage) * (viewportWidth - totalGap);

        productCarouselEl.style.setProperty(
            "--product-width",
            productWidth + "px",
        );

        countPage = Math.ceil(trackEl.childElementCount / newCardsPerPage);
        trackEl.style.transform = `translateX(${-activePage * (viewportWidth + gap) + "px"})`;

        if (cardsPerPage === newCardsPerPage) return;

        activePage = Math.floor(focusedIndex / newCardsPerPage);

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

        cardsPerPage = newCardsPerPage;
    });

    resizeObserver.observe(productCarouselEl);
    // add reveal class for visible products
    const cardsPerPage_ = Math.floor(
        (viewportEl.clientWidth + gap) / (minWidth + gap),
    );

    for (let i = 0; i < cardsPerPage_; i++) {
        trackEl.children[i].classList.add("reveal");
        trackEl.children[i].dataset.delay = i * 150;
    }

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
        trackEl.style.transition = "transform ease 0.6s";

        if (!isDrag) {
            if (e.which === 1) {
                const link = downTarget.closest("a");
                if (link) {
                    link.click();
                }
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
            changePage(activePage + isDrag);
        }
        isDrag = 0;
    });
}
