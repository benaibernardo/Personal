const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf8');

const linkBtnTarget = `<span className="hidden sm:inline">Link Anamnese</span>
            </button>`;
const linkBtnReplacement = `<span className="hidden sm:inline">Link Anamnese</span>
            </button>
            <button 
              onClick={handleInjectLarissa}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border-2 border-transparent shadow-lg"
              title="Gerar Larissa (Fictícia)"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar Larissa</span>
            </button>`;

if (code.includes(linkBtnTarget) && !code.includes('Gerar Larissa')) {
    code = code.replace(linkBtnTarget, linkBtnReplacement);
    fs.writeFileSync('src/components/StudentDashboard.tsx', code);
    console.log("Button added successfully.");
} else if (code.includes('Gerar Larissa')) {
    console.log("Button already exists.");
} else {
    console.log("Target not found.");
}
