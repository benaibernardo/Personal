import React, { useState, useEffect } from 'react';
import { Check, X, 
  Layers, Repeat, 
  CheckCircle2, ChevronDown, ChevronUp, 
  Plus, Minus, MessageSquare, Activity, Trash2, Edit2, Save,
  Dumbbell, Zap, Wind, Move, Play, Pause, AlertTriangle, Undo, BellRing, ArrowUp, ArrowDown,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutData, StrengthExercise, PhaseExercise } from '../types';

interface Props {
  data: WorkoutData;
  updateData: (updates: Partial<WorkoutData>) => void;
}

interface SetExecution {
  actualReps: number;
  actualLoad: number;
  actualRepsR?: number;
  actualLoadR?: number;
  completed: boolean;
}

export const WorkoutExecution: React.FC<Props> = ({ data, updateData }) => {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    mobility: false, activation: false, strength: false, deceleration: false
  });
  
  const [executionData, setExecutionData] = useState<Record<string, SetExecution[]>>({});
  const [pseData, setPseData] = useState<Record<string, number>>({});
  const [obsData, setObsData] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState<string | null>(null);
  
  const [newExForm, setNewExForm] = useState<{name: string, sets: number, reps: number, load: number, isUnilateral?: boolean}>({ name: '', sets: 3, reps: 10, load: 0 });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{name: string, sets: number, reps: number, load: number, isUnilateral?: boolean}>({ name: '', sets: 3, reps: 10, load: 0 });
  
  // TIMER STATE
  const [activeTimer, setActiveTimer] = useState<{exId: string, setIndex: number, isCountdown: boolean, targetTime?: number} | null>(null);
  const [showTimerMenu, setShowTimerMenu] = useState<{exId: string, setIndex: number} | null>(null);
  const [timerAlert, setTimerAlert] = useState<{exName: string, setNumber: number} | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{phaseId: keyof WorkoutData['phases'], exId: string} | null>(null);
  const [draggedItem, setDraggedItem] = useState<{phaseId: string, exIndex: number} | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{phaseId: string, exIndex: number} | null>(null);

  const handleDragStart = (e: React.DragEvent, phaseId: string, exIndex: number) => {
    setDraggedItem({ phaseId, exIndex });
    // e.dataTransfer.effectAllowed = "move";
    // For Firefox compatibility
    e.dataTransfer.setData('text/plain', exIndex.toString());
    // Transparent image for drag ghost to avoid default big ghost
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEnter = (e: React.DragEvent, phaseId: string, exIndex: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.phaseId === phaseId) {
      setDragOverItem({ phaseId, exIndex });
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && dragOverItem && draggedItem.phaseId === dragOverItem.phaseId && draggedItem.exIndex !== dragOverItem.exIndex) {
      const pId = draggedItem.phaseId as keyof WorkoutData['phases'];
      const currentList = [...(data.phases[pId] || [])];
      const [removed] = currentList.splice(draggedItem.exIndex, 1);
      currentList.splice(dragOverItem.exIndex, 0, removed);
      
      const newPhases = { ...data.phases, [pId]: currentList };
      updateData({ phases: newPhases });
      
      // Update routines if needed
      if (data.selectedRoutine && data.routines) {
        const currentRoutine = data.selectedRoutine;
        updateData({
          routines: {
            ...data.routines,
            [currentRoutine]: newPhases
          }
        });
      }
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getPseLabel = (level: number) => {
    if (level === 0) return 'Não avaliado';
    if (level <= 2) return 'Muito Leve';
    if (level <= 4) return 'Leve';
    if (level <= 6) return 'Moderado';
    if (level <= 8) return 'Difícil';
    if (level <= 9) return 'Muito Difícil';
    return 'Máximo';
  };

  const getPseEmoji = (level: number) => {
    if (level === 0) return '😴';
    if (level <= 2) return '🟢'; 
    if (level <= 4) return '🟡'; 
    if (level <= 6) return '🟠'; 
    if (level <= 8) return '🔴'; 
    return '💀'; 
  };

  useEffect(() => {
    const initialExec: Record<string, SetExecution[]> = {};
    const initExercise = (ex: any) => {
      if (executionData[ex.id]) return; 
      const setsStr = ex.setsReps || ex.time || '1 x 10';
      const numSets = parseInt(setsStr.split('x')[0]) || 1;
      const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
      const defaultLoad = parseInt(ex.load) || 0;

      initialExec[ex.id] = Array(numSets).fill(null).map(() => ({
        actualReps: defaultReps,
        actualLoad: defaultLoad,
        completed: false
      }));
    };

    if (data && data.phases) {
      data.phases.mobility?.forEach(initExercise);
      data.phases.activation?.forEach(initExercise);
      data.phases.strength?.forEach(initExercise);
      data.phases.deceleration?.forEach(initExercise);
      
      setExecutionData(prev => {
        const merged = { ...prev };
        let changed = false;
        Object.keys(initialExec).forEach(k => {
          if (!merged[k]) {
            merged[k] = initialExec[k];
            changed = true;
          }
        });
        return changed ? merged : prev;
      });
    }
  }, [data]);

  const playBeep = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1.5);
    } catch (e) {
      console.log('Audio not supported or blocked');
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTimer) {
      interval = setInterval(() => {
        setExecutionData(prev => {
          const exSets = [...(prev[activeTimer.exId] || [])];
          const current = exSets[activeTimer.setIndex]?.actualReps || 0;
          let nextValue = current;

          if (activeTimer.isCountdown) {
            nextValue = Math.max(0, current - 1);
            if (nextValue === 0 && current > 0) {
              playBeep();
              const exName = findExerciseName(activeTimer.exId);
              setTimerAlert({ exName, setNumber: activeTimer.setIndex + 1 });
              setActiveTimer(null);
            }
          } else {
            nextValue = current + 1;
            if (activeTimer.targetTime && nextValue >= activeTimer.targetTime) {
              playBeep();
              const exName = findExerciseName(activeTimer.exId);
              setTimerAlert({ exName, setNumber: activeTimer.setIndex + 1 });
              setActiveTimer(null);
            }
          }

          exSets[activeTimer.setIndex] = { ...exSets[activeTimer.setIndex], actualReps: nextValue };
          return { ...prev, [activeTimer.exId]: exSets };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const findExerciseName = (exId: string) => {
    for (const phase of phasesConfig) {
      const exercises = data.phases[phase.id as keyof WorkoutData['phases']] as any[];
      const ex = exercises?.find(e => e.id === exId);
      if (ex) return ex.name;
    }
    return 'Exercício';
  };

  // Auto Collapse Phase if all exercises completed
  useEffect(() => {
    if (!data.phases) return;
    phasesConfig.forEach(phase => {
      const exercises = data.phases[phase.id as keyof WorkoutData['phases']] as any[];
      if (exercises && exercises.length > 0) {
        const allDone = exercises.every(ex => {
          const sets = executionData[ex.id];
          return sets && sets.length > 0 && sets.every(s => s.completed);
        });
        if (allDone && expandedPhases[phase.id]) {
          setExpandedPhases(prev => ({ ...prev, [phase.id]: false }));
        }
      }
    });
  }, [executionData, data.phases]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleExercise = (exId: string) => {
    setExpandedExercise(prev => prev === exId ? null : exId);
  };

  const updateSet = (exId: string, setIndex: number, field: keyof SetExecution, value: number | boolean) => {
    setExecutionData(prev => {
      const exSets = [...(prev[exId] || [])];
      exSets[setIndex] = { ...exSets[setIndex], [field]: value };
      return { ...prev, [exId]: exSets };
    });
  };

  const adjustValue = (exId: string, setIndex: number, field: 'actualReps' | 'actualLoad' | 'actualRepsR' | 'actualLoadR', delta: number) => {
    setExecutionData(prev => {
      const exSets = [...(prev[exId] || [])];
      const current = exSets[setIndex]?.[field];
      if (typeof current !== 'number') return prev;
      
      const newValue = Math.max(0, current + delta); 
      exSets[setIndex] = { ...exSets[setIndex], [field]: newValue };
      return { ...prev, [exId]: exSets };
    });
  };

  const phasesConfig = [
    { id: 'mobility', title: 'Mobilidade', icon: Move, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-500' },
    { id: 'activation', title: 'Ativação', icon: Zap, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-500' },
    { id: 'strength', title: 'Força', icon: Dumbbell, color: 'text-[#071D49]', bg: 'bg-blue-50', border: 'border-[#00AEEF]' },
    { id: 'deceleration', title: 'Desaceleração', icon: Wind, color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-500' }
  ] as const;

  const startAdding = (phaseId: string) => {
    setNewExForm({ name: '', sets: 3, reps: 10, load: 0 });
    setIsAdding(phaseId);
  };

  const saveNewExercise = (phaseId: keyof WorkoutData['phases']) => {
    if (!newExForm.name.trim()) return;
    const newId = `ex-${Date.now()}`;
    const setsRepsStr = `${newExForm.sets} x ${newExForm.reps}`;
    
    // Using any to bypass strict type checking since we want to add load and isUnilateral everywhere now
    const newEx: any = { 
      id: newId, 
      name: newExForm.name, 
      setsReps: setsRepsStr, 
      time: setsRepsStr,
      load: newExForm.load.toString(),
      isUnilateral: newExForm.isUnilateral || false,
      notes: '', 
      feedback: '' 
    };
    
    updateData({ phases: { ...data.phases, [phaseId]: [...(data.phases[phaseId] || []), newEx] } });
    setIsAdding(null);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const { phaseId, exId } = deleteConfirm;
      const filtered = data.phases[phaseId].filter((ex: any) => ex.id !== exId);
      updateData({ phases: { ...data.phases, [phaseId]: filtered } });
      setDeleteConfirm(null);
    }
  };

  const startEditing = (ex: any) => {
    const setsStr = ex.setsReps || ex.time || '3 x 10';
    const numSets = parseInt(setsStr.split('x')[0]) || 3;
    const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
    const defaultLoad = parseInt(ex.load) || 0;
    
    setEditForm({ name: ex.name, sets: numSets, reps: defaultReps, load: defaultLoad });
    setEditMode(ex.id);
  };

  const saveEditExercise = (phaseId: keyof WorkoutData['phases'], exId: string) => {
    if (!editForm.name.trim()) return;
    const setsRepsStr = `${editForm.sets} x ${editForm.reps}`;
    
    const updates = { 
      name: editForm.name, 
      setsReps: setsRepsStr, 
      time: setsRepsStr, // Set both to be safe
      load: editForm.load.toString(),
      isUnilateral: editForm.isUnilateral
    };
      
    const updated = data.phases[phaseId].map((ex: any) => ex.id === exId ? { ...ex, ...updates } : ex);
    updateData({ phases: { ...data.phases, [phaseId]: updated } });
    setEditMode(null);

    setExecutionData(prev => {
       const currentSets = prev[exId] || [];
       if (editForm.sets > currentSets.length) {
          const toAdd = Array(editForm.sets - currentSets.length).fill(null).map(() => ({ actualReps: editForm.reps, actualLoad: editForm.load, completed: false }));
          return { ...prev, [exId]: [...currentSets, ...toAdd] };
       } else if (editForm.sets < currentSets.length) {
          return { ...prev, [exId]: currentSets.slice(0, editForm.sets) };
       }
       return prev;
    });
  };
  

  const moveExercise = (phaseId: string, index: number, direction: 'up' | 'down') => {
    const pId = phaseId as keyof WorkoutData['phases'];
    const exercises = [...(data.phases[pId] || [])];
    if (direction === 'up' && index > 0) {
      [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
    } else {
      return;
    }
    updateData({ phases: { ...data.phases, [pId]: exercises } });
  };


  const getHistoricalExercises = (phaseId: string) => {
    const history = new Map<string, any>();
    const staticBasics: Record<string, any[]> = {
      mobility: [{name:'Mobilidade de Tornozelo', sets: 2, reps: 10, load: 0}, {name:'Passada Homem-Aranha', sets: 2, reps: 10, load: 0}, {name:'Gato e Vaca', sets: 2, reps: 12, load: 0}],
      activation: [{name:'Prancha Frontal', sets: 2, reps: 30, load: 0}, {name:'Ponte de Glúteo', sets: 2, reps: 15, load: 0}, {name:'Prancha Lateral', sets: 2, reps: 20, load: 0}],
      strength: [{name:'Agachamento Livre', sets: 3, reps: 10, load: 20}, {name:'Agachamento Goblet', sets: 3, reps: 10, load: 15}, {name:'Leg Press', sets: 3, reps: 10, load: 50}, {name:'Supino Reto', sets: 3, reps: 10, load: 20}, {name:'Remada Curvada', sets: 3, reps: 10, load: 20}, {name:'Cadeira Extensora', sets: 3, reps: 12, load: 30}, {name:'Stiff', sets: 3, reps: 10, load: 20}],
      deceleration: [{name:'Postura da Criança', sets: 1, reps: 60, load: 0}, {name:'Alongamento Peitoral', sets: 1, reps: 30, load: 0}, {name:'Pernas na Parede', sets: 1, reps: 60, load: 0}]
    };
    (staticBasics[phaseId] || []).forEach(ex => history.set(ex.name.toLowerCase(), ex));
    
    const pId = phaseId as keyof WorkoutData['phases'];
    
    // Check current phase
    const currentPhase = data.phases[pId] || [];
    
    // Check all routines history if available
    const allRoutines = (data as any).routines ? Object.values((data as any).routines) : [];
    
    const extractExercises = (phaseList: any[]) => {
      (phaseList || []).forEach(ex => {
        const setsStr = ex.setsReps || ex.time || '3 x 10';
        const numSets = parseInt(setsStr.split('x')[0]) || 3;
        const defaultReps = parseInt(setsStr.split('x')[1]?.split('a')[0]) || 10;
        const defaultLoad = parseInt(ex.load) || 0;
        history.set(ex.name.toLowerCase(), { name: ex.name, sets: numSets, reps: defaultReps, load: defaultLoad, isUnilateral: ex.isUnilateral || false });
      });
    };
    
    // Extract from current phase
    extractExercises(currentPhase);
    
    // Extract from all other routines to build a persistent memory dictionary
    allRoutines.forEach((routine: any) => {
      extractExercises(routine[pId]);
    });
    
    return Array.from(history.values());
  };

  const getNextExerciseId = (currentId: string) => {
    let allExs: string[] = [];
    phasesConfig.forEach(p => {
      (data.phases[p.id as keyof WorkoutData['phases']] || []).forEach(e => allExs.push(e.id));
    });
    const currentIndex = allExs.indexOf(currentId);
    if (currentIndex >= 0 && currentIndex < allExs.length - 1) {
      return allExs[currentIndex + 1];
    }
    return null;
  };

  const toggleExerciseDone = (exId: string) => {
    const sets = executionData[exId] || [];
    const allDone = sets.length > 0 && sets.every(s => s.completed);
    
    setExecutionData(prev => ({
      ...prev,
      [exId]: sets.map(s => ({ ...s, completed: !allDone }))
    }));
    
    if (!allDone) {
      setTimeout(() => {
        const nextId = getNextExerciseId(exId);
        setExpandedExercise(nextId);
      }, 300);
    }
  };

  const startTimerWithPreset = (exId: string, setIndex: number, presetValue: number, isCountdown: boolean) => {
    updateSet(exId, setIndex, 'actualReps', presetValue);
    if (isCountdown) {
      setActiveTimer({ exId, setIndex, isCountdown: true });
    } else {
      updateSet(exId, setIndex, 'actualReps', 0);
      setActiveTimer({ exId, setIndex, isCountdown: false, targetTime: presetValue });
    }
    setShowTimerMenu(null);
  };

  const NumberControl = ({ icon: Icon, title, value, onChange, isDecimal = false, fullWidth = false }: { icon: any, title: string, value: number | string, onChange: (v: any) => void, isDecimal?: boolean, fullWidth?: boolean }) => (
    <div className={`flex flex-col items-center min-w-[60px] ${fullWidth ? 'w-full' : 'flex-1'}`}>
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
  );

  return (
    <div className="space-y-6 mt-6">
      
      {/* ALERT POPUP */}
      <AnimatePresence>
        {timerAlert && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <BellRing className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Tempo Esgotado!</h2>
              <p className="text-gray-500 font-medium mb-6">A Série {timerAlert.setNumber} de <strong className="text-gray-800">{timerAlert.exName}</strong> foi concluída.</p>
              <button 
                onClick={() => setTimerAlert(null)}
                className="w-full py-4 bg-[#00AEEF] text-white font-black uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-center text-[#071D49] mb-2">Excluir Exercício?</h3>
            <p className="text-gray-500 text-[13px] text-center mb-6">Essa ação removerá o exercício do treino e não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {phasesConfig.map(phase => {
        const exercises = data.phases[phase.id as keyof WorkoutData['phases']] as any[];
        const Icon = phase.icon;
        const isPhaseExpanded = expandedPhases[phase.id];
        const hasExercises = exercises && exercises.length > 0;
        
        const phaseCompleted = hasExercises && exercises.every(ex => {
          const sets = executionData[ex.id];
          return sets && sets.length > 0 && sets.every(s => s.completed);
        });

        return (
          <div key={phase.id} className="space-y-4">
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => togglePhase(phase.id)}
                className={`flex-1 px-4 py-3 rounded-xl ${phaseCompleted ? 'bg-gray-100 border-gray-300' : phase.bg} border-l-4 ${phaseCompleted ? 'border-l-gray-400' : phase.border} flex items-center justify-between shadow-sm transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${phaseCompleted ? 'text-gray-400' : phase.color}`} />
                  <h2 className={`font-black uppercase tracking-wider text-[13px] ${phaseCompleted ? 'text-gray-500 line-through' : phase.color}`}>{phase.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${phaseCompleted ? 'text-gray-400' : phase.color} opacity-70`}>{exercises?.length || 0} Ex.</span>
                  {isPhaseExpanded ? <ChevronUp className={phaseCompleted ? 'text-gray-400' : phase.color} /> : <ChevronDown className={phaseCompleted ? 'text-gray-400' : phase.color} />}
                </div>
              </button>
              {isPhaseExpanded && (
                <button 
                  onClick={() => startAdding(phase.id)}
                  className={`p-3 rounded-xl border-2 border-dashed ${phase.border} text-gray-500 hover:text-gray-700 hover:bg-white transition-colors flex items-center justify-center bg-gray-50/50 shadow-sm`}
                  title={`Adicionar Exercício em ${phase.title}`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isPhaseExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {isAdding === phase.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-300 shadow-sm space-y-4"
                    >
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Exercício</label>
                        <input type="text" placeholder="Ex: Agachamento Livre" value={newExForm.name} onChange={e => setNewExForm({...newExForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#00AEEF] focus:outline-none font-bold text-gray-800" />
                        {newExForm.name.length > 1 && (
                          <div className="absolute z-50 w-full bg-white border border-gray-200 shadow-xl rounded-xl mt-1 max-h-48 overflow-y-auto">
                            {getHistoricalExercises(phase.id)
                              .filter(ex => ex.name.toLowerCase().includes(newExForm.name.toLowerCase()) && ex.name.toLowerCase() !== newExForm.name.toLowerCase())
                              .map((ex, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => setNewExForm({ ...newExForm, name: ex.name, sets: ex.sets, reps: ex.reps, load: ex.load, isUnilateral: ex.isUnilateral || false })}
                                  className="w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                                >
                                  <span className="text-[13px] font-bold text-gray-900 block">{ex.name}</span>
                                  <span className="text-xs text-gray-500 font-medium">{ex.sets}x{ex.reps} {ex.load ? `- ${ex.load}kg` : ''}</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <NumberControl icon={Layers} title="Séries" value={newExForm.sets} onChange={(v) => setNewExForm({...newExForm, sets: v})} />
                          <NumberControl icon={Repeat} title="Reps/Tempo" value={newExForm.reps} onChange={(v) => setNewExForm({...newExForm, reps: v})} />
                        </div>
                        <div className="flex gap-2 items-end">
                          <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} />
                          <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                              <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                              Unilateral
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end items-center pt-2 gap-2">
                        <button onClick={() => setIsAdding(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                          <X className="w-5 h-5" />
                        </button>
                        <button onClick={() => saveNewExercise(phase.id as any)} className="flex-1 max-w-[120px] h-10 bg-green-500 text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Adicionar">
                          Adicionar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {exercises && exercises.map((ex, exIndex) => {
                      const isExpanded = expandedExercise === ex.id;
                      const sets = executionData[ex.id] || [];
                      const allCompleted = sets.length > 0 && sets.every(s => s.completed);
                      const isEditing = editMode === ex.id;
                      
                      const dateLast = data.sessionDate ? data.sessionDate.split('-').reverse().slice(0,2).join('/') : 'N/A';

                      let cardClass = "border-gray-200 bg-white";
                      if (allCompleted) {
                        cardClass = "bg-[#FFF0F0] border-red-200 opacity-90";
                      } else if (isExpanded) {
                        cardClass = `${phase.bg} ${phase.border} border-2 shadow-md`;
                      } else {
                        cardClass = `${phase.bg} border-gray-200`;
                      }

                      return (
                        <motion.div 
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
                          className={`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 ${cardClass} relative
                            ${draggedItem?.phaseId === phase.id && draggedItem?.exIndex === exIndex ? 'opacity-30 border-dashed border-blue-400' : ''}
                            ${dragOverItem?.phaseId === phase.id && dragOverItem?.exIndex === exIndex && draggedItem?.exIndex !== exIndex ? (draggedItem!.exIndex > exIndex ? 'border-t-4 border-t-blue-500' : 'border-b-4 border-b-blue-500') : ''}
                          `}
                        >
                          {isEditing ? (
                            <div className="p-5 space-y-4 bg-white border-b border-gray-200">
                              <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Nome do Exercício</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 font-bold mt-1" />
                              </div>
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="flex gap-2">
                                  <NumberControl icon={Layers} title="Séries" value={editForm.sets} onChange={(v) => setEditForm({...editForm, sets: v})} />
                                  <NumberControl icon={Repeat} title="Reps/Tempo" value={editForm.reps} onChange={(v) => setEditForm({...editForm, reps: v})} />
                                </div>
                                <div className="flex gap-2 items-end">
                                  <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} />
                                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                                      <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                      Unilateral
                                  </label>
                                </div>
                              </div>
                              <div className="flex justify-end items-center pt-2 gap-2">
                                <button onClick={() => setEditMode(null)} className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" title="Cancelar">
                                  <X className="w-5 h-5" />
                                </button>
                                <button onClick={() => saveEditExercise(phase.id as any, ex.id)} className="flex-1 max-w-[120px] h-10 bg-green-500 text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex items-center justify-center rounded-xl" title="Salvar">
                                  Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full flex flex-col relative">
                              <div className="absolute left-0 top-6 p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex flex-col justify-center touch-none z-10" title="Arraste para reordenar"
                                onPointerDown={(e) => { e.stopPropagation(); }}
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <button onClick={() => toggleExercise(ex.id)} className="flex-1 px-5 pl-10 pt-5 pb-3 flex items-center justify-between text-left">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${allCompleted ? 'bg-red-200/50 text-red-700' : 'bg-white text-gray-600 shadow-sm'}`}>
                                      {exIndex + 1}
                                    </span>
                                    <h3 className={`font-black text-base leading-tight transition-all ${allCompleted ? 'text-gray-400 line-through opacity-80' : 'text-gray-900'}`}>
                                      {ex.name}
                                    </h3>
                                  </div>
                                  
                                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold whitespace-nowrap border shadow-sm ${allCompleted ? 'bg-red-50 border-red-100 text-red-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                                      <Layers className="w-3.5 h-3.5" />
                                      {ex.setsReps || ex.time || '3 x 10'}
                                    </span>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md border whitespace-nowrap shadow-sm ${allCompleted ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-200'}`}>
                                      <Dumbbell className={`w-3.5 h-3.5 ${allCompleted ? 'text-red-400' : 'text-emerald-500'}`} />
                                      <strong className={`${allCompleted ? 'text-red-700' : 'text-emerald-700'}`}>{ex.load || '0'} kg</strong> 
                                      <span className={`text-[10px] ${allCompleted ? 'text-red-400' : 'text-emerald-600/70'}`}>({dateLast})</span>
                                    </span>
                                    {(ex as any).isUnilateral && (
                                      <span className={`px-2 py-1 rounded-md text-[#00AEEF] font-bold border whitespace-nowrap ${allCompleted ? 'bg-blue-50 border-blue-100' : 'bg-white/60 border-blue-200/50 shadow-sm'}`}>
                                        E/D
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  {allCompleted && <CheckCircle2 className="w-6 h-6 text-red-400" />}
                                  {isExpanded ? <ChevronUp className={`w-6 h-6 ${allCompleted ? 'text-red-300' : 'text-[#00AEEF]'}`} /> : <ChevronDown className={`w-6 h-6 ${allCompleted ? 'text-red-300' : 'text-[#00AEEF]'}`} />}
                                </div>
                              </button>
                              
                              <div className="flex items-center justify-end gap-2 px-5 pb-3">
                                <button onClick={() => moveExercise(phase.id, exIndex, 'up')} disabled={exIndex === 0} className={`p-2 rounded-xl transition-colors ${exIndex === 0 ? 'text-gray-200' : 'text-blue-400 hover:bg-blue-50'}`}>
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveExercise(phase.id, exIndex, 'down')} disabled={exIndex === (data.phases[phase.id] || []).length - 1} className={`p-2 rounded-xl transition-colors ${exIndex === (data.phases[phase.id] || []).length - 1 ? 'text-gray-200' : 'text-blue-400 hover:bg-blue-50'}`}>
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditMode(ex.id); setEditForm({ name: ex.name, sets: sets.length, reps: sets[0]?.actualReps || 0, load: sets[0]?.actualLoad || 0, isUnilateral: (ex as any).isUnilateral }); }} className="p-2 text-orange-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm({phaseId: phase.id as any, exId: ex.id})} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          <AnimatePresence>
                            {isExpanded && !isEditing && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-200/50 bg-white/50"
                              >
                                <div className="p-5 space-y-6">
                                  <div className="space-y-3">
                                    <AnimatePresence>
                                      {sets.map((set, sIndex) => {
                                        const isTimerRunning = activeTimer?.exId === ex.id && activeTimer?.setIndex === sIndex;
                                        const isMenuOpen = showTimerMenu?.exId === ex.id && showTimerMenu?.setIndex === sIndex;

                                        return (
                                          <motion.div 
                                            key={sIndex} 
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-2xl border-2 transition-all ${set.completed ? 'border-green-300 bg-green-50' : 'border-white bg-white shadow-sm'}`}
                                          >
                                            
                                            <div className="flex items-center justify-between mb-4 relative">
                                              <div className="flex items-center gap-3">
                                                <span className="font-black text-gray-500 uppercase text-xs tracking-wider flex items-center gap-1"><Layers className="w-3 h-3"/> {sIndex + 1}</span>
                                                {isTimerRunning ? (
                                                  <button onClick={() => setActiveTimer(null)} className="text-[10px] font-bold uppercase flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors bg-red-100 text-red-600 hover:bg-red-200 border border-red-200">
                                                    <Pause className="w-3 h-3 fill-red-600"/>
                                                  </button>
                                                ) : (
                                                  <button onClick={() => setShowTimerMenu(isMenuOpen ? null : {exId: ex.id, setIndex: sIndex})} className="text-[10px] font-bold uppercase flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
                                                    <Play className="w-3 h-3 fill-blue-600"/>
                                                  </button>
                                                )}
                                              </div>
                                              
                                              <AnimatePresence>
                                                {isMenuOpen && !isTimerRunning && (
                                                  <>
                                                  <div className="fixed inset-0 z-40" onClick={() => setShowTimerMenu(null)} />
                                                  <motion.div 
                                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                                    className="absolute top-10 left-0 w-[240px] z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-3 space-y-3"
                                                  >
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase text-center tracking-wider">Temporizador</p>
                                                    <div className="grid grid-cols-3 gap-1.5">
                                                      <button onClick={() => startTimerWithPreset(ex.id, sIndex, 15, true)} className="py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100">15s</button>
                                                      <button onClick={() => startTimerWithPreset(ex.id, sIndex, 30, true)} className="py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100">30s</button>
                                                      <button onClick={() => startTimerWithPreset(ex.id, sIndex, 60, true)} className="py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100">60s</button>
                                                    </div>
                                                    <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-1.5">
                                                      <button onClick={() => startTimerWithPreset(ex.id, sIndex, 60, false)} className="py-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex flex-col items-center justify-center border border-green-100"><span className="text-[9px] font-medium opacity-80">Progressivo</span>1 min</button>
                                                      <button onClick={() => { updateSet(ex.id, sIndex, 'actualReps', 0); setActiveTimer({ exId: ex.id, setIndex: sIndex, isCountdown: false }); setShowTimerMenu(null); }} className="py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold flex flex-col items-center justify-center border border-gray-200"><span className="text-[9px] font-medium opacity-80">Livre</span>∞ Up</button>
                                                    </div>
                                                  </motion.div>
                                                  </>
                                                )}
                                              </AnimatePresence>
                                              
                                              <button 
                                                onClick={() => updateSet(ex.id, sIndex, 'completed', !set.completed)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors shadow-sm ${set.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                              >
                                                <CheckCircle2 className="w-5 h-5" />
                                              </button>
                                            </div>

                                            {/* TIMER RUNNING PROMINENT BAR */}
                                            {isTimerRunning && (
                                              <div className="mb-4 bg-red-500 text-white p-3 rounded-xl flex items-center justify-between shadow-md animate-pulse">
                                                <div className="flex items-center gap-2">
                                                  <Play className="w-5 h-5 fill-white animate-spin" />
                                                  <span className="font-black text-[13px] uppercase tracking-wider">Cronômetro em Execução...</span>
                                                </div>
                                                <button 
                                                  onClick={() => setActiveTimer(null)}
                                                  className="bg-white text-red-600 px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider shadow hover:bg-gray-100 active:scale-95 transition-all"
                                                >
                                                  Parar
                                                </button>
                                              </div>
                                            )}

                                                                                        {(ex as any).isUnilateral ? (
                                              <div className="flex flex-col gap-3">
                                                {/* Left Side */}
                                                <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex items-end justify-between gap-2">
                                                  <div className="flex flex-col w-12 justify-center items-center h-14 bg-white rounded-lg border border-gray-200">
                                                    <span className="text-xs font-black text-[#00AEEF]">ESQ</span>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1" title="Repetições"><Repeat className="w-3 h-3"/></span>
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-base text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1" title="Carga (kg)"><Dumbbell className="w-3 h-3"/></span>
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoad', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-base text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                                {/* Right Side */}
                                                <div className="bg-pink-50/50 p-2 rounded-xl border border-pink-100 flex items-end justify-between gap-2">
                                                  <div className="flex flex-col w-12 justify-center items-center h-14 bg-white rounded-lg border border-gray-200">
                                                    <span className="text-xs font-black text-pink-500">DIR</span>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10 mt-4">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualRepsR', -1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualRepsR || set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualRepsR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-base text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualRepsR', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10 mt-4">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualLoadR || set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoadR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-base text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', 1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex items-end justify-between gap-4 relative">
                                                <div className="flex-1 flex flex-col items-center">
                                                  <div className="flex justify-between items-center w-full mb-1 px-1">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1" title="Reps / Segs"><Repeat className="w-3 h-3"/></span>
                                                  </div>

                                                  <div className={`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 ${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}>
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualReps}
                                                      onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)}
                                                      className={`flex-1 min-w-[2rem] w-full text-center font-black text-lg bg-transparent border-none outline-none p-0 ${isTimerRunning ? 'text-red-600' : 'text-gray-900'}`}
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>
                                                </div>
                                                  
                                                <div className="flex-1 flex flex-col items-center">
                                                  <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 self-start ml-1 flex items-center gap-1" title="Carga (kg)"><Dumbbell className="w-3 h-3"/></span>
                                                  <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualLoad}
                                                      onChange={(e) => updateSet(ex.id, sIndex, 'actualLoad', parseInt(e.target.value) || 0)}
                                                      className="flex-1 min-w-[2rem] w-full text-center font-black text-lg text-gray-900 bg-transparent border-none outline-none p-0"
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </motion.div>
                                        );
                                      })}
                                    </AnimatePresence>
                                  </div>

                                  {/* PSE COMPACTO */}
                                  <div className="pt-4 border-t border-gray-200/50">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                                        <Activity className="w-4 h-4 text-orange-500" /> PSE
                                      </label>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${pseData[ex.id] > 0 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'}`}>
                                        {getPseLabel(pseData[ex.id] || 0)}
                                      </span>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                                      <div className="flex justify-between items-center px-1">
                                        <span className="text-xl">{getPseEmoji(pseData[ex.id] || 0)}</span>
                                        <span className="font-black text-xl text-gray-800">{pseData[ex.id] > 0 ? pseData[ex.id] : '-'}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min="0" max="10" step="1" 
                                        value={pseData[ex.id] || 0} 
                                        onChange={(e) => setPseData(prev => ({ ...prev, [ex.id]: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                                      />
                                      <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                                        <span>0 (Leve)</span>
                                        <span>10 (Máximo)</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t border-gray-200/50">
                                    <label className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5 mb-2">
                                      <MessageSquare className="w-4 h-4 text-blue-500" />
                                      Observações (opcional)
                                    </label>
                                    <textarea 
                                      value={obsData[ex.id] || ''}
                                      onChange={(e) => setObsData(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                      className="w-full p-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-[13px] min-h-[60px]"
                                      placeholder="Ex: Amplitude excelente..."
                                    />
                                  </div>
                                  
                                  <div className="pt-4 mt-4">
                                    <button 
                                      onClick={() => toggleExerciseDone(ex.id)}
                                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                                        allCompleted 
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                        : 'bg-[#071D49] hover:bg-black text-white'
                                      }`}
                                    >
                                      {allCompleted ? <Undo className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                      {allCompleted ? 'Desmarcar Exercício' : 'Exercício Feito'}
                                    </button>
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
