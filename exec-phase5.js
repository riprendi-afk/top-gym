const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] AVVIO FASE 5: COLLAUDO FINALE & TREE-SHAKING ===\n");

// 1. Scansione referenze e rimozione sicura file orfani
function isFileImported(filename, excludeFiles = []) {
  const targetBase = path.basename(filename, path.extname(filename));
  const dirs = ['app', 'components', 'lib'];
  let foundIn = [];

  function checkDir(d) {
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
      const full = path.join(d, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.next') {
        checkDir(full);
      } else if (/\.(ts|tsx)$/.test(e.name)) {
        if (excludeFiles.includes(full)) return;
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes(targetBase)) {
          foundIn.push(full);
        }
      }
    });
  }

  dirs.forEach(checkDir);
  return foundIn;
}

// 1.1 Over40QuickModal
const over40Comp = path.join(process.cwd(), 'components', 'Over40QuickModal.tsx');
if (fs.existsSync(over40Comp)) {
  const importedIn = isFileImported(over40Comp, [over40Comp]);
  if (importedIn.length === 0) {
    fs.unlinkSync(over40Comp);
    console.log("[OK] Rimosso file orfano: components/Over40QuickModal.tsx");
  } else {
    console.log(`[INFO] Over40QuickModal referenziato in: ${importedIn.map(f => path.relative(process.cwd(), f)).join(', ')}`);
  }
}

// 1.2 WorkoutWizardModal
const wizardComp = path.join(process.cwd(), 'components', 'WorkoutWizardModal.tsx');
if (fs.existsSync(wizardComp)) {
  const importedIn = isFileImported(wizardComp, [wizardComp]);
  if (importedIn.length === 0) {
    fs.unlinkSync(wizardComp);
    console.log("[OK] Rimosso file orfano: components/WorkoutWizardModal.tsx");
  } else {
    console.log(`[INFO] WorkoutWizardModal referenziato in: ${importedIn.map(f => path.relative(process.cwd(), f)).join(', ')}`);
  }
}

// 2. Bonifica dead code e commenti residui in app/page.tsx
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

pageCode = pageCode.replace(/\/\/ over40 modal removed\r?\n?/g, '');
pageCode = pageCode.replace(/\/\/ wizard modal removed\r?\n?/g, '');
pageCode = pageCode.replace(/import\s+Over40QuickModal\s+from\s+['"][^'"]+['"];?\r?\n?/g, '');
pageCode = pageCode.replace(/import\s+WorkoutWizardModal\s+from\s+['"][^'"]+['"];?\r?\n?/g, '');

fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("[OK] Bonifica dead code su app/page.tsx completata.");

// 3. Verifica Build Finale di Produzione
console.log("\n--> Avvio build di produzione Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD DI PRODUZIONE SUPERATA CON SUCCESSO (0 ERRORI)!");

  console.log("--> Esecuzione Git commit e push conclusivo...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "chore(coach): complete phase 5 tree-shaking, dead code elimination and production validation"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== REFACTORING LATO COACH COMPLETATO AL 100% SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Riscontrato errore durante il build finale.");
  process.exit(1);
}
