/**
 * TurinDEV - Main JavaScript File
 * Código optimizado solo con funcionalidades necesarias
 */

// Cargar GSAP y ScrollTrigger
const script1 = document.createElement('script');
script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
document.head.appendChild(script2);

script2.onload = function() {
  gsap.registerPlugin(ScrollTrigger);
  initializeGSAPAnimations();
};

// ==========================================
// 1. HEADER FUNCTIONALITY
// ==========================================
function initHeader() {
  const header = document.getElementById("main-header");
  const toggleButton = document.getElementById("header-navbar-toggle");
  const navbar = document.getElementById("header-navbar");
  const overlay = document.getElementById("mobile-overlay");
  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (header) {
      if (currentScrollY > 50) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    }

    lastScrollY = currentScrollY;
  }

  function toggleMobileMenu() {
    if (!toggleButton) return;

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    if (!overlay || !toggleButton || !navbar) return;

    // 1. Primero mostrar overlay
    overlay.classList.remove("invisible");

    // 2. Animar overlay después de un frame
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-100");
    });

    // 3. Después abrir menú
    setTimeout(() => {
      toggleButton.setAttribute("aria-expanded", "true");
      navbar.setAttribute("data-open", "");
      document.body.style.overflow = "hidden";
    }, 100);
  }

  function closeMobileMenu() {
    if (!overlay || !toggleButton || !navbar) return;

    // 1. Primero cerrar menú
    toggleButton.setAttribute("aria-expanded", "false");
    navbar.removeAttribute("data-open");

    // 2. Después animar overlay
    setTimeout(() => {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");

      // 3. Finalmente ocultar overlay y restaurar scroll
      setTimeout(() => {
        overlay.classList.add("invisible");
        document.body.style.overflow = "";
      }, 500);
    }, 200);
  }

  // Event listeners
  if (overlay) {
    overlay.addEventListener("click", closeMobileMenu);
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", toggleMobileMenu);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cerrar menú al hacer click en un enlace (móvil)
  if (navbar) {
    const mobileLinks = navbar.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          closeMobileMenu();
        }
      });
    });
  }

  // Cerrar menú al redimensionar ventana
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  });

  // Llamar una vez al cargar para establecer estado inicial
  handleScroll();
}

// ==========================================
// 2. HERO COUNTER ANIMATION
// ==========================================
function initHeroCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const animateCounter = (counter) => {
    const targetAttr = counter.getAttribute('data-target');
    const target = parseInt(targetAttr || '0');
    const suffix = counter.getAttribute('data-suffix');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current >= target) {
        current = target;
      }
      
      // Format the number based on suffix
      if (suffix === 'K') {
        const value = (current / 1000).toFixed(1);
        counter.innerHTML = `${value}<span class="text-green-400 group-hover:text-green-300">K</span>`;
      } else if (counter.innerHTML.includes('+')) {
        counter.innerHTML = `${Math.floor(current)}<span class="text-green-400 group-hover:text-green-300">+</span>`;
      } else {
        counter.textContent = Math.floor(current).toString();
      }
      
      if (current < target) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    updateCounter();
  };
  
  // Intersection Observer to trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        setTimeout(() => {
          animateCounter(entry.target);
        }, 1600); // Delay to sync with fade-in animation
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// ==========================================
// 3. PORTFOLIO TABS & FILTERING
// ==========================================
function initPortfolio() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectItems = document.querySelectorAll('[data-category]');
  
  // Agregar clase para animaciones
  projectItems.forEach(item => {
    item.classList.add('project-item');
  });
  
  function filterProjects(category) {
    // Primero ocultar todos los proyectos
    projectItems.forEach(item => {
      item.classList.add('hidden');
      item.classList.remove('fade-in');
    });
    
    // Después de un pequeño delay, mostrar los proyectos filtrados con animación escalonada
    setTimeout(() => {
      const visibleItems = [];
      
      projectItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category')?.split(' ') || [];
        
        if (category === 'todo' || itemCategories.includes(category)) {
          visibleItems.push(item);
        }
      });
      
      // Mostrar elementos con delay escalonado
      visibleItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.remove('hidden');
          item.classList.add('fade-in');
          
          // Remover la clase fade-in después de la animación
          setTimeout(() => {
            item.classList.remove('fade-in');
          }, 600);
        }, index * 100); // 100ms de delay entre cada elemento
      });
    }, 150); // Delay inicial para que se complete la animación de salida
  }
  
  function setActiveTab(activeButton) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-tab') || 'todo';
      setActiveTab(button);
      filterProjects(category);
    });
  });
}

