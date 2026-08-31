const fs = require('fs');

let code = fs.readFileSync('src/types.ts', 'utf8');

// Add unilateral to exercises
code = code.replace(
  '  time: string;',
  '  time: string;\n  isUnilateral?: boolean;'
);

code = code.replace(
  '  load: string;',
  '  load: string;\n  isUnilateral?: boolean;'
);

// Add executionData to SessionLog
code = code.replace(
  '  instructorId?: string; // Set by firestore rules/auth\n}',
  '  instructorId?: string; // Set by firestore rules/auth\n  workoutData?: any;\n}'
);

// Add selectedRoutine to WorkoutData
code = code.replace(
  '  studentName?: string;',
  '  studentName?: string;\n  selectedRoutine?: string;\n  routines?: Record<string, { mobility: PhaseExercise[], activation: PhaseExercise[], strength: StrengthExercise[], deceleration: PhaseExercise[] }>;'
);

fs.writeFileSync('src/types.ts', code);
