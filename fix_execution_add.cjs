const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// We need to modify NumberControl and Add/Edit forms
const numberControlTarget = `const NumberControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex-1 flex flex-col items-center min-w-[70px]">
      <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">{label}</span>
      <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
          className="w-8 text-center font-black text-lg bg-transparent border-none p-0 focus:ring-0 select-all"
        />
        <button type="button" onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
      </div>
    </div>
  );`;

const numberControlNew = `const NumberControl = ({ icon: Icon, title, value, onChange, isDecimal = false }: { icon: any, title: string, value: number | string, onChange: (v: any) => void, isDecimal?: boolean }) => (
    <div className="flex-1 flex flex-col items-center min-w-[60px]">
      <div className="flex items-center justify-center text-gray-500 mb-1" title={title}><Icon className="w-4 h-4"/></div>
      <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-12">
        <button type="button" onClick={() => onChange(Math.max(0, (parseFloat(value as string) || 0) - (isDecimal ? 0.5 : 1)))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
        <input 
          type={isDecimal ? "text" : "number"}
          inputMode={isDecimal ? "decimal" : "numeric"}
          value={value}
          onChange={(e) => {
            if (isDecimal) {
              onChange(e.target.value.replace(/,/g, '.'));
            } else {
              const v = parseInt(e.target.value);
              onChange(isNaN(v) ? 0 : v);
            }
          }}
          onFocus={e => e.target.select()}
          className="w-10 text-center font-black text-base bg-transparent border-none p-0 focus:ring-0"
        />
        <button type="button" onClick={() => onChange((parseFloat(value as string) || 0) + (isDecimal ? 0.5 : 1))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
      </div>
    </div>
  );`;

code = code.replace(numberControlTarget, numberControlNew);

// Fix add form
const addFormTarget = `<div className="flex gap-4">
                        <NumberControl label="Séries" value={newExForm.sets} onChange={(v) => setNewExForm({...newExForm, sets: v})} />
                        <NumberControl label="Reps/Tempo" value={newExForm.reps} onChange={(v) => setNewExForm({...newExForm, reps: v})} />
                        <NumberControl label="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} />
                        <div className="flex flex-col items-center justify-center pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase">
                            <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                            Unilateral (E/D)
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                        <button onClick={() => setIsAdding(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => saveNewExercise(phase.id as any)} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                          <Save className="w-5 h-5" /> Adicionar
                        </button>
                      </div>`;

const addFormNew = `<div className="flex gap-2">
                        <NumberControl icon={Layers} title="Séries" value={newExForm.sets} onChange={(v) => setNewExForm({...newExForm, sets: v})} />
                        <NumberControl icon={Repeat} title="Reps/Tempo" value={newExForm.reps} onChange={(v) => setNewExForm({...newExForm, reps: v})} />
                        <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                            Unilateral
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => setIsAdding(null)} className="w-12 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                            <X className="w-5 h-5" />
                          </button>
                          <button onClick={() => saveNewExercise(phase.id as any)} className="w-12 h-10 bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Adicionar">
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      </div>`;

code = code.replace(addFormTarget, addFormNew);

// Fix edit form
const editFormTarget = `<div className="flex gap-4">
                                <NumberControl label="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                <NumberControl label="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                <NumberControl label="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} />
                                <div className="flex flex-col items-center justify-center pt-2">
                                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase">
                                    <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                    Unilateral (E/D)
                                  </label>
                                </div>
                              </div>
                              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                                <button onClick={() => setEditMode(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
                                <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                  <Save className="w-5 h-5" /> Salvar
                                </button>
                              </div>`;
const editFormNew = `<div className="flex gap-2">
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

// Add missing imports
if (!code.includes('Check,')) {
  code = code.replace("import { ", "import { Check, X, ");
}

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
