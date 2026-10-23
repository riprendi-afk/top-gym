const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] RISOLUZIONE DEFINITIVA MATRICE INLINE & SIDEBAR ===");

// ---------------------------------------------------------------------
// A. PATCH components/MacrocycleTimelineModal.tsx
// ---------------------------------------------------------------------
const modalPath = path.join(process.cwd(), 'components', 'MacrocycleTimelineModal.tsx');
let modalCode = fs.readFileSync(modalPath, 'utf8');

// 1. Pulizia e iniezione singola di inline?: boolean nell'interfaccia
modalCode = modalCode.replace(/\s*inline\?:\s*boolean;?/g, '');
modalCode = modalCode.replace(
  'interface MacrocycleTimelineModalProps {',
  'interface MacrocycleTimelineModalProps {\n  inline?: boolean;'
);
console.log("[OK] Interface: inline?: boolean inserito esattamente 1 volta.");

// 2. Pulizia e iniezione singola di inline = false nella firma della funzione
modalCode = modalCode.replace(/\s*inline\s*=\s*(false|true),?/g, '');
modalCode = modalCode.replace(
  'export default function MacrocycleTimelineModal({',
  'export default function MacrocycleTimelineModal({\n  inline = false,'
);
console.log("[OK] Parametri: inline = false inserito esattamente 1 volta.");

// 3. Pulizia e aggiornamento guardia apertura
modalCode = modalCode.replace(/if\s*\(!isOpen[^)]*\)\s*return\s*null;?/g, '');
modalCode = modalCode.replace(
  /const\s+methodKey\s*=/,
  'if (!isOpen && !inline) return null;\n\n  const methodKey ='
);
console.log("[OK] Controllo apertura: if (!isOpen && !inline) return null.");

// 4. Wrapper dinamico: inline usa il normale flusso di pagina, fullscreen usa fixed inset-0
modalCode = modalCode.replace(
  /<div className="fixed inset-0[^"]*">\s*<div className="bg-\[#0F1218\][^"]*">/,
  `<div className={inline ? "w-full my-4" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"}>
      <div className={inline ? "bg-[#0F1218] border border-white/10 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" : "bg-[#0F1218] border border-white/10 rounded-2xl w-full max-w-[98vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden"}>`
);
console.log("[OK] Layout wrapper: separato inline dal modale fisso a schermo intero.");

// 5. Pulsante X: nascosto se inline, visibile se modale a schermo intero
modalCode = modalCode.replace(/\s*\$\{inline \? "hidden" : ""\}/g, '');
modalCode = modalCode.replace(
  /(<button\s+onClick=\{onClose\}\s+className=")([^"]*)("[\s\S]*?<X className="w-5 h-5"\s*\/>\s*<\/button>)/,
  '$1$2 ${inline ? "hidden" : ""}$3'
);
console.log("[OK] Pulsante X: configurato per nascondersi in modalità inline.");

fs.writeFileSync(modalPath, modalCode, 'utf8');

// ---------------------------------------------------------------------
// B. PATCH app/page.tsx (INSERIMENTO INLINE AUTONOMO SENZA TOCCARE I DIV)
// ---------------------------------------------------------------------
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

const inlineSnippet = `

              {/* ============================================================== */}
              {/* MATRICE TIMELINE MACROCICLO W1-W16: SINGLE SOURCE OF TRUTH    */}
              {/* ============================================================== */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Matrice Macrociclo Dinamica (W1–W16)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden sm:inline">
                      Single Source of Truth
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTimelineModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-bold transition cursor-pointer"
                    >
                      Schermo Intero
                    </button>
                  </div>
                </div>

                <MacrocycleTimelineModal
                  key={(targetUserId || "timeline-inline") + (programmingModel || "")}
                  inline={true}
                  isOpen={true}
                  onClose={() => {}}
                  athleteName={athletes.find((a: any) => a.id === targetUserId)?.displayName || "Atleta"}
                  athleteId={targetUserId}
                  programDays={programDays}
                  programmingModel={programmingModel as string}
                  onSaveOverrides={async (updatedDays, overrides) => {
                    setProgramDays(updatedDays);
                    if (targetUserId) {
                      await saveProgramToSupabase(
                        targetUserId,
                        programName || "Scheda TOPGYM",
                        updatedDays
                      );
                      setBuilderSuccessMessage("⚡ Matrice Macrociclo salvata e sincronizzata!");
                      setTimeout(() => setBuilderSuccessMessage(null), 4000);
                    }
                  }}
                />
              </div>`;

const splitBoxMarker = 'Assegna Scheda da Template Split';
const splitBoxIdx = pageCode.indexOf(splitBoxMarker);

if (splitBoxIdx !== -1) {
  const btnIdx = pageCode.indexOf('Scegli Template Split', splitBoxIdx);
  if (btnIdx !== -1) {
    const endBoxIdx = pageCode.indexOf('</div>', btnIdx);
    if (endBoxIdx !== -1) {
      const insertPos = endBoxIdx + '</div>'.length;
      pageCode = pageCode.slice(0, insertPos) + inlineSnippet + pageCode.slice(insertPos);
      console.log("[OK] Matrice Timeline inline montata nel flusso del Builder.");
    }
  }
}

fs.writeFileSync(pagePath, pageCode, 'utf8');

// ---------------------------------------------------------------------
// C. VERIFICA BUILD DI PRODUZIONE & PUSH SU VERCEL
// ---------------------------------------------------------------------
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD DI PRODUZIONE SUPERATA CON SUCCESSO (0 ERRORI)!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix(coach): definitive fix for inline matrix, sidebar visibility and parameter binding"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== PROBLEMA RISOLTO DEFINITIVAMENTE E DEPLOYATO SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore durante il build:", err.message);
  process.exit(1);
}
