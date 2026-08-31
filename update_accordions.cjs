const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace onInput with a ref callback that auto-resizes on mount too.
// The current onInput looks like: onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}
const oldOnInput = 'onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}';
const newRef = 'ref={(el) => { if(el){ el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }} onInput={(e) => { e.currentTarget.style.height = "auto"; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"; }}';

code = code.replace(new RegExp(oldOnInput.replace(/[.*+?^$\/{}()|[\\]\\]/g, '\\$&'), 'g'), newRef);

fs.writeFileSync('src/App.tsx', code);
