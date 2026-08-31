const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

// Remove the local safeStorage code
code = code.replace(/const safeStorage = \{[\s\S]*?\};\n/, '');

// Add the import
code = code.replace(/import \{ db, auth \} from '\.\.\/lib\/firebase';/, "import { db, auth } from '../lib/firebase';\nimport { safeStorage } from '../lib/storage';");

fs.writeFileSync('src/services/db.ts', code);
