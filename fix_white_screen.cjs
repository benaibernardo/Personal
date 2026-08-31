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

if (!code.includes('const AutoResizeTextarea =')) {
  code = code.replace("const STORAGE_KEY = 'benai_consultoria_workout_data_v1';", textareaComp + "\nconst STORAGE_KEY = 'benai_consultoria_workout_data_v1';");
  fs.writeFileSync('src/App.tsx', code);
}
