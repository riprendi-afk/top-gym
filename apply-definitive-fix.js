const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] RIPRISTINO HEAD E APPLICAZIONE DEFINITIVA FIX ===");

// 1. Ripristino app/page.tsx allo stato HEAD integro e pulito
execSync('git checkout HEAD -- app/page.tsx', { stdio: 'inherit' });
console.log("[OK] app/page.tsx ripristinato da git HEAD.");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// ---------------------------------------------------------------------
// 2. STOP DEFINITIVO AL RICALCOLO 4x6 (dynamicActiveDay = activeDay)
// ---------------------------------------------------------------------
const dynMarker = 'const dynamicActiveDay = useMemo(';
const dynIdx = code.indexOf(dynMarker);
if (dynIdx !== -1) {
  const depsMarker = 'selectedDayIndex,\n    programDays,\n  ]);';
  const altDepsMarker = 'programDays,\n  ]);';
  let endDyn = code.indexOf(depsMarker, dynIdx);
  let len = depsMarker.length;
  if (endDyn === -1) {
    endDyn = code.indexOf(altDepsMarker, dynIdx);
    len = altDepsMarker.length;
  }
  if (endDyn !== -1) {
    code = code.slice(0, dynIdx) + 'const dynamicActiveDay = activeDay;' + code.slice(endDyn + len);
    console.log("[OK] dynamicActiveDay reso statico al 100%: eliminato getActiveSessionForAthlete (niente piu trasformazione a 4x6).");
  }
}

