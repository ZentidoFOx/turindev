// Blogs section animations - Optimized with utilities
export function initBlogsAnimations() {
  // Check if blogs section exists on this page
  const blogsSection = document.querySelector('.blogs-section');
  if (!blogsSection) {
    console.log('🚫 Blogs section not found - skipping animations');
    return;
  }

  console.log('🎬 Initializing Blogs animations...');

  // Wait for AnimationUtils to be available
  if (typeof window.AnimationUtils === 'undefined') {
    console.log('⏳ Waiting for AnimationUtils...');
    setTimeout(() => initBlogsAnimations(), 100);
    return;
  }

  const { AnimationUtils } = window;

  // Animate blogs badge using utility
  AnimationUtils.animateBadge('.blogs-section .inline-flex', '.blogs-section');

  // Animate section title using utility
  AnimationUtils.animateTitle('.blogs-title');

  // Animate blog cards using utility
  AnimationUtils.animateCards('.blog-card', '.blogs-grid');

  // Animate blog categories using utility
  AnimationUtils.animateScaleElements('.blog-category', '.blogs-grid');

  // Animate blog images using utility
  AnimationUtils.animateImages('.blog-image', '.blogs-grid');

  console.log('✅ Blogs animations initialized with utilities');
}
