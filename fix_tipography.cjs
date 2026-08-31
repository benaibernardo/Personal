const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
let workout = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// For App.tsx
// Títulos das gavetas: text-sm font-black -> text-xs font-black
app = app.replace(/text-sm font-black text-purple-700/g, 'text-xs font-black text-purple-700');
app = app.replace(/text-sm font-black text-red-700/g, 'text-xs font-black text-red-700');
app = app.replace(/text-sm font-black text-gray-700/g, 'text-xs font-black text-gray-700');

// text-lg -> text-base (for Ficha Atual title, etc)
app = app.replace(/text-lg /g, 'text-base ');
app = app.replace(/text-xl /g, 'text-lg ');
app = app.replace(/text-2xl /g, 'text-xl ');
app = app.replace(/text-3xl /g, 'text-2xl ');
app = app.replace(/text-sm /g, 'text-[13px] ');

// WorkoutExecution.tsx
workout = workout.replace(/text-lg /g, 'text-base ');
workout = workout.replace(/text-xl /g, 'text-lg ');
workout = workout.replace(/text-2xl /g, 'text-xl ');
workout = workout.replace(/text-sm /g, 'text-[13px] ');

fs.writeFileSync('src/App.tsx', app);
fs.writeFileSync('src/components/WorkoutExecution.tsx', workout);
