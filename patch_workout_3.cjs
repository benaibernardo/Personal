const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const oldGetHistory = 
`    const pId = phaseId as keyof WorkoutData['phases'];
    const currentPhase = data.phases[pId] || [];
    currentPhase.forEach(ex => {
      const setsStr = ex.setsReps || ex.time || '3 x 10';
      const numSets = parseInt(setsStr.split('x')[0]) || 3;
      const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
      const defaultLoad = parseInt((ex as any).load) || 0;
      history.set(ex.name.toLowerCase(), { name: ex.name, sets: numSets, reps: defaultReps, load: defaultLoad });
    });
    return Array.from(history.values());`;

const newGetHistory = 
`    const pId = phaseId as keyof WorkoutData['phases'];
    
    // Check current phase
    const currentPhase = data.phases[pId] || [];
    
    // Check all routines history if available
    const allRoutines = (data as any).routines ? Object.values((data as any).routines) : [];
    
    const extractExercises = (phaseList: any[]) => {
      (phaseList || []).forEach(ex => {
        const setsStr = ex.setsReps || ex.time || '3 x 10';
        const numSets = parseInt(setsStr.split('x')[0]) || 3;
        const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
        const defaultLoad = parseInt(ex.load) || 0;
        history.set(ex.name.toLowerCase(), { name: ex.name, sets: numSets, reps: defaultReps, load: defaultLoad, isUnilateral: ex.isUnilateral || false });
      });
    };
    
    // Extract from current phase
    extractExercises(currentPhase);
    
    // Extract from all other routines to build a persistent memory dictionary
    allRoutines.forEach((routine: any) => {
      extractExercises(routine[pId]);
    });
    
    return Array.from(history.values());`;

code = code.replace(oldGetHistory, newGetHistory);

// And update the button onClick to also apply isUnilateral if known
const oldBtn = `onClick={() => setNewExForm({ ...newExForm, name: ex.name, sets: ex.sets, reps: ex.reps, load: ex.load })}`;
const newBtn = `onClick={() => setNewExForm({ ...newExForm, name: ex.name, sets: ex.sets, reps: ex.reps, load: ex.load, isUnilateral: ex.isUnilateral || false })}`;
code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
