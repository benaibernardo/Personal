const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const oldSaveEdit = 
`  const saveEditExercise = (phaseId: keyof WorkoutData['phases'], exId: string) => {
    if (!editForm.name.trim()) return;
    const setsRepsStr = \`\${editForm.sets} x \${editForm.reps}\`;
    
    const updates = phaseId === 'strength' 
      ? { name: editForm.name, setsReps: setsRepsStr, load: editForm.load.toString() }
      : { name: editForm.name, time: setsRepsStr };
      
    const updated = data.phases[phaseId].map((ex: any) => ex.id === exId ? { ...ex, ...updates } : ex);
    updateData({ phases: { ...data.phases, [phaseId]: updated } });
    setEditMode(null);`;

const newSaveEdit = 
`  const saveEditExercise = (phaseId: keyof WorkoutData['phases'], exId: string) => {
    if (!editForm.name.trim()) return;
    const setsRepsStr = \`\${editForm.sets} x \${editForm.reps}\`;
    
    const updates = { 
      name: editForm.name, 
      setsReps: setsRepsStr, 
      time: setsRepsStr, // Set both to be safe
      load: editForm.load.toString(),
      isUnilateral: editForm.isUnilateral
    };
      
    const updated = data.phases[phaseId].map((ex: any) => ex.id === exId ? { ...ex, ...updates } : ex);
    updateData({ phases: { ...data.phases, [phaseId]: updated } });
    setEditMode(null);`;

code = code.replace(oldSaveEdit, newSaveEdit);
fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
