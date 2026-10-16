// Registra o Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch((err) => {
    console.error('Falha ao registrar SW:', err);
  });
}

// Elementos do DOM
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const wordEn = document.getElementById('word-en');
const wordPt = document.getElementById('word-pt');
const wordCounter = document.getElementById('word-counter');
const btnNext = document.getElementById('btn-next');
const btnCopy = document.getElementById('btn-copy');
const btnFavorite = document.getElementById('btn-favorite');
const favIcon = document.getElementById('fav-icon');
const searchInput = document.getElementById('search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const btnFavoritesFilter = document.getElementById('btn-favorites-filter');
const searchResults = document.getElementById('search-results');
const btnExport = document.getElementById('btn-export');

// Ícones SVG do tema
const sunIcon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

let wordsDatabase = [];
let availableQueue = [];
let currentWord = null;
let favorites = JSON.parse(localStorage.getItem('ispeak_favs') || '[]');
let onlyFavoritesMode = false;

// Alternância de Tema Claro / Escuro
function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('ispeak_theme', theme);
  themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}

const savedTheme = localStorage.getItem('ispeak_theme') || 'dark';
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Carrega o banco de dados do arquivo JSON externo
async function loadWordsDatabase() {
  try {
    const response = await fetch('./words.json');
    if (!response.ok) throw new Error('Erro ao carregar words.json');
    wordsDatabase = await response.json();
    initQueue();
  } catch (err) {
    wordEn.innerText = "Erro ao carregar dados";
    wordPt.innerText = "Verifique o arquivo words.json";
    console.error(err);
  }
}

// Inicializa baralho embaralhado sem repetição
function initQueue() {
  const source = onlyFavoritesMode 
    ? wordsDatabase.filter(w => favorites.includes(w.english))
    : wordsDatabase;

  if (source.length === 0) {
    wordEn.innerText = "Nenhuma palavra";
    wordPt.innerText = onlyFavoritesMode ? "Adicione favoritas primeiro" : "";
    wordCounter.innerText = "0 / 0";
    currentWord = null;
    return;
  }

  // Embaralha o baralho aleatoriamente
  availableQueue = [...source].sort(() => Math.random() - 0.5);
  loadNextWord();
}

function loadNextWord() {
  if (availableQueue.length === 0) {
    initQueue(); // Reinicia o ciclo completo ao esgotar
    return;
  }
  currentWord = availableQueue.pop();
  displayWord(currentWord);
}

function displayWord(word) {
  wordEn.innerText = word.english;
  wordPt.innerText = word.portuguese;
  
  const total = onlyFavoritesMode 
    ? wordsDatabase.filter(w => favorites.includes(w.english)).length 
    : wordsDatabase.length;
  
  const remaining = availableQueue.length + 1;
  wordCounter.innerText = `${total - remaining + 1} / ${total}`;

  if (favorites.includes(word.english)) {
    btnFavorite.classList.add('active');
    favIcon.style.fill = 'currentColor';
  } else {
    btnFavorite.classList.remove('active');
    favIcon.style.fill = 'none';
  }
}

// Botão Próximo
btnNext.addEventListener('click', loadNextWord);

// Botão Copiar
btnCopy.addEventListener('click', () => {
  if (!currentWord) return;
  const textToCopy = `${currentWord.english} - ${currentWord.portuguese}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    btnCopy.style.transform = 'scale(1.15)';
    setTimeout(() => btnCopy.style.transform = 'scale(1)', 200);
  });
});

// Favoritar
btnFavorite.addEventListener('click', () => {
  if (!currentWord) return;
  const index = favorites.indexOf(currentWord.english);
  if (index > -1) {
    favorites.splice(index, 1);
    btnFavorite.classList.remove('active');
    favIcon.style.fill = 'none';
  } else {
    favorites.push(currentWord.english);
    btnFavorite.classList.add('active');
    favIcon.style.fill = 'currentColor';
  }
  localStorage.setItem('ispeak_favs', JSON.stringify(favorites));
});

// Filtro de Favoritas
btnFavoritesFilter.addEventListener('click', () => {
  onlyFavoritesMode = !onlyFavoritesMode;
  btnFavoritesFilter.classList.toggle('active-filter', onlyFavoritesMode);
  initQueue();
});

// Busca em Tempo Real
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    searchResults.classList.add('hidden');
    searchResults.innerHTML = '';
    return;
  }

  const matches = wordsDatabase
    .filter(w => w.english.toLowerCase().includes(query) || w.portuguese.toLowerCase().includes(query))
    .slice(0, 10);

  if (matches.length > 0) {
    searchResults.innerHTML = matches.map(m => `
      <div class="search-item" data-en="${m.english}">
        <span><strong>${m.english}</strong></span>
        <span style="opacity: 0.7;">${m.portuguese}</span>
      </div>
    `).join('');
    searchResults.classList.remove('hidden');

    document.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => {
        const en = item.getAttribute('data-en');
        const found = wordsDatabase.find(w => w.english === en);
        if (found) {
          currentWord = found;
          displayWord(found);
        }
        searchResults.classList.add('hidden');
        searchInput.value = '';
      });
    });
  } else {
    searchResults.innerHTML = '<div style="padding: 10px; text-align: center; opacity: 0.6;">Nenhum resultado</div>';
    searchResults.classList.remove('hidden');
  }
});

btnClearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchResults.classList.add('hidden');
});

// Exportar Palavra Atual
btnExport.addEventListener('click', () => {
  if (!currentWord) return;
  const content = `Palavra: ${currentWord.english}\nSignificado: ${currentWord.portuguese}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentWord.english}-ispeak.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

// Inicialização
window.addEventListener('DOMContentLoaded', loadWordsDatabase);
