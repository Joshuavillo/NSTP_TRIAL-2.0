document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.crsl-btn');
  const nextBtn = document.querySelector('.crsl-btn2');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
const slideWidth = 205;
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayInterval;
  const autoPlayDelay = 4000;
  let isTransitioning = false;
  let startX = 0;
  
  // Update indicators
  function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  function updateCarousel() {
    if (isTransitioning) return;
isTransitioning = true;

setTimeout(() => {
  isTransitioning = false;
}, 100); 
    track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const translateX = -currentIndex * slideWidth;
    track.style.transform = `translateX(${translateX}px)`;
    
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
    
    updateIndicators();
    
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  // Navigation events
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Indicators
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  // Auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Pause on hover
  const container = document.querySelector('.carousel-container');
  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);
  
  // Touch/swipe support
 if (container) {
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    });

    container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCarousel, 250);
  });
  
// Clickable image popup - ONLY active slide
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('slide-avatar') && e.target.closest('.carousel-slide.active')) {
      const imgSrc = e.target.style.backgroundImage.slice(5, -2);
      const modal = document.createElement('div');
      modal.className = 'image-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
      `;
      modal.innerHTML = `
        <img src="${imgSrc}" style="max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 12px;">
        <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 30px; cursor: pointer; z-index: 10001;">×</button>
      `;
      modal.querySelector('button').onclick = () => modal.remove();
      modal.onclick = (ev) => {
        if (ev.target === modal) modal.remove();
      };
      document.body.appendChild(modal);
    }
  });
  
  // Initialize
  updateCarousel();
  startAutoPlay();
});

