// Animation System Entry Point
import { initHeroAnimations } from './home/hero.js';
import { initServiciosAnimations } from './home/servicios.js';
import { initPortafolioAnimations } from './home/portafolio.js';
import { initTestimoniosAnimations } from './home/testimonios.js';
import { initBlogsAnimations } from './home/blogs.js';
import { initContactoAnimations } from './home/contacto.js';
import { initScrollAnimations } from './scroll.js';

// Main animation initialization function
export function initAllAnimations() {
  console.log('🎬 Initializing all GSAP animations...');
  
  // Initialize scroll-based animations first
  initScrollAnimations();
  
  // Initialize section-specific animations
  initHeroAnimations();
  initServiciosAnimations();
  initPortafolioAnimations();
  initTestimoniosAnimations();
  initBlogsAnimations();
  initContactoAnimations();
  
  console.log('✅ All animations initialized successfully');
}

// Export individual animation functions for selective use
export {
  initHeroAnimations,
  initServiciosAnimations,
  initPortafolioAnimations,
  initTestimoniosAnimations,
  initBlogsAnimations,
  initContactoAnimations,
  initScrollAnimations
};
