const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const oldAgendaTab = `{activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-[#071D49]">Sua Agenda de Atendimentos</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Ativo na Grade</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-[#071D49] text-white rounded-xl flex flex-col items-center justify-center font-bold">
                  <span className="text-[10px] uppercase text-[#00AEEF]">Semana</span>
                  <span className="text-base">2x</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#071D49] text-sm">Horários Fixos Reservados</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Terças e Quintas-feiras • Presencial</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-blue-50/30 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#00AEEF]" />
                    <span className="text-sm font-bold text-[#071D49]">Próxima Sessão Confirmada</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">Amanhã, 08:00</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Regra de Reagendamento</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Aviso prévio de 24h</span>
                </div>
              </div>
            </div>`;

const newAgendaTab = `{activeTab === 'agenda' && (
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
                      <div key={day} className={\`aspect-square flex flex-col items-center justify-center rounded-xl font-medium relative \${isToday ? 'bg-[#00AEEF] text-white font-bold shadow-md' : isWorkoutDay ? 'bg-blue-50 text-[#071D49]' : 'text-gray-600 hover:bg-gray-50'}\`}>
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
            </div>`;

code = code.replace(oldAgendaTab, newAgendaTab);
fs.writeFileSync('src/components/StudentPortal.tsx', code);
