import React from 'react';
import { X, Phone, AlertTriangle, User, Target, Activity } from 'lucide-react';
import { Student } from '../types';

interface Props {
  student: Student;
  onClose: () => void;
  onStartWorkout: (student: Student) => void;
}

export const StudentDetailsModal: React.FC<Props> = ({ student, onClose, onStartWorkout }) => {
  const hasHealthAlert = 
    student.medicalConditions.toLowerCase() !== 'nenhuma' || 
    student.injuries.toLowerCase() !== 'nenhuma' || 
    student.medications.toLowerCase() !== 'nenhum';

  const handleWhatsApp = () => {
    const phone = student.phone.replace(/\D/g, '');
    const number = phone.length >= 10 ? `55${phone}` : phone;
    const msg = encodeURIComponent(`Olá ${student.name.split(' ')[0]}, aqui é o Benai Bernardo. Tudo pronto para o nosso treino?`);
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-slate-50 rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                student.modality === 'presencial' ? 'bg-[#00AEEF]/10 text-[#00AEEF]' : 'bg-gray-200 text-gray-600'
              }`}>
                {student.modality}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#071D49]">{student.name}</h2>
            <button 
              onClick={handleWhatsApp}
              className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mt-2 flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              <Phone className="w-3 h-3" /> {student.phone}
            </button>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-white">
          
          {hasHealthAlert && (
            <div className="mb-6 p-4 rounded-xl border-2 border-red-100 bg-red-50">
              <h3 className="text-red-700 font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Alertas de Saúde / Restrições
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-0.5">Condições Médicas</span>
                  <p className="text-sm font-semibold text-red-900">{student.medicalConditions}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-0.5">Lesões / Dores</span>
                  <p className="text-sm font-semibold text-red-900">{student.injuries}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-0.5">Medicações</span>
                  <p className="text-sm font-semibold text-red-900">{student.medications}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-[#071D49] font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
              <Target className="w-4 h-4 text-[#00AEEF]" /> Objetivos
            </h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {student.objectives}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-white sm:rounded-b-3xl pb-8 sm:pb-5">
          <button 
            onClick={() => onStartWorkout(student)}
            className="w-full bg-[#00AEEF] hover:bg-[#0090C5] text-white font-black py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transform transition-transform active:scale-95"
          >
            <Activity className="w-5 h-5" />
            Iniciar Treino • {student.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};
