// Copy of globalSearch.js for Home dir (file:// origin workaround)
document.addEventListener('DOMContentLoaded', function() {
  console.log('Home/globalSearch.js loaded');
  
  function initSearch() {
    if (typeof searchIndex === 'undefined') {
      console.error('searchIndex not loaded');
      setTimeout(initSearch, 100);
      return;
    }
    console.log('searchIndex loaded:', searchIndex.length);
    
    const searchInput = document.querySelector('.search input');
    if (!searchInput) return;
    
    let resultsContainer = document.querySelector('.search-results') || document.createElement('div');
    resultsContainer.className = 'search-results';
    const searchDiv = document.querySelector('.search');
    searchDiv.style.position = 'relative';
    if (!document.querySelector('.search-results')) searchDiv.parentNode.insertBefore(resultsContainer, searchDiv.nextSibling);
    
// Navigation function (SPA compatible + image lightbox)
    window.navigateTo = function(item) {
      if (item.type === 'page' && item.menuTarget) {
        // Find matching sidebar menu and load content
        const menuLink = Array.from(document.querySelectorAll('.menu a')).find(link => 
          link.href.includes(item.menuTarget)
        );
        if (menuLink) {
          // Set active + load content (no reload)
          const links = document.querySelectorAll('.menu a');
          links.forEach(a => a.classList.remove('active'));
          menuLink.classList.add('active');
          loadContent(menuLink.href, item.name);
          return;
        }
      } else if (item.type === 'image') {
        // Show image in lightbox
        const lightbox = document.getElementById('image-lightbox');
        const img = document.getElementById('lightbox-img');
        const caption = lightbox.querySelector('.lightbox-caption');
        img.src = item.path;
        caption.textContent = item.name + ' (' + item.page + ')';
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close handlers
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        closeBtn.onclick = () => {
          lightbox.style.display = 'none';
          document.body.style.overflow = '';
        };
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
          }
        };
        return;
      }
      // Fallback for other types
      window.location.href = item.path;
    }

    searchInput.oninput = e => {
      const term = e.target.value.toLowerCase();
      const matches = searchIndex.filter(item => 
        item.name.toLowerCase().includes(term) || item.page.toLowerCase().includes(term)
      );
      resultsContainer.innerHTML = matches.map(item => 
        `<div class="search-result" data-item='${JSON.stringify(item).replace(/'/g, "\\'")}' style="cursor: pointer;">${item.name} (${item.page})</div>`
      ).join('') || '<div class="search-result">No results</div>';
      resultsContainer.style.display = matches.length ? 'block' : 'none';
    };

    // Click handler for results
    resultsContainer.addEventListener('click', e => {
      if (e.target.classList.contains('search-result') && e.target.dataset.item) {
        const item = JSON.parse(e.target.dataset.item.replace(/\\'/g, "'"));
        window.navigateTo(item);
        resultsContainer.style.display = 'none';
        searchInput.value = '';
      }
    });
  }
  initSearch();
});
