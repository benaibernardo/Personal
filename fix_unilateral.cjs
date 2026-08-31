const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

const targetStr = `                                            <div className="flex items-end justify-between gap-4 relative">
                                                
                                              {/* Reps / Segs Control with direct Input */}
                                              <div className="flex-1 flex flex-col items-center">
                                                <div className="flex justify-between items-center w-full mb-1 px-1">
                                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Reps / Segs</span>
                                                    
                                                  {isTimerRunning ? (
                                                    <button 
                                                      onClick={() => setActiveTimer(null)}
                                                      className="text-[9px] font-bold uppercase flex items-center gap-1 px-2.5 py-1 rounded-full shadow-sm transition-colors bg-red-600 text-white"
                                                    >
                                                      <Pause className="w-3 h-3"/> Parar (Registrar)
                                                    </button>
                                                  ) : (
                                                    <button 
                                                      onClick={() => setShowTimerMenu(isMenuOpen ? null : {exId: ex.id, setIndex: sIndex})}
                                                      className="text-[9px] font-bold uppercase flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                    >
                                                      <Play className="w-3 h-3"/> Cronômetro
                                                    </button>
                                                  )}
                                                </div>

                                                <div className={\`flex items-center justify-between bg-white rounded-xl border-2 p-1 shadow-sm w-full transition-colors h-14 \${isTimerRunning ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}\`}>
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                  <input 
                                                    type="number"
                                                    value={set.actualReps}
                                                    onChange={(e) => {
                                                      const val = parseInt(e.target.value);
                                                      updateSet(ex.id, sIndex, 'actualReps', isNaN(val) ? 0 : val);
                                                    }}
                                                    className={\`flex-1 min-w-[2rem] w-full text-center font-black text-xl bg-transparent border-none outline-none p-0 \${isTimerRunning ? 'text-red-600' : 'text-gray-900'}\`}
                                                  />
                                                  <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-10 h-10 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                </div>

                                                {/* Timer Presets Menu */}
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
                                              </div>
                                                
                                                <div className="flex-1 flex flex-col items-center">
                                                  <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 self-start ml-1">Carga (kg)</span>
                                                  <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualLoad}
                                                      onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        updateSet(ex.id, sIndex, 'actualLoad', isNaN(val) ? 0 : val);
                                                      }}
                                                      className="flex-1 min-w-[2rem] w-full text-center font-black text-xl text-gray-900 bg-transparent border-none outline-none p-0"
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>
                                                </div>
                                            </div>`;

const replaceStr = `                                            {(ex as any).isUnilateral ? (
                                              <div className="flex flex-col gap-3">
                                                {/* Left Side */}
                                                <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex items-end justify-between gap-2">
                                                  <div className="flex flex-col w-12 justify-center items-center h-14 bg-white rounded-lg border border-gray-200">
                                                    <span className="text-xs font-black text-[#00AEEF]">ESQ</span>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">Reps</span>
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', -1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualReps', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualReps', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">Kg</span>
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoad', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent outline-none p-0"/>
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
                                                      <input type="number" value={set.actualRepsR || set.actualReps} onChange={(e) => updateSet(ex.id, sIndex, 'actualRepsR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualRepsR', 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 active:bg-orange-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-center">
                                                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-0.5 w-full h-10 mt-4">
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', -1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Minus className="w-4 h-4"/></button>
                                                      <input type="number" value={set.actualLoadR || set.actualLoad} onChange={(e) => updateSet(ex.id, sIndex, 'actualLoadR', parseInt(e.target.value) || 0)} className="flex-1 w-full text-center font-black text-lg text-gray-900 bg-transparent outline-none p-0"/>
                                                      <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoadR', 1)} className="w-8 h-8 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-md shrink-0"><Plus className="w-4 h-4"/></button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
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
                                                </div>
                                                  
                                                <div className="flex-1 flex flex-col items-center">
                                                  <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 self-start ml-1">Carga (kg)</span>
                                                  <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 p-1 shadow-sm w-full h-14">
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', -1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Minus className="w-5 h-5"/></button>
                                                    <input 
                                                      type="number"
                                                      value={set.actualLoad}
                                                      onChange={(e) => updateSet(ex.id, sIndex, 'actualLoad', parseInt(e.target.value) || 0)}
                                                      className="flex-1 min-w-[2rem] w-full text-center font-black text-xl text-gray-900 bg-transparent border-none outline-none p-0"
                                                    />
                                                    <button onClick={() => adjustValue(ex.id, sIndex, 'actualLoad', 1)} className="w-10 h-10 flex items-center justify-center text-[#00AEEF] active:bg-blue-100 rounded-lg shrink-0"><Plus className="w-5 h-5"/></button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}`;

const startIdx = code.indexOf('<div className="flex items-end justify-between gap-4 relative">');
const endIdxStr = `                                            </div>`;
// find the correct closing div of the `flex items-end...` block.
// It's the one right before `</motion.div>` for the set.
const endIdx = code.indexOf('</motion.div>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  // get the exact text to replace to avoid matching issues
  let slice = code.substring(startIdx, endIdx);
  // since the slice has white space, we just replace it directly
  code = code.substring(0, startIdx) + replaceStr + "\n                                          " + code.substring(endIdx);
  fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
  console.log("Replaced unilateral successfully!");
} else {
  console.log("Could not find Unilateral boundaries.");
}
