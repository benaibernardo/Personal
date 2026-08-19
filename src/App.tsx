/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Printer, RotateCcw, ArrowLeft } from 'lucide-react';
import { WorkoutData, Student } from './types';

import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentSelector } from './components/StudentSelector';
import { PreWorkoutTriggers } from './components/PreWorkoutTriggers';
import { BiomechanicalTests } from './components/BiomechanicalTests';
import { WorkoutExecution } from './components/WorkoutExecution';
import { PostWorkoutFeedback } from './components/PostWorkoutFeedback';

const STORAGE_KEY = 'benai_consultoria_workout_data_v1';

const initialData: WorkoutData = {
  studentName: '',
  date: new Date().toISOString().split('T')[0],
  workoutType: '',
  stressLevel: '',
  healthData: '',
  triggers: '',
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

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'workout'>('landing');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const [data, setData] = useState<WorkoutData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<WorkoutData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    if (window.confirm('Deseja realmente limpar todos os campos e iniciar um novo treino?')) {
      setData(initialData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const startWorkout = (student: Student) => {
    setActiveStudent(student);
    
    // Pre-fill the workout form with the student's data
    let initialPhases = initialData.phases;
    
    // Auto-populate Samia's Training A as requested
    if (student.name.includes('Samia')) {
      initialPhases = {
        mobility: [
          { id: 'mob1', name: 'Alongamento Flexores de Quadril (Ajoelhada)', load: '', setsReps: '2', time: '45s cada', feedback: '', rest: '15s', notes: '' },
          { id: 'mob2', name: 'Gato-Vaca (Cat-Cow)', load: '', setsReps: '2', time: '10 a 12', feedback: '', rest: '-', notes: '' }
        ],
        activation: [
          { id: 'act1', name: 'Perdigueiro (Bird-Dog)', load: '', setsReps: '2', time: '10 cada', feedback: '', rest: '30s', notes: '' },
          { id: 'act2', name: 'Elevação Pélvica Isométrica (Peso Corporal)', load: '', setsReps: '2', time: '30s', feedback: '', rest: '30s', notes: '' }
        ],
        strength: [
          { id: 'str1', name: 'Agachamento Goblet na Caixa (Box Squat)', load: '', setsReps: '3 x 8 a 12', time: '', feedback: '', rest: '90s', notes: '' },
          { id: 'str2', name: 'Stiff com Halteres (RDL)', load: '', setsReps: '3 x 8 a 12', time: '', feedback: '', rest: '90s', notes: '' },
          { id: 'str3', name: 'Remada Baixa Neutra', load: '', setsReps: '3 x 8 a 12', time: '', feedback: '', rest: '90s', notes: '' },
          { id: 'str4', name: 'Supino Reto (Halter ou Máquina)', load: '', setsReps: '3 x 8 a 12', time: '', feedback: '', rest: '90s', notes: '' }
        ],
        deceleration: [
          { id: 'dec1', name: 'Alongamento Glúteo (Deitada, perna em \'4\')', load: '', setsReps: '1', time: '1 min cada', feedback: '', rest: '-', notes: '' },
          { id: 'dec2', name: 'Respiração Diafragmática (Deitada)', load: '', setsReps: '1', time: '2 minutos', feedback: '', rest: '-', notes: '' }
        ]
      };
    }

    updateData({
      studentName: student.name,
      healthData: `Condições: ${student.medicalConditions} | Lesões: ${student.injuries} | Meds: ${student.medications}`,
      triggers: student.objectives,
      phases: initialPhases
    });

    setView('workout');
  };

  if (view === 'landing') {
    return <LandingPage onAccessDashboard={() => setView('dashboard')} />;
  }

  if (view === 'dashboard') {
    return (
      <div className="relative">
        <button 
          onClick={() => setView('landing')}
          className="absolute top-6 right-5 z-50 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest"
        >
          Sair
        </button>
        <StudentDashboard onStartWorkout={startWorkout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans pb-24 print:bg-white print:pb-0">
      
      {/* Header */}
      <header className="bg-[#071D49] text-white p-4 shadow-md sticky top-0 z-10 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('dashboard')}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors mr-1"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="bg-[#00AEEF] text-[#071D49] font-black px-2.5 py-1 rounded-lg text-sm tracking-tight shadow">
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
        <h1 className="text-2xl font-black text-[#071D49] uppercase tracking-wider">BENAI BERNARDO</h1>
        <div className="w-32 h-1 bg-[#00AEEF] mx-auto my-1 rounded"></div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Consultoria de Treinamento • Relatório de Sessão</p>
      </div>

      <main className="max-w-3xl mx-auto p-4 space-y-4 print:p-0">
        <StudentSelector data={data} updateData={updateData} />
        <PreWorkoutTriggers data={data} updateData={updateData} />
        <BiomechanicalTests data={data} updateData={updateData} />
        <WorkoutExecution data={data} updateData={updateData} />
        <PostWorkoutFeedback data={data} updateData={updateData} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-100 via-gray-100/90 to-transparent flex justify-center print:hidden pointer-events-none z-20">
        <button 
          onClick={handlePrint}
          className="bg-[#00AEEF] hover:bg-[#0090C5] text-[#071D49] font-black py-4 px-8 rounded-full shadow-2xl flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95 pointer-events-auto border-2 border-white/20"
        >
          <Printer className="w-5 h-5" />
          Salvar / Gerar Relatório PDF
        </button>
      </div>

    </div>
  );
}

