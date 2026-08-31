const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = `  const [data, setData] = useState<WorkoutData>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tests && !Array.isArray(parsed.tests)) {
          parsed.tests = initialData.tests;
        }
        return { ...initialData, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return initialData;
  });`;

const newEffect = `  const [data, setData] = useState<WorkoutData>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tests && !Array.isArray(parsed.tests)) {
          parsed.tests = initialData.tests;
        }
        return { ...initialData, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return initialData;
  });

  useEffect(() => {
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
    }
  }, [id]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/App.tsx', code);
