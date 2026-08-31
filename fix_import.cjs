const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

if (!code.includes('GripVertical')) {
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/s, (match, p1) => {
    return "import {" + p1 + ", GripVertical} from 'lucide-react';";
  });
  fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
}
