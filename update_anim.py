import os

css_content = """
/* --- Disciplined Motion Animations --- */

/* 1. Fade-up reveals */
.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--reveal-delay, 0ms);
}
.reveal.in-view {
    opacity: 1;
    transform: translateY(0);
}

.reveal-fade {
    opacity: 0;
    transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--reveal-delay, 0ms);
}
.reveal-fade.in-view {
    opacity: 1;
}

.split > *:first-child.reveal {
    transform: translateX(-32px);
}
.split > *:first-child.reveal.in-view {
    transform: translateX(0);
}
.split > *:last-child.reveal {
    transform: translateX(32px);
}
.split > *:last-child.reveal.in-view {
    transform: translateX(0);
}

/* 2. Hover lifts on cards */
.why-card, .service-card, .quality-card {
    transition: transform 250ms ease, box-shadow 250ms ease;
}
.why-card:hover, .service-card:hover, .quality-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
.why-card .icon-wrapper i, .service-card-body i, .quality-card i {
    transition: color 250ms ease;
}
.why-card:hover .icon-wrapper i, .service-card:hover .service-card-body i, .quality-card:hover i {
    color: var(--primary);
}

.process-step {
    transition: border-left-color 250ms ease;
}
.process-step:hover {
    border-left-color: var(--primary);
}

/* 3. Ken Burns & Text fade on hero slides */
@keyframes kenBurns {
    0% { transform: scale(1); }
    100% { transform: scale(1.08); }
}
.swiper-slide.swiper-slide-active .img:not(.video) img {
    animation: kenBurns 6000ms ease-in-out forwards;
}

@keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
}
.swiper-slide-active .txt h2, .swiper-slide-active .txt .desc {
    animation: slideUpFade 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.swiper-slide .txt h2, .swiper-slide .txt .desc {
    opacity: 0;
}

/* 5. Shimmer sweep on .btn-primary */
.btn-primary {
    position: relative;
    overflow: hidden;
}
.btn-primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-20deg);
    transition: none;
}
.btn-primary:hover::after {
    animation: shimmer 600ms linear;
}
@keyframes shimmer {
    100% { left: 200%; }
}

/* 6. WhatsApp pulse ring */
@keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}
.sticky-actions .whatsapp {
    animation: pulseRing 3s infinite;
}

/* 7. Nav underline slide */
.nav-menu > li > a {
    position: relative;
}
.nav-menu > li > a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 250ms ease;
}
.nav-menu > li > a:hover::after, .nav-menu > li > a.active::after {
    width: 100%;
}

/* 8. Page fade transition */
body {
    opacity: 0;
    transition: opacity 200ms ease;
}
body.is-ready {
    opacity: 1;
}
body.is-leaving {
    opacity: 0;
}

/* 9. Header backdrop blur */
.site-header.is-scrolled {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.95);
}
"""

js_content = """
    // 4. Count-up on stats
    const countElements = document.querySelectorAll('.count-up');
    if (countElements.length > 0 && "IntersectionObserver" in window) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'), 10);
                    const duration = 1800; // ms
                    const startTime = performance.now();
                    
                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        
                        entry.target.textContent = Math.floor(easeProgress * target);
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.textContent = target + (entry.target.getAttribute('data-suffix') || '');
                        }
                    };
                    requestAnimationFrame(updateCount);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        countElements.forEach(el => countObserver.observe(el));
    }

    // 8. Page fade transition on click
    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            // Disable if modifier keys are pressed (e.g. open in new tab)
            if (e.ctrlKey || e.metaKey || e.shiftKey) return;
            // Exclude dropdown toggles
            if (this.classList.contains('dropdown-toggle')) return;
            
            const url = this.getAttribute('href');
            if (url) {
                e.preventDefault();
                document.body.classList.add('is-leaving');
                setTimeout(() => {
                    window.location.href = url;
                }, 200);
            }
        });
    });
"""

css_path = r"c:\Users\aryan\Desktop\Digital Daddy\Website\ekdantass\css\theme.css"
js_path = r"c:\Users\aryan\Desktop\Digital Daddy\Website\ekdantass\js\site.js"

with open(css_path, "a") as f:
    f.write(css_content)

with open(js_path, "r") as f:
    lines = f.readlines()

for i in range(len(lines)-1, -1, -1):
    if "})();" in lines[i]:
        lines.insert(i, js_content)
        break

with open(js_path, "w") as f:
    f.writelines(lines)

print("Done")
