import React, { useState } from 'react';
import { MessageSquareHeart, ChevronDown, ChevronUp, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutData } from '../types';
import { EffortSlider } from './EffortSlider';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const PostWorkoutFeedback: React.FC<Props> = ({ data, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const updateFeedback = (key: keyof WorkoutData['feedback'], value: any) => {
    updateData({
      feedback: { ...data.feedback, [key]: value }
    });
  };

  const { fatigue, likes, discomforts, adjustments } = data.feedback;
  const hasAnyFeedback = fatigue !== '' || !!likes || !!discomforts || !!adjustments;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 px-4 py-3 rounded-xl ${isCompleted ? 'bg-gray-100 border-gray-300' : 'bg-pink-50 border-pink-500'} border-l-4 ${isCompleted ? 'border-l-gray-400' : 'border-pink-500'} flex items-center justify-between shadow-sm transition-colors`}
        >
          <div className="flex items-center gap-2">
            <MessageSquareHeart className={`w-5 h-5 ${isCompleted ? 'text-gray-400' : 'text-pink-600'}`} />
            <h2 className={`font-black uppercase tracking-wider text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-pink-600'}`}>Pós Treino</h2>
          </div>
          <div className="flex items-center gap-3">
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-gray-400" />}
            {isOpen ? <ChevronUp className={isCompleted ? 'text-gray-400' : 'text-pink-600'} /> : <ChevronDown className={isCompleted ? 'text-gray-400' : 'text-pink-600'} />}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-5 rounded-3xl border-2 ${isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-pink-200'} shadow-sm space-y-5 transition-colors`}>
              
              <div className={fatigue === '' ? 'print:hidden' : ''}>
                <EffortSlider 
                  label="Fadiga Pós-Treino (0-10)"
                  value={fatigue}
                  onChange={(val) => updateFeedback('fatigue', val)}
                />
              </div>

              <div className={!likes ? 'print:hidden' : ''}>
                <label className="text-xs font-bold text-gray-500 uppercase">O que o aluno mais gostou?</label>
                <input 
                  type="text"
                  placeholder="Ex: Sentiu-se bem no agachamento"
                  value={likes}
                  onChange={(e) => updateFeedback('likes', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold text-gray-800"
                />
              </div>

              <div className={!discomforts ? 'print:hidden' : ''}>
                <label className="text-xs font-bold text-gray-500 uppercase">O que gerou desconforto?</label>
                <input 
                  type="text"
                  placeholder="Ex: Leve pinçada lombar na remada"
                  value={discomforts}
                  onChange={(e) => updateFeedback('discomforts', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold text-gray-800"
                />
              </div>

              <div className={!adjustments ? 'print:hidden' : ''}>
                <label className="text-xs font-bold text-gray-500 uppercase">Ajustes prioritários para próxima sessão</label>
                <textarea 
                  placeholder="Ex: Reduzir carga na remada, focar mais em mobilidade de quadril antes do treino."
                  value={adjustments}
                  onChange={(e) => updateFeedback('adjustments', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm text-gray-800 min-h-[80px]"
                />
              </div>
              
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => {
                    setIsCompleted(!isCompleted);
                    if (!isCompleted) setIsOpen(false); // fechar gaveta se concluir
                  }}
                  className={`px-5 py-3 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isCompleted ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                >
                  {isCompleted ? 'Desmarcar' : <><CheckCircle2 className="w-5 h-5" /> Concluir</>}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
