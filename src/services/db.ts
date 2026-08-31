import { db, auth } from '../lib/firebase';
import { safeStorage } from '../lib/storage';
import { collection, doc, setDoc, getDocs, getDoc, onSnapshot, query, where, Timestamp, deleteDoc } from 'firebase/firestore';
import { Student, WorkoutData, SessionLog } from '../types';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'samia-01',
    name: 'Samia Cristina Yebahi',
    email: 'samia.docs.ye@gmail.com',
    phone: '(41) 99632-6363',
    objectives: 'Hipertrofia, Emagrecimento, Força/Condicionamento, Saúde/Longevidade',
    medicalConditions: 'Fibromialgia, TEA1, condromalacia patelar, lombalgia',
    injuries: 'Nenhuma',
    medications: 'Sertralina, Bupropiona',
    lastUpdate: new Date().toISOString()
  }
];

export async function fetchStudentById(id: string): Promise<Student | null> {
  try {
    const docSnap = await getDoc(doc(db, 'students', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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

export async function fetchStudentsFromFirestore(): Promise<Student[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const list: Student[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
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
      });
    });
    if (list.length === 0) {
      // Seed initial student if none in DB
      const samia = INITIAL_STUDENTS[0];
      await saveStudentToFirestore(samia);
      return INITIAL_STUDENTS;
    }
    return list;
  } catch (err) {
    console.error('Error fetching students from Firestore, falling back to localStorage:', err);
    const saved = safeStorage.getItem('bb_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDENTS;
  }
}

export async function saveStudentToFirestore(student: Student): Promise<void> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const now = new Date().toISOString();
  
  // Save locally first for instant feedback
  const saved = safeStorage.getItem('bb_students');
  let currentList: Student[] = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  const idx = currentList.findIndex(s => s.id === student.id);
  if (idx >= 0) {
    currentList[idx] = student;
  } else {
    currentList = [student, ...currentList];
  }
  safeStorage.setItem('bb_students', JSON.stringify(currentList));

  try {
    await setDoc(doc(db, 'students', student.id), {
      instructorId: uid,
      name: student.name,
      email: student.email,
      phone: student.phone,
      cpf: student.cpf || null,
      dob: student.dob || null,
      job: student.job || null,
      weight: student.weight || null,
      height: student.height || null,
      objectives: student.objectives,
      medicalConditions: student.medicalConditions,
      injuries: student.injuries,
      medications: student.medications,
      experience: student.experience || null,
      routine: student.routine || null,
      trainingLocation: student.trainingLocation || null,
      availableDays: student.availableDays || null,
      availableTime: student.availableTime || null,
      parq: student.parq || null,
      anamneseStatus: student.anamneseStatus || 'pending',
      createdAt: student.lastUpdate === now ? now : student.lastUpdate || now,
      updatedAt: now
    }, { merge: true });
  } catch (err) {
    console.error('Error saving student to Firestore:', err);
  }
}

export async function saveWorkoutToFirestore(workout: WorkoutData): Promise<void> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const workoutId = `workout-${workout.studentName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    await setDoc(doc(db, 'workouts', workoutId), {
      instructorId: uid,
      studentId: workout.studentName,
      phases: JSON.stringify(workout),
      createdAt: now,
      updatedAt: now
    });
  } catch (err) {
    console.error('Error saving workout to Firestore:', err);
  }
}

export async function saveSessionLog(sessionLog: SessionLog): Promise<void> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const now = new Date().toISOString();
  
  try {
    await setDoc(doc(db, 'session_logs', sessionLog.id), {
      ...sessionLog,
      instructorId: uid,
      createdAt: now,
      updatedAt: now
    }, { merge: true });
  } catch (err) {
    console.error('Error saving session log to Firestore:', err);
  }
}

export async function fetchLatestWorkout(studentId: string): Promise<WorkoutData | null> {
  const uid = auth.currentUser?.uid || 'anonymous';
  try {
    const q = query(collection(db, 'workouts'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    // Sort by createdAt descending (assuming strings sort chronologically)
    const workouts = querySnapshot.docs.map(d => d.data());
    workouts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    
    const latest = workouts[0];
    if (latest && latest.phases) {
      return JSON.parse(latest.phases);
    }
    return null;
  } catch (err) {
    console.error('Error fetching latest workout:', err);
    return null;
  }
}

export async function fetchSessionLogs(studentId?: string): Promise<SessionLog[]> {
  try {
    const logsRef = collection(db, 'session_logs');
    let q = query(logsRef);
    if (studentId) {
      q = query(logsRef, where('studentId', '==', studentId));
    }
    const querySnapshot = await getDocs(q);
    const list: SessionLog[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as SessionLog);
    });
    return list;
  } catch (err) {
    console.error('Error fetching session logs:', err);
    return [];
  }
}

export async function deleteSessionLog(id: string): Promise<void> {
  
  try {
    await deleteDoc(doc(db, 'session_logs', id));
  } catch (err) {
    console.error('Error deleting session log:', err);
  }
}

export async function deleteStudentFromFirestore(id: string): Promise<void> {
  // Update local storage
  const saved = safeStorage.getItem('bb_students');
  if (saved) {
    let currentList: Student[] = JSON.parse(saved);
    currentList = currentList.filter(s => s.id !== id);
    safeStorage.setItem('bb_students', JSON.stringify(currentList));
  }
  
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (err) {
    console.error('Error deleting student:', err);
  }
}
