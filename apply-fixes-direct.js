const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== APPLICAZIONE DIRETTA CORREZIONI TOP GYM ===");

// ---------------------------------------------------------------------
// 1. CORREZIONE components/MacrocycleTimelineModal.tsx (Salvataggio completo)
// ---------------------------------------------------------------------
const modalPath = path.join(process.cwd(), 'components', 'MacrocycleTimelineModal.tsx');
if (fs.existsSync(modalPath)) {
  let modalCode = fs.readFileSync(modalPath, 'utf8');

  const oldHandleSave = `  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSaveOverrides) {
        const updatedDays = localDays.map(d => ({
          ...d,
          weekOverrides: localOverrides
        }));
        await onSaveOverrides(updatedDays, localOverrides);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Errore salvataggio matrice:", err);
    } finally {
      setIsSaving(false);
    }
  };`;

  const newHandleSave = `  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Unione di tutti i dati calcolati dalla timeline (W1-W16) con gli override manuali
      const mergedOverrides: Record<number, Record<string, any>> = {};
      
      if (timeline && timeline.length > 0) {
        timeline.forEach(w => {
          const wNum = w.weekNumber;
          if (!mergedOverrides[wNum]) mergedOverrides[wNum] = {};
          (w.days || []).forEach((d: any) => {
            (d.exercises || []).forEach((ex: any) => {
              if (ex.id) {
                mergedOverrides[wNum][ex.id] = {
                  sets: ex.sets,
                  reps: ex.reps,
                  targetWeight: ex.targetWeight,
                  restSeconds: ex.restSeconds,
                  rpeTarget: ex.rpeTarget,
                  notes: ex.notes
                };
              }
            });
          });
        });
      }

      if (localOverrides) {
        Object.keys(localOverrides).forEach(wKey => {
          const wNum = Number(wKey);
          if (!mergedOverrides[wNum]) mergedOverrides[wNum] = {};
          Object.assign(mergedOverrides[wNum], localOverrides[wNum]);
        });
      }

      if (onSaveOverrides) {
        const updatedDays = localDays.map(d => ({
          ...d,
          weekOverrides: mergedOverrides
        }));
        await onSaveOverrides(updatedDays, mergedOverrides);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Errore salvataggio matrice:", err);
    } finally {
      setIsSaving(false);
    }
  };`;

  if (modalCode.includes('weekOverrides: localOverrides')) {
    modalCode = modalCode.replace(
      /const handleSave = async \(\) => \{[\s\S]*?setIsSaving\(false\);\s*\}\s*;/g,
      newHandleSave.trim()
    );
    fs.writeFileSync(modalPath, modalCode, 'utf8');
    console.log("[OK] MacrocycleTimelineModal.tsx: serializzazione completa della matrice W1-W16 attivata.");
  }
}

// ---------------------------------------------------------------------
// 2. CORREZIONE app/page.tsx (Binding parametri e note scheda Atleta)
// ---------------------------------------------------------------------
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
if (fs.existsSync(pagePath)) {
  let pageCode = fs.readFileSync(pagePath, 'utf8');

  // Verifica staticità Esegui Allenamento
  if (pageCode.includes('const dynamicActiveDay = useMemo(')) {
    pageCode = pageCode.replace(
      /const dynamicActiveDay = useMemo\([\s\S]*?\n\s*const activeRoutine/g,
      'const dynamicActiveDay = activeDay;\n  const activeRoutine'
    );
  }

  // Risoluzione binding nella vista Atleta
  const searchLoop = '{currentDay.exercises.map((ex: any, exIdx: number) => {';
  const idxLoop = pageCode.indexOf(searchLoop);
  if (idxLoop !== -1) {
    const idxReturn = pageCode.indexOf('return (', idxLoop);
    if (idxReturn !== -1) {
      const injection = `
                    const weekOverrides = currentDay.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
                    const weekOverride = weekOverrides?.[viewWeekSelected]?.[ex.id] || weekOverrides?.[String(viewWeekSelected)]?.[ex.id];

                    const plannedSets = (weekOverride?.sets !== undefined && weekOverride?.sets !== null && weekOverride?.sets !== "")
                      ? Number(weekOverride.sets)
                      : (isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : ex.sets);

                    const plannedReps = (weekOverride?.reps !== undefined && weekOverride?.reps !== null && weekOverride?.reps !== "")
                      ? String(weekOverride.reps)
                      : String(ex.reps || "6");

                    const plannedWeight = (weekOverride?.targetWeight !== undefined && weekOverride?.targetWeight !== null && weekOverride?.targetWeight !== "")
                      ? String(weekOverride.targetWeight)
                      : (ex.targetWeight ? String(ex.targetWeight) : "");

                    const plannedRest = (weekOverride?.restSeconds !== undefined && weekOverride?.restSeconds !== null && weekOverride?.restSeconds !== "")
                      ? Number(weekOverride.restSeconds)
                      : (ex.restSeconds || 90);

                    const plannedRpe = weekOverride?.rpeTarget || ex.rpeTarget;
                    const plannedNotes = weekOverride?.notes || ex.notes;
`;
      pageCode = pageCode.slice(0, idxLoop + searchLoop.length) + injection + pageCode.slice(idxReturn);
    }
  }

  // Sostituzione binding visuali
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.sets\}<\/b>/g, '<b className="text-white text-xs">{plannedSets}</b>');
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.reps\}<\/b>/g, '<b className="text-white text-xs">{plannedReps}</b>');
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.targetWeight \? `\$\{ex\.targetWeight\}kg` : "Auto"\}<\/b>/g, '<b className="text-white text-xs">{plannedWeight ? `${plannedWeight}kg` : "Auto"}</b>');
  pageCode = pageCode.replace(/<b className="text-yellow-400 text-xs">\{ex\.restSeconds \|\| 90\}s<\/b>/g, '<b className="text-yellow-400 text-xs">{plannedRest}s</b>');
  pageCode = pageCode.replace(/<b className="text-emerald-400 text-xs">\{ex\.rpeTarget \? `RPE \$\{ex\.rpeTarget\}` : \(ex\.tut \? `TUT \$\{ex\.tut\}` : "RIR 1-2"\)\}<\/b>/g, '<b className="text-emerald-400 text-xs">{plannedRpe ? `RPE ${plannedRpe}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>');
  pageCode = pageCode.replace(/Note:\s*\{ex\.notes\}/g, 'Note: {plannedNotes}');

  fs.writeFileSync(pagePath, pageCode, 'utf8');
  console.log("[OK] app/page.tsx: binding scheda atleta aggiornato con successo.");
}

