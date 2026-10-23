const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] RIPRISTINO HEAD E APPLICAZIONE PATCH PULITA ===");

// 1. Reset app/page.tsx allo stato HEAD funzionante
execSync('git checkout HEAD -- app/page.tsx', { stdio: 'inherit' });

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// 2. Modifica A: Reintegro TopGymClassicCabina nella tab methodologies
const oldMethodologies = `{/* TAB COACH: METODOLOGIE & LINEE GUIDA */}
          {activeTab === "methodologies" && (
            <MethodologiesGuide />
          )}`;

const newMethodologies = `{/* TAB COACH: METODOLOGIE & LINEE GUIDA */}
          {activeTab === "methodologies" && (
            <div className="space-y-6">
              {/* CABINA DI REGIA PERIODIZZAZIONE TOP GYM CLASSICO */}
              <TopGymClassicCabina
                activeAthlete={activeAthlete}
                currentBlock={currentBlock}
                setCurrentBlock={(b) => setCurrentBlock(b)}
                calculatedCurrentPhase={calculatedCurrentPhase}
                setManualWeek={(w) => setManualWeek(w)}
                getPhaseDescription={(b, w) => getPhaseDescription(b, w)}
                onApplyEngine={handleApplyEngineToCurrentProgram}
                onApplyDeload={handleApplyDeloadWeekToProgram}
                onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
              />

              <TemplatePickerModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                currentBlock={currentBlock}
                athleteName={activeAthlete?.displayName || ""}
                onSelectTemplate={(days, templateName) => {
                  setProgramDays(days as any);
                  setProgramName(templateName);
                  setBuilderSuccessMessage("⚡ Template \\"" + templateName + "\\" caricato!");
                  setTimeout(() => setBuilderSuccessMessage(null), 4000);
                }}
              />

              {/* ENCICLOPEDIA E LINEE GUIDA SCIENTIFICHE */}
              <MethodologiesGuide />
            </div>
          )}`;

if (code.includes(oldMethodologies)) {
  code = code.replace(oldMethodologies, newMethodologies);
  console.log("[OK] TopGymClassicCabina inserita nella sezione Metodologie.");
} else {
  const methMarker = '{activeTab === "methodologies" && (';
  const methIdx = code.indexOf(methMarker);
  if (methIdx !== -1) {
    const endMeth = code.indexOf(')}', methIdx);
    if (endMeth !== -1) {
      code = code.slice(0, methIdx) + newMethodologies.trim() + code.slice(endMeth + 2);
      console.log("[OK] TopGymClassicCabina inserita tramite posizionamento marker.");
    }
  }
}

// 3. Modifica B: onSaveOverrides salva weekOverrides in ogni day per Supabase
const fnInlineStart = code.indexOf('onSaveOverrides={async (updatedDays, overrides) => {');
if (fnInlineStart !== -1) {
  const fnInlineEnd = code.indexOf('}}', fnInlineStart);
  if (fnInlineEnd !== -1) {
    const newSaveInline = `onSaveOverrides={async (updatedDays, overrides) => {
                    const daysWithOverrides = updatedDays.map((d: any) => ({
                      ...d,
                      weekOverrides: overrides || d.weekOverrides || {}
                    }));
                    setProgramDays(daysWithOverrides);
                    if (targetUserId) {
                      await saveProgramToSupabase(
                        targetUserId,
                        programName || "Scheda TOPGYM",
                        daysWithOverrides
                      );
                      setBuilderSuccessMessage("⚡ Matrice Macrociclo salvata e sincronizzata!");
                      setTimeout(() => setBuilderSuccessMessage(null), 4000);
                    }
                  }}`;
    code = code.slice(0, fnInlineStart) + newSaveInline + code.slice(fnInlineEnd + 2);
    console.log("[OK] onSaveOverrides (inline) aggiornato con weekOverrides persistenti.");
  }
}

// Seconda occorrenza (Modale globale a fine file)
const fnModalStart = code.indexOf('onSaveOverrides={async (updatedDays, overrides) => {', fnInlineStart + 100);
if (fnModalStart !== -1) {
  const fnModalEnd = code.indexOf('}}', fnModalStart);
  if (fnModalEnd !== -1) {
    const newSaveModal = `onSaveOverrides={async (updatedDays, overrides) => {
          const daysWithOverrides = updatedDays.map((d: any) => ({
            ...d,
            weekOverrides: overrides || d.weekOverrides || {}
          }));
          setProgramDays(daysWithOverrides);
          if (targetUserId) {
            await saveProgramToSupabase(
              targetUserId,
              programName || "Scheda TOPGYM",
              daysWithOverrides
            );
          }
        }}`;
    code = code.slice(0, fnModalStart) + newSaveModal + code.slice(fnModalEnd + 2);
    console.log("[OK] onSaveOverrides (modal globale) aggiornato con weekOverrides persistenti.");
  }
}

// 4. Modifica C: Visualizza Scheda (binding di plannedReps, plannedWeight, plannedRpe)
if (code.includes('{ex.reps}</b>')) {
  code = code.replace(
    '<b className="text-white text-xs">{ex.reps}</b>',
    '<b className="text-white text-xs">{plannedReps}</b>'
  );
  console.log("[OK] Visualizza Scheda: collegato plannedReps.");
}

if (code.includes('{ex.targetWeight ? `${ex.targetWeight}kg` : "Auto"}</b>')) {
  code = code.replace(
    '<b className="text-white text-xs">{ex.targetWeight ? `${ex.targetWeight}kg` : "Auto"}</b>',
    '<b className="text-white text-xs">{plannedWeight ? `${plannedWeight}kg` : "Auto"}</b>'
  );
  console.log("[OK] Visualizza Scheda: collegato plannedWeight.");
}

if (code.includes('{ex.rpeTarget ? `RPE ${ex.rpeTarget}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>')) {
  code = code.replace(
    '<b className="text-emerald-400 text-xs">{ex.rpeTarget ? `RPE ${ex.rpeTarget}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>',
    '<b className="text-emerald-400 text-xs">{plannedRpe ? `RPE ${plannedRpe}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>'
  );
  console.log("[OK] Visualizza Scheda: collegato plannedRpe.");
}

fs.writeFileSync(pagePath, code, 'utf8');

// 5. Test Build & Git Push
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD DI PRODUZIONE SUPERATA CON SUCCESSO (0 ERRORI)!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix(coach): clean syntax fix, integrate TopGymClassicCabina in methodologies, bind matrix overrides to athlete viewer"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== BUILD VERIFICATA E DEPLOY COMPLETATO SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
