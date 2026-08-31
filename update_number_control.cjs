const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const targetRegex = /const NumberControl = \(\{ label, value, onChange[^>]+> \(\s*<div className="flex-1 flex flex-col items-center min-w-\[70px\]">[\s\S]*?<Plus className="w-5 h-5"\/><\/button>\s*<\/div>\s*<\/div>\s*\);/;

const replacement = `const NumberControl = ({ icon: Icon, title, value, onChange, isDecimal = false }: { icon: any, title: string, value: number | string, onChange: (v: any) => void, isDecimal?: boolean }) => (
    <div className="flex-1 flex flex-col items-center min-w-[60px]">
      <div className="flex items-center justify-center text-gray-500 mb-1 gap-1" title={title}>
        <Icon className="w-3.5 h-3.5"/>
        <span className="text-[10px] font-bold uppercase">{title}</span>
      </div>
      <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-11">
        <button type="button" onClick={() => onChange(Math.max(0, (parseFloat(value as string) || 0) - (isDecimal ? 0.5 : 1)))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-4 h-4"/></button>
        <input 
          type={isDecimal ? "text" : "number"}
          inputMode={isDecimal ? "decimal" : "numeric"}
          value={value}
          onChange={(e) => {
            if (isDecimal) {
              onChange(e.target.value.replace(/,/g, '.'));
            } else {
              const v = parseInt(e.target.value);
              onChange(isNaN(v) ? 0 : v);
            }
          }}
          onFocus={e => e.target.select()}
          className="w-full min-w-[2rem] text-center font-black text-sm text-gray-900 bg-transparent border-none outline-none p-0 focus:ring-0"
        />
        <button type="button" onClick={() => onChange((parseFloat(value as string) || 0) + (isDecimal ? 0.5 : 1))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
      </div>
    </div>
  );`;

code = code.replace(targetRegex, replacement);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
