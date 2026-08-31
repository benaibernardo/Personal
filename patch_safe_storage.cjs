const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

// replace all localStorage with safeStorage
code = code.replace(/localStorage\.getItem/g, 'safeStorage.getItem');
code = code.replace(/localStorage\.setItem/g, 'safeStorage.setItem');
code = code.replace(/localStorage\.removeItem/g, 'safeStorage.removeItem');

// Add safeStorage definition at the top if it doesn't exist
if (!code.includes('safeStorage')) {
  const safeStorageCode = `
const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch (e) {}
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch (e) {}
  }
};
`;
  code = code.replace(/import \{ db, auth \} from '\.\.\/lib\/firebase';/, "import { db, auth } from '../lib/firebase';" + safeStorageCode);
}

fs.writeFileSync('src/services/db.ts', code);
