# =============================================================
# restore_durations.ps1
# Restores animation durations from 10ms back to proper values
# =============================================================

function Restore-CSS($path) {
    if (-not (Test-Path $path)) { Write-Host "SKIP (not found): $path"; return }
    $c = Get-Content $path -Raw -Encoding UTF8

    # ---- HERO / BANNER (4–8 seconds) ----
    # kenBurns / kenBurnsAdvanced: 8s (slow parallax zoom)
    $c = $c -replace 'animation: kenBurnsAdvanced 10ms', 'animation: kenBurnsAdvanced 8000ms'
    $c = $c -replace 'animation: kenBurns 10ms',         'animation: kenBurns 8000ms'

    # meshGradient CTA band: 8s looping gradient
    $c = $c -replace 'animation: meshGradient 10ms',     'animation: meshGradient 8000ms'

    # Hero curtain sliding panels: 1100ms (was 1.10ms — regex mangled it from 1100ms)
    $c = $c -replace 'transition: transform 1\.10ms cubic-bezier\(0\.77, 0, 0\.175, 1\)', 'transition: transform 1100ms cubic-bezier(0.77, 0, 0.175, 1)'
    $c = $c -replace 'transition: stroke-dashoffset 1\.10ms ease-in-out',                  'transition: stroke-dashoffset 1100ms ease-in-out'

    # breatheScale WhatsApp FAB: 2100ms (was 2.10ms — regex mangled it)
    $c = $c -replace 'animation: breatheScale 2\.10ms', 'animation: breatheScale 2100ms'

    # ---- HERO TEXT & ENTRY ANIMATIONS ----
    # hero-rise / panel-rise entry animations
    $c = $c -replace 'animation: hero-rise 10ms ease forwards 10ms',  'animation: hero-rise 700ms ease forwards 200ms'
    $c = $c -replace 'animation: panel-rise 10ms ease forwards 10ms', 'animation: panel-rise 700ms ease forwards 400ms'

    # Word-mask text reveal in hero slider
    $c = $c -replace 'transition: transform 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\), opacity 10ms ease;(\s*\}?\s*\.swiper-slide-active \.word-inner)', 'transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease;$1'

    # chart-wrap slide-in and its delay
    $c = $c -replace 'transition: transform 10ms cubic-bezier\(0\.34, 1\.56, 0\.64, 1\), opacity 10ms ease;', 'transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 700ms ease;'

    # slideUpFade text animation in hero
    $c = $c -replace 'animation: slideUpFade 10ms cubic-bezier', 'animation: slideUpFade 700ms cubic-bezier'

    # shimmer on btn-primary hover
    $c = $c -replace 'animation: shimmer 10ms linear', 'animation: shimmer 600ms linear'

    # filter/blur on hero slide images
    $c = $c -replace 'transition: filter 10ms ease;', 'transition: filter 800ms ease;'

    # ---- SCROLL REVEAL (600–800ms) ----
    # reveal-tier-1 (clip-path wipe from bottom)
    $c = $c -replace 'transition: clip-path 10ms cubic-bezier\(0\.77, 0, 0\.175, 1\);(\s*\}?\s*\.reveal-tier-1)', 'transition: clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1);$1'

    # reveal-tier-2 (fade + translate up)
    $c = $c -replace 'transition: opacity 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\), transform 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\);', 'transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);'

    # reveal-tier-3 (clip-path wipe from right)
    $c = $c -replace 'transition: clip-path 10ms cubic-bezier\(0\.77, 0, 0\.175, 1\);(\s*\}?\s*\.reveal-tier-3)', 'transition: clip-path 700ms cubic-bezier(0.77, 0, 0.175, 1);$1'
    # reveal-tier-3::after opacity fade + delay
    $c = $c -replace 'transition: opacity 10ms ease 10ms;', 'transition: opacity 400ms ease 600ms;'

    # Base .reveal (fade-up)
    $c = $c -replace 'transition: opacity 10ms ease, transform 10ms ease;(\s*transition-delay:)', 'transition: opacity 600ms ease, transform 600ms ease;$1'
    $c = $c -replace 'transition: opacity 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\), transform 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\);(\s*transition-delay:)', 'transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1);$1'
    $c = $c -replace 'transition: opacity 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\);(\s*transition-delay:)', 'transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1);$1'

    # stroke-dashoffset on icon SVG draw
    $c = $c -replace 'transition: stroke-dashoffset 10ms ease-in-out;', 'transition: stroke-dashoffset 1500ms ease-in-out;'

    # Process step fade-in
    $c = $c -replace '(\.process-step \{[^}]*?)transition: opacity 10ms ease, transform 10ms ease;', '$1transition: opacity 500ms ease, transform 500ms ease;'

    # Process SVG line draw
    # (covered by 1.10ms → 1100ms above)

    # nodePulse on process step activation
    $c = $c -replace 'animation: nodePulse 10ms ease-out;', 'animation: nodePulse 800ms ease-out;'

    # ---- LOOPING PULSE RINGS ----
    $c = $c -replace 'animation: callRing 10ms infinite',  'animation: callRing 1500ms infinite'
    $c = $c -replace 'animation: pulseRing 10ms infinite', 'animation: pulseRing 1500ms infinite'

    # ---- HOVER & INTERACTION (250–350ms) ----
    # Card hover (transform + box-shadow)
    $c = $c -replace 'transition: transform 10ms ease, box-shadow 10ms ease;', 'transition: transform 300ms ease, box-shadow 300ms ease;'

    # General "all" transitions
    $c = $c -replace 'transition: all 10ms ease;', 'transition: all 300ms ease;'
    $c = $c -replace 'transition: all 10ms cubic-bezier\(0\.4, 0, 0\.2, 1\);', 'transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);'
    $c = $c -replace 'transition: all 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\);', 'transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);'
    $c = $c -replace 'transition: all 10ms cubic-bezier\(0\.68, -0\.55, 0\.265, 1\.55\);', 'transition: all 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);'

    # Transform-only transitions
    $c = $c -replace 'transition: transform 10ms ease;', 'transition: transform 300ms ease;'
    $c = $c -replace 'transition: transform 10ms cubic-bezier\(0\.175, 0\.885, 0\.32, 1\.275\);', 'transition: transform 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);'
    $c = $c -replace 'transition: transform 10ms cubic-bezier\(0\.165, 0\.84, 0\.44, 1\);', 'transition: transform 350ms cubic-bezier(0.165, 0.84, 0.44, 1);'
    $c = $c -replace 'transition: transform 10ms linear;', 'transition: transform 300ms linear;'
    $c = $c -replace 'transition: transform 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\), opacity 10ms ease;', 'transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease;'

    # Tilt card (fast so mouse-tracking feels live)
    $c = $c -replace 'transition: transform 10ms linear, box-shadow 10ms linear;', 'transition: transform 80ms linear, box-shadow 80ms linear;'

    # Opacity transitions
    $c = $c -replace 'transition: opacity 10ms ease;', 'transition: opacity 300ms ease;'
    $c = $c -replace 'transition: opacity 10ms cubic-bezier\(0\.165, 0\.84, 0\.44, 1\), transform 10ms cubic-bezier\(0\.165, 0\.84, 0\.44, 1\);', 'transition: opacity 500ms cubic-bezier(0.165, 0.84, 0.44, 1), transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1);'

    # Color transitions
    $c = $c -replace 'transition: color 10ms ease;', 'transition: color 250ms ease;'
    $c = $c -replace 'transition: color 10ms ease, text-shadow 10ms ease;', 'transition: color 250ms ease, text-shadow 250ms ease;'
    $c = $c -replace 'transition: color 10ms ease, transform 10ms ease;', 'transition: color 250ms ease, transform 300ms ease;'

    # Compound transitions
    $c = $c -replace 'transition: background-color 10ms ease, color 10ms ease;', 'transition: background-color 300ms ease, color 300ms ease;'
    $c = $c -replace 'transition: background-color 10ms ease, backdrop-filter 10ms ease, border-bottom 10ms ease;', 'transition: background-color 300ms ease, backdrop-filter 300ms ease, border-bottom 300ms ease;'
    $c = $c -replace 'transition: transform 10ms ease, color 10ms ease;', 'transition: transform 300ms ease, color 250ms ease;'
    $c = $c -replace 'transition: transform 10ms ease, opacity 10ms ease;', 'transition: transform 300ms ease, opacity 300ms ease;'
    $c = $c -replace 'transition: opacity 10ms ease, transform 10ms ease;', 'transition: opacity 300ms ease, transform 300ms ease;'
    $c = $c -replace 'transition: gap 10ms ease;', 'transition: gap 300ms ease;'
    $c = $c -replace 'transition: width 10ms ease;', 'transition: width 300ms ease;'
    $c = $c -replace 'transition: width 10ms ease-out, opacity 10ms ease;', 'transition: width 300ms ease-out, opacity 300ms ease;'
    $c = $c -replace 'transition: bottom 10ms ease, transform 10ms ease;', 'transition: bottom 500ms ease, transform 500ms ease;'

    # Nav underline
    $c = $c -replace 'transition: width 10ms ease;(\s*\}?\s*\.nav-menu)', 'transition: width 300ms ease;$1'

    # Border-top colour on mobile cards
    $c = $c -replace 'transition: border-top-color 10ms ease;', 'transition: border-top-color 200ms ease;'

    # Gallery caption slide
    $c = $c -replace 'transition: transform 10ms ease;(\s*\}?\s*\.gallery-img-wrap)', 'transition: transform 300ms ease;$1'

    # Gallery img (parallax + hover clip)
    $c = $c -replace 'transition: transform 10ms linear, clip-path 10ms ease, transform 10ms ease;', 'transition: transform 300ms linear, clip-path 300ms ease;'

    # fab-tooltip
    $c = $c -replace 'transition: all 10ms cubic-bezier\(0\.16, 1, 0\.3, 1\);(\s*pointer-events)', 'transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);$1'

    # ---- REDUCED-MOTION BLOCK — keep effectively instant ----
    # animation-duration: 0.10ms → 0.01ms (near-zero, accessibility)
    $c = $c -replace 'animation-duration: 0\.10ms !important;', 'animation-duration: 0.01ms !important;'
    $c = $c -replace 'transition-duration: 0\.10ms !important;', 'transition-duration: 0.01ms !important;'

    # Hero curtain transition-delay
    $c = $c -replace '(transition: transform 1100ms cubic-bezier\(0\.77, 0, 0\.175, 1\);\s*)transition-delay: 10ms;', '$1transition-delay: 200ms;'

    # chart-wrap delay
    $c = $c -replace '(transition: transform 700ms cubic-bezier\(0\.34, 1\.56, 0\.64, 1\), opacity 700ms ease;\s*)transition-delay: 10ms;', '$1transition-delay: 200ms;'

    # hero-rise / panel-rise are handled above (forward delay folded into shorthand)

    Set-Content $path -Value $c -Encoding UTF8
    Write-Host "DONE: $path"
}

