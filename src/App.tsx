import { safeStorage } from './lib/storage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { AlertTriangle, Printer, ChevronDown, ChevronUp, FileText, RotateCcw, ArrowLeft, CheckCircle2, BrainCircuit, HeartPulse, Dumbbell, Plus, X, MessageSquare, Check, XCircle, Save, Layers, Clock, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutData, Student } from './types';

import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { BiomechanicalTests } from './components/BiomechanicalTests';
import { WorkoutExecution } from './components/WorkoutExecution';
import { PostWorkoutFeedback } from './components/PostWorkoutFeedback';
import { StudentPortal } from './components/StudentPortal';
import { AnamneseForm } from './components/AnamneseForm';
import {  fetchStudentsFromFirestore, fetchStudentById, saveSessionLog , fetchLatestWorkout } from './services/db';
import { seedLarissa } from './seedLarissa';


const AutoResizeTextarea = ({ value, onChange, placeholder, className }: any) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={1}
      onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
    />
  );
};

const STORAGE_KEY = 'benai_consultoria_workout_data_v1';

const initialData: WorkoutData = {
  studentName: '',
  date: new Date().toISOString().split('T')[0],
  workoutType: '',
  stressLevel: '',
  healthData: '',
  triggers: '',
  postAnamnesisNotes: '',
  selectedRoutine: 'Full Body',
  routines: {
    'Full Body': { mobility: [], activation: [], strength: [], deceleration: [] },
    'Treino A': { mobility: [], activation: [], strength: [], deceleration: [] },
    'Treino B': { mobility: [], activation: [], strength: [], deceleration: [] },
    'Treino C': { mobility: [], activation: [], strength: [], deceleration: [] },
  },
  tests: [
    { id: '1', name: 'Dorsiflexão (Lunge Test)', result: '' },
    { id: '2', name: 'Thomas Test', result: '' },
    { id: '3', name: 'Hinge (Dobradiça de Quadril)', result: '' },
    { id: '4', name: 'Box Squat / Sit-to-Stand', result: '' }
  ],
  phases: {
    mobility: [],
    activation: [],
    strength: [],
    deceleration: []
  },
  feedback: {
    fatigue: '',
    likes: '',
    discomforts: '',
    adjustments: ''
  }
};

