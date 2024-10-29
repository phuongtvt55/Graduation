gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame method to GSAP's ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert time to milliseconds
    });

    // Disable lag smoothing in GSAP
    gsap.ticker.lagSmoothing(0);

    // Preload images to prevent layout shifts
    document.querySelectorAll(".img img").forEach(img => {
        const src = img.getAttribute("src");
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });

    const footer = document.querySelector(".footer");
    const lastCard = document.querySelector(".card.scroll");
    const pinnedSections = gsap.utils.toArray(".pinned");

    pinnedSections.forEach((section, index, sections) => {
        let img = section.querySelector(".img");
        let nextSection = sections[index + 1] || lastCard;
        let endScalePoint = `top+=${nextSection.offsetTop - section.offsetTop} top`;

        // Wrap animation in requestAnimationFrame to delay by one frame
        requestAnimationFrame(() => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: index === sections.length
                        ? `+=${lastCard.offsetHeight / 2}`
                        : footer.offsetTop - window.innerHeight,
                    pin: true,
                    pinSpacing: false,
                    scrub: 1
                }
            });

            // Scale and fade-out effect for each image
            gsap.fromTo(
                img,
                { scale: 1, opacity: 1 },
                {
                    scale: 0.5,
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: endScalePoint,
                        scrub: 1,
                    }
                }
            );

            // Hero text fade-out
            const hero = document.querySelector(".hero h1");
            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "+=400vh",
                scrub: 1,
                onUpdate: (self) => {
                    let opacityProgress = self.progress;
                    hero.style.opacity = 1 - opacityProgress;
                }
            });
        });
    });
});
