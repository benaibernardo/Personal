import React, { useState, useEffect } from 'react';
import { Ruler, Plus, Trash2, Edit2, Save, CheckCircle2, ChevronDown, ChevronUp, Undo, Play, Pause, Minus, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutData, BiomechanicalTest } from '../types';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

interface TestExecution {
  completed: boolean;
}

export const BiomechanicalTests: React.FC<Props> = ({ data, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [executionData, setExecutionData] = useState<Record<string, TestExecution>>({});
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTestForm, setNewTestForm] = useState({ name: '', result: '', sets: 1, reps: 0, useSets: false });
  
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', result: '', sets: 1, reps: 0, useSets: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Initialize execution data
  useEffect(() => {
    if (data.tests) {
      setExecutionData(prev => {
        const merged = { ...prev };
        let changed = false;
        data.tests.forEach(test => {
          if (!merged[test.id]) {
            merged[test.id] = { completed: false };
            changed = true;
          }
        });
        return changed ? merged : prev;
      });
    }
  }, [data.tests]);

  const allCompleted = data.tests.length > 0 && data.tests.every(t => executionData[t.id]?.completed);

  // Auto-collapse if all completed
  useEffect(() => {
    if (allCompleted && isOpen) {
      setIsOpen(false);
    }
  }, [allCompleted]);

  const saveNewTest = () => {
    if (!newTestForm.name.trim()) return;
    const newId = `test-${Date.now()}`;
    const setsRepsStr = newTestForm.useSets ? `${newTestForm.sets} x ${newTestForm.reps}` : undefined;
    
    const newTest: BiomechanicalTest = {
      id: newId,
      name: newTestForm.name,
      result: newTestForm.result,
      setsReps: setsRepsStr
    };
    
    updateData({ tests: [...data.tests, newTest] });
    setIsAdding(false);
    setNewTestForm({ name: '', result: '', sets: 1, reps: 0, useSets: false });
  };

  const startEditing = (test: BiomechanicalTest) => {
    let sets = 1;
    let reps = 0;
    let useSets = false;
    if (test.setsReps) {
      useSets = true;
      sets = parseInt(test.setsReps.split('x')[0]) || 1;
      reps = parseInt(test.setsReps.split('x')[1]?.split('a')[0]) || 0;
    }
    
    setEditForm({ name: test.name, result: test.result, sets, reps, useSets });
    setEditMode(test.id);
  };

  const saveEditTest = (id: string) => {
    if (!editForm.name.trim()) return;
    const setsRepsStr = editForm.useSets ? `${editForm.sets} x ${editForm.reps}` : undefined;
    
    const updated = data.tests.map(test => 
      test.id === id ? { ...test, name: editForm.name, result: editForm.result, setsReps: setsRepsStr } : test
    );
    
    updateData({ tests: updated });
    setEditMode(null);
  };

  const removeTest = (id: string) => {
    updateData({ tests: data.tests.filter(test => test.id !== id) });
    setDeleteConfirm(null);
  };

  const toggleTestDone = (id: string) => {
    setExecutionData(prev => ({
      ...prev,
      [id]: { completed: !prev[id]?.completed }
    }));
    
    if (!executionData[id]?.completed) {
      // If we just completed it, collapse it
      setTimeout(() => setExpandedTest(null), 300);
    }
  };

  const NumberControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="flex-1 flex flex-col items-center">
      <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</span>
      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shadow-sm w-full h-12">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 flex items-center justify-center text-[#20c997] active:bg-teal-100 rounded-lg"><Minus className="w-5 h-5"/></button>
        <span className="flex-1 text-center font-black text-lg text-gray-800">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-[#20c997] active:bg-teal-100 rounded-lg"><Plus className="w-5 h-5"/></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-center text-[#071D49] mb-2">Excluir Teste?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Essa ação removerá o teste e não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancelar</button>
              <button onClick={() => removeTest(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md">Excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 px-4 py-3 rounded-xl ${allCompleted ? 'bg-gray-100 border-gray-300' : 'bg-teal-50 border-teal-500'} border-l-4 ${allCompleted ? 'border-l-gray-400' : 'border-teal-500'} flex items-center justify-between shadow-sm transition-colors`}
        >
          <div className="flex items-center gap-2">
            <Ruler className={`w-5 h-5 ${allCompleted ? 'text-gray-400' : 'text-teal-700'}`} />
            <h2 className={`font-black uppercase tracking-wider text-sm ${allCompleted ? 'text-gray-500 line-through' : 'text-teal-700'}`}>Testes Biomecânicos</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${allCompleted ? 'text-gray-400' : 'text-teal-700'} opacity-70`}>{data.tests.length || 0} Testes</span>
            {isOpen ? <ChevronUp className={allCompleted ? 'text-gray-400' : 'text-teal-700'} /> : <ChevronDown className={allCompleted ? 'text-gray-400' : 'text-teal-700'} />}
          </div>
        </button>
        {isOpen && (
          <button 
            onClick={() => { setIsAdding(true); setExpandedTest(null); }}
            className={`p-3 rounded-xl border-2 border-dashed border-teal-500 text-gray-500 hover:text-gray-700 hover:bg-white transition-colors flex items-center justify-center bg-gray-50/50 shadow-sm`}
            title={`Adicionar Teste`}
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-300 shadow-sm space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Nome do Teste</label>
                  <input type="text" placeholder="Ex: Dorsiflexão" value={newTestForm.name} onChange={e => setNewTestForm({...newTestForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#20c997] focus:outline-none font-bold text-gray-800" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="useSetsAdd" checked={newTestForm.useSets} onChange={(e) => setNewTestForm({...newTestForm, useSets: e.target.checked})} className="rounded text-[#20c997] focus:ring-[#20c997] w-4 h-4" />
                  <label htmlFor="useSetsAdd" className="text-xs font-bold text-gray-600 uppercase">Adicionar Séries/Tempo (Opcional)</label>
                </div>

                {newTestForm.useSets && (
                  <div className="flex gap-4">
                    <NumberControl label="Séries" value={newTestForm.sets} onChange={(v) => setNewTestForm({...newTestForm, sets: v})} />
                    <NumberControl label="Tempo (s) / Reps" value={newTestForm.reps} onChange={(v) => setNewTestForm({...newTestForm, reps: v})} />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Observações / Resultado</label>
                  <textarea placeholder="Resultado do teste..." value={newTestForm.result} onChange={e => setNewTestForm({...newTestForm, result: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#20c997] focus:outline-none text-sm text-gray-800 min-h-[60px]" />
                </div>
                
                <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
                  <button onClick={saveNewTest} className="flex-1 py-3 bg-[#20c997] text-white font-bold rounded-xl shadow-md hover:bg-teal-600 transition-colors flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" /> Adicionar
                  </button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {data.tests.map((test, index) => {
                const isExpanded = expandedTest === test.id;
                const isCompleted = executionData[test.id]?.completed;
                const isEditing = editMode === test.id;
                
                let cardClass = "border-gray-200 bg-white";
                if (isCompleted) {
                  cardClass = "bg-[#FFF0F0] border-red-200 opacity-90";
                } else if (isExpanded) {
                  cardClass = `bg-teal-50 border-teal-500 border-2 shadow-md`;
                } else {
                  cardClass = `bg-teal-50 border-gray-200`;
                }

                return (
                  <motion.div 
                    key={test.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 ${cardClass}`}
                  >
                    {isEditing ? (
                      <div className="p-5 space-y-4 bg-white border-b border-gray-200">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Nome do Teste</label>
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 font-bold mt-1 focus:ring-2 focus:ring-[#20c997] outline-none" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <input type="checkbox" id={`useSetsEdit-${test.id}`} checked={editForm.useSets} onChange={(e) => setEditForm({...editForm, useSets: e.target.checked})} className="rounded text-[#20c997] focus:ring-[#20c997] w-4 h-4" />
                          <label htmlFor={`useSetsEdit-${test.id}`} className="text-xs font-bold text-gray-600 uppercase">Adicionar Séries/Tempo</label>
                        </div>

                        {editForm.useSets && (
                          <div className="flex gap-4">
                            <NumberControl label="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                            <NumberControl label="Tempo (s) / Reps" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                          </div>
                        )}
                        
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Observações / Resultado</label>
                          <textarea value={editForm.result} onChange={e => setEditForm({...editForm, result: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#20c997] outline-none text-sm min-h-[60px]" />
                        </div>

                        <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-100">
                          <button onClick={() => setEditMode(null)} className="px-5 py-2 text-gray-500 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancelar</button>
                          <button onClick={() => saveEditTest(test.id)} className="px-5 py-2 bg-[#20c997] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm">
                            <Save className="w-4 h-4" /> Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex">
                        <button onClick={() => setExpandedTest(prev => prev === test.id ? null : test.id)} className="flex-1 p-5 flex items-center justify-between text-left">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-black px-2 py-1 rounded-lg ${isCompleted ? 'bg-red-200/50 text-red-700' : 'bg-white text-gray-600 shadow-sm'}`}>{index + 1}</span>
                              <h3 className={`font-black text-lg transition-all ${isCompleted ? 'text-gray-400 line-through opacity-80' : 'text-gray-900'}`}>{test.name}</h3>
                            </div>
                            {test.setsReps && (
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className={`px-2 py-1 rounded-md text-gray-600 font-bold whitespace-nowrap border ${isCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}`}>
                                  {test.setsReps}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {isCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                            {isExpanded ? <ChevronUp className={`w-6 h-6 ${isCompleted ? 'text-red-300' : 'text-gray-600'}`} /> : <ChevronDown className={`w-6 h-6 ${isCompleted ? 'text-red-300' : 'text-gray-400'}`} />}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="flex flex-col border-l border-gray-200/50 bg-white/30">
                            <button onClick={() => startEditing(test)} className="flex-1 p-3 text-gray-500 hover:text-teal-500 hover:bg-teal-50 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm(test.id)} className="flex-1 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    )}

                    <AnimatePresence>
                      {isExpanded && !isEditing && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200/50 bg-white/50"
                        >
                          <div className="p-5 space-y-4">
                            <div>
                              <label className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5 mb-2">
                                Resultado / Observações
                              </label>
                              <div className="w-full p-4 bg-white border border-gray-200 shadow-sm rounded-xl text-sm min-h-[60px] text-gray-700 whitespace-pre-wrap">
                                {test.result || <span className="text-gray-400 italic">Nenhum resultado anotado.</span>}
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <button 
                                onClick={() => toggleTestDone(test.id)}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                                  isCompleted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#20c997] hover:bg-teal-600 text-white'
                                }`}
                              >
                                {isCompleted ? <Undo className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                {isCompleted ? 'Desmarcar Teste' : 'Teste Concluído'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
