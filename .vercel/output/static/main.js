// ==========================================
// MAIN.JS - THEME BASIC FUNCTIONALITY ONLY
// ==========================================
// This file contains only basic theme functionality:
// - Header navigation
// - Cursor glow effect  
// - Contact form
// - Basic utilities
// All GSAP animations are handled by GSAPLoader.astro

// ==========================================
// 1. UTILITY FUNCTIONS
// ==========================================

// DOM Utilities
const DOM = {
  select: (selector, parent = document) => parent.querySelector(selector),
  selectAll: (selector, parent = document) => parent.querySelectorAll(selector),
  exists: (selector, parent = document) => !!parent.querySelector(selector),
  
  // Event listener with cleanup tracking
  on: (element, event, handler, options = {}) => {
    if (!element) return null;
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },
  
  // Conditional class toggle
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
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }
};

// ==========================================
// 2. HEADER FUNCTIONALITY
// ==========================================
function initHeader() {
  const header = DOM.select("#main-header");
  const toggleButton = DOM.select("#header-navbar-toggle");
  const navbar = DOM.select("#header-navbar");
  const navLinks = DOM.selectAll("#header-navbar a");
  
  if (!header) return;
  
  // Track cleanup functions
  const cleanupFunctions = [];
  
  // Unified menu state management
  const setMenuState = (isOpen) => {
    DOM.toggleClass(navbar, 'show', isOpen);
    DOM.toggleClass(toggleButton, 'active', isOpen);
    DOM.toggleClass(document.body, 'menu-open', isOpen);
    
    // Update ARIA attributes
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', isOpen.toString());
    }
  };
  
  // Mobile menu toggle
  if (toggleButton && navbar) {
    const toggleCleanup = DOM.on(toggleButton, 'click', (e) => {
      e.preventDefault();
      const isCurrentlyOpen = navbar.classList.contains('show');
      setMenuState(!isCurrentlyOpen);
    });
    cleanupFunctions.push(toggleCleanup);
  }
  
  // Close menu when clicking nav links (mobile)
  navLinks.forEach(link => {
    const linkCleanup = DOM.on(link, 'click', () => {
      if (window.innerWidth <= 768) {
        setMenuState(false);
      }
    });
    cleanupFunctions.push(linkCleanup);
  });
  
  // Close menu when clicking outside (mobile)
  const outsideClickCleanup = DOM.on(document, 'click', (e) => {
    if (navbar && navbar.classList.contains('show')) {
      if (!header.contains(e.target)) {
        setMenuState(false);
      }
    }
  });
  cleanupFunctions.push(outsideClickCleanup);
  
  // Scroll behavior - throttled for performance
  const handleScroll = AnimUtils.throttle(() => {
    const scrolled = window.scrollY > 50;
    DOM.toggleClass(header, 'scrolled', scrolled);
  }, 16); // ~60fps
  
  const scrollCleanup = DOM.on(window, 'scroll', handleScroll);
  cleanupFunctions.push(scrollCleanup);
  
  // Handle resize events - debounced
  const handleResize = AnimUtils.debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navbar && navbar.classList.contains('show')) {
      setMenuState(false);
    }
  }, 250);
  
  const resizeCleanup = DOM.on(window, 'resize', handleResize);
  cleanupFunctions.push(resizeCleanup);
  
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
  
  // Only enable on devices with cursor (not touch devices)
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursorGlow.style.display = 'none';
    return;
  }
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let animationId;
  
  // Track cleanup functions
  const cleanupFunctions = [];
  
  // Throttled mouse move handler for performance
  const handleMouseMove = AnimUtils.throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, 16); // ~60fps
  
  const mouseMoveCleanup = DOM.on(document, 'mousemove', handleMouseMove);
  cleanupFunctions.push(mouseMoveCleanup);
  
  // Smooth animation loop using transform for better performance
  const animate = () => {
    // Smooth interpolation for fluid movement
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    // Use transform instead of left/top for better performance
    DOM.setStyles(cursorGlow, {
      transform: `translate(${glowX - 250}px, ${glowY - 250}px)`
    });
    
    animationId = requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // Cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

// ==========================================
// 4. CONTACT FORM FUNCTIONALITY
// ==========================================
function initContactForm() {
  const form = DOM.select('#contactForm');
  
  if (!form) return;
  
  const submitButton = DOM.select('#contactForm button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Enviar Mensaje';
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submitButton) return;
    
    // Update button state
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    try {
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Here you would typically send the data to your backend
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success state
      submitButton.textContent = '¡Mensaje Enviado!';
      submitButton.style.backgroundColor = '#10b981';
      
      // Reset form
      form.reset();
      
      // Reset button after delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.style.backgroundColor = '';
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error state
      submitButton.textContent = 'Error - Intentar de nuevo';
      submitButton.style.backgroundColor = '#ef4444';
      
      // Reset button after delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.style.backgroundColor = '';
      }, 3000);
    }
  };
  
  // Add form submission listener
  return DOM.on(form, 'submit', handleSubmit);
}

// ==========================================
// 5. SCROLL UTILITIES
// ==========================================
function preventHorizontalScroll() {
  // Prevent horizontal scroll on the page
  const preventScroll = (e) => {
    if (e.shiftKey && (e.deltaX !== 0 || e.deltaY !== 0)) {
      e.preventDefault();
    }
  };
  
  return DOM.on(document, 'wheel', preventScroll, { passive: false });
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing theme basic functionality...');
  
  // Initialize basic functionality (non-GSAP)
  preventHorizontalScroll();
  initCursorGlow();
  initHeader();
  initContactForm();
  
  console.log('✅ Theme basic functionality initialized successfully!');
  console.log('🎬 GSAP animations are handled by GSAPLoader.astro');
});

// ==========================================
// 7. GLOBAL ERROR HANDLING
// ==========================================
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
