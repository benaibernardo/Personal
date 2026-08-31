const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutExecution.tsx', 'utf8');

// Update Cancel button (X)
code = code.replace(/className="w-12 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center"/g, 'className="w-12 h-10 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center"');

// Update newExForm Unilateral
const oldNewForm = `<NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} fullWidth={true} />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                            Unilateral
                        </label>
                      </div>`;
const newNewForm = `<div className="flex gap-2 items-end">
                          <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={newExForm.load} onChange={(v) => setNewExForm({...newExForm, load: v})} isDecimal={true} fullWidth={true} />
                          <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                              <input type="checkbox" checked={newExForm.isUnilateral || false} onChange={e => setNewExForm({...newExForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                              Unilateral
                          </label>
                        </div>
                      </div>`;
code = code.replace(oldNewForm, newNewForm);

// Update editForm Unilateral
const oldEditForm = `<NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} fullWidth={true} />
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 uppercase bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                    Unilateral
                                </label>
                              </div>`;
const newEditForm = `<div className="flex gap-2 items-end">
                                  <NumberControl icon={Dumbbell} title="Carga Base (kg)" value={editForm.load} onChange={(v) => setEditForm({...editForm, load: v})} isDecimal={true} fullWidth={true} />
                                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[10px] font-bold text-gray-500 uppercase bg-white border-2 border-gray-200 px-2 rounded-xl shadow-sm h-11">
                                      <input type="checkbox" checked={editForm.isUnilateral || false} onChange={e => setEditForm({...editForm, isUnilateral: e.target.checked})} className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                                      Unilateral
                                  </label>
                                </div>
                              </div>`;
code = code.replace(oldEditForm, newEditForm);

fs.writeFileSync('src/components/WorkoutExecution.tsx', code);
