const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 1. Add GripVertical import
if (!code.includes('GripVertical')) {
  code = code.replace(/import {([^}]+)ArrowDown} from 'lucide-react';/, "import {$1ArrowDown, GripVertical} from 'lucide-react';");
}

// 2. Add Draggable to motion.div
const motionTarget = `<motion.div 
                          key={ex.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={\`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 \${cardClass}\`}
                        >`;
const motionReplacement = `<motion.div 
                          key={ex.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e as any, phase.id, exIndex)}
                          onDragEnter={(e) => handleDragEnter(e as any, phase.id, exIndex)}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnd={handleDragEnd}
                          className={\`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 \${cardClass} relative
                            \${draggedItem?.phaseId === phase.id && draggedItem?.exIndex === exIndex ? 'opacity-30 border-dashed border-blue-400' : ''}
                            \${dragOverItem?.phaseId === phase.id && dragOverItem?.exIndex === exIndex && draggedItem?.exIndex !== exIndex ? (draggedItem!.exIndex > exIndex ? 'border-t-4 border-t-blue-500' : 'border-b-4 border-b-blue-500') : ''}
                          \`}
                        >`;
code = code.replace(motionTarget, motionReplacement);

// 3. Add GripVertical to the exercise header (non-edit mode)
const headerTarget = `<div className="w-full flex flex-col">
                              <button onClick={() => toggleExercise(ex.id)} className="flex-1 px-5 pt-5 pb-3 flex items-center justify-between text-left">
                                <div className="flex-1 pr-4">`;

const headerReplacement = `<div className="w-full flex flex-col relative">
                              <div className="absolute left-0 top-6 p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex flex-col justify-center touch-none z-10" title="Arraste para reordenar"
                                onPointerDown={(e) => { e.stopPropagation(); }}
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <button onClick={() => toggleExercise(ex.id)} className="flex-1 px-5 pl-10 pt-5 pb-3 flex items-center justify-between text-left">
                                <div className="flex-1 pr-4">`;

code = code.replace(headerTarget, headerReplacement);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
