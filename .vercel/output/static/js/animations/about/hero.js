// About Hero section animations
export function initAboutHeroAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for About Hero animations');
    return;
  }

  console.log('🎬 Initializing About Hero animations...');

  // About hero timeline
  const tl = gsap.timeline({ delay: 0.3 });

  // Animate about title
  tl.fromTo('.about-hero-title', 
    { 
      opacity: 0, 
      y: 80, 
      scale: 0.8
    },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: 1.2,
      ease: "power3.out"
    }
  );

  // Animate about description
  tl.fromTo('.about-hero-description', 
    { 
      opacity: 0, 
      y: 60
    },
    { 
      opacity: 1, 
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6"
  );

  // Animate profile image with rotation
  tl.fromTo('.about-profile-image', 
    { 
      opacity: 0, 
      scale: 0.5,
      rotation: -10
    },
    { 
      opacity: 1, 
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "back.out(1.3)"
    }, "-=0.4"
  );

  console.log('✅ About Hero animations initialized');
}
