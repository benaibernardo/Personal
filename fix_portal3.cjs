const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const target = `                        </div>
                      <button 
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja apagar este registro do histórico?')) {`;

const newCode = `                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja apagar este registro do histórico?')) {`;

code = code.replace(target, newCode);
fs.writeFileSync('src/components/StudentPortal.tsx', code);
