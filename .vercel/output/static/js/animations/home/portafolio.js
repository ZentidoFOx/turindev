// Portafolio section animations
export function initPortafolioAnimations() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available for Portafolio animations');
    return;
  }

  // Check if portafolio section exists on this page
  const portafolioSection = document.querySelector('.portafolio-section');
  if (!portafolioSection) {
    console.log('🚫 Portafolio section not found - skipping animations');
    return;
  }

  console.log('🎬 Initializing Portafolio animations...');

  // Animate portafolio badge
  initPortafolioBadgeAnimation();

  // Animate section elements
  initPortafolioElementsAnimation();

  // Initialize portfolio tabs functionality
  initPortafolioTabs();

  console.log('✅ Portafolio animations initialized');
}

// Portafolio badge animation
function initPortafolioBadgeAnimation() {
  const portafolioBadge = document.querySelector('.portafolio-section .inline-flex');
  
  if (!portafolioBadge) {
    console.log('❌ Portafolio badge not found');
    return;
  }

  console.log('🎯 Initializing portafolio badge animation...');

  // Simple badge entrance
  gsap.fromTo(portafolioBadge, 
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
        trigger: '.portafolio-section',
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );

  console.log('✅ Portafolio badge animation initialized');
}

// Portafolio elements animation
function initPortafolioElementsAnimation() {
  // Animate section title
  const portafolioTitle = document.querySelector('.portafolio-title');
  if (portafolioTitle) {
    gsap.fromTo('.portafolio-title', 
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
          trigger: '.portafolio-title',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animate filter tabs
  const portfolioFilters = document.querySelectorAll('.portfolio-filter');
  if (portfolioFilters.length > 0) {
    gsap.fromTo('.portfolio-filter', 
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.portfolio-filters',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animate portfolio items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (portfolioItems.length > 0) {
    gsap.fromTo('.portfolio-item', 
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
          trigger: '.portfolio-grid',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  console.log('✅ Portafolio elements animation initialized');
}

// Portfolio tabs functionality
function initPortafolioTabs() {
  const filterButtons = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length === 0 || portfolioItems.length === 0) {
    console.log('❌ Portfolio filters or items not found');
    return;
  }

  console.log('🎯 Initializing portfolio tabs functionality...');

  // Function to filter portfolio items with smooth animations and responsive height
  function filterPortfolio(filterValue) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    // First, fade out all items
    gsap.to(portfolioItems, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.05,
      onComplete: () => {
        let visibleCount = 0;
        
        // Then filter and show relevant items
        portfolioItems.forEach((item, index) => {
          const categories = item.getAttribute('data-category') || '';
          const itemClasses = item.className;
          
          let shouldShow = false;
          
          if (filterValue === '*') {
            shouldShow = true;
          } else {
            const filterClass = filterValue.replace('.', '');
            shouldShow = categories.includes(filterClass) || itemClasses.includes(filterClass);
          }
          
          if (shouldShow) {
            visibleCount++;
            // Show item with smooth entrance
            item.style.display = 'block';
            gsap.fromTo(item, 
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
                ease: "power2.out",
                delay: index * 0.1
              }
            );
          } else {
            // Hide item
            item.style.display = 'none';
          }
        });
        
        // Adjust grid height based on visible items
        adjustGridHeight(portfolioGrid, visibleCount);
        
        // Show "no results" message if needed
        handleNoResults(visibleCount, filterValue);
      }
    });
  }
  
  // Function to adjust grid height based on visible items
  function adjustGridHeight(grid, visibleCount) {
    if (!grid) return;
    
    let minHeight;
    
    if (visibleCount === 0) {
      // No items - minimal height
      minHeight = '200px';
    } else if (visibleCount <= 2) {
      // 1-2 items - reduced height
      minHeight = '400px';
    } else if (visibleCount <= 4) {
      // 3-4 items - medium height
      minHeight = '600px';
    } else {
      // 5+ items - full height
      minHeight = 'auto';
    }
    
    gsap.to(grid, {
      minHeight: minHeight,
      duration: 0.5,
      ease: "power2.out"
    });
  }
  
  // Function to handle "no results" state
  function handleNoResults(visibleCount, filterValue) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCount === 0) {
      // Create "no results" message if it doesn't exist
      if (!noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message text-center py-12';
        noResultsMessage.innerHTML = `
          <div class="text-gray-400 text-lg mb-4">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">No se encontraron proyectos</h3>
          <p class="text-gray-400">No hay proyectos disponibles para esta categoría.</p>
        `;
        portfolioGrid.appendChild(noResultsMessage);
      }
      
      // Show message with animation
      gsap.fromTo(noResultsMessage, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      // Hide message if it exists
      if (noResultsMessage) {
        gsap.to(noResultsMessage, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            noResultsMessage.remove();
          }
        });
      }
    }
  }

  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');
      
      // Remove active class from all buttons with smooth transition
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        gsap.to(btn, {
          backgroundColor: 'transparent',
          color: 'rgb(156, 163, 175)', // Gris claro
          borderColor: 'transparent',
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      // Add active class to clicked button with smooth transition
      button.classList.add('active');
      gsap.to(button, {
        backgroundColor: 'rgb(34, 197, 94)', // Verde sólido
        color: 'rgb(255, 255, 255)', // Blanco para mejor contraste
        borderColor: 'rgb(34, 197, 94)',
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Filter portfolio items
      filterPortfolio(filterValue);
      
      console.log(`Portfolio filtered by: ${filterValue}`);
    });
  });

  // Set initial active state with smooth transition
  const activeButton = document.querySelector('.portfolio-filter.active');
  if (activeButton) {
    gsap.to(activeButton, {
      backgroundColor: 'rgb(34, 197, 94)', // Verde sólido
      color: 'rgb(255, 255, 255)', // Blanco para mejor contraste
      borderColor: 'rgb(34, 197, 94)',
      duration: 0.5,
      ease: "power2.out",
      delay: 0.2
    });
  }

  console.log('✅ Portfolio tabs functionality initialized');
}
