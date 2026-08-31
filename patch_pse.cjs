const fs = require('fs');
const file = 'src/components/WorkoutExecution.tsx';
let code = fs.readFileSync(file, 'utf8');

// I will rewrite WorkoutExecution to handle everything, so I'll just use a full file overwrite.
