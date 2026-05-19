// --- Scroll to Top Feature ---
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- GSAP ScrollSmoother Initialization ---
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2, // مدة التمرير السلس لجعل الحركة فخمة وانسيابية جداً
    effects: true, // تفعيل تأثيرات Parallax و Speed
    smoothTouch: 0.1, 
});

// تحديث ScrollTrigger عند تغيير حجم النافذة لضمان دقة الحسابات
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});

// --- AOS Initialization ---
if (typeof AOS !== 'undefined') {
    AOS.init({ 
        duration: 1200, 
        once: true,
        easing: 'ease-out-quad'
    });
}

// --- Page Loader ---
window.addEventListener('load', function () {
    const loader = document.getElementById('loader-wrapper');
    const body = document.body;

    // إيقاف السكرول أثناء التحميل
    smoother.paused(true);

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
                // تشغيل السكرول بعد انتهاء التحميل
                smoother.paused(false);
                // تحديث الحسابات لضمان ظهور كل العناصر
                ScrollTrigger.refresh();
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
const cards = gsap.utils.toArray('.stack-card');

if (cards.length > 0) {
    const isDesktop = window.matchMedia("(min-width: 993px)").matches;

    if (isDesktop) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#different-section",
                start: "top 60px",
                end: () => `+=${cards.length * 250}%`, 
                pin: true,
                scrub: 1, // توازن بين السرعة والنعومة
                markers: false,
            }
        });

        // تحريك العنوان بنعومة وفخامة
        tl.to(".different-header-wrapper", {
            y: -80,
            opacity: 0,
            filter: "blur(15px)",
            duration: 1.5,
            ease: "power2.inOut"
        }, 0);

        cards.forEach((card, i) => {
            // حركة ظهور البطاقة: تبدأ شفافة تماماً وتصبح صلبة فوق البطاقة السابقة
            if (i > 0) {
                tl.fromTo(card, 
                    { 
                        yPercent: 120, // تبدأ من خارج الرؤية
                        opacity: 0, // شفافة تماماً عند البداية
                        scale: 0.9, // أصغر قليلاً
                        filter: "blur(10px)", // ضبابية خفيفة لمظهر ناعم
                    },
                    { 
                        yPercent: 0, 
                        opacity: 1, // تصبح صلبة تماماً
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 2, 
                        ease: "power3.out" // دخول انسيابي وفخم
                    }, 
                    i * 5 // توقيت الدخول
                );
            }

            // حركة كشف النص (الرفع للأعلى 230 بكسل) لتتمكن من القراءة بوضوح
            tl.to(card, {
                y: -230,
                duration: 2.5,
                ease: "none"
            }, i * 5 + 1.8); // تبدأ بعد أن تستقر البطاقة وتصبح واضحة تماماً

            // بقاء البطاقة السابقة ثابتة خلفها لتعزيز الاحترافية
            if (i < cards.length - 1) {
                tl.to(card, {
                    scale: 0.95,
                    opacity: 0.7,
                    filter: "blur(4px)",
                    duration: 2,
                    ease: "power2.inOut"
                }, (i + 1) * 5 - 0.5);
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

// --- Services Slider (Drag & Swipe) ---
const servicesSlider = document.getElementById('services-slider');
const paginationText = document.getElementById('service-pagination');

if (servicesSlider && paginationText) {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let rafID;

    const onStart = (e) => {
        // السماح بالنقر على الأزرار داخل البطاقة
        if (e.target.closest('.btn-learn-more')) return;

        isDragging = true;
        servicesSlider.classList.add('active');
        startX = (e.type === 'mousedown') ? e.pageX : e.touches[0].pageX;
        scrollLeft = servicesSlider.scrollLeft;
        
        cancelAnimationFrame(rafID);
        servicesSlider.style.cursor = 'grabbing';
        servicesSlider.style.userSelect = 'none';
    };

    const onMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.type === 'mousemove') ? e.pageX : e.touches[0].pageX;
        const walk = (x - startX) * 2; // سرعة السحب
        const prevScrollLeft = servicesSlider.scrollLeft;
        servicesSlider.scrollLeft = scrollLeft - walk;
        velocity = servicesSlider.scrollLeft - prevScrollLeft;
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        servicesSlider.classList.remove('active');
        servicesSlider.style.cursor = 'grab';
        servicesSlider.style.removeProperty('user-select');
        
        // تأثير القصور الذاتي (Momentum Scroll)
        applyMomentum();
        updatePagination();
    };

    const applyMomentum = () => {
        if (Math.abs(velocity) > 0.5) {
            servicesSlider.scrollLeft += velocity;
            velocity *= 0.95; // معامل الاحتكاك
            rafID = requestAnimationFrame(applyMomentum);
        }
    };

    const updatePagination = () => {
        const cardWidth = servicesSlider.querySelector('.service-card').offsetWidth + 40;
        const currentIndex = Math.round(servicesSlider.scrollLeft / cardWidth);
        const totalCards = servicesSlider.querySelectorAll('.service-card').length;
        
        gsap.to(paginationText, {
            y: -10,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                paginationText.innerText = `${currentIndex + 1}/${totalCards}`;
                gsap.to(paginationText, { y: 0, opacity: 1, duration: 0.3 });
            }
        });
    };

    servicesSlider.addEventListener('mousedown', onStart);
    servicesSlider.addEventListener('mousemove', onMove);
    servicesSlider.addEventListener('mouseup', onEnd);
    servicesSlider.addEventListener('mouseleave', onEnd);
    
    servicesSlider.addEventListener('touchstart', onStart, { passive: false });
    servicesSlider.addEventListener('touchmove', onMove, { passive: false });
    servicesSlider.addEventListener('touchend', onEnd);
}

