const fs = require('fs');
const file = 'src/components/WorkoutExecution.tsx';
let code = fs.readFileSync(file, 'utf8');

const getPseLabelFunc = `  const getPseLabel = (level: number) => {
    if (level === 0) return 'Não avaliado';
    if (level <= 2) return 'Muito Leve';
    if (level <= 4) return 'Leve';
    if (level <= 6) return 'Moderado';
    if (level <= 8) return 'Difícil';
    if (level <= 9) return 'Muito Difícil';
    return 'Máximo';
  };
`;

code = code.replace("  const getPseEmoji", getPseLabelFunc + "\n  const getPseEmoji");
fs.writeFileSync(file, code);
