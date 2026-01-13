LeadHarvest — Phase 1 : Landing de validation

But: collecter des emails via Google Forms pour mesurer la conversion visite→email.

Configuration rapide (Google Form)
1. Créez un Google Form avec un seul champ **E-mail**.
2. Ouvrez le formulaire, cliquez sur les trois points > "Afficher le code source" ou utilisez l'option "Obtenir le lien" puis ouvrez la page publique du formulaire.
3. Inspectez le `<form>` HTML dans le navigateur (DevTools) et copiez :
   - l'attribut `action` (URL complète) → collez dans `app.js` en remplaçant `GOOGLE_FORM_ACTION`.
   - le `name` du champ e‑mail (quelque chose comme `entry.1234567890`) → collez dans `app.js` en remplaçant `GOOGLE_FORM_EMAIL_ENTRY`.

Exemple (app.js) :
- const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/123.../formResponse';
- const GOOGLE_FORM_EMAIL_ENTRY = 'entry.1234567890';

Notes techniques
- Le script utilise `fetch` en `mode: 'no-cors'` pour envoyer la requête vers Google Forms (fire-and-forget). Google Forms ne permet pas les requêtes cross-origin avec réponse lisible, donc l'envoi est silencieux côté client.
- Pour éviter de stocker les URLs en clair dans `app.js`, la configuration Google Form est maintenant chargée depuis un fichier généré `env-config.js` créé à partir d'un fichier local `.env` (voir instructions ci‑dessous).
- Si vous ne voulez pas utiliser Google Forms, vous pouvez déployer une fonction serverless et remplacer `GOOGLE_FORM_ACTION` par votre endpoint.
- Si `GOOGLE_FORM_ACTION` contient la valeur par défaut `REPLACE_WITH...`, les inscriptions sont stockées localement dans `localStorage` (clé `lead_signups`) pour débogage.

Générer `env-config.js` à partir d'un `.env`
1. Copiez `.env.example` en `.env` et remplissez les valeurs :
   - `GOOGLE_FORM_ACTION` : l'URL `action` du formulaire (ex: `https://docs.google.com/forms/d/e/ID/formResponse`)
   - `GOOGLE_FORM_EMAIL_ENTRY` : le `name` du champ e‑mail (ex: `entry.1234567890`)
2. Exécutez :

```bash
node scripts/generate-env.js
```

3. Le script génère `env-config.js` à la racine. `index.html` charge `env-config.js` avant `app.js`, et `app.js` lit `window.__ENV`.

Remarques de sécurité
- Ne committez pas votre `.env` (il est dans `.gitignore`). `env-config.js` est également ignoré par défaut.
- Le `.env` est uniquement pour la configuration côté développeur ; la valeur finale sera visible côté client (Google Forms), donc ne mettez pas d'informations sensibles non destinées au navigateur.

Déploiement
- Ce projet est une simple site statique. Pour la collecte via Google Forms, hébergement statique suffit (GitHub Pages, Netlify, Vercel, etc.).

RGPD / confidentialité
- Ajoutez votre politique de confidentialité si vous collectez des données personnelles. Le site affiche une petite note sous le CTA par défaut.

Questions
- Souhaitez-vous que je crée le Google Form de test et remplisse `.env` pour vous (je peux générer l'`action`/`entry.*`), ou préférez-vous fournir vos propres valeurs ?
