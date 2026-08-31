const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for delete confirm
if (!code.includes('const [deleteRoutineConfirm')) {
  code = code.replace(
    'const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);',
    'const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);\n  const [deleteRoutineConfirm, setDeleteRoutineConfirm] = useState<string | null>(null);'
  );
}

// 2. Add XCircle import if missing
if (!code.includes('AlertTriangle')) {
    code = code.replace("import { Printer, ", "import { AlertTriangle, Printer, ");
}

// 3. Update the button
const targetButton = `                    {totalRoutines > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(\`Deseja realmente excluir o treino "\${routineName}"?\`)) {
                            const routines = { ...data.routines };
                            delete routines[routineName];
                            let newSelected = data.selectedRoutine || 'Full Body';
                            let newPhases = data.phases;
                            if (newSelected === routineName) {
                              newSelected = Object.keys(routines)[0];
                              newPhases = routines[newSelected] || { mobility: [], activation: [], strength: [], deceleration: [] };
                            }
                            updateData({ 
                              selectedRoutine: newSelected,
                              routines,
                              phases: newPhases
                            });
                          }
                        }}
                        className={\`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors \${isSelected ? 'text-blue-100 hover:text-white hover:bg-blue-600/50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}\`}
                        title="Excluir treino"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}`;

const replacementButton = `                    {totalRoutines > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteRoutineConfirm(routineName);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 shadow-sm"
                        title="Excluir treino"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}`;

code = code.replace(targetButton, replacementButton);

// 4. Add the modal at the end of the return
const modalJSX = `      {/* DELETE ROUTINE CONFIRM */}
      {deleteRoutineConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-center text-[#071D49] mb-2">Excluir Treino?</h3>
            <p className="text-gray-500 text-[13px] text-center mb-6">Essa ação excluirá toda a ficha "{deleteRoutineConfirm}" e não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRoutineConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform">Cancelar</button>
              <button 
                onClick={() => {
                  const routines = { ...data.routines };
                  delete routines[deleteRoutineConfirm];
                  let newSelected = data.selectedRoutine || 'Full Body';
                  let newPhases = data.phases;
                  if (newSelected === deleteRoutineConfirm) {
                    newSelected = Object.keys(routines)[0];
                    newPhases = routines[newSelected] || { mobility: [], activation: [], strength: [], deceleration: [] };
                  }
                  updateData({ 
                    selectedRoutine: newSelected,
                    routines,
                    phases: newPhases
                  });
                  setDeleteRoutineConfirm(null);
                }} 
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 transition-transform"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW ROUTINE MODAL */}`;

code = code.replace('{/* NEW ROUTINE MODAL */}', modalJSX);

fs.writeFileSync('src/App.tsx', code);
