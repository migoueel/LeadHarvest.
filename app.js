// Minimal frontend JS for landing page lead capture
// Google Form integration (values come from generated env-config.js at runtime)
// Create a local `.env` and run `node scripts/generate-env.js` to produce `env-config.js`.
let GOOGLE_FORM_ACTION = 'REPLACE_WITH_GOOGLE_FORM_ACTION_URL';
let GOOGLE_FORM_EMAIL_ENTRY = 'REPLACE_WITH_GOOGLE_FORM_EMAIL_ENTRY_NAME';
let GOOGLE_FORM_BUSINESS_ENTRY = 'REPLACE_WITH_GOOGLE_FORM_BUSINESS_ENTRY_NAME';
let GOOGLE_FORM_VALUABLE_ENTRY = 'REPLACE_WITH_GOOGLE_FORM_VALUABLE_ENTRY_NAME';
if (typeof window !== 'undefined' && window.__ENV) {
    if (window.__ENV.GOOGLE_FORM_ACTION) GOOGLE_FORM_ACTION = window.__ENV.GOOGLE_FORM_ACTION;
    if (window.__ENV.GOOGLE_FORM_EMAIL_ENTRY) GOOGLE_FORM_EMAIL_ENTRY = window.__ENV.GOOGLE_FORM_EMAIL_ENTRY;
    if (window.__ENV.GOOGLE_FORM_BUSINESS_ENTRY) GOOGLE_FORM_BUSINESS_ENTRY = window.__ENV.GOOGLE_FORM_BUSINESS_ENTRY;
    if (window.__ENV.GOOGLE_FORM_VALUABLE_ENTRY) GOOGLE_FORM_VALUABLE_ENTRY = window.__ENV.GOOGLE_FORM_VALUABLE_ENTRY;
}

// --- Simple translations object and runtime language switching ---
const translations = {
    fr: {
        pageTitle: 'LeadHarvest. — Préinscription BETA',
        heroTitle: 'Collectez des prospects locaux — simplement.',
        heroSub: 'Inscrivez-vous gratuitement pour être informé du lancement de la BETA et accéder en priorité.',
        emailLabel: 'Votre adresse e‑mail :',
        emailPlaceholder: 'Ex : jean@exemple.com',
        businessLabel: 'Pour quel type de business avez-vous besoin de ces leads ?',
        businessPlaceholder: 'Ex : Vente de logiciels aux cliniques, Marketing pour un labo, Recrutement médical...',
        valuableLabel: "Quelle est la donnée la plus précieuse que vous voulez avoir en plus des données actuelles ?",
        valuablePlaceholder: 'Ex : Nom du gérant, Mail, Profil linkedin associés, Taille de l\'établissement...',
        ctaPrimary: "Je m'inscris à la BETA",
        leadNote: "Nous n'enverrons pas de spam. Vos données servent uniquement à la BETA. Annulation possible à tout moment.",
        invalidEmail: "Veuillez saisir une adresse e‑mail valide.",
        submitError: "Une erreur est survenue. Réessayez plus tard.",
        thankYouTitle: 'Merci — vous êtes inscrit(e) !',
        thankYouDesc: "Nous vous enverrons un e‑mail de confirmation. Vous serez bientôt recontactés (n'oubliez pas de consulter vos spams !).",
        backToSite: 'Retour au site',
        thankyouPageTitle: 'Merci — LeadHarvest. BETA'
    },
    en: {
        pageTitle: 'LeadHarvest. — Beta Pre‑signup',
        heroTitle: 'Collect local leads — simply.',
        heroSub: 'Sign up for free to get notified when the BETA launches and get early access.',
        emailLabel: 'Your email address:',
        emailPlaceholder: 'e.g. jean@example.com',
        businessLabel: 'What type of business do you need these leads for?',
        businessPlaceholder: 'e.g. Selling software to clinics, Marketing for a lab, Medical recruitment...',
        valuableLabel: 'Which additional data point would be most valuable for you?',
        valuablePlaceholder: 'e.g. Owner name, Email, LinkedIn profile, Facility size...',
        ctaPrimary: 'Join the BETA',
        leadNote: "We won't send spam. Your data is used only for the BETA. You can unsubscribe anytime.",
        invalidEmail: 'Please enter a valid email address.',
        submitError: 'An error occurred. Please try again later.',
        thankYouTitle: 'Thanks — you are signed up!',
        thankYouDesc: "We'll send a confirmation email. You'll be contacted soon (check your spam folder!).",
        backToSite: 'Back to site',
        thankyouPageTitle: 'Thanks — LeadHarvest. BETA'
    }
};

