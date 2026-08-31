const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 4. Quick Actions on unexpanded rows
// We have this:
// <div className="flex items-center gap-3">
//   {allCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
//   <div className="flex flex-col">
//     <span className="font-bold text-gray-800 text-sm">{ex.name}</span>
//     <span className="text-xs text-gray-500">{ex.setsReps || ex.time || ''} {ex.load ? \`- \${ex.load}kg\` : ''}</span>
//   </div>
// </div>

const targetQuickActions = 
`                              {isExpanded && (
                                <div className="flex flex-col border-l border-gray-200/50 bg-white/30">
                                  <button onClick={() => moveExercise(phase.id, exIndex, 'up')} className="flex-1 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors" title="Mover Cima"><ArrowUp className="w-4 h-4" /></button>
                                  <button onClick={() => moveExercise(phase.id, exIndex, 'down')} className="flex-1 p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors" title="Mover Baixo"><ArrowDown className="w-4 h-4" /></button>
                                  <button onClick={() => startEditing(ex)} className="flex-1 p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setDeleteConfirm({ phaseId: phase.id as any, exId: ex.id })} className="flex-1 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              )}`;

code = code.replace(targetQuickActions, '');

const targetHeader = 
`                            <div 
                              className={\`flex-1 p-4 flex items-center justify-between cursor-pointer \${isExpanded ? 'bg-gray-50' : ''}\`}
                              onClick={() => !isEditing && toggleExercise(ex.id)}
                            >
                              <div className="flex items-center gap-3">
                                {allCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-800 text-sm">{ex.name}</span>
                                  <span className="text-xs text-gray-500">{ex.setsReps || ex.time || ''} {ex.load ? \`- \${ex.load}kg\` : ''}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{completedSets}/{totalSets}</span>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                              </div>
                            </div>`;

const newHeader = 
`                            <div 
                              className={\`flex-1 p-4 flex flex-col justify-center cursor-pointer \${isExpanded ? 'bg-gray-50' : ''}\`}
                            >
                              <div className="flex items-center justify-between" onClick={() => !isEditing && toggleExercise(ex.id)}>
                                <div className="flex items-center gap-3">
                                  {allCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />}
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm leading-tight">{ex.name}</span>
                                    <span className="text-xs text-gray-500 mt-0.5">
                                      {ex.setsReps || ex.time || ''} {ex.load ? \`- \${ex.load}kg\` : ''} 
                                      {(ex as any).isUnilateral && <span className="ml-1 text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded uppercase font-bold">Uni</span>}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{completedSets}/{totalSets}</span>
                                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'up')} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Mover Cima"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'down')} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Mover Baixo"><ArrowDown className="w-4 h-4" /></button>
                                <div className="flex-1"></div>
                                <button onClick={() => startEditing(ex)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteConfirm({ phaseId: phase.id as any, exId: ex.id })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>`;

code = code.replace(targetHeader, newHeader);

// 5. Unilateral rendering inside the execution loops
const loadInputRow = 
`                                            <div className="flex gap-2">
                                              <div className="flex-[2] relative">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block ml-1">Reps/Tempo</span>
                                                <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
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
                                                </div>`;

const newLoadInputRow = 
`                                            {(ex as any).isUnilateral ? (
                                              <div className="flex flex-col gap-2 w-full">
                                                <div className="flex gap-2 w-full">
                                                  <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-400 uppercase bg-gray-50 rounded-lg border border-gray-100">Esq</div>
                                                  <div className="flex-1 flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm transition-colors h-12 border-gray-200">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
                                                    <input type="number" value={set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg bg-transparent border-none outline-none p-0 text-gray-900" />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
                                                  </div>
                                                  <div className="flex-1 flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm h-12">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
                                                    <input type="number" value={set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoad', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent border-none outline-none p-0" />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
                                                  </div>
                                                </div>
                                                <div className="flex gap-2 w-full">
                                                  <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-400 uppercase bg-gray-50 rounded-lg border border-gray-100">Dir</div>
                                                  <div className="flex-1 flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm transition-colors h-12 border-gray-200">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualRepsR', -1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
                                                    <input type="number" value={set.actualRepsR ?? set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualRepsR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg bg-transparent border-none outline-none p-0 text-gray-900" />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualRepsR', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
                                                  </div>
                                                  <div className="flex-1 flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm h-12">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
                                                    <input type="number" value={set.actualLoadR ?? set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoadR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent border-none outline-none p-0" />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', 1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
                                                  </div>
                                                </div>
                                            </div>
                                            ) : (
                                            <div className="flex gap-2">
                                              <div className="flex-[2] relative">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block ml-1">Reps/Tempo</span>
                                                <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
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
                                                </div>`;

code = code.replace(loadInputRow, newLoadInputRow);

// Also need to close the ternary condition at the end of the load input row.
// We have:
//                                               {phase.id === 'strength' && (
//                                                 <div className="flex-1 flex flex-col items-center">
//                                                   ... load logic ...
//                                                 </div>
//                                               )}
//                                             </div>
//                                           </motion.div>

const oldLoadEnd = `                                                </div>
                                              )}
                                            </div>`;

const newLoadEnd = `                                                </div>
                                              )}
                                            </div>
                                            )}`;

code = code.replace(oldLoadEnd, newLoadEnd);

// Fix the adjustValue function to support actualRepsR and actualLoadR
code = code.replace(
`  const adjustValue = (exId: string, setIndex: number, field: 'actualReps' | 'actualLoad', delta: number) => {
    updateSet(exId, setIndex, field, Math.max(0, (executionData[exId]?.[setIndex]?.[field] || 0) + delta));
  };`,
`  const adjustValue = (exId: string, setIndex: number, field: 'actualReps' | 'actualLoad' | 'actualRepsR' | 'actualLoadR', delta: number) => {
    updateSet(exId, setIndex, field, Math.max(0, (executionData[exId]?.[setIndex]?.[field] || 0) + delta));
  };`
);


fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
