// Contacto section animations
export function initContactoAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for Contacto animations');
    return;
  }

  console.log('🎬 Initializing Contacto animations...');

  // Animate section title
  gsap.fromTo('.contacto-title', 
    { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contacto-section',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate contact form
  gsap.fromTo('.contact-form', 
    { 
      opacity: 0, 
      x: -60,
      scale: 0.95
    },
    { 
      opacity: 1, 
      x: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate contact info
  gsap.fromTo('.contact-info', 
    { 
      opacity: 0, 
      x: 60,
      scale: 0.95
    },
    { 
      opacity: 1, 
      x: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contact-info',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate form fields with stagger
  gsap.fromTo('.form-field', 
    { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.2)",
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate contact info items
  gsap.fromTo('.contact-item', 
    { 
      opacity: 0, 
      x: 30,
      scale: 0.9
    },
    { 
      opacity: 1, 
      x: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.contact-info',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Form field focus animations
  const formFields = document.querySelectorAll('.form-field input, .form-field textarea');
  
  formFields.forEach(field => {
    const container = field.closest('.form-field');
    const label = container.querySelector('label');
    
    field.addEventListener('focus', () => {
      gsap.to(container, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
      
      if (label) {
        gsap.to(label, {
          y: -2,
          scale: 1.05,
          color: "#10b981",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    field.addEventListener('blur', () => {
      gsap.to(container, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      if (label) {
        gsap.to(label, {
          y: 0,
          scale: 1,
          color: "#ffffff",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

  // Submit button animation
  const submitBtn = document.querySelector('.contact-submit');
  if (submitBtn) {
    submitBtn.addEventListener('mouseenter', () => {
      gsap.to(submitBtn, {
        scale: 1.05,
        y: -2,
        duration: 0.3,
        ease: "back.out(1.3)"
      });
    });
    
    submitBtn.addEventListener('mouseleave', () => {
      gsap.to(submitBtn, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    // Click animation
    submitBtn.addEventListener('click', (e) => {
      gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    });
  }

  // Animate contact icons
  gsap.fromTo('.contact-icon', 
    { 
      scale: 0,
      rotation: -180,
      opacity: 0
    },
    { 
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.contact-info',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Floating animation for contact icons
  gsap.utils.toArray('.contact-icon').forEach((icon, index) => {
    gsap.to(icon, {
      y: -5,
      rotation: 5,
      duration: 2 + index * 0.3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.2
    });
  });

  // Social links animation
  gsap.fromTo('.social-links a', 
    { 
      opacity: 0, 
      scale: 0.5,
      rotation: -90
    },
    { 
      opacity: 1, 
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: "back.out(1.5)",
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.social-links',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  console.log('✅ Contacto animations initialized');
}
