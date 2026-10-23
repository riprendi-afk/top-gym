const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] ALLINEAMENTO TOTALE DATI & SEMPLIFICAZIONE SCHEDA ===");

// =====================================================================
// 1. components/MacrocycleTimelineModal.tsx: SERIALIZZAZIONE TOTALE MATRICE
// =====================================================================
const modalPath = path.join(process.cwd(), 'components', 'MacrocycleTimelineModal.tsx');
if (fs.existsSync(modalPath)) {
  let modalCode = fs.readFileSync(modalPath, 'utf8');

  // Individuiamo handleSave
  const saveStart = modalCode.indexOf('const handleSave = async () => {');
  if (saveStart !== -1) {
    const saveEnd = modalCode.indexOf('};', saveStart);
    if (saveEnd !== -1) {
      const fullHandleSave = `const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Raccogliamo tutti i dati generati da timeline (W1-W16)
      const completeOverrides: Record<number, Record<string, any>> = {};

      if (timeline && timeline.length > 0) {
        timeline.forEach((w: any) => {
          const wNum = w.weekNumber;
          if (!completeOverrides[wNum]) completeOverrides[wNum] = {};
          (w.days || []).forEach((d: any) => {
            (d.exercises || []).forEach((ex: any) => {
              if (ex.id) {
                completeOverrides[wNum][ex.id] = {
                  sets: Number(ex.sets) || 1,
                  reps: String(ex.reps || "6"),
                  targetWeight: String(ex.targetWeight || "0"),
                  restSeconds: Number(ex.restSeconds) || 90,
                  rpeTarget: ex.rpeTarget || "RPE 8",
                  notes: ex.notes || ""
                };
              }
            });
          });
        });
      }

      // 2. Fondiamo eventuali modifiche manuali digitate dal coach
      if (localOverrides) {
        Object.keys(localOverrides).forEach(wKey => {
          const wNum = Number(wKey);
          if (!completeOverrides[wNum]) completeOverrides[wNum] = {};
          Object.assign(completeOverrides[wNum], localOverrides[wNum]);
        });
      }

      // 3. Aggiorniamo anche localDays (base della scheda W1) per riflettere le serie reali
      const updatedDays = localDays.map((d: any, dIdx: number) => {
        const w1Day = timeline?.[0]?.days?.[dIdx];
        const updatedExercises = (d.exercises || []).map((ex: any) => {
          const w1Ex = w1Day?.exercises?.find((e: any) => e.id === ex.id);
          const overrideW1 = completeOverrides?.[1]?.[ex.id];
          return {
            ...ex,
            sets: overrideW1?.sets ?? (w1Ex ? Number(w1Ex.sets) : ex.sets),
            reps: overrideW1?.reps ?? (w1Ex ? String(w1Ex.reps) : ex.reps),
            targetWeight: overrideW1?.targetWeight ?? (w1Ex ? String(w1Ex.targetWeight) : ex.targetWeight),
            restSeconds: overrideW1?.restSeconds ?? (w1Ex ? Number(w1Ex.restSeconds) : ex.restSeconds),
            notes: overrideW1?.notes ?? (w1Ex ? String(w1Ex.notes) : ex.notes)
          };
        });

        return {
          ...d,
          exercises: updatedExercises,
          weekOverrides: completeOverrides
        };
      });

      setLocalDays(updatedDays);

      if (onSaveOverrides) {
        await onSaveOverrides(updatedDays, completeOverrides);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Errore salvataggio matrice:", err);
    } finally {
      setIsSaving(false);
    }
  };`;

      modalCode = modalCode.slice(0, saveStart) + fullHandleSave + modalCode.slice(saveEnd + 2);
      fs.writeFileSync(modalPath, modalCode, 'utf8');
      console.log("[OK] MacrocycleTimelineModal.tsx: salvataggio completo della timeline W1-W16 integrato.");
    }
  }
}

