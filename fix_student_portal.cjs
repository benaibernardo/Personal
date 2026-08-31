const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');
if (!code.includes('Trash2')) {
  code = code.replace("import { Play, Pause, X, AlertTriangle", "import { Play, Pause, X, AlertTriangle, Trash2");
}
fs.writeFileSync('src/components/StudentPortal.tsx', code);