// ---------------------------------------------------------------------
// 3. SPOSTAMENTO "VISUALIZZA SCHEDA" ACCANTO A "WORKOUT" IN MobileBottomNav.tsx
// ---------------------------------------------------------------------
const navPath = path.join(process.cwd(), 'components', 'MobileBottomNav.tsx');
if (fs.existsSync(navPath)) {
  let navCode = fs.readFileSync(navPath, 'utf8');

  // Assicura import ClipboardList
  if (!navCode.includes('ClipboardList')) {
    navCode = navCode.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/,
      (match, p1) => `import { ClipboardList, ${p1.trim()} } from 'lucide-react';`
    );
  }

  // Riorganizzazione blocco atleta: Workout -> Scheda -> Readiness -> Analytics -> Altro
  const athleteBlockSearch = /\{\/\*\s*VISTA ATLETA\s*\*\/\}[\s\S]*?\{\/\*\s*VISTA COACH\s*\*\/\}/;
  const newAthleteBlock = `{/* VISTA ATLETA */}
          {userRole === 'ATHLETE' && (
            <>
              <button
                type="button"
                onClick={() => handleSelectTab('workout')}
                className={\`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all \${
                  activeTab === 'workout' ? 'text-[#E50914]' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <Dumbbell className={\`w-5 h-5 \${activeTab === 'workout' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Workout</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('chat')}
                className={\`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all \${
                  activeTab === 'chat' ? 'text-[#E50914]' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <ClipboardList className={\`w-5 h-5 \${activeTab === 'chat' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Scheda</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('readiness')}
                className={\`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all \${
                  activeTab === 'readiness' ? 'text-green-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <Gauge className={\`w-5 h-5 \${activeTab === 'readiness' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Readiness</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('analytics')}
                className={\`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all \${
                  activeTab === 'analytics' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <TrendingUp className={\`w-5 h-5 \${activeTab === 'analytics' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Progressi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMoreOpen(true)}
                className={\`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all \${
                  isMoreActive ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <MoreHorizontal className={\`w-5 h-5 \${isMoreActive ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Altro</span>
              </button>
            </>
          )}

          {/* VISTA COACH */}`;

  navCode = navCode.replace(athleteBlockSearch, newAthleteBlock);
  fs.writeFileSync(navPath, navCode, 'utf8');
  console.log("[OK] MobileBottomNav.tsx: 'Scheda' spostata subito accanto a 'Workout'.");
}

// ---------------------------------------------------------------------
// 4. VERIFICA BUILD E COMMIT
// ---------------------------------------------------------------------
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] Compilazione completata con 0 errori.");

  console.log("--> Esecuzione commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix: serialize full matrix timeline overrides, align athlete card values, reposition athlete sheet tab"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== APPLICAZIONE COMPLETATA E DEPLOYATA SU VERCEL ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
