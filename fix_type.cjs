const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

code = code.replace(
  "const [editForm, setEditForm] = useState({ name: '', sets: 3, reps: 10, load: 0 });",
  "const [editForm, setEditForm] = useState<{name: string, sets: number, reps: number, load: number, isUnilateral?: boolean}>({ name: '', sets: 3, reps: 10, load: 0 });"
);

code = code.replace(
  "const [newExForm, setNewExForm] = useState({ name: '', sets: 3, reps: 10, load: 0 });",
  "const [newExForm, setNewExForm] = useState<{name: string, sets: number, reps: number, load: number, isUnilateral?: boolean}>({ name: '', sets: 3, reps: 10, load: 0 });"
);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
