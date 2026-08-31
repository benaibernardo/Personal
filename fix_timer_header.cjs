const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const targetHeader = `                                            <div className="flex items-center justify-between mb-4">
                                              <span className="font-black text-gray-500 uppercase text-xs tracking-wider">Série {sIndex + 1}</span>
                                              <button 
                                                onClick={() => updateSet(ex.id, sIndex, 'completed', !set.completed)}
                                                className={\`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm \${set.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                                              >
                                                {set.completed ? 'Concluída ✓' : 'Marcar Feita'}
                                              </button>
                                            </div>`;

const replaceHeader = `                                            <div className="flex items-center justify-between mb-4 relative">
                                              <div className="flex items-center gap-3">
                                                <span className="font-black text-gray-500 uppercase text-xs tracking-wider">Série {sIndex + 1}</span>
                                                {isTimerRunning ? (
                                                  <button onClick={() => setActiveTimer(null)} className="text-[10px] font-bold uppercase flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors bg-red-100 text-red-600 hover:bg-red-200 border border-red-200">
                                                    <Pause className="w-3 h-3 fill-red-600"/>
                                                  </button>
                                                ) : (
                                                  <button onClick={() => setShowTimerMenu(isMenuOpen ? null : {exId: ex.id, setIndex: sIndex})} className="text-[10px] font-bold uppercase flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
                                                    <Play className="w-3 h-3 fill-blue-600"/> Cronômetro
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
                                                className={\`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm \${set.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                                              >
                                                {set.completed ? 'Concluída ✓' : 'Marcar Feita'}
                                              </button>
                                            </div>`;

code = code.replace(targetHeader, replaceHeader);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
