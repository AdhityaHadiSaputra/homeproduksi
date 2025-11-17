// Dropdown menu functionality
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.closest('.dropdown');
        const isActive = dropdown.classList.contains('active');
        
        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.dropdown-icon').forEach(i => i.classList.remove('open'));
        
        // Toggle current dropdown
        if (!isActive) {
            dropdown.classList.add('active');
            this.querySelector('.dropdown-icon').classList.add('open');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && !e.target.closest('.dropdown-btn')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.dropdown-icon').forEach(i => i.classList.remove('open'));
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (mobileMenu && mobileMenuBtn && !e.target.closest('.nav-mobile') && !e.target.closest('.mobile-menu-btn')) {
        mobileMenu.classList.remove('active');
    }
});

// Slider functionality
let currentSlide = 0;
const totalSlides = 2;
let autoSlideInterval;

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAutoSlide();
}

function updateSlider() {
    for (let i = 0; i < totalSlides; i++) {
        const slide = document.getElementById(`slide${i}`);
        const slider = document.getElementById(`slider${i}`);
        const dot = document.querySelectorAll('.dot')[i];
        
        if (i === currentSlide) {
            if (slide) {
                slide.style.display = 'block';
                slide.classList.add('slide');
            }
            if (slider) {
                slider.style.opacity = '1';  // directly set opacity instead of relying on class
                slider.classList.add('active');
            }
            if (dot) dot.classList.add('active');
        } else {
            if (slide) slide.style.display = 'none';
            if (slider) {
                slider.style.opacity = '0';  // directly set opacity to hide
                slider.classList.remove('active');
            }
            if (dot) dot.classList.remove('active');
        }
    }
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Event listeners for slider
const sliderNext = document.getElementById('sliderNext');
const sliderPrev = document.getElementById('sliderPrev');

if (sliderNext) sliderNext.addEventListener('click', nextSlide);
if (sliderPrev) sliderPrev.addEventListener('click', prevSlide);

// Initialize slider on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateSlider();
        startAutoSlide();
    });
} else {
    updateSlider();
    startAutoSlide();
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
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active nav link highlighting
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .nav-desktop .nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === '/' && currentPage === '') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

updateActiveNavLink();

// Smooth number animation for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger animation when stats are in view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bigNumber = entry.target.querySelector('.big-number');
            if (bigNumber && !bigNumber.dataset.animated) {
                const text = bigNumber.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(bigNumber, number);
                    bigNumber.dataset.animated = 'true';
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

// Form validation dan submission handling
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]')?.value;
        const email = this.querySelector('input[name="email"]')?.value;
        const phone = this.querySelector('input[name="phone"]')?.value;
        const message = this.querySelector('textarea[name="message"]')?.value;
        
        if (name && email && phone && message) {
            // Redirect to WhatsApp dengan pesan
            const whatsappMessage = `Halo, saya ${name}\nEmail: ${email}\nTelepon: ${phone}\n\nPesan: ${message}`;
            const whatsappUrl = `https://wa.me/6282114984008?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
            alert('Terima kasih! Pesan Anda akan dikirim ke WhatsApp kami.');
        } else {
            alert('Mohon isi semua field yang tersedia');
        }
    });
}

// Responsive image loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

lazyLoadImages();

// Accessibility: Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        if (mobileMenu) mobileMenu.classList.remove('active');
    }
});

console.log('Sepuluh Sebelas - Vendor Kaos Custom. Website loaded successfully!');
