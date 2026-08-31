const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

const oldSaveWorkout = `export async function saveWorkoutToFirestore(workout: WorkoutData): Promise<void> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const workoutId = \`workout-\${workout.studentName.replace(/\\s+/g, '-').toLowerCase()}-\${Date.now()}\`;
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
}`;

const newSaveWorkout = `export async function saveWorkoutToFirestore(workout: WorkoutData): Promise<void> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const sId = workout.studentId || workout.studentName?.replace(/\\s+/g, '-').toLowerCase() || 'unknown';
  const workoutId = \`workout-\${sId}-\${Date.now()}\`;
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'workouts', workoutId), {
      instructorId: uid,
      studentId: sId,
      phases: JSON.stringify(workout),
      createdAt: now,
      updatedAt: now
    });
  } catch (err) {
    console.error('Error saving workout to Firestore:', err);
  }
}`;

code = code.replace(oldSaveWorkout, newSaveWorkout);
fs.writeFileSync('src/services/db.ts', code);