// --- Footer Reveal Effect (Fixed Reveal) ---
const footer = document.querySelector('footer');
const footerSpacer = document.querySelector('.footer-reveal-spacer');

if (footer && footerSpacer) {
    const updateFooterSpace = () => {
        const footerHeight = footer.offsetHeight;
        // ضبط طول المساحة الشفافة لتكون بنفس طول الفوتر تماماً
        footerSpacer.style.height = footerHeight + 'px';
        
        // التأكد من أن الفوتر ثابت في الخلفية
        gsap.set(footer, { 
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 5,
            visibility: 'visible',
            opacity: 1
        });
        
        ScrollTrigger.refresh();
    };

    window.addEventListener('load', () => {
        setTimeout(updateFooterSpace, 300);
    });
    window.addEventListener('resize', updateFooterSpace);
    updateFooterSpace();
}

// --- Global Reveal ---
const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
revealElements.forEach((el) => {
    const isScale = el.classList.contains('reveal-scale');
    gsap.from(el, {
        y: isScale ? 0 : 60, // Slightly more movement (50 -> 60)
        scale: isScale ? 0.85 : 1, // More dramatic scale (0.9 -> 0.85)
        opacity: 0,
        duration: 1.5, // Reference site uses 1.5s
        ease: "power2.out", // Reference site uses power2.out
        scrollTrigger: {
            trigger: el,
            start: "top 88%", // Trigger slightly later for better flow
            toggleActions: "play none none none"
        }
    });
});

