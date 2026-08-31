const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf8');

// 1. Add states
const stateInsert = `  const [searchQuery, setSearchQuery] = useState('');`;
const stateReplacement = `  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isInjectingDummy, setIsInjectingDummy] = useState(false);
  const [dummyName, setDummyName] = useState('Aluno Exemplo');`;
code = code.replace(stateInsert, stateReplacement);

// 2. Modify handleDeleteStudent
const oldDeleteFn = `  const handleDeleteStudent = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      await deleteStudentFromFirestore(id);
      setStudents(students.filter(s => s.id !== id));
    }
  };`;
const newDeleteFn = `  const handleDeleteStudent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };
  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteStudentFromFirestore(deleteConfirmId);
      setStudents(students.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };`;
code = code.replace(oldDeleteFn, newDeleteFn);

// 3. Modify handleInjectLarissa
const oldInjectFnRegex = /const handleInjectLarissa = async \(\) => \{[\s\S]*?\};/;
const newInjectFn = `  const handleInjectLarissa = () => {
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
  };`;
code = code.replace(oldInjectFnRegex, newInjectFn);

// 4. Modify Link Anamnese button & handleCopyAnamneseLink
const oldLinkFnRegex = /const handleCopyAnamneseLink = \(\) => \{[\s\S]*?\};/;
const newLinkFn = `  const handleOpenAnamnese = () => {
    window.location.href = '/anamnese.html';
  };`;
code = code.replace(oldLinkFnRegex, newLinkFn);

const oldLinkBtnRegex = /<button[^>]*onClick=\{handleCopyAnamneseLink\}[\s\S]*?<\/button>/;
const newLinkBtn = `<button 
              onClick={handleOpenAnamnese}
              className="bg-[#00AEEF] hover:bg-[#0090C5] text-[#071D49] px-4 py-2 rounded-xl flex items-center justify-center transition-colors shadow-lg"
              title="Abrir Anamnese"
            >
              <ClipboardList className="w-5 h-5" />
            </button>`;
code = code.replace(oldLinkBtnRegex, newLinkBtn);

// Import ClipboardList if not already there
if (!code.includes('ClipboardList')) {
  code = code.replace('UserPlus, Wand2', 'UserPlus, Wand2, ClipboardList');
}

// 5. Add Modals at the end of the file
const oldEnd = `      {/* Modal Novo Aluno / Fictício */}`;
const newModals = `      {/* Modal Delete Confirm */}
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

      {/* Modal Novo Aluno / Fictício */}`;
code = code.replace(oldEnd, newModals);

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
