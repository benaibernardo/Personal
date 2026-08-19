import React from 'react';
import { Card, Input, Label, SectionTitle, Textarea } from './ui';
import { MessageSquareHeart } from 'lucide-react';
import { WorkoutData } from '../types';
import { EffortSlider } from './EffortSlider';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const PostWorkoutFeedback: React.FC<Props> = ({ data, updateData }) => {
  const updateFeedback = (key: keyof WorkoutData['feedback'], value: any) => {
    updateData({
      feedback: { ...data.feedback, [key]: value }
    });
  };

  const { fatigue, likes, discomforts, adjustments } = data.feedback;
  const hasAnyFeedback = fatigue !== '' || !!likes || !!discomforts || !!adjustments;

  return (
    <Card className={`border-t-4 border-t-[#e83e8c] ${!hasAnyFeedback ? 'print:hidden' : ''}`}>
      <SectionTitle icon={MessageSquareHeart} colorClass="text-[#e83e8c]">
        Evolução e Feedback Pós-Treino
      </SectionTitle>

      <div className="space-y-4">
        
        <div className={fatigue === '' ? 'print:hidden' : ''}>
          <EffortSlider 
            label="Fadiga Pós-Treino (0-10)"
            value={fatigue}
            onChange={(val) => updateFeedback('fatigue', val)}
          />
        </div>

        <div className={!likes ? 'print:hidden' : ''}>
          <Label>O que o aluno mais gostou?</Label>
          <Input 
            placeholder="Ex: Sentiu-se bem no agachamento"
            value={likes}
            onChange={(e) => updateFeedback('likes', e.target.value)}
          />
        </div>

        <div className={!discomforts ? 'print:hidden' : ''}>
          <Label>O que gerou desconforto?</Label>
          <Input 
            placeholder="Ex: Leve pinçada lombar na remada"
            value={discomforts}
            onChange={(e) => updateFeedback('discomforts', e.target.value)}
          />
        </div>

        <div className={!adjustments ? 'print:hidden' : ''}>
          <Label>Ajustes prioritários para próxima sessão</Label>
          <Textarea 
            placeholder="Ex: Reduzir carga na remada, focar mais em mobilidade de quadril antes do treino."
            value={adjustments}
            onChange={(e) => updateFeedback('adjustments', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
