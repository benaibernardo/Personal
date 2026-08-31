const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// Icons missing in WorkoutExecution imports: Layers, Repeat, CheckCircle2, Clock
// Let's add them if they are missing
if (!code.includes('Layers,')) code = code.replace("import { \n", "import { \n  Layers, Repeat, \n");

// 1. Serie label
code = code.replace(
  /<span className="font-black text-gray-500 uppercase text-xs tracking-wider">Série \{sIndex \+ 1\}<\/span>/g,
  '<span className="font-black text-gray-500 uppercase text-xs tracking-wider flex items-center gap-1"><Layers className="w-3 h-3"/> {sIndex + 1}</span>'
);

// 2. Cronômetro button text
code = code.replace(
  /<Play className="w-3 h-3 fill-blue-600"\/> Cronômetro/g,
  '<Play className="w-3 h-3 fill-blue-600"/>'
);

// 3. Marcar feita button
code = code.replace(
  /className=\{`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm \$\{set\.completed \? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'\}`\}\n\s*>\n\s*\{set\.completed \? 'Concluída ✓' : 'Marcar Feita'\}/g,
  `className={\`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors shadow-sm \${set.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}\`}
                                              >
                                                <CheckCircle2 className="w-5 h-5" />`
);

// 4. Reps and Kg labels (Unilateral)
code = code.replace(
  /<span className="text-\[10px\] font-bold text-gray-500 uppercase mb-1">Reps<\/span>/g,
  '<span className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1" title="Repetições"><Repeat className="w-3 h-3"/></span>'
);
code = code.replace(
  /<span className="text-\[10px\] font-bold text-gray-500 uppercase mb-1">Kg<\/span>/g,
  '<span className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1" title="Carga (kg)"><Dumbbell className="w-3 h-3"/></span>'
);

// 5. Reps and Carga labels (Normal)
code = code.replace(
  /<span className="text-\[10px\] font-bold text-gray-500 uppercase">Reps \/ Segs<\/span>/g,
  '<span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1" title="Reps / Segs"><Repeat className="w-3 h-3"/></span>'
);
code = code.replace(
  /<span className="text-\[10px\] font-bold text-gray-500 uppercase mb-1 self-start ml-1">Carga \(kg\)<\/span>/g,
  '<span className="text-[10px] font-bold text-gray-500 uppercase mb-1 self-start ml-1 flex items-center gap-1" title="Carga (kg)"><Dumbbell className="w-3 h-3"/></span>'
);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
