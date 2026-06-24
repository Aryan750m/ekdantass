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
            link.addEventListener('mouseenter', function(e) {
                navMenu.classList.add('has-active-pill');
                const rect = this.getBoundingClientRect();
                const parentRect = navMenu.getBoundingClientRect();
                pill.style.width = `${rect.width}px`;
                pill.style.left = `${rect.left - parentRect.left}px`;
            });

            // Magnetic
            link.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            link.addEventListener('mouseleave', function(e) {
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
        }, { threshold: 0.5 });
        
        countElements.forEach(el => countObserver.observe(el));
    }

    // 4. 3D Card Tilt & Specular Highlight
    if (window.innerWidth > 992 && window.matchMedia("(pointer: fine)").matches) {
        const tiltCards = document.querySelectorAll('.service-card, .why-card');
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            const inner = document.createElement('div');
            inner.className = 'tilt-card-inner';
            while(card.firstChild) {
                inner.appendChild(card.firstChild);
            }
            card.appendChild(inner);

            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // +/- 8 deg
                const rotateY = ((x - centerX) / centerX) * 8;
                
                inner.style.setProperty('--rotateX', `${rotateX}deg`);
                inner.style.setProperty('--rotateY', `${rotateY}deg`);
                inner.style.setProperty('--mouseX', `${(x / rect.width) * 100}%`);
                inner.style.setProperty('--mouseY', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', function() {
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
        }, { threshold: 0.3 });
        
        processObserver.observe(processSection);
    }

    // 6. Page Transition Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'nprogress-bar';
    document.body.appendChild(progressBar);

    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
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
    const newRevealItems = document.querySelectorAll('.section-head, .split > *:first-child, .split > *:last-child, .service-card, .quality-card, .why-card');
    if ("IntersectionObserver" in window) {
        const advObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    advObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

        newRevealItems.forEach(item => {
            if (item.classList.contains('section-head')) {
                item.classList.add('reveal-tier-1');
            } else if (item.classList.contains('service-card') || item.classList.contains('quality-card') || item.classList.contains('why-card')) {
                item.classList.add('reveal-tier-2');
            } else {
                item.classList.add('reveal-tier-3');
            }
            advObserver.observe(item);
        });
    }

    // Disable default reveal logic for these items
    const oldReveals = document.querySelectorAll('.reveal');
    oldReveals.forEach(el => el.classList.remove('reveal'));


