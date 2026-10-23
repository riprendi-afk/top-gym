const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== BONIFICA DEAD CODE & ELIMINAZIONE COMPONENTI ORFANI ===");

// 1. PULIZIA app/page.tsx
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
if (!fs.existsSync(pagePath)) {
  console.error("app/page.tsx non trovato!");
  process.exit(1);
}

let pageCode = fs.readFileSync(pagePath, 'utf8');

// Rimozione import autoAdvanceTopGymEngine
pageCode = pageCode.replace(/import\s*\{\s*autoAdvanceTopGymEngine\s*\}\s*from\s*["']@\/lib\/topgym-auto-advance["'];?\r?\n?/, '');

// Rimozione dynamic imports delle 4 cabine
pageCode = pageCode.replace(/const\s+AcetoCabina\s*=\s*dynamic\([^;]+;\r?\n?/, '');
pageCode = pageCode.replace(/const\s+NocerinoCabina\s*=\s*dynamic\([^;]+;\r?\n?/, '');
pageCode = pageCode.replace(/const\s+HardTopGymCabina\s*=\s*dynamic\([^;]+;\r?\n?/, '');
pageCode = pageCode.replace(/const\s+TopGymClassicCabina\s*=\s*dynamic\([^;]+;\r?\n?/, '');

fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("[OK] Import non utilizzati rimossi da app/page.tsx.");

// 2. RIMOZIONE FILE ORFANI
const filesToDelete = [
  path.join(process.cwd(), 'components', 'AcetoCabina.tsx'),
  path.join(process.cwd(), 'components', 'HardTopGymCabina.tsx'),
  path.join(process.cwd(), 'components', 'NocerinoCabina.tsx'),
  path.join(process.cwd(), 'components', 'TopGymClassicCabina.tsx'),
  path.join(process.cwd(), 'lib', 'topgym-auto-advance.ts')
];

filesToDelete.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[ELIMINATO] ${path.relative(process.cwd(), filePath)}`);
  } else {
    console.log(`[NON PRESENTE] ${path.relative(process.cwd(), filePath)}`);
  }
});

// 3. TEST DI COMPILAZIONE (npm run build)
console.log("\n--> Verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON 0 ERRORI!");

  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "refactor(cleanup): remove legacy cabina components and unused autoAdvance logic"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== BONIFICA COMPLETATA E DEPLOYATA CON SUCCESSO SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
