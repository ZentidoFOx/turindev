// Main JavaScript - Header, Mouse Glow and Animation Utilities
document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMouseGlow();
});

// ========================================
// ANIMATION UTILITIES - Reutilizables
// ========================================

// Configuraciones comunes de animación
const ANIMATION_CONFIG = {
  // Easings más usados
  EASING: {
    smooth: "power2.out",
    bounce: "back.out(1.5)",
    elastic: "elastic.out(1, 0.5)"
  },
  
  // Duraciones estándar
  DURATION: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.8,
    counter: 2
  },
  
  // ScrollTrigger configs
  SCROLL_TRIGGER: {
    default: {
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    early: {
      start: "top 90%",
      toggleActions: "play none none reverse"
    },
    late: {
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
};

// Utilidades de animación reutilizables
const AnimationUtils = {
  // Verificar si GSAP está disponible
  isGSAPAvailable() {
    return typeof gsap !== 'undefined';
  },

  // Animación estándar de badge
  animateBadge(selector, sectionTrigger, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const badge = document.querySelector(selector);
    if (!badge) {
      console.log(`❌ Badge not found: ${selector}`);
      return;
    }

    const config = {
      y: 20,
      opacity: 0,
      duration: ANIMATION_CONFIG.DURATION.normal,
      ease: ANIMATION_CONFIG.EASING.smooth,
      scrollTrigger: {
        trigger: sectionTrigger,
        ...ANIMATION_CONFIG.SCROLL_TRIGGER.default
      },
      ...options
    };

    gsap.fromTo(badge, 
      { y: config.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        scrollTrigger: config.scrollTrigger
      }
    );

    console.log(`✅ Badge animated: ${selector}`);
  },

  // Animación estándar de título
  animateTitle(selector, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const title = document.querySelector(selector);
    if (!title) return;

    const config = {
      y: 30,
      duration: ANIMATION_CONFIG.DURATION.slow,
      ease: ANIMATION_CONFIG.EASING.smooth,
      scrollTrigger: {
        trigger: selector,
        ...ANIMATION_CONFIG.SCROLL_TRIGGER.default
      },
      ...options
    };

    gsap.fromTo(title, 
      { y: config.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        scrollTrigger: config.scrollTrigger
      }
    );
  },

  // Animación estándar de cards con stagger
  animateCards(selector, triggerSelector, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const cards = document.querySelectorAll(selector);
    if (cards.length === 0) return;

    const config = {
      y: 40,
      duration: ANIMATION_CONFIG.DURATION.slow,
      ease: ANIMATION_CONFIG.EASING.smooth,
      stagger: 0.2,
      scrollTrigger: {
        trigger: triggerSelector,
        ...ANIMATION_CONFIG.SCROLL_TRIGGER.default
      },
      ...options
    };

    gsap.fromTo(cards, 
      { y: config.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        scrollTrigger: config.scrollTrigger
      }
    );
  },

  // Animación de hover estándar
  addHoverAnimation(selector, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const config = {
        scale: 1.02,
        y: -5,
        duration: ANIMATION_CONFIG.DURATION.fast,
        ease: ANIMATION_CONFIG.EASING.smooth,
        ...options
      };

      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: config.scale,
          y: config.y,
          duration: config.duration,
          ease: config.ease
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: config.duration,
          ease: config.ease
        });
      });
    });
  },

  // Animación de botones/tabs
  animateButtonState(button, isActive, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const config = {
      activeColor: 'rgb(34, 197, 94)',
      inactiveColor: 'rgb(156, 163, 175)',
      activeBg: 'rgb(34, 197, 94)',
      inactiveBg: 'transparent',
      duration: ANIMATION_CONFIG.DURATION.fast,
      ease: ANIMATION_CONFIG.EASING.smooth,
      ...options
    };

    gsap.to(button, {
      backgroundColor: isActive ? config.activeBg : config.inactiveBg,
      color: isActive ? 'rgb(255, 255, 255)' : config.inactiveColor,
      duration: config.duration,
      ease: config.ease
    });
  },

  // Animación de elementos con escala (categorías, tags, etc.)
  animateScaleElements(selector, triggerSelector, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const config = {
      scale: 0,
      duration: 0.5,
      ease: ANIMATION_CONFIG.EASING.bounce,
      stagger: 0.1,
      scrollTrigger: {
        trigger: triggerSelector,
        ...ANIMATION_CONFIG.SCROLL_TRIGGER.late
      },
      ...options
    };

    gsap.fromTo(elements, 
      { scale: config.scale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        scrollTrigger: config.scrollTrigger
      }
    );
  },

  // Animación de imágenes con zoom
  animateImages(selector, triggerSelector, options = {}) {
    if (!this.isGSAPAvailable()) return;
    
    const images = document.querySelectorAll(selector);
    if (images.length === 0) return;

    const config = {
      scale: 1.1,
      duration: 1,
      ease: ANIMATION_CONFIG.EASING.smooth,
      stagger: 0.15,
      scrollTrigger: {
        trigger: triggerSelector,
        ...ANIMATION_CONFIG.SCROLL_TRIGGER.late
      },
      ...options
    };

    gsap.fromTo(images, 
      { scale: config.scale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger,
        scrollTrigger: config.scrollTrigger
      }
    );
  }
};

