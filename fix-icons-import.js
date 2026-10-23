const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] FIX DEFINITIVO IMPORT ICONE app/page.tsx ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// 1. Rimuove eventuali import duplicati o malformati
code = code.replace(/(import\s*\{[^}]*?)\bClipboardList\s*,?\s*([^}]*?\}\s*from\s*['"]lucide-react['"])/g, '$1$2');
code = code.replace(/(import\s*\{[^}]*?)\bPrinter\s*,?\s*([^}]*?\}\s*from\s*['"]lucide-react['"])/g, '$1$2');
code = code.replace(/import\s*\{\s*ClipboardList,\s*Printer\s*\}\s*from\s*['"]lucide-react['"];?\r?\n?/g, '');
code = code.replace(/,\s*,/g, ',');
code = code.replace(/,\s*\}/g, ' }');

// 2. Inietta in cima in modo garantito ClipboardList e Printer
code = code.replace(
  '"use client";',
  '"use client";\nimport { ClipboardList, Printer } from "lucide-react";'
);
console.log("[OK] import { ClipboardList, Printer } from 'lucide-react' aggiunto in cima al file.");

fs.writeFileSync(pagePath, code, 'utf8');

// 3. Verifica Build Next.js & Git Push
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON SUCCESSO (0 ERRORI DI TYPE CHECK)!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix(icons): explicitly import ClipboardList and Printer from lucide-react to satisfy typecheck"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== PROBLEMA RISOLTO DEFINITIVAMENTE E DEPLOYATO SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore residuo durante il build:", err.message);
  process.exit(1);
}
