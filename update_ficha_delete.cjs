const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="flex flex-wrap gap-2">
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
                    className={\`px-5 py-2.5 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center min-w-[90px] shadow-sm flex-1 sm:flex-none \${isSelected ? 'bg-[#00AEEF] border-[#00AEEF] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#00AEEF] hover:text-[#00AEEF]'}\`}
                  >
                    {routineName}
                  </button>
                );
              })}
            </div>`;

const replacement = `<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(data.routines || { 'Full Body': data.phases }).map(routineName => {
                const isSelected = (data.selectedRoutine || 'Full Body') === routineName;
                const totalRoutines = Object.keys(data.routines || { 'Full Body': data.phases }).length;
                return (
                  <div key={routineName} className="relative w-full">
                    <button
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
                      className={\`w-full px-4 py-2.5 pr-8 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center shadow-sm \${isSelected ? 'bg-[#00AEEF] border-[#00AEEF] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#00AEEF] hover:text-[#00AEEF]'}\`}
                    >
                      <span className="truncate">{routineName}</span>
                    </button>
                    {totalRoutines > 1 && (
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
                    )}
                  </div>
                );
              })}
            </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
