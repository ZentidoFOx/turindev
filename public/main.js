/*
 * Turin.dev - Main JavaScript File
 * Handles all interactive functionality for the website
 * GSAP scripts are loaded via CDN in Layout.astro
 */

// ==========================================
// TABLE OF CONTENTS
// ==========================================
// 1. UTILITY FUNCTIONS
// 2. HEADER FUNCTIONALITY  
// 3. CURSOR GLOW EFFECT
// 4. GSAP ANIMATION SYSTEM
// 5. PORTFOLIO FUNCTIONALITY - GSAP POWERED
// 6. TESTIMONIALS FUNCTIONALITY - GSAP POWERED
// 7. CONTACT FORM FUNCTIONALITY
// 8. INITIALIZATION

// ==========================================
// 1. UTILITY FUNCTIONS
// ==========================================

// DOM Utilities
const DOM = {
  // Safe element selection with optional parent
  select: (selector, parent = document) => parent.querySelector(selector),
  selectAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector)),
  
  // Check if element exists
  exists: (selector, parent = document) => !!parent.querySelector(selector),
  
  // Add event listener with cleanup tracking
  on: (element, event, handler, options = {}) => {
    if (!element) return null;
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },
  
  // Toggle class utility
  toggleClass: (element, className, condition) => {
    if (!element) return;
    element.classList.toggle(className, condition);
  },
  
  // Set multiple styles at once
  setStyles: (element, styles) => {
    if (!element || !styles) return;
    Object.assign(element.style, styles);
  }
};

// Animation Utilities
const AnimUtils = {
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport: (element, threshold = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
  }
};

// GSAP Utilities
const GSAPUtils = {
  // Check if GSAP is available
  isAvailable: () => typeof gsap !== 'undefined',
  
  // Safe GSAP set with fallback
  safeSet: (target, props) => {
    if (GSAPUtils.isAvailable()) {
      gsap.set(target, props);
    }
  },
  
  // Safe GSAP animation with fallback
  safeAnimate: (target, props, fallback = null) => {
    if (GSAPUtils.isAvailable()) {
      return gsap.to(target, props);
    } else if (fallback) {
      fallback();
    }
    return null;
  },
  
  // Kill animation safely
  safeKill: (animation) => {
    if (animation && animation.kill) {
      animation.kill();
    }
  }
};


// ==========================================
// 2. HEADER FUNCTIONALITY
// ==========================================
function initHeader() {
  const header = DOM.select("#main-header");
  const toggleButton = DOM.select("#header-navbar-toggle");
  const navbar = DOM.select("#header-navbar");
  const overlay = DOM.select("#mobile-overlay");
  let lastScrollY = window.scrollY;

  // Optimized scroll handler with throttling
  const handleScroll = AnimUtils.throttle(() => {
    const currentScrollY = window.scrollY;
    DOM.toggleClass(header, "header-scrolled", currentScrollY > 50);
    lastScrollY = currentScrollY;
  }, 16); // ~60fps

  const setMenuState = (isOpen) => {
    if (!toggleButton || !navbar) return;

    toggleButton.setAttribute("aria-expanded", isOpen.toString());
    navbar.setAttribute("data-open", isOpen.toString());
    
    if (overlay) {
      if (isOpen) {
        DOM.setStyles(overlay, { display: "block" });
        setTimeout(() => DOM.setStyles(overlay, { opacity: "1" }), 10);
      } else {
        DOM.setStyles(overlay, { opacity: "0" });
        setTimeout(() => DOM.setStyles(overlay, { display: "none" }), 300);
      }
    }
  };

  const openMobileMenu = () => setMenuState(true);
  const closeMobileMenu = () => setMenuState(false);

  const toggleMobileMenu = () => {
    if (!toggleButton) return;
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    isExpanded ? closeMobileMenu() : openMobileMenu();
  };

  // Event listeners with cleanup tracking
  const cleanupFunctions = [
    DOM.on(overlay, "click", closeMobileMenu),
    DOM.on(toggleButton, "click", toggleMobileMenu),
    DOM.on(window, "scroll", handleScroll, { passive: true }),
    DOM.on(window, "resize", AnimUtils.debounce(() => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    }, 250))
  ].filter(Boolean);

  // Close menu when clicking mobile links
  DOM.selectAll("a", navbar).forEach(link => {
    cleanupFunctions.push(
      DOM.on(link, "click", () => {
        if (window.innerWidth < 768) {
          closeMobileMenu();
        }
      })
    );
  });

  // Initialize scroll state
  handleScroll();

  // Return cleanup function for potential use
  return () => cleanupFunctions.forEach(cleanup => cleanup && cleanup());
}

