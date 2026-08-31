const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf8');

if (!code.includes('ClipboardList')) {
  code = code.replace(/import \{([^}]+)\}\s+from\s+'lucide-react';/, "import { $1, ClipboardList } from 'lucide-react';");
  fs.writeFileSync('src/components/StudentDashboard.tsx', code);
}
