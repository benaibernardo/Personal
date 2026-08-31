export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  dob?: string;
  job?: string;
  weight?: string;
  height?: string;
  objectives: string;
  medicalConditions: string;
  injuries: string;
  medications: string;
  experience?: string;
  routine?: string;
  trainingLocation?: string;
  availableDays?: string;
  availableTime?: string;
  parq?: string;
  anamneseStatus?: 'completed' | 'pending';
  lastUpdate: string;
}

export interface PhaseExercise {
  id: string;
  name: string;
  time: string;
  isUnilateral?: boolean;
  feedback: string;
}

export interface StrengthExercise {
  id: string;
  name: string;
  load: string;
  isUnilateral?: boolean;
  setsReps: string;
  notes: string;
}

export interface BiomechanicalTest {
  id: string;
  name: string;
  result: string;
  setsReps?: string;
}

export interface SessionLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'scheduled' | 'cancelled';
  notes?: string;
  instructorId?: string; // Set by firestore rules/auth
  workoutData?: any;
}

export interface TimeOff {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
  instructorId?: string;
}

export interface WorkoutData {
  studentName?: string;
  studentId?: string;
  selectedRoutine?: string;
  routines?: Record<string, { mobility: PhaseExercise[], activation: PhaseExercise[], strength: StrengthExercise[], deceleration: PhaseExercise[] }>;
  date: string;
  sessionDate?: string;
  readiness?: string;
  workoutType: string;
  stressLevel: number | '';
  healthData: string;
  triggers: string;
  postAnamnesisNotes?: string;
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
