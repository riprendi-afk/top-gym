'use client';

import React, { useState } from 'react';
import {
  Gender,
  TrainingLevel,
  PsychologicalProfile,
  resolveTopGymTemplate,
  convertTemplateToProgramDays,
  TemplateMeta
} from '@/lib/topgym-catalog';

interface WorkoutWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProgram: (days: any[], engine: string, message: string) => void;
}

export default function WorkoutWizardModal({
  isOpen,
  onClose,
  onApplyProgram
}: WorkoutWizardModalProps) {
  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<Gender>('MALE');
  const [level, setLevel] = useState<TrainingLevel>('INTERMEDIO');
  const [profile, setProfile] = useState<PsychologicalProfile>('METABOLICO_PUMPING');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [goal, setGoal] = useState<string>('HYPERTROPHY');

  const [generatedResult, setGeneratedResult] = useState<{
    template: TemplateMeta;
    rationale: string;
    programDays: any[];
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const { template, rationale } = resolveTopGymTemplate(
      gender,
      level,
      profile,
      daysPerWeek
    );
    const programDays = convertTemplateToProgramDays(template, gender);
    setGeneratedResult({ template, rationale, programDays });
    setStep(6);
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyProgram(
        generatedResult.programDays,
        generatedResult.template.primaryEngine,
        `✨ Template ${generatedResult.template.id} (${generatedResult.template.title}) applicato con successo!`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-white">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              TOP GYM · Intelligent Engine Selector
            </div>
            <h2 className="text-base font-bold text-white">Generatore Scientifico di Schede</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* PROGRESS BAR */}
        {step <= 5 && (
          <div className="w-full bg-zinc-900 h-1">
            <div
              className="bg-emerald-500 h-1 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* STEP BODY */}
        <div className="p-6 space-y-6">
          {/* STEP 1: SESSO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dimensione A</div>
              <h3 className="text-base font-bold text-zinc-100">1. Sesso e Profilo Biomeccanico:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('MALE')}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    gender === 'MALE'
                      ? 'border-blue-500 bg-blue-950/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">🏋️‍♂️ Uomo</div>
                  <div className="text-xs text-zinc-400">
                    Bias volumetrico standard su torso e catena di spinta/trazione; carichi neurali e recuperi pieni.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('FEMALE')}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    gender === 'FEMALE'
                      ? 'border-pink-500 bg-pink-950/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">🏋️‍♀️ Donna</div>
                  <div className="text-xs text-zinc-400">
                    Bias su glutei, catena posteriore e V-taper; recuperi densi e cardio LISS drenante.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ANZIANITÀ */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dimensione B</div>
              <h3 className="text-base font-bold text-zinc-100">2. Anzianità di Allenamento:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'NEOFITA', label: 'Neofita', sub: '< 6 Mesi', desc: 'Tecnica da consolidare, progressioni lineari, cedimento solo tecnico.' },
                  { id: 'INTERMEDIO', label: 'Intermedio', sub: '6 - 24 Mesi', desc: 'Schemi motori stabili, tolleranza a RIR 1-2, modulazione settimanale.' },
                  { id: 'AVANZATO', label: 'Avanzato', sub: '> 24 Mesi', desc: 'Cedimento concentrico reale, carichi elevati e tecniche speciali di intensità.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id as TrainingLevel)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      level === item.id
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{item.label}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mb-1">{item.sub}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ATTITUDINE PSICOLOGICA ALL'EFFORT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Dimensione C</div>
              <h3 className="text-base font-bold text-zinc-100">3. Profilo Psicologico & Percezione dell&apos;Effort:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: 'CAUTO_ANSIA_CARICO',
                    title: '🛡️ Cauto / Ansia da Carico',
                    desc: 'Bassa tolleranza psicologica sotto carichi liberi pesanti. Preferisce macchine guidate, manubri e progressioni a buffer (RIR 2-3).'
                  },
                  {
                    id: 'AGGRESSIVO_NEURALE',
                    title: '⚡ Aggressivo / Neurale',
                    desc: 'Spinta agonistica, tendenza a forzare i carichi a discapito della tecnica. Richiede vincoli CAT e buffer obbligatorio sui fondamentali.'
                  },
                  {
                    id: 'METABOLICO_PUMPING',
                    title: '🔥 Metabolico / Pumping & Feeling',
                    desc: 'Ama il bruciore muscolare, contrazioni di picco, superset e pause brevi. Ottimale con Stripping, Back-Off e serie 10+MAX.'
                  },
                  {
                    id: 'TIME_CONSTRAINED',
                    title: '⏱️ Time-Constrained / Efficienza',
                    desc: 'Poco tempo o scarsa pazienza per routine lunghe. Richiede sessioni brevi, dense ad alta densità concentrata.'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile(item.id as PsychologicalProfile)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      profile === item.id
                        ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-lg shadow-emerald-500/10'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: FREQUENZA SETTIMANALE */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">4. Frequenza di Allenamento Settimanale:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {([2, 3, 4, 5, 6] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysPerWeek(days)}
                    className={`p-4 rounded-xl text-center border transition-all ${
                      daysPerWeek === days
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-2xl font-black text-white">{days}</div>
                    <div className="text-xs text-zinc-400 mt-1">Giorni / Sett</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: OBIETTIVO */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">5. Obiettivo Primario del Macrociclo:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'HYPERTROPHY', title: 'Ipertrofia Massima', desc: 'Sovraccarico progressivo, densità e volume mirato.' },
                  { id: 'STRENGTH', title: 'Forza Funzionale', desc: 'Aumento delle percentuali di carico sui multiarticolari primari.' },
                  { id: 'COMPOSITION', title: 'Ricomposizione & Tono', desc: 'Miglioramento della capacità di lavoro e gestione del lattato.' },
                  { id: 'CONTEST', title: 'Qualità Muscolare / Dettaglio', desc: 'Frequenza alta e isolamento per densità profonda.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      goal === item.id
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: VERDETTO & ANTEPRIMA SCHEDA */}
          {step === 6 && generatedResult && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Template Top Gym Selezionato
                  </div>
                  <div className="text-xl font-black text-white mt-0.5">
                    {generatedResult.template.id} · {generatedResult.template.title}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Motore di base: <span className="text-emerald-400 font-bold">{generatedResult.template.primaryEngine}</span> · {generatedResult.template.daysCount} Sedute
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Razionale di Programmazione Top Gym:
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {generatedResult.rationale}
                </p>
              </div>

              {/* ANTEPRIMA SEDUTE */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-zinc-400 uppercase">Anteprima Sessioni Calcolate:</div>
                {generatedResult.programDays.map((day: any, i: number) => (
                  <div key={day.id || i} className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs">
                    <div className="font-bold text-white mb-1">{day.title}</div>
                    <div className="text-zinc-400 text-[11px]">
                      {day.exercises?.length} esercizi (Segmenti Hatfield, serie e recuperi configurati)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-zinc-900/80 border-t border-zinc-800 flex justify-between items-center sticky bottom-0">
          {step > 1 && step <= 5 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800"
            >
              Indietro
            </button>
          ) : (
            <div />
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-zinc-200"
            >
              Avanti
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              Elabora Scheda Top Gym ⚡
            </button>
          )}

          {step === 6 && (
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              Applica Scheda alla WebApp & Avvia Macrociclo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}