function InstructorWorkout() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [anamnesisOpen, setAnamnesisOpen] = useState({ triggers: false, health: false, notes: false });
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [deleteRoutineConfirm, setDeleteRoutineConfirm] = useState<string | null>(null);
  const [newRoutineName, setNewRoutineName] = useState('');


  const [data, setData] = useState<WorkoutData>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tests && !Array.isArray(parsed.tests)) {
          parsed.tests = initialData.tests;
        }
        return { ...initialData, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved workout data', e);
      }
    }
    return initialData;
  });

  useEffect(() => {
    if (id && data.studentId !== id) {
      // If we land on a URL with an ID that doesn't match our local storage, fetch it!
      fetchLatestWorkout(id).then(dbWorkout => {
        if (dbWorkout) {
          setData(prev => {
            const merged = { ...prev, ...dbWorkout };
            safeStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        } else {
          // Attempt to find the student directly if workout doesn't exist
          fetchStudentById(id).then(student => {
             if (student) {
                const newData = {
                  ...initialData,
                  studentId: student.id,
                  studentName: student.name,
                  healthData: `Condições: ${student.medicalConditions} | Lesões: ${student.injuries} | Meds: ${student.medications}`,
                  triggers: student.objectives,
                };
                setData(newData);
                safeStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
             }
          });
        }
      });
    } else {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [id, data]);

  const updateData = (updates: Partial<WorkoutData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    if (window.confirm('Deseja realmente limpar todos os campos e iniciar um novo treino?')) {
      setData(initialData);
      safeStorage.removeItem(STORAGE_KEY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFinishSession = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await saveSessionLog({
        id: `sess-${id}-${Date.now()}`,
        studentId: id,
        date: data.sessionDate || new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: `Fadiga: ${data.feedback.fatigue}/10 | Ajustes: ${data.feedback.adjustments}`,
        workoutData: {
          routine: data.selectedRoutine || 'Full Body',
          phases: data.phases
        }
      });
      setShowFinishModal(true);
    } catch (e) {
      console.error(e);
      alert('Erro ao registrar sessão.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans pb-24 print:bg-white print:pb-0">
      
      {/* Header */}
      <header className="bg-[#071D49] text-white p-4 shadow-md sticky top-0 z-10 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors mr-1"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="bg-[#00AEEF] text-[#071D49] font-black px-2.5 py-1 rounded-lg text-[13px] tracking-tight shadow">
              BB
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">BENAI BERNARDO</h1>
              <p className="text-[10px] text-[#00AEEF] uppercase font-semibold tracking-widest">Consultoria de Treinamento</p>
            </div>
          </div>
          <button 
            onClick={handleReset} 
            title="Limpar formulário" 
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block text-center py-6 border-b-2 border-[#071D49] mb-6">
        <h1 className="text-xl font-black text-[#071D49] uppercase tracking-wider">BENAI BERNARDO</h1>
        <div className="w-32 h-1 bg-[#00AEEF] mx-auto my-1 rounded"></div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Consultoria de Treinamento • Relatório de Sessão</p>
      </div>

      <main className="max-w-3xl mx-auto p-4 space-y-4 print:p-0">
        {/* Cabeçalho Fixo do Prontuário */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          <div className="bg-[#071D49] text-white px-5 py-3 flex items-center justify-between print:hidden">
            <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
              Prontuário de Treino
            </h2>
          </div>
          <div className="p-5 bg-blue-50/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aluna</label>
                <div className="font-bold text-[#071D49] text-[13px] bg-white px-3 rounded-lg border border-gray-200 h-11 flex items-center shadow-sm">
                  {data.studentName || 'Não selecionada'}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data da Sessão</label>
                <input 
                  type="date"
                  value={data.sessionDate || ''} 
                  onChange={(e) => updateData({ sessionDate: e.target.value })}
                  className="font-bold text-gray-700 text-[13px] w-full bg-white px-3 rounded-lg border border-gray-200 h-11 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prontidão (Como chegou?)</label>
                <div className="bg-white px-3 rounded-lg border border-gray-200 flex flex-col items-center justify-center h-11 shadow-sm">
                  <div className="flex w-full justify-between px-2">
                    {['😫', '🙁', '😐', '🙂', '🤩'].map((emoji, index) => {
                      const value = String(index + 1);
                      const isSelected = data.readiness === value;
                      return (
                        <button
                          key={value}
                          onClick={() => updateData({ readiness: value })}
                          className={`text-lg transition-transform hover:scale-125 ${isSelected ? 'scale-125 grayscale-0' : 'grayscale opacity-40'}`}
                          title={`Nível ${value}`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-blue-100">
              <div className="bg-purple-50 rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, triggers: !p.triggers }))}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-purple-700 uppercase">
                    <BrainCircuit className="w-4 h-4" /> Gatilhos
                  </div>
                  {anamnesisOpen.triggers ? <ChevronUp className="w-4 h-4 text-purple-700" /> : <ChevronDown className="w-4 h-4 text-purple-700" />}
                </button>
                <AnimatePresence>
                {anamnesisOpen.triggers && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-purple-50">
                      <AutoResizeTextarea value={data.triggers || ''} onChange={(e: any) => updateData({ triggers: e.target.value })} placeholder="Ex: Aluno com TEA (usar comandos diretos)..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, health: !p.health }))}
                  className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-red-700 uppercase">
                    <HeartPulse className="w-4 h-4" /> Restrições
                  </div>
                  {anamnesisOpen.health ? <ChevronUp className="w-4 h-4 text-red-700" /> : <ChevronDown className="w-4 h-4 text-red-700" />}
                </button>
                <AnimatePresence>
                {anamnesisOpen.health && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-red-50">
                      <AutoResizeTextarea value={data.healthData || ''} onChange={(e: any) => updateData({ healthData: e.target.value })} placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              <div className="bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, notes: !p.notes }))}
                  className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[13px] font-black text-yellow-700 uppercase">
                    <MessageSquare className="w-4 h-4" /> Notas
                  </div>
                  {anamnesisOpen.notes ? <ChevronUp className="w-4 h-4 text-yellow-700" /> : <ChevronDown className="w-4 h-4 text-yellow-700" />}
                </button>
                <AnimatePresence>
                {anamnesisOpen.notes && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-yellow-50">
                      <AutoResizeTextarea value={data.postAnamnesisNotes || ''} onChange={(e: any) => updateData({ postAnamnesisNotes: e.target.value })} placeholder="Ex: Descobertas no dia a dia, restrições extras..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <BiomechanicalTests data={data} updateData={updateData} />
        
        {/* MULTI-ROUTINE SELECTOR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="bg-[#071D49] text-white px-5 py-3 flex items-center justify-between">
            <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
              <Dumbbell className="w-5 h-5" /> Ficha Atual
            </h2>
            <button
                onClick={() => {
                  setShowNewRoutineModal(true);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Novo Treino"
              >
                <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-blue-50/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      className={`w-full px-4 py-2.5 pr-8 rounded-xl font-black text-[13px] transition-all border-2 flex items-center justify-center shadow-sm ${isSelected ? 'bg-[#00AEEF] border-[#00AEEF] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#00AEEF] hover:text-[#00AEEF]'}`}
                    >
                      <span className="truncate">{routineName}</span>
                    </button>
                    {totalRoutines > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteRoutineConfirm(routineName);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 shadow-sm"
                        title="Excluir treino"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <WorkoutExecution data={data} updateData={updateData} />
        <PostWorkoutFeedback data={data} updateData={updateData} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-100 via-gray-100/90 to-transparent flex justify-center print:hidden pointer-events-none z-20">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={handlePrint}
            className="bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold py-4 px-6 rounded-full shadow-xl flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95 border border-gray-200"
          >
            <FileText className="w-5 h-5" />
            <span className="hidden sm:inline">Relatório PDF</span>
          </button>
          
          <button 
            onClick={handleFinishSession}
            disabled={isSaving}
            className={`font-black py-4 px-8 rounded-full shadow-2xl flex items-center gap-2 transform transition-all border-2 border-white/20 ${isSaving ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 active:scale-95'}`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSaving ? 'Salvando...' : 'Finalizar'}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      
            {/* DELETE ROUTINE CONFIRM */}
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

      {/* NOVO TREINO MODAL */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 text-center bg-blue-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-500">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-gray-900">Novo Treino</h2>
              <p className="text-[13px] text-gray-500 mt-1">Digite o nome da nova aba de treino.</p>
            </div>
            <div className="p-5">
              <input 
                autoFocus
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Ex: Treino C"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-bold outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newRoutineName.trim()) {
                    const newRoutine = newRoutineName.trim();
                    const currentRoutine = data.selectedRoutine || 'Full Body';
                    const routines = data.routines || { 'Full Body': data.phases };
                    routines[currentRoutine] = data.phases;
                    if (!routines[newRoutine]) {
                      routines[newRoutine] = { mobility: [], activation: [], strength: [], deceleration: [] };
                    }
                    updateData({ 
                      selectedRoutine: newRoutine,
                      routines,
                      phases: routines[newRoutine]
                    });
                    setNewRoutineName('');
                    setShowNewRoutineModal(false);
                  }
                }}
              />
              <div className="flex gap-3 mt-5">
                <button 
                  onClick={() => {
                    setNewRoutineName('');
                    setShowNewRoutineModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4"/> Cancelar
                </button>
                <button 
                  disabled={!newRoutineName.trim()}
                  onClick={() => {
                    if (newRoutineName.trim()) {
                      const newRoutine = newRoutineName.trim();
                      const currentRoutine = data.selectedRoutine || 'Full Body';
                      const routines = data.routines || { 'Full Body': data.phases };
                      routines[currentRoutine] = data.phases;
                      if (!routines[newRoutine]) {
                        routines[newRoutine] = { mobility: [], activation: [], strength: [], deceleration: [] };
                      }
                      updateData({ 
                        selectedRoutine: newRoutine,
                        routines,
                        phases: routines[newRoutine]
                      });
                      setNewRoutineName('');
                      setShowNewRoutineModal(false);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-[#00AEEF] text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4"/> Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-[#071D49] mb-2">Treino Finalizado!</h2>
            <p className="text-gray-500 font-medium mb-8">
              A sessão de hoje foi registrada e salva com sucesso. O resumo foi armazenado no banco de dados.
            </p>
            <button 
              onClick={() => {
                setShowFinishModal(false);
                navigate('/dashboard');
              }}
              className="w-full py-4 bg-[#071D49] hover:bg-black text-white font-black uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function InstructorDashboardWrapper() {
  const navigate = useNavigate();

  const startWorkout = async (student: Student) => {
    const today = new Date().toISOString().split('T')[0];
    const dbWorkout = await fetchLatestWorkout(student.id);

    if (dbWorkout) {
      dbWorkout.sessionDate = today;
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(dbWorkout));
    } else {
      // Fallback
      let initialPhases = initialData.phases;
      
      if (student.name.includes('Samia')) {
        initialPhases = {
          mobility: [
            { id: 'mob1', name: 'Mobilidade de Tornozelo c/ Peso (Ativa)', time: '2 x 10 a 12 | 15s', feedback: 'Halter no joelho esquerdo primeiro.' },
            { id: 'mob2', name: 'Passada Homem-Aranha c/ Rotação', time: '2 x 8 a 10 cada | 15s', feedback: 'Olhar fixo no chão ou na parede.' }
          ],
          activation: [
            { id: 'act1', name: 'Prancha Lateral Curta (Nos joelhos)', time: '2 x 20 a 30s | 30s', feedback: 'Apoio nos joelhos e cotovelo.' },
            { id: 'act2', name: 'Sustentação de Mala (Suitcase Hold)', time: '2 x 30s cada | 30s', feedback: 'Segurar um halter pesado em apenas uma mão.' }
          ],
          strength: [
            { id: 'str1', name: 'Agachamento Goblet na Caixa Alta', load: '20 kg', setsReps: '3 x 8 a 12', notes: 'Caixa limitando a descida.' },
            { id: 'str2', name: 'Stiff com Halteres (RDL)', load: '', setsReps: '3 x 8 a 12', notes: 'Aproveitar o excelente padrão.' },
            { id: 'str3', name: 'Remada Australiana (Peso Corporal)', load: 'Corporal', setsReps: '3 x 8 a 12', notes: 'Corpo pranchado.' },
            { id: 'str4', name: 'Remada Baixa Neutra', load: '', setsReps: '3 x 8 a 12', notes: 'Retração escapular máxima.' },
            { id: 'str5', name: 'Supino Reto (Halter ou Máquina)', load: '', setsReps: '3 x 8 a 12', notes: 'Empurrar com controle.' }
          ],
          deceleration: [
            { id: 'dec1', name: 'Postura da Criança (Child\'s Pose)', time: '1 x 1 a 2 min', feedback: 'Descompressão lombar passiva.' },
            { id: 'dec2', name: 'Pernas na Parede (Legs Up the Wall)', time: '1 x 2 a 3 min', feedback: 'Respiração 4s inspira, 6s expira.' }
          ]
        };
      }

      const newData = {
        studentId: student.id,
        studentName: student.name,
        sessionDate: today,
        readiness: '',
        healthData: `Condições: ${student.medicalConditions} | Lesões: ${student.injuries} | Meds: ${student.medications}`,
        triggers: student.objectives,
        tests: student.name.includes('Samia') ? [
          { id: 't1', name: 'Dorsiflexão', result: 'Assimetria E>D (E menor)' },
          { id: 't2', name: 'Thomas', result: 'E mais encurtado' },
          { id: 't3', name: 'Hinge / Pêndulo', result: 'Hinge OK / Assimetria Pêndulo' },
          { id: 't4', name: 'Agachamento', result: 'Retroversão antes de 90 graus' }
        ] : initialData.tests,
        phases: initialPhases
      };
      
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }

    navigate(`/workout/${student.id}`);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 right-5 z-50 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest"
      >
        Sair
      </button>
      <StudentDashboard onStartWorkout={startWorkout} />
    </div>
  );
}

function StudentPortalWrapper() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentById(id as string).then(found => {
      if (found) {
        setStudent(found);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando portal do aluno...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
        <h1 className="text-xl font-bold text-[#071D49] mb-2">Aluno não encontrado</h1>
        <p className="text-gray-500 mb-6 text-center">Verifique se o link de acesso está correto.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StudentPortal student={student} onClose={() => {}} isStandalone={true} />
    </div>
  );
}

function LandingPageWrapper() {
  const navigate = useNavigate();
  return <LandingPage onAccessDashboard={() => navigate('/dashboard')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/dashboard" element={<InstructorDashboardWrapper />} />
        <Route path="/workout/:id" element={<InstructorWorkout />} />
        <Route path="/aluno/:id" element={<StudentPortalWrapper />} />
        <Route path="/anamnese" element={<AnamneseForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

