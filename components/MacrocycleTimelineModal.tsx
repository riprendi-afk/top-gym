// components/MacrocycleTimelineModal.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X, Check, Lock, Unlock, Calendar, Save,
  RefreshCw, Layers, Dumbbell, Printer, Plus, Trash2
} from 'lucide-react';
import {
  ENGINE_METADATA,
  resolveEngineKey,
  generateMacrocycleTimeline,
  ProjectedWeek,
  ExerciseWeekOverride
} from '@/lib/topgym-timeline-generator';

interface MacrocycleTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
  athleteId: string;
  programDays: any[];
  programmingModel?: string;
  onSaveOverrides?: (updatedDays: any[], overrides: Record<number, Record<string, ExerciseWeekOverride>>) => Promise<void>;
}

export default function MacrocycleTimelineModal({
  isOpen,
  onClose,
  athleteName,
  athleteId,
  programDays,
  programmingModel,
  onSaveOverrides
}: MacrocycleTimelineModalProps) {
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

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md print:p-0 print:bg-white print:static">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 6mm;
          }
          body {
            background: #fff !important;
            color: #000 !important;
          }
          nav, aside, header, footer, button, .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
            position: static !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            font-size: 8pt !important;
            color: #000 !important;
          }
          th, td {
            border: 1px solid #ccc !important;
            padding: 3px !important;
            color: #000 !important;
            background: #fff !important;
          }
          th {
            background-color: #f2f2f2 !important;
            font-weight: bold !important;
          }
          input {
            border: none !important;
            background: transparent !important;
            color: #000 !important;
            font-weight: bold !important;
            padding: 0 !important;
            text-align: center !important;
            width: auto !important;
          }
        }
      ` }} />

      <div className="print-container bg-[#0F1218] border border-white/10 rounded-2xl w-full max-w-[98vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#151922] print:bg-white print:border-b-2 print:border-black print:p-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#E50914] text-white rounded-xl shadow-lg shadow-red-900/40 print:hidden">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white print:text-black flex items-center gap-2">
                  Matrice Macrociclo: <span className="text-[#E50914] print:text-black">{athleteName}</span>
                  <span className="hidden print:inline text-sm font-normal text-zinc-600"> — {currentSessionTitle}</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-white print:text-black bg-white/10 print:bg-zinc-200 px-2 py-0.5 rounded font-mono">
                    {meta?.name || programmingModel}
                  </span>
                  <span className="text-xs text-zinc-400 print:text-zinc-600 hidden md:inline">
                    • {timeline.length} Microcicli • {meta?.macrocycleSummary || ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer shadow-md border border-white/10"
              title="Stampa o Salva in PDF"
            >
              <Printer className="w-4 h-4 text-zinc-300" />
              <span>Stampa PDF</span>
            </button>

            <button
              type="button"
              onClick={handleAddExercise}
              className="px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-md"
              title="Aggiungi esercizio"
            >
              <Plus className="w-4 h-4" />
              <span>+ Esercizio</span>
            </button>

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
              {saveSuccess ? 'Matrice Salvata!' : isSaving ? 'Salvataggio...' : 'Salva Tutte le Settimane'}
            </button>

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

        <div className="px-4 py-2.5 bg-[#12151B] border-b border-white/5 flex items-center justify-between gap-3 no-print">
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
            <span>W1 - W{timeline.length} con Modifica Diretta & Recuperi</span>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0A0C10] print:bg-white print:overflow-visible">
          <table className="w-full border-collapse text-left min-w-max print:min-w-0">
            <thead className="sticky top-0 z-30 bg-[#151922] shadow-md border-b border-white/10 print:static print:bg-zinc-100">
              <tr>
                <th className="sticky left-0 z-40 bg-[#151922] print:bg-zinc-100 p-3 text-xs font-black uppercase tracking-wider text-zinc-300 print:text-black min-w-[260px] max-w-[280px] border-r border-white/10 print:border-zinc-300">
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
                      className={`p-2 text-center min-w-[190px] max-w-[210px] border-r border-white/5 print:border-zinc-300 ${
                        w.isDeload ? 'bg-blue-950/20 print:bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white print:text-black font-mono">
                            W{w.weekNumber}
                          </span>
                          {w.isDeload && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 print:text-blue-800 border border-blue-500/40">
                              Scarico
                            </span>
                          )}
                          {w.phaseType === 'PICCO' && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 print:text-red-800 border border-rose-500/40">
                              Picco
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[180px] print:border-none print:bg-transparent print:text-zinc-700 ${badgeBg}`} title={w.phaseLabel}>
                          {w.phaseLabel.replace(/^W\d+:\s*/, '')}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-zinc-300 text-xs">
              {exercisesForDay.map((baseEx, exIdx) => {
                const exId = baseEx.id || `ex_${selectedDayIdx}_${exIdx}`;
                const isLocked = localOverrides[1]?.[exId]?.isLocked ?? baseEx.isLocked;

                return (
                  <tr key={exId} className="hover:bg-white/[0.02] transition print:hover:bg-transparent">
                    <td className="sticky left-0 z-20 bg-[#12151B] print:bg-white p-3 min-w-[260px] max-w-[280px] border-r border-white/10 print:border-zinc-300 shadow-[4px_0_12px_rgba(0,0,0,0.6)] print:shadow-none">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 overflow-hidden flex-1">
                          <button
                            type="button"
                            onClick={() => toggleExerciseLock(exId, !!isLocked)}
                            className={`mt-0.5 p-1.5 rounded-lg border transition cursor-pointer shrink-0 no-print ${
                              isLocked
                                ? 'bg-amber-500 text-black border-amber-400'
                                : 'bg-white/5 text-zinc-400 hover:text-white border-white/10'
                            }`}
                            title={isLocked ? "Esercizio bloccato" : "Blocca questo esercizio"}
                          >
                            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <div className="overflow-hidden">
                            <span className="font-black text-white print:text-black text-xs block truncate" title={baseEx.name}>
                              {baseEx.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] text-zinc-400 print:text-zinc-600 font-mono">
                                {baseEx.muscle}
                              </span>
                              <span className="text-[8px] font-mono px-1 rounded uppercase font-bold bg-white/5 print:bg-zinc-200 text-zinc-300 print:text-zinc-800">
                                {baseEx.stimulus || 'TARGET'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx, baseEx.name)}
                          className="text-zinc-600 hover:text-rose-400 p-1 rounded transition no-print shrink-0"
                          title="Rimuovi esercizio dalla sessione"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {timeline.map(w => {
                      const ex = w.days[selectedDayIdx]?.exercises[exIdx];
                      if (!ex) return <td key={w.weekNumber} className="border-r border-white/5 print:border-zinc-300 p-2 text-center text-zinc-600">-</td>;

                      const isOverridden = ex.isOverridden;
                      const cellLocked = ex.isLocked;

                      return (
                        <td
                          key={w.weekNumber}
                          className={`p-2 border-r border-white/5 print:border-zinc-300 align-top transition ${
                            cellLocked
                              ? 'bg-amber-950/15 print:bg-amber-50'
                              : isOverridden
                              ? 'bg-emerald-950/20 print:bg-emerald-50'
                              : w.isDeload
                              ? 'bg-blue-950/10 print:bg-blue-50'
                              : ''
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 print:text-zinc-600 block mb-0.5">Serie</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="12"
                                  value={ex.sets}
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'sets', parseInt(e.target.value) || 1)}
                                  className="w-full bg-black/60 print:bg-transparent border border-white/10 print:border-none rounded px-1 py-1 text-center font-black text-white print:text-black text-xs outline-none focus:border-[#E50914]"
                                />
                              </div>
                              <span className="text-zinc-500 font-bold pt-3">×</span>
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 print:text-zinc-600 block mb-0.5">Reps</label>
                                <input
                                  type="text"
                                  value={ex.reps}
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'reps', e.target.value)}
                                  className="w-full bg-black/60 print:bg-transparent border border-white/10 print:border-none rounded px-1 py-1 text-center font-bold text-white print:text-black text-xs font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 print:text-zinc-600 block mb-0.5">Carico</label>
                                <input
                                  type="text"
                                  value={ex.weight ?? ''}
                                  placeholder="kg"
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'weight', e.target.value)}
                                  className="w-full bg-black/60 print:bg-transparent border border-white/10 print:border-none rounded px-1 py-1 text-center font-bold text-emerald-400 print:text-emerald-700 text-[11px] font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 print:text-zinc-600 block mb-0.5">Rec (s)</label>
                                <input
                                  type="number"
                                  step="5"
                                  value={ex.restSeconds ?? 90}
                                  placeholder="sec"
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'restSeconds', parseInt(e.target.value) || 0)}
                                  className="w-full bg-black/60 print:bg-transparent border border-white/10 print:border-none rounded px-1 py-1 text-center font-bold text-cyan-400 print:text-cyan-800 text-[11px] font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                            </div>

                            <div className="pt-1 border-t border-white/5 print:border-zinc-200 flex items-center justify-between gap-1">
                              <span
                                className="text-[9px] text-zinc-400 print:text-zinc-600 truncate flex-1 block"
                                title={ex.notes}
                              >
                                {ex.notes}
                              </span>
                              {isOverridden && (
                                <button
                                  type="button"
                                  onClick={() => resetCellOverride(w.weekNumber, exId)}
                                  className="p-0.5 text-zinc-400 hover:text-white rounded no-print"
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

        <div className="p-3 bg-[#151922] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 no-print">
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
            Usa "Stampa PDF" per esportare la progressione completa su foglio A4 orizzontale.
          </div>
        </div>
      </div>
    </div>
  );
}