// =====================================================================
// 2. app/page.tsx: BINDING SCHEDA ATLETA & ESEGUI ALLENAMENTO STATICO
// =====================================================================
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
if (fs.existsSync(pagePath)) {
  let pageCode = fs.readFileSync(pagePath, 'utf8');

  // A. Assicuriamo dynamicActiveDay = activeDay
  const dynStart = pageCode.indexOf('const dynamicActiveDay = useMemo(');
  if (dynStart !== -1) {
    const routineMarker = 'const activeRoutine = dynamicActiveDay?.exercises';
    const routineIdx = pageCode.indexOf(routineMarker, dynStart);
    if (routineIdx !== -1) {
      pageCode = pageCode.slice(0, dynStart) + 'const dynamicActiveDay = activeDay;\n  ' + pageCode.slice(routineIdx);
      console.log("[OK] Esegui Allenamento reso statico al 100%.");
    }
  }

  // B. Correzione salvataggio coach handleSaveProgramByCoach (preservare weekOverrides)
  pageCode = pageCode.replace(
    /const programDaysToSave = programDays\.map\(\(day\) => \(\{[\s\S]*?phase: isMasterCoach \? calculatedCurrentPhase : null \}\)\);/,
    `const programDaysToSave = programDays.map((day) => ({
        ...day,
        isPeriodized: isMasterCoach,
        assignedByCoach: coachEmail,
        block: isMasterCoach ? currentBlock : null,
        phase: isMasterCoach ? calculatedCurrentPhase : null,
        weekOverrides: (day as any).weekOverrides || (programDays[0] as any)?.weekOverrides || {}
      }));`
  );

  // C. Risoluzione della scheda Atleta per mostrare i parametri reali della settimana
  const exerciseCardMarker = '{currentDay.exercises.map((ex: any, exIdx: number) => {';
  const cardIdx = pageCode.indexOf(exerciseCardMarker);
  if (cardIdx !== -1) {
    const returnIdx = pageCode.indexOf('return (', cardIdx);
    if (returnIdx !== -1) {
      const resolver = `
                    const weekOverrides = currentDay.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
                    const weekOverride = weekOverrides?.[viewWeekSelected]?.[ex.id] || weekOverrides?.[String(viewWeekSelected)]?.[ex.id];

                    const plannedSets = (weekOverride?.sets !== undefined && weekOverride?.sets !== null && weekOverride?.sets !== "")
                      ? Number(weekOverride.sets)
                      : (isDeloadWeek ? Math.max(2, Math.round(ex.sets * 0.6)) : Number(ex.sets) || 4);

                    const plannedReps = (weekOverride?.reps !== undefined && weekOverride?.reps !== null && weekOverride?.reps !== "")
                      ? String(weekOverride.reps)
                      : String(ex.reps || "6");

                    const plannedWeight = (weekOverride?.targetWeight !== undefined && weekOverride?.targetWeight !== null && weekOverride?.targetWeight !== "")
                      ? String(weekOverride.targetWeight)
                      : (ex.targetWeight ? String(ex.targetWeight) : "");

                    const plannedRest = (weekOverride?.restSeconds !== undefined && weekOverride?.restSeconds !== null && weekOverride?.restSeconds !== "")
                      ? Number(weekOverride.restSeconds)
                      : Number(ex.restSeconds) || 90;

                    const plannedRpe = weekOverride?.rpeTarget || ex.rpeTarget;
                    const plannedNotes = weekOverride?.notes || ex.notes;
`;
      pageCode = pageCode.slice(0, cardIdx + exerciseCardMarker.length) + resolver + pageCode.slice(returnIdx);
    }
  }

  // D. Sostituzioni esatte delle etichette visuali nella card atleta
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.sets\}<\/b>/g, '<b className="text-white text-xs">{plannedSets}</b>');
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.reps\}<\/b>/g, '<b className="text-white text-xs">{plannedReps}</b>');
  pageCode = pageCode.replace(/<b className="text-white text-xs">\{ex\.targetWeight \? `\$\{ex\.targetWeight\}kg` : "Auto"\}<\/b>/g, '<b className="text-white text-xs">{plannedWeight ? `${plannedWeight}kg` : "Auto"}</b>');
  pageCode = pageCode.replace(/<b className="text-yellow-400 text-xs">\{ex\.restSeconds \|\| 90\}s<\/b>/g, '<b className="text-yellow-400 text-xs">{plannedRest}s</b>');
  pageCode = pageCode.replace(
    /<b className="text-emerald-400 text-xs">\{ex\.rpeTarget \? `RPE \$\{ex\.rpeTarget\}` : \(ex\.tut \? `TUT \$\{ex\.tut\}` : "RIR 1-2"\)\}<\/b>/g,
    '<b className="text-emerald-400 text-xs">{plannedRpe ? `RPE ${plannedRpe}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>'
  );
  pageCode = pageCode.replace(/Note:\s*\{ex\.notes\}/g, 'Note: {plannedNotes}');

  fs.writeFileSync(pagePath, pageCode, 'utf8');
  console.log("[OK] app/page.tsx: schede collegate direttamente agli override della matrice.");
}

