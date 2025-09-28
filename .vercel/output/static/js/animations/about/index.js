// About Page Animation System Entry Point
import { initScrollAnimations } from '../scroll.js';
import { initAboutHeroAnimations } from './hero.js';
import { initTeamAnimations } from './team.js';
import { initTimelineAnimations } from './timeline.js';

// Main animation initialization function for About page
export function initAllAnimations() {
  console.log('🎬 Initializing About page animations...');
  
  // Initialize scroll-based animations first
  initScrollAnimations();
  
  // Initialize about-specific animations
  initAboutHeroAnimations();
  initTeamAnimations();
  initTimelineAnimations();
  
  console.log('✅ About page animations initialized successfully');
}

// Export individual animation functions for selective use
export {
  initAboutHeroAnimations,
  initTeamAnimations,
  initTimelineAnimations,
  initScrollAnimations
};
