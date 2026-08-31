const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

const fetchWorkoutCode = `export async function fetchLatestWorkout(studentId: string): Promise<WorkoutData | null> {
  const uid = auth.currentUser?.uid || 'anonymous';
  try {
    const q = query(collection(db, 'workouts'), where('instructorId', '==', uid), where('studentId', '==', studentId));
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

export async function fetchSessionLogs`;

code = code.replace('export async function fetchSessionLogs', fetchWorkoutCode);

fs.writeFileSync('src/services/db.ts', code);
