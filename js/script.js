// --- Smooth Scroll (Lenis) ---
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- AOS Initialization ---
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true });
}

// --- Page Loader ---
window.addEventListener('load', function () {
    const loader = document.getElementById('loader-wrapper');
    const body = document.body;

    lenis.stop();

    if (loader) {
        const tl = gsap.timeline();

        tl.to(".loader-container", {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
        })
            .to(".loader-status-text", {
                y: 20,
                opacity: 0,
                duration: 0.3
            }, "-=0.3")
            .to(loader, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut"
            })
            .set(loader, { visibility: 'hidden' })
            .call(() => {
                body.classList.remove('loading');
                lenis.start();
            });
    }
});

setTimeout(() => {
    const loader = document.getElementById('loader-wrapper');
    const body = document.body;
    if (loader && loader.style.visibility !== 'hidden') {
        gsap.to(loader, { opacity: 0, visibility: 'hidden', duration: 0.5 });
        body.classList.remove('loading');
    }
}, 4000);

// --- Stacking Cards ---
gsap.registerPlugin(ScrollTrigger);
const cards = gsap.utils.toArray('.stack-card');

if (cards.length > 0) {
    const isDesktop = window.matchMedia("(min-width: 993px)").matches;

    if (isDesktop) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#different-section",
                start: "top top",
                end: () => `+=${cards.length * 100}%`,
                pin: true,
                scrub: 2,
                markers: false,
            }
        });

        cards.forEach((card, i) => {
            if (i > 0) {
                tl.from(card, {
                    yPercent: 100,
                    opacity: 0,
                    ease: "power2.out",
                    duration: 1,
                }, i * 0.8);
            }
        });
    } else {
        cards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }
}

// --- CTA Circle Effects ---
const ctaCircle = document.getElementById('cta-circle');
const ctaText = ctaCircle ? ctaCircle.querySelector('span') : null;
const ctaFill = ctaCircle ? ctaCircle.querySelector('.cta-fill-layer') : null;
const ctaGlow = ctaCircle ? ctaCircle.querySelector('.cta-glow-layer') : null;

if (ctaCircle && ctaText && ctaFill) {
    const proximityThreshold = 180;
    const magneticStrength = 0.4;

    const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
    idleTl.to(ctaCircle, {
        y: "-=8",
        duration: 2,
        ease: "sine.inOut"
    });

    window.addEventListener('mousemove', (e) => {
        const rect = ctaCircle.getBoundingClientRect();
        const circleCenterX = rect.left + rect.width / 2;
        const circleCenterY = rect.top + rect.height / 2;

        const distanceX = e.clientX - circleCenterX;
        const distanceY = e.clientY - circleCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < proximityThreshold) {
            idleTl.pause();

            const moveX = distanceX * magneticStrength;
            const moveY = distanceY * magneticStrength;

            const rotateX = (distanceY / proximityThreshold) * -20;
            const rotateY = (distanceX / proximityThreshold) * 20;

            const progress = 1 - (distance / proximityThreshold);
            const fillPercent = 100 - (progress * 100);

            gsap.to(ctaCircle, {
                x: moveX,
                y: moveY,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1 + (progress * 0.2),
                backgroundColor: "#316C6B",
                boxShadow: `0 ${20 + progress * 20}px ${40 + progress * 30}px rgba(49, 108, 107, ${0.1 + progress * 0.2})`,
                duration: 0.4,
                ease: "power2.out"
            });

            if (ctaGlow) {
                gsap.to(ctaGlow, {
                    scale: 1.5 + progress,
                    opacity: progress * 0.6,
                    duration: 0.4
                });
            }

            gsap.to(ctaFill, {
                background: `radial-gradient(circle, transparent ${fillPercent}%, #316C6B ${fillPercent}%)`,
                duration: 0.4,
                ease: "power2.out"
            });

            gsap.to(ctaText, {
                color: "#FFFFFF",
                scale: 1 + (progress * 0.1),
                z: 50,
                duration: 0.4
            });
        } else {
            idleTl.play();

            gsap.to(ctaCircle, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            });

            if (ctaGlow) {
                gsap.to(ctaGlow, {
                    scale: 1,
                    opacity: 0,
                    duration: 0.6
                });
            }

            gsap.to(ctaFill, {
                background: `radial-gradient(circle, transparent 100%, #316C6B 100%)`,
                duration: 0.6,
                ease: "power2.in"
            });
            gsap.to(ctaText, {
                color: "#316C6B",
                scale: 1,
                z: 0,
                duration: 0.7
            });
        }
    });
}

