const fs = require('fs');

let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 1. Update SetExecution interface
code = code.replace(
`interface SetExecution {
  actualReps: number;
  actualLoad: number;
  completed: boolean;
}`,
`interface SetExecution {
  actualReps: number;
  actualLoad: number;
  actualRepsR?: number;
  actualLoadR?: number;
  completed: boolean;
}`
);

// 2. Fix the load input logic in the Add / Edit modal. Currently it says phase.id === 'strength' && ( NumberControl load )
code = code.replace(
`                        {phase.id === 'strength' && (
                          <NumberControl label="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} />
                        )}`,
`                        <NumberControl label="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} />
                        <div className="flex flex-col items-center justify-center pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase">
                            <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                            Unilateral (E/D)
                          </label>
                        </div>`
);

code = code.replace(
`                                  {phase.id === 'strength' && (
                                    <NumberControl label="Carga (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} />
                                  )}`,
`                                  <NumberControl label="Carga (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} />
                                  <div className="flex flex-col items-center justify-center pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase">
                                      <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                      Unilateral (E/D)
                                    </label>
                                  </div>`
);

// 3. Ensure the initial state of the form includes isUnilateral
code = code.replace(
`  const [newExForm, setNewExForm] = useState({ name: '', sets: 3, reps: 10, load: 0 });
  const [editForm, setEditForm] = useState({ id: '', name: '', sets: 3, reps: 10, load: 0 });`,
`  const [newExForm, setNewExForm] = useState({ name: '', sets: 3, reps: 10, load: 0, isUnilateral: false });
  const [editForm, setEditForm] = useState({ id: '', name: '', sets: 3, reps: 10, load: 0, isUnilateral: false });`
);

// Also saveNewExercise and saveEditExercise should include it
code = code.replace(
`    updateData({ phases: { ...data.phases, [phaseId]: [...(data.phases[phaseId] || []), { id: Date.now().toString(), name: newExForm.name, setsReps: \`\${newExForm.sets}x\${newExForm.reps}\`, time: \`\${newExForm.sets}x\${newExForm.reps}\`, load: newExForm.load.toString(), notes: '', feedback: '' }] } });`,
`    updateData({ phases: { ...data.phases, [phaseId]: [...(data.phases[phaseId] || []), { id: Date.now().toString(), name: newExForm.name, setsReps: \`\${newExForm.sets}x\${newExForm.reps}\`, time: \`\${newExForm.sets}x\${newExForm.reps}\`, load: newExForm.load.toString(), isUnilateral: newExForm.isUnilateral, notes: '', feedback: '' }] } });`
);

code = code.replace(
`      if (ex.id === editForm.id) return { ...ex, name: editForm.name, setsReps: \`\${editForm.sets}x\${editForm.reps}\`, time: \`\${editForm.sets}x\${editForm.reps}\`, load: editForm.load.toString() };`,
`      if (ex.id === editForm.id) return { ...ex, name: editForm.name, setsReps: \`\${editForm.sets}x\${editForm.reps}\`, time: \`\${editForm.sets}x\${editForm.reps}\`, load: editForm.load.toString(), isUnilateral: editForm.isUnilateral };`
);

code = code.replace(
`    setEditForm({
      id: ex.id,
      name: ex.name,
      sets: numSets,
      reps: defaultReps,
      load: defaultLoad
    });`,
`    setEditForm({
      id: ex.id,
      name: ex.name,
      sets: numSets,
      reps: defaultReps,
      load: defaultLoad,
      isUnilateral: (ex as any).isUnilateral || false
    });`
);

// 4. Quick Actions on collapsed card
// Right now they are inside {isExpanded && ( ... border-l ... button group )}
// We want to remove them from there and put them in the header.

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
