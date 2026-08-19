import React from 'react';
import { Card, Input, Label, SectionTitle } from './ui';
import { User, Calendar, Activity, AlertCircle } from 'lucide-react';
import { WorkoutData } from '../types';
import { EffortSlider } from './EffortSlider';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const StudentSelector: React.FC<Props> = ({ data, updateData }) => {
  return (
    <Card className="border-t-4 border-t-[#071D49]">
      <SectionTitle icon={User}>Perfil e Aluno</SectionTitle>
      
      <div className="space-y-4">
        <div className={!data.studentName ? 'print:hidden' : ''}>
          <Label>Nome do Aluno</Label>
          <Input 
            type="text" 
            placeholder="Ex: João Silva" 
            value={data.studentName}
            onChange={(e) => updateData({ studentName: e.target.value })}
            className="text-lg font-bold placeholder:font-normal"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={!data.date ? 'print:hidden' : ''}>
            <Label className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Data</Label>
            <Input 
              type="date" 
              value={data.date}
              onChange={(e) => updateData({ date: e.target.value })}
            />
          </div>
          <div className={!data.workoutType ? 'print:hidden' : ''}>
            <Label className="flex items-center gap-1"><Activity className="w-3 h-3"/> Tipo de Treino</Label>
            <Input 
              type="text" 
              placeholder="Ex: Full Body A" 
              value={data.workoutType}
              onChange={(e) => updateData({ workoutType: e.target.value })}
            />
          </div>
        </div>

        <div className={data.stressLevel === '' ? 'print:hidden' : ''}>
          <EffortSlider 
            label="Nível de Prontidão / Estresse (0-10)"
            value={data.stressLevel}
            onChange={(val) => updateData({ stressLevel: val })}
          />
        </div>

        <div className={`p-3 rounded-lg border ${!data.healthData ? 'print:hidden bg-red-50 border-red-100' : 'bg-red-50 border-red-100 print:bg-transparent print:border-none print:p-0'}`}>
          <Label className="text-red-700 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Patologias, Restrições e Medicações
          </Label>
          <Input 
            type="text" 
            placeholder="Ex: Condromalácia grau 2, Hipertenso" 
            value={data.healthData}
            onChange={(e) => updateData({ healthData: e.target.value })}
            className="bg-white border-red-200 focus:ring-red-400 print:text-red-700 font-medium"
          />
        </div>
      </div>
    </Card>
  );
};
