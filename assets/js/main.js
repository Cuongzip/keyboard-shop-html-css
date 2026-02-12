const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
