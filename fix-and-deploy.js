const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== RISOLUZIONE FINALE ERRORE TS2304 & BUILD ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let lines = fs.readFileSync(pagePath, 'utf8').split('\n');

// 1. Rimuoviamo la riga fuori contesto dentro handleFinishWorkout (prima di riga 1720)
let removed = 0;
lines = lines.filter((line, idx) => {
  if (line.includes('setProgramDays(programDaysToSave') && idx < 1720) {
    console.log(`[RIMOZIONE] Trovato setProgramDays(programDaysToSave) fuori contesto a riga ${idx + 1}`);
    removed++;
    return false;
  }
  if (line.includes('[ZERO REFRESH] Aggiornamento reattivo immediato') && idx < 1720) {
    console.log(`[RIMOZIONE] Trovato commento orfano a riga ${idx + 1}`);
    return false;
  }
  return true;
});

console.log(`Righe rimosse con successo: ${removed}`);

// Salviamo il file pulito
fs.writeFileSync(pagePath, lines.join('\n'), 'utf8');

// 2. Verifica build & deploy
console.log("\n--> Avvio test di compilazione (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n🎉 [SUCCESS] BUILD COMPLETATA CON 0 ERRORI TYPESCRIPT!");

  console.log("\n--> Commit e Push su Vercel in corso...");
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "fix(fluidity): remove out-of-scope programDaysToSave in handleFinishWorkout and deploy zero-refresh"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== DEPLOY SU VERCEL COMPLETATO CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