function Restore-JS($path) {
    if (-not (Test-Path $path)) { Write-Host "SKIP (not found): $path"; return }
    $c = Get-Content $path -Raw -Encoding UTF8

    # Word transition delays (index * 120ms is fine — keep as is, just in case)
    # Hero Swiper speed
    $c = $c -replace "'speed': 10,",    "'speed': 1000,"
    $c = $c -replace '"speed": 10,',    '"speed": 1000,'
    $c = $c -replace 'speed: 10,',      'speed: 600,'

    # autoplay delay
    $c = $c -replace 'delay: 10,', 'delay: 6000,'

    # process step stagger (was 400 + index*300 — restore)
    $c = $c -replace 'setTimeout\(\(\) => \{ step\.classList\.add\(''active''\); \}, 400 \+ \(index \* 300\)\)', "setTimeout(() => { step.classList.add('active'); }, 400 + (index * 300))"

    # setTimeout for page transition (was 400ms, was smashed to 10)
    $c = $c -replace 'setTimeout\(\(\) => \{ window\.location\.href = url; \}, 10\)', "setTimeout(() => { window.location.href = url; }, 400)"
    $c = $c -replace 'setTimeout\(\(\) => \{ progressBar\.style\.width = ''100%''; \}, 10\)', "setTimeout(() => { progressBar.style.width = '100%'; }, 200)"

    # Cookie banner show delay
    $c = $c -replace "setTimeout\(function \(\) \{ cookieBanner\.classList\.add\(""show""\); \}, 10\)", 'setTimeout(function () { cookieBanner.classList.add("show"); }, 1000)'

    # WhatsApp tooltip show/hide
    $c = $c -replace '}, 10\);\s*}, 10\)', "}, 3000);\n                }, 2000)"

    Set-Content $path -Value $c -Encoding UTF8
    Write-Host "DONE: $path"
}

# ---- Run ----
$base = Split-Path $MyInvocation.MyCommand.Path

Restore-CSS (Join-Path $base "css\theme.css")
Restore-CSS (Join-Path $base "animations.css")
Restore-CSS (Join-Path $base "advanced-animations.css")
Restore-JS  (Join-Path $base "js\site.js")
Restore-JS  (Join-Path $base "advanced-animations.js")

Write-Host ""
Write-Host "All durations restored. Refresh the browser to see the effect."
