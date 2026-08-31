const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = 
`              <div className="flex gap-4 items-center">
                <button onClick={() => setShowFinishModal(true)} className="px-6 py-2.5 bg-[#00AEEF] hover:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Finalizar Sessão
                </button>
              </div>`;

const replaceStr = 
`              <div className="flex gap-4 items-center">
                <div className="flex items-center bg-[#051433] rounded-xl px-3 py-1.5 border border-blue-900/50">
                  <span className="text-xs font-bold text-blue-300 mr-2 uppercase">Treino:</span>
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
                    className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="Full Body" className="text-gray-900">Full Body</option>
                    <option value="Treino A" className="text-gray-900">Treino A</option>
                    <option value="Treino B" className="text-gray-900">Treino B</option>
                    <option value="Treino C" className="text-gray-900">Treino C</option>
                  </select>
                </div>
                <button onClick={() => setShowFinishModal(true)} className="px-6 py-2.5 bg-[#00AEEF] hover:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Finalizar Sessão
                </button>
              </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
