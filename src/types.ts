export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  modality: 'presencial' | 'online';
  objectives: string;
  medicalConditions: string;
  injuries: string;
  medications: string;
  lastUpdate: string;
}

export interface PhaseExercise {
  id: string;
  name: string;
  time: string;
  feedback: string;
}

export interface StrengthExercise {
  id: string;
  name: string;
  load: string;
  setsReps: string;
  notes: string;
}

export interface BiomechanicalTest {
  id: string;
  name: string;
  result: string;
}

export interface WorkoutData {
  studentName: string;
  date: string;
  workoutType: string;
  stressLevel: number | '';
  healthData: string;
  triggers: string;
  tests: BiomechanicalTest[];
  phases: {
    mobility: PhaseExercise[];
    activation: PhaseExercise[];
    strength: StrengthExercise[];
    deceleration: PhaseExercise[];
  };
  feedback: {
    fatigue: number | '';
    likes: string;
    discomforts: string;
    adjustments: string;
  };
}
