import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <label className={`block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ${className}`}>
    {children}
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const isEmpty = !props.value;
  return (
    <input
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all print:bg-transparent print:border-none print:p-0 print:text-gray-900 ${isEmpty ? 'print:hidden' : ''} ${props.className || ''}`}
    />
  );
};

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const isEmpty = !props.value;
  return (
    <textarea
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all min-h-[80px] print:bg-transparent print:border-none print:p-0 print:text-gray-900 print:min-h-0 print:resize-none overflow-hidden ${isEmpty ? 'print:hidden' : ''} ${props.className || ''}`}
    />
  );
};

export const SectionTitle = ({ children, icon: Icon, colorClass = 'text-[#071D49]' }: { children: React.ReactNode; icon?: any; colorClass?: string }) => (
  <h2 className={`text-lg font-bold flex items-center gap-2 mb-4 ${colorClass}`}>
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </h2>
);
