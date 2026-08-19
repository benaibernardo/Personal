import React from 'react';
import { Label } from './ui';

interface Props {
  value: number | '';
  onChange: (value: number) => void;
  label: string;
}

export const EffortSlider: React.FC<Props> = ({ value, onChange, label }) => {
  const numValue = value === '' ? 0 : value;

  const getEmojiData = (val: number) => {
    if (val <= 2) return { emoji: '😄', text: 'Muito Fácil', color: 'text-emerald-500' };
    if (val <= 4) return { emoji: '🙂', text: 'Fácil', color: 'text-emerald-600' };
    if (val <= 6) return { emoji: '😐', text: 'Moderado', color: 'text-amber-500' };
    if (val <= 8) return { emoji: '🥵', text: 'Difícil', color: 'text-orange-500' };
    return { emoji: '🔥', text: 'Esforço Máximo', color: 'text-red-600' };
  };

  const { emoji, text, color } = getEmojiData(numValue);

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-col gap-2 print:hidden bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl filter drop-shadow-sm transition-all duration-300 transform scale-110">
            {emoji}
          </span>
          <div className="text-right">
            <span className={`text-sm font-black uppercase tracking-wider block ${color}`}>
              {text}
            </span>
            <span className="font-bold text-2xl text-[#071D49] leading-none">
              {numValue} <span className="text-sm text-gray-400 font-medium">/10</span>
            </span>
          </div>
        </div>

        <input 
          type="range" 
          min="0" max="10" 
          value={numValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00AEEF] hover:accent-[#071D49] transition-all"
        />
        
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mt-1">
          <span>0</span>
          <span>10</span>
        </div>
      </div>
      
      <div className="hidden print:block font-bold text-[#071D49]">
        {value !== '' ? value : '-'} / 10 ({text})
      </div>
    </div>
  );
};
