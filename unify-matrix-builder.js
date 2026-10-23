const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] UNIFICAZIONE BUILDER SULLA MATRICE & RIMOZIONE GESTISCI SCHEDA ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
fs.copyFileSync(pagePath, `${pagePath}.bak`);

let code = fs.readFileSync(pagePath, 'utf8');

// ---------------------------------------------------------------------
// 1. INDIVIDUAZIONE SEZIONE BUILDER LATO COACH
// ---------------------------------------------------------------------
const builderMarker = '{activeTab === "builder" && ((userRole as any) === "COACH")';
const colDestraMarker = '{/* COLONNA DESTRA (30% STICKY): ANALISI & TELEMETRIA DEL MESOCICLO */}';

const builderIdx = code.indexOf(builderMarker);
const colDestraIdx = code.indexOf(colDestraMarker);

if (builderIdx === -1 || colDestraIdx === -1) {
  console.error("[ERRORE] Marcatori del Builder o della Colonna Destra non trovati.");
  process.exit(1);
}

const leftColMarker = '<div className="lg:col-span-8 space-y-6">';
const leftColIdx = code.indexOf(leftColMarker, builderIdx);

if (leftColIdx === -1 || leftColIdx > colDestraIdx) {
  console.error("[ERRORE] Marcatori della colonna sinistra non identificati.");
  process.exit(1);
}

// ---------------------------------------------------------------------
// 2. NUOVA COLONNA SINISTRA COACH: CONTROLLO REGIA + SINGOLA MATRICE W1-W16
// ---------------------------------------------------------------------
const newLeftColContent = `
              {/* PANNELLO DI CONTROLLO COACH & REGIA SCHEDA */}
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

                {/* NOME DELLA SCHEDA E TASTO SALVA E ASSEGNA */}
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
            </div>\n\n            `;

// Sostituiamo tutto il contenuto della colonna sinistra precedente
const partBefore = code.slice(0, leftColIdx + leftColMarker.length);
const partAfter = code.slice(colDestraIdx);
code = partBefore + newLeftColContent + partAfter;

console.log("[OK] Sostituzione eseguita: Gestisci Scheda eliminata, Matrice integrata come regia unica.");

// ---------------------------------------------------------------------
// 3. SINCRONIZZAZIONE SETTIMANALE DEGLI OVERRIDES IN VISUALIZZA SCHEDA
// ---------------------------------------------------------------------
// Assicuriamoci che in Visualizza Scheda vengano letti gli overrides della settimana selezionata
const viewerMapMarker = 'const plannedSets = isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets;';
if (code.includes(viewerMapMarker)) {
  const dynamicOverrideResolver = `const weekOverrides = currentDay.weekOverrides || (programDays[0] as any)?.weekOverrides;
                    const weekOverride = weekOverrides?.[viewWeekSelected]?.[ex.id] 
                      || weekOverrides?.[String(viewWeekSelected)]?.[ex.id];

                    const plannedSets = weekOverride?.sets ?? (isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets);
                    const plannedReps = weekOverride?.reps ?? ex.reps;
                    const plannedWeight = weekOverride?.targetWeight ?? ex.targetWeight;
                    const plannedRpe = weekOverride?.rpeTarget ?? ex.rpeTarget;`;

  code = code.replace(viewerMapMarker, dynamicOverrideResolver);
  console.log("[OK] Visualizza Scheda potenziato: legge in automatico le variazioni settimanali della Matrice.");
}

fs.writeFileSync(pagePath, code, 'utf8');

// ---------------------------------------------------------------------
// 4. VERIFICA BUILD DI PRODUZIONE & PUSH SU VERCEL
// ---------------------------------------------------------------------
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON SUCCESSO (0 ERRORI)!");

  if (fs.existsSync(`${pagePath}.bak`)) fs.unlinkSync(`${pagePath}.bak`);

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "refactor(coach): remove legacy gestisci scheda accordion, establish macrocycle matrix as primary planner and sync overrides to athlete"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== REFACTORING COMPLETATO CON SUCCESSO E DEPLOYATO SU VERCEL! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore riscontrato durante il build:", err.message);
  if (fs.existsSync(`${pagePath}.bak`)) {
    fs.copyFileSync(`${pagePath}.bak`, pagePath);
    console.log("[OK] app/page.tsx ripristinato dallo stato di backup.");
  }
  process.exit(1);
}
