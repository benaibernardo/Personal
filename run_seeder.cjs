const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { seedLarissa }")) {
  code = code.replace("import { fetchStudentsFromFirestore, saveSessionLog } from './services/db';", 
    "import { fetchStudentsFromFirestore, saveSessionLog } from './services/db';\nimport { seedLarissa } from './seedLarissa';");
    
  code = code.replace("const [students, setStudents] = useState<Student[]>([]);",
    "const [students, setStudents] = useState<Student[]>([]);\n  useEffect(() => {\n    if (!localStorage.getItem('larissa_seeded')) {\n      seedLarissa();\n    }\n  }, []);");
    
  fs.writeFileSync('src/App.tsx', code);
}