// ==========================================
// 4. SKILLS TABS & FILTERING
// ==========================================
function initSkills() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCategories = document.querySelectorAll('.skill-category');
  
  function filterSkills(category) {
    // Primero ocultar todas las categorías
    skillCategories.forEach(cat => {
      cat.classList.add('hidden');
      cat.classList.remove('fade-in');
    });
    
    // Después de un pequeño delay, mostrar la categoría seleccionada
    setTimeout(() => {
      const targetCategory = document.querySelector(`[data-category="${category}"]`);
      if (targetCategory) {
        targetCategory.classList.remove('hidden');
        targetCategory.classList.add('fade-in');
        
        // Remover la clase fade-in después de la animación
        setTimeout(() => {
          targetCategory.classList.remove('fade-in');
        }, 600);
      }
    }, 150);
  }
  
  function setActiveTab(activeButton) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-tab') || 'frontend';
      setActiveTab(button);
      filterSkills(category);
    });
  });
}

// ==========================================
// 5. TESTIMONIALS SLIDER
// ==========================================
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentSlide = 0;
  const totalSlides = 3;
  
  function updateSlider() {
    if (track) {
      const translateX = -currentSlide * (100 / totalSlides);
      track.style.transform = `translateX(${translateX}%)`;
    }
    
    // Actualizar dots
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
        dot.classList.remove('bg-gray-600');
        dot.classList.add('bg-green-500');
      } else {
        dot.classList.remove('active');
        dot.classList.remove('bg-green-500');
        dot.classList.add('bg-gray-600');
      }
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }
  
  // Event listeners
  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
    });
  });
  
  // Auto-slide cada 5 segundos
  setInterval(nextSlide, 5000);
  
  // Inicializar
  updateSlider();
}

// ==========================================
// 6. CONTACT FORM
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí puedes agregar la lógica para enviar el formulario
      // Por ejemplo, usando fetch para enviar a un endpoint
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      console.log('Datos del formulario:', data);
      
      // Mostrar mensaje de éxito (temporal)
      alert('¡Mensaje enviado correctamente! Te responderé pronto.');
      
      // Limpiar formulario
      form.reset();
    });
  }
}

// ==========================================
// 7. CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursor-glow');
  
  if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Smooth animation loop
    function animate() {
      // Smooth interpolation for fluid movement
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Show glow when mouse enters the page
    document.addEventListener('mouseenter', function() {
      if (cursorGlow) cursorGlow.style.opacity = '1';
    });
    
    // Hide glow when mouse leaves the page
    document.addEventListener('mouseleave', function() {
      if (cursorGlow) cursorGlow.style.opacity = '0';
    });
  }
}

// ==========================================
// GSAP SCROLL ANIMATIONS
// ==========================================
function initializeGSAPAnimations() {
  gsap.defaults({ ease: "power2.out", duration: 1 });

  // Fade Up
  gsap.utils.toArray('.fade-up').forEach((element, index) => {
    gsap.fromTo(element, 
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, delay: index * 0.1,
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
      }
    );
  });

  // Fade Left
  gsap.utils.toArray('.fade-left').forEach((element, index) => {
    gsap.fromTo(element,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, delay: index * 0.1,
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
      }
    );
  });

  // Fade Right
  gsap.utils.toArray('.fade-right').forEach((element, index) => {
    gsap.fromTo(element,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, delay: index * 0.1,
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
      }
    );
  });

  // Scale Up
  gsap.utils.toArray('.scale-up').forEach((element, index) => {
    gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, delay: index * 0.1,
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" }
      }
    );
  });

  // Stagger Animations
  gsap.utils.toArray('.stagger-children').forEach((container) => {
    const items = container.querySelectorAll('.stagger-item');
    gsap.fromTo(items,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
        scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none reverse" }
      }
    );
  });

  // Hero Title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.fromTo(heroTitle, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 });
  }

  // Hero Stats
  const heroStats = document.querySelectorAll('.hero-stat');
  if (heroStats.length > 0) {
    gsap.fromTo(heroStats, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 1, ease: "back.out(1.7)" });
  }

  // Parallax
  gsap.utils.toArray('.parallax-bg').forEach((element) => {
    gsap.to(element, {
      yPercent: -50, ease: "none",
      scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  initCursorGlow();
  initHeader();
  initHeroCounters();
  initPortfolio();
  initSkills();
  initTestimonials();
  initContactForm();
});
