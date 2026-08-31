const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Ficha Atual
const oldFicha = `<div className="bg-[#071D49] text-white px-5 py-3 flex items-center justify-between">
            <h2 className="font-bold text-lg tracking-wide flex items-center gap-2">
              <Dumbbell className="w-5 h-5" /> Ficha Atual
            </h2>
          </div>
          <div className="p-4 bg-blue-50/30 flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase">Selecione o Treino:</span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(data.routines || { 'Full Body': data.phases }).map(routineName => {
                const isSelected = (data.selectedRoutine || 'Full Body') === routineName;
                return (
                  <button
                    key={routineName}
                    onClick={() => {
                      if (isSelected) return;
                      const currentRoutine = data.selectedRoutine || 'Full Body';
                      const routines = data.routines || { 'Full Body': data.phases };
                      routines[currentRoutine] = data.phases;
                      const newPhases = routines[routineName] || { mobility: [], activation: [], strength: [], deceleration: [] };
                      updateData({ 
                        selectedRoutine: routineName,
                        routines,
                        phases: newPhases
                      });
                    }}
                    className={\`px-5 py-3 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center min-w-[100px] shadow-sm \${isSelected ? 'bg-[#00AEEF] border-[#00AEEF] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#00AEEF] hover:text-[#00AEEF]'}\`}
                  >
                    {routineName}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setShowNewRoutineModal(true);
                }}
                className="px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-500 hover:border-[#00AEEF] hover:text-[#00AEEF] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Novo Treino
              </button>
            </div>
          </div>`;

const newFicha = `<div className="bg-[#071D49] text-white px-5 py-3 flex items-center justify-between">
            <h2 className="font-bold text-lg tracking-wide flex items-center gap-2">
              <Dumbbell className="w-5 h-5" /> Ficha Atual
            </h2>
            <button
                onClick={() => {
                  setShowNewRoutineModal(true);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Novo Treino"
              >
                <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-blue-50/30">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 -mb-2 scrollbar-hide">
              {Object.keys(data.routines || { 'Full Body': data.phases }).map(routineName => {
                const isSelected = (data.selectedRoutine || 'Full Body') === routineName;
                return (
                  <button
                    key={routineName}
                    onClick={() => {
                      if (isSelected) return;
                      const currentRoutine = data.selectedRoutine || 'Full Body';
                      const routines = data.routines || { 'Full Body': data.phases };
                      routines[currentRoutine] = data.phases;
                      const newPhases = routines[routineName] || { mobility: [], activation: [], strength: [], deceleration: [] };
                      updateData({ 
                        selectedRoutine: routineName,
                        routines,
                        phases: newPhases
                      });
                    }}
                    className={\`snap-start flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center min-w-[110px] shadow-sm \${isSelected ? 'bg-[#00AEEF] border-[#00AEEF] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#00AEEF] hover:text-[#00AEEF]'}\`}
                  >
                    {routineName}
                  </button>
                );
              })}
            </div>
          </div>`;

code = code.replace(oldFicha, newFicha);

// Change PDF icon and button label "Concluir" and "Finalizar" (in PostWorkoutFeedback and App)
code = code.replace('<Printer className="w-5 h-5" />', '<FileText className="w-5 h-5" />');

// "Finalizar Sessão" -> "Finalizar"
code = code.replace("{isSaving ? 'Salvando...' : 'Finalizar Sessão'}", "{isSaving ? 'Salvando...' : 'Finalizar'}");

fs.writeFileSync('src/App.tsx', code);
