document.addEventListener('DOMContentLoaded', function() {
  // Image Grid Modal Functionality
  const imageGrid = document.getElementById('imageGrid');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDetails = document.getElementById('modalDetails');
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  const closeBtn = document.getElementById('closeModal');

  let currentIndex = 0;

  // Populate grid with numbered items
  function createGrid() {
    gridData.forEach((item, index) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.innerHTML = `<span class="item-number">${item.id}</span>`;
      gridItem.onclick = () => openModal(index);
      imageGrid.appendChild(gridItem);
    });
  }

  function openModal(index) {
    currentIndex = index;
    updateModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function updateModal() {
    const item = gridData[currentIndex];
    modalImage.src = item.image;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalDetails.textContent = item.details;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % gridData.length;
    updateModal();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + gridData.length) % gridData.length;
    updateModal();
  }

  // Event Listeners
  if (prevBtn) prevBtn.onclick = prevImage;
  if (nextBtn) nextBtn.onclick = nextImage;
  if (closeBtn) closeBtn.onclick = closeModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.addEventListener('keydown', (e) => {
    if (!modal.style.display || modal.style.display === 'none') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch/Swipe support for modal
  let startX = 0;
  modal.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  });

  // Initialize
  createGrid();
});
