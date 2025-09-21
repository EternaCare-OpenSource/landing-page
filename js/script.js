/**
 * @file script.js
 * @description Main client-side script for the CareLink landing page.
 * Handles mobile menu, language switching, and the testimonial carousel.
 * @author EternaCare Team
 */

document.addEventListener('DOMContentLoaded', function () {

    /**
     * ------------------------------------------------------------------------
     * MODULE: Mobile Menu
     * @description Handles the toggle functionality for the mobile navigation menu.
     * ------------------------------------------------------------------------
     */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    // Toggles the 'active' class on the navigation menu when the hamburger icon is clicked.
    mobileMenuBtn.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // Closes the mobile menu automatically when a navigation link is clicked.
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    /**
     * ------------------------------------------------------------------------
     * MODULE: Language Switcher (i18n)
     * @description Manages the internationalization of the page content.
     * ------------------------------------------------------------------------
     */
    // Verifies that the translation objects from en.js and es.js are available.
    if (typeof translationsEN === 'undefined' || typeof translationsES === 'undefined') {
        console.error("Translation files (en.js, es.js) are not loaded correctly.");
        return;
    }

    const translations = {
        en: translationsEN,
        es: translationsES
    };

    const languageSwitcher = document.getElementById('language-switcher');
    // Retrieves the saved language from localStorage, defaulting to English ('en').
    let currentLang = localStorage.getItem('language') || 'en';

    /**
     * Applies the selected language to all elements with a 'data-key' attribute.
     * @param {string} lang - The language code to apply ('en' or 'es').
     */
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('language', lang); // Saves user preference.

        document.documentElement.lang = lang; // Updates the lang attribute of the HTML tag.

        // Iterates over all translatable elements.
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                const value = translations[lang][key];
                // Updates placeholder for form elements, or textContent for others.
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Updates the text of the language switcher button.
        languageSwitcher.textContent = lang === 'en' ? 'ES' : 'EN';
    };

    // Adds a click event to the switcher button to toggle the language.
    languageSwitcher.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    });

    /**
     * ------------------------------------------------------------------------
     * MODULE: Testimonial Carousel
     * @description Controls the interactive testimonial slider.
     * ------------------------------------------------------------------------
     */
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const wrapper = slider.querySelector('.testimonial-wrapper');
        const testimonials = slider.querySelectorAll('.testimonial');
        const prevBtn = slider.parentElement.querySelector('.prev-btn');
        const nextBtn = slider.parentElement.querySelector('.next-btn');
        const dotsContainer = slider.parentElement.querySelector('.testimonial-dots');

        // Initializes the carousel only if there is more than one slide.
        if (testimonials.length > 1) {
            let currentIndex = 0;
            const totalSlides = testimonials.length;

            // Dynamically creates navigation dots for each testimonial.
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.dot');

            /**
             * Updates the carousel's visual state based on the current index.
             */
            const updateCarousel = () => {
                wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };

            // Event listener for the "next" button.
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });

            // Event listener for the "previous" button.
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });

            // Event listeners for the navigation dots.
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    currentIndex = parseInt(dot.dataset.index);
                    updateCarousel();
                });
            });
        }
    }

    /**
     * ------------------------------------------------------------------------
     * INITIALIZATION
     * @description Sets the initial language of the page upon loading.
     * ------------------------------------------------------------------------
     */
    setLanguage(currentLang);
});
