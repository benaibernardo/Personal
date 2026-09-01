import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList,  Activity, UserPlus, AlertTriangle, ChevronRight, CheckCircle2, X, Trash2, Wand2 } from 'lucide-react';
import { Student } from '../types';
import { fetchStudentsFromFirestore, saveStudentToFirestore, deleteStudentFromFirestore } from '../services/db';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'samiacristinayebahi',
    name: 'Samia Cristina Yebahi',
    email: 'samia.docs.ye@gmail.com',
    phone: '(41) 99632-6363',
    objectives: 'Hipertrofia, Emagrecimento, Força/Condicionamento, Saúde/Longevidade',
    medicalConditions: 'Fibromialgia, TEA1, condromalacia patelar, lombalgia',
    injuries: 'Nenhuma',
    medications: 'Sertralina, Bupropiona',
    lastUpdate: new Date().toISOString()
  }
];

interface Props {
  onStartWorkout: (student: Student) => void;
}

export const StudentDashboard: React.FC<Props> = ({ onStartWorkout }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  useEffect(() => {
    fetchStudentsFromFirestore().then(fetched => {
      if (fetched && fetched.length > 0) {
        setStudents(fetched);
      }
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isInjectingDummy, setIsInjectingDummy] = useState(false);
  const [dummyName, setDummyName] = useState('Aluno Exemplo');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [activeTab, setActiveTab] = useState<'alunos' | 'agenda'>('alunos');

  // New student form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newObjectives, setNewObjectives] = useState('');
  const [newConditions, setNewConditions] = useState('Nenhuma');
  const [newInjuries, setNewInjuries] = useState('Nenhuma');
  const [newMeds, setNewMeds] = useState('Nenhuma');

  
  const handleDeleteStudent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };
  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteStudentFromFirestore(deleteConfirmId);
      setStudents(students.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

    const handleInjectLarissa = () => {
    setIsInjectingDummy(true);
  };
  const confirmInject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dummyName) return;
    setIsInjectingDummy(false);
    const { seedLarissa } = await import('../seedLarissa');
    const success = await seedLarissa(dummyName);
    if (success) {
      window.location.reload();
    } else {
      alert("Erro ao criar aluno fictício.");
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Generate Slug ID based on name (nome-sobrenome or nomesobrenome sem espaços)
    let baseSlug = newName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "");
      
    let slug = baseSlug;
    let counter = 1;
    while (students.some(s => s.id === slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const newStudent: Student = {
      id: slug,
      name: newName.trim(),
      email: newEmail.trim() || 'aluno@exemplo.com',
      phone: newPhone.trim() || '(41) 99999-9999',
      objectives: newObjectives.trim() || 'Condicionamento Geral e Saúde',
      medicalConditions: newConditions.trim(),
      injuries: newInjuries.trim(),
      medications: newMeds.trim(),
      lastUpdate: new Date().toISOString()
    };

    await saveStudentToFirestore(newStudent);
    setStudents([newStudent, ...students]);
    setIsAddingStudent(false);
    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewObjectives('');
    setNewConditions('Nenhuma');
    setNewInjuries('Nenhuma');
    setNewMeds('Nenhuma');
  };

    const handleOpenAnamnese = () => {
    window.location.href = '/anamnese.html';
  };

  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Presencial */}
      <header className="bg-[#071D49] text-white pt-6 pb-20 px-5 shadow-md rounded-b-[40px]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#00AEEF] text-[#071D49] font-black px-2.5 py-1 rounded-lg text-sm tracking-tight shadow">BB</div>
              <div>
                <h1 className="text-xl font-bold tracking-wide leading-none">BENAI BERNARDO</h1>
                <p className="text-[10px] text-[#00AEEF] uppercase font-semibold tracking-widest mt-0.5">Consultoria de Treinamento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
            <button 
              onClick={handleOpenAnamnese}
              className="bg-[#00AEEF] hover:bg-[#0090C5] text-[#071D49] px-4 py-2 rounded-xl flex items-center justify-center transition-colors shadow-lg"
              title="Abrir Anamnese"
            >
              <ClipboardList className="w-5 h-5" />
            </button>
            <button 
              onClick={handleInjectLarissa}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-colors shadow-lg"
              title="Gerar Aluno Fictício (Com Treino ABC)"
            >
              <Wand2 className="w-5 h-5" />
            </button>
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
        
        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 relative z-10">
          <button
            onClick={() => setActiveTab('alunos')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'alunos' ? 'bg-[#071D49] text-white' : 'text-gray-500 hover:text-[#071D49]'
            }`}
          >
            Alunos
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'agenda' ? 'bg-[#071D49] text-white' : 'text-gray-500 hover:text-[#071D49]'
            }`}
          >
            Agenda
          </button>
        </div>

        {activeTab === 'alunos' ? (
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
                  onClick={() => navigate(`/aluno/${student.id}`)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00AEEF]"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#071D49] text-lg leading-tight group-hover:text-[#00AEEF] transition-colors">{student.name}</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartWorkout(student);
                        }}
                        className="bg-[#071D49] hover:bg-[#0A2663] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
                        title="Registrar Treino / Prontuário"
                      >
                        <Activity className="w-3.5 h-3.5 text-[#00AEEF]" />
                        Prontuário
                      </button>
                      <button 
                        onClick={(e) => handleDeleteStudent(e, student.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-500 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        title="Remover Aluno"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
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
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
             <div className="w-16 h-16 bg-blue-50 text-[#00AEEF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <h2 className="text-xl font-bold text-[#071D49] mb-2">Sua Agenda (Em Breve)</h2>
             <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Aqui você verá seus dias de folga, sessões concluídas e quem está agendado para o dia.</p>
             <button className="bg-[#071D49] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md opacity-50 cursor-not-allowed">Adicionar Folga</button>
          </div>
        )}

      </main>

      {/* Modal Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <h2 className="text-xl font-bold text-[#071D49] mb-2">Remover Aluno</h2>
            <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inject Dummy */}
      {isInjectingDummy && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-[#071D49] mb-2">Gerar Aluno Fictício</h2>
            <p className="text-sm text-gray-500 mb-4">Qual o nome do aluno fictício que deseja criar?</p>
            <form onSubmit={confirmInject} className="space-y-4">
              <input 
                type="text"
                value={dummyName}
                onChange={(e) => setDummyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInjectingDummy(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  Gerar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Aluno / Fictício */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddingStudent(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-[#071D49] mb-1">Novo Aluno (Teste / Fictício)</h2>
            <p className="text-xs text-gray-500 mb-5">Cadastre um aluno para testar o prontuário e fluxos sem interferir na Samia.</p>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Carlos Teste" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail</label>
                  <input 
                    type="email" 
                    placeholder="carlos@teste.com" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefone</label>
                  <input 
                    type="text" 
                    placeholder="(41) 99999-9999" 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Objetivos</label>
                <input 
                  type="text" 
                  placeholder="Ex: Hipertrofia, Força, Reabilitação" 
                  value={newObjectives} 
                  onChange={(e) => setNewObjectives(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Condições Médicas</label>
                <input 
                  type="text" 
                  placeholder="Ex: Nenhuma ou Lombalgia leve" 
                  value={newConditions} 
                  onChange={(e) => setNewConditions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lesões</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Nenhuma" 
                    value={newInjuries} 
                    onChange={(e) => setNewInjuries(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Medicamentos</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Nenhum" 
                    value={newMeds} 
                    onChange={(e) => setNewMeds(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#071D49] hover:bg-[#0A2663] text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  Cadastrar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
