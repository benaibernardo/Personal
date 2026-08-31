const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const oldHeader = `<header className="bg-[#071D49] text-white p-5 shadow-md flex items-center justify-between">
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
        </header>`;

const newHeader = `<header className="bg-[#071D49] text-white p-5 shadow-md flex items-center justify-between">
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
        </header>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/StudentPortal.tsx', code);
