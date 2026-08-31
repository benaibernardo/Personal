const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 -mb-2 scrollbar-hide">', '<div className="flex flex-wrap gap-2">');
code = code.replace(/snap-start flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center min-w-\[110px\] shadow-sm/g, 'px-5 py-2.5 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center min-w-[90px] shadow-sm flex-1 sm:flex-none');

fs.writeFileSync('src/App.tsx', code);
