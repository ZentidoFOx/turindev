// Main JavaScript - Header and Mouse Glow functionality only
document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMouseGlow();
});

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

