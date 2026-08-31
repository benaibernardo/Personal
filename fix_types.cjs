const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

// I need to find SetProgress interface if it exists, or maybe it's declared in WorkoutExecution.tsx?
// Oh wait, `actualRepsR` and `actualLoadR` are being passed to `updateSet` and `adjustValue`.
// Let's check WorkoutExecution.tsx where updateSet is defined.