// --- Services Hover Effects ---
const serviceCards = document.querySelectorAll('.service-card');
const marqueeAnimations = new Map();

serviceCards.forEach((card, index) => {
    const btn = card.querySelector('.btn-learn-more');
    const originalText = btn.querySelector('.btn-original-text');
    const marqueeWrapper = btn.querySelector('.btn-marquee-wrapper');
    const marqueeText = btn.querySelector('.btn-marquee-text');

    card.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            color: "#F5C99A",
            duration: 0.4
        });

        gsap.to(originalText, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            onComplete: () => originalText.style.display = 'none'
        });

        marqueeWrapper.style.display = 'block';
        gsap.fromTo(marqueeWrapper, {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.1
        });

        const marqueeAnim = gsap.fromTo(marqueeText,
            { x: btn.offsetWidth },
            {
                x: -marqueeText.offsetWidth,
                duration: 3,
                ease: "none",
                repeat: -1
            }
        );
        marqueeAnimations.set(card, marqueeAnim);
    });

    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            backgroundColor: "#F5C99A",
            color: "#316C6B",
            duration: 0.3
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            backgroundColor: "#316C6B",
            color: "#F5C99A",
            duration: 0.3
        });
    });

    card.addEventListener('mouseleave', () => {
        const marqueeAnim = marqueeAnimations.get(card);
        if (marqueeAnim) marqueeAnim.kill();

        gsap.to(btn, {
            backgroundColor: "#316C6B",
            color: "#FFFFFF",
            duration: 0.4
        });

        gsap.to(marqueeWrapper, {
            y: 20,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                marqueeWrapper.style.display = 'none';
                gsap.set(marqueeText, { x: 0 });
            }
        });

        originalText.style.display = 'block';
        gsap.fromTo(originalText, {
            y: -20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.1
        });
    });
});

// --- Services Slider ---
const servicesSlider = document.getElementById('services-slider');
const paginationText = document.getElementById('service-pagination');

if (servicesSlider && paginationText) {
    let isAnimating = false;
    let currentIndex = 0;
    const cards = servicesSlider.querySelectorAll('.service-card');
    const totalCards = cards.length;

    let startX = 0;
    let isDragging = false;
    let scrollStartX = 0;
    let dragDistance = 0;

    const updateSlider = () => {
        isAnimating = true;
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const targetScroll = currentIndex * (cardWidth + gap);

        gsap.to(servicesSlider, {
            scrollLeft: targetScroll,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
                isAnimating = false;
            }
        });

        gsap.to(paginationText, {
            y: -15,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                paginationText.innerText = `${currentIndex + 1}/${totalCards}`;
                gsap.fromTo(paginationText, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
            }
        });
    };

    const onStart = (e) => {
        if (e.target.closest('.btn-learn-more')) return;

        isDragging = true;
        startX = (e.type === 'mousedown') ? e.clientX : e.touches[0].clientX;
        scrollStartX = servicesSlider.scrollLeft;
        dragDistance = 0;

        servicesSlider.style.cursor = 'grabbing';
        gsap.killTweensOf(servicesSlider);
        isAnimating = false;
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const x = (e.type === 'mousemove') ? e.clientX : e.touches[0].clientX;
        dragDistance = startX - x;

        gsap.to(servicesSlider, {
            scrollLeft: scrollStartX + dragDistance,
            duration: 0.1,
            ease: "none",
            overwrite: true
        });
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        servicesSlider.style.cursor = 'grab';

        const dragThreshold = 60;

        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0 && currentIndex < totalCards - 1) {
                currentIndex++;
            } else if (dragDistance < 0 && currentIndex > 0) {
                currentIndex--;
            }
        } else {
            const rect = servicesSlider.getBoundingClientRect();
            const clientX = (e.type === 'mouseup') ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
            const clickX = clientX - rect.left;
            const centerX = rect.width / 2;

            if (clickX > centerX) {
                if (currentIndex < totalCards - 1) currentIndex++;
                else currentIndex = 0;
            } else {
                if (currentIndex > 0) currentIndex--;
                else currentIndex = totalCards - 1;
            }
        }

        updateSlider();
    };

    servicesSlider.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    servicesSlider.addEventListener('touchstart', onStart, { passive: true });
    servicesSlider.addEventListener('touchmove', onMove, { passive: true });
    servicesSlider.addEventListener('touchend', onEnd, { passive: true });

    paginationText.innerText = `1/${totalCards}`;
}

