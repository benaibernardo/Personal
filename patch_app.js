const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-blue-100">`;
const replacement = `<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 pt-5 border-t border-blue-100">`;
code = code.replace(target, replacement);

const target2 = `              <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase mb-2">
                  <HeartPulse className="w-4 h-4" /> Saúde / Restrições
                </label>
                <textarea 
                  value={data.healthData || ''}
                  onChange={(e) => updateData({ healthData: e.target.value })}
                  placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[60px]"
                />
              </div>
            </div>`;

const replacement2 = `              <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase mb-2">
                  <HeartPulse className="w-4 h-4" /> Saúde / Restrições
                </label>
                <textarea 
                  value={data.healthData || ''}
                  onChange={(e) => updateData({ healthData: e.target.value })}
                  placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[60px]"
                />
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 shadow-sm">
                <label className="flex items-center gap-1.5 text-xs font-black text-yellow-700 uppercase mb-2">
                  <MessageSquare className="w-4 h-4" /> Notas Pós-Anamnese
                </label>
                <textarea 
                  value={data.postAnamnesisNotes || ''}
                  onChange={(e) => updateData({ postAnamnesisNotes: e.target.value })}
                  placeholder="Descobertas na aula, novas restrições..."
                  className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[60px]"
                />
              </div>
            </div>`;

code = code.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', code);
