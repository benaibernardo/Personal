const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace("data.keys().size() <= 16", "data.keys().size() <= 40");
code = code.replace("data.keys().size() <= 10", "data.keys().size() <= 40");
code = code.replace("data.keys().size() <= 5", "data.keys().size() <= 40");
code = code.replace("data.keys().size() <= 8", "data.keys().size() <= 40");
code = code.replace("data.keys().size() <= 7", "data.keys().size() <= 40");

fs.writeFileSync('firestore.rules', code);
