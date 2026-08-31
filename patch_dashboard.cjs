const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf8');

const oldHeaderControls = `<button 
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
            </button>`;

const newHeaderControls = `<div className="flex items-center gap-2">
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
            </div>`;

code = code.replace(oldHeaderControls, newHeaderControls);
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
