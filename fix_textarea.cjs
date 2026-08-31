const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const textareaComp = `
const AutoResizeTextarea = ({ value, onChange, placeholder, className }: any) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={1}
      onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
    />
  );
};
`;

// Insert after imports
code = code.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';" + textareaComp);

code = code.replace(/<textarea\s+value=\{data\.triggers \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ triggers: e\.target\.value \}\)\}\s+placeholder="Ex: Aluno com TEA \(usar comandos diretos\)\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-\[40px\] overflow-hidden resize-none" ref=\{\(el\) => \{ if\(el\)\{ el\.style\.height = "auto"; el\.style\.height = el\.scrollHeight \+ "px"; \} \}\} onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.triggers || ''} onChange={(e: any) => updateData({ triggers: e.target.value })} placeholder="Ex: Aluno com TEA (usar comandos diretos)..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" />`);

code = code.replace(/<textarea\s+value=\{data\.health_restrictions \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ health_restrictions: e\.target\.value \}\)\}\s+placeholder="Ex: Condromalácia patelar grau 2\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-\[40px\] overflow-hidden resize-none" ref=\{\(el\) => \{ if\(el\)\{ el\.style\.height = "auto"; el\.style\.height = el\.scrollHeight \+ "px"; \} \}\} onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.health_restrictions || ''} onChange={(e: any) => updateData({ health_restrictions: e.target.value })} placeholder="Ex: Condromalácia patelar grau 2..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />`);

code = code.replace(/<textarea\s+value=\{data\.general_notes \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ general_notes: e\.target\.value \}\)\}\s+placeholder="Ex: Gosta de treinar perna pesado, tem viagem em Agosto\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-\[40px\] overflow-hidden resize-none" ref=\{\(el\) => \{ if\(el\)\{ el\.style\.height = "auto"; el\.style\.height = el\.scrollHeight \+ "px"; \} \}\} onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.general_notes || ''} onChange={(e: any) => updateData({ general_notes: e.target.value })} placeholder="Ex: Gosta de treinar perna pesado, tem viagem em Agosto..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[40px] overflow-hidden resize-none" />`);

// For any non-replaced that had the original onInput (just in case)
code = code.replace(/<textarea\s+value=\{data\.triggers \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ triggers: e\.target\.value \}\)\}\s+placeholder="Ex: Aluno com TEA \(usar comandos diretos\)\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-\[40px\] overflow-hidden resize-none" onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.triggers || ''} onChange={(e: any) => updateData({ triggers: e.target.value })} placeholder="Ex: Aluno com TEA (usar comandos diretos)..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[40px] overflow-hidden resize-none" />`);

code = code.replace(/<textarea\s+value=\{data\.health_restrictions \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ health_restrictions: e\.target\.value \}\)\}\s+placeholder="Ex: Condromalácia patelar grau 2\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-\[40px\] overflow-hidden resize-none" onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.health_restrictions || ''} onChange={(e: any) => updateData({ health_restrictions: e.target.value })} placeholder="Ex: Condromalácia patelar grau 2..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[40px] overflow-hidden resize-none" />`);

code = code.replace(/<textarea\s+value=\{data\.general_notes \|\| ''\}\s+onChange=\{\(e\) => updateData\(\{ general_notes: e\.target\.value \}\)\}\s+placeholder="Ex: Gosta de treinar perna pesado, tem viagem em Agosto\.\.\."\s+className="w-full bg-white\/70 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-\[40px\] overflow-hidden resize-none" onInput=\{\(e\) => \{ e\.currentTarget\.style\.height = "auto"; e\.currentTarget\.style\.height = e\.currentTarget\.scrollHeight \+ "px"; \}\}\s+\/>/g, `<AutoResizeTextarea value={data.general_notes || ''} onChange={(e: any) => updateData({ general_notes: e.target.value })} placeholder="Ex: Gosta de treinar perna pesado, tem viagem em Agosto..." className="w-full bg-white/70 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[40px] overflow-hidden resize-none" />`);

fs.writeFileSync('src/App.tsx', code);
