const fs = require('fs');
let code = fs.readFileSync('src/services/db.ts', 'utf8');

// Also import getDoc
code = code.replace(/setDoc, getDocs/, 'setDoc, getDocs, getDoc');

const oldCode = `const docSnap = await getDocs(query(collection(db, 'students'), where('__name__', '==', id)));
    if (!docSnap.empty) {
      const data = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,`;

const newCode = `const docSnap = await getDoc(doc(db, 'students', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/services/db.ts', code);
