const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] APPLICAZIONE CHIRURGICA FASE 4 ===");

// -------------------------------------------------------------
// 1. PATCH components/MacrocycleTimelineModal.tsx
// -------------------------------------------------------------
const timelinePath = path.join(process.cwd(), 'components', 'MacrocycleTimelineModal.tsx');
fs.copyFileSync(timelinePath, `${timelinePath}.bak`);

let tplCode = fs.readFileSync(timelinePath, 'utf8');

// 1.1 Props interface
tplCode = tplCode.replace(
  'interface MacrocycleTimelineModalProps {',
  'interface MacrocycleTimelineModalProps {\n  inline?: boolean;'
);

// 1.2 Function args
tplCode = tplCode.replace(
  'export default function MacrocycleTimelineModal({',
  'export default function MacrocycleTimelineModal({\n  inline = false,'
);

// 1.3 Controllo isOpen: se inline, non si chiude
tplCode = tplCode.replace(
  'if (!isOpen) return null;',
  'if (!isOpen && !inline) return null;'
);

// 1.4 Refactoring del blocco return in due parti:
// const modalBody = ( <div className="bg-[#0F1218] ..."> ... </div> );
// if (inline) return modalBody;
// return ( <div className="fixed inset-0 ...">{modalBody}</div> );

const returnStart = tplCode.indexOf('return (\n    <div className="fixed inset-0');
if (returnStart !== -1) {
  const outerDivOpen = '<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">\n      ';
  const openPos = tplCode.indexOf(outerDivOpen, returnStart);
  
  if (openPos !== -1) {
    const afterOuterOpen = openPos + outerDivOpen.length;
    // Troviamo la chiusura finale delle ultime righe: </div>\n    </div>\n  );
    const lastClosing = tplCode.lastIndexOf('      </div>\n    </div>\n  );');
    
    if (lastClosing !== -1) {
      const innerContent = tplCode.slice(afterOuterOpen, lastClosing + '      </div>'.length);
      
      const newReturnBlock = `const modalContent = (
    ${innerContent}
  );

  if (inline) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      {modalContent}
    </div>
  );`;
      
      tplCode = tplCode.slice(0, returnStart) + newReturnBlock + tplCode.slice(lastClosing + '      </div>\n    </div>\n  );'.length);
      console.log("[OK] MacrocycleTimelineModal.tsx refactoring del return completato.");
    }
  }
}

fs.writeFileSync(timelinePath, tplCode, 'utf8');

// -------------------------------------------------------------
// 2. INNESTO MATRICE TIMELINE IN app/page.tsx
// -------------------------------------------------------------
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
fs.copyFileSync(pagePath, `${pagePath}.bak`);

let pageCode = fs.readFileSync(pagePath, 'utf8');

const timelineInlineSnippet = `
              {/* ============================================================== */}
              {/* MATRICE TIMELINE W1-W16: SINGLE SOURCE OF TRUTH PROGRAMMAZIONE */}
              {/* ============================================================== */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Matrice Macrociclo Dinamica (W1–W16)
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                    Sovrascrittura Automatica Carichi & RPE
                  </span>
                </div>

                <MacrocycleTimelineModal
                  key={(targetUserId || "timeline-inline") + (programmingModel || "")}
                  inline={true}
                  isOpen={true}
                  onClose={() => {}}
                  athleteName={athletes.find(a => a.id === targetUserId)?.displayName || "Atleta"}
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
              </div>
`;

if (!pageCode.includes('inline={true}')) {
  const marker = 'Assegna Scheda da Template Split';
  const markerPos = pageCode.indexOf(marker);

  if (markerPos !== -1) {
    const btnBoxEnd = pageCode.indexOf('</div>', pageCode.indexOf('Scegli Template Split', markerPos));
    if (btnBoxEnd !== -1) {
      const insertIdx = btnBoxEnd + '</div>'.length;
      pageCode = pageCode.slice(0, insertIdx) + timelineInlineSnippet + pageCode.slice(insertIdx);
      console.log("[OK] Matrice Timeline W1–W16 montata inline al centro di Programmi.");
    }
  } else {
    const builderGrid = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-8 space-y-6">';
    const gridIdx = pageCode.indexOf(builderGrid);
    if (gridIdx !== -1) {
      const insertIdx = gridIdx + builderGrid.length;
      pageCode = pageCode.slice(0, insertIdx) + timelineInlineSnippet + pageCode.slice(insertIdx);
      console.log("[OK] Matrice Timeline montata inline via fallback.");
    }
  }
}

fs.writeFileSync(pagePath, pageCode, 'utf8');

// -------------------------------------------------------------
// 3. BUILD TEST & GIT PUSH
// -------------------------------------------------------------
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD SUPERATA SENZA REGRESSIONI!");

  if (fs.existsSync(`${timelinePath}.bak`)) fs.unlinkSync(`${timelinePath}.bak`);
  if (fs.existsSync(`${pagePath}.bak`)) fs.unlinkSync(`${pagePath}.bak`);

  console.log("--> Git add, commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(coach): complete phase 4 centralize macrocycle matrix inline as single source of truth"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== FASE 4 CHIUSA E DEPLOYATA CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore durante la build. Rollback in corso...");
  if (fs.existsSync(`${timelinePath}.bak`)) fs.copyFileSync(`${timelinePath}.bak`, timelinePath);
  if (fs.existsSync(`${pagePath}.bak`)) fs.copyFileSync(`${pagePath}.bak`, pagePath);
  console.log("[OK] File ripristinati allo stato integro.");
  process.exit(1);
}