// ---------------------------------------------------------------------
// 3. REINTEGRO TOPGYM CLASSIC CABINA NELLA TAB METODOLOGIE
// ---------------------------------------------------------------------
const methMarker = '{/* TAB COACH: METODOLOGIE & LINEE GUIDA */}';
const methIdx = code.indexOf(methMarker);
if (methIdx !== -1) {
  const guideTag = '<MethodologiesGuide />';
  const gIdx = code.indexOf(guideTag, methIdx);
  if (gIdx !== -1) {
    const endTab = code.indexOf(')}', gIdx);
    if (endTab !== -1) {
      const newMethodologies = `{\/* TAB COACH: METODOLOGIE & LINEE GUIDA *\/}
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

              {/* MODALE SELETTORE TEMPLATE */}
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
      code = code.slice(0, methIdx) + newMethodologies + code.slice(endTab + 2);
      console.log("[OK] TopGymClassicCabina ripristinata in cima alla sezione Metodologie.");
    }
  }
}

// ---------------------------------------------------------------------
// 4. RIMOZIONE GESTISCI SCHEDA E CENTRATURA UNICA SULLA MATRICE COACH
// ---------------------------------------------------------------------
const builderMarker = '{activeTab === "builder" && ((userRole as any) === "COACH")';
const colDestraMarker = '{/* COLONNA DESTRA (30% STICKY): ANALISI & TELEMETRIA DEL MESOCICLO */}';
const bIdx = code.indexOf(builderMarker);
const cIdx = code.indexOf(colDestraMarker);

if (bIdx !== -1 && cIdx !== -1) {
  const leftColTag = '<div className="lg:col-span-8 space-y-6">';
  const lIdx = code.indexOf(leftColTag, bIdx);
  if (lIdx !== -1 && lIdx < cIdx) {
    const cleanBuilderLeft = `<div className="lg:col-span-8 space-y-6">
              {/* PANNELLO DI REGIA COACH: UNICA SORGENTE DI VERITA' */}
              <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h2 className="text-sm font-black uppercase tracking-wider text-white">
                          Regia Scheda & Assegnazione Programma
                        </h2>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Atleta: <b className="text-white">{activeAthlete.displayName}</b> &bull; Gestione centralizzata su Matrice W1–W16
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
                  >
                    <Layers className="w-4 h-4 text-white" />
                    <span>Scegli Template Split</span>
                  </button>
                </div>

                {/* NOME DELLA SCHEDA E TASTO MASTER SALVA E ASSEGNA */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-7 space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Nome della Scheda
                    </label>
                    <input
                      type="text"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder="Nome della Scheda..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-[#E50914] transition"
                    />
                  </div>

                  <div className="sm:col-span-5 sm:self-end">
                    <button
                      type="button"
                      onClick={handleSaveProgramByCoach}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Salva e Assegna ({activeAthlete.displayName})</span>
                    </button>
                  </div>
                </div>

                {builderSuccessMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs animate-in fade-in">
                    {builderSuccessMessage}
                  </div>
                )}
              </div>

              {/* MODALE SELETTORE TEMPLATE */}
              <TemplatePickerModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                currentBlock={currentBlock}
                athleteName={activeAthlete?.displayName || ""}
                onSelectTemplate={(days, templateName) => {
                  setProgramDays(days as any);
                  setProgramName(templateName);
                  setBuilderSuccessMessage("⚡ Template \\"" + templateName + "\\" caricato nella Matrice!");
                  setTimeout(() => setBuilderSuccessMessage(null), 4000);
                }}
              />

              {/* MATRICE MACROCICLO W1-W16: SINGLE SOURCE OF TRUTH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Matrice Macrociclo (W1–W16) &bull; Single Source of Truth
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden sm:inline">
                      {programDays.length} Giornate Attive
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
                  }}
                />
              </div>
            </div>\n\n            `;
    code = code.slice(0, lIdx) + cleanBuilderLeft + code.slice(cIdx);
    console.log("[OK] Sezione Gestisci Scheda rimossa: Matrice impostata come unico centro di gestione.");
  }
}

// ---------------------------------------------------------------------
// 5. SINCRONIZZAZIONE OVERRIDES IN VISUALIZZA SCHEDA (W1 - W16)
// ---------------------------------------------------------------------
const mapTag = 'const plannedSets = isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets;';
if (code.includes(mapTag)) {
  const dynamicOverrideLogic = `const weekOverrides = (currentDay as any)?.weekOverrides || (programDays[0] as any)?.weekOverrides;
                    const weekOverride = weekOverrides?.[viewWeekSelected]?.[ex.id] 
                      || weekOverrides?.[String(viewWeekSelected)]?.[ex.id];

                    const plannedSets = weekOverride?.sets ?? (isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets);
                    const plannedReps = weekOverride?.reps ?? ex.reps;
                    const plannedWeight = weekOverride?.targetWeight ?? ex.targetWeight;
                    const plannedRpe = weekOverride?.rpeTarget ?? ex.rpeTarget;`;

  code = code.replace(mapTag, dynamicOverrideLogic);
  code = code.replace(
    '<b className="text-white text-xs">{ex.reps}</b>',
    '<b className="text-white text-xs">{plannedReps}</b>'
  );
  code = code.replace(
    '<b className="text-white text-xs">{ex.targetWeight ? `${ex.targetWeight}kg` : "Auto"}</b>',
    '<b className="text-white text-xs">{plannedWeight ? `${plannedWeight}kg` : "Auto"}</b>'
  );
  code = code.replace(
    '<b className="text-emerald-400 text-xs">{ex.rpeTarget ? `RPE ${ex.rpeTarget}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>',
    '<b className="text-emerald-400 text-xs">{plannedRpe ? `RPE ${plannedRpe}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>'
  );
  console.log("[OK] Visualizza Scheda: collegati plannedSets, plannedReps, plannedWeight e plannedRpe.");
}

fs.writeFileSync(pagePath, code, 'utf8');

// ---------------------------------------------------------------------
// 6. BUILD DI VERIFICA & PUSH SU VERCEL
// ---------------------------------------------------------------------
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON SUCCESSO (0 ERRORI)!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix: ensure static sets preservation, reintegrate TopGymClassicCabina in methodologies, and unify builder on matrix"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== TUTTI GLI AGGIORNAMENTI SONO ORA OPERATIVI E DEPLOYATI SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
