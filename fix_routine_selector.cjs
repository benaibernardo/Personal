const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `          <div className="p-4 bg-blue-50/30 flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase">Selecione o Treino:</span>
            <div className="flex-1 w-full">
              <select 
                value={data.selectedRoutine || 'Full Body'} 
                onChange={(e) => {
                  const newRoutine = e.target.value;
                  const currentRoutine = data.selectedRoutine || 'Full Body';
                  const routines = data.routines || { 'Full Body': data.phases };
                  routines[currentRoutine] = data.phases;
                  const newPhases = routines[newRoutine] || { mobility: [], activation: [], strength: [], deceleration: [] };
                  updateData({ 
                    selectedRoutine: newRoutine,
                    routines,
                    phases: newPhases
                  });
                }}
                className="w-full bg-white border-2 border-gray-200 rounded-xl p-3 font-black text-[#071D49] shadow-sm outline-none focus:border-[#00AEEF] transition-colors cursor-pointer"
              >
                <option value="Full Body">Full Body</option>
                <option value="Treino A">Treino A</option>
                <option value="Treino B">Treino B</option>
                <option value="Treino C">Treino C</option>
              </select>
            </div>
          </div>`;

const replaceStr = `          <div className="p-4 bg-blue-50/30 flex flex-col gap-3">
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
                  const name = window.prompt("Digite o nome do novo treino (ex: Treino D):");
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
                  }
                }}
                className="px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-500 hover:border-[#00AEEF] hover:text-[#00AEEF] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Novo Treino
              </button>
            </div>
          </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
