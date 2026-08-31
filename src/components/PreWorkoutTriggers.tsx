import React, { useState } from 'react';
import { Card, SectionTitle, Textarea } from './ui';
import { BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkoutData } from '../types';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const PreWorkoutTriggers: React.FC<Props> = ({ data, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`border-t-4 border-t-[#fd7e14] ${!data.triggers ? 'print:hidden' : ''}`}>
      <div 
        className="flex justify-between items-center cursor-pointer print:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SectionTitle icon={BrainCircuit} colorClass="text-[#fd7e14] mb-0">
          Alinhamento e Gatilhos (Pré-Treino)
        </SectionTitle>
        {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </div>
      
      {/* Sempre visível na impressão, caso preenchido */}
      <div className={`${isOpen ? 'block mt-4' : 'hidden'} print:block print:mt-0`}>
        <SectionTitle icon={BrainCircuit} colorClass="text-[#fd7e14] hidden print:flex">
          Alinhamento e Gatilhos
        </SectionTitle>
        <Textarea 
          placeholder="Ex: Aluno com TEA (evitar toques inesperados, usar comandos claros e diretos). Reforçar que a dor da lombalgia é esperada em nível 3/10..."
          value={data.triggers}
          onChange={(e) => updateData({ triggers: e.target.value })}
          className="border-[#fd7e14]/30 focus:ring-[#fd7e14]"
        />
      </div>
    </Card>
  );
};
