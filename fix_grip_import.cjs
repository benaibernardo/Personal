const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

if (!code.includes('GripVertical}')) {
  code = code.replace("ArrowDown\n} from 'lucide-react';", "ArrowDown,\n  GripVertical\n} from 'lucide-react';");
  fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
}
