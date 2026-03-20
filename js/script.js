// ========== ASTI WEBSITE SCRIPT ==========

document.addEventListener('DOMContentLoaded', function() {
    updatePhilippineTime();
    setInterval(updatePhilippineTime, 1000);
    
    initSlider();
    initNavigation();
    initSearch();
    initScrollEffects();
    animateCounters();
    initLoadingAnimation();
});

// ========== PHILIPPINE TIME ==========
function updatePhilippineTime() {
    const timeElement = document.getElementById('philippine-time');
    if (!timeElement) return;
    
    const options = {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const formatter = new Intl.DateTimeFormat('en-PH', options);
    const time = formatter.format(new Date());
    const timeValue = timeElement.querySelector('.time-value');
    if (timeValue) timeValue.textContent = time;
}

// ========== SLIDER ==========
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// ========== NAVIGATION ==========
function initNavigation() {
    // Update location indicator based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== SEARCH ==========
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
    const scrollPrompt = document.querySelector('.scroll-prompt');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / maxScroll) * 100;
        
        if (scrollPrompt) {
            const line = scrollPrompt.querySelector('.scroll-line');
            if (line) {
                line.style.height = Math.max(20, 50 * (scrollPercent / 100)) + 'px';
            }
        }
        
        // Animate stat bars
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const bar = card.querySelector('.stat-bar');
                if (bar && !bar.style.width) {
                    bar.style.width = '100%';
                }
            }
        });
    });
    
    if (scrollPrompt) {
        scrollPrompt.addEventListener('click', () => {
            window.scrollTo({
                top: window.scrollY + window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        });
    }
}

// ========== ANIMATED COUNTERS ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(
                    counter.id === 'projects-count' ? '47' :
                    counter.id === 'researchers-count' ? '156' :
                    counter.id === 'facilities-count' ? '23' : '0'
                );
                
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 30);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========== LOADING ANIMATION ==========
function initLoadingAnimation() {
    const loader = document.querySelector('.loading-indicator');
    if (!loader) return;
    
    let percent = 0;
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 10) + 5;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            
            loader.textContent = '- SYSTEM READY -';
            
            setTimeout(() => {
                loader.style.transition = 'opacity 0.5s';
                loader.style.opacity = '0';
                
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        } else {
            loader.textContent = `- LOADING ${percent}% -`;
        }
    }, 50);
}

// ========== RESIZE HANDLER ==========
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize slider on resize if needed
        initSlider();
    }, 250);
});
