// Hero section - Only statistics animation
export function initHeroAnimations() {
  console.log('📊 Initializing Hero statistics animation...');
  
  // Animate statistics counters
  const statItems = document.querySelectorAll('.hero-stats .stat-item .counter');
  
  if (statItems.length > 0) {
    statItems.forEach((counter, index) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const format = counter.getAttribute('data-format') || 'integer';
      
      if (typeof gsap !== 'undefined') {
        // GSAP counter animation
        gsap.to({ value: 0 }, {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function() {
            let currentValue = this.targets()[0].value;
            let displayValue;
            
            if (format === 'decimal' && suffix === 'K') {
              // For 1.5K format
              displayValue = (currentValue / 1000).toFixed(1);
            } else {
              displayValue = Math.round(currentValue);
            }
            
            counter.innerHTML = `${displayValue}<span class="text-green-400 group-hover:text-green-300">${suffix}</span>`;
          },
          delay: index * 0.2
        });
      } else {
        // Fallback: JavaScript vanilla counter
        animateCounterVanilla(counter, target, suffix, format, index * 200);
      }
    });
  }
  
  // Initialize tech badge animation
  initTechBadgeAnimation();
  
  // Initialize tech carousel drag functionality
  initTechCarouselDrag();
  
  console.log('✅ Statistics animation initialized');
}

// Tech badge animation
function initTechBadgeAnimation() {
  const techBadge = document.querySelector('.tech-title');
  const techIcon = document.querySelector('.tech-title .w-4, .tech-title .w-5');
  const techText = document.querySelector('.tech-title span');
  
  if (!techBadge) {
    console.log('❌ Tech badge not found');
    return;
  }

  if (typeof gsap === 'undefined') {
    console.log('❌ GSAP not available for tech badge');
    return;
  }

  console.log('🎯 Initializing tech badge animation...');

  // Set initial state
  gsap.set(techBadge, { 
    opacity: 1,
    scale: 1,
    y: 0
  });

  // Create timeline for badge entrance
  const badgeTimeline = gsap.timeline({ delay: 0.5 });

  // Badge entrance animation
  badgeTimeline
    .from(techBadge, {
      y: 20,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from(techIcon, {
      rotation: -180,
      scale: 0,
      duration: 0.6,
      ease: "back.out(2)"
    }, "-=0.4")
    .from(techText, {
      x: -10,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

  // Continuous subtle animations
  gsap.to(techBadge, {
    y: -2,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 1.5
  });

  // Icon pulse animation
  if (techIcon) {
    gsap.to(techIcon, {
      scale: 1.1,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2
    });
  }

  // Hover interactions
  techBadge.addEventListener('mouseenter', () => {
    gsap.to(techBadge, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (techIcon) {
      gsap.to(techIcon, {
        rotation: 360,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  });

  techBadge.addEventListener('mouseleave', () => {
    gsap.to(techBadge, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  console.log('✅ Tech badge animation initialized');
}

// Tech carousel drag functionality
function initTechCarouselDrag() {
  const carousel = document.querySelector('.tech-carousel');
  const container = document.querySelector('.tech-carousel-container');
  
  if (!carousel || !container) {
    console.log('❌ Tech carousel elements not found');
    return;
  }

  if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') {
    console.log('❌ GSAP or Draggable not available');
    return;
  }

  console.log('🎯 Initializing tech carousel drag...');
  
  // Stop CSS animation and set up GSAP control
  carousel.style.animation = 'none';
  gsap.set(carousel, { x: 0 });
  
  // Calculate bounds for dragging
  function updateBounds() {
    const containerWidth = container.offsetWidth;
    const carouselWidth = carousel.scrollWidth;
    const maxDrag = containerWidth - carouselWidth;
    
    console.log('Bounds:', { containerWidth, carouselWidth, maxDrag });
    
    return {
      minX: Math.min(maxDrag, 0),
      maxX: 0
    };
  }

  // Start continuous animation (infinite scroll)
  let autoAnimation = gsap.to(carousel, {
    x: () => -(carousel.scrollWidth / 2), // Only scroll half since content is duplicated
    duration: 30,
    ease: "none",
    repeat: -1,
    paused: false
  });

  // Create draggable instance
  const draggableInstance = Draggable.create(carousel, {
    type: "x",
    bounds: updateBounds(),
    inertia: true,
    dragResistance: 0.3,
    edgeResistance: 0.8,
    
    onPress: function() {
      console.log('Drag started');
      // Pause auto animation
      autoAnimation.pause();
      carousel.style.cursor = 'grabbing';
      carousel.classList.add('dragging');
    },
    
    onDrag: function() {
      // Keep auto animation paused
      autoAnimation.pause();
    },
    
    onRelease: function() {
      console.log('Drag released');
      carousel.style.cursor = 'grab';
      carousel.classList.remove('dragging');
      
      // Resume auto animation after delay
      setTimeout(() => {
        autoAnimation.resume();
      }, 2000);
    },
    
    onThrowUpdate: function() {
      // Keep paused during inertia
      autoAnimation.pause();
    },
    
    onThrowComplete: function() {
      console.log('Throw complete');
      carousel.style.cursor = 'grab';
      carousel.classList.remove('dragging');
      
      // Resume auto animation
      setTimeout(() => {
        autoAnimation.resume();
      }, 1000);
    }
  });

  // Update bounds on window resize
  window.addEventListener('resize', () => {
    if (draggableInstance[0]) {
      const newBounds = updateBounds();
      draggableInstance[0].vars.bounds = newBounds;
      draggableInstance[0].update();
      
      // Update auto animation
      autoAnimation.kill();
      autoAnimation = gsap.to(carousel, {
        x: () => -(carousel.scrollWidth / 2), // Only scroll half since content is duplicated
        duration: 30,
        ease: "none",
        repeat: -1,
        paused: false
      });
    }
  });

  // Set initial styles
  carousel.style.cursor = 'grab';
  carousel.style.userSelect = 'none';
  carousel.style.touchAction = 'pan-x';
  
  console.log('✅ Tech carousel drag initialized');
}

// Vanilla JavaScript counter fallback
function animateCounterVanilla(counter, target, suffix, format, delay) {
  setTimeout(() => {
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      let displayValue;
      if (format === 'decimal' && suffix === 'K') {
        displayValue = (current / 1000).toFixed(1);
      } else {
        displayValue = Math.round(current);
      }
      
      counter.innerHTML = `${displayValue}<span class="text-green-400">${suffix}</span>`;
    }, 33); // ~30fps
  }, delay);
}
