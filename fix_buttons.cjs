const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

// Replace all occurrences of </div>\s*<button with <button
code = code.replace(/<\/div>\s*<button/g, '<button');
fs.writeFileSync('src/components/StudentPortal.tsx', code);