// ==========================================
// 3. CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
  const cursorGlow = DOM.select('#cursor-glow');
  
  if (!cursorGlow) return;
  
  // Only activate on devices with cursor (not touch)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;

  // Optimized mouse move handler with throttling
  const handleMouseMove = AnimUtils.throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isMoving) {
      isMoving = true;
      DOM.setStyles(cursorGlow, { opacity: '1' });
    }
    
    // Use transform for better performance
    DOM.setStyles(cursorGlow, {
      transform: `translate(${mouseX - 250}px, ${mouseY - 250}px)`
    });
  }, 16); // ~60fps

  // Hide glow when mouse leaves
  const handleMouseLeave = () => {
    isMoving = false;
    DOM.setStyles(cursorGlow, { opacity: '0' });
  };

  // Event listeners
  return [
    DOM.on(document, 'mousemove', handleMouseMove),
    DOM.on(document, 'mouseleave', handleMouseLeave)
  ].filter(Boolean);
}

// ==========================================
// 4. PORTFOLIO FUNCTIONALITY - GSAP POWERED
// ==========================================
function initGSAPPortfolio() {
  const tabButtons = DOM.selectAll('.portfolio-tab');
  const projectItems = DOM.selectAll('.portfolio-item');
  const grid = DOM.select('.projects-grid');
  
  if (!tabButtons.length || !projectItems.length || !grid) return;
  
  // GSAP filter function with layout reorganization
  const filterProjects = (filter) => {
    // Get items to show/hide
    const itemsToHide = projectItems.filter(item => {
      if (filter === '*') return false;
      return !item.classList.contains(filter.replace('.', ''));
    });
    
    const itemsToShow = projectItems.filter(item => {
      if (filter === '*') return true;
      return item.classList.contains(filter.replace('.', ''));
    });
    
    // Create GSAP timeline for smooth filtering
    const tl = gsap.timeline();
    
    // First, animate out all items
    tl.to(projectItems, {
      opacity: 0,
      y: 30,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.inOut",
      stagger: 0.03
    });
    
    // Then reorganize the DOM and animate in visible items
    tl.call(() => {
      // Hide filtered out items completely
      itemsToHide.forEach(item => {
        item.style.display = 'none';
        item.classList.add('filtered-out');
      });
      
      // Show and prepare visible items
      itemsToShow.forEach((item, index) => {
        item.style.display = 'block';
        item.classList.remove('filtered-out');
        
        // Set initial state for animation
        gsap.set(item, { 
          opacity: 0, 
          y: 50, 
          scale: 0.8,
          rotation: Math.random() * 10 - 5 // Small random rotation
        });
      });
    });
    
    // Animate in visible items with enhanced effects
    tl.to(itemsToShow, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "back.out(1.4)",
      stagger: {
        amount: 0.3,
        from: "start"
      }
    }, "+=0.1");
    
    // Add a subtle bounce effect
    tl.to(itemsToShow, {
      scale: 1.02,
      duration: 0.1,
      ease: "power2.out",
      stagger: 0.05,
      yoyo: true,
      repeat: 1
    }, "-=0.2");
    
    return tl;
  };
  
  const setActiveTab = (activeButton) => {
    // Remove active class from all tabs with animation
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
    
    // Add active class to clicked tab with animation
    activeButton.classList.add('active');
    gsap.to(activeButton, { 
      scale: 1.05, 
      duration: 0.2, 
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });
  };
  
  // Event listeners with cleanup tracking
  const cleanupFunctions = [];
  tabButtons.forEach(button => {
    cleanupFunctions.push(
      DOM.on(button, 'click', (e) => {
        e.preventDefault();
        const filter = button.getAttribute('data-filter') || '*';
        
        // Prevent multiple clicks during animation
        if (button.classList.contains('animating')) return;
        
        button.classList.add('animating');
        setActiveTab(button);
        
        const filterTL = filterProjects(filter);
        filterTL.call(() => {
          button.classList.remove('animating');
        });
      })
    );
  });

  // Initialize with first tab (show all)
  if (tabButtons.length > 0) {
    const firstTab = tabButtons[0];
    setActiveTab(firstTab);
    
    // Set initial state for all items
    gsap.set(projectItems, { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotation: 0,
      display: 'block'
    });
    
    // Remove any filtered-out classes
    projectItems.forEach(item => {
      item.classList.remove('filtered-out');
      item.style.display = 'block';
    });
  }

  return () => cleanupFunctions.forEach(cleanup => cleanup && cleanup());
}

