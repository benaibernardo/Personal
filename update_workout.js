import fs from 'fs';

let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 1. Number Control
code = code.replace(
`  const NumberControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex-1 flex flex-col items-center">
      <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</span>
      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shadow-sm w-full h-12">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
          className="flex-1 text-center font-black text-lg text-gray-800 bg-transparent border-none outline-none w-full"
        />
        <button type="button" onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
      </div>
    </div>
  );`,
`  const NumberControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex-1 flex flex-col items-center min-w-[70px]">
      <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">{label}</span>
      <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
          className="flex-1 min-w-[2rem] w-full text-center font-black text-xl text-gray-900 bg-transparent border-none outline-none p-0"
        />
        <button type="button" onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
      </div>
    </div>
  );`
);

// 2. Add Move Function and Imports
code = code.replace(
`import { 
  CheckCircle2, ChevronDown, ChevronUp, 
  Plus, Minus, MessageSquare, Activity, Trash2, Edit2, Save,
  Dumbbell, Zap, Wind, Move, Play, Pause, AlertTriangle, Undo, BellRing
} from 'lucide-react';`,
`import { 
  CheckCircle2, ChevronDown, ChevronUp, 
  Plus, Minus, MessageSquare, Activity, Trash2, Edit2, Save,
  Dumbbell, Zap, Wind, Move, Play, Pause, AlertTriangle, Undo, BellRing, ArrowUp, ArrowDown
} from 'lucide-react';`
);

const moveFunc = `
  const moveExercise = (phaseId: string, index: number, direction: 'up' | 'down') => {
    const pId = phaseId as keyof WorkoutData['phases'];
    const exercises = [...(data.phases[pId] || [])];
    if (direction === 'up' && index > 0) {
      [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
    } else {
      return;
    }
    updateData({ phases: { ...data.phases, [pId]: exercises } });
  };
`;

code = code.replace(
`  const getNextExerciseId = (currentId: string) => {`,
moveFunc + `\n  const getNextExerciseId = (currentId: string) => {`
);

// Add Move Buttons to isExpanded UI
code = code.replace(
`                                  <button onClick={() => startEditing(ex)} className="flex-1 p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setDeleteConfirm({ phaseId: phase.id as any, exId: ex.id })} className="flex-1 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>`,
`                                  <button onClick={() => moveExercise(phase.id, exIndex, 'up')} className="flex-1 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors" title="Mover Cima"><ArrowUp className="w-4 h-4" /></button>
                                  <button onClick={() => moveExercise(phase.id, exIndex, 'down')} className="flex-1 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors" title="Mover Baixo"><ArrowDown className="w-4 h-4" /></button>
                                  <button onClick={() => startEditing(ex)} className="flex-1 p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setDeleteConfirm({ phaseId: phase.id as any, exId: ex.id })} className="flex-1 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>`
);

// 3. Timer Backdrop
code = code.replace(
`                                                  {isMenuOpen && !isTimerRunning && (
                                                    <motion.div 
                                                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                                      className="absolute top-14 left-0 w-full z-10 bg-white border border-gray-200 shadow-xl rounded-xl p-2 space-y-2"
                                                    >`,
`                                                  {isMenuOpen && !isTimerRunning && (
                                                    <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setShowTimerMenu(null)} />
                                                    <motion.div 
                                                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                                      className="absolute top-14 left-0 w-full z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-2 space-y-2"
                                                    >`
);

code = code.replace(
`                                                    </motion.div>
                                                  )}`,
`                                                    </motion.div>
                                                    </>
                                                  )}`
);

// 4. Input layout inside actual execution rows
code = code.replace(
`                                                <div className={\`flex items-center bg-gray-50 rounded-xl border p-1 shadow-inner w-full transition-colors \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                  <input 
                                                    type="number"
                                                    value={set.actualReps}
                                                    onChange={(e) => {
                                                      const val = parseInt(e.target.value);
                                                      updateSet(ex.id, sIndex, 'actualReps', isNaN(val) ? 0 : val);
                                                    }}
                                                    className={\`flex-1 text-center font-black text-lg bg-transparent border-none outline-none w-full \${isTimerRunning ? 'text-red-600' : 'text-gray-950'}\`}
                                                  />
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                </div>`,
`                                                <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                  <input 
                                                    type="number"
                                                    value={set.actualReps}
                                                    onChange={(e) => {
                                                      const val = parseInt(e.target.value);
                                                      updateSet(ex.id, sIndex, 'actualReps', isNaN(val) ? 0 : val);
                                                    }}
                                                    className={\`flex-1 min-w-[2rem] w-full text-center font-black text-xl bg-transparent border-none outline-none p-0 \${isTimerRunning ? 'text-red-600' : 'text-gray-900'}\`}
                                                  />
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                </div>`
);

