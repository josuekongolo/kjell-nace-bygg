/**
 * KJELL NACE BYGG OG ANLEGGSERVICE
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ===========================================
    // DOM Elements
    // ===========================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // ===========================================
    // Mobile Navigation Toggle
    // ===========================================
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navList.querySelectorAll('.nav__link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===========================================
    // Header Scroll Effect
    // ===========================================
    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ===========================================
    // Smooth Scroll for Anchor Links
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // Contact Form Handling
    // ===========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form elements
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitText = document.getElementById('submitText');
            const submitLoading = document.getElementById('submitLoading');

            // Hide any previous messages
            if (formSuccess) formSuccess.classList.remove('show');
            if (formError) formError.classList.remove('show');

            // Show loading state
            submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline';

            // Collect form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                phone: contactForm.querySelector('#phone').value,
                address: contactForm.querySelector('#address').value || 'Ikke oppgitt',
                projectType: contactForm.querySelector('#projectType').value,
                description: contactForm.querySelector('#description').value,
                wantSiteVisit: contactForm.querySelector('#siteVisit').checked ? 'Ja' : 'Nei',
                timestamp: new Date().toISOString()
            };

            try {
                // For demo purposes, simulate API call
                // In production, replace with actual Resend API integration
                await simulateFormSubmission(formData);

                // Show success message
                if (formSuccess) {
                    formSuccess.classList.add('show');
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                if (formError) {
                    formError.classList.add('show');
                    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (submitLoading) submitLoading.style.display = 'none';
            }
        });
    }

    /**
     * Simulate form submission (replace with actual API call in production)
     * @param {Object} data - Form data
     * @returns {Promise}
     */
    function simulateFormSubmission(data) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data for debugging
                console.log('Form submitted:', data);

                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    /**
     * Send form data via Resend API
     * Uncomment and configure for production use
     *
     * @param {Object} data - Form data
     * @returns {Promise}
     */
    /*
    async function sendFormViaResend(data) {
        const RESEND_API_KEY = 'your-api-key-here';

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Kjell Nace Nettside <noreply@kjellnace.no>',
                to: ['post@kjellnace.no'],
                subject: `Ny henvendelse: ${data.projectType}`,
                html: `
                    <h2>Ny henvendelse fra nettsiden</h2>
                    <p><strong>Navn:</strong> ${data.name}</p>
                    <p><strong>E-post:</strong> ${data.email}</p>
                    <p><strong>Telefon:</strong> ${data.phone}</p>
                    <p><strong>Adresse/Område:</strong> ${data.address}</p>
                    <p><strong>Type prosjekt:</strong> ${data.projectType}</p>
                    <p><strong>Beskrivelse:</strong></p>
                    <p>${data.description}</p>
                    <p><strong>Ønsker befaring:</strong> ${data.wantSiteVisit}</p>
                    <hr>
                    <p><small>Sendt: ${new Date(data.timestamp).toLocaleString('nb-NO')}</small></p>
                `
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return response.json();
    }
    */

    // ===========================================
    // Form Validation Enhancements
    // ===========================================
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
        // Add validation styling on blur
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });

        // Remove error styling on input
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    // ===========================================
    // Phone Number Formatting
    // ===========================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters except spaces
            let value = e.target.value.replace(/[^\d\s]/g, '');

            // Limit length
            if (value.replace(/\s/g, '').length > 12) {
                value = value.slice(0, -1);
            }

            e.target.value = value;
        });
    }

    // ===========================================
    // Intersection Observer for Animations
    // ===========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.service-card, .value-card, .equipment-card, .why-us__item').forEach(function(el) {
        observer.observe(el);
    });

    // ===========================================
    // Click-to-Call Tracking (for analytics)
    // ===========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone click (replace with actual analytics)
            console.log('Phone click tracked:', this.href);

            // If using Google Analytics:
            // gtag('event', 'click', { event_category: 'contact', event_label: 'phone' });
        });
    });

    // ===========================================
    // Email Click Tracking (for analytics)
    // ===========================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track email click (replace with actual analytics)
            console.log('Email click tracked:', this.href);

            // If using Google Analytics:
            // gtag('event', 'click', { event_category: 'contact', event_label: 'email' });
        });
    });

    // ===========================================
    // Lazy Loading Images
    // ===========================================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const lazyLoad = function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        };

        const imageObserver = new IntersectionObserver(lazyLoad, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ===========================================
    // Console Branding
    // ===========================================
    console.log(
        '%c Kjell Nace Bygg og Anleggservice ',
        'background: #2C3E50; color: #E67E22; padding: 10px 20px; font-size: 14px; font-weight: bold;'
    );
    console.log(
        '%c Grunnarbeid og utomhus i Asker ',
        'background: #E67E22; color: white; padding: 5px 20px; font-size: 12px;'
    );

})();
