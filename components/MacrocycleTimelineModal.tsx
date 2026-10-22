// components/MacrocycleTimelineModal.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  X, Check, Lock, Unlock, Calendar, Save,
  RefreshCw, Layers, Dumbbell, Sparkles
} from 'lucide-react';
import {
  SupportedMethod,
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

  const initialOverrides = useMemo<Record<number, Record<string, ExerciseWeekOverride>>>(() => {
    return programDays?.[0]?.weekOverrides || {};
  }, [programDays]);

  const [localOverrides, setLocalOverrides] = useState<Record<number, Record<string, ExerciseWeekOverride>>>(initialOverrides);

  // Sincronizzazione istantanea al cambio atleta/scheda
  React.useEffect(() => {
    setLocalOverrides(programDays?.[0]?.weekOverrides || {});
    setSelectedDayIdx(0);
  }, [athleteId, programDays]);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Genera l'intera matrice temporale di tutte le settimane
  const timeline = useMemo<ProjectedWeek[]>(() => {
    if (!programDays || programDays.length === 0) return [];
    return generateMacrocycleTimeline(programDays, methodKey, localOverrides);
  }, [programDays, methodKey, localOverrides]);

  const dayList = useMemo(() => {
    if (!timeline[0] || !timeline[0].days) return [];
    return timeline[0].days.map((d, idx) => ({
      index: idx,
      title: d.title || `Sessione ${String.fromCharCode(65 + idx)}`
    }));
  }, [timeline]);

  // Lista esercizi del giorno selezionato
  const exercisesForDay = useMemo(() => {
    if (!timeline[0] || !timeline[0].days || !timeline[0].days[selectedDayIdx]) return [];
    return timeline[0].days[selectedDayIdx].exercises;
  }, [timeline, selectedDayIdx]);

  if (!isOpen) return null;

  // Modifica singola cella per una determinata settimana ed esercizio
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

  // Toggle Lock su tutte le settimane per quell'esercizio (Option B)
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

  // Reset override di una specifica cella
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

  // Salvataggio su Supabase
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSaveOverrides) {
        const updatedDays = programDays.map(d => ({
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0F1218] border border-white/10 rounded-2xl w-full max-w-[98vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER MODALE */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#151922]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#E50914] text-white rounded-xl shadow-lg shadow-red-900/40">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  Matrice Macrociclo Completa: <span className="text-[#E50914]">{athleteName}</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-white bg-white/10 px-2 py-0.5 rounded font-mono">
                    {meta.name}
                  </span>
                  <span className="text-xs text-zinc-400 hidden md:inline">
                    • {timeline.length} Microcicli proiettati • {meta.macrocycleSummary}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
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
            <span>Visualizzazione Macrociclo Completa (W1 - W{timeline.length})</span>
          </div>
        </div>

        {/* GRIGLIA MATRICE COMPLETA A SCORRIMENTO */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0A0C10]">
          <table className="w-full border-collapse text-left min-w-max">
            
            {/* INTESTAZIONE: SETTIMANE E FASI SCIENTIFICHE */}
            <thead className="sticky top-0 z-30 bg-[#151922] shadow-md border-b border-white/10">
              <tr>
                {/* COLONNA 1 FISSA: ESERCIZI */}
                <th className="sticky left-0 z-40 bg-[#151922] p-3 text-xs font-black uppercase tracking-wider text-zinc-300 min-w-[260px] max-w-[280px] border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.6)]">
                  Esercizio & Target
                </th>

                {/* COLONNE SETTIMANE W1 ... W16 */}
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
                      className={`p-2.5 text-center min-w-[190px] max-w-[210px] border-r border-white/5 ${
                        w.isDeload ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white font-mono">
                            W{w.weekNumber}
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

            {/* CORPO: RIGHE DEGLI ESERCIZI */}
            <tbody className="divide-y divide-white/5 text-xs">
              {exercisesForDay.map((baseEx, exIdx) => {
                const exId = baseEx.id || `ex_${selectedDayIdx}_${exIdx}`;
                
                // Controlla se l'esercizio è bloccato (Lock attivo)
                const isLocked = localOverrides[1]?.[exId]?.isLocked ?? baseEx.isLocked;

                return (
                  <tr key={exId} className="hover:bg-white/[0.02] transition">
                    
                    {/* COLONNA 1 FISSA: NOME ESERCIZIO & CONTROLLI */}
                    <td className="sticky left-0 z-20 bg-[#12151B] p-3 min-w-[260px] max-w-[280px] border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.6)]">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleExerciseLock(exId, !!isLocked)}
                          className={`mt-0.5 p-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
                            isLocked
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-white/5 text-zinc-400 hover:text-white border-white/10'
                          }`}
                          title={isLocked ? "Esercizio bloccato dal Coach su tutte le settimane" : "Blocca questo esercizio dalle variazioni automatiche"}
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
                            <span className={`text-[8px] font-mono px-1 rounded uppercase font-bold ${
                              baseEx.stimulus === 'NEURAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : baseEx.stimulus === 'METABOLIC'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {baseEx.stimulus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CELLE DI TUTTE LE SETTIMANE W1 ... W16 */}
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
                            
                            {/* SERIE & RIPETIZIONI */}
                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">Serie</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
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

                            {/* CARICO & RPE */}
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
                                <label className="text-[8px] font-black uppercase text-zinc-400 block mb-0.5">RPE</label>
                                <input
                                  type="text"
                                  value={ex.rpe ?? ''}
                                  placeholder="@"
                                  onChange={e => handleCellChange(w.weekNumber, exId, 'rpe', e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded px-1 py-1 text-center font-bold text-amber-400 text-[11px] font-mono outline-none focus:border-[#E50914]"
                                />
                              </div>
                            </div>

                            {/* NOTE & STATO */}
                            <div className="pt-1 border-t border-white/5 flex items-center justify-between gap-1">
                              <span
                                className="text-[10px] text-zinc-400 truncate flex-1 block"
                                title={ex.notes}
                              >
                                {ex.notes}
                              </span>
                              {isOverridden && (
                                <button
                                  type="button"
                                  onClick={() => resetCellOverride(w.weekNumber, exId)}
                                  className="p-0.5 text-zinc-400 hover:text-white rounded"
                                  title="Ripristina valore calcolato dal motore"
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

        {/* FOOTER LEGENDA E STATO */}
        <div className="p-3 bg-[#151922] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Modifica Coach Manuale (Override)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Bloccato 🔒 (Lock Esercizio)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Scarico / Deload SNC</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Picco Neurale / Sovraccarico</span>
            </span>
          </div>

          <div className="text-[11px] text-zinc-400">
            Scorri in orizzontale per ispezionare tutti i microcicli del macrociclo.
          </div>
        </div>

      </div>
    </div>
  );
}