code = code.replace(
`                                                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shadow-inner w-full">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualLoad}
                                                      onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        updateSet(ex.id, sIndex, 'actualLoad', isNaN(val) ? 0 : val);
                                                      }}
                                                      className="flex-1 text-center font-black text-lg bg-transparent border-none outline-none text-gray-950 w-full"
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>`,
`                                                  <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualLoad}
                                                      onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        updateSet(ex.id, sIndex, 'actualLoad', isNaN(val) ? 0 : val);
                                                      }}
                                                      className="flex-1 min-w-[2rem] w-full text-center font-black text-xl text-gray-900 bg-transparent border-none outline-none p-0"
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>`
);


// 5. Autocomplete Library
const autocompleteLogic = `
  const getHistoricalExercises = (phaseId: string) => {
    const history = new Map<string, any>();
    const staticBasics: Record<string, any[]> = {
      mobility: [{name:'Mobilidade de Tornozelo', sets: 2, reps: 10, load: 0}, {name:'Passada Homem-Aranha', sets: 2, reps: 10, load: 0}, {name:'Gato e Vaca', sets: 2, reps: 12, load: 0}],
      activation: [{name:'Prancha Frontal', sets: 2, reps: 30, load: 0}, {name:'Ponte de Glúteo', sets: 2, reps: 15, load: 0}, {name:'Prancha Lateral', sets: 2, reps: 20, load: 0}],
      strength: [{name:'Agachamento Livre', sets: 3, reps: 10, load: 20}, {name:'Agachamento Goblet', sets: 3, reps: 10, load: 15}, {name:'Leg Press', sets: 3, reps: 10, load: 50}, {name:'Supino Reto', sets: 3, reps: 10, load: 20}, {name:'Remada Curvada', sets: 3, reps: 10, load: 20}, {name:'Cadeira Extensora', sets: 3, reps: 12, load: 30}, {name:'Stiff', sets: 3, reps: 10, load: 20}],
      deceleration: [{name:'Postura da Criança', sets: 1, reps: 60, load: 0}, {name:'Alongamento Peitoral', sets: 1, reps: 30, load: 0}, {name:'Pernas na Parede', sets: 1, reps: 60, load: 0}]
    };
    (staticBasics[phaseId] || []).forEach(ex => history.set(ex.name.toLowerCase(), ex));
    
    const pId = phaseId as keyof WorkoutData['phases'];
    const currentPhase = data.phases[pId] || [];
    currentPhase.forEach(ex => {
      const setsStr = ex.setsReps || ex.time || '3 x 10';
      const numSets = parseInt(setsStr.split('x')[0]) || 3;
      const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
      const defaultLoad = parseInt((ex as any).load) || 0;
      history.set(ex.name.toLowerCase(), { name: ex.name, sets: numSets, reps: defaultReps, load: defaultLoad });
    });
    return Array.from(history.values());
  };
`;

code = code.replace(
`  const getNextExerciseId = (currentId: string) => {`,
autocompleteLogic + `\n  const getNextExerciseId = (currentId: string) => {`
);

code = code.replace(
`                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Exercício</label>
                        <input type="text" placeholder="Ex: Agachamento Livre" value={newExForm.name} onChange={e => setNewExForm({...newExForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#00AEEF] focus:outline-none font-bold text-gray-800" />
                      </div>`,
`                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Exercício</label>
                        <input type="text" placeholder="Ex: Agachamento Livre" value={newExForm.name} onChange={e => setNewExForm({...newExForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#00AEEF] focus:outline-none font-bold text-gray-800" />
                        {newExForm.name.length > 1 && (
                          <div className="absolute z-50 w-full bg-white border border-gray-200 shadow-xl rounded-xl mt-1 max-h-48 overflow-y-auto">
                            {getHistoricalExercises(phase.id)
                              .filter(ex => ex.name.toLowerCase().includes(newExForm.name.toLowerCase()) && ex.name.toLowerCase() !== newExForm.name.toLowerCase())
                              .map((ex, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => setNewExForm({ ...newExForm, name: ex.name, sets: ex.sets, reps: ex.reps, load: ex.load })}
                                  className="w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                                >
                                  <span className="text-sm font-bold text-gray-900 block">{ex.name}</span>
                                  <span className="text-xs text-gray-500 font-medium">{ex.sets}x{ex.reps} {ex.load ? \`- \${ex.load}kg\` : ''}</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>`
);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);

