const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const editFormTarget = `<div className="flex gap-4">
                                <NumberControl label="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                <NumberControl label="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                <NumberControl label="Carga (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} />
                                <div className="flex flex-col items-center justify-center pt-2">
                                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase">
                                    <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                    Unilateral
                                  </label>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-100">
                                <button onClick={() => setEditMode(null)} className="px-5 py-2 text-gray-500 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancelar</button>
                                <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="px-5 py-2 bg-[#00AEEF] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm">
                                  <Save className="w-4 h-4" /> Salvar
                                </button>
                              </div>`;

const editFormNew = `<div className="flex gap-2 mt-2">
                                <NumberControl icon={Layers} title="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                <NumberControl icon={Repeat} title="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} />
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                    Unilateral
                                </label>
                                <div className="flex gap-2">
                                  <button onClick={() => setEditMode(null)} className="w-12 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                                    <X className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="w-12 h-10 bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Salvar">
                                    <Check className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>`;

code = code.replace(editFormTarget, editFormNew);
fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
