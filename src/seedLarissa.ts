import { saveStudentToFirestore, saveWorkoutToFirestore } from './services/db';
import { Student, WorkoutData, BiomechanicalTest } from './types';

export async function seedLarissa(customName?: string) {
  const studentName = customName || 'Aluno Exemplo';
  const idStr = studentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const emailStr = studentName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@exemplo.com';

  const student: Student = {
    id: idStr,
    name: studentName,
    email: emailStr,
    phone: '(11) 99999-9999',
    objectives: 'Hipertrofia e Condicionamento Físico Geral',
    medicalConditions: 'Condromalácia patelar grau 1 (Joelho Direito)',
    injuries: 'Tendinite leve no ombro esquerdo (resolvida)',
    medications: 'Nenhuma',
    experience: 'Intermediário',
    anamneseStatus: 'completed',
    lastUpdate: new Date().toISOString()
  };

  const dummyTests: BiomechanicalTest[] = [
    { id: 't1', name: 'Agachamento Overhead (Overhead Squat)', result: 'Valgo dinâmico leve no joelho direito, falta de dorsiflexão.', setsReps: '3 repetições' },
    { id: 't2', name: 'Teste de Thomas', result: 'Encurtamento severo de iliopsoas bilateral.', setsReps: 'Isometria' },
    { id: 't3', name: 'Mobilidade de Tornozelo (Lunge Test)', result: 'Direito: 8cm | Esquerdo: 12cm', setsReps: 'Medição única' }
  ];

  const workoutData: Partial<WorkoutData> = {
    studentId: idStr,
    studentName: studentName,
    selectedRoutine: 'Treino A',
    routines: {
      'Treino A': {
        mobility: [
          { id: 'm1', name: 'Mobilidade de Tornozelo na Parede', time: '2 x 15 reps', feedback: 'Focar em não descolar o calcanhar' },
          { id: 'm2', name: 'Cócoras Dinâmico', time: '2 x 45s', feedback: 'Abertura de quadril' }
        ],
        activation: [
          { id: 'a1', name: 'Prancha Frontal', time: '3 x 40s', feedback: 'Contrair bem os glúteos' },
          { id: 'a2', name: 'Glúteo Médio com Mini Band', time: '3 x 15', feedback: 'Focar na abdução' }
        ],
        strength: [
          { id: 's1', name: 'Agachamento Livre (Barra)', setsReps: '4 x 10-12', notes: 'Descida controlada (3s)', load: '40' },
          { id: 's2', name: 'Leg Press 45', setsReps: '4 x 12', notes: 'Pés alinhados, não fazer valgo', load: '120' },
          { id: 's3', name: 'Cadeira Extensora', setsReps: '3 x 15', notes: 'Isometria de 2s no pico', load: '45' },
          { id: 's4', name: 'Cadeira Abdutora', setsReps: '3 x 15', notes: 'Tronco inclinado para frente', load: '50' }
        ],
        deceleration: [
          { id: 'd1', name: 'Alongamento de Quadríceps em pé', time: '2 x 30s', feedback: 'Respirar fundo' }
        ]
      },
      'Treino B': {
        mobility: [
          { id: 'm2', name: 'Mobilidade Torácica no Rolo', time: '2 x 15 reps', feedback: 'Não arquear lombar' },
          { id: 'm3', name: 'Gato e Vaca', time: '2 x 12 reps', feedback: 'Mover vértebra por vértebra' }
        ],
        activation: [
          { id: 'a2', name: 'Manguito Rotador Externo (Polia)', time: '3 x 15', feedback: 'Elástico ou polia leve' }
        ],
        strength: [
          { id: 's4', name: 'Supino Reto com Halteres', setsReps: '4 x 10', notes: 'Sem bater halteres no topo', load: '16' },
          { id: 's5', name: 'Remada Curvada com Barra', setsReps: '4 x 10', notes: 'Foco na retração escapular', load: '30' },
          { id: 's6', name: 'Desenvolvimento Máquina', setsReps: '3 x 12', notes: 'Amplitude máxima', load: '25' },
          { id: 's7', name: 'Puxada Frente', setsReps: '4 x 12', notes: 'Depressão escapular antes de puxar', load: '45' }
        ],
        deceleration: [
          { id: 'd2', name: 'Relaxamento Lombar (Abraçar joelhos)', time: '2 x 1min', feedback: 'Alívio de tensão' }
        ]
      },
      'Treino C': {
        mobility: [
          { id: 'm3', name: 'Mobilidade de Quadril (90/90)', time: '2 x 1min', feedback: 'Manter postura ereta' }
        ],
        activation: [
          { id: 'a3', name: 'Elevação Pélvica Solo', time: '3 x 15', feedback: 'Foco no glúteo, não na lombar' }
        ],
        strength: [
          { id: 's7', name: 'Levantamento Terra Romeno (Stiff)', setsReps: '4 x 8', notes: 'Carga pesada, manter curvatura natural', load: '50' },
          { id: 's8', name: 'Mesa Flexora', setsReps: '4 x 12', notes: 'Segurar 3s na descida (excêntrica)', load: '35' },
          { id: 's9', name: 'Panturrilha no Leg Press', setsReps: '4 x 15-20', notes: 'Amplitude total do tornozelo', load: '100' },
          { id: 's10', name: 'Cadeira Flexora', setsReps: '3 x 12', notes: 'Fazer sem pausa', load: '40' }
        ],
        deceleration: [
          { id: 'd3', name: 'Alongamento Posterior com Elástico', time: '2 x 45s', feedback: 'Deitado de costas' }
        ]
      }
    },
    date: new Date().toISOString().split('T')[0],
    workoutType: 'ABC',
    stressLevel: 3,
    healthData: 'Dor leve no joelho direito se aumentar muito a carga do Leg Press. Acompanhar evolução da mobilidade de tornozelo.',
    triggers: 'Aluno prefere treinos intensos mas com intervalo bem cronometrado. Precisa de reforço positivo constante nas execuções.',
    postAnamnesisNotes: 'Aluno relatou que tem dormido mal nos últimos dias. Pode afetar o rendimento nos treinos pesados.',
    tests: dummyTests,
    phases: { mobility: [], activation: [], strength: [], deceleration: [] },
    feedback: { fatigue: 6, likes: 'Gostou bastante do treino de perna', discomforts: 'Nenhum desconforto grave, apenas cansaço normal', adjustments: 'Aumentar carga no Stiff no próximo treino' }
  };

  // Pre-fill the current active phase with Treino A
  workoutData.phases = workoutData.routines!['Treino A'];

  try {
    await saveStudentToFirestore(student as any);
    await saveWorkoutToFirestore(workoutData as any);
    console.log('Dummy student seeded successfully!');
    return true;
  } catch(e) {
    console.error('Error seeding dummy student', e);
    return false;
  }
}
