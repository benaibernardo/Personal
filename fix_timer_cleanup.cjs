const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const targetStr = `                                            ) : (
                                              <div className="flex items-end justify-between gap-4 relative">
                                                {/* Timer inside standard layout */}
                                                <div className="flex-1 flex flex-col items-center">
                                                  <div className="flex justify-between items-center w-full mb-1 px-1">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Reps / Segs</span>
                                                    {isTimerRunning ? (
                                                      <button onClick={() => setActiveTimer(null)} className="text-[9px] font-bold uppercase flex items-center gap-1 px-2.5 py-1 rounded-full shadow-sm transition-colors bg-red-600 text-white">
                                                        <Pause className="w-3 h-3"/> Parar
                                                      </button>
                                                    ) : (
                                                      <button onClick={() => setShowTimerMenu(isMenuOpen ? null : {exId: ex.id, setIndex: sIndex})} className="text-[9px] font-bold uppercase flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200">
                                                        <Play className="w-3 h-3"/> Cronômetro
                                                      </button>
                                                    )}
                                                  </div>

                                                  <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualReps}
                                                      onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)}
                                                      className={\`flex-1 min-w-[2rem] w-full text-center font-black text-xl bg-transparent border-none outline-none p-0 \${isTimerRunning ? 'text-red-600' : 'text-gray-900'}\`}
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>

                                                  <AnimatePresence>
                                                    {isMenuOpen && !isTimerRunning && (
                                                      <>
                                                      <div className="fixed inset-0 z-40" onClick={() => setShowTimerMenu(null)} />
                                                      <motion.div 
                                                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                                        className="absolute top-14 left-0 w-full z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-2 space-y-2"
                                                      >
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Decrescente (Aviso)</p>
                                                        <div className="grid grid-cols-3 gap-1">
                                                          <button onClick={() => startTimerWithPreset(ex.id, sIndex, 15, true)} className="py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100">15s</button>
                                                          <button onClick={() => startTimerWithPreset(ex.id, sIndex, 30, true)} className="py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100">30s</button>
                                                          <button onClick={() => startTimerWithPreset(ex.id, sIndex, 60, true)} className="py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100">60s</button>
                                                        </div>
                                                        <div className="border-t border-gray-100 pt-2 grid grid-cols-2 gap-1">
                                                          <button onClick={() => startTimerWithPreset(ex.id, sIndex, 60, false)} className="py-1.5 bg-green-50 text-green-600 rounded text-xs font-bold flex flex-col items-center justify-center"><span className="text-[9px] font-medium">Subindo até</span>1 min</button>
                                                          <button onClick={() => { updateSet(ex.id, sIndex, 'actualReps', 0); setActiveTimer({ exId: ex.id, setIndex: sIndex, isCountdown: false }); setShowTimerMenu(null); }} className="py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-bold flex flex-col items-center justify-center"><span className="text-[9px] font-medium">Livre</span>∞ Up</button>
                                                        </div>
                                                      </motion.div>
                                                      </>
                                                    )}
                                                  </AnimatePresence>
                                                </div>`;

const replaceStr = `                                            ) : (
                                              <div className="flex items-end justify-between gap-4 relative">
                                                <div className="flex-1 flex flex-col items-center">
                                                  <div className="flex justify-between items-center w-full mb-1 px-1">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Reps / Segs</span>
                                                  </div>

                                                  <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualReps}
                                                      onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)}
                                                      className={\`flex-1 min-w-[2rem] w-full text-center font-black text-xl bg-transparent border-none outline-none p-0 \${isTimerRunning ? 'text-red-600' : 'text-gray-900'}\`}
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>
                                                </div>`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
