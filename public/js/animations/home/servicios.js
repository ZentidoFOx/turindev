// Servicios section animations
export function initServiciosAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for Servicios animations');
    return;
  }

  console.log('🎬 Initializing Servicios animations...');

  // Animate servicios badge
  initServiciosBadgeAnimation();

  // Animate "Disponible para nuevos proyectos" badge
  initDisponibleAnimation();

  // Animate CTA card
  initCTACardAnimation();

  // Animate section title
  gsap.fromTo('.servicios-title', 
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
        trigger: '.servicios-section',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Animate service cards with stagger
  gsap.fromTo('.service-card', 
    { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotation: -3
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.2)",
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.servicios-grid',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Hover animations for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    const icon = card.querySelector('.service-icon');
    const title = card.querySelector('.service-title');
    const description = card.querySelector('.service-description');
    
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(icon, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.5)"
      });
      
      gsap.to([title, description], {
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to([title, description], {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });

  // Animate service icons on scroll
  gsap.utils.toArray('.service-icon').forEach(icon => {
    gsap.fromTo(icon, 
      { 
        scale: 0.5,
        rotation: -45,
        opacity: 0
      },
      { 
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: icon,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Floating animation for service icons
  gsap.utils.toArray('.service-icon').forEach((icon, index) => {
    gsap.to(icon, {
      y: -8,
      rotation: 3,
      duration: 2 + index * 0.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.3
    });
  });

  console.log('✅ Servicios animations initialized');
}

// Servicios badge animation
function initServiciosBadgeAnimation() {
  const serviciosBadge = document.querySelector('.servicios-section .inline-flex');
  const serviciosIcon = document.querySelector('.servicios-section .inline-flex .w-4, .servicios-section .inline-flex .w-5');
  const serviciosText = document.querySelector('.servicios-section .inline-flex span');
  
  if (!serviciosBadge) {
    console.log('❌ Servicios badge not found');
    return;
  }

  console.log('🎯 Initializing servicios badge animation...');

  // Set initial state
  gsap.set(serviciosBadge, { 
    opacity: 1,
    scale: 1,
    y: 0
  });

  // Create timeline for badge entrance
  const badgeTimeline = gsap.timeline({ 
    delay: 0.3,
    scrollTrigger: {
      trigger: '.servicios-section',
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Badge entrance animation
  badgeTimeline
    .from(serviciosBadge, {
      y: 30,
      opacity: 0,
      scale: 0.7,
      duration: 0.9,
      ease: "back.out(1.8)"
    })
    .from(serviciosIcon, {
      rotation: -270,
      scale: 0,
      duration: 0.7,
      ease: "back.out(2.5)"
    }, "-=0.5")
    .from(serviciosText, {
      x: -15,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

  // Continuous subtle animations
  gsap.to(serviciosBadge, {
    y: -3,
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2
  });

  // Icon rotation animation
  if (serviciosIcon) {
    gsap.to(serviciosIcon, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1,
      delay: 3
    });
  }

  // Hover interactions
  serviciosBadge.addEventListener('mouseenter', () => {
    gsap.to(serviciosBadge, {
      scale: 1.08,
      duration: 0.4,
      ease: "back.out(1.5)"
    });
    
    if (serviciosIcon) {
      gsap.to(serviciosIcon, {
        scale: 1.2,
        rotation: "+=180",
        duration: 0.5,
        ease: "back.out(1.5)"
      });
    }
  });

  serviciosBadge.addEventListener('mouseleave', () => {
    gsap.to(serviciosBadge, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    });
    
    if (serviciosIcon) {
      gsap.to(serviciosIcon, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  });

  console.log('✅ Servicios badge animation initialized');
}

// "Disponible para nuevos proyectos" animation
function initDisponibleAnimation() {
  const disponibleBadge = document.querySelector('.servicios-section .inline-flex:has(.animate-pulse)');
  const pulseDot = document.querySelector('.servicios-section .w-2.h-2.bg-green-400');
  const disponibleText = document.querySelector('.servicios-section .inline-flex:has(.animate-pulse) span');
  
  if (!disponibleBadge) {
    console.log('❌ Disponible badge not found');
    return;
  }

  console.log('🎯 Initializing disponible animation...');

  // Create timeline for badge entrance
  const disponibleTimeline = gsap.timeline({ 
    delay: 1.2,
    scrollTrigger: {
      trigger: '.servicios-section',
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  });

  // Badge entrance animation
  disponibleTimeline
    .from(disponibleBadge, {
      x: -30,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "back.out(1.5)"
    })
    .from(pulseDot, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.4")
    .from(disponibleText, {
      x: -10,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

  // Enhanced pulse animation for the dot
  if (pulseDot) {
    gsap.to(pulseDot, {
      scale: 1.3,
      opacity: 0.7,
      duration: 1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2
    });
  }

  // Subtle floating animation for the badge
  gsap.to(disponibleBadge, {
    y: -2,
    duration: 2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2.5
  });

  // Hover interactions
  disponibleBadge.addEventListener('mouseenter', () => {
    gsap.to(disponibleBadge, {
      scale: 1.05,
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 0.4)',
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (pulseDot) {
      gsap.to(pulseDot, {
        scale: 1.5,
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)',
        duration: 0.3,
        ease: "back.out(1.5)"
      });
    }
  });

  disponibleBadge.addEventListener('mouseleave', () => {
    gsap.to(disponibleBadge, {
      scale: 1,
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.2)',
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (pulseDot) {
      gsap.to(pulseDot, {
        scale: 1,
        boxShadow: 'none',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  console.log('✅ Disponible animation initialized');
}

// CTA Card animation
function initCTACardAnimation() {
  const ctaCard = document.querySelector('.cta-card');
  
  if (!ctaCard) {
    console.log('❌ CTA card not found');
    return;
  }

  console.log('🎯 Initializing CTA card animation...');

  // Simple entrance animation
  gsap.fromTo(ctaCard, 
    {
      y: 40,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.cta-card',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  console.log('✅ CTA card animation initialized');
}
