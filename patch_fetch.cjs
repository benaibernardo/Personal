const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

code = code.replace(/where\('instructorId', '==', uid\), /g, '');
fs.writeFileSync('src/services/db.ts', code);
