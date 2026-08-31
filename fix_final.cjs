const fs = require('fs');

// --- 1. App.tsx (Anamnese animations) ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
if (!appCode.includes("from 'motion/react'")) {
  appCode = appCode.replace("from 'lucide-react';", "from 'lucide-react';\nimport { motion, AnimatePresence } from 'motion/react';");
}

// Update Gatilhos
const gatilhosTarget = `{anamnesisOpen.triggers && (
                  <div className="px-4 pb-4 bg-purple-50">
                    <AutoResizeTextarea value={data.triggers || ''} onChange={(e: any) => updateData({ triggers: e.target.value })} placeholder="Ex: Aluno com TEA (usar comandos diretos)..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" />
                  </div>
                )}`;
const gatilhosReplacement = `<AnimatePresence>
                {anamnesisOpen.triggers && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-purple-50">
                      <AutoResizeTextarea value={data.triggers || ''} onChange={(e: any) => updateData({ triggers: e.target.value })} placeholder="Ex: Aluno com TEA (usar comandos diretos)..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>`;

appCode = appCode.replace(gatilhosTarget, gatilhosReplacement);

// Update Restrições
const healthTarget = `{anamnesisOpen.health && (
                  <div className="px-4 pb-4 bg-red-50">
                    <AutoResizeTextarea value={data.healthData || ''} onChange={(e: any) => updateData({ healthData: e.target.value })} placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />
                  </div>
                )}`;
const healthReplacement = `<AnimatePresence>
                {anamnesisOpen.health && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-red-50">
                      <AutoResizeTextarea value={data.healthData || ''} onChange={(e: any) => updateData({ healthData: e.target.value })} placeholder="Ex: Dor lombar nível 3/10 reportada antes do treino..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>`;
appCode = appCode.replace(healthTarget, healthReplacement);

// Update Notas
const notesTarget = `{anamnesisOpen.notes && (
                  <div className="px-4 pb-4 bg-yellow-50">
                    <AutoResizeTextarea value={data.postAnamnesisNotes || ''} onChange={(e: any) => updateData({ postAnamnesisNotes: e.target.value })} placeholder="Ex: Descobertas no dia a dia, restrições extras..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" />
                  </div>
                )}`;
const notesReplacement = `<AnimatePresence>
                {anamnesisOpen.notes && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 bg-yellow-50">
                      <AutoResizeTextarea value={data.postAnamnesisNotes || ''} onChange={(e: any) => updateData({ postAnamnesisNotes: e.target.value })} placeholder="Ex: Descobertas no dia a dia, restrições extras..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-yellow-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[40px] overflow-hidden resize-none" />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>`;
appCode = appCode.replace(notesTarget, notesReplacement);
fs.writeFileSync('src/App.tsx', appCode);

// --- 2. WorkoutExecution.tsx ---
let woCode = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// A. Fix Carga Base sizes
woCode = woCode.replace(/isDecimal=\{true\} fullWidth=\{true\} \/>/g, "isDecimal={true} />");

// B. Highlight Sets/Reps
const setsTarget = `<span className={\`px-2 py-1 rounded-md text-gray-700 font-bold whitespace-nowrap border \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50 shadow-sm'}\`}>
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>`;
const setsReplacement = `<span className={\`flex items-center gap-1 px-2 py-1 rounded-md font-bold whitespace-nowrap border shadow-sm \${allCompleted ? 'bg-red-50 border-red-100 text-red-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}\`}>
                                      <Layers className="w-3.5 h-3.5" />
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>`;
woCode = woCode.replace(setsTarget, setsReplacement);

// C. Highlight Last Load
const loadTarget = `<span className={\`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap shadow-sm \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-white/60 border-gray-200/50'}\`}>
                                      <Dumbbell className="w-3.5 h-3.5 text-gray-400" />
                                      <strong className="text-gray-800">{ex.load || '0'} kg</strong> 
                                      <span className="text-[10px] text-gray-400">({dateLast})</span>
                                    </span>`;
const loadReplacement = `<span className={\`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap shadow-sm \${allCompleted ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-200'}\`}>
                                      <Dumbbell className={\`w-3.5 h-3.5 \${allCompleted ? 'text-red-400' : 'text-emerald-500'}\`} />
                                      <strong className={\`\${allCompleted ? 'text-red-700' : 'text-emerald-700'}\`}>{ex.load || '0'} kg</strong> 
                                      <span className={\`text-[10px] \${allCompleted ? 'text-red-400' : 'text-emerald-600/70'}\`}>({dateLast})</span>
                                    </span>`;
woCode = woCode.replace(loadTarget, loadReplacement);

fs.writeFileSync('src/components/WorkoutExecution.tsx', woCode);
