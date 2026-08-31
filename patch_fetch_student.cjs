const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

const newCode = `export async function fetchStudentById(id: string): Promise<Student | null> {
  try {
    const docSnap = await getDocs(query(collection(db, 'students'), where('__name__', '==', id)));
    if (!docSnap.empty) {
      const data = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        cpf: data.cpf || '',
        dob: data.dob || '',
        job: data.job || '',
        weight: data.weight || '',
        height: data.height || '',
        objectives: data.objectives || '',
        medicalConditions: data.medicalConditions || '',
        injuries: data.injuries || '',
        medications: data.medications || '',
        experience: data.experience || '',
        routine: data.routine || '',
        trainingLocation: data.trainingLocation || '',
        availableDays: data.availableDays || '',
        availableTime: data.availableTime || '',
        parq: data.parq || '',
        anamneseStatus: data.anamneseStatus || 'pending',
        lastUpdate: data.updatedAt || new Date().toISOString()
      };
    }
  } catch (err) {
    console.error('Error fetching student by ID from Firestore:', err);
  }
  // fallback
  const saved = safeStorage.getItem('bb_students');
  if (saved) {
    try {
      const list = JSON.parse(saved);
      const found = list.find((s: Student) => s.id === id);
      if (found) return found;
    } catch (e) {}
  }
  const initFound = INITIAL_STUDENTS.find(s => s.id === id);
  return initFound || null;
}
`;

if (!code.includes('fetchStudentById')) {
  code = code.replace(/export async function fetchStudentsFromFirestore/, newCode + '\nexport async function fetchStudentsFromFirestore');
  fs.writeFileSync('src/services/db.ts', code);
  console.log('fetchStudentById added.');
}
