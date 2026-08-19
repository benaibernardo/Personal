import React from 'react';
import { Card, Input, Label, SectionTitle } from './ui';
import { Ruler, PlayCircle, PlusCircle, Trash2 } from 'lucide-react';
import { WorkoutData, BiomechanicalTest } from '../types';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

export const BiomechanicalTests: React.FC<Props> = ({ data, updateData }) => {
  
  const addTest = () => {
    updateData({
      tests: [
        ...data.tests, 
        { id: Date.now().toString(), name: '', result: '' }
      ]
    });
  };

  const updateTest = (id: string, field: keyof BiomechanicalTest, value: string) => {
    const updatedTests = data.tests.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    );
    updateData({ tests: updatedTests });
  };

  const removeTest = (id: string) => {
    updateData({ tests: data.tests.filter(test => test.id !== id) });
  };

  const hasAnyFilledTest = data.tests.some(t => t.name || t.result);

  return (
    <Card className={`border-t-4 border-t-[#20c997] ${!hasAnyFilledTest ? 'print:hidden' : ''}`}>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <SectionTitle icon={Ruler} colorClass="text-[#20c997] mb-0">
          Testes Biomecânicos
        </SectionTitle>
        <button 
          onClick={addTest} 
          className="print:hidden text-[#20c997] hover:bg-[#20c997]/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
        >
          <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>
      
      <SectionTitle icon={Ruler} colorClass="text-[#20c997] hidden print:flex">
        Testes Biomecânicos
      </SectionTitle>
      
      {data.tests.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-4 print:hidden">Nenhum teste adicionado.</p>
      )}

      <div className="space-y-3">
        {data.tests.map((test) => {
          const isEmptyTest = !test.name && !test.result;
          return (
            <div key={test.id} className={`bg-gray-50 rounded-xl p-3 border border-gray-100 print:bg-transparent print:border-b print:rounded-none relative group ${isEmptyTest ? 'print:hidden' : ''}`}>
              
              <div className="flex gap-2 mb-2 items-start">
                <Input 
                  placeholder="Nome do Teste (Ex: Dorsiflexão)" 
                  value={test.name}
                  onChange={(e) => updateTest(test.id, 'name', e.target.value)}
                  className="font-bold text-[#071D49] text-sm bg-transparent border-none p-0 focus:ring-0 shadow-none px-1"
                />
                <button 
                  onClick={() => removeTest(test.id)} 
                  className="text-red-400 hover:text-red-600 print:hidden p-1 opacity-50 group-hover:opacity-100 transition-opacity"
                  title="Remover teste"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <Input 
                placeholder="Resultado do teste (Ex: Assimetria D>E)" 
                value={test.result}
                onChange={(e) => updateTest(test.id, 'result', e.target.value)}
                className="text-sm"
              />
              
            </div>
          );
        })}
      </div>
    </Card>
  );
};
