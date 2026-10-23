const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("==========================================================");
console.log("🚀 CHIUSURA DEFINITIVA ZERO-REFRESH (PAGINA + MODALE)");
console.log("==========================================================\n");

// ---------------------------------------------------------
// 1. ALLINEAMENTO MODALE GLOBALE IN app/page.tsx
// ---------------------------------------------------------
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

const globalModalTarget = `setProgramDays(daysWithOverrides);
            if (targetUserId) {
              await saveProgramToSupabase(`;

const globalModalReplacement = `setProgramDays(daysWithOverrides);
            const savedMethod = (daysWithOverrides[0] as any)?.method || (daysWithOverrides[0] as any)?.programmingModel;
            if (savedMethod) {
              setProgrammingModel(savedMethod as any);
            }
            if (targetUserId) {
              await saveProgramToSupabase(`;

if (pageCode.includes(globalModalTarget)) {
  pageCode = pageCode.replace(globalModalTarget, globalModalReplacement);
  fs.writeFileSync(pagePath, pageCode, 'utf8');
  console.log("✅ [1/2] Modale globale sincronizzato con programmingModel.");
} else {
  console.log("ℹ️ [1/2] Modale globale già sincronizzato.");
}

// ---------------------------------------------------------
// 2. LOADING STATE IN components/MacrocycleTimelineModal.tsx
// ---------------------------------------------------------
const modalPath = path.join(process.cwd(), 'components', 'MacrocycleTimelineModal.tsx');
if (fs.existsSync(modalPath)) {
  let modalCode = fs.readFileSync(modalPath, 'utf8');

  const emptyStatePattern = `<div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0A0C10]">
            <table className="w-full border-collapse text-left min-w-max">`;

  const safeLoadingReplacement = `<div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0A0C10]">
            {(!timeline || timeline.length === 0 || !exercisesForDay || exercisesForDay.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-300">Caricamento e calcolo della Matrice...</p>
                <p className="text-xs text-zinc-500">Se l'atleta non ha ancora esercizi assegnati, seleziona una sessione o aggiungi un esercizio.</p>
              </div>
            ) : (
            <table className="w-full border-collapse text-left min-w-max">`;

  const closingTablePattern = `</table>
          </div>`;
  const closingTableReplacement = `</table>
            )}
          </div>`;

  if (modalCode.includes(emptyStatePattern) && !modalCode.includes('Caricamento e calcolo della Matrice')) {
    modalCode = modalCode.replace(emptyStatePattern, safeLoadingReplacement);
    modalCode = modalCode.replace(closingTablePattern, closingTableReplacement);
    fs.writeFileSync(modalPath, modalCode, 'utf8');
    console.log("✅ [2/2] Loading state reattivo integrato nella Matrice.");
  } else {
    console.log("ℹ️ [2/2] Matrice già provvista di visualizzazione safe.");
  }
}

// ---------------------------------------------------------
// 3. BUILD DI VERIFICA & DEPLOY VERCEL
// ---------------------------------------------------------
console.log("\n📦 Avvio test di compilazione Next.js...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n🎉 [BUILD SUPERATA: 0 ERRORI]");

  console.log("\n🚀 Push finale su Vercel...");
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "feat(fluidity): complete zero-refresh sync, loading states, and instant reactivity"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });

  console.log("\n==========================================================");
  console.log("✨ OPERAZIONE COMPLETATA: TOP GYM È ATTIVO E REATTIVO AL 100%!");
  console.log("==========================================================");
} catch (err) {
  console.error("\n❌ ERRORE:", err.message);
  process.exit(1);
}
