// components/MacrocycleTimelineModal.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X, Check, Lock, Unlock, Calendar, Save,
  RefreshCw, Layers, Dumbbell, Printer, Plus, Trash2, FileText
} from 'lucide-react';
import {
  ENGINE_METADATA,
  resolveEngineKey,
  generateMacrocycleTimeline,
  ProjectedWeek,
  ExerciseWeekOverride
} from '@/lib/topgym-timeline-generator';

interface MacrocycleTimelineModalProps {
  inline?: boolean;
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
  athleteId: string;
  programDays: any[];
  programmingModel?: string;
  onSaveOverrides?: (updatedDays: any[], overrides: Record<number, Record<string, ExerciseWeekOverride>>) => Promise<void>;
}

export default function MacrocycleTimelineModal({
  inline = false,
  isOpen,
  onClose,
  athleteName,
  athleteId,
  programDays,
  programmingModel,
  onSaveOverrides
}: MacrocycleTimelineModalProps) {
  if (!isOpen && !inline) return null;

  const methodKey = resolveEngineKey(programmingModel);
  const meta = ENGINE_METADATA[methodKey];

  const [localDays, setLocalDays] = useState<any[]>(programDays || []);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [localOverrides, setLocalOverrides] = useState<Record<number, Record<string, ExerciseWeekOverride>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (programDays && programDays.length > 0) {
      setLocalDays(programDays);
      setLocalOverrides(programDays[0]?.weekOverrides || {});
    }
  }, [athleteId, programDays]);

  const timeline = useMemo<ProjectedWeek[]>(() => {
    if (!localDays || localDays.length === 0) return [];
    return generateMacrocycleTimeline(localDays, methodKey, localOverrides);
  }, [localDays, methodKey, localOverrides]);

  const dayList = useMemo(() => {
    if (!timeline[0] || !timeline[0].days) return [];
    return timeline[0].days.map((d, idx) => ({
      index: idx,
      title: d.title || `Sessione ${String.fromCharCode(65 + idx)}`
    }));
  }, [timeline]);

  const exercisesForDay = useMemo(() => {
    if (!timeline[0] || !timeline[0].days || !timeline[0].days[selectedDayIdx]) return [];
    return timeline[0].days[selectedDayIdx].exercises || [];
  }, [timeline, selectedDayIdx]);

  

  // MOTORE DI STAMPA ISOLATO: Genera HTML puro senza dashboard e attiva il PDF
  const executeIsolatedPrint = (printAllSessions: boolean) => {
    const sessionsToPrint = printAllSessions
      ? (timeline[0]?.days || []).map((_, idx) => idx)
      : [selectedDayIdx];

    const totalWeeks = timeline.length;
    const modelTitle = meta?.name || programmingModel || 'Top Gym Macrocycle';

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>TOP GYM - ${athleteName} - ${modelTitle}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          }
          body {
            background: #fff;
            color: #000;
            font-size: 8pt;
            padding: 2mm;
          }
          .sheet {
            page-break-after: always;
            margin-bottom: 20px;
          }
          .sheet:last-child {
            page-break-after: auto;
            margin-bottom: 0;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 8px;
          }
          .title-area h1 {
            font-size: 15pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .title-area .subtitle {
            font-size: 9pt;
            color: #333;
            font-weight: 600;
            margin-top: 2px;
          }
          .meta-area {
            text-align: right;
            font-size: 7.5pt;
            color: #444;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7pt;
          }
          th, td {
            border: 1px solid #777;
            padding: 3px 2px;
            text-align: center;
            vertical-align: middle;
          }
          th {
            background-color: #f2f2f2;
            font-weight: 800;
          }
          .th-exercise {
            text-align: left;
            padding-left: 6px;
            min-width: 160px;
            max-width: 180px;
            background-color: #e8e8e8;
          }
          .ex-title {
            font-weight: 800;
            font-size: 8pt;
            color: #000;
          }
          .ex-sub {
            font-size: 6.5pt;
            color: #555;
          }
          .cell-primary {
            font-weight: 800;
            font-size: 8pt;
          }
          .cell-details {
            font-size: 6.5pt;
            color: #333;
            margin-top: 1px;
          }
          .cell-notes {
            font-size: 5.5pt;
            color: #666;
            border-top: 0.5px solid #ccc;
            margin-top: 1px;
            padding-top: 1px;
          }
          .col-deload {
            background-color: #f0f7ff;
          }
          .col-peak {
            background-color: #fff0f0;
          }
          .footer-note {
            display: flex;
            justify-content: space-between;
            margin-top: 6px;
            font-size: 6.5pt;
            color: #666;
          }
        </style>
      </head>
      <body>
    `;

    sessionsToPrint.forEach((dayIdx, pageIndex) => {
      const sessionTitle = dayList[dayIdx]?.title || `Sessione ${dayIdx + 1}`;
      const currentExercises = timeline[0]?.days[dayIdx]?.exercises || [];

      html += `
        <div class="sheet">
          <div class="header-box">
            <div class="title-area">
              <h1>TOP GYM • ${athleteName}</h1>
              <div class="subtitle">${modelTitle} — <b>${sessionTitle}</b> (${totalWeeks} Settimane Complete)</div>
            </div>
            <div class="meta-area">
              <div><b>A.S.D. TOP GYM</b> • Coach Marco Di Girolamo</div>
              <div>Data emissione: ${new Date().toLocaleDateString('it-IT')} • Sessione ${pageIndex + 1} di ${sessionsToPrint.length}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="th-exercise">Esercizio & Target</th>
                ${timeline.map(w => {
                  const isDeload = w.isDeload;
                  const isPeak = w.phaseType === 'PICCO';
                  const phaseLabelClean = (w.phaseLabel || '').replace(/^W\d+:\s*/, '');
                  return `
                    <th class="${isDeload ? 'col-deload' : isPeak ? 'col-peak' : ''}">
                      <div style="font-size: 8pt;"><b>W${w.weekNumber}</b></div>
                      <div style="font-size: 5.5pt; font-weight: normal; color: #555;">${phaseLabelClean}</div>
                    </th>
                  `;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              ${currentExercises.map((baseEx, exIdx) => {
                return `
                  <tr>
                    <td class="th-exercise">
                      <div class="ex-title">${baseEx.name}</div>
                      <div class="ex-sub">${baseEx.muscle || ''} • ${baseEx.stimulus || 'TARGET'}</div>
                    </td>
                    ${timeline.map(w => {
                      const ex = w.days[dayIdx]?.exercises[exIdx];
                      if (!ex) return '<td>-</td>';

                      const setsReps = `${ex.sets}x${ex.reps}`;
                      const details = [
                        ex.weight ? `${ex.weight}kg` : null,
                        ex.rpe ? `@${ex.rpe}` : null,
                        ex.restSeconds ? `Rec: ${ex.restSeconds}s` : null
                      ].filter(Boolean).join(' • ');

                      return `
                        <td class="${w.isDeload ? 'col-deload' : ''}">
                          <div class="cell-primary">${setsReps}</div>
                          ${details ? `<div class="cell-details">${details}</div>` : ''}
                          ${ex.notes ? `<div class="cell-notes">${ex.notes}</div>` : ''}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer-note">
            <span>Periodizzazione Scientifica Centralizzata • TOP GYM Cloud Matrix</span>
            <span>Documento Tecnico di Allenamento — Foglio ${pageIndex + 1} / ${sessionsToPrint.length}</span>
          </div>
        </div>
      `;
    });

    html += `
      </body>
      </html>
    `;

    // Crea un iframe invisibile temporaneo per stampare ESCLUSIVAMENTE la matrice
    const printFrame = document.createElement('iframe');
    printFrame.setAttribute('id', 'topgym-isolated-matrix-printer');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (e) {
        console.error('Errore durante la stampa:', e);
      } finally {
        setTimeout(() => {
          const el = document.getElementById('topgym-isolated-matrix-printer');
          if (el) el.remove();
        }, 1500);
      }
    }, 350);
  };

  const handleCellChange = (weekNum: number, exId: string, field: keyof ExerciseWeekOverride, value: any) => {
    setLocalOverrides(prev => {
      const weekMap = prev[weekNum] || {};
      const exMap = weekMap[exId] || {};
      return {
        ...prev,
        [weekNum]: {
          ...weekMap,
          [exId]: {
            ...exMap,
            [field]: value
          }
        }
      };
    });
  };

  const toggleExerciseLock = (exId: string, currentLock: boolean) => {
    setLocalOverrides(prev => {
      const next = { ...prev };
      timeline.forEach(w => {
        const weekMap = next[w.weekNumber] || {};
        const exMap = weekMap[exId] || {};
        next[w.weekNumber] = {
          ...weekMap,
          [exId]: {
            ...exMap,
            isLocked: !currentLock
          }
        };
      });
      return next;
    });
  };

  const resetCellOverride = (weekNum: number, exId: string) => {
    setLocalOverrides(prev => {
      if (!prev[weekNum]) return prev;
      const weekMap = { ...prev[weekNum] };
      delete weekMap[exId];
      return {
        ...prev,
        [weekNum]: weekMap
      };
    });
  };

  const handleAddExercise = () => {
    const exName = prompt("Inserisci il nome del nuovo esercizio:", "Nuovo Esercizio");
    if (!exName || !exName.trim()) return;

    const newEx = {
      id: "ex_" + Date.now(),
      name: exName.trim(),
      muscle: "Generale",
      sets: 3,
      reps: "10",
      weight: 0,
      rpe: 8,
      restSeconds: 90,
      stimulus: "HYPERTROPHIC"
    };

    setLocalDays(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[selectedDayIdx]) return prev;
      if (!copy[selectedDayIdx].exercises) copy[selectedDayIdx].exercises = [];
      copy[selectedDayIdx].exercises.push(newEx);
      return copy;
    });
  };

  const handleRemoveExercise = (exIdx: number, exName: string) => {
    if (!confirm(`Vuoi rimuovere "${exName}" da questa sessione?`)) return;
    setLocalDays(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[selectedDayIdx]?.exercises) {
        copy[selectedDayIdx].exercises.splice(exIdx, 1);
      }
      return copy;
    });
  };

  const handleSave = async () => {
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
  };

  const currentSessionTitle = dayList[selectedDayIdx]?.title || `Sessione ${selectedDayIdx + 1}`;

  return (
    <div className={inline ? "w-full my-4" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"}>
      <div className={inline ? "bg-[#0F1218] border border-white/10 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" : "bg-[#0F1218] border border-white/10 rounded-2xl w-full max-w-[98vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden"}>

        {/* HEADER MODALE */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#151922]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#E50914] text-white rounded-xl shadow-lg shadow-red-900/40">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  Matrice Macrociclo: <span className="text-[#E50914]">{athleteName}</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-white bg-white/10 px-2 py-0.5 rounded font-mono">
                    {meta?.name || programmingModel}
                  </span>
                  <span className="text-xs text-zinc-400 hidden md:inline">
                    • {timeline.length} Microcicli ({meta?.macrocycleSummary || ''})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PULSANTI DI AZIONE */}
          <div className="flex items-center gap-2.5 flex-wrap">

            {/* STAMPA COMPLETA TUTTE LE SETTIMANE & TUTTE LE SESSIONI */}
            <button
              type="button"
              onClick={() => executeIsolatedPrint(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer shadow-md border border-white/10"
              title="Stampa l'intero Macrociclo (Tutte le Sessioni x Tutte le Settimane)"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Stampa Macrociclo Completo (PDF)</span>
            </button>

            {/* STAMPA SOLO SESSIONE ATTIVA */}
            <button
              type="button"
              onClick={() => executeIsolatedPrint(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 transition cursor-pointer border border-white/5"
              title="Stampa solo la sessione correntemente aperta"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Solo {currentSessionTitle}</span>
            </button>

            {/* AGGIUNGI ESERCIZIO */}
            <button
              type="button"
              onClick={handleAddExercise}
              className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-md"
              title="Aggiungi esercizio a questa sessione"
            >
              <Plus className="w-4 h-4" />
              <span>+ Esercizio</span>
            </button>

            {/* SALVA OVERRIDE */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg ${
                saveSuccess
                  ? 'bg-emerald-500 text-black shadow-emerald-950/50'
                  : 'bg-[#E50914] hover:bg-red-700 text-white shadow-red-950/60 active:scale-95'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saveSuccess ? 'Matrice Salvata!' : isSaving ? 'Salvataggio...' : 'Salva Tutte'}
            </button>

            {/* CHIUDI */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BARRA SELEZIONE GIORNO / SESSIONE */}
        <div className="px-4 py-2.5 bg-[#12151B] border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" /> Sessione:
            </span>
            {dayList.map(d => (
              <button
                key={d.index}
                type="button"
                onClick={() => setSelectedDayIdx(d.index)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  selectedDayIdx === d.index
                    ? 'bg-[#E50914] text-white shadow-md shadow-red-900/40'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{d.title}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-400 font-mono hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Macro W1 - W${timeline.length} Modificabile in Tempo Reale</span>
          </div>
        </div>

        {/* GRIGLIA MATRICE */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0A0C10]">
          <table className="w-full border-collapse text-left min-w-max">
            <thead className="sticky top-0 z-30 bg-[#151922] shadow-md border-b border-white/10">
              <tr>
                <th className="sticky left-0 z-40 bg-[#151922] p-3 text-xs font-black uppercase tracking-wider text-zinc-300 min-w-[260px] max-w-[280px] border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.6)]">
                  Esercizio & Parametri
                </th>
                {timeline.map(w => {
                  let badgeBg = 'bg-zinc-800 text-zinc-300 border-white/10';
                  if (w.isDeload) badgeBg = 'bg-blue-900/70 text-blue-200 border-blue-500/50';
                  else if (w.phaseType === 'PICCO') badgeBg = 'bg-rose-900/70 text-rose-200 border-rose-500/50';
                  else if (w.phaseType === 'OVERLOAD') badgeBg = 'bg-amber-900/70 text-amber-200 border-amber-500/50';
                  else if (w.phaseType === 'CONVERSIONE') badgeBg = 'bg-purple-900/70 text-purple-200 border-purple-500/50';
                  else badgeBg = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';

                  return (
                    <th
                      key={w.weekNumber}
                      className={`p-2 text-center min-w-[190px] max-w-[210px] border-r border-white/5 ${
                        w.isDeload ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white font-mono">
                            W${w.weekNumber}
                          </span>
                          {w.isDeload && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 border border-blue-500/40">
                              Scarico
                            </span>
                          )}
                          {w.phaseType === 'PICCO' && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40">
                              Picco
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[180px] ${badgeBg}`} title={w.phaseLabel}>
                          {w.phaseLabel.replace(/^W\d+:\s*/, '')}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {exercisesForDay.map((baseEx, exIdx) => {
                const exId = baseEx.id || `ex_${selectedDayIdx}_${exIdx}`;
                const isLocked = localOverrides[1]?.[exId]?.isLocked ?? baseEx.isLocked;

                return (
                  <tr key={exId} className="hover:bg-white/[0.02] transition">
                    <td className="sticky left-0 z-20 bg-[#12151B] p-3 min-w-[260px] max-w-[280px] border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.6)]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 overflow-hidden flex-1">
                          <button
                            type="button"
                            onClick={() => toggleExerciseLock(exId, !!isLocked)}
                            className={`mt-0.5 p-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
                              isLocked
                                ? 'bg-amber-500 text-black border-amber-400'
                                : 'bg-white/5 text-zinc-400 hover:text-white border-white/10'
                            }`}
                            title={isLocked ? "Esercizio bloccato" : "Blocca questo esercizio"}
                          >
                            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <div className="overflow-hidden">
                            <span className="font-black text-white text-xs block truncate" title={baseEx.name}>
                              {baseEx.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {baseEx.muscle}
                              </span>
                              <span className="text-[8px] font-mono px-1 rounded uppercase font-bold bg-white/5 text-zinc-300">
                                {baseEx.stimulus || 'TARGET'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx, baseEx.name)}
                          className="text-zinc-600 hover:text-rose-400 p-1 rounded transition shrink-0"
                          title="Rimuovi esercizio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {timeline.map(w => {
                      const ex = w.days[selectedDayIdx]?.exercises[exIdx];
                      if (!ex) return <td key={w.weekNumber} className="border-r border-white/5 p-2 text-center text-zinc-600">-</td>;

                      const isOverridden = ex.isOverridden;
                      const cellLocked = ex.isLocked;

                      return (
                        <td
                          key={w.weekNumber}
                          className={`p-2 border-r border-white/5 align-top transition ${
                            cellLocked
                              ? 'bg-amber-950/15'
                              : isOverridden
                              ? 'bg-emerald-950/20'
                              : w.isDeload
                              ? 'bg-blue-950/10'
                              : ''
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">Serie</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="12"
                                  value={ex.sets}
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'sets', parseInt(e.target.value) || 1)}
                                  className="w-full bg-black/60 border border-white/10 rounded px-1 py-1 text-center font-black text-white text-xs outline-none focus:border-[#E50914]"
                                />
                              </div>
                              <span className="text-zinc-500 font-bold pt-3">×</span>
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">Reps</label>
                                <input
                                  type="text"
                                  value={ex.reps}
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'reps', e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded px-1 py-1 text-center font-bold text-white text-xs font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">Carico</label>
                                <input
                                  type="text"
                                  value={ex.weight ?? ''}
                                  placeholder="kg"
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'weight', e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded px-1 py-1 text-center font-bold text-emerald-400 text-[11px] font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">Rec (s)</label>
                                <input
                                  type="number"
                                  step="5"
                                  value={ex.restSeconds ?? 90}
                                  placeholder="sec"
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'restSeconds', parseInt(e.target.value) || 0)}
                                  className="w-full bg-black/60 border border-white/10 rounded px-1 py-1 text-center font-bold text-cyan-400 text-[11px] font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                            </div>

                            <div className="pt-1 border-t border-white/5 flex items-center justify-between gap-1">
                              <span className="text-[9px] text-zinc-400 truncate flex-1 block" title={ex.notes}>
                                {ex.notes}
                              </span>
                              {isOverridden && (
                                <button
                                  type="button"
                                  onClick={() => resetCellOverride(w.weekNumber, exId)}
                                  className="p-0.5 text-zinc-400 hover:text-white rounded"
                                  title="Ripristina valore iniziale"
                                >
                                  <RefreshCw className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#151922] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Modifica Manuale (Override)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Recupero Modificato</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Bloccato 🔒</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Scarico / Deload</span>
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono">
            "Stampa Macrociclo Completo" esporta tutte le sessioni da W1 a W${timeline.length} con impaginazione A4 orizzontale.
          </div>
        </div>

      </div>
    </div>
  );
}
