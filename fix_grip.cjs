const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

if (!code.includes('GripVertical')) {
  code = code.replace(/import {([^}]+)ArrowDown} from 'lucide-react';/, "import {$1ArrowDown, GripVertical} from 'lucide-react';");
}

const target = `<div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>
                                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px] shrink-0 border-2 \${allCompleted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}\`}>`;

const replacement = `<div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex flex-col justify-center h-full touch-none" title="Arraste para reordenar"
                                onPointerDown={(e) => { e.stopPropagation(); }}
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex items-center gap-2 flex-1 min-w-0 pl-6" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>
                                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px] shrink-0 border-2 \${allCompleted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}\`}>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
