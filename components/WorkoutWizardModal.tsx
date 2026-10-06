'use client';

import React, { useState } from 'react';
import {
  evaluateAthleteProfile,
  QuestionnaireAnswers,
  EngineRecommendationResult
} from '@/lib/engine-recommender';

interface WorkoutWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEngine: (engine: 'TOPGYM_BLOCKS' | 'HARDTOPGYM' | 'ACETO' | 'NOCERINO') => void;
}

export default function WorkoutWizardModal({
  isOpen,
  onClose,
  onSelectEngine
}: WorkoutWizardModalProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    experience: 'INTERMEDIATE',
    goal: 'HYPERTROPHY',
    daysPerWeek: 3,
    intensity: 'TUT_CONTROLLED',
    horizon: 'LONG_TERM_4_MONTHS'
  });

  const [result, setResult] = useState<EngineRecommendationResult | null>(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const outcome = evaluateAthleteProfile(answers);
    setResult(outcome);
    setStep(6); // Step di visualizzazione verdetto
  };

  const handleApplyEngine = () => {
    if (result) {
      onSelectEngine(result.recommendedEngine);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              TOP GYM · Intelligent Engine Selector
            </div>
            <h2 className="text-lg font-bold text-white">Valutazione Atleta & Assegnazione Scheda</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {step <= 5 && (
          <div className="w-full bg-zinc-900 h-1">
            <div
              className="bg-emerald-500 h-1 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* BODY DEI VARI STEP */}
        <div className="p-6 space-y-6">
          {/* STEP 1: ESPERIENZA */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">1. Qual è l&apos;anzianità di allenamento dell&apos;atleta?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'BEGINNER', label: 'Principiante', desc: '< 1 anno. Apprendimento schemi motori base.' },
                  { id: 'INTERMEDIATE', label: 'Intermedio', desc: '1-3 anni. Buona coordinazione, carichi consolidati.' },
                  { id: 'ADVANCED', label: 'Avanzato', desc: '> 3 anni. Capacità di spinta a cedimento e recupero neurale.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, experience: item.id as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      answers.experience === item.id
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">{item.label}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: GIORNI SETTIMANALI */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">2. Quanti giorni alla settimana può dedicare all&apos;allenamento?</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {([2, 3, 4, 5, 6] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setAnswers({ ...answers, daysPerWeek: days })}
                    className={`p-4 rounded-xl text-center border transition-all ${
                      answers.daysPerWeek === days
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-2xl font-black text-white">{days}</div>
                    <div className="text-xs text-zinc-400 mt-1">Giorni</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: OBIETTIVO */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">3. Qual è l&apos;obiettivo primario del macrociclo?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'HYPERTROPHY', title: 'Ipertrofia Massima', desc: 'Accrescimento volumetrico con densità e sovraccarico concentrico.' },
                  { id: 'STRENGTH_HYPERTROPHY', title: 'Forza Funzionale & Densità', desc: 'Aumento delle percentuali di carico sui multiarticolari primari.' },
                  { id: 'FITNESS_COMPOSITION', title: 'Composizione Corporea & Tono', desc: 'Volume distribuito, miglioramento della capacità di lavoro e tonicità.' },
                  { id: 'CONTEST_PREP', title: 'Preparazione Gara / Dettaglio', desc: 'Mantenimento massa magra con split frequenti e protocolli dedicati.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, goal: item.id as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      answers.goal === item.id
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

          {/* STEP 4: STILE INTENSITÀ & CEDIMENTO */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">4. Quale stimolo meccanico tollera meglio l&apos;atleta?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'TUT_CONTROLLED', title: 'TUT Rigoroso 2-0-2 (Nocerino)', desc: '24" di tensione costante per 6 colpi. Massimale Relativo e cadenza controllata.' },
                  { id: 'FAILURE_PUMP', title: 'Cedimento IIb + Tecniche Speciali (Aceto)', desc: 'Accelerazione concentrica (F=m·a), Rest-Pause, Stripping to 10 e picco contrazione.' },
                  { id: 'FAILURE_HEAVY', title: 'Heavy Duty / Cedimento Totale (They/Bosco)', desc: 'Poche serie portate a esaurimento sistemico, microciclo mensile ormonale.' },
                  { id: 'BUFFER', title: 'Buffer Controllato (TopGym Blocks)', desc: 'Lavoro a RPE 7-8 con margine, evitando il cedimento sistematico a ogni serie.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, intensity: item.id as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      answers.intensity === item.id
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

          {/* STEP 5: ORIZZONTE TEMPORALE */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100">5. Orizzonte di programmazione desiderato:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'LONG_TERM_4_MONTHS', title: 'Macrociclo Strutturato (4 Mesi)', desc: 'Progressione su 4 fasi distinte: Carico → Ripetizioni → Serie → Densità.' },
                  { id: 'CHAMPIONSHIP_6_WEEKS', title: 'Ciclo di Sovraccarico (6 Settimane)', desc: 'Base W1-2, Heavy Overload W3-4, Stripping Peak W5, Deload rigenerativo W6.' },
                  { id: 'CYCLIC_4_WEEKS', title: 'Microciclo Mensile (4 Settimane)', desc: 'Rotazione ormonale con scarico attivo programmato ogni 4 settimane.' },
                  { id: 'SHORT_TERM', title: 'Flessibile / Blocchi Brevi', desc: 'Progressione lineare libera senza vincoli rigidi di chiusura ciclo.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, horizon: item.id as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      answers.horizon === item.id
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

          {/* STEP 6: VERDETTO & RACCOMANDAZIONE */}
          {step === 6 && result && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Motore Ideale Identificato
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {result.recommendedEngine === 'NOCERINO' && '🔬 Metodo PIERO NOCERINO'}
                    {result.recommendedEngine === 'ACETO' && '🏆 Metodo CHRIS ACETO'}
                    {result.recommendedEngine === 'HARDTOPGYM' && '⚡ Metodo HARDTOPGYM (Bosco-Colli)'}
                    {result.recommendedEngine === 'TOPGYM_BLOCKS' && '🧱 Metodo TOPGYM BLOCKS'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Affinità Profilo</div>
                  <div className="text-2xl font-black text-emerald-400">{result.matchScore}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Analisi & Motivazione Scientifica:
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                  {result.rationale}
                </p>
              </div>

              <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Split Consigliata:
                </div>
                <div className="text-sm font-semibold text-emerald-400">{result.suggestedSplit}</div>
              </div>

              {/* BARRE COMPARATIVE DI AFFINITÀ */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase">Punteggi di affinità per motore:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(result.scores).map(([eng, sc]) => (
                    <div key={eng} className="bg-zinc-900 p-2 rounded-lg border border-zinc-800 flex justify-between">
                      <span className="text-zinc-400 font-mono text-[11px]">{eng}</span>
                      <span className="font-bold text-white">{sc} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER & NAVIGAZIONE */}
        <div className="px-6 py-4 bg-zinc-900/80 border-t border-zinc-800 flex justify-between items-center">
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
              onClick={handleCalculate}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              Genera Scheda Ottimale ⚡
            </button>
          )}

          {step === 6 && (
            <button
              type="button"
              onClick={handleApplyEngine}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              Imposta Motore & Apri Cabina Dedicata
            </button>
          )}
        </div>
      </div>
    </div>
  );
}