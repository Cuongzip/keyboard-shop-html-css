const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// animation
const revealEls = $$(".reveal");

const intersectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            const delay = el.dataset.delay || 0;
            el.style.transitionDelay = delay + "ms";

            el.classList.add("reveal--show");
            intersectionObserver.unobserve(el);
        });
    },
    { threshold: 0.2 },
);

revealEls.forEach((revealEl) => intersectionObserver.observe(revealEl));