// ==========================================
// 5. TESTIMONIALS SLIDER - GSAP POWERED
// ==========================================
function initGSAPTestimonials() {
  // Safety check for GSAP availability
  if (!GSAPUtils.isAvailable()) {
    console.warn('GSAP not available for testimonials');
    return;
  }

  const track = DOM.select('.testimonials-track');
  const dots = DOM.selectAll('.testimonial-dot');
  const prevBtn = DOM.select('#testimonialPrevBtn');
  const nextBtn = DOM.select('#testimonialNextBtn');
  const slider = DOM.select('.testimonials-slider');
  const testimonialItems = DOM.selectAll('.testimonial-item');
  
  if (!track || !dots.length || !prevBtn || !nextBtn || !slider || !testimonialItems.length) {
    console.warn('Testimonials elements not found');
    return;
  }
  
  let currentSlide = 0;
  const totalSlides = 3;
  let autoplayTimer = null;
  let isAnimating = false;
  let isPaused = false;
  
  // GSAP timeline for smooth transitions
  const slideToIndex = (index, direction = 'next') => {
    if (isAnimating || index === currentSlide) return;
    
    isAnimating = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentSlide = index;
        updateControls();
        startAutoplay();
      }
    });
    
    // Animate track movement
    const translateX = -index * (100 / totalSlides);
    if (track) {
      tl.to(track, {
        x: `${translateX}%`,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
    
    // Animate testimonial items with stagger
    const currentItem = testimonialItems[currentSlide];
    const nextItem = testimonialItems[index];
    
    if (currentItem) {
      // Fade out current item
      tl.to(currentItem, {
        opacity: 0.7,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.out"
      }, 0);
    }
    
    if (nextItem) {
      // Fade in next item
      tl.fromTo(nextItem, 
        { opacity: 0.7, scale: 0.95, y: direction === 'next' ? 30 : -30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, 0.2);
      
      // Animate stars with stagger
      const stars = nextItem.querySelectorAll('.stars-container svg');
      if (stars.length > 0) {
        tl.fromTo(stars,
          { scale: 0, rotation: -180 },
          { 
            scale: 1, 
            rotation: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
            stagger: 0.1
          }, 0.4);
      }
    }
    
    return tl;
  };
  
  const updateControls = () => {
    // Update dots
    dots.forEach((dot, index) => {
      if (!dot) return; // Safety check
      
      dot.classList.toggle('active', index === currentSlide);
      if (index === currentSlide) {
        gsap.to(dot, { 
          width: '1.75rem', 
          height: '0.375rem',
          scale: 1.05, 
          duration: 0.3, 
          ease: "back.out(1.7)" 
        });
        dot.classList.remove('bg-gray-600/60');
        dot.classList.add('bg-green-500');
      } else {
        gsap.to(dot, { 
          width: '1rem', 
          height: '0.375rem',
          scale: 1, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        dot.classList.remove('bg-green-500');
        dot.classList.add('bg-gray-600/60');
      }
    });
    
    
    // Update navigation buttons
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
    
    // Add button animations with enhanced effects
    const navButtons = [prevBtn, nextBtn].filter(Boolean);
    if (navButtons.length > 0) {
      gsap.to(navButtons, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
      
      // Add subtle pulse effect to active buttons
      gsap.to(navButtons, {
        boxShadow: "0 4px 20px rgba(34, 197, 94, 0.15)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  
  const nextSlide = () => {
    if (isAnimating) return;
    stopAutoplay();
    
    // Add click animation to next button
    if (nextBtn) {
      gsap.to(nextBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    
    const nextIndex = (currentSlide + 1) % totalSlides;
    slideToIndex(nextIndex, 'next');
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    stopAutoplay();
    
    // Add click animation to prev button
    if (prevBtn) {
      gsap.to(prevBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    slideToIndex(prevIndex, 'prev');
  };
  
  const startAutoplay = () => {
    if (isPaused) return;
    stopAutoplay();
    autoplayTimer = setTimeout(() => {
      nextSlide();
    }, 6000); // 6 seconds
  };
  
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  };
  
  const pauseAutoplay = () => {
    isPaused = true;
    stopAutoplay();
    slider.classList.add('paused');
  };
  
  const resumeAutoplay = () => {
    isPaused = false;
    slider.classList.remove('paused');
    startAutoplay();
  };
  
  // Event listeners with cleanup tracking
  const cleanupFunctions = [];
  
  // Navigation buttons
  cleanupFunctions.push(
    DOM.on(nextBtn, 'click', nextSlide),
    DOM.on(prevBtn, 'click', prevSlide)
  );
  
  // Dot navigation
  dots.forEach((dot, index) => {
    cleanupFunctions.push(
      DOM.on(dot, 'click', () => {
        if (isAnimating) return;
        stopAutoplay();
        slideToIndex(index);
      })
    );
  });
  
  // Pause on hover
  cleanupFunctions.push(
    DOM.on(slider, 'mouseenter', pauseAutoplay),
    DOM.on(slider, 'mouseleave', resumeAutoplay)
  );
  
  // Keyboard navigation
  cleanupFunctions.push(
    DOM.on(document, 'keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        isPaused ? resumeAutoplay() : pauseAutoplay();
      }
    })
  );
  
  // Initialize with safety checks
  if (track) {
    gsap.set(track, { x: '0%' });
  }
  
  if (testimonialItems.length > 0) {
    gsap.set(testimonialItems, { opacity: 1, scale: 1, y: 0 });
    
    if (testimonialItems[0]) {
      gsap.set(testimonialItems[0], { opacity: 1, scale: 1 });
    }
    
    // Set initial states for non-active items
    testimonialItems.forEach((item, index) => {
      if (item && index !== 0) {
        gsap.set(item, { opacity: 0.7, scale: 0.95 });
      }
    });
  }
  
  updateControls();
  startAutoplay();
  
  return () => {
    stopAutoplay();
    cleanupFunctions.forEach(cleanup => cleanup && cleanup());
  };
}

// ==========================================
// 6. CONTACT FORM
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí puedes agregar la lógica para enviar el formulario
      // Por ejemplo, usando fetch para enviar a un endpoint
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      console.log('Datos del formulario:', data);
      
      // Mostrar mensaje de éxito (temporal)
      alert('¡Mensaje enviado correctamente! Te responderé pronto.');
      
      // Limpiar formulario
      form.reset();
    });
  }
}

// ==========================================
// 7. CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursor-glow');
  
  if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Smooth animation loop
    function animate() {
      // Smooth interpolation for fluid movement
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Show glow when mouse enters the page
    document.addEventListener('mouseenter', function() {
      if (cursorGlow) cursorGlow.style.opacity = '1';
    });
    
    // Hide glow when mouse leaves the page
    document.addEventListener('mouseleave', function() {
      if (cursorGlow) cursorGlow.style.opacity = '0';
    });
  }
}

// ==========================================
// GSAP ANIMATION SYSTEM - MODULAR & REUSABLE
// ==========================================

// Animation presets for reusability
const ANIMATION_PRESETS = {
  fadeUp: { y: 60, opacity: 0 },
  fadeDown: { y: -60, opacity: 0 },
  fadeLeft: { x: -60, opacity: 0 },
  fadeRight: { x: 60, opacity: 0 },
  scaleUp: { scale: 0.8, opacity: 0 },
  slideUp: { y: 30, opacity: 0 },
  bounce: { y: 40, opacity: 0, scale: 0.9 },
  elastic: { scale: 0, opacity: 0 },
  badge: { y: 30, opacity: 0, scale: 0.8 },
  icon: { rotation: -15, scale: 0 },
  textReveal: { y: 40, opacity: 0, skewY: 3 },
  gentleFade: { y: 20, opacity: 0, scale: 0.95 }
};

const EASING_PRESETS = {
  smooth: "power2.out",
  dramatic: "power3.out", 
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  natural: "sine.inOut"
};

// Utility function to create animations
function createAnimation(selector, preset, options = {}) {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  if (!elements.length) return null;

  const defaultOptions = {
    duration: 0.8,
    ease: EASING_PRESETS.smooth,
    delay: 0,
    stagger: 0,
    ...options
  };

  const fromProps = ANIMATION_PRESETS[preset] || preset;
  const toProps = {
    x: 0, y: 0, scale: 1, opacity: 1, rotation: 0,
    duration: defaultOptions.duration,
    ease: defaultOptions.ease,
    delay: defaultOptions.delay,
    stagger: defaultOptions.stagger > 0 ? defaultOptions.stagger : undefined,
    ...defaultOptions.to
  };

  return gsap.fromTo(elements, fromProps, toProps);
}

// Hero Timeline - Coordinated sequence without reverse
let heroTimelineCreated = false;

function createHeroTimeline() {
  // Prevent multiple executions of hero timeline
  if (heroTimelineCreated) {
    console.log('Hero timeline already created, skipping...');
    return null;
  }
  
  // Verify that key elements exist before creating timeline
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) {
    console.warn('Hero elements not found, delaying timeline creation...');
    setTimeout(() => {
      if (!heroTimelineCreated) {
        createHeroTimeline();
      }
    }, 500);
    return null;
  }
  
  const tl = gsap.timeline({ defaults: { ease: EASING_PRESETS.smooth } });

  // Hero sequence - Subtle animations from natural state
  tl.from('.hero-title', 
    { y: 20, skewY: 2, duration: 1.0, ease: EASING_PRESETS.smooth }, 0.1)
    
  .from('.hero-title + p', 
    { y: 15, opacity: 0.3, duration: 0.8, ease: EASING_PRESETS.smooth }, 0.3)
    
  .from('.hero-visual', 
    { x: 30, scale: 0.98, duration: 1.0, ease: EASING_PRESETS.smooth }, 0.4)
    
  .from('.hero-cta', 
    { y: 10, scale: 0.98, duration: 0.6, ease: EASING_PRESETS.smooth }, 0.6)
    
  .from('.hero-social a', 
    { scale: 0.9, duration: 0.4, stagger: 0.08, ease: EASING_PRESETS.smooth }, 0.8)
    
  .from('.hero-stat', 
    { 
      y: 10, scale: 0.98, duration: 0.6, stagger: 0.1, ease: EASING_PRESETS.smooth,
      onComplete: () => initGSAPCounters()
    }, 1.0)
    
  .from('.tech-title', 
    { y: 15, scale: 0.98, duration: 0.6, ease: EASING_PRESETS.smooth }, 1.2)
    
  .from('.tech-title svg', 
    { scale: 0.9, duration: 0.4, ease: EASING_PRESETS.smooth }, 1.3)
    
  .from('.tech-carousel-container', 
    { y: 20, scale: 0.98, duration: 0.8, ease: EASING_PRESETS.smooth }, 1.4)
    
  .from('.tech-carousel', 
    { y: 10, duration: 0.6, ease: EASING_PRESETS.smooth }, 1.5)
    
  .from('.tech-item', 
    { 
      scale: 0.95, 
      y: 8,
      duration: 0.5, 
      stagger: 0.05, 
      ease: EASING_PRESETS.smooth
    }, 1.6);

  // Mark as created to prevent duplicate executions
  heroTimelineCreated = true;
  return tl;
}

// Background animations - separate timeline
let backgroundAnimationsCreated = false;

function createBackgroundAnimations() {
  // Prevent multiple executions of background animations
  if (backgroundAnimationsCreated) {
    console.log('Background animations already created, skipping...');
    return null;
  }
  
  // Verify that background elements exist
  const backgroundElements = document.querySelector('.blur-2xl, .blur-3xl, .animate-bounce');
  if (!backgroundElements) {
    console.warn('Background elements not found, skipping background animations...');
    backgroundAnimationsCreated = true; // Mark as created to prevent retries
    return null;
  }
  
  const tl = gsap.timeline();

  // Background gradients - subtle entrance
  tl.from('.blur-2xl, .blur-3xl', 
    { 
      scale: 0.9, opacity: 0.5, duration: 2.0, stagger: 0.5, ease: EASING_PRESETS.smooth,
      onComplete: function() {
        // Continuous floating after initial animation
        gsap.to('.blur-2xl, .blur-3xl', {
          x: "random(-10, 10)",
          y: "random(-15, 15)",
          duration: "random(8, 12)",
          ease: EASING_PRESETS.natural,
          yoyo: true,
          repeat: -1,
          stagger: 0.5
        });
      }
    }, 0)
    
  // Floating particles - subtle entrance
  .from('.animate-bounce', 
    { 
      scale: 0.8, opacity: 0.3, duration: 1.2, stagger: 0.3, ease: EASING_PRESETS.smooth,
      onComplete: function() {
        // Continuous floating
        gsap.to('.animate-bounce', {
          y: -8,
          duration: 2,
          ease: EASING_PRESETS.natural,
          yoyo: true,
          repeat: -1,
          stagger: 0.3
        });
      }
    }, 2.0);

  // Mark as created to prevent duplicate executions
  backgroundAnimationsCreated = true;
  return tl;
}

// Scroll-triggered animations - reusable system
function createScrollAnimations() {
  const animationMap = {
    '.fade-up': 'fadeUp',
    '.fade-left': 'fadeLeft', 
    '.fade-right': 'fadeRight',
    '.scale-up': 'scaleUp'
  };

  Object.entries(animationMap).forEach(([selector, preset]) => {
    gsap.utils.toArray(selector).forEach((element, index) => {
      gsap.fromTo(element, 
        ANIMATION_PRESETS[preset],
        {
          y: 0, x: 0, scale: 1, opacity: 1, 
          duration: 0.8, 
          delay: index * 0.1,
          scrollTrigger: { 
            trigger: element, 
            start: "top 85%", 
            toggleActions: "play none none none" // Removed reverse to prevent backwards animation
          }
        }
      );
    });
  });

  // Stagger animations
  gsap.utils.toArray('.stagger-children').forEach((container) => {
    const items = container.querySelectorAll('.stagger-item');
    gsap.fromTo(items,
      ANIMATION_PRESETS.fadeUp,
      {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
        scrollTrigger: { 
          trigger: container, 
          start: "top 85%", 
          toggleActions: "play none none none" 
        }
      }
    );
  });

  // Parallax - smooth and performant
  gsap.utils.toArray('.parallax-bg').forEach((element) => {
    gsap.to(element, {
      yPercent: -30, // Reduced movement
      ease: "none",
      scrollTrigger: { 
        trigger: element, 
        start: "top bottom", 
        end: "bottom top", 
        scrub: 1 // Smoother scrubbing
      }
    });
  });
}

// Tech Carousel Draggable functionality
function initTechCarouselDraggable(retryCount = 0) {
  const maxRetries = 5;
  
  const carousel = document.querySelector('.tech-carousel');
  const container = document.querySelector('.tech-carousel-container');
  
  if (!carousel || !container) {
    if (retryCount < maxRetries) {
      setTimeout(() => initTechCarouselDraggable(retryCount + 1), 1000);
    }
    return;
  }
  
  if (typeof Draggable === 'undefined') {
    if (retryCount < maxRetries) {
      setTimeout(() => initTechCarouselDraggable(retryCount + 1), 1000);
    }
    return;
  }

  try {
    // Get dimensions
    const carouselWidth = carousel.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxDrag = Math.min(0, -(carouselWidth - containerWidth));

    let scrollTween;
    
    // Wait for GSAP animations to complete, then smoothly transition to draggable
    gsap.delayedCall(3, () => {
      // Capture current position before stopping CSS animation
      const currentTransform = getComputedStyle(carousel).transform;
      let currentX = 0;
      
      if (currentTransform && currentTransform !== 'none') {
        const matrix = currentTransform.match(/matrix.*\((.+)\)/);
        if (matrix) {
          const values = matrix[1].split(', ');
          currentX = parseFloat(values[4]) || 0;
        }
      }
      
      // Stop CSS animation and set current position
      carousel.style.animation = 'none';
      gsap.set(carousel, { x: currentX });
      
      // Start GSAP infinite scroll from current position
      scrollTween = gsap.to(carousel, {
        x: maxDrag,
        duration: 30 * (1 - Math.abs(currentX / maxDrag)), // Adjust duration based on current position
        ease: "none",
        repeat: -1,
        onComplete: function() {
          // Reset to beginning and continue infinite loop
          gsap.set(carousel, { x: 0 });
          scrollTween = gsap.to(carousel, {
            x: maxDrag,
            duration: 30,
            ease: "none",
            repeat: -1
          });
        }
      });
    });
    
    // Create draggable instance
    const draggableInstance = Draggable.create(carousel, {
      type: "x",
      bounds: { minX: maxDrag, maxX: 0 },
      inertia: true,
      
      onDragStart: function() {
        carousel.style.cursor = "grabbing";
        document.body.style.userSelect = 'none';
        
        // Kill the auto-scroll tween
        if (scrollTween) {
          scrollTween.kill();
        }
      },
      
      onDrag: function() {
        // Dragging functionality handled by GSAP
      },
      
      onDragEnd: function() {
        carousel.style.cursor = "grab";
        document.body.style.userSelect = '';
        
        // Resume auto-scroll from current position after 2 seconds
        setTimeout(() => {
          const currentX = gsap.getProperty(carousel, "x");
          const remainingDistance = maxDrag - currentX;
          const remainingDuration = 30 * (Math.abs(remainingDistance) / Math.abs(maxDrag));
          
          scrollTween = gsap.to(carousel, {
            x: maxDrag,
            duration: remainingDuration,
            ease: "none",
            onComplete: function() {
              // Seamless loop back to start
              gsap.set(carousel, { x: 0 });
              scrollTween = gsap.to(carousel, {
                x: maxDrag,
                duration: 30,
                ease: "none",
                repeat: -1
              });
            }
          });
        }, 2000);
      }
    });

    // Set initial styles
    carousel.style.cursor = "grab";
    carousel.style.willChange = "transform";
    
    return draggableInstance[0];
    
  } catch (error) {
    return null;
  }
}

// Main initialization function
function initializeGSAPAnimations() {
  gsap.defaults({ ease: EASING_PRESETS.smooth, duration: 0.8 });

  // Create coordinated timelines
  const heroTL = createHeroTimeline();
  const bgTL = createBackgroundAnimations();
  
  // Initialize scroll animations
  createScrollAnimations();
  
  // Initialize tech carousel draggable after a delay to ensure elements are rendered
  setTimeout(() => {
    initTechCarouselDraggable();
  }, 2500);

  // Return timelines for potential control
  return { heroTL, bgTL };
}

// ==========================================
// GSAP COUNTER ANIMATION
// ==========================================
function initGSAPCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach((counter) => {
    const targetAttr = counter.getAttribute('data-target');
    const target = parseInt(targetAttr || '0');
    const suffix = counter.getAttribute('data-suffix');
    
    // Create a counter object for GSAP to animate
    const counterObj = { value: 0 };
    
    gsap.to(counterObj, {
      value: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: function() {
        const currentValue = Math.floor(counterObj.value);
        
        // Format the number based on suffix
        if (suffix === 'K') {
          const value = (counterObj.value / 1000).toFixed(1);
          counter.innerHTML = `${value}<span class="text-green-400 group-hover:text-green-300">K</span>`;
        } else if (counter.innerHTML.includes('+')) {
          counter.innerHTML = `${currentValue}<span class="text-green-400 group-hover:text-green-300">+</span>`;
        } else {
          counter.textContent = currentValue.toString();
        }
      }
    });
  });
}


// ==========================================
// GSAP INITIALIZATION HELPER
// ==========================================
let gsapInitialized = false;

function initGSAPAnimations() {
  // Prevent multiple initializations
  if (gsapInitialized) {
    console.log('GSAP already initialized, skipping...');
    return;
  }
  
  console.log('Checking GSAP availability...', {
    gsap: typeof gsap !== 'undefined',
    ScrollTrigger: typeof ScrollTrigger !== 'undefined',
    Draggable: typeof Draggable !== 'undefined'
  });
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Draggable !== 'undefined') {
    try {
      // Initialize all GSAP components in the correct order
      console.log('Initializing all GSAP animations...');
      
      // 1. Initialize main Hero and background animations
      console.log('Step 1: Initializing Hero and background animations');
      initializeGSAPAnimations();
      
      // 2. Initialize Portfolio functionality
      console.log('Step 2: Initializing Portfolio functionality');
      initGSAPPortfolio();
      
      // 3. Initialize Testimonials slider
      console.log('Step 3: Initializing Testimonials slider');
      initGSAPTestimonials();
      
      // Mark as initialized to prevent duplicate runs
      gsapInitialized = true;
      console.log('✅ All GSAP animations initialized successfully from node_modules');
    } catch (error) {
      console.error('❌ Error initializing GSAP animations:', error);
      // Fallback: try to initialize draggable only if Draggable is available
      if (typeof Draggable !== 'undefined') {
        setTimeout(() => {
          initTechCarouselDraggable();
        }, 2500);
      }
    }
  } else {
    console.warn('⚠️ GSAP not available. Animations will not work.');
  }
}

// Listen for GSAP ready event with additional safety checks
document.addEventListener('gsapReady', function() {
  console.log('GSAP ready event received');
  // Use requestAnimationFrame to ensure proper timing
  requestAnimationFrame(() => {
    setTimeout(() => {
      initGSAPAnimations();
    }, 100);
  });
});

// Fallback: Initialize GSAP after a timeout if event doesn't fire
setTimeout(() => {
  if (!gsapInitialized && typeof gsap !== 'undefined') {
    console.log('GSAP fallback initialization triggered');
    initGSAPAnimations();
  }
}, 2000);

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize basic functionality first (non-GSAP)
  initCursorGlow();
  initHeader();
  initContactForm();
  
  // GSAP components will be initialized via the 'gsapReady' event
  console.log('DOM loaded, waiting for GSAP to be ready...');
});
