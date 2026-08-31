const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const oldSaveNew = 
`  const saveNewExercise = (phaseId: keyof WorkoutData['phases']) => {
    if (!newExForm.name.trim()) return;
    const newId = \`ex-\${Date.now()}\`;
    const setsRepsStr = \`\${newExForm.sets} x \${newExForm.reps}\`;
    
    if (phaseId === 'strength') {
      const newEx: StrengthExercise = { id: newId, name: newExForm.name, load: newExForm.load.toString(), setsReps: setsRepsStr, notes: '' };
      updateData({ phases: { ...data.phases, strength: [...(data.phases.strength || []), newEx] } });
    } else {
      const newEx: PhaseExercise = { id: newId, name: newExForm.name, time: setsRepsStr, feedback: '' };
      updateData({ phases: { ...data.phases, [phaseId]: [...(data.phases[phaseId] || []), newEx] } });
    }
    
    setIsAdding(null);
  };`;

const newSaveNew = 
`  const saveNewExercise = (phaseId: keyof WorkoutData['phases']) => {
    if (!newExForm.name.trim()) return;
    const newId = \`ex-\${Date.now()}\`;
    const setsRepsStr = \`\${newExForm.sets} x \${newExForm.reps}\`;
    
    // Using any to bypass strict type checking since we want to add load and isUnilateral everywhere now
    const newEx: any = { 
      id: newId, 
      name: newExForm.name, 
      setsReps: setsRepsStr, 
      time: setsRepsStr,
      load: newExForm.load.toString(),
      isUnilateral: newExForm.isUnilateral || false,
      notes: '', 
      feedback: '' 
    };
    
    updateData({ phases: { ...data.phases, [phaseId]: [...(data.phases[phaseId] || []), newEx] } });
    setIsAdding(null);
  };`;

code = code.replace(oldSaveNew, newSaveNew);
fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
