import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Calendar, CreditCard, ChevronRight, Download, Activity, CheckCircle2, Clock, MapPin, DollarSign, ShieldCheck, Trash2 } from 'lucide-react';
import { Student, SessionLog } from '../types';
import { fetchSessionLogs, deleteSessionLog } from '../services/db';

interface Props {
  student: Student;
  onClose: () => void;
  isStandalone?: boolean;
}

export const StudentPortal: React.FC<Props> = ({ student, onClose, isStandalone }) => {
  const [activeTab, setActiveTab] = useState<'treino' | 'agenda' | 'financeiro'>('treino');
  const [hasSignedContract, setHasSignedContract] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);

  useEffect(() => {
    fetchSessionLogs(student.id).then(logs => {
      // Sort logs by date descending
      const sorted = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessionLogs(sorted);
    });
  }, [student.id]);

  const [fullName, setFullName] = useState(student.name);
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDay, setPaymentDay] = useState('10');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedImage, setAgreedImage] = useState(false);

  const handleSignContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Você precisa concordar com os termos do contrato para continuar.');
      return;
    }
    if (!cpf.trim()) {
      alert('Por favor, informe o seu CPF para validação do contrato.');
      return;
    }
    setHasSignedContract(true);
  };

  if (!hasSignedContract) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Simples com Botão Voltar */}
        <header className="bg-[#071D49] text-white p-5 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isStandalone && (
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wide">Bem-vinda, {student.name.split(' ')[0]}</h1>
              <p className="text-sm text-[#00AEEF]">Portal Exclusivo do Aluno</p>
            </div>
          </div>
          <button 
            onClick={() => setHasSignedContract(true)}
            className="text-xs font-bold uppercase tracking-widest text-[#00AEEF] hover:text-white transition-colors border border-[#00AEEF] hover:bg-[#00AEEF] px-4 py-2 rounded-lg"
            title="Ignorar assinatura para fins de teste"
          >
            Pular Contrato
          </button>
        </header>

        {/* Termo de Aceite & Contrato Completo */}
        <main className="flex-1 p-5 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#00AEEF]" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#071D49] mb-2">Contrato de Acompanhamento Personalizado</h2>
            <p className="text-xs text-gray-500 mb-8">Revise os termos contratuais, preencha seus dados e confirme o aceite eletrônico para liberar seu portal.</p>
            
            {/* Campos de Cadastro do Aluno */}
            <form onSubmit={handleSignContract} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              
              {/* Coluna 1: O Contrato Detalhado */}
              <div className="bg-gray-50 p-6 rounded-2xl text-xs md:text-sm text-gray-700 border border-gray-200 space-y-4 leading-relaxed order-2 lg:order-1 max-h-[500px] overflow-y-auto">
                <p className="font-bold text-[#071D49] border-b border-gray-200 pb-2">CONTRATANTE: {fullName || '[Nome do Aluno]'}</p>
                <p className="border-b border-gray-200 pb-2">
                  <strong>CONTRATADO:</strong> Benai Bernardo Consultoria de Treinamento.<br/>
                  <span className="text-gray-500 text-xs">CREF: 000000-G/PR | CNPJ/CPF: Profissional Autônomo</span>
                </p>
                
                <h4 className="font-bold text-gray-900 mt-3">CLÁUSULA 1ª – DO OBJETO E ESCOPO</h4>
                <p>Prestação de serviços de prescrição de treinamento físico individualizado, acompanhamento biomecânico presencial e monitoramento de desempenho.</p>
                
                <h4 className="font-bold text-gray-900 mt-3">CLÁUSULA 2ª – DA AGENDA, HORÁRIOS E VIGÊNCIA</h4>
                <p><strong>Parágrafo 1º (Início):</strong> O presente contrato entra em vigor na data de início selecionada: <strong>{startDate}</strong>.</p>
                <p><strong>Parágrafo 2º (Frequência e Horários):</strong> As sessões ocorrem conforme dias e horários agendados na grade de atendimento semanal acordada.</p>
                <p><strong>Parágrafo 3º (Reposições):</strong> Cancelamentos com menos de 24h de antecedência não dão direito à reposição, salvo mediante acordo prévio.</p>

                <h4 className="font-bold text-gray-900 mt-3">CLÁUSULA 3ª – DO VALOR, PAGAMENTO E VENCIMENTO</h4>
                <p><strong>Parágrafo 1º:</strong> O valor acordado é de R$ 600,00 mensais, com vencimento todo <strong>dia {paymentDay}</strong> de cada mês.</p>
                <p><strong>Parágrafo 2º (Forma de Pagamento):</strong> Selecionada pelo contratante na modalidade: <strong>{paymentMethod}</strong>.</p>
                <p><strong>Parágrafo 3º (Inadimplência):</strong> Tolerância máxima de 5 dias corridos. No 6º dia de atraso, os agendamentos ficam suspensos até a regularização.</p>

                <h4 className="font-bold text-gray-900 mt-3">CLÁUSULA 4ª – DO CONGELAMENTO E FÉRIAS</h4>
                <p>Direito a congelamento de até 30 dias por ano para períodos de férias ou afastamento superior a 15 dias consecutivos, prorrogando a vigência automaticamente.</p>

                <h4 className="font-bold text-gray-900 mt-3">CLÁUSULA 5ª – DA SAÚDE E RESPONSABILIDADE</h4>
                <p>O aluno declara estar apto para a prática de exercícios físicos de acordo com a anamnese preenchida.</p>
              </div>

              {/* Coluna 2: Formulário e Ações */}
              <div className="space-y-5 order-1 lg:order-2">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                  <h3 className="text-sm font-bold text-[#071D49] mb-1">Dados Cadastrais e Contratuais</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CPF</label>
                        <input 
                          type="text" 
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Início do Contrato</label>
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Endereço Completo</label>
                      <input 
                        type="text" 
                        placeholder="Rua, Número, Bairro ou Condomínio"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dia de Vencimento</label>
                        <select 
                          value={paymentDay}
                          onChange={(e) => setPaymentDay(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                        >
                          <option value="5">Todo dia 5</option>
                          <option value="10">Todo dia 10</option>
                          <option value="15">Todo dia 15</option>
                          <option value="20">Todo dia 20</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Forma de Pagamento</label>
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] bg-white font-medium"
                        >
                          <option value="PIX">PIX (Automático)</option>
                          <option value="Cartão de Crédito">Cartão de Crédito</option>
                          <option value="Boleto Bancário">Boleto Bancário</option>
                          <option value="Transferência TED/DOC">Transferência TED</option>
                          <option value="Dinheiro">Dinheiro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes de Aceite */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#00AEEF] focus:ring-[#00AEEF]" 
                    />
                    <span className="text-xs text-gray-700 font-medium">Li e concordo com os termos, datas, vigência e regras de pagamento descritas.</span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer bg-white p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agreedImage}
                      onChange={(e) => setAgreedImage(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#00AEEF] focus:ring-[#00AEEF]" 
                    />
                    <span className="text-xs text-gray-600">
                      <strong className="text-gray-800">(Opcional)</strong> Autorizo o uso de imagem em fotos/vídeos para divulgação profissional.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#071D49] hover:bg-[#0A2663] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#00AEEF]" />
                  Assinar Contrato Eletronicamente
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header do Portal */}
      <header className="bg-[#071D49] text-white p-5 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {!isStandalone && (
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wide">{student.name.split(' ')[0]}</h1>
              <p className="text-xs text-[#00AEEF] font-semibold uppercase tracking-widest">Portal Exclusivo do Aluno</p>
            </div>
          </div>
          {!isStandalone && (
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest"
            >
              Sair
            </button>
          )}
        </div>

        {/* Abas Superiores */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('treino')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${activeTab === 'treino' ? 'bg-[#00AEEF] text-[#071D49] shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            <Activity className="w-4 h-4" /> Treino & Fases
          </button>
          <button 
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${activeTab === 'agenda' ? 'bg-[#00AEEF] text-[#071D49] shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            <Calendar className="w-4 h-4" /> Agenda & Aulas
          </button>
          <button 
            onClick={() => setActiveTab('financeiro')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${activeTab === 'financeiro' ? 'bg-[#00AEEF] text-[#071D49] shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            <CreditCard className="w-4 h-4" /> Financeiro & Contrato
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 p-5 max-w-2xl mx-auto w-full">
        
        {/* ABA: TREINO */}
        {activeTab === 'treino' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-[#071D49]">Programação de Treinamento</h2>
              <span className="text-xs font-bold text-[#00AEEF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Fase Atual Ativa</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="border-l-4 border-[#00AEEF] pl-4 py-1">
                <h3 className="font-bold text-[#071D49] text-base">{student.objectives}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Foco em biomecânica, integridade lombar e qualidade de movimento.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Frequência</span>
                  <span className="text-sm font-bold text-[#071D49]">2x por semana</span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Última Atualização</span>
                  <span className="text-sm font-bold text-[#071D49]">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-gray-600 space-y-2 mt-4">
                <p className="font-bold text-[#071D49] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00AEEF]" /> Orientações Principais:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Manter atenção à cadência lenta e controle excêntrico.</li>
                  <li>Comunicar qualquer desconforto articular imediatamente durante a sessão.</li>
                  <li>Respeitar os intervalos de descanso prescritos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ABA: AGENDA */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-[#071D49]">Sua Agenda de Atendimentos</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Ativo na Grade</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-[#071D49] text-white rounded-xl flex flex-col items-center justify-center font-bold shadow-inner">
                  <span className="text-[10px] uppercase text-[#00AEEF]">Semana</span>
                  <span className="text-base">2x</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#071D49] text-sm">Horários Fixos Reservados</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Terças e Quintas-feiras às 08:00</p>
                </div>
                <button className="bg-white border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition">Alterar</button>
              </div>

              {/* Mini Calendário (Visual) */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-[#071D49]">Agosto 2026</span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-7 gap-2 text-center text-xs">
                  {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                    <span key={d} className="font-bold text-gray-400 mb-2">{d}</span>
                  ))}
                  {Array.from({length: 31}).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 31;
                    const isWorkoutDay = day === 4 || day === 6 || day === 11 || day === 13 || day === 18 || day === 20 || day === 25 || day === 27;
                    return (
                      <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl font-medium relative ${isToday ? 'bg-[#00AEEF] text-white font-bold shadow-md' : isWorkoutDay ? 'bg-blue-50 text-[#071D49]' : 'text-gray-600 hover:bg-gray-50'}`}>
                        {day}
                        {isWorkoutDay && !isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#071D49]"></span>}
                        {isToday && isWorkoutDay && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between p-4 bg-[#071D49] rounded-xl shadow-md text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00AEEF] p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-[#071D49]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#00AEEF] font-bold block mb-0.5">Próxima Sessão</span>
                      <span className="text-sm font-bold">Amanhã, 08:00</span>
                    </div>
                  </div>
                  <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-semibold">Confirmar</button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Regra de Reagendamento</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">Aviso prévio de 24h</span>
                </div>
              </div>
            </div>

            {/* Histórico de Frequência */}
            <div className="mt-6">
              <h3 className="text-md font-bold text-[#071D49] mb-3">Histórico de Frequência</h3>
              {sessionLogs.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 text-sm">Nenhuma sessão registrada ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionLogs.map(log => (
                    <div key={log.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${log.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : log.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#00AEEF]'}`}>
                          {log.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : log.status === 'cancelled' ? <span className="font-bold text-lg">!</span> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-[#071D49] text-sm">
                            {new Date(log.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {log.status === 'completed' ? 'Sessão Concluída' : log.status === 'cancelled' ? 'Cancelada' : 'Agendada'} {log.notes && `• ${log.notes}`}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja apagar este registro do histórico?')) {
                            await deleteSessionLog(log.id);
                            fetchSessionLogs(student.id).then(setSessionLogs);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Apagar Histórico"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: FINANCEIRO */}
        {activeTab === 'financeiro' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#071D49]">Financeiro & Contrato</h2>
            
            {/* Box Pagamento Detalhado */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensalidade Vigente</span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Vence em 10 dias
                </span>
              </div>
              
              <div className="flex items-end justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Valor da Parcela</p>
                  <span className="text-4xl font-black text-[#071D49] tracking-tight">R$ 600,00</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Método</p>
                  <span className="text-sm font-black text-[#071D49] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">{paymentMethod}</span>
                </div>
              </div>

              {paymentMethod === 'PIX' ? (
                <div className="bg-[#071D49] p-5 rounded-xl border border-[#0A2663] space-y-3 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF] opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-bold text-blue-200 block uppercase tracking-wider">Chave PIX (E-mail)</span>
                    <span className="text-[10px] text-white/50">C6 Bank</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg border border-white/20 text-sm font-mono text-white relative z-10 backdrop-blur-sm">
                    <span>contato@benaibernardo.com.br</span>
                    <button 
                      onClick={() => alert('Chave PIX copiada para a área de transferência!')}
                      className="bg-[#00AEEF] text-[#071D49] px-3 py-1.5 rounded-md font-bold text-xs hover:bg-[#0090C5] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-gray-600">
                  Pagamento via <strong>{paymentMethod}</strong> cadastrado. Em caso de dúvidas, entre em contato com o personal trainer.
                </div>
              )}
            </div>

            {/* Box Contrato Assinado */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <FileText className="w-5 h-5 text-[#071D49]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#071D49] text-sm">Contrato de Prestação de Serviços</h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Assinado em {startDate} • CPF: {cpf}</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Download do Contrato em PDF simulado com sucesso!')}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                title="Baixar Contrato"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

