const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// We need state for dragging
const stateTarget = `const [deleteConfirm, setDeleteConfirm] = useState<{phaseId: keyof WorkoutData['phases'], exId: string} | null>(null);`;
const stateNew = `const [deleteConfirm, setDeleteConfirm] = useState<{phaseId: keyof WorkoutData['phases'], exId: string} | null>(null);
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
  };`;
code = code.replace(stateTarget, stateNew);

const cardTarget = `<div className={\`bg-white rounded-2xl border-2 p-3 transition-all relative \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}\`}>`;
const cardNew = `<div 
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, phase.id, exIndex)}
                            onDragEnter={(e) => handleDragEnter(e, phase.id, exIndex)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                            className={\`bg-white rounded-2xl border-2 p-3 transition-all relative 
                              \${allCompleted ? 'border-red-200/50 opacity-80' : 'border-gray-200 shadow-sm'}
                              \${draggedItem?.phaseId === phase.id && draggedItem?.exIndex === exIndex ? 'opacity-30 border-dashed border-blue-400' : ''}
                              \${dragOverItem?.phaseId === phase.id && dragOverItem?.exIndex === exIndex && draggedItem?.exIndex !== exIndex ? (draggedItem!.exIndex > exIndex ? 'border-t-4 border-t-blue-500' : 'border-b-4 border-b-blue-500') : ''}
                            \`}>`;
code = code.replace(cardTarget, cardNew);

// Make only the grip handle initiate drag on mobile if possible, but HTML5 draggable makes the whole card draggable. 
// We can set draggable={true} on the card, but it's fine for desktop. On mobile touch, HTML5 drag and drop doesn't work natively without polyfills or complex touch handling!
fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
