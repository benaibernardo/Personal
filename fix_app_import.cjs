const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Printer, RotateCcw, ArrowLeft, CheckCircle2, BrainCircuit, HeartPulse } from 'lucide-react';",
  "import { Printer, RotateCcw, ArrowLeft, CheckCircle2, BrainCircuit, HeartPulse, Dumbbell } from 'lucide-react';"
);

fs.writeFileSync('src/App.tsx', code);
