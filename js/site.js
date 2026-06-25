(function () {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const menu = document.querySelector("[data-nav-menu]");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const revealSelectors = [
        ".section-head",
        ".split > *",
        ".service-card",
        ".quality-card",
        ".career-card",
        ".contact-card",
        ".process-step",
        ".gallery-strip img",
        ".form-box",
        ".footer-grid > *",
        ".why-card",
        ".why-featured-card"
    ];

    body.classList.add("is-ready");

    if (menu) {
        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function (e) {
                if (link.classList.contains("dropdown-toggle")) {
                    return;
                }
                menu.classList.remove("open");
                if (header) {
                    header.classList.remove("nav-open");
                }
                if (navToggle) {
                    navToggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    const navClose = document.querySelector(".nav-close");

    function closeNav() {
        if (!menu || !header || !navToggle) return;
        menu.classList.remove("open");
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && menu) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.addEventListener("click", function () {
            const isOpen = menu.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            if (header) {
                header.classList.toggle("nav-open", isOpen);
            }
        });
    }

    if (navClose) {
        navClose.addEventListener("click", function () {
            closeNav();
        });
    }

    function setHeaderState() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    // Handle dropdown toggles on click (especially for mobile/tablet)
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parentLi = this.closest(".has-dropdown");
            const dropdownMenu = parentLi.querySelector(".dropdown-menu");

            if (parentLi && dropdownMenu) {
                const isOpen = parentLi.classList.contains("open");

                // Close other open dropdowns first
                document.querySelectorAll(".has-dropdown").forEach(function (li) {
                    if (li !== parentLi) {
                        li.classList.remove("open");
                        const menu = li.querySelector(".dropdown-menu");
                        if (menu) menu.classList.remove("open");
                        const t = li.querySelector(".dropdown-toggle");
                        if (t) t.setAttribute("aria-expanded", "false");
                    }
                });

                // Toggle this dropdown
                parentLi.classList.toggle("open", !isOpen);
                dropdownMenu.classList.toggle("open", !isOpen);
                this.setAttribute("aria-expanded", String(!isOpen));
            }
        });
    });

    // Close dropdowns and mobile nav when clicking outside
    document.addEventListener("click", function (e) {
        if (menu && menu.classList.contains("open") && !e.target.closest(".site-header")) {
            closeNav();
        }

        if (!e.target.closest(".has-dropdown")) {
            document.querySelectorAll(".has-dropdown").forEach(function (li) {
                li.classList.remove("open");
                const menu = li.querySelector(".dropdown-menu");
                if (menu) menu.classList.remove("open");
                const t = li.querySelector(".dropdown-toggle");
                if (t) t.setAttribute("aria-expanded", "false");
            });
        }
    });

    // Initialize Swiper.js hero banner slideshow
    const heroSwiperEl = document.querySelector(".hero-swiper");
    if (heroSwiperEl && typeof Swiper !== "undefined") {
        new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            speed: 1000,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.primary-banner .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.primary-banner .next',
                prevEl: '.primary-banner .prev',
            },
        });
    }

    // Initialize Swiper.js services slider
    const servicesTextEl = document.querySelector(".services-text-swiper");
    if (servicesTextEl && typeof Swiper !== "undefined") {
        const servicesThumbSwiper = new Swiper('.services-thumb-swiper', {
            loop: true,
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
            slideToClickedSlide: true
        });

        const servicesImageSwiper = new Swiper('.services-image-swiper', {
            loop: true,
            effect: 'fade',
            speed: 600,
            allowTouchMove: false
        });

        const servicesTextSwiper = new Swiper('.services-text-swiper', {
            loop: true,
            speed: 600,
            navigation: {
                nextEl: '.next-slide',
                prevEl: '.prev-slide',
            },
            thumbs: {
                swiper: servicesThumbSwiper
            },
            on: {
                slideChange: function () {
                    const currentIndexEl = document.querySelector('.services-index .current');
                    if (currentIndexEl) {
                        const realIndex = this.realIndex + 1;
                        currentIndexEl.textContent = realIndex < 10 ? '0' + realIndex : realIndex;
                    }
                }
            }
        });

        servicesTextSwiper.controller.control = servicesImageSwiper;
        servicesImageSwiper.controller.control = servicesTextSwiper;
    }

    const revealItems = document.querySelectorAll(revealSelectors.join(","));
    revealItems.forEach(function (item, index) {
        item.classList.add("reveal");
        item.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 10 + "ms");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("in-view");
        });
    }

    // Dynamic Desktop Video Lazy Loader
    const heroVideo = document.querySelector(".primary-banner-video");
    if (heroVideo) {
        if (window.innerWidth > 768) {
            const videoSource = heroVideo.querySelector("source");
            if (videoSource && videoSource.dataset.src) {
                videoSource.src = videoSource.dataset.src;
                heroVideo.load();
            }
        } else {
            // Remove video completely on mobile to prevent any loading overhead
            heroVideo.remove();
        }
    }

    // Cookie Consent Banner Injection
    if (!localStorage.getItem("cookieConsent")) {
        const cookieBanner = document.createElement("div");
        cookieBanner.className = "cookie-banner";
        cookieBanner.innerHTML = `
            <p>We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our cookie policy.</p>
            <div class="cookie-banner-actions">
                <button class="btn btn-outline" id="cookie-decline">Decline</button>
                <button class="btn btn-primary" id="cookie-accept">Accept</button>
            </div>
        `;
        document.body.appendChild(cookieBanner);

        setTimeout(function () {
            cookieBanner.classList.add("show");
        }, 1000);

        document.getElementById("cookie-accept").addEventListener("click", function () {
            localStorage.setItem("cookieConsent", "accepted");
            cookieBanner.classList.remove("show");
            setTimeout(function () { cookieBanner.remove(); }, 500);
        });

        document.getElementById("cookie-decline").addEventListener("click", function () {
            localStorage.setItem("cookieConsent", "declined");
            cookieBanner.classList.remove("show");
            setTimeout(function () { cookieBanner.remove(); }, 500);
        });
    }

    // Formspree AJAX handlers
    const contactForm = document.getElementById("contact-form");
    const careersForm = document.getElementById("careers-form");

    function setupFormspreeAjax(form) {
        if (!form) return;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const formData = new FormData(form);

            fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(function (response) {
                    if (response.ok) {
                        form.innerHTML = `
                        <div class="form-success-state" style="text-align: center; padding: 40px 20px;">
                            <div style="font-size: 48px; color: var(--gold); margin-bottom: 16px;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 style="margin: 0 0 10px; font-size: 22px; color: var(--ink);">Submission Successful!</h3>
                            <p style="color: var(--muted); margin: 0; font-size: 15px; line-height: 1.6;">
                                Thank you for reaching out. Our team will review your details and contact you shortly.
                            </p>
                        </div>
                    `;
                    } else {
                        response.json().then(function (data) {
                            throw new Error(data.errors ? data.errors.map(err => err.message).join(", ") : "Something went wrong.");
                        }).catch(function (err) {
                            showFormError(form, submitBtn, originalText, err.message || "Failed to submit. Please try again.");
                        });
                    }
                })
                .catch(function (error) {
                    showFormError(form, submitBtn, originalText, "Connection error. Please check your network and try again.");
                });
        });
    }

    function showFormError(form, btn, originalText, msg) {
        btn.disabled = false;
        btn.textContent = originalText;
        let errDiv = form.querySelector(".form-error-msg");
        if (!errDiv) {
            errDiv = document.createElement("div");
            errDiv.className = "form-error-msg";
            errDiv.style.cssText = "background: #fdf2f2; border: 1px solid #f8b4b4; color: #9b1c1c; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-top: 16px; text-align: center;";
            form.appendChild(errDiv);
        }
        errDiv.textContent = msg;
    }

    setupFormspreeAjax(contactForm);
    setupFormspreeAjax(careersForm);


    // --- Advanced Animation System --- //

    // 1. Hero Banner - Word Mask
    const heroTexts = document.querySelectorAll('.hero-swiper h2');
    heroTexts.forEach(h2 => {
        const words = h2.innerText.trim().split(' ');
        h2.innerHTML = '';
        words.forEach((word, index) => {
            const maskSpan = document.createElement('span');
            maskSpan.className = 'word-mask';
            const innerSpan = document.createElement('span');
            innerSpan.className = 'word-inner';
            innerSpan.textContent = word;
            innerSpan.style.transitionDelay = `${index * 120}ms`;
            maskSpan.appendChild(innerSpan);
            h2.appendChild(maskSpan);
            // Append space
            h2.appendChild(document.createTextNode(' '));
        });
    });

    // 2. Navigation Pill & Magnetic Links
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && window.innerWidth > 992) {
        const pill = document.createElement('div');
        pill.className = 'nav-pill';
        navMenu.appendChild(pill);

        const navLinks = navMenu.querySelectorAll('li > a:not(.dropdown-toggle)');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function (e) {
                navMenu.classList.add('has-active-pill');
                const rect = this.getBoundingClientRect();
                const parentRect = navMenu.getBoundingClientRect();
                pill.style.width = `${rect.width}px`;
                pill.style.left = `${rect.left - parentRect.left}px`;
            });

            // Magnetic
            link.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            link.addEventListener('mouseleave', function (e) {
                this.style.transform = 'translate(0px, 0px)';
            });
        });

        navMenu.addEventListener('mouseleave', () => {
            navMenu.classList.remove('has-active-pill');
        });
    }

    // 3. Number Flicker & Exponential Count-Up
    const countElements = document.querySelectorAll('.count-up');
    if (countElements.length > 0 && "IntersectionObserver" in window) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetStr = el.getAttribute('data-target');
                    const isRPSL = targetStr === 'RPSL';
                    const target = parseInt(targetStr, 10);
                    const duration = 2000; // 2s
                    let startTime = null;

                    // Random flicker phase (10ms)
                    let flickerInterval = setInterval(() => {
                        el.textContent = Math.floor(Math.random() * 999);
                    }, 50);

                    setTimeout(() => {
                        clearInterval(flickerInterval);
                        if (isNaN(target)) {
                            el.textContent = targetStr;
                            el.classList.add('flash-gold');
                            return;
                        }

                        // Exponential count up
                        const updateCount = (currentTime) => {
                            if (!startTime) startTime = currentTime;
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);

                            // exponential ease-out
                            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                            el.textContent = Math.floor(easeProgress * target);

                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                            } else {
                                el.textContent = target + (el.getAttribute('data-suffix') || '');
                                el.classList.add('flash-gold');
                                setTimeout(() => el.classList.remove('flash-gold'), 600);
                            }
                        };
                        requestAnimationFrame(updateCount);
                    }, 400);

                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0 });

        countElements.forEach(el => countObserver.observe(el));
    }

            // 4. 3D Card Tilt & Specular Highlight
    if (window.innerWidth > 992 && window.matchMedia("(pointer: fine)").matches) {
        const tiltCards = document.querySelectorAll('.service-card, .why-card-light, .why-feat-light');
        tiltCards.forEach(card => {
            if (card.classList.contains('why-card-light') || card.classList.contains('why-feat-light')) {
                const inner = document.createElement('div');
                inner.className = 'tilt-card-inner';
                while (card.firstChild) {
                    inner.appendChild(card.firstChild);
                }
                card.appendChild(inner);

                inner.style.background = '#ffffff';
                card.style.background = 'transparent';
                card.style.boxShadow = 'none';
                card.style.border = 'none';
                if (card.classList.contains('why-card-light')) {
                    inner.style.padding = '32px';
                    inner.style.border = '1px solid rgba(0,0,0,0.05)';
                    inner.style.borderRadius = '12px';
                    card.style.padding = '0';
                }
                if (card.classList.contains('why-feat-light')) {
                    inner.style.display = 'grid';
                    inner.style.gridTemplateColumns = '1fr 1fr';
                    inner.style.gap = '32px';
                    inner.style.alignItems = 'start';
                    inner.style.padding = '40px';
                    inner.style.border = '1px solid rgba(0,0,0,0.05)';
                    inner.style.borderRadius = '12px';
                    card.style.padding = '0';
                    card.style.display = 'block';
                }
            } else {
                card.classList.add('tilt-card');
                const inner = document.createElement('div');
                inner.className = 'tilt-card-inner';
                while (card.firstChild) {
                    inner.appendChild(card.firstChild);
                }
                card.appendChild(inner);
            }

            card.addEventListener('mousemove', function (e) {
                const inner = card.querySelector('.tilt-card-inner');
                if (!inner) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                inner.style.setProperty('--rotateX', `${rotateX}deg`);
                inner.style.setProperty('--rotateY', `${rotateY}deg`);
                inner.style.setProperty('--mouseX', `${(x / rect.width) * 100}%`);
                inner.style.setProperty('--mouseY', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', function () {
                const inner = card.querySelector('.tilt-card-inner');
                if (!inner) return;
                inner.style.setProperty('--rotateX', `0deg`);
                inner.style.setProperty('--rotateY', `0deg`);
            });
        });
    }

    // 5. Process Steps Chain
    const processSection = document.querySelector('.process');
    if (processSection && "IntersectionObserver" in window) {
        // Create SVG line
        const svgHTML = `<svg class="process-svg-line" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="0"/></svg>`;
        processSection.insertAdjacentHTML('afterbegin', svgHTML);

        const steps = processSection.querySelectorAll('.process-step');

        const processObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                processSection.classList.add('in-view');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('active');
                    }, 400 + (index * 300));
                });
                processObserver.unobserve(processSection);
            }
        }, { threshold: 0 });

        processObserver.observe(processSection);
    }

    // 6. Page Transition Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'nprogress-bar';
    document.body.appendChild(progressBar);

    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function (e) {
            if (e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (this.classList.contains('dropdown-toggle')) return;

            const url = this.getAttribute('href');
            if (url) {
                e.preventDefault();
                document.body.classList.add('is-leaving');
                progressBar.style.width = '70%';

                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 200);

                setTimeout(() => {
                    window.location.href = url;
                }, 400);
            }
        });
    });

    // 7. Parallax Gallery
    const galleryImages = document.querySelectorAll('.gallery-strip img');
    if (galleryImages.length > 0 && window.innerWidth > 768) {
        galleryImages.forEach(img => {
            const wrap = document.createElement('div');
            wrap.className = 'gallery-img-wrap';
            img.parentNode.insertBefore(wrap, img);
            wrap.appendChild(img);

            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = img.alt;
            wrap.appendChild(caption);
        });

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                galleryImages.forEach((img, index) => {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const multipliers = [0.05, 0.08, 0.12];
                        const multi = multipliers[index % multipliers.length];
                        const offset = (window.innerHeight - rect.top) * multi;
                        img.style.transform = `translateY(${offset}px)`;
                    }
                });
            });
        }, { passive: true });
    }

    // 8. WhatsApp Tooltip
    const whatsappBtn = document.querySelector('.sticky-actions .whatsapp');
    if (whatsappBtn && !sessionStorage.getItem('waTooltipShown')) {
        const tooltip = document.createElement('div');
        tooltip.className = 'fab-tooltip';
        tooltip.textContent = 'Need crew support?';
        whatsappBtn.appendChild(tooltip);

        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                tooltip.classList.add('show');
                sessionStorage.setItem('waTooltipShown', 'true');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 3000);
            }, 2000);
        }, { once: true });
    }

    // Advanced Update to Reveal Selectors
    const newRevealItems = document.querySelectorAll('.section-head, .split > *:first-child, .split > *:last-child, .service-card, .quality-card, .why-card, .why-card-light, [class*="reveal-tier-"], .reveal');
    if ("IntersectionObserver" in window) {
        const advObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    advObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

        newRevealItems.forEach(item => {
            if (item.classList.contains('section-head')) {
                item.classList.add('reveal-tier-1');
            } else if (item.classList.contains('service-card') || item.classList.contains('quality-card') || item.classList.contains('why-card') || item.classList.contains('why-card-light')) {
                item.classList.add('reveal-tier-2');
            } else if (!item.className.includes('reveal-tier-')) {
                item.classList.add('reveal-tier-3');
            }
            advObserver.observe(item);
        });
    }

    

})();



