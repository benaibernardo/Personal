const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const oldFinanceiroTab = `{activeTab === 'financeiro' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#071D49]">Financeiro & Contrato</h2>
            
            {/* Box Pagamento Detalhado */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensalidade Vigente</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                  Vencimento dia {paymentDay}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-[#071D49]">R$ 600,00</span>
                <span className="text-xs font-semibold text-gray-500">Forma: <strong className="text-[#071D49]">{paymentMethod}</strong></span>
              </div>

              {paymentMethod === 'PIX' ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-600 block">Chave PIX (CPF / CNPJ / E-mail):</span>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 text-xs font-mono text-[#071D49]">
                    <span>contato@benaibernardo.com.br</span>
                    <button 
                      onClick={() => alert('Chave PIX copiada para a área de transferência!')}
                      className="text-[#00AEEF] font-bold hover:underline"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-gray-600">
                  Pagamento via <strong>{paymentMethod}</strong> cadastrado. Em caso de dúvidas, entre em contato com o personal trainer.
                </div>
              )}
            </div>`;

const newFinanceiroTab = `{activeTab === 'financeiro' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#071D49]">Financeiro & Contrato</h2>
            
            {/* Box Pagamento Detalhado */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensalidade Vigente</span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Vence em 10 dias
                </span>
              </div>
              
              <div className="flex items-end justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Valor da Parcela</p>
                  <span className="text-4xl font-black text-[#071D49] tracking-tight">R$ 600,00</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Método</p>
                  <span className="text-sm font-black text-[#071D49] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">{paymentMethod}</span>
                </div>
              </div>

              {paymentMethod === 'PIX' ? (
                <div className="bg-[#071D49] p-5 rounded-xl border border-[#0A2663] space-y-3 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF] opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-bold text-blue-200 block uppercase tracking-wider">Chave PIX (E-mail)</span>
                    <span className="text-[10px] text-white/50">C6 Bank</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg border border-white/20 text-sm font-mono text-white relative z-10 backdrop-blur-sm">
                    <span>contato@benaibernardo.com.br</span>
                    <button 
                      onClick={() => alert('Chave PIX copiada para a área de transferência!')}
                      className="bg-[#00AEEF] text-[#071D49] px-3 py-1.5 rounded-md font-bold text-xs hover:bg-[#0090C5] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-gray-600">
                  Pagamento via <strong>{paymentMethod}</strong> cadastrado. Em caso de dúvidas, entre em contato com o personal trainer.
                </div>
              )}
            </div>`;

code = code.replace(oldFinanceiroTab, newFinanceiroTab);
fs.writeFileSync('src/components/StudentPortal.tsx', code);
