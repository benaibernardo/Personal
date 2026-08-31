const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

const target = "import { ArrowLeft, FileText, Calendar, CreditCard, ChevronRight, Download, Activity, CheckCircle2, Clock, MapPin, DollarSign, ShieldCheck } from 'lucide-react';";
const replacement = "import { ArrowLeft, FileText, Calendar, CreditCard, ChevronRight, Download, Activity, CheckCircle2, Clock, MapPin, DollarSign, ShieldCheck, Trash2 } from 'lucide-react';";

code = code.replace(target, replacement);

fs.writeFileSync('src/components/StudentPortal.tsx', code);
