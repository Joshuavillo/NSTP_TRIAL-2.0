const menu = document.querySelector('.menu');
const mainContent = document.querySelector('.main');
const headerTitle = document.querySelector('.header h2');

// SPA Navigation
async function loadContent(url, title = '') {
  try {
    // Fallback to window.location for file:// CORS issues
    if (true) {
      window.location.href = url;
      return;
    }
    
    
  } catch (error) {
    mainContent.innerHTML = `<div class="error">Failed to load: ${error.message}</div>`;
  }
}

// Menu clickability + SPA navigation
menu.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.tagName === 'A') {
    const links = menu.querySelectorAll('a');
    links.forEach(a => a.classList.remove('active'));
    e.target.classList.add('active');
    
    loadContent(e.target.href, e.target.textContent);
  }
});

// Popstate for browser back/forward
window.addEventListener('popstate', e => {
  if (e.state && e.state.url) {
    loadContent(e.state.url, document.title);
  }
});
 
