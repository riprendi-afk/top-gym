'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  UserCheck,
  Check,
  Lock,
  Unlock,
  Calendar,
  RefreshCw,
  Layers,
  Dumbbell,
  Printer,
  Plus,
  Trash2,
  Pencil,
  BookmarkPlus
} from 'lucide-react';
import {
  ENGINE_METADATA,
  resolveEngineKey,
  generateMacrocycleTimeline,
  ProjectedWeek,
  ExerciseWeekOverride,
  SupportedMethod
} from '@/lib/topgym-timeline-generator';
import {
  buildTemplateDaysSnapshot,
  saveCustomTemplateToSupabase,
  CustomTemplateCategory
} from '@/lib/custom-templates';

interface MacrocycleTimelineModalProps {
  programName?: string;
  onProgramNameChange?: (name: string) => void;
  onOpenTemplatePicker?: () => void;
  readOnly?: boolean;
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
  programName = '',
  onProgramNameChange,
  onOpenTemplatePicker,
  readOnly = false,
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

  const [activeMethodKey, setActiveMethodKey] = useState<SupportedMethod>(resolveEngineKey(programmingModel));
  const methodKey = activeMethodKey;
  const meta = ENGINE_METADATA[methodKey];

  const [localDays, setLocalDays] = useState<any[]>(programDays || []);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [localOverrides, setLocalOverrides] = useState<Record<number, Record<string, ExerciseWeekOverride>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [tplTitle, setTplTitle] = useState('');
  const [tplDescription, setTplDescription] = useState('');
  const [tplCategory, setTplCategory] = useState<CustomTemplateCategory>('MALE');
  const [clearAthleteWeights, setClearAthleteWeights] = useState(true);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateToast, setTemplateToast] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDayIdx(0);
    if (programDays && programDays.length > 0) {
      setLocalDays(programDays);
      setLocalOverrides(programDays[0]?.weekOverrides || {});
      const detected = programDays[0]?.method || programDays[0]?.programmingModel || programmingModel;
      if (detected) setActiveMethodKey(resolveEngineKey(detected));
    } else {
      setLocalDays([]);
      setLocalOverrides({});
      if (programmingModel) setActiveMethodKey(resolveEngineKey(programmingModel));
    }
  }, [athleteId, programDays, programmingModel]);

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

  const buildFullMatrixState = () => {
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
                reps: String(ex.reps || '6'),
                targetWeight: String(ex.targetWeight || ex.weight || '0'),
                weight: String(ex.weight || ex.targetWeight || '0'),
                restSeconds: Number(ex.restSeconds) || 90,
                rpeTarget: ex.rpeTarget || 'RPE 8',
                notes: ex.notes || '',
                isDeload: !!w.isDeload,
              };
            }
          });
        });
      });
    }

    if (localOverrides) {
      Object.keys(localOverrides).forEach((wKey) => {
        const wNum = Number(wKey);
        if (!completeOverrides[wNum]) completeOverrides[wNum] = {};
        Object.keys(localOverrides[wNum]).forEach((exId) => {
          completeOverrides[wNum][exId] = {
            ...(completeOverrides[wNum][exId] || {}),
            ...localOverrides[wNum][exId],
          };
        });
      });
    }

    const updatedDays = localDays.map((d: any, dIdx: number) => {
      const w1Day = timeline?.[0]?.days?.[dIdx];
      const updatedExercises = (d.exercises || []).map((ex: any) => {
        const w1Ex = w1Day?.exercises?.find((e: any) => e.id === ex.id);
        const overrideW1 = completeOverrides?.[1]?.[ex.id];
        return {
          ...ex,
          sets: overrideW1?.sets ?? (w1Ex ? Number(w1Ex.sets) : ex.sets),
          reps: overrideW1?.reps ?? (w1Ex ? String(w1Ex.reps) : ex.reps),
          targetWeight: overrideW1?.targetWeight ?? (w1Ex ? String(w1Ex.targetWeight) : (ex.targetWeight || ex.weight || '0')),
          weight: overrideW1?.weight ?? (w1Ex ? String(w1Ex.weight) : (ex.weight || ex.targetWeight || '0')),
          restSeconds: overrideW1?.restSeconds ?? (w1Ex ? Number(w1Ex.restSeconds) : ex.restSeconds),
          notes: overrideW1?.notes ?? (w1Ex ? String(w1Ex.notes) : ex.notes),
        };
      });

      return {
        ...d,
        exercises: updatedExercises,
        weekOverrides: completeOverrides,
        method: activeMethodKey,
        programmingModel: activeMethodKey,
      };
    });

    return { updatedDays, completeOverrides };
  };

  const handleOpenSaveTemplateModal = () => {
    const defaultName = programName?.trim()
      ? `${programName.trim()} (Custom)`
      : `Split ${localDays.length}G Personalizzato`;
    setTplTitle(defaultName);
    setTplDescription('');
    setIsTemplateModalOpen(true);
  };

  const handleConfirmSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplTitle.trim()) return;

    setIsSavingTemplate(true);
    try {
      const { updatedDays } = buildFullMatrixState();
      const snapshotDays = buildTemplateDaysSnapshot(updatedDays, clearAthleteWeights);

      const res = await saveCustomTemplateToSupabase({
        title: tplTitle.trim(),
        description: tplDescription.trim(),
        category: tplCategory,
        primaryEngine: activeMethodKey,
        days: snapshotDays,
      });

      if (res.success) {
        setIsTemplateModalOpen(false);
        setTemplateToast(
          res.warning
            ? `Template "${tplTitle.trim()}" salvato! (${res.warning})`
            : `Template "${tplTitle.trim()}" aggiunto al Catalogo su Supabase!`
        );
        setTimeout(() => setTemplateToast(null), 5000);
      }
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const executeIsolatedPrint = (printAllSessions: boolean) => {
    const sessionsToPrint = printAllSessions
      ? (timeline[0]?.days || []).map((_, idx) => idx)
      : [selectedDayIdx];
    const totalWeeks = timeline.length;
    const modelTitle = meta?.name || programmingModel || 'Top Gym Macrocycle';
    const CHUNK_SIZE = 8;
    const weekChunks: ProjectedWeek[][] = [];
    for (let i = 0; i < timeline.length; i += CHUNK_SIZE) {
      weekChunks.push(timeline.slice(i, i + CHUNK_SIZE));
    }
    const totalSheets = sessionsToPrint.length * (weekChunks.length || 1);
    let currentSheetIndex = 0;

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>TOP GYM - ${athleteName}</title><style>@page{size:A4 landscape;margin:6mm}*{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif}body{background:#fff;color:#000;font-size:8.5pt}.sheet{page-break-after:always;margin-bottom:20px}.sheet:last-child{page-break-after:auto}.header-box{display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:6px}table{width:100%;border-collapse:collapse;font-size:8pt}th,td{border:1px solid #666;padding:5px 3px;text-align:center}th{background:#f2f2f2;font-weight:800}.th-exercise{text-align:left;padding-left:8px;width:22%;background:#e8e8e8}.col-deload{background:#eaf3ff}</style></head><body>`;

    sessionsToPrint.forEach((dayIdx) => {
      const sessionTitle = dayList[dayIdx]?.title || `Sessione ${dayIdx + 1}`;
      const currentExercises = timeline[0]?.days[dayIdx]?.exercises || [];
      weekChunks.forEach((chunk, chunkIdx) => {
        currentSheetIndex++;
        const startWeek = chunk[0]?.weekNumber || 1;
        const endWeek = chunk[chunk.length - 1]?.weekNumber || chunk.length;
        html += `<div class="sheet"><div class="header-box"><div><h1>TOP GYM • ${athleteName}</h1><div>${modelTitle} — <b>${sessionTitle}</b> (W${startWeek}–W${endWeek})</div></div><div>Sheet ${currentSheetIndex}/${totalSheets}</div></div><table><thead><tr><th class="th-exercise">Esercizio</th>${chunk.map(w => `<th>W${w.weekNumber}</th>`).join('')}</tr></thead><tbody>${currentExercises.map((baseEx, exIdx) => `<tr><td class="th-exercise"><b>${baseEx.name}</b></td>${chunk.map(w => { const ex = w.days[dayIdx]?.exercises[exIdx]; return ex ? `<td><b>${ex.sets}x${ex.reps}</b> ${ex.weight ? ex.weight + 'kg' : ''}</td>` : '<td>-</td>'; }).join('')}</tr>`).join('')}</tbody></table></div>`;
      });
    });

    html += `</body></html>`;
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
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
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => printFrame.remove(), 1500);
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
          [exId]: { ...exMap, [field]: value }
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
          [exId]: { ...exMap, isLocked: !currentLock }
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
      return { ...prev, [weekNum]: weekMap };
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

  const handleChangeStimulus = (exIdx: number, newStimulus: 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC') => {
    const currentEx = localDays[selectedDayIdx]?.exercises?.[exIdx];
    if (!currentEx) return;
    const exId = currentEx.id;
    setLocalDays(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[selectedDayIdx]?.exercises?.[exIdx]) {
        copy[selectedDayIdx].exercises[exIdx].stimulus = newStimulus;
        copy[selectedDayIdx].exercises[exIdx].stimulusType = newStimulus;
      }
      return copy;
    });
    if (exId) {
      setLocalOverrides(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(wKey => {
          const wNum = Number(wKey);
          if (next[wNum] && next[wNum][exId] && !next[wNum][exId]?.isLocked) {
            const weekMap = { ...next[wNum] };
            delete weekMap[exId];
            next[wNum] = weekMap;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  };

  const handleEditExercise = (exIdx: number, currentName: string) => {
    const newName = prompt("Modifica o sostituisci questo esercizio:", currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;
    setLocalDays(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[selectedDayIdx]?.exercises?.[exIdx]) {
        copy[selectedDayIdx].exercises[exIdx].name = newName.trim();
      }
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
      const { updatedDays, completeOverrides } = buildFullMatrixState();
      setLocalDays(updatedDays);
      if (onSaveOverrides) await onSaveOverrides(updatedDays, completeOverrides);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Errore salvataggio matrice:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={inline ? "w-full my-2" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"}>
      <div className={inline ? "bg-[#10131A] border-2 border-zinc-700/80 rounded-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" : "bg-[#10131A] border-2 border-zinc-700/80 rounded-2xl w-full max-w-[98vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden"}>

        {templateToast && (
          <div className="bg-indigo-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
            <span>{templateToast}</span>
            <button type="button" onClick={() => setTemplateToast(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-3.5 border-b-2 border-zinc-700/70 flex flex-wrap items-center justify-between gap-3 bg-[#181C26]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E50914] text-white rounded-xl shadow-lg shadow-red-900/50">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Matrice Macrociclo: <span className="text-red-500 font-extrabold">{athleteName}</span>
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold text-white bg-zinc-700/70 border border-zinc-500/50 px-2 py-0.5 rounded font-mono">
                  {meta?.name || programmingModel}
                </span>
                <span className="text-xs text-zinc-300 font-medium hidden md:inline">
                  • {timeline.length} Microcicli
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {onProgramNameChange && (
              <div className="flex items-center gap-1.5 bg-[#0C0E14] border border-zinc-600 rounded-xl px-3 py-1.5">
                <span className="text-[10px] font-bold text-zinc-300 uppercase">Nome:</span>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => onProgramNameChange(e.target.value)}
                  placeholder="Nome Scheda..."
                  className="bg-transparent text-xs text-white font-bold outline-none w-44 sm:w-56"
                />
              </div>
            )}

            {onOpenTemplatePicker && (
              <button
                type="button"
                onClick={onOpenTemplatePicker}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Template Split</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenSaveTemplateModal}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-indigo-400/30"
              title="Salva l'intera matrice W1-W16 nel catalogo"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Salva Template</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                saveSuccess ? 'bg-emerald-400 text-black' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              <span>{saveSuccess ? 'Assegnata!' : isSaving ? 'Salvataggio...' : 'Salva e Assegna'}</span>
            </button>

            <button
              type="button"
              onClick={() => executeIsolatedPrint(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Stampa PDF</span>
            </button>

            <button
              type="button"
              onClick={handleAddExercise}
              className="px-3 py-2 rounded-xl text-xs font-black uppercase bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Esercizio</span>
            </button>

            {!inline && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-300 hover:text-white bg-zinc-800 border border-zinc-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 py-2 bg-[#141822] border-b border-zinc-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-black uppercase text-zinc-300 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Sessione:
            </span>
            {dayList.map(d => (
              <button
                key={d.index}
                type="button"
                onClick={() => setSelectedDayIdx(d.index)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedDayIdx === d.index ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{d.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#0C0E14]">
          <table className="w-full border-collapse text-left min-w-max">
            <thead className="sticky top-0 z-30 bg-[#161A24] border-b-2 border-zinc-700">
              <tr>
                <th className="sticky left-0 z-40 bg-[#161A24] p-3 text-xs font-black uppercase text-white min-w-[260px] border-r-2 border-zinc-700">
                  Esercizio & Parametri
                </th>
                {timeline.map(w => (
                  <th key={w.weekNumber} className={`p-2.5 text-center min-w-[190px] border-r border-zinc-700/80 ${w.isDeload ? 'bg-blue-950/30' : ''}`}>
                    <div className="font-black text-sm text-white font-mono">W{w.weekNumber}</div>
                    <div className="text-[10px] text-zinc-300 truncate max-w-[180px]">{w.phaseLabel.replace(/^W\d+:\s*/, '')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/60 text-xs">
              {exercisesForDay.map((baseEx, exIdx) => {
                const exId = baseEx.id || `ex_${selectedDayIdx}_${exIdx}`;
                const isLocked = localOverrides[1]?.[exId]?.isLocked ?? baseEx.isLocked;
                return (
                  <tr key={exId} className="hover:bg-white/[0.03]">
                    <td className="sticky left-0 z-20 bg-[#141822] p-3 min-w-[260px] border-r-2 border-zinc-700">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 overflow-hidden flex-1">
                          <button
                            type="button"
                            onClick={() => toggleExerciseLock(exId, !!isLocked)}
                            className={`mt-0.5 p-1.5 rounded-lg border cursor-pointer ${isLocked ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300 border-zinc-600'}`}
                          >
                            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          <div className="overflow-hidden">
                            <span className="font-black text-white text-xs block truncate">{baseEx.name}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-zinc-300 font-mono">{baseEx.muscle}</span>
                              <select
                                value={(baseEx.stimulus || 'HYPERTROPHIC').toUpperCase()}
                                onChange={(e) => handleChangeStimulus(exIdx, e.target.value as 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC')}
                                className="text-[8.5px] font-mono font-bold uppercase rounded px-1.5 py-0.5 border bg-zinc-900 text-emerald-300 border-zinc-600"
                              >
                                <option value="NEURAL">NEURAL</option>
                                <option value="HYPERTROPHIC">HYPERTROPHIC</option>
                                <option value="METABOLIC">METABOLIC</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handleEditExercise(exIdx, baseEx.name)} className="text-zinc-400 hover:text-amber-300 p-1"><Pencil className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleRemoveExercise(exIdx, baseEx.name)} className="text-zinc-400 hover:text-rose-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </td>
                    {timeline.map(w => {
                      const ex = w.days[selectedDayIdx]?.exercises[exIdx];
                      if (!ex) return <td key={w.weekNumber} className="border-r border-zinc-700/80 p-2 text-center text-zinc-500">-</td>;
                      const rawWeight = ex.weight ?? ex.targetWeight ?? '';
                      const displayWeight = (rawWeight === 'undefined' || rawWeight === undefined || rawWeight === null) ? '' : rawWeight;
                      return (
                        <td key={w.weekNumber} className="p-2 border-r border-zinc-700/80 align-top bg-[#12151D]">
                          <div className="bg-[#181C26] border border-zinc-700 rounded-xl p-2 space-y-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <label className="text-[9px] font-black uppercase text-zinc-300 block mb-0.5">Serie</label>
                                <input type="number" value={ex.sets ?? ''} onChange={e => handleCellChange(w.weekNumber, exId, 'sets', parseInt(e.target.value, 10) || '')} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-lg px-1 py-1 text-center font-black text-white text-xs" />
                              </div>
                              <span className="text-zinc-400 font-bold pt-3.5">x</span>
                              <div className="flex-1">
                                <label className="text-[9px] font-black uppercase text-zinc-300 block mb-0.5">Reps</label>
                                <input type="text" value={ex.reps ?? ''} onChange={e => handleCellChange(w.weekNumber, exId, 'reps', e.target.value)} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-lg px-1 py-1 text-center font-bold text-white text-xs font-mono" />
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <label className="text-[9px] font-black uppercase text-zinc-300 block mb-0.5">Carico</label>
                                <input type="text" value={displayWeight} placeholder="0 kg" onChange={e => handleCellChange(w.weekNumber, exId, 'weight', e.target.value)} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-lg px-1 py-1 text-center font-bold text-emerald-400 text-xs font-mono" />
                              </div>
                              <div className="flex-1">
                                <label className="text-[9px] font-black uppercase text-zinc-300 block mb-0.5">Rec (s)</label>
                                <input type="number" step="5" value={ex.restSeconds ?? ''} onChange={e => handleCellChange(w.weekNumber, exId, 'restSeconds', parseInt(e.target.value, 10) || 0)} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-lg px-1 py-1 text-center font-bold text-amber-300 text-xs font-mono" />
                              </div>
                            </div>
                            <div className="pt-1 border-t border-zinc-700/80 flex items-center justify-between text-[10px]">
                              <span className="text-zinc-400 truncate">{ex.notes || 'Progressione'}</span>
                              {ex.isOverridden && (
                                <button type="button" onClick={() => resetCellOverride(w.weekNumber, exId)} className="p-1 text-amber-400 hover:text-white"><RefreshCw className="w-3 h-3" /></button>
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
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleConfirmSaveTemplate} className="bg-[#161A24] border-2 border-indigo-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-3">
              <div className="flex items-center gap-2.5">
                <BookmarkPlus className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-black text-white text-sm uppercase">Salva nel Catalogo Template</h3>
                  <p className="text-[11px] text-zinc-400">Conserva tutte le {timeline.length} settimane su Supabase</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-300 block mb-1">Nome del Template *</label>
                <input type="text" required value={tplTitle} onChange={(e) => setTplTitle(e.target.value)} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-xl px-3 py-2 text-xs text-white font-bold" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-300 block mb-1">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: 'MALE', label: 'Uomo' }, { id: 'FEMALE', label: 'Donna' }, { id: 'POSTURAL', label: 'Postura' }].map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setTplCategory(cat.id as CustomTemplateCategory)} className={`py-2 rounded-xl text-xs font-bold border ${tplCategory === cat.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-[#0C0E14] border-zinc-700 text-zinc-400'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-300 block mb-1">Descrizione (Opzionale)</label>
                <textarea rows={2} value={tplDescription} onChange={(e) => setTplDescription(e.target.value)} className="w-full bg-[#0C0E14] border border-zinc-600 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <label className="flex items-start gap-2.5 bg-black/30 p-3 rounded-xl border border-zinc-700/80 cursor-pointer">
                <input type="checkbox" checked={clearAthleteWeights} onChange={(e) => setClearAthleteWeights(e.target.checked)} className="mt-0.5" />
                <span className="text-[11px] text-zinc-300">
                  <b className="text-white">Azzera i carichi (kg) dell&apos;atleta</b> mantenendo intatte serie, ripetizioni, recuperi e note da W1 a W16.
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl">Annulla</button>
              <button type="submit" disabled={isSavingTemplate} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl">
                {isSavingTemplate ? 'Salvataggio...' : 'Salva Template'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}