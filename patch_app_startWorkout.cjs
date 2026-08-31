const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('fetchLatestWorkout')) {
  code = code.replace(/import \{([^}]+)\}\s+from\s+'\.\/services\/db';/, "import { $1, fetchLatestWorkout } from './services/db';");
}

const oldStartWorkoutRegex = /const startWorkout = \(\s*student:\s*Student\s*\) => \{[\s\S]*?localStorage\.setItem\(STORAGE_KEY, JSON\.stringify\(newData\)\);\n    \}/;

const newStartWorkout = `const startWorkout = async (student: Student) => {
    const today = new Date().toISOString().split('T')[0];
    const dbWorkout = await fetchLatestWorkout(student.id);

    if (dbWorkout) {
      dbWorkout.sessionDate = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dbWorkout));
    } else {
      // Fallback
      let initialPhases = initialData.phases;
      
      if (student.name.includes('Samia')) {
        initialPhases = {
          mobility: [
            { id: 'mob1', name: 'Mobilidade de Tornozelo c/ Peso (Ativa)', time: '2 x 10 a 12 | 15s', feedback: 'Halter no joelho esquerdo primeiro.' },
            { id: 'mob2', name: 'Passada Homem-Aranha c/ Rotação', time: '2 x 8 a 10 cada | 15s', feedback: 'Olhar fixo no chão ou na parede.' }
          ],
          activation: [
            { id: 'act1', name: 'Prancha Lateral Curta (Nos joelhos)', time: '2 x 20 a 30s | 30s', feedback: 'Apoio nos joelhos e cotovelo.' },
            { id: 'act2', name: 'Sustentação de Mala (Suitcase Hold)', time: '2 x 30s cada | 30s', feedback: 'Segurar um halter pesado em apenas uma mão.' }
          ],
          strength: [
            { id: 'str1', name: 'Agachamento Goblet na Caixa Alta', load: '20 kg', setsReps: '3 x 8 a 12', notes: 'Caixa limitando a descida.' },
            { id: 'str2', name: 'Stiff com Halteres (RDL)', load: '', setsReps: '3 x 8 a 12', notes: 'Aproveitar o excelente padrão.' },
            { id: 'str3', name: 'Remada Australiana (Peso Corporal)', load: 'Corporal', setsReps: '3 x 8 a 12', notes: 'Corpo pranchado.' },
            { id: 'str4', name: 'Remada Baixa Neutra', load: '', setsReps: '3 x 8 a 12', notes: 'Retração escapular máxima.' },
            { id: 'str5', name: 'Supino Reto (Halter ou Máquina)', load: '', setsReps: '3 x 8 a 12', notes: 'Empurrar com controle.' }
          ],
          deceleration: [
            { id: 'dec1', name: 'Postura da Criança (Child\\'s Pose)', time: '1 x 1 a 2 min', feedback: 'Descompressão lombar passiva.' },
            { id: 'dec2', name: 'Pernas na Parede (Legs Up the Wall)', time: '1 x 2 a 3 min', feedback: 'Respiração 4s inspira, 6s expira.' }
          ]
        };
      }

      const newData = {
        studentName: student.name,
        sessionDate: today,
        readiness: '',
        healthData: \`Condições: \${student.medicalConditions} | Lesões: \${student.injuries} | Meds: \${student.medications}\`,
        triggers: student.objectives,
        tests: student.name.includes('Samia') ? [
          { id: 't1', name: 'Dorsiflexão', result: 'Assimetria E>D (E menor)' },
          { id: 't2', name: 'Thomas', result: 'E mais encurtado' },
          { id: 't3', name: 'Hinge / Pêndulo', result: 'Hinge OK / Assimetria Pêndulo' },
          { id: 't4', name: 'Agachamento', result: 'Retroversão antes de 90 graus' }
        ] : initialData.tests,
        phases: initialPhases
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }`;

code = code.replace(oldStartWorkoutRegex, newStartWorkout);

fs.writeFileSync('src/App.tsx', code);
