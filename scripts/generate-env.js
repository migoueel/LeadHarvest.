const fs = require('fs');
const path = require('path');

// Simple .env parser (KEY=VALUE lines)
function parseEnv(content) {
  const lines = content.split(/\r?\n/);
  const obj = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    // Remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    obj[key] = val;
  }
  return obj;
}

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'env-config.js');

if (!fs.existsSync(envPath)) {
  console.error('.env not found at', envPath);
  console.error('Create a .env file (see .env.example) and run this script again.');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const vars = parseEnv(content);

const envObj = {
  GOOGLE_FORM_ACTION: vars.GOOGLE_FORM_ACTION || '',
  GOOGLE_FORM_EMAIL_ENTRY: vars.GOOGLE_FORM_EMAIL_ENTRY || '',
  GOOGLE_FORM_BUSINESS_ENTRY: vars.GOOGLE_FORM_BUSINESS_ENTRY || '',
  GOOGLE_FORM_VALUABLE_ENTRY: vars.GOOGLE_FORM_VALUABLE_ENTRY || ''
};

const out = `// Generated file — do not edit (run scripts/generate-env.js)
window.__ENV = ${JSON.stringify(envObj, null, 2)};\n`;

fs.writeFileSync(outPath, out, 'utf8');
console.log('Generated', outPath);