// Hacer disponible globalmente
window.AnimationUtils = AnimationUtils;
window.ANIMATION_CONFIG = ANIMATION_CONFIG;

function initHeader() {
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  console.log('Elements found:', {
    header: !!header,
    mobileMenuBtn: !!mobileMenuBtn,
    mobileMenu: !!mobileMenu
  });
  
  // Verificar que los elementos necesarios existen
  if (!header || !mobileMenuBtn || !mobileMenu) {
    console.error('Missing header elements');
    return;
  }

  // Header scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isVisible = mobileMenu.classList.contains('opacity-100');
    console.log('Toggle menu - isVisible:', isVisible);
    
    if (!isVisible) {
      // Show menu
      mobileMenu.classList.remove('opacity-0', 'invisible');
      mobileMenu.classList.add('opacity-100', 'visible');
      mobileMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Menu opened');
    } else {
      // Hide menu
      mobileMenu.classList.remove('opacity-100', 'visible');
      mobileMenu.classList.add('opacity-0', 'invisible');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
      console.log('Menu closed');
    }
  }

  // Close menu when clicking on menu links
  function closeMenuOnLink() {
    if (mobileMenu.classList.contains('opacity-100')) {
      mobileMenu.classList.remove('opacity-100', 'visible');
      mobileMenu.classList.add('opacity-0', 'invisible');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Event listeners
  window.addEventListener('scroll', handleScroll);
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking on navigation links
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenuOnLink);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('opacity-100')) {
      mobileMenu.classList.remove('opacity-100', 'visible');
      mobileMenu.classList.add('opacity-0', 'invisible');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking outside (on body)
  document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('opacity-100') && 
        !mobileMenu.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove('opacity-100', 'visible');
      mobileMenu.classList.add('opacity-0', 'invisible');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Initial scroll check
  handleScroll();
}

// Mouse Glow Effect
function initMouseGlow() {
  const mouseGlow = document.getElementById('mouse-glow');
  
  if (!mouseGlow) {
    console.error('Mouse glow element not found');
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  
  // Smooth animation with easing
  function updateGlow() {
    const ease = 0.1;
    glowX += (mouseX - glowX) * ease;
    glowY += (mouseY - glowY) * ease;
    
    mouseGlow.style.left = glowX + 'px';
    mouseGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(updateGlow);
  }

  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hide glow when mouse leaves window
  document.addEventListener('mouseleave', function() {
    mouseGlow.style.opacity = '0';
  });

  // Show glow when mouse enters window
  document.addEventListener('mouseenter', function() {
    mouseGlow.style.opacity = '1';
  });

  // Enhanced glow on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      mouseGlow.classList.add('enhanced');
    });
    
    element.addEventListener('mouseleave', function() {
      mouseGlow.classList.remove('enhanced');
    });
  });

  // Start animation loop
  updateGlow();
}

