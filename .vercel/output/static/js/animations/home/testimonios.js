// Testimonios section animations
export function initTestimoniosAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for Testimonios animations');
    return;
  }

  // Check if testimonios section exists on this page
  const testimoniosSection = document.querySelector('.testimonios-section');
  if (!testimoniosSection) {
    console.log('🚫 Testimonios section not found - skipping animations');
    return;
  }

  console.log('🎬 Initializing Testimonios animations...');

  // Animate section elements (includes badge)
  initTestimoniosElementsAnimation();

  // Initialize testimonial slider with pagination
  initTestimonialSlider();

  // Initialize stars animation
  initStarsAnimation();

  console.log('✅ Testimonios animations initialized');
}

// Testimonios elements animation - Optimized with utilities
function initTestimoniosElementsAnimation() {
  // Wait for AnimationUtils to be available
  if (typeof window.AnimationUtils === 'undefined') {
    setTimeout(() => initTestimoniosElementsAnimation(), 100);
    return;
  }

  const { AnimationUtils } = window;

  // Animate testimonios badge using utility
  AnimationUtils.animateBadge('.testimonios-section .inline-flex', '.testimonios-section');

  // Animate section title using utility
  AnimationUtils.animateTitle('.testimonios-title');

  // Animate testimonial cards using utility
  AnimationUtils.animateCards('.testimonial-card', '.testimonials-slider');

  console.log('✅ Testimonios elements animation initialized with utilities');
}

// Stars animation
function initStarsAnimation() {
  const starsContainers = document.querySelectorAll('.stars-container');
  
  if (starsContainers.length === 0) {
    console.log('❌ Stars containers not found');
    return;
  }

  console.log('🎯 Initializing stars animation...');

  starsContainers.forEach((container, containerIndex) => {
    const stars = container.querySelectorAll('.star');
    
    // Set stars to beautiful yellow color and animate entrance
    gsap.set(stars, {
      color: 'rgb(251, 191, 36)' // text-yellow-400 - beautiful yellow
    });
    
    gsap.fromTo(stars, 
      {
        scale: 0,
        rotation: -180,
        opacity: 0
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
        stagger: 0.1,
        delay: containerIndex * 0.2,
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Hover animation for stars
    const testimonialCard = container.closest('.testimonial-card');
    if (testimonialCard) {
      testimonialCard.addEventListener('mouseenter', () => {
        gsap.to(stars, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05
        });
      });

      testimonialCard.addEventListener('mouseleave', () => {
        gsap.to(stars, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05
        });
      });
    }
  });

  console.log('✅ Stars animation initialized');
}

// Testimonial slider with existing controls
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');
  
  if (!slider || !track || slides.length === 0) {
    console.log('❌ Testimonial slider elements not found');
    return;
  }

  console.log('🎯 Initializing testimonial slider with existing controls...');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval;

  // Function to go to specific slide
  function goToSlide(index) {
    currentSlide = index;
    const translateX = -(currentSlide * (100 / totalSlides));
    
    gsap.to(track, {
      x: `${translateX}%`,
      duration: 0.8,
      ease: "power2.out"
    });
    
    updatePagination();
    updateSlideStates();
  }

  // Update existing pagination dots
  function updatePagination() {
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        gsap.to(dot, {
          width: '24px', // w-6
          backgroundColor: 'rgb(34, 197, 94)', // bg-green-500
          boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)',
          duration: window.ANIMATION_CONFIG?.DURATION?.fast || 0.3,
          ease: window.ANIMATION_CONFIG?.EASING?.smooth || "power2.out"
        });
      } else {
        gsap.to(dot, {
          width: '16px', // w-4
          backgroundColor: 'rgba(75, 85, 99, 0.6)', // bg-gray-600/60
          boxShadow: 'none',
          duration: window.ANIMATION_CONFIG?.DURATION?.fast || 0.3,
          ease: window.ANIMATION_CONFIG?.EASING?.smooth || "power2.out"
        });
      }
    });
  }

  // Update slide states
  function updateSlideStates() {
    slides.forEach((slide, index) => {
      const card = slide.querySelector('.testimonial-card');
      if (index === currentSlide) {
        gsap.to(card, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.7,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });
  }

  // Navigation functions
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }

  // Add event listeners to existing controls
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // Add event listeners to existing dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Auto-play functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  // Initialize slider
  goToSlide(0);
  startAutoplay();

  // Pause autoplay on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  console.log('✅ Testimonial slider with existing controls initialized');
}
