// Scroll-based animations utility
export function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not available');
    return;
  }

  // Fade in from bottom animation
  gsap.utils.toArray('.fade-up').forEach(element => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 60,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Fade in from left animation
  gsap.utils.toArray('.fade-left').forEach(element => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        x: -80,
        rotation: -2
      },
      { 
        opacity: 1, 
        x: 0,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Fade in from right animation
  gsap.utils.toArray('.fade-right').forEach(element => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        x: 80,
        rotation: 2
      },
      { 
        opacity: 1, 
        x: 0,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Scale up animation
  gsap.utils.toArray('.scale-up').forEach(element => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        scale: 0.7,
        rotation: -5
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Stagger animation for groups
  gsap.utils.toArray('.stagger-container').forEach(container => {
    const items = container.querySelectorAll('.stagger-item');
    
    gsap.fromTo(items, 
      { 
        opacity: 0, 
        y: 40,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}
