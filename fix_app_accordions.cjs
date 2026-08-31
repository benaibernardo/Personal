const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard grids with Accordions
const replaceTarget = `<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 pt-5 border-t border-blue-100">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-purple-700 uppercase mb-2">
                  <BrainCircuit className="w-4 h-4" /> Gatilhos
                </label>
                <textarea 
                  value={data.triggers || ''}
                  onChange={(e) => updateData({ triggers: e.target.value })}
                  placeholder="Ex: Aluno com TEA (usar comandos diretos)..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                />
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase mb-2">
                  <HeartPulse className="w-4 h-4" /> Restrições
                </label>
                <textarea 
                  value={data.healthData || ''}
                  onChange={(e) => updateData({ healthData: e.target.value })}
                  placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                />
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-yellow-700 uppercase mb-2">
                  <MessageSquare className="w-4 h-4" /> Notas
                </label>
                <textarea 
                  value={data.postAnamnesisNotes || ''}
                  onChange={(e) => updateData({ postAnamnesisNotes: e.target.value })}
                  placeholder="Ex: Descobertas no dia a dia, restrições extras..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                />
              </div>
            </div>`;

if (!code.includes('const [anamnesisOpen, setAnamnesisOpen] = useState(')) {
  const statePos = code.indexOf('const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);');
  if (statePos !== -1) {
    code = code.substring(0, statePos) + "const [anamnesisOpen, setAnamnesisOpen] = useState({ triggers: false, health: false, notes: false });\n  " + code.substring(statePos);
  }
}

// Add ChevronDown to lucide-react imports if not there
if (!code.includes('ChevronDown')) {
  code = code.replace("import { Printer,", "import { Printer, ChevronDown, ChevronUp, FileText,");
}

const replacement = `<div className="flex flex-col gap-3 mt-5 pt-5 border-t border-blue-100">
              <div className="bg-purple-50 rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, triggers: !p.triggers }))}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-purple-700 uppercase">
                    <BrainCircuit className="w-4 h-4" /> Gatilhos
                  </div>
                  {anamnesisOpen.triggers ? <ChevronUp className="w-4 h-4 text-purple-700" /> : <ChevronDown className="w-4 h-4 text-purple-700" />}
                </button>
                {anamnesisOpen.triggers && (
                  <div className="px-4 pb-4 bg-purple-50">
                    <textarea 
                      value={data.triggers || ''}
                      onChange={(e) => updateData({ triggers: e.target.value })}
                      placeholder="Ex: Aluno com TEA (usar comandos diretos)..."
                      className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, health: !p.health }))}
                  className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-red-700 uppercase">
                    <HeartPulse className="w-4 h-4" /> Restrições
                  </div>
                  {anamnesisOpen.health ? <ChevronUp className="w-4 h-4 text-red-700" /> : <ChevronDown className="w-4 h-4 text-red-700" />}
                </button>
                {anamnesisOpen.health && (
                  <div className="px-4 pb-4 bg-red-50">
                    <textarea 
                      value={data.healthData || ''}
                      onChange={(e) => updateData({ healthData: e.target.value })}
                      placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..."
                      className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setAnamnesisOpen(p => ({ ...p, notes: !p.notes }))}
                  className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-yellow-700 uppercase">
                    <MessageSquare className="w-4 h-4" /> Notas
                  </div>
                  {anamnesisOpen.notes ? <ChevronUp className="w-4 h-4 text-yellow-700" /> : <ChevronDown className="w-4 h-4 text-yellow-700" />}
                </button>
                {anamnesisOpen.notes && (
                  <div className="px-4 pb-4 bg-yellow-50">
                    <textarea 
                      value={data.postAnamnesisNotes || ''}
                      onChange={(e) => updateData({ postAnamnesisNotes: e.target.value })}
                      placeholder="Ex: Descobertas no dia a dia, restrições extras..."
                      className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
                    />
                  </div>
                )}
              </div>
            </div>`;

code = code.replace(replaceTarget, replacement);

fs.writeFileSync('src/App.tsx', code);
