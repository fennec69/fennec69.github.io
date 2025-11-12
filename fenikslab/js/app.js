// Global state
let currentLanguage = 'fr';
let translations = {};
let appsData = {};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    await loadAppsData();
    initializeLanguage();
    renderApps();
    setupEventListeners();
});

// Load translation files
async function loadTranslations() {
    try {
        const response = await fetch(`i18n/${currentLanguage}.json`);
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Load apps data
async function loadAppsData() {
    try {
        const response = await fetch('data/apps.json');
        appsData = await response.json();
    } catch (error) {
        console.error('Error loading apps data:', error);
    }
}

// Initialize language from localStorage or browser
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('feniks-language');
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
        currentLanguage = savedLanguage;
    } else {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        currentLanguage = browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    updateLanguageUI();
    applyTranslations();
}

// Update language switcher UI
function updateLanguageUI() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Apply translations to the page
function applyTranslations() {
    // Update meta tags
    if (translations.meta) {
        document.title = translations.meta.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = translations.meta.description;
        }
    }

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedTranslation(translations, key);
        if (value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// Get nested translation value
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Change language
async function changeLanguage(lang) {
    if (lang === currentLanguage) return;
    
    currentLanguage = lang;
    localStorage.setItem('feniks-language', lang);
    
    await loadTranslations();
    updateLanguageUI();
    applyTranslations();
    renderApps(); // Re-render apps with new language
}

// Setup event listeners
function setupEventListeners() {
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
        });
    });

    // Modal close
    const modal = document.getElementById('screenshot-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Render apps
function renderApps() {
    const appsGrid = document.getElementById('apps-grid');
    if (!appsGrid || !appsData.apps) return;

    appsGrid.innerHTML = '';

    // Filter only published apps
    const publishedApps = appsData.apps.filter(app => app.published);

    if (publishedApps.length === 0) {
        appsGrid.innerHTML = '<p class="loading">Aucune application disponible pour le moment.</p>';
        return;
    }

    publishedApps.forEach(app => {
        const appCard = createAppCard(app);
        appsGrid.appendChild(appCard);
    });
}

// Create app card
function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.setAttribute('data-app-id', app.id);

    const name = app.name[currentLanguage] || app.name.fr || app.name.en;
    const description = app.description[currentLanguage] || app.description.fr || app.description.en;
    const shortDesc = app.shortDescription?.[currentLanguage] || app.shortDescription?.fr || description;

    card.innerHTML = `
        <div class="app-card-header">
            <img src="${app.logo}" alt="${name}" class="app-logo" loading="lazy" onerror="this.src='assets/logos/placeholder.png'">
            <h3 class="app-name">${name}</h3>
        </div>
        <p class="app-description">${shortDesc}</p>
        <div class="app-links">
            ${createAppLink(app.links.appStore, 'appStore', translations.apps?.appStore || 'App Store')}
            ${createAppLink(app.links.googlePlay, 'googlePlay', translations.apps?.googlePlay || 'Google Play')}
            ${createAppLink(app.links.web, 'web', translations.apps?.webApp || 'Version Web')}
        </div>
        ${app.screenshots && app.screenshots.length > 0 ? `
            <button class="screenshots-btn" onclick="openScreenshots('${app.id}', '${name}')" data-i18n="apps.viewScreenshots">
                ${translations.apps?.viewScreenshots || 'Voir les captures d\'écran'}
            </button>
        ` : ''}
    `;

    return card;
}

// Create app link
function createAppLink(url, type, label) {
    if (!url || url.trim() === '') {
        return `<a href="#" class="app-link disabled" aria-disabled="true" onclick="return false;">${label}</a>`;
    }
    return `<a href="${url}" class="app-link" target="_blank" rel="noopener noreferrer" aria-label="${label}">${label}</a>`;
}

// Open screenshots modal
function openScreenshots(appId, appName) {
    const app = appsData.apps.find(a => a.id === appId);
    if (!app || !app.screenshots || app.screenshots.length === 0) return;

    const modal = document.getElementById('screenshot-modal');
    const modalTitle = document.getElementById('modal-title');
    const screenshotsGallery = document.getElementById('screenshots-gallery');

    if (!modal || !modalTitle || !screenshotsGallery) return;

    modalTitle.textContent = `${appName} - ${translations.apps?.viewScreenshots || 'Captures d\'écran'}`;
    screenshotsGallery.innerHTML = '';

    app.screenshots.forEach((screenshot, index) => {
        const screenshotItem = document.createElement('div');
        screenshotItem.className = 'screenshot-item';
        screenshotItem.innerHTML = `
            <img src="${screenshot}" alt="${appName} - Capture ${index + 1}" loading="lazy">
        `;
        screenshotsGallery.appendChild(screenshotItem);
    });

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('screenshot-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Make functions globally available
window.openScreenshots = openScreenshots;
window.closeModal = closeModal;

