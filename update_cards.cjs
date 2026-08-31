const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// Title size (was text-lg)
code = code.replace(/<h3 className=\{\`font-black text-lg/g, '<h3 className={`font-black text-base leading-tight');

// Tags section
const tagsTarget = `<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
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
                                  </div>`;

const tagsNew = `<div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                                    <span className={\`px-2 py-1 rounded-md text-gray-700 font-bold whitespace-nowrap border \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50 shadow-sm'}\`}>
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>
                                    <span className={\`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap shadow-sm \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                      <Dumbbell className="w-3.5 h-3.5 text-gray-400" />
                                      <strong className="text-gray-800">{ex.load || '0'} kg</strong> 
                                      <span className="text-[10px] text-gray-400">({dateLast})</span>
                                    </span>
                                    {(ex as any).isUnilateral && (
                                      <span className={\`px-2 py-1 rounded-md text-[#00AEEF] font-bold border whitespace-nowrap \${allCompleted ? 'bg-blue-50 border-blue-100' : 'bg-white/60 border-blue-200/50 shadow-sm'}\`}>
                                        E/D
                                      </span>
                                    )}
                                  </div>`;

code = code.replace(tagsTarget, tagsNew);

// Action buttons (Up/Down, Edit, Delete)
const buttonsTarget = `<button onClick={() => moveExercise(phase.id, exIndex, 'up')} disabled={exIndex === 0} className={\`p-1.5 rounded-lg transition-colors \${exIndex === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}\`}>
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'down')} disabled={exIndex === (data.phases[phase.id] || []).length - 1} className={\`p-1.5 rounded-lg transition-colors \${exIndex === (data.phases[phase.id] || []).length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}\`}>
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditMode(ex.id); setEditForm({ name: ex.name, sets: sets.length, reps: sets[0]?.actualReps || 0, load: sets[0]?.actualLoad || 0, isUnilateral: (ex as any).isUnilateral }); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm({phaseId: phase.id as any, exId: ex.id})} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>`;

const buttonsNew = `<button onClick={() => moveExercise(phase.id, exIndex, 'up')} disabled={exIndex === 0} className={\`p-2 rounded-xl transition-colors \${exIndex === 0 ? 'text-gray-200' : 'text-blue-400 hover:bg-blue-50'}\`}>
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'down')} disabled={exIndex === (data.phases[phase.id] || []).length - 1} className={\`p-2 rounded-xl transition-colors \${exIndex === (data.phases[phase.id] || []).length - 1 ? 'text-gray-200' : 'text-blue-400 hover:bg-blue-50'}\`}>
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditMode(ex.id); setEditForm({ name: ex.name, sets: sets.length, reps: sets[0]?.actualReps || 0, load: sets[0]?.actualLoad || 0, isUnilateral: (ex as any).isUnilateral }); }} className="p-2 text-orange-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm({phaseId: phase.id as any, exId: ex.id})} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>`;

code = code.replace(buttonsTarget, buttonsNew);

// Chevron and Check circle
const expandIconsTarget = `{allCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                                  {isExpanded ? <ChevronUp className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-600'}\`} /> : <ChevronDown className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-gray-400'}\`} />}`;

const expandIconsNew = `{allCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                                  {isExpanded ? <ChevronUp className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-[#00AEEF]'}\`} /> : <ChevronDown className={\`w-6 h-6 \${allCompleted ? 'text-red-300' : 'text-[#00AEEF]'}\`} />}`;

code = code.replace(expandIconsTarget, expandIconsNew);

// Fix title Força Principal -> Força
code = code.replace(/{ id: 'strength', title: 'Força Principal', icon: Dumbbell,/g, "{ id: 'strength', title: 'Força', icon: Dumbbell,");

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
