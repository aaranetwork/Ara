const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');

console.log('Checking ' + envPath);

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file NOT found');
    process.exit(1);
}

console.log('✅ .env.local file found');
const content = fs.readFileSync(envPath, 'utf8');

const vars = {};
content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value && value.length > 0) {
            vars[key] = true;
        }
    }
});

const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
];

let allPresent = true;
required.forEach(req => {
    if (vars[req]) {
        console.log(`✅ ${req} is present`);
    } else {
        console.log(`❌ ${req} is MISSING or empty`);
        allPresent = false;
    }
});

if (allPresent) {
    console.log('All required environment variables appear to be present in .env.local');
} else {
    console.log('Some required environment variables are missing.');
}
