const fs = require('fs');

// 1. Update db.ts
let dbCode = fs.readFileSync('src/services/db.ts', 'utf8');
if (!dbCode.includes('deleteStudentFromFirestore')) {
  dbCode += `
export async function deleteStudentFromFirestore(id: string): Promise<void> {
  // Update local storage
  const saved = localStorage.getItem('bb_students');
  if (saved) {
    let currentList: Student[] = JSON.parse(saved);
    currentList = currentList.filter(s => s.id !== id);
    localStorage.setItem('bb_students', JSON.stringify(currentList));
  }
  
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (err) {
    console.error('Error deleting student:', err);
  }
}
`;
  fs.writeFileSync('src/services/db.ts', dbCode);
}
