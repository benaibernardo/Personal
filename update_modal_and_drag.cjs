const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// 1. Import GripVertical
code = code.replace(/import {([^}]+)ArrowDown} from 'lucide-react';/, "import {$1ArrowDown, GripVertical} from 'lucide-react';");

// 2. Update NumberControl
const oldControl = `  const NumberControl = ({ icon: Icon, title, value, onChange, isDecimal = false }: { icon: any, title: string, value: number | string, onChange: (v: any) => void, isDecimal?: boolean }) => (
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
          className="w-full min-w-[2rem] text-center font-black text-[13px] text-gray-900 bg-transparent border-none outline-none p-0 focus:ring-0"
        />
        <button type="button" onClick={() => onChange((parseFloat(value as string) || 0) + (isDecimal ? 0.5 : 1))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
      </div>
    </div>
  );`;

const newControl = `  const NumberControl = ({ icon: Icon, title, value, onChange, isDecimal = false, fullWidth = false }: { icon: any, title: string, value: number | string, onChange: (v: any) => void, isDecimal?: boolean, fullWidth?: boolean }) => (
    <div className={\`flex flex-col items-center min-w-[60px] \${fullWidth ? 'w-full' : 'flex-1'}\`}>
      <div className="flex items-center justify-center text-gray-500 mb-1" title={title}>
        <Icon className="w-4 h-4"/>
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
          className="w-full min-w-[2rem] text-center font-black text-[13px] text-gray-900 bg-transparent border-none outline-none p-0 focus:ring-0"
        />
        <button type="button" onClick={() => onChange((parseFloat(value as string) || 0) + (isDecimal ? 0.5 : 1))} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-4 h-4"/></button>
      </div>
    </div>
  );`;

code = code.replace(oldControl, newControl);

// 3. Update newExForm flex layout
const oldNewForm = `<div className="flex gap-2">
                        <NumberControl icon={Layers} title="Séries" value={newExForm.sets} onChange={(v) => setNewExForm({...newExForm, sets: v})} />
                        <NumberControl icon={Repeat} title="Reps/Tempo" value={newExForm.reps} onChange={(v) => setNewExForm({...newExForm, reps: v})} />
                        <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} />
                      </div>`;
const newNewForm = `<div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <NumberControl icon={Layers} title="Séries" value={newExForm.sets} onChange={(v) => setNewExForm({...newExForm, sets: v})} />
                          <NumberControl icon={Repeat} title="Reps/Tempo" value={newExForm.reps} onChange={(v) => setNewExForm({...newExForm, reps: v})} />
                        </div>
                        <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} fullWidth={true} />
                      </div>`;
code = code.replace(oldNewForm, newNewForm);

// 4. Update editForm flex layout
const oldEditForm = `<div className="flex gap-2 mt-2">
                                <NumberControl icon={Layers} title="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                <NumberControl icon={Repeat} title="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} />
                              </div>`;
const newEditForm = `<div className="flex flex-col gap-2 mt-2">
                                <div className="flex gap-2">
                                  <NumberControl icon={Layers} title="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                  <NumberControl icon={Repeat} title="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                </div>
                                <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} fullWidth={true} />
                              </div>`;
code = code.replace(oldEditForm, newEditForm);

// 5. Add GripVertical icon to exercise header
const headerTarget = `</div>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-medium">`;
const headerNew = `</div>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-medium">`;
// Wait, I can inject it right after the <h3> inside the header row.
// Current header:
/*
<div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>
  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px] shrink-0 border-2 ${allCompleted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
    {exIndex + 1}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex justify-between items-start">
      <h3 className={`font-black text-base leading-tight ${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}`}>{ex.name}</h3>
    </div>
*/

const cardHeader = `<div className="flex justify-between items-start">
                                      <h3 className={\`font-black text-base leading-tight \${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}\`}>{ex.name}</h3>
                                    </div>`;
const cardHeaderNew = `<div className="flex justify-between items-start pr-2">
                                      <h3 className={\`font-black text-base leading-tight \${allCompleted ? 'text-gray-400 line-through' : 'text-[#071D49]'}\`}>{ex.name}</h3>
                                    </div>`;
code = code.replace(cardHeader, cardHeaderNew);

const dragGrip = `<div className={\`bg-white rounded-2xl border-2 p-3 transition-all \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}\`}>
                              <div className="flex justify-between items-start gap-2 cursor-pointer">
                                <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>`;
const dragGripNew = `<div className={\`bg-white rounded-2xl border-2 p-3 transition-all relative \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}\`}>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 opacity-50 hover:opacity-100 transition-opacity flex flex-col justify-center h-full touch-none" title="Arraste para reordenar"
                                onPointerDown={(e) => {
                                  // Em um app real, isso integraria com uma lib de drag-and-drop
                                  e.stopPropagation();
                                }}
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex justify-between items-start gap-2 cursor-pointer pl-6">
                                <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setExpandedExercises(prev => ({...prev, [ex.id]: !prev[ex.id]}))}>`;
code = code.replace(dragGrip, dragGripNew);


fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
