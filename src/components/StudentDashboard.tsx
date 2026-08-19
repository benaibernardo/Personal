import React, { useState } from 'react';
import { Search, Activity, UserPlus, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';
import { StudentDetailsModal } from './StudentDetailsModal';

// Dados de exemplo realistas (Mock)
const MOCK_STUDENTS: Student[] = [
  {
    id: 'samia-01',
    name: 'Samia Cristina Yebahi',
    email: 'samia.docs.ye@gmail.com',
    phone: '(41) 99632-6363',
    modality: 'presencial',
    objectives: 'Hipertrofia, Emagrecimento, Força/Condicionamento, Saúde/Longevidade',
    medicalConditions: 'Fibromialgia, TEA1, condromalacia patelar, lombalgia',
    injuries: 'Nenhuma',
    medications: 'Sertralina, Bupropiona',
    lastUpdate: new Date().toISOString()
  },
  {
    id: '1',
    name: 'Maria Clara Souza',
    email: 'maria.clara@email.com',
    phone: '(41) 99999-1234',
    modality: 'presencial',
    objectives: 'Ganho de força, melhora de mobilidade no quadril e longevidade.',
    medicalConditions: 'Nenhuma',
    injuries: 'Condromalácia patelar grau 1 (joelho direito). Sinto leve dor ao agachar muito fundo.',
    medications: 'Nenhum',
    lastUpdate: '2026-08-16T10:00:00Z'
  },
  {
    id: '2',
    name: 'Roberto Almeida',
    email: 'roberto@email.com',
    phone: '(41) 98888-5678',
    modality: 'online',
    objectives: 'Emagrecimento e definição muscular.',
    medicalConditions: 'Hipertensão leve',
    injuries: 'Hérnia de disco L4-L5',
    medications: 'Losartana 50mg',
    lastUpdate: '2026-08-15T14:30:00Z'
  },
  {
    id: '3',
    name: 'Felipe Mendes',
    email: 'felipe@email.com',
    phone: '(41) 97777-9012',
    modality: 'presencial',
    objectives: 'Hipertrofia e melhora no condicionamento cardiovascular.',
    medicalConditions: 'Nenhuma',
    injuries: 'Nenhuma',
    medications: 'Nenhum',
    lastUpdate: '2026-08-17T08:15:00Z'
  }
];

interface Props {
  onStartWorkout: (student: Student) => void;
}

export const StudentDashboard: React.FC<Props> = ({ onStartWorkout }) => {
  const [filter, setFilter] = useState<'todos' | 'presencial' | 'online'>('presencial');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesFilter = filter === 'todos' || s.modality === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Presencial */}
      <header className="bg-[#071D49] text-white pt-6 pb-20 px-5 shadow-md rounded-b-[40px]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#00AEEF] text-[#071D49] font-black px-2.5 py-1 rounded-lg text-sm tracking-tight shadow">BB</div>
            <div>
              <h1 className="text-xl font-bold tracking-wide leading-none">BENAI BERNARDO</h1>
              <p className="text-[10px] text-[#00AEEF] uppercase font-semibold tracking-widest mt-0.5">Consultoria de Treinamento</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar aluno..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-300 focus:outline-none focus:bg-white focus:text-[#071D49] focus:placeholder:text-gray-400 transition-all font-medium"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-5 -mt-12">
        
        {/* Filtros */}
        <div className="flex p-1 bg-white border border-gray-200 rounded-xl mb-6 shadow-sm">
          <button 
            onClick={() => setFilter('presencial')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'presencial' ? 'bg-[#00AEEF] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Presencial
          </button>
          <button 
            onClick={() => setFilter('online')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'online' ? 'bg-[#071D49] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Online
          </button>
        </div>

        {/* Lista de Alunos */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-gray-200 border-dashed">
              <p className="text-gray-400 font-medium">Nenhum aluno encontrado.</p>
            </div>
          ) : (
            filteredStudents.map(student => {
              const hasAlert = student.medicalConditions.toLowerCase() !== 'nenhuma' || student.injuries.toLowerCase() !== 'nenhuma';

              return (
                <div 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00AEEF]"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#071D49] text-lg leading-tight group-hover:text-[#00AEEF] transition-colors">{student.name}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                  
                  <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-4 pr-6">
                    {student.objectives}
                  </p>

                  <div className="flex items-center gap-2">
                    {hasAlert ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                        <AlertTriangle className="w-3 h-3" /> Alerta de Saúde
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> Sem Restrições
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* FAB Novo Aluno (Apenas presencial) */}
      {filter === 'presencial' && (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#00AEEF] hover:bg-[#0090C5] text-white rounded-full shadow-xl flex items-center justify-center transform transition-transform hover:scale-105 active:scale-95">
          <UserPlus className="w-6 h-6" />
        </button>
      )}

      {/* Modal do Aluno */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          onStartWorkout={(student) => {
            setSelectedStudent(null);
            onStartWorkout(student);
          }}
        />
      )}
    </div>
  );
};