// --- Footer Parallax ---
const footer = document.querySelector('footer');
const footerContent = footer ? footer.querySelectorAll('.footer-grid > div, .footer-main-btn-wrapper, .bottom-bar') : [];

if (footer) {
    const updateFooterSpace = () => {
        const footerHeight = footer.offsetHeight;
        document.querySelector('.support-banner-section').style.marginBottom = footerHeight + 'px';
    };

    window.addEventListener('resize', updateFooterSpace);
    updateFooterSpace();

    const footerTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".support-banner-section",
            start: "bottom bottom",
            end: "+=" + footer.offsetHeight,
            scrub: true,
        }
    });

    footerTl.fromTo(footer,
        { yPercent: -50, scale: 0.9, filter: "blur(10px)", opacity: 0 },
        { yPercent: 0, scale: 1, filter: "blur(0px)", opacity: 1, ease: "none" }
    );

    if (footerContent.length > 0) {
        footerTl.from(footerContent, {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        }, 0.1);
    }
}

// --- Global Reveal ---
const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
revealElements.forEach((el) => {
    const isScale = el.classList.contains('reveal-scale');
    gsap.from(el, {
        y: isScale ? 0 : 50,
        scale: isScale ? 0.9 : 1,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

const revealTitles = document.querySelectorAll('.reveal-title');
revealTitles.forEach((title) => {
    gsap.from(title, {
        y: 30,
        opacity: 0,
        skewY: 3,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
            trigger: title,
            start: "top 90%"
        }
    });
});

// --- Background Animations ---
gsap.to(".laptop-visual-absolute img, .cta-glow-layer", {
    y: 15,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".graphic-cart-service, .graphic-cart", {
    y: 15,
    rotation: 3,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// --- Clients Slider ---
const logosSlider = document.getElementById('logos-slider');
const prevLogos = document.getElementById('prev-logos');
const nextLogos = document.getElementById('next-logos');

if (logosSlider && prevLogos && nextLogos) {
    const getScrollAmount = () => {
        return logosSlider.clientWidth * 0.8;
    };

    nextLogos.addEventListener('click', () => {
        const amount = getScrollAmount();
        const maxScroll = logosSlider.scrollWidth - logosSlider.clientWidth;
        let target = logosSlider.scrollLeft + amount;
        if (target > maxScroll) target = maxScroll;

        gsap.to(logosSlider, {
            scrollLeft: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: updateArrows
        });
    });

    prevLogos.addEventListener('click', () => {
        const amount = getScrollAmount();
        let target = logosSlider.scrollLeft - amount;
        if (target < 0) target = 0;

        gsap.to(logosSlider, {
            scrollLeft: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: updateArrows
        });
    });

    function updateArrows() {
        const scrollLeft = logosSlider.scrollLeft;
        const maxScroll = logosSlider.scrollWidth - logosSlider.clientWidth;
        
        if (maxScroll <= 0) {
            prevLogos.style.display = 'none';
            nextLogos.style.display = 'none';
            return;
        } else {
            prevLogos.style.display = 'flex';
            nextLogos.style.display = 'flex';
        }

        prevLogos.style.opacity = scrollLeft <= 5 ? "0.3" : "1";
        prevLogos.style.cursor = scrollLeft <= 5 ? "default" : "pointer";
        
        nextLogos.style.opacity = scrollLeft >= maxScroll - 5 ? "0.3" : "1";
        nextLogos.style.cursor = scrollLeft >= maxScroll - 5 ? "default" : "pointer";
    }

    logosSlider.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 500);

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
        isDown = true;
        logosSlider.style.cursor = 'grabbing';
        startX = (e.pageX || e.touches[0].pageX) - logosSlider.offsetLeft;
        scrollLeft = logosSlider.scrollLeft;
    };

    const stopDrag = () => {
        isDown = false;
        logosSlider.style.cursor = 'grab';
    };

    const moveDrag = (e) => {
        if (!isDown) return;
        const x = (e.pageX || e.touches[0].pageX) - logosSlider.offsetLeft;
        const walk = (x - startX) * 2;
        logosSlider.scrollLeft = scrollLeft - walk;
    };

    logosSlider.addEventListener('mousedown', startDrag);
    logosSlider.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    logosSlider.addEventListener('mousemove', moveDrag);
    logosSlider.addEventListener('touchmove', moveDrag, { passive: true });
}

// --- Designs Slider ---
const designsSlider = document.getElementById('designs-slider');
const prevDesigns = document.getElementById('prev-designs');
const nextDesigns = document.getElementById('next-designs');

if (designsSlider && prevDesigns && nextDesigns) {
    const getScrollAmount = () => {
        return designsSlider.clientWidth;
    };

    nextDesigns.addEventListener('click', () => {
        const amount = getScrollAmount();
        const maxScroll = designsSlider.scrollWidth - designsSlider.clientWidth;
        let target = designsSlider.scrollLeft + amount;
        if (target > maxScroll) target = maxScroll;

        gsap.to(designsSlider, {
            scrollLeft: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: updateDesignArrows
        });
    });

    prevDesigns.addEventListener('click', () => {
        const amount = getScrollAmount();
        let target = designsSlider.scrollLeft - amount;
        if (target < 0) target = 0;

        gsap.to(designsSlider, {
            scrollLeft: target,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: updateDesignArrows
        });
    });

    function updateDesignArrows() {
        const scrollLeft = designsSlider.scrollLeft;
        const maxScroll = designsSlider.scrollWidth - designsSlider.clientWidth;
        
        if (maxScroll <= 0) {
            prevDesigns.style.display = 'none';
            nextDesigns.style.display = 'none';
            return;
        } else {
            prevDesigns.style.display = 'flex';
            nextDesigns.style.display = 'flex';
        }

        prevDesigns.style.opacity = scrollLeft <= 5 ? "0.3" : "1";
        prevDesigns.style.cursor = scrollLeft <= 5 ? "default" : "pointer";
        
        nextDesigns.style.opacity = scrollLeft >= maxScroll - 5 ? "0.3" : "1";
        nextDesigns.style.cursor = scrollLeft >= maxScroll - 5 ? "default" : "pointer";
    }

    designsSlider.addEventListener('scroll', updateDesignArrows);
    window.addEventListener('resize', updateDesignArrows);
    setTimeout(updateDesignArrows, 500);

    let isDownDesigns = false;
    let startXDesigns;
    let scrollLeftDesigns;

    const startDragDesigns = (e) => {
        isDownDesigns = true;
        designsSlider.style.cursor = 'grabbing';
        startXDesigns = (e.pageX || e.touches[0].pageX) - designsSlider.offsetLeft;
        scrollLeftDesigns = designsSlider.scrollLeft;
    };

    const stopDragDesigns = () => {
        isDownDesigns = false;
        designsSlider.style.cursor = 'grab';
    };

    const moveDragDesigns = (e) => {
        if (!isDownDesigns) return;
        const x = (e.pageX || e.touches[0].pageX) - designsSlider.offsetLeft;
        const walk = (x - startXDesigns) * 2;
        designsSlider.scrollLeft = scrollLeftDesigns - walk;
    };

    designsSlider.addEventListener('mousedown', startDragDesigns);
    designsSlider.addEventListener('touchstart', startDragDesigns, { passive: true });
    window.addEventListener('mouseup', stopDragDesigns);
    window.addEventListener('touchend', stopDragDesigns);
    designsSlider.addEventListener('mousemove', moveDragDesigns);
    designsSlider.addEventListener('touchmove', moveDragDesigns, { passive: true });
}

// --- Partners Scroll ---
const partnersTrack = document.querySelector('.slider-track');
if (partnersTrack) {
    const items = Array.from(partnersTrack.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        partnersTrack.appendChild(clone);
    });
}

// --- Moving Badge ---
const movingBadge = document.getElementById('moving-badge');
if (movingBadge) {
    gsap.to(movingBadge, {
        y: 20,
        x: 8,
        rotation: 2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

if (mobileMenuBtn && closeMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenuBtn.addEventListener('click', closeMenu);

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            closeMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });
}

// --- Navigation Toggle ---
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function (e) {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- Creative Steps ---
const stepCards = document.querySelectorAll('.step-reveal');
if (stepCards.length > 0) {
    gsap.from(stepCards, {
        scrollTrigger: {
            trigger: ".creative-steps",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        clearProps: "all"
    });
}
