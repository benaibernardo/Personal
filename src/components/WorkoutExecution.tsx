import React from 'react';
import { Card, Input, Label, SectionTitle } from './ui';
import { Dumbbell, PlusCircle, Trash2 } from 'lucide-react';
import { PhaseExercise, StrengthExercise, WorkoutData } from '../types';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const WorkoutExecution: React.FC<Props> = ({ data, updateData }) => {

  const addPhaseEx = (phase: 'mobility' | 'activation' | 'deceleration') => {
    const list = data.phases[phase];
    updateData({
      phases: {
        ...data.phases,
        [phase]: [...list, { id: Date.now().toString(), name: '', time: '', feedback: '' }]
      }
    });
  };

  const updatePhaseEx = (phase: 'mobility' | 'activation' | 'deceleration', id: string, field: keyof PhaseExercise, value: string) => {
    const list = data.phases[phase].map(ex => ex.id === id ? { ...ex, [field]: value } : ex);
    updateData({ phases: { ...data.phases, [phase]: list } });
  };

  const removePhaseEx = (phase: 'mobility' | 'activation' | 'deceleration', id: string) => {
    const list = data.phases[phase].filter(ex => ex.id !== id);
    updateData({ phases: { ...data.phases, [phase]: list } });
  };

  const addStrengthEx = () => {
    const list = data.phases.strength;
    updateData({
      phases: {
        ...data.phases,
        strength: [...list, { id: Date.now().toString(), name: '', load: '', setsReps: '', notes: '' }]
      }
    });
  };

  const updateStrengthEx = (id: string, field: keyof StrengthExercise, value: string) => {
    const list = data.phases.strength.map(ex => ex.id === id ? { ...ex, [field]: value } : ex);
    updateData({ phases: { ...data.phases, strength: list } });
  };

  const removeStrengthEx = (id: string) => {
    const list = data.phases.strength.filter(ex => ex.id !== id);
    updateData({ phases: { ...data.phases, strength: list } });
  };

  const renderSimplePhase = (title: string, phase: 'mobility' | 'activation' | 'deceleration', color: string) => (
    <div className={`mb-6 ${data.phases[phase].length === 0 ? 'print:hidden' : ''}`}>
      <div className={`flex justify-between items-center mb-2 px-2 py-1 rounded text-white font-bold print:text-black`} style={{ backgroundColor: color }}>
        <h3 className="uppercase tracking-wide text-sm print:text-black">{title}</h3>
        <button onClick={() => addPhaseEx(phase)} className="print:hidden hover:opacity-80">
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      
      {data.phases[phase].length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-2 print:hidden">Nenhum exercício adicionado.</p>
      )}

      <div className="space-y-3">
        {data.phases[phase].map(ex => (
          <div key={ex.id} className={`flex flex-col gap-2 bg-gray-50 p-2 rounded-lg relative print:bg-transparent print:border-b print:rounded-none ${(!ex.name && !ex.time && !ex.feedback) ? 'print:hidden' : ''}`}>
            <div className="flex gap-2 items-center">
              <Input 
                placeholder="Nome do Exercício" 
                value={ex.name} 
                onChange={(e) => updatePhaseEx(phase, ex.id, 'name', e.target.value)}
                className="font-semibold text-[#071D49]"
              />
              <button onClick={() => removePhaseEx(phase, ex.id)} className="text-red-400 print:hidden p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Tempo / Reps" 
                value={ex.time} 
                onChange={(e) => updatePhaseEx(phase, ex.id, 'time', e.target.value)}
                className="text-xs"
              />
              <Input 
                placeholder="Feedback Tátil/Técnico" 
                value={ex.feedback} 
                onChange={(e) => updatePhaseEx(phase, ex.id, 'feedback', e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const hasAnyExercise = data.phases.mobility.length > 0 || data.phases.activation.length > 0 || data.phases.strength.length > 0 || data.phases.deceleration.length > 0;

  return (
    <Card className={`border-t-4 border-t-[#00AEEF] ${!hasAnyExercise ? 'print:hidden' : ''}`}>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <SectionTitle icon={Dumbbell} colorClass="text-[#00AEEF] mb-0">
          Execução do Treino
        </SectionTitle>
      </div>

      <SectionTitle icon={Dumbbell} colorClass="text-[#00AEEF] hidden print:flex">
        Execução do Treino
      </SectionTitle>

      {renderSimplePhase('1. Mobilidade', 'mobility', '#20c997')}
      {renderSimplePhase('2. Ativação', 'activation', '#fd7e14')}

      <div className={`mb-6 ${data.phases.strength.length === 0 ? 'print:hidden' : ''}`}>
        <div className="flex justify-between items-center mb-2 px-2 py-1 rounded text-white font-bold bg-[#00AEEF] print:text-black">
          <h3 className="uppercase tracking-wide text-sm print:text-black">3. Força (Principal)</h3>
          <button onClick={addStrengthEx} className="print:hidden hover:opacity-80">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {data.phases.strength.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-2 print:hidden">Nenhum exercício adicionado.</p>
        )}

        <div className="space-y-4">
          {data.phases.strength.map(ex => (
            <div key={ex.id} className={`flex flex-col gap-2 bg-blue-50/50 border border-blue-100 p-3 rounded-lg relative print:bg-transparent print:border-b print:rounded-none ${(!ex.name && !ex.load && !ex.setsReps && !ex.notes) ? 'print:hidden' : ''}`}>
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="Nome do Exercício" 
                  value={ex.name} 
                  onChange={(e) => updateStrengthEx(ex.id, 'name', e.target.value)}
                  className="font-bold text-[#071D49] border-blue-200"
                />
                <button onClick={() => removeStrengthEx(ex.id)} className="text-red-400 print:hidden p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Séries x Reps (Ex: 3 x 10)" 
                  value={ex.setsReps} 
                  onChange={(e) => updateStrengthEx(ex.id, 'setsReps', e.target.value)}
                  className="text-sm border-blue-200"
                />
                <Input 
                  placeholder="Carga (kg)" 
                  value={ex.load} 
                  onChange={(e) => updateStrengthEx(ex.id, 'load', e.target.value)}
                  className="text-sm border-blue-200"
                />
              </div>
              <Input 
                placeholder="Observações de Execução / Dor" 
                value={ex.notes} 
                onChange={(e) => updateStrengthEx(ex.id, 'notes', e.target.value)}
                className="text-sm border-blue-200 text-gray-600"
              />
            </div>
          ))}
        </div>
      </div>

      {renderSimplePhase('4. Desaceleração', 'deceleration', '#e83e8c')}

    </Card>
  );
};
