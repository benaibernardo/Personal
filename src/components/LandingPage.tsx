import React from 'react';
import { ChevronRight, ArrowRight, ShieldCheck, Activity, Users, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  onAccessDashboard: () => void;
}

export const LandingPage: React.FC<Props> = ({ onAccessDashboard }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Navigation */}
      <nav className="bg-[#071D49] text-white py-4 px-6 fixed w-full top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#00AEEF] text-[#071D49] font-black px-2 py-1 rounded-md text-xs tracking-tight">BB</div>
            <span className="font-bold tracking-wide">Benai Bernardo</span>
          </div>
          <button 
            onClick={onAccessDashboard}
            className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] hover:text-white transition-colors"
          >
            Acesso Restrito
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-[#071D49] text-white rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00AEEF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#00AEEF] text-xs font-bold uppercase tracking-widest mb-6">
            Consultoria Presencial Premium
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Treinamento <span className="text-[#00AEEF]">Personalizado</span> de Alto Padrão em Curitiba.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Resultados reais exigem método, diagnóstico biomecânico e acompanhamento de excelência. Atendimento exclusivo em condomínios nas regiões de Água Verde e Portão.
          </p>
          <a 
            href="#planos"
            className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#0090C5] text-white font-black py-4 px-8 rounded-xl shadow-lg transform transition-transform hover:scale-105"
          >
            Quero Agendar uma Avaliação <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#071D49] mb-4">Por que o meu método é diferente?</h2>
          <p className="text-gray-500 font-medium">Não vendo horas de treino, entrego um diagnóstico completo da sua saúde e performance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#071D49] mb-3">Diagnóstico Biomecânico</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Mapeamento de restrições de mobilidade e dores antes do primeiro peso ser levantado, garantindo longevidade e segurança total.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#00AEEF]/10 text-[#00AEEF] rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#071D49] mb-3">Metodologia em 4 Fases</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Toda sessão passa por Mobilidade, Ativação Neural, Força Estrutural e Desaceleração, otimizando seu tempo e recuperação.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#071D49] mb-3">Atendimento Exclusivo</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Limitação rigorosa de alunos para garantir acompanhamento cirúrgico. Uso de aplicativo próprio para monitoramento de fadiga em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#071D49] mb-4">Investimento</h2>
            <p className="text-gray-500 font-medium">Vagas restritas para garantir a qualidade do acompanhamento.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-8 rounded-3xl relative">
              <h3 className="text-2xl font-bold text-[#071D49] mb-2">Mensal</h3>
              <p className="text-gray-500 text-sm mb-6">Acompanhamento contínuo e flexível.</p>
              <div className="text-4xl font-black text-[#00AEEF] mb-6">R$ 800<span className="text-lg text-gray-400 font-medium">/mês</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 2 a 3 sessões semanais</li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Avaliação biomecânica inicial</li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Atendimento na sua residência ou condomínio</li>
              </ul>
              <a 
                href="https://wa.me/5541999999999?text=Olá, tenho interesse no Plano Mensal presencial."
                target="_blank"
                rel="noreferrer"
                className="block w-full py-4 text-center rounded-xl font-bold text-[#071D49] bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Solicitar Vaga
              </a>
            </div>

            <div className="border-2 border-[#00AEEF] p-8 rounded-3xl relative shadow-xl transform md:-translate-y-4 bg-white">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#00AEEF] text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Mais Recomendado
              </div>
              <h3 className="text-2xl font-bold text-[#071D49] mb-2">Trimestral</h3>
              <p className="text-gray-500 text-sm mb-6">Comprometimento com resultados sólidos.</p>
              <div className="text-4xl font-black text-[#00AEEF] mb-6">R$ 700<span className="text-lg text-gray-400 font-medium">/mês</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 2 a 3 sessões semanais</li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Avaliações cíclicas de progresso</li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Relatórios de evolução estruturada</li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Planejamento para dias off</li>
              </ul>
              <a 
                href="https://wa.me/5541999999999?text=Olá, tenho interesse no Plano Trimestral presencial."
                target="_blank"
                rel="noreferrer"
                className="block w-full py-4 text-center rounded-xl font-bold text-white bg-[#00AEEF] hover:bg-[#0090C5] transition-colors shadow-md"
              >
                Solicitar Vaga
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-10 text-center border-t border-gray-200">
        <p className="text-gray-400 text-sm font-medium">
          © {new Date().getFullYear()} Benai Bernardo Consultoria. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
