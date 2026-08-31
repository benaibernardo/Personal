const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/fetchStudentsFromFirestore,/g, 'fetchStudentsFromFirestore, fetchStudentById,');

// For InstructorWorkout
const target1 = `fetchStudentsFromFirestore().then(students => {
             const student = students.find(s => s.id === id);`;
const replacement1 = `fetchStudentById(id).then(student => {`;
code = code.replace(target1, replacement1);

// For StudentPortalWrapper
const target2 = `fetchStudentsFromFirestore().then(students => {
      const found = students.find(s => s.id === id);
      if (found) {
        setStudent(found);
      }
      setLoading(false);
    });`;
const replacement2 = `fetchStudentById(id as string).then(found => {
      if (found) {
        setStudent(found);
      }
      setLoading(false);
    });`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated to use fetchStudentById');
