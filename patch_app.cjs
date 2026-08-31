const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    // Basic sync: if the user came here without studentName being set (maybe hard reload),
    // we should ideally fetch the student and initialize. For now we just keep the simple localStorage behavior.
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);`;

const replacement = `  useEffect(() => {
    if (id && data.studentId !== id) {
      // If we land on a URL with an ID that doesn't match our local storage, fetch it!
      fetchLatestWorkout(id).then(dbWorkout => {
        if (dbWorkout) {
          setData(prev => {
            const merged = { ...prev, ...dbWorkout };
            safeStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        } else {
          // Attempt to find the student directly if workout doesn't exist
          fetchStudentsFromFirestore().then(students => {
             const student = students.find(s => s.id === id);
             if (student) {
                const newData = {
                  ...initialData,
                  studentId: student.id,
                  studentName: student.name,
                  healthData: \`Condições: \${student.medicalConditions} | Lesões: \${student.injuries} | Meds: \${student.medications}\`,
                  triggers: student.objectives,
                };
                setData(newData);
                safeStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
             }
          });
        }
      });
    } else {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [id, data]);`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx patched successfully.');
} else {
  console.log('Target not found in App.tsx!');
}
