// components/ProgramBuilderAccordion.tsx
'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Plus, Trash2, Dumbbell, 
  Flame, Zap, Settings2, ArrowUp, ArrowDown, Edit3, X, Check
} from 'lucide-react';
import { ALL_MUSCLE_TARGETS, MuscleTarget, resolveMuscleTarget } from '@/lib/topgym-volume';

export interface BuilderExercise {
  id: string;
  name: string;
  sets: number | string;
  reps: string;
  weight?: number | string;
  rpe?: number | string;
  restSeconds?: number;
  tut?: string;
  muscleGroup?: string;
  notes?: string;
  stimulusType?: 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';
}

export interface BuilderWorkoutDay {
  id: string;
  name: string;
  exercises: BuilderExercise[];
}

interface ProgramBuilderAccordionProps {
  days: BuilderWorkoutDay[];
  onUpdateDays: (days: BuilderWorkoutDay[]) => void;
  onAddDay: () => void;
}

export default function ProgramBuilderAccordion({
  days,
  onUpdateDays,
  onAddDay
}: ProgramBuilderAccordionProps) {
  // Solo il primo giorno aperto di default, gli altri chiusi
  const [openDayId, setOpenDayId] = useState<string | null>(days[0]?.id || null);
  
  // Stato form aggiunta/modifica esercizio per uno specifico giorno
  const [activeFormDayId, setActiveFormDayId] = useState<string | null>(null);
  const [editingExId, setEditingExId] = useState<string | null>(null);

  // Campi form esercizio
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState<MuscleTarget>('Petto');
  const [exSets, setExSets] = useState('4');
  const [exReps, setExReps] = useState('8-10');
  const [exWeight, setExWeight] = useState('');
  const [exRpe, setExRpe] = useState('8');
  const [exRest, setExRest] = useState('90');
  const [exTut, setExTut] = useState('2-0-1-0');
  const [exNotes, setExNotes] = useState('');
  const [exStimulus, setExStimulus] = useState<'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC'>('HYPERTROPHIC');

  // Toggle apertura/chiusura giorno
  const toggleDay = (dayId: string) => {
    setOpenDayId(prev => prev === dayId ? null : dayId);
    setActiveFormDayId(null);
    resetForm();
  };

  const resetForm = () => {
    setEditingExId(null);
    setExName('');
    setExMuscle('Petto');
    setExSets('4');
    setExReps('8-10');
    setExWeight('');
    setExRpe('8');
    setExRest('90');
    setExTut('2-0-1-0');
    setExNotes('');
    setExStimulus('HYPERTROPHIC');
  };

  // Applicazione rapida preset stimolo TOP GYM
  const applyStimulusPreset = (type: 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC') => {
    setExStimulus(type);
    if (type === 'NEURAL') {
      setExSets('4');
      setExReps('4-6');
      setExRpe('8');
      setExRest('180');
      setExTut('3-0-1-0');
      setExNotes('Buffer RIR 2-3. Spinta esplosiva, controllo eccentrico.');
    } else if (type === 'HYPERTROPHIC') {
      setExSets('4');
      setExReps('8-10');
      setExRpe('8.5');
      setExRest('120');
      setExTut('2-0-1-0');
      setExNotes('Tensione meccanica costante, fermo isometrico 1".');
    } else {
      setExSets('3');
      setExReps('12-15');
      setExRpe('9.5');
      setExRest('60');
      setExTut('2-0-2-0');
      setExNotes('Stress metabolico e pump. Cedricimento o parziali finali.');
    }
  };

  // Apertura form per nuovo esercizio
  const handleOpenAddForm = (dayId: string) => {
    resetForm();
    setActiveFormDayId(dayId);
    setOpenDayId(dayId);
  };

  // Apertura form per modifica esercizio esistente
  const handleOpenEditForm = (dayId: string, ex: BuilderExercise) => {
    setEditingExId(ex.id);
    setExName(ex.name);
    setExMuscle((ex.muscleGroup as MuscleTarget) || resolveMuscleTarget(ex.name) || 'Petto');
    setExSets(String(ex.sets || '4'));
    setExReps(ex.reps || '8-10');
    setExWeight(ex.weight !== undefined ? String(ex.weight) : '');
    setExRpe(ex.rpe !== undefined ? String(ex.rpe) : '8');
    setExRest(ex.restSeconds !== undefined ? String(ex.restSeconds) : '90');
    setExTut(ex.tut || '2-0-1-0');
    setExNotes(ex.notes || '');
    setExStimulus(ex.stimulusType || 'HYPERTROPHIC');
    setActiveFormDayId(dayId);
    setOpenDayId(dayId);
  };

  // Salvataggio esercizio (Nuovo o Modifica)
  const handleSaveExercise = (dayId: string) => {
    if (!exName.trim()) return;

    const targetMuscle = exMuscle || resolveMuscleTarget(exName) || 'Petto';

    const exerciseData: BuilderExercise = {
      id: editingExId || `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: exName.trim(),
      muscleGroup: targetMuscle,
      sets: parseInt(exSets, 10) || 4,
      reps: exReps.trim() || '8-10',
      weight: exWeight ? parseFloat(exWeight) : undefined,
      rpe: exRpe ? parseFloat(exRpe) : 8,
      restSeconds: parseInt(exRest, 10) || 90,
      tut: exTut.trim() || '2-0-1-0',
      notes: exNotes.trim() || undefined,
      stimulusType: exStimulus
    };

    const updated = days.map(d => {
      if (d.id !== dayId) return d;
      if (editingExId) {
        return {
          ...d,
          exercises: d.exercises.map(e => e.id === editingExId ? exerciseData : e)
        };
      }
      return {
        ...d,
        exercises: [...d.exercises, exerciseData]
      };
    });

    onUpdateDays(updated);
    setActiveFormDayId(null);
    resetForm();
  };

  // Eliminazione esercizio
  const handleDeleteExercise = (dayId: string, exId: string) => {
    const updated = days.map(d => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        exercises: d.exercises.filter(e => e.id !== exId)
      };
    });
    onUpdateDays(updated);
  };

  // Sposta esercizio Su / Giù
  const handleMoveExercise = (dayId: string, index: number, direction: 'UP' | 'DOWN') => {
    const day = days.find(d => d.id === dayId);
    if (!day) return;
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= day.exercises.length) return;

    const newExercises = [...day.exercises];
    const temp = newExercises[index];
    newExercises[index] = newExercises[targetIdx];
    newExercises[targetIdx] = temp;

    const updated = days.map(d => d.id === dayId ? { ...d, exercises: newExercises } : d);
    onUpdateDays(updated);
  };

  // Modifica nome giorno
  const handleUpdateDayName = (dayId: string, newName: string) => {
    const updated = days.map(d => d.id === dayId ? { ...d, name: newName } : d);
    onUpdateDays(updated);
  };

  // Elimina giorno
  const handleDeleteDay = (dayId: string) => {
    if (!confirm('Vuoi eliminare questa giornata e tutti i suoi esercizi?')) return;
    onUpdateDays(days.filter(d => d.id !== dayId));
  };

  return (
    <div className="space-y-4">
      {/* LISTA DEI GIORNI AD ACCORDION */}
      {days.map((day, dIdx) => {
        const isOpen = openDayId === day.id;
        const totalSets = day.exercises.reduce((acc, e) => acc + (Number(e.sets) || 0), 0);

        // Raccolta distretti unici del giorno
        const muscleGroups = Array.from(new Set(
          day.exercises.map(e => e.muscleGroup || resolveMuscleTarget(e.name)).filter(Boolean)
        ));

        return (
          <div 
            key={day.id || dIdx}
            className="bg-[#12151B] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all"
          >
            {/* INTESTAZIONE GIORNATA (ACCORDION HEADER) */}
            <div 
              onClick={() => toggleDay(day.id)}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition select-none"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-8 h-8 rounded-xl bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center font-black text-[#E50914] text-xs">
                  {dIdx + 1}
                </div>

                <div>
                  <input
                    type="text"
                    value={day.name}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleUpdateDayName(day.id, e.target.value)}
                    className="bg-transparent font-bold text-white text-sm sm:text-base outline-none focus:border-b focus:border-[#E50914] transition"
                  />
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                    <span>{day.exercises.length} esercizi</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{totalSets} serie totali</span>
                    {muscleGroups.length > 0 && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-zinc-500 font-mono">
                          {muscleGroups.slice(0, 3).join(', ')}{muscleGroups.length > 3 ? '...' : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDay(day.id);
                  }}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 transition rounded-lg"
                  title="Elimina giornata"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-1 text-zinc-400">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* CONTENUTO GIORNATA APERTA */}
            {isOpen && (
              <div className="p-4 sm:p-5 border-t border-white/5 space-y-4 bg-black/20">
                {/* LISTA ESERCIZI DEL GIORNO */}
                {day.exercises.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-xs text-zinc-500 italic">
                    Nessun esercizio inserito in questa giornata. Clicca &quot;Aggiungi Esercizio&quot; per iniziare.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {day.exercises.map((ex, exIdx) => {
                      const muscle = ex.muscleGroup || resolveMuscleTarget(ex.name) || 'Petto';
                      const stimulus = ex.stimulusType || 'HYPERTROPHIC';

                      return (
                        <div 
                          key={ex.id || exIdx}
                          className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3 hover:border-white/15 transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-[11px] font-mono text-zinc-500 w-4 text-center">
                              {exIdx + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs sm:text-sm truncate">
                                  {ex.name}
                                </span>
                                
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                                  {muscle}
                                </span>

                                {stimulus === 'NEURAL' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5" /> Neurale
                                  </span>
                                )}
                                {stimulus === 'HYPERTROPHIC' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                    <Dumbbell className="w-2.5 h-2.5" /> Meccanico
                                  </span>
                                )}
                                {stimulus === 'METABOLIC' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5" /> Metabolico
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 mt-1 font-mono flex-wrap">
                                <span className="text-white font-bold">{ex.sets} × {ex.reps}</span>
                                {ex.weight ? <span className="text-zinc-300">@ {ex.weight} kg</span> : null}
                                {ex.rpe ? <span className="text-zinc-400">RPE {ex.rpe}</span> : null}
                                {ex.restSeconds ? <span className="text-zinc-400">Rec: {ex.restSeconds}s</span> : null}
                                {ex.tut ? <span className="text-zinc-500">TUT: {ex.tut}</span> : null}
                              </div>

                              {ex.notes && (
                                <p className="text-[10px] text-zinc-500 italic mt-0.5 truncate">
                                  {ex.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* TASTI AZIONE ESERCIZIO */}
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={exIdx === 0}
                                onClick={() => handleMoveExercise(day.id, exIdx, 'UP')}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={exIdx === day.exercises.length - 1}
                                onClick={() => handleMoveExercise(day.id, exIdx, 'DOWN')}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(day.id, ex)}
                              className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-white/5"
                              title="Modifica parametri"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteExercise(day.id, ex.id)}
                              className="p-2 text-zinc-500 hover:text-rose-400 transition rounded-lg hover:bg-rose-500/10"
                              title="Rimuovi esercizio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* FORM AGGIUNTA / MODIFICA ESERCIZIO DEDICATO */}
                {activeFormDayId === day.id ? (
                  <div className="bg-black/40 border border-[#E50914]/30 p-4 rounded-xl space-y-4 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-[#E50914]" />
                        {editingExId ? 'Modifica Esercizio' : 'Nuovo Esercizio per questa Giornata'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => { setActiveFormDayId(null); resetForm(); }}
                        className="text-zinc-500 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* PRESET STIMOLO TOP GYM */}
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                        Target Stimolo (Compilazione Rapida)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => applyStimulusPreset('NEURAL')}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 ${
                            exStimulus === 'NEURAL' 
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' 
                              : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Zap className="w-3 h-3" /> Neurale (4-6)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyStimulusPreset('HYPERTROPHIC')}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 ${
                            exStimulus === 'HYPERTROPHIC' 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                              : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Dumbbell className="w-3 h-3" /> Meccanico (8-10)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyStimulusPreset('METABOLIC')}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 ${
                            exStimulus === 'METABOLIC' 
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                              : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Flame className="w-3 h-3" /> Metabolico (12+)
                        </button>
                      </div>
                    </div>

                    {/* NOME & DISTRETTO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Nome Esercizio</label>
                        <input
                          type="text"
                          value={exName}
                          placeholder="es. Panca Piana Bilanciere, Lat Machine..."
                          onChange={e => {
                            setExName(e.target.value);
                            const detected = resolveMuscleTarget(e.target.value);
                            if (detected) setExMuscle(detected);
                          }}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Gruppo Muscolare</label>
                        <select
                          value={exMuscle}
                          onChange={e => setExMuscle(e.target.value as MuscleTarget)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#E50914]"
                        >
                          {ALL_MUSCLE_TARGETS.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* PARAMETRI: SERIE, REPS, PESO, RPE, RECUPERO, TUT */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Serie</label>
                        <input
                          type="number"
                          value={exSets}
                          onChange={e => setExSets(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Reps</label>
                        <input
                          type="text"
                          value={exReps}
                          onChange={e => setExReps(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Target Kg</label>
                        <input
                          type="number"
                          placeholder="Opt."
                          value={exWeight}
                          onChange={e => setExWeight(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">RPE</label>
                        <input
                          type="number"
                          step="0.5"
                          value={exRpe}
                          onChange={e => setExRpe(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">Rec (sec)</label>
                        <input
                          type="number"
                          step="15"
                          value={exRest}
                          onChange={e => setExRest(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold block mb-1">TUT</label>
                        <input
                          type="text"
                          value={exTut}
                          onChange={e => setExTut(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white text-center outline-none focus:border-[#E50914]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Note Tecniche (Opzionali)</label>
                      <input
                        type="text"
                        value={exNotes}
                        placeholder="es. Fermo al petto 1 secondo, RIR 2, eccentrica lenta..."
                        onChange={e => setExNotes(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#E50914]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setActiveFormDayId(null); resetForm(); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition"
                      >
                        Annulla
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveExercise(day.id)}
                        className="bg-[#E50914] hover:bg-[#b80710] text-white px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {editingExId ? 'Aggiorna Esercizio' : 'Inserisci Esercizio'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenAddForm(day.id)}
                    className="w-full py-2.5 border border-dashed border-white/10 hover:border-white/30 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5 bg-zinc-900/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#E50914]" /> Aggiungi Esercizio a questa Giornata
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* TASTO AGGIUNGI GIORNATA */}
      <button
        type="button"
        onClick={onAddDay}
        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
      >
        <Plus className="w-4 h-4 text-[#E50914]" /> Aggiungi Nuova Giornata (Split)
      </button>
    </div>
  );
}