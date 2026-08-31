const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf8');

// Import delete function and Trash2, Plus
if (!code.includes('deleteStudentFromFirestore')) {
  code = code.replace("fetchStudentsFromFirestore, saveStudentToFirestore", "fetchStudentsFromFirestore, saveStudentToFirestore, deleteStudentFromFirestore");
}
if (!code.includes('Trash2')) {
  code = code.replace("X } from 'lucide-react'", "X, Trash2, Wand2 } from 'lucide-react'");
}

// Add state for deletion and injection
if (!code.includes('handleDeleteStudent')) {
  const insertIndex = code.indexOf('const handleCreateStudent = async (e: React.FormEvent) => {');
  
  const customFunctions = `
  const handleDeleteStudent = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      await deleteStudentFromFirestore(id);
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleInjectLarissa = async () => {
    const { seedLarissa } = await import('../seedLarissa');
    await seedLarissa();
    window.location.reload();
  };

  `;
  code = code.slice(0, insertIndex) + customFunctions + code.slice(insertIndex);
}

// Add 'Wand2' to lucide imports if not there
if (code.includes('Trash2') && !code.includes('Wand2')) {
    code = code.replace("Trash2 } from", "Trash2, Wand2 } from");
}

// Add the button for Larissa near "Adicionar Aluno"
const addBtnTarget = `className="bg-[#00AEEF] hover:bg-[#0096ce] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#00AEEF]/20 flex items-center gap-2 transition-all"`;
if (!code.includes('handleInjectLarissa') || code.includes('handleInjectLarissa')) {
    // we already added the function above, now inject the button
    const btnReplacement = `className="bg-[#00AEEF] hover:bg-[#0096ce] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#00AEEF]/20 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Aluno</span>
            </button>
            <button 
              onClick={handleInjectLarissa}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all ml-3"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar Larissa (Fictícia)</span>`;
    
    // Replace if it hasn't been replaced yet
    if (!code.includes('Gerar Larissa')) {
      code = code.replace(`className="bg-[#00AEEF] hover:bg-[#0096ce] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#00AEEF]/20 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Aluno</span>`, btnReplacement);
    }
}

// Add delete button inside the student card
const cardActionsTarget = `<ChevronRight className="w-5 h-5 text-gray-300" />`;
const cardActionsReplacement = `<button 
                        onClick={(e) => handleDeleteStudent(e, student.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-500 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        title="Remover Aluno"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />`;
if (!code.includes('Remover Aluno')) {
  code = code.replace(cardActionsTarget, cardActionsReplacement);
}

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
