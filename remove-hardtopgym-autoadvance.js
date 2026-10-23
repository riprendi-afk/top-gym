const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] RIMOZIONE DEFINITIVA HARDTOPGYM & AUTO-AVANZAMENTO ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// ---------------------------------------------------------------------
// 1. RIMOZIONE BANNER "HARDTOPGYM SET 1" E "TOPGYM CLASSICO" IN WORKOUT
// ---------------------------------------------------------------------
// 1.1 Rimuove il banner HARDTOPGYM
code = code.replace(
  /{\/\*\s*BANNER PROMEMORIA FASE & SETTIMANA ATLETA[\s\S]*?\{trainingMethod === "HARDTOPGYM"[\s\S]*?<\/div>\s*\)\}/g,
  ''
);
code = code.replace(
  /\{trainingMethod === "HARDTOPGYM"[\s\S]*?<\/div>\s*\)\}/g,
  ''
);

// 1.2 Rimuove il banner TOPGYM_CLASSICO
code = code.replace(
  /{\/\*\s*BANNER METODO TOPGYM - VISIBILE SOLO SE ATTIVO IL BLOCCO CLASSICO\s*\*\/}\s*\{trainingMethod === "TOPGYM_CLASSICO"[\s\S]*?<\/div>\s*\)\}/g,
  ''
);
code = code.replace(
  /\{trainingMethod === "TOPGYM_CLASSICO"[\s\S]*?<\/div>\s*\)\}/g,
  ''
);
console.log("[OK] Banner dinamici (HardTopGym Set 1 / TopGym Classico) rimossi da Esegui Allenamento.");

// ---------------------------------------------------------------------
// 2. DISATTIVAZIONE FLAG E MOTORE DINAMICO (100% STATICO)
// ---------------------------------------------------------------------
code = code.replace(
  /const isMasterProgram = [^;]+;/,
  'const isMasterProgram = false;'
);

code = code.replace(
  /const dynamicActiveDay = useMemo\(\(\) => \{[\s\S]*?\}, \[\s*activeDay,[\s\S]*?\]\);/,
  'const dynamicActiveDay = activeDay;'
);
console.log("[OK] isMasterProgram forzato a false e dynamicActiveDay reso statico.");

// ---------------------------------------------------------------------
// 3. PULIZIA TOTALE DI QUALSIASI RESIDUO DI AUTO-AVANZAMENTO IN SALVATAGGIO
// ---------------------------------------------------------------------
// Troviamo il blocco in handleFinishAndSaveWorkout
const saveBlockStart = code.indexOf('if (result?.success) {');
const saveBlockEnd = code.indexOf('await loadHistory(targetUserId);', saveBlockStart);

if (saveBlockStart !== -1 && saveBlockEnd !== -1) {
  const cleanSuccessHandler = `if (result?.success) {
      await addXp(50);
      setLogs([]);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(\`topgym_session_logs_\${targetUserId || "athlete"}\`);
        } catch {}
      }

      // NESSUN AUTO-AVANZAMENTO: La scheda e i carichi rimangono rigorosamente invariati
      setWorkoutSuccessMessage("🎉 Allenamento completato e registrato con successo nello storico! (+50 XP)");

      `;
  code = code.slice(0, saveBlockStart) + cleanSuccessHandler + code.slice(saveBlockEnd);
  console.log("[OK] Qualsiasi ricalcolo o avanzamento automatico a fine seduta è stato rimosso.");
}

// ---------------------------------------------------------------------
// 4. PASSA isMasterProgram={false} ESPLICITO A EXERCISECARD
// ---------------------------------------------------------------------
code = code.replace(
  /isMasterProgram=\{isMasterProgram\}/g,
  'isMasterProgram={false}'
);

fs.writeFileSync(pagePath, code, 'utf8');
console.log("[OK] File app/page.tsx ripulito e salvato.");

// ---------------------------------------------------------------------
// 5. TEST BUILD & GIT PUSH
// ---------------------------------------------------------------------
console.log("\n--> Avvio verifica build (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON SUCCESSO (0 ERRORI)!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix(workout): completely remove hardtopgym banner and eliminate all week auto-advance logic"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== MODIFICA COMPLETATA E DEPLOYATA SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore riscontrato durante il build:", err.message);
  process.exit(1);
}