const revealTitles = document.querySelectorAll('.reveal-title');
revealTitles.forEach((title) => {
    gsap.from(title, {
        y: 40, // (30 -> 40)
        opacity: 0,
        skewY: 2, // Less skew for cleaner look (3 -> 2)
        duration: 1.8, // More elegant duration (1.5 -> 1.8)
        ease: "power3.out",
        scrollTrigger: {
            trigger: title,
            start: "top 92%"
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
        duration: 1.5,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all"
    });
}

// --- Magnetic CTA Circle Effect (psstudios style) ---
const ctaWrapper = document.querySelector('.cta-circle-wrapper');
if (ctaWrapper) {
    const ctaFill = ctaWrapper.querySelector('.cta-fill');
    const ctaText = ctaWrapper.querySelector('span');
    const proximityThreshold = 250; 
    const magneticStrength = 0.5; 

    ctaWrapper.addEventListener('mouseenter', (e) => {
        const rect = ctaWrapper.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        
        // ضبط المركز وتكبير الدائرة فوراً لتغطية كل المساحة
        gsap.set(ctaFill, {
            x: relX,
            y: relY,
            xPercent: -50,
            yPercent: -50,
            scale: 0
        });
        
        gsap.to(ctaFill, {
            scale: 2.5, // تكبير كافٍ لتغطية الدائرة مهما كان مكان الدخول
            duration: 0.5,
            ease: "power2.out",
            overwrite: true
        });
        
        gsap.to(ctaText, {
            color: "#FFFFFF",
            duration: 0.2
        });
    });

    window.addEventListener('mousemove', (e) => {
        const rect = ctaWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < proximityThreshold) {
            const moveX = distanceX * magneticStrength;
            const moveY = distanceY * magneticStrength;

            gsap.to(ctaWrapper, {
                x: moveX,
                y: moveY,
                duration: 0.4,
                ease: "power2.out"
            });

            // جعل التعبئة تتبع الفأرة بدقة داخل الدائرة
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            gsap.to(ctaFill, {
                x: relX,
                y: relY,
                duration: 0.3,
                ease: "power1.out"
            });

            gsap.to(ctaText, {
                x: moveX * 0.3,
                y: moveY * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        } else {
            gsap.to(ctaWrapper, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });

            gsap.to(ctaText, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        }
    });

    ctaWrapper.addEventListener('mouseleave', (e) => {
        const rect = ctaWrapper.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        
        // سحب اللون وتصغيره عند نقطة الخروج
        gsap.to(ctaFill, {
            x: relX,
            y: relY,
            scale: 0,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true
        });

        gsap.to(ctaText, {
            color: "#316C6B",
            duration: 0.3
        });
    });
}

// --- Title Click Animation ---
const animateTitles = document.querySelectorAll('.click-animate-title');

animateTitles.forEach(title => {
    // Split each span's text into letters
    const spans = title.querySelectorAll('span');
    spans.forEach(span => {
        const text = span.textContent;
        span.innerHTML = '';
        [...text].forEach(char => {
            const letter = document.createElement('span');
            letter.style.display = 'inline-block';
            letter.textContent = char === ' ' ? '\u00A0' : char;
            
            // إضافة حدث النقر لكل حرف على حدة
            letter.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // مصفوفة ألوان الهوية البصرية (ذهبي، تيل)
                const brandColors = ["#F5C99A", "#316C6B"];
                const randomColor = brandColors[Math.floor(Math.random() * brandColors.length)];
                
                // تأثير نبض الحرف وتغيير لونه
                gsap.to(letter, {
                    color: randomColor,
                    scale: 1.4,
                    y: -10,
                    duration: 0.4,
                    yoyo: true,
                    repeat: 1,
                    ease: "back.out(2)",
                    onStart: () => {
                        letter.classList.add('active-char');
                        letter.style.textShadow = 'none'; // إزالة الظل مؤقتاً لبروز اللون
                    },
                    onComplete: () => {
                        letter.classList.remove('active-char');
                        if (letter.closest('.title-stroke')) {
                            letter.style.textShadow = ''; // إعادة الظل للنص المفرغ
                        }
                    }
                });
            });
            
            span.appendChild(letter);
        });
    });

    title.addEventListener('click', () => {
        const letters = title.querySelectorAll('span span');
        
        // Reset any ongoing animations
        gsap.killTweensOf(letters);
        
        // Premium stagger animation
        gsap.fromTo(letters, 
            { 
                y: 0,
                rotate: 0,
                scale: 1
            }, 
            {
                y: -15,
                rotate: 10,
                scale: 1.2,
                duration: 0.4,
                stagger: {
                    amount: 0.4,
                    from: "center"
                },
                ease: "back.out(2)",
                onComplete: () => {
                    gsap.to(letters, {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: {
                            amount: 0.3,
                            from: "center"
                        },
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            }
        );
    });

    // إضافة أنيميشن عند الـ Hover ليعطي انطباعاً تفاعلياً فورياً
    title.addEventListener('mouseenter', () => {
        const letters = title.querySelectorAll('span span');
        gsap.killTweensOf(letters);
        gsap.fromTo(letters, 
            { y: 0, rotate: 0, scale: 1 }, 
            {
                y: -12,
                rotate: 8,
                scale: 1.15,
                duration: 0.4,
                stagger: {
                    amount: 0.3,
                    from: "start"
                },
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(letters, {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: {
                            amount: 0.2,
                            from: "start"
                        },
                        ease: "elastic.out(1, 0.4)"
                    });
                }
            }
        );
    });
});
