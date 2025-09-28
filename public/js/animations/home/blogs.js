// Blogs section animations
export function initBlogsAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for Blogs animations');
    return;
  }

  // Check if blogs section exists on this page
  const blogsSection = document.querySelector('.blogs-section');
  if (!blogsSection) {
    console.log('🚫 Blogs section not found - skipping animations');
    return;
  }

  console.log('🎬 Initializing Blogs animations...');

  // Animate blogs badge
  initBlogsBadgeAnimation();

  // Animate section elements
  initBlogsElementsAnimation();

  console.log('✅ Blogs animations initialized');
}

// Blogs badge animation
function initBlogsBadgeAnimation() {
  const blogsBadge = document.querySelector('.blogs-section .inline-flex');
  
  if (!blogsBadge) {
    console.log('❌ Blogs badge not found');
    return;
  }

  console.log('🎯 Initializing blogs badge animation...');

  // Simple badge entrance
  gsap.fromTo(blogsBadge, 
    {
      y: 20,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.blogs-section',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  console.log('✅ Blogs badge animation initialized');
}

// Blogs elements animation
function initBlogsElementsAnimation() {
  // Animate section title
  const blogsTitle = document.querySelector('.blogs-title');
  if (blogsTitle) {
    gsap.fromTo('.blogs-title', 
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.blogs-title',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animate blog cards
  const blogCards = document.querySelectorAll('.blog-card');
  if (blogCards.length > 0) {
    gsap.fromTo('.blog-card', 
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.blogs-grid',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animate blog categories
  const blogCategories = document.querySelectorAll('.blog-category');
  if (blogCategories.length > 0) {
    gsap.fromTo('.blog-category', 
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.blogs-grid',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animate blog images
  const blogImages = document.querySelectorAll('.blog-image');
  if (blogImages.length > 0) {
    gsap.fromTo('.blog-image', 
      {
        scale: 1.1,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.blogs-grid',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  console.log('✅ Blogs elements animation initialized');
}
