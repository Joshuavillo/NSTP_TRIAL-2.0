// Tech Tutorial JS - Lazy Loading, Search, Filter
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tutorialsGrid');
  const searchInput = document.getElementById('tutorialSearch');
  const langFilter = document.getElementById('languageFilter');
  const levelFilter = document.getElementById('levelFilter');
  const clearBtn = document.getElementById('clearFilters');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalLink = document.getElementById('modalLink');
  const modalClose = document.querySelector('.modal-close');

  let allTutorials = [...tutorials]; // from techTutorials.js
  let currentTutorials = [...allTutorials];

  // Populate language filter
  const languages = [...new Set(allTutorials.map(t => t.language))];
  langFilter.innerHTML = '<option value="">All Languages</option>' + 
    languages.map(lang => `<option value="${lang}">${lang}</option>`).join('');

  // Render grid
  function renderGrid(tuts = currentTutorials) {
    grid.innerHTML = '';
    tuts.forEach(tut => {
      const card = document.createElement('div');
      card.className = 'tutorial-card';
      card.onclick = () => openModal(tut);
      card.innerHTML = `
        <div class="tutorial-thumbnail" style="background-image: url(${tut.thumbnail})">
          <button class="tutorial-play-btn">▶</button>
        </div>
        <div class="tutorial-info">
          <h3 class="tutorial-title">${tut.title}</h3>
          <div class="tutorial-meta">
            <span>${tut.language}</span>
            <span>${tut.level}</span>
            <span>${tut.duration}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Open video modal
  function openModal(tut) {
    modalVideo.src = `https://www.youtube.com/embed/${tut.videoId}?autoplay=1`;
    modalTitle.textContent = tut.title;
    modalLink.href = `https://youtube.com/watch?v=${tut.videoId}`;
    modalLink.textContent = 'Watch Full Video →';
    modal.classList.add('show');
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('show');
    modalVideo.src = '';
  }

  modalClose.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  // Filters
  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const lang = langFilter.value;
    const level = levelFilter.value;

    currentTutorials = allTutorials.filter(tut => {
      const matchesSearch = tut.title.toLowerCase().includes(search);
      const matchesLang = !lang || tut.language === lang;
      const matchesLevel = !level || tut.level === level;
      return matchesSearch && matchesLang && matchesLevel;
    });

    renderGrid();
  }

  // Event listeners
  searchInput.oninput = applyFilters;
  langFilter.onchange = applyFilters;
  levelFilter.onchange = applyFilters;
  clearBtn.onclick = () => {
    searchInput.value = '';
    langFilter.value = '';
    levelFilter.value = '';
    applyFilters();
  };

  // Initial render
  renderGrid();
});
