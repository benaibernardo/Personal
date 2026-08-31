const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { Printer, RotateCcw, ArrowLeft, CheckCircle2, BrainCircuit, HeartPulse, Dumbbell, Plus } from 'lucide-react';",
  "import { Printer, RotateCcw, ArrowLeft, CheckCircle2, BrainCircuit, HeartPulse, Dumbbell, Plus, X, MessageSquare, Check, XCircle, Save, Layers, Clock, Repeat } from 'lucide-react';"
);

// Condense titles in Anamnesis and use auto-resize textarea
code = code.replace(
  `<BrainCircuit className="w-4 h-4" /> Gatilhos Pré-Treino`,
  `<BrainCircuit className="w-4 h-4" /> Gatilhos`
);
code = code.replace(
  `<HeartPulse className="w-4 h-4" /> Saúde / Restrições`,
  `<HeartPulse className="w-4 h-4" /> Restrições`
);
code = code.replace(
  `<BrainCircuit className="w-4 h-4" /> Notas Pós-Anamnese`,
  `<MessageSquare className="w-4 h-4" /> Notas`
);

// Add onInput for textareas
code = code.replace(/<textarea([^>]*?)className="([^"]*?)min-h-\[60px\]"([^>]*?)\/>/g, (match, p1, p2, p3) => {
  return `<textarea${p1}className="${p2}min-h-[40px] overflow-hidden resize-none"${p3} onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }} />`;
});

// Update Novo Treino Modal logic
// First add state to InstructorWorkout component
const stateHookPos = code.indexOf('const [isSaving, setIsSaving] = useState(false);');
if (stateHookPos !== -1) {
  code = code.substring(0, stateHookPos) + 
    "const [isSaving, setIsSaving] = useState(false);\n  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);\n  const [newRoutineName, setNewRoutineName] = useState('');\n" + 
    code.substring(stateHookPos + 'const [isSaving, setIsSaving] = useState(false);'.length);
}

// Replace the prompt logic with setting state
const promptTarget = `const name = window.prompt("Digite o nome do novo treino (ex: Treino D):");
                  if (name && name.trim()) {
                    const newRoutine = name.trim();
                    const currentRoutine = data.selectedRoutine || 'Full Body';
                    const routines = data.routines || { 'Full Body': data.phases };
                    // Save current
                    routines[currentRoutine] = data.phases;
                    // Initialize new if not exists
                    if (!routines[newRoutine]) {
                      routines[newRoutine] = { mobility: [], activation: [], strength: [], deceleration: [] };
                    }
                    updateData({ 
                      selectedRoutine: newRoutine,
                      routines,
                      phases: routines[newRoutine]
                    });
                  }`;

const promptReplacement = `setShowNewRoutineModal(true);`;
code = code.replace(promptTarget, promptReplacement);

// Add modal JSX at the end of the return (before closing div)
// Let's find the `{showFinishModal && (` and put it before that
const finishModalPos = code.indexOf('{showFinishModal && (');
if (finishModalPos !== -1) {
  const newRoutineModalJSX = `
      {/* NOVO TREINO MODAL */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 text-center bg-blue-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-500">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Novo Treino</h2>
              <p className="text-sm text-gray-500 mt-1">Digite o nome da nova aba de treino.</p>
            </div>
            <div className="p-5">
              <input 
                autoFocus
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Ex: Treino C"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newRoutineName.trim()) {
                    const newRoutine = newRoutineName.trim();
                    const currentRoutine = data.selectedRoutine || 'Full Body';
                    const routines = data.routines || { 'Full Body': data.phases };
                    routines[currentRoutine] = data.phases;
                    if (!routines[newRoutine]) {
                      routines[newRoutine] = { mobility: [], activation: [], strength: [], deceleration: [] };
                    }
                    updateData({ 
                      selectedRoutine: newRoutine,
                      routines,
                      phases: routines[newRoutine]
                    });
                    setNewRoutineName('');
                    setShowNewRoutineModal(false);
                  }
                }}
              />
              <div className="flex gap-3 mt-5">
                <button 
                  onClick={() => {
                    setNewRoutineName('');
                    setShowNewRoutineModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4"/> Cancelar
                </button>
                <button 
                  disabled={!newRoutineName.trim()}
                  onClick={() => {
                    if (newRoutineName.trim()) {
                      const newRoutine = newRoutineName.trim();
                      const currentRoutine = data.selectedRoutine || 'Full Body';
                      const routines = data.routines || { 'Full Body': data.phases };
                      routines[currentRoutine] = data.phases;
                      if (!routines[newRoutine]) {
                        routines[newRoutine] = { mobility: [], activation: [], strength: [], deceleration: [] };
                      }
                      updateData({ 
                        selectedRoutine: newRoutine,
                        routines,
                        phases: routines[newRoutine]
                      });
                      setNewRoutineName('');
                      setShowNewRoutineModal(false);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-[#00AEEF] text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4"/> Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;
  code = code.substring(0, finishModalPos) + newRoutineModalJSX + code.substring(finishModalPos);
}

fs.writeFileSync('src/App.tsx', code);
