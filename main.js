// WattWorks Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Contact Form – client-side validation, then let FormSubmit handle submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.name || !data.email || !data.message) {
                e.preventDefault();
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }

            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.email)) {
                e.preventDefault();
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            // If validation passes, let the form submit naturally to FormSubmit.co
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ──────────────────────────────────────────────
    // Cookie Consent Banner
    // ──────────────────────────────────────────────
    const COOKIE_KEY = 'wattworks_cookie_consent';

    function getCookieConsent() {
        return localStorage.getItem(COOKIE_KEY);
    }

    function setCookieConsent(value) {
        localStorage.setItem(COOKIE_KEY, value);
    }

    // Create cookie banner
    function createCookieBanner() {
        if (getCookieConsent()) return; // already decided

        const banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie-Einstellungen');
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <strong>🍪 Cookie-Einstellungen</strong>
                    <p>Wir verwenden technisch notwendige Cookies. Für die Einbindung von Google Maps benötigen wir Ihre Zustimmung.
                    <a href="datenschutz.html">Mehr erfahren</a></p>
                </div>
                <div class="cookie-actions">
                    <button id="cookieAccept" class="btn btn-primary btn-sm">Alle akzeptieren</button>
                    <button id="cookieDecline" class="btn btn-outline btn-sm">Nur notwendige</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Animate in
        requestAnimationFrame(() => {
            banner.classList.add('visible');
        });

        document.getElementById('cookieAccept').addEventListener('click', function () {
            setCookieConsent('all');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
            loadGoogleMaps();
        });

        document.getElementById('cookieDecline').addEventListener('click', function () {
            setCookieConsent('necessary');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        });
    }

    // ──────────────────────────────────────────────
    // Google Maps (only loaded with consent)
    // ──────────────────────────────────────────────
    function loadGoogleMaps() {
        const mapPlaceholders = document.querySelectorAll('.map-consent-placeholder');
        mapPlaceholders.forEach(placeholder => {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2720.123!2d15.4395!3d47.0707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDA0JzE0LjUiTiAxNcKwMjYnMjIuMiJF!5e0!3m2!1sde!2sat!4v1';
            iframe.width = '100%';
            iframe.height = '300';
            iframe.style.border = '0';
            iframe.style.borderRadius = 'var(--radius-lg)';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.title = 'WattWorks Standort auf Google Maps';
            placeholder.replaceWith(iframe);
        });
    }

    // Check consent and load maps if already accepted
    if (getCookieConsent() === 'all') {
        loadGoogleMaps();
    }

    // Show banner if no decision made yet
    createCookieBanner();

    // ──────────────────────────────────────────────
    // FAQ Accordion
    // ──────────────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(question => {
        question.addEventListener('click', function () {
            const item = this.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

});
