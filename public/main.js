/**
 * Main JavaScript - Theme Functionality Only
 * Handles basic theme functionality: header, cursor, contact form
 * All GSAP animations are handled in GSAPLoader.astro
 */

// ==========================================
// TABLE OF CONTENTS
// ==========================================
// 1. UTILITY FUNCTIONS
// 2. HEADER FUNCTIONALITY  
// 3. CURSOR GLOW EFFECT
// 4. CONTACT FORM FUNCTIONALITY
// 5. INITIALIZATION

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
  
  // Toggle class conditionally
  toggleClass: (element, className, condition) => {
    if (!element) return;
    element.classList.toggle(className, condition);
  },
  
  // Set multiple styles at once
  setStyles: (element, styles) => {
    if (!element) return;
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
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
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

// ==========================================
// 2. HEADER FUNCTIONALITY
// ==========================================
function initHeader() {
  const header = DOM.select('header');
  const menuToggle = DOM.select('.menu-toggle');
  const mobileMenu = DOM.select('.mobile-menu');
  const menuLinks = DOM.selectAll('.mobile-menu a');
  
  if (!header) return;
  
  let isMenuOpen = false;
  let lastScrollY = window.scrollY;
  
  // Menu state management
  const setMenuState = (open) => {
    isMenuOpen = open;
    DOM.toggleClass(menuToggle, 'active', open);
    DOM.toggleClass(mobileMenu, 'active', open);
    DOM.toggleClass(document.body, 'menu-open', open);
  };
  
  // Mobile menu toggle
  if (menuToggle) {
    DOM.on(menuToggle, 'click', (e) => {
      e.preventDefault();
      setMenuState(!isMenuOpen);
    });
  }
  
  // Close menu when clicking on links
  menuLinks.forEach(link => {
    DOM.on(link, 'click', () => {
      setMenuState(false);
    });
  });
  
  // Close menu when clicking outside
  DOM.on(document, 'click', (e) => {
    if (isMenuOpen && !header.contains(e.target)) {
      setMenuState(false);
    }
  });
  
  // Header scroll behavior
  const handleScroll = AnimUtils.throttle(() => {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    DOM.toggleClass(header, 'scrolled', currentScrollY > 50);
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      DOM.toggleClass(header, 'header-hidden', true);
    } else {
      DOM.toggleClass(header, 'header-hidden', false);
    }
    
    lastScrollY = currentScrollY;
  }, 16); // ~60fps
  
  DOM.on(window, 'scroll', handleScroll);
  
  // Handle resize
  const handleResize = AnimUtils.debounce(() => {
    if (window.innerWidth > 768 && isMenuOpen) {
      setMenuState(false);
    }
  }, 250);
  
  DOM.on(window, 'resize', handleResize);
  
  console.log('✅ Header functionality initialized');
}

// ==========================================
// 3. CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
  const cursorGlow = DOM.select('#cursor-glow');
  
  if (!cursorGlow) return;
  
  // Only enable on devices with fine pointer (mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  
  // Track mouse movement with throttling
  const handleMouseMove = AnimUtils.throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, 16); // ~60fps
  
  DOM.on(document, 'mousemove', handleMouseMove);
  
  // Smooth animation loop
  function animate() {
    // Smooth interpolation for fluid movement
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    DOM.setStyles(cursorGlow, {
      transform: `translate(${glowX}px, ${glowY}px)`
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Show glow when mouse enters the page
  DOM.on(document, 'mouseenter', () => {
    DOM.setStyles(cursorGlow, { opacity: '1' });
  });
  
  // Hide glow when mouse leaves the page
  DOM.on(document, 'mouseleave', () => {
    DOM.setStyles(cursorGlow, { opacity: '0' });
  });
  
  console.log('✅ Cursor glow initialized');
}

// ==========================================
// 4. CONTACT FORM FUNCTIONALITY
// ==========================================
function initContactForm() {
  const contactForm = DOM.select('#contactForm');
  const submitBtn = DOM.select('#submitBtn');
  const formInputs = DOM.selectAll('#contactForm input, #contactForm textarea');
  
  if (!contactForm) return;
  
  // Form validation
  const validateForm = () => {
    let isValid = true;
    const formData = new FormData(contactForm);
    
    // Basic validation
    formInputs.forEach(input => {
      const value = formData.get(input.name);
      const isRequired = input.hasAttribute('required');
      
      if (isRequired && (!value || value.trim() === '')) {
        DOM.toggleClass(input, 'error', true);
        isValid = false;
      } else {
        DOM.toggleClass(input, 'error', false);
      }
    });
    
    // Email validation
    const emailInput = DOM.select('input[type="email"]', contactForm);
    if (emailInput) {
      const emailValue = formData.get(emailInput.name);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailValue && !emailRegex.test(emailValue)) {
        DOM.toggleClass(emailInput, 'error', true);
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Update button state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success state
      contactForm.reset();
      if (submitBtn) {
        submitBtn.textContent = '¡Enviado!';
        setTimeout(() => {
          submitBtn.textContent = 'Enviar Mensaje';
          submitBtn.disabled = false;
        }, 3000);
      }
      
      console.log('✅ Form submitted successfully');
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      // Error state
      if (submitBtn) {
        submitBtn.textContent = 'Error - Reintentar';
        setTimeout(() => {
          submitBtn.textContent = 'Enviar Mensaje';
          submitBtn.disabled = false;
        }, 3000);
      }
    }
  };
  
  // Real-time validation
  formInputs.forEach(input => {
    DOM.on(input, 'blur', () => {
      const value = input.value.trim();
      const isRequired = input.hasAttribute('required');
      
      if (isRequired && !value) {
        DOM.toggleClass(input, 'error', true);
      } else {
        DOM.toggleClass(input, 'error', false);
      }
    });
    
    DOM.on(input, 'input', () => {
      DOM.toggleClass(input, 'error', false);
    });
  });
  
  DOM.on(contactForm, 'submit', handleSubmit);
  
  console.log('✅ Contact form initialized');
}

// ==========================================
// 5. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing theme functionality...');
  
  // Initialize basic functionality
  initHeader();
  initCursorGlow();
  initContactForm();
  
  console.log('✅ Theme functionality initialized successfully!');
  console.log('🎬 GSAP animations are handled by GSAPLoader.astro');
});

// Prevent horizontal scroll globally
function preventHorizontalScroll() {
  // Ensure all elements respect viewport width
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; }
    *:not(.tech-carousel) { max-width: 100%; }
    body, html { overflow-x: hidden; width: 100%; max-width: 100vw; }
  `;
  document.head.appendChild(style);
}

// Initialize immediately
preventHorizontalScroll();
