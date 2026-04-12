document.addEventListener('DOMContentLoaded', function() {

  const track = document.querySelector('.carousel-track');
  if (!track) return; // safety

  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.crsl-btn');
  const nextBtn = document.querySelector('.crsl-btn2');
  const indicators = document.querySelectorAll('.indicator');

  const slideWidth = 205;
  const totalSlides = slides.length;

  let currentIndex = 0;
  let autoPlayInterval;
  const autoPlayDelay = 4000;
  let startX = 0;

  // ===== UPDATE CAROUSEL =====
  function updateCarousel() {
    const translateX = -currentIndex * slideWidth;
    track.style.transform = 'translateX(' + translateX + 'px)';

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });

    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // ===== NEXT / PREV =====
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // ===== BUTTON EVENTS =====
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // ===== DOT INDICATORS =====
  indicators.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // ===== AUTOPLAY =====
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
  }

  // ===== TOUCH SWIPE =====
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

  // ===== KEYBOARD CONTROL =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // ===== IMAGE POPUP WITH ZOOM =====
  document.addEventListener('click', function(e) {
    if (
      e.target.classList.contains('slide-avatar') &&
      e.target.closest('.carousel-slide.active')
    ) {
      const imgSrc = e.target.style.backgroundImage.slice(5, -2);

      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 9999;';

      const imgContainer = document.createElement('div');
      imgContainer.style.cssText = 'flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-radius: 10px;';

      const modalImg = document.createElement('img');
      modalImg.src = imgSrc;
      modalImg.style.cssText = 'max-width: 95%; max-height: 95vh; object-fit: contain; cursor: zoom-in; transition: transform 0.3s ease; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);';

      let scale = 1;
      let posX = 0, posY = 0;
      let isDragging = false;
      let dragStartX, dragStartY;

      // Click to zoom
      modalImg.onclick = function() {
        scale = scale === 1 ? 1.5 : scale === 1.5 ? 2 : 1;
        modalImg.style.transform = 'scale(' + scale + ')';
        modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
      };

      // Wheel zoom
      modalImg.onwheel = function(e) {
        e.preventDefault();
        scale += e.deltaY * -0.01;
        scale = Math.min(Math.max(0.8, scale), 4);
        modalImg.style.transform = 'scale(' + scale + ')';
        modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
      };

      // Drag pan
      modalImg.onmousedown = function(e) {
        if (scale > 1) {
          isDragging = true;
          dragStartX = e.clientX - posX;
          dragStartY = e.clientY - posY;
          modalImg.style.cursor = 'grabbing';
          e.preventDefault();
        }
      };

      document.onmousemove = function(e) {
        if (isDragging) {
          posX = e.clientX - dragStartX;
          posY = e.clientY - dragStartY;
          modalImg.style.transform = 'scale(' + scale + ') translate(' + posX + 'px, ' + posY + 'px)';
        }
      };

      document.onmouseup = function() {
        isDragging = false;
        modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
      };

      imgContainer.appendChild(modalImg);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; font-size: 30px; background: none; border: none; color: white; cursor: pointer; z-index: 10000; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.3s ease;';
      closeBtn.onmouseenter = function() { closeBtn.style.background = 'rgba(255,255,255,0.2)'; };
      closeBtn.onmouseleave = function() { closeBtn.style.background = 'none'; };
      closeBtn.onclick = function() { modal.remove(); };

      modal.appendChild(imgContainer);
      modal.appendChild(closeBtn);

      // Close on backdrop click or Escape
      modal.onclick = function(ev) {
        if (ev.target === modal) modal.remove();
      };
      document.onkeydown = function(e) {
        if (e.key === 'Escape') modal.remove();
      };

      document.body.appendChild(modal);
    }
  });

  // ===== INIT =====
  updateCarousel();
  startAutoPlay();

});