let currentLang = (localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'fr'));

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || '';
}

function applyTranslations() {
    // title
    const titleEl = document.querySelector('title[data-i18n], title');
    if (titleEl) {
        const key = titleEl.getAttribute && titleEl.getAttribute('data-i18n');
        document.title = key ? (translations[currentLang][key] || document.title) : document.title;
    }

    // elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && translations[currentLang] && translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });

    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && translations[currentLang] && translations[currentLang][key]) el.placeholder = translations[currentLang][key];
    });

    // aria-labels via data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (key && translations[currentLang] && translations[currentLang][key]) el.setAttribute('aria-label', translations[currentLang][key]);
    });

    // set html lang
    try { document.documentElement.lang = currentLang; } catch (e) {}

    // highlight active language button(s)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) btn.classList.add('active'); else btn.classList.remove('active');
    });

    // special: update meta title if present
    if (translations[currentLang] && translations[currentLang].pageTitle) document.title = translations[currentLang].pageTitle;
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
}

// Attach click handlers to language buttons (delegated when DOM ready)
function setupLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const l = btn.getAttribute('data-lang');
            setLanguage(l);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize language UI and translations
    setupLangSwitcher();
    applyTranslations();

    const leadForm = document.getElementById('leadCaptureForm');
    if (leadForm) leadForm.addEventListener('submit', handleLeadFormSubmit);
});

async function handleLeadFormSubmit(e) {
    e.preventDefault();
    const emailEl = document.getElementById('leadEmail');
    const statusEl = document.getElementById('leadStatus');
    if (!emailEl) return;
    const email = (emailEl.value || '').trim();
    const businessEl = document.getElementById('businessType');
    const valuableEl = document.getElementById('valuableData');
    const business = (businessEl && businessEl.value) ? businessEl.value.trim() : '';
    const valuable = (valuableEl && valuableEl.value) ? valuableEl.value.trim() : '';
    if (!isValidEmail(email)) {
        if (statusEl) statusEl.textContent = t('invalidEmail');
        emailEl.focus();
        return;
    }

    if (GOOGLE_FORM_ACTION.includes('REPLACE_WITH')) {
        // Placeholder not configured: store locally as fallback and show thank you
        const stored = JSON.parse(localStorage.getItem('lead_signups') || '[]');
        stored.push({ email, business_type: business, valuable_data: valuable, ts: Date.now() });
        localStorage.setItem('lead_signups', JSON.stringify(stored));
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 700);
        return;
    }

    try {
        const parts = [];
        if (GOOGLE_FORM_EMAIL_ENTRY && !GOOGLE_FORM_EMAIL_ENTRY.includes('REPLACE_WITH')) parts.push(encodeURIComponent(GOOGLE_FORM_EMAIL_ENTRY) + '=' + encodeURIComponent(email));
        if (GOOGLE_FORM_BUSINESS_ENTRY && !GOOGLE_FORM_BUSINESS_ENTRY.includes('REPLACE_WITH') && business) parts.push(encodeURIComponent(GOOGLE_FORM_BUSINESS_ENTRY) + '=' + encodeURIComponent(business));
        if (GOOGLE_FORM_VALUABLE_ENTRY && !GOOGLE_FORM_VALUABLE_ENTRY.includes('REPLACE_WITH') && valuable) parts.push(encodeURIComponent(GOOGLE_FORM_VALUABLE_ENTRY) + '=' + encodeURIComponent(valuable));
        const body = parts.join('&');
        await fetch(GOOGLE_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: body
        });
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 700);
    } catch (err) {
        console.error('Lead submit error', err);
        if (statusEl) statusEl.textContent = t('submitError');
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
