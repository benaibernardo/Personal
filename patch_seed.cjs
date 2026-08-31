const fs = require('fs');
let code = fs.readFileSync('src/seedLarissa.ts', 'utf8');

const oldSeed = `const idStr = studentName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();`;
const newSeed = `const idStr = studentName.toLowerCase().replace(/[^a-z0-9]/g, '-');`;

code = code.replace(oldSeed, newSeed);

const oldStudentName = `studentName: idStr, // The db.ts expects this to be the ID actually, or it uses it as studentId`;
const newStudentName = `studentId: idStr,
    studentName: studentName,`;

code = code.replace(oldStudentName, newStudentName);
fs.writeFileSync('src/seedLarissa.ts', code);
