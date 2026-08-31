const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 1. Quick Action Buttons
const toggleTarget = 
`                            <div className="w-full flex">
                              <button onClick={() => toggleExercise(ex.id)} className="flex-1 p-5 flex items-center justify-between text-left">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={\`text-xs font-black px-2 py-1 rounded-lg \${allCompleted ? 'bg-red-200/50 text-red-700' : 'bg-white text-gray-600 shadow-sm'}\`}>
                                      {exIndex + 1}
                                    </span>
                                    <h3 className={\`font-black text-lg transition-all \${allCompleted ? 'text-gray-400 line-through opacity-80' : 'text-gray-900'}\`}>
                                      {ex.name}
                                    </h3>
                                  </div>
                                  
                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                                    <span className={\`px-2 py-1 rounded-md text-gray-600 font-bold whitespace-nowrap border \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>
                                      <span className={\`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                        Última Carga: <strong className="text-orange-500">{ex.load || '0'} kg</strong> 
                                        <span className="text-[10px] text-gray-400">({dateLast})</span>
                                      </span>
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  {allCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                                  {isExpanded ? <ChevronUp className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-600'}\`} /> : <ChevronDown className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-400'}\`} />}
                                </div>
                              </button>
                                
                            </div>`;

const toggleNew = 
`                            <div className="w-full flex flex-col">
                              <button onClick={() => toggleExercise(ex.id)} className="flex-1 px-5 pt-5 pb-3 flex items-center justify-between text-left">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={\`text-xs font-black px-2 py-1 rounded-lg \${allCompleted ? 'bg-red-200/50 text-red-700' : 'bg-white text-gray-600 shadow-sm'}\`}>
                                      {exIndex + 1}
                                    </span>
                                    <h3 className={\`font-black text-lg transition-all \${allCompleted ? 'text-gray-400 line-through opacity-80' : 'text-gray-900'}\`}>
                                      {ex.name}
                                    </h3>
                                  </div>
                                  
                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                                    <span className={\`px-2 py-1 rounded-md text-gray-600 font-bold whitespace-nowrap border \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>
                                    <span className={\`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                      Última Carga: <strong className="text-orange-500">{ex.load || '0'} kg</strong> 
                                      <span className="text-[10px] text-gray-400">({dateLast})</span>
                                    </span>
                                    {(ex as any).isUnilateral && (
                                      <span className={\`px-2 py-1 rounded-md text-[#00AEEF] font-bold border whitespace-nowrap \${allCompleted ? 'bg-blue-50 border-blue-100' : 'bg-white/60 border-blue-200/50'}\`}>
                                        E/D
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  {allCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                                  {isExpanded ? <ChevronUp className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-600'}\`} /> : <ChevronDown className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-400'}\`} />}
                                </div>
                              </button>
                              
                              {/* Action Buttons Always Visible */}
                              <div className="flex items-center justify-end gap-2 px-5 pb-3">
                                <button onClick={() => moveExercise(phase.id, exIndex, 'up')} disabled={exIndex === 0} className={\`p-1.5 rounded-lg transition-colors \${exIndex === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}\`}>
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'down')} disabled={exIndex === (data.phases[phase.id as keyof WorkoutData['phases']]?.length || 1) - 1} className={\`p-1.5 rounded-lg transition-colors \${exIndex === (data.phases[phase.id as keyof WorkoutData['phases']]?.length || 1) - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}\`}>
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditMode(ex.id); setEditForm({ name: ex.name, sets: sets.length, reps: sets[0]?.actualReps || 0, load: sets[0]?.actualLoad || 0, isUnilateral: (ex as any).isUnilateral }); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm({phaseId: phase.id as any, exId: ex.id})} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>`;

code = code.replace(toggleTarget, toggleNew);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
