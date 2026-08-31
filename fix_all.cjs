const fs = require('fs');

// --- 1. Fix Delete Routine Modal (App.tsx) ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const modalStr = `      {/* DELETE ROUTINE CONFIRM */}
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

      {/* NOVO TREINO MODAL */}`;

if (!appCode.includes('DELETE ROUTINE CONFIRM')) {
  appCode = appCode.replace('{/* NOVO TREINO MODAL */}', modalStr);
}

// --- 2. Fix Accordion Textareas (App.tsx) ---
const taHealth = `<textarea 
                      value={data.healthData || ''}
                      onChange={(e) => updateData({ healthData: e.target.value })}
                      placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..."
                      className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                    />`;
const taHealthNew = `<AutoResizeTextarea value={data.healthData || ''} onChange={(e: any) => updateData({ healthData: e.target.value })} placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />`;
appCode = appCode.replace(taHealth, taHealthNew);

const taNotes = `<textarea 
                      value={data.postAnamnesisNotes || ''}
                      onChange={(e) => updateData({ postAnamnesisNotes: e.target.value })}
                      placeholder="Ex: Descobertas no dia a dia, restrições extras..."
                      className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                    />`;
const taNotesNew = `<AutoResizeTextarea value={data.postAnamnesisNotes || ''} onChange={(e: any) => updateData({ postAnamnesisNotes: e.target.value })} placeholder="Ex: Descobertas no dia a dia, restrições extras..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" />`;
appCode = appCode.replace(taNotes, taNotesNew);

fs.writeFileSync('src/App.tsx', appCode);

// --- 3. Fix Exercise Layout (WorkoutExecution.tsx) ---
let woCode = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// New Ex Form layout
const oldNewForm = `<NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} fullWidth={true} />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                            Unilateral
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => setIsAdding(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                            <X className="w-5 h-5" />
                          </button>
                          <button onClick={() => saveNewExercise(phase.id as any)} className="w-12 h-10 bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Adicionar">
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      </div>`;
const newNewForm = `<div className="flex gap-2 items-end">
                          <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} fullWidth={true} />
                          <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                              <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                              Unilateral
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end items-center pt-2 gap-2">
                        <button onClick={() => setIsAdding(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                          <X className="w-5 h-5" />
                        </button>
                        <button onClick={() => saveNewExercise(phase.id as any)} className="flex-1 max-w-[120px] h-10 bg-green-500 text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Adicionar">
                          Adicionar
                        </button>
                      </div>`;
woCode = woCode.replace(oldNewForm, newNewForm);

// Edit Ex Form layout
const oldEditForm = `<NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} fullWidth={true} />
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                    Unilateral
                                </label>
                                <div className="flex gap-2">
                                  <button onClick={() => setEditMode(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                                    <X className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="w-12 h-10 bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Salvar">
                                    <Check className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>`;
const newEditForm = `<div className="flex gap-2 items-end">
                                  <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} fullWidth={true} />
                                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                                      <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                      Unilateral
                                  </label>
                                </div>
                              </div>
                              <div className="flex justify-end items-center pt-2 gap-2">
                                <button onClick={() => setEditMode(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                                  <X className="w-5 h-5" />
                                </button>
                                <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="flex-1 max-w-[120px] h-10 bg-green-500 text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Salvar">
                                  Salvar
                                </button>
                              </div>`;
woCode = woCode.replace(oldEditForm, newEditForm);

// --- 4. Add GripVertical icon to exercise header ---
// Add import
if (!woCode.includes('GripVertical')) {
  woCode = woCode.replace(/import {([^}]+)ArrowDown} from 'lucide-react';/, "import {$1ArrowDown, GripVertical} from 'lucide-react';");
}

const headerTarget = `<div className="flex justify-between items-start pr-2">
                                      <h3 className={\`font-black text-base leading-tight \${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}\`}>{ex.name}</h3>
                                    </div>`;
const headerTargetFallback = `<div className="flex justify-between items-start">
                                      <h3 className={\`font-black text-base leading-tight \${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}\`}>{ex.name}</h3>
                                    </div>`;

const cardHeaderNew = `<div className="flex justify-between items-start pr-2">
                                      <h3 className={\`font-black text-base leading-tight \${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}\`}>{ex.name}</h3>
                                    </div>`;

// First make sure the pr-2 exists
woCode = woCode.replace(headerTargetFallback, cardHeaderNew);

const dragGrip = `<div className={\`bg-white rounded-2xl border-2 p-3 transition-all relative \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}\`}>
                              <div className="flex justify-between items-start gap-2 cursor-pointer">
                                <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>`;

const dragGripAlternative = `<div 
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, phase.id, exIndex)}
                            onDragEnter={(e) => handleDragEnter(e, phase.id, exIndex)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                            className={\`bg-white rounded-2xl border-2 p-3 transition-all relative 
                              \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}
                              \${draggedItem?.phaseId === phase.id && draggedItem?.exIndex === exIndex ? 'opacity-30 border-dashed border-blue-400' : ''}
                              \${dragOverItem?.phaseId === phase.id && dragOverItem?.exIndex === exIndex && draggedItem?.exIndex !== exIndex ? (draggedItem!.exIndex > exIndex ? 'border-t-4 border-t-blue-500' : 'border-b-4 border-b-blue-500') : ''}
                            \`}>
                              <div className="flex justify-between items-start gap-2 cursor-pointer">
                                <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>`;


const dragGripNew = `<div 
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, phase.id, exIndex)}
                            onDragEnter={(e) => handleDragEnter(e, phase.id, exIndex)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                            className={\`bg-white rounded-2xl border-2 p-3 transition-all relative 
                              \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}
                              \${draggedItem?.phaseId === phase.id && draggedItem?.exIndex === exIndex ? 'opacity-30 border-dashed border-blue-400' : ''}
                              \${dragOverItem?.phaseId === phase.id && dragOverItem?.exIndex === exIndex && draggedItem?.exIndex !== exIndex ? (draggedItem!.exIndex > exIndex ? 'border-t-4 border-t-blue-500' : 'border-b-4 border-b-blue-500') : ''}
                            \`}>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex flex-col justify-center h-full touch-none" title="Arraste para reordenar"
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex justify-between items-start gap-2 cursor-pointer pl-6">
                                <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>`;

if (woCode.includes(dragGripAlternative)) {
   woCode = woCode.replace(dragGripAlternative, dragGripNew);
} else {
   woCode = woCode.replace(dragGrip, dragGripNew);
}


fs.writeFileSync('src/components/WorkoutExecution.tsx', woCode);
