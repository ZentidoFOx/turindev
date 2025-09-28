// GSAP Initialization and Animation System
console.log('🎬 Loading GSAP Animation System...');

// Global animation systems registry (will be populated by pages)
window.animationSystems = window.animationSystems || {};

// GSAP functionality
document.addEventListener('gsapReady', async function() {
  console.log('GSAP is ready!');
  
  try {
    // Load all registered animation systems
    const systemNames = Object.keys(window.animationSystems);
    
    if (systemNames.length > 0) {
      console.log(`🎯 Loading animation systems: ${systemNames.join(', ')}`);
      
      for (const systemName of systemNames) {
        try {
          const animationModule = await window.animationSystems[systemName]();
          
          // Initialize animations for this system
          if (animationModule.initAllAnimations) {
            animationModule.initAllAnimations();
          }
          
          console.log(`✅ ${systemName} animations loaded successfully`);
        } catch (error) {
          console.error(`Error loading ${systemName} animation system:`, error);
        }
      }
    } else {
      console.log('🔍 No animation systems registered, using basic animations');
      initBasicGSAPAnimations();
    }
  } catch (error) {
    console.error('Error loading animation modules:', error);
    // Fallback to basic animations
    initBasicGSAPAnimations();
  }
});


// Fallback GSAP animations if modules fail
function initBasicGSAPAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available');
    return;
  }

  console.log('Initializing basic GSAP animations...');
  
  // Basic fade in elements on scroll
  gsap.utils.toArray('.fade-up').forEach(element => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Enhanced mouse glow with GSAP
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    // Smooth mouse following with GSAP
    let mouse = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
      gsap.to(mouseGlow, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }
}