// =====================================================================
// 3. components/MobileBottomNav.tsx: SPOSTAMENTO SCHEDA ACCANTO A WORKOUT
// =====================================================================
const navPath = path.join(process.cwd(), 'components', 'MobileBottomNav.tsx');
if (fs.existsSync(navPath)) {
  let navCode = fs.readFileSync(navPath, 'utf8');

  if (!navCode.includes('ClipboardList')) {
    navCode = navCode.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/,
      (match, p1) => `import { ClipboardList, ${p1.trim()} } from 'lucide-react';`
    );
  }

  const athleteNavPattern = /\{\/\*\s*VISTA ATLETA\s*\*\/\}[\s\S]*?\{\/\*\s*VISTA COACH\s*\*\/\}/;
  const newAthleteNav = `{/* VISTA ATLETA */}
          {userRole === 'ATHLETE' && (
            <>
              <button
                type="button"
                onClick={() => handleSelectTab('workout')}
                className={\`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all \${
                  activeTab === 'workout' ? 'text-[#E50914]' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <Dumbbell className={\`w-5 h-5 \${activeTab === 'workout' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Workout</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('chat')}
                className={\`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all \${
                  activeTab === 'chat' ? 'text-[#E50914]' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <ClipboardList className={\`w-5 h-5 \${activeTab === 'chat' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Scheda</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('readiness')}
                className={\`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all \${
                  activeTab === 'readiness' ? 'text-green-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <Gauge className={\`w-5 h-5 \${activeTab === 'readiness' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Readiness</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('analytics')}
                className={\`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all \${
                  activeTab === 'analytics' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <TrendingUp className={\`w-5 h-5 \${activeTab === 'analytics' ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Progressi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMoreOpen(true)}
                className={\`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all \${
                  isMoreActive ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-200'
                }\`}
              >
                <MoreHorizontal className={\`w-5 h-5 \${isMoreActive ? 'stroke-[2.5]' : ''}\`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Altro</span>
              </button>
            </>
          )}

          {/* VISTA COACH */}`;

  navCode = navCode.replace(athleteNavPattern, newAthleteNav);
  fs.writeFileSync(navPath, navCode, 'utf8');
  console.log("[OK] MobileBottomNav.tsx: Scheda posizionata subito accanto a Workout.");
}

// =====================================================================
// 4. TEST DI COMPILAZIONE DIRETTO (npm run build) & GIT PUSH
// =====================================================================
console.log("\n--> Verifica build di produzione...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] Build completata con 0 errori!");

  console.log("--> Esecuzione commit e push su Vercel...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix: serialize full matrix timeline to supabase, align athlete week overrides and reposition sheet tab"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== DEPLOY COMPLETATO CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD]:", err.message);
  process.exit(1);
}
