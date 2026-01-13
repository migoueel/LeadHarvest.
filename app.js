// Minimal frontend JS for landing page lead capture
// Google Form integration (values come from generated env-config.js at runtime)
// Create a local `.env` and run `node scripts/generate-env.js` to produce `env-config.js`.
let GOOGLE_FORM_ACTION = 'REPLACE_WITH_GOOGLE_FORM_ACTION_URL';
let GOOGLE_FORM_EMAIL_ENTRY = 'REPLACE_WITH_GOOGLE_FORM_EMAIL_ENTRY_NAME';
if (typeof window !== 'undefined' && window.__ENV) {
    if (window.__ENV.GOOGLE_FORM_ACTION) GOOGLE_FORM_ACTION = window.__ENV.GOOGLE_FORM_ACTION;
    if (window.__ENV.GOOGLE_FORM_EMAIL_ENTRY) GOOGLE_FORM_EMAIL_ENTRY = window.__ENV.GOOGLE_FORM_EMAIL_ENTRY;
}

document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadCaptureForm');
    if (leadForm) leadForm.addEventListener('submit', handleLeadFormSubmit);
});

async function handleLeadFormSubmit(e) {
    e.preventDefault();
    const emailEl = document.getElementById('leadEmail');
    const statusEl = document.getElementById('leadStatus');
    if (!emailEl) return;
    const email = (emailEl.value || '').trim();
    if (!isValidEmail(email)) {
        if (statusEl) statusEl.textContent = 'Veuillez saisir une adresse e‑mail valide.';
        emailEl.focus();
        return;
    }

    if (GOOGLE_FORM_ACTION.includes('REPLACE_WITH')) {
        // Placeholder not configured: store locally as fallback and show thank you
        const stored = JSON.parse(localStorage.getItem('lead_signups') || '[]');
        stored.push({ email, ts: Date.now() });
        localStorage.setItem('lead_signups', JSON.stringify(stored));
        if (statusEl) statusEl.textContent = 'Merci — inscription enregistrée localement.';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 700);
        return;
    }

    try {
        const body = encodeURIComponent(GOOGLE_FORM_EMAIL_ENTRY) + '=' + encodeURIComponent(email);
        await fetch(GOOGLE_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: body
        });
        if (statusEl) statusEl.textContent = 'Merci ! Vous serez informé(e) par e‑mail.';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 700);
    } catch (err) {
        console.error('Lead submit error', err);
        if (statusEl) statusEl.textContent = 'Une erreur est survenue. Réessayez plus tard.';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
