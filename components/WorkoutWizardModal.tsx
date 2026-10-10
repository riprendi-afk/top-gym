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
import { Zap, Award, CheckCircle, ArrowRight, ArrowLeft, X } from 'lucide-react';

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

  // Risultati generati
  const [allTemplates, setAllTemplates] = useState<TemplateMeta[]>([]);
  const [filterDays, setFilterDays] = useState<number | 'ALL'>(4);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMeta | null>(null);
  const [recommendedTemplate, setRecommendedTemplate] = useState<TemplateMeta | null>(null);
  const [rationale, setRationale] = useState<string>('');

  if (!isOpen) return null;

  // Elaborazione con raccolta di TUTTI i template esistenti nel catalogo (2, 3, 4, 5, 6 giorni)
  const handleGenerate = () => {
    const outcome = resolveTopGymTemplate(gender, level, profile, daysPerWeek, goal);
    setRecommendedTemplate(outcome.recommendedTemplate);
    setSelectedTemplate(outcome.recommendedTemplate);
    setRationale(outcome.rationale);

    // Mappa tutti i template esistenti nel catalogo senza esclusioni
    const frequencies = [2, 3, 4, 5, 6];
    const catalogMap = new Map<string, TemplateMeta>();

    frequencies.forEach((d) => {
      try {
        const res = resolveTopGymTemplate(gender, level, profile, d, goal);
        if (res.recommendedTemplate && res.recommendedTemplate.id) {
          catalogMap.set(res.recommendedTemplate.id, res.recommendedTemplate);
        }
        if (res.availableTemplates && Array.isArray(res.availableTemplates)) {
          res.availableTemplates.forEach((t) => {
            if (t && t.id) catalogMap.set(t.id, t);
          });
        }
      } catch {
        // Fallback trasparente
      }
    });

    const fullCatalog = Array.from(catalogMap.values()).sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true })
    );

    setAllTemplates(fullCatalog);
    setFilterDays(daysPerWeek);
    setStep(6);
  };

  const handleApply = () => {
    if (selectedTemplate) {
      const programDays = convertTemplateToProgramDays(selectedTemplate, gender);
      onApplyProgram(
        programDays,
        selectedTemplate.primaryEngine,
        `✨ Template ${selectedTemplate.id} (${selectedTemplate.title}) su Motore ${selectedTemplate.primaryEngine} con ${selectedTemplate.daysCount} sedute applicato!`
      );
      onClose();
    }
  };

  const activeDaysPreview = selectedTemplate
    ? convertTemplateToProgramDays(selectedTemplate, gender)
    : [];

  // Riconoscimento completo di TUTTI gli 8 Motori Top Gym
  const getEngineBadge = (engine: string) => {
    switch (engine) {
      case 'TOPGYM_BLOCKS':
      case 'TOPGYM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
            TopGym Classic (Blocchi)
          </span>
        );
      case 'HARDTOPGYM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Bosco-Colli (HardTopGym)
          </span>
        );
      case 'NOCERINO':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Biomeccanica Nocerino
          </span>
        );
      case 'ACETO':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-[#E50914] border border-red-500/30">
            Chris Aceto Density
          </span>
        );
      case 'POWERBLOCK_HYBRID':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            Fitschen · PowerBlock
          </span>
        );
      case 'BLOOD_VOLUME_OVERLOAD':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Fitschen · Blood Volume
          </span>
        );
      case 'HELMS_PYRAMID':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Helms · The Pyramid
          </span>
        );
      case 'BIKINI_WAVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">
            Fitschen · Bikini Wave
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
            TopGym Classic (Blocchi)
          </span>
        );
    }
  };

  const displayedTemplates = allTemplates.filter((t) => {
    if (filterDays === 'ALL') return true;
    return t.daysCount === filterDays || (t as any).daysPerWeek === filterDays;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-white">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-10 backdrop-blur-sm">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">
              TOP GYM · Intelligent Engine Triage
            </div>
            <h2 className="text-base font-bold text-white">Generatore Scientifico di Schede</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        {step <= 5 && (
          <div className="w-full bg-zinc-900 h-1.5">
            <div
              className="bg-[#E50914] h-1.5 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* STEP BODY */}
        <div className="p-6 space-y-6">
          
          {/* STEP 1: SESSO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dimensione 1 di 5</div>
              <h3 className="text-lg font-bold text-white">Sesso e Profilo Biomeccanico:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('MALE')}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    gender === 'MALE'
                      ? 'border-blue-500 bg-blue-950/30 text-white shadow-lg shadow-blue-500/10'
                      : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-black text-base text-white mb-1">🏋️‍♂️ Uomo</div>
                  <div className="text-xs text-zinc-400">
                    Bias su spinta/trazione, multiarticolari pesanti e carichi neurali elevati.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('FEMALE')}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    gender === 'FEMALE'
                      ? 'border-pink-500 bg-pink-950/30 text-white shadow-lg shadow-pink-500/10'
                      : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-black text-base text-white mb-1">🏋‍♀️ Donna</div>
                  <div className="text-xs text-zinc-400">
                    Bias su glutei, catena posteriore, V-taper posturale e cardio LISS drenante anti-ritenzione.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ANZIANITÀ */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dimensione 2 di 5</div>
              <h3 className="text-lg font-bold text-white">Anzianità di Allenamento Reale:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'NEOFITA', label: 'Neofita', sub: '< 6 Mesi', desc: 'Progressione lineare, buffer RIR 2, stabilizzazione tecnica.' },
                  { id: 'INTERMEDIO', label: 'Intermedio', sub: '6 - 24 Mesi', desc: 'Schemi stabili, RIR 1-2, progressione settimanale dei carichi.' },
                  { id: 'AVANZATO', label: 'Avanzato', sub: '> 24 Mesi', desc: 'Cedimento reale, tolleranza carichi neurali e tecniche ad alta intensità.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id as TrainingLevel)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      level === item.id
                        ? 'border-[#E50914] bg-red-950/20 text-white'
                        : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-black text-sm text-white">{item.label}</div>
                    <div className="text-[10px] text-[#E50914] font-mono mb-1">{item.sub}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ATTITUDINE PSICOLOGICA */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dimensione 3 di 5</div>
              <h3 className="text-lg font-bold text-white">Attitudine Psicologica all&apos;Effort:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: 'CAUTO_ANSIA_CARICO',
                    title: '🛡️ Cauto / Ansia da Carico',
                    desc: 'Timore sotto carichi liberi pesanti. Ottimale con macchine guidate, cavi e profilo biomeccanico Nocerino.'
                  },
                  {
                    id: 'AGGRESSIVO_NEURALE',
                    title: '⚡ Aggressivo / Neurale',
                    desc: 'Forte grinta agonistica. Ideale con multiarticolari pesanti in CAT e metodo Bosco-Colli.'
                  },
                  {
                    id: 'METABOLICO_PUMPING',
                    title: '🔥 Metabolico / Pumping & Feeling',
                    desc: 'Ama il bruciore e le serie dense. Ottimale con Rest-Pause, Blood Volume e metodo Chris Aceto.'
                  },
                  {
                    id: 'TIME_CONSTRAINED',
                    title: '⏱️ Time-Constrained / Efficienza',
                    desc: 'Poco tempo a disposizione o approccio metodico. Ideale per split compatte, Helms ed efficienza.'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile(item.id as PsychologicalProfile)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      profile === item.id
                        ? 'border-[#E50914] bg-red-950/20 text-white shadow-lg'
                        : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-black text-sm text-white mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: FREQUENZA SETTIMANALE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dimensione 4 di 5</div>
              <h3 className="text-lg font-bold text-white">Frequenza Settimanale (Giorni Effettivi):</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {([2, 3, 4, 5, 6] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysPerWeek(days)}
                    className={`p-4 rounded-2xl text-center border transition-all ${
                      daysPerWeek === days
                        ? 'border-[#E50914] bg-red-950/20 text-white shadow-lg'
                        : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-2xl font-black text-white">{days}</div>
                    <div className="text-xs text-zinc-400 mt-1">Giorni</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: OBIETTIVO PRIMARIO */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dimensione 5 di 5</div>
              <h3 className="text-lg font-bold text-white">Obiettivo Primario della Periodizzazione:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'HYPERTROPHY', title: '💪 Ipertrofia & Volume Target', desc: 'Sovraccarico progressivo, curve di resistenza e massima densità miofibrillare.' },
                  { id: 'STRENGTH', title: '⚡ Forza & Potenza Neurale', desc: 'Reclutamento Big 3, CAT sui multiarticolari fondamentali e percentuali crescenti.' },
                  { id: 'COMPOSITION', title: '⚖️ Ricomposizione & Tono', desc: 'Aumento capacità di lavoro, densità lattacida e protocolli cardio-drenanti.' },
                  { id: 'CONTEST', title: '🏆 Densità Muscolare & Dettaglio', desc: 'Alte frequenze, tecniche speciali estreme e stripping a esaurimento concentrico.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      goal === item.id
                        ? 'border-[#E50914] bg-red-950/20 text-white'
                        : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-black text-sm text-white mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: VERDETTO SCIENTIFICO & SELEZIONE LIBERA */}
          {step === 6 && selectedTemplate && (
            <div className="space-y-5 animate-in fade-in">
              {/* RACCOMANDAZIONE PRIMARIA */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-[#E50914]/40 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#E50914] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Protocollo Scientifico Consigliato
                    </div>
                    <div className="text-lg font-black text-white mt-1">
                      {recommendedTemplate?.id} · {recommendedTemplate?.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEngineBadge(recommendedTemplate?.primaryEngine || '')}
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-black/60 text-zinc-300 border border-white/10">
                      {recommendedTemplate?.daysCount || daysPerWeek} Giorni
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed border-t border-white/5 pt-2">
                  {rationale}
                </p>
              </div>

              {/* SELETTORE FLESSIBILE SU TUTTO IL CATALOGO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                    Scegli qualsiasi template disponibile:
                  </div>
                  <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFilterDays(daysPerWeek)}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        filterDays === daysPerWeek ? 'bg-[#E50914] text-white font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {daysPerWeek}G (Consigliati)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterDays('ALL')}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        filterDays === 'ALL' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Tutti (T01-T33)
                    </button>
                    {([2, 3, 4, 5, 6] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFilterDays(d)}
                        className={`px-1.5 py-0.5 rounded-lg transition ${
                          filterDays === d ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {d}G
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {displayedTemplates.map((tmpl) => {
                    const isSelected = selectedTemplate.id === tmpl.id;
                    const isRecommended = recommendedTemplate?.id === tmpl.id;
                    const sedute = tmpl.daysCount || (tmpl as any).daysPerWeek || daysPerWeek;

                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-[#E50914] bg-red-950/30 text-white shadow-md ring-1 ring-[#E50914]'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white font-mono">{tmpl.id}</span>
                          <div className="flex items-center gap-1">
                            {isRecommended && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E50914] text-white font-black uppercase">
                                Consigliata
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {sedute}G
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-zinc-200 mt-1 line-clamp-1">
                          {tmpl.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1 font-mono flex items-center justify-between">
                          <span>{tmpl.primaryEngine}</span>
                          <span className="capitalize">{(tmpl as any).level || 'all'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ANTEPRIMA SESSIONI SCHEDA SELEZIONATA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase">
                  <span>Anteprima Sessioni ({activeDaysPreview.length} Giorni Reali):</span>
                  <span className="text-[#E50914] font-mono">
                    {selectedTemplate.id}
                  </span>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {activeDaysPreview.map((day: any, i: number) => {
                    const exerciseList =
                      day.exercises ||
                      (day.segments ? day.segments.flatMap((s: any) => s.exercises || []) : []) ||
                      [];

                    return (
                      <div key={day.id || i} className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
                        <div className="font-bold text-white flex justify-between">
                          <span>{day.title}</span>
                          <span className="text-[#E50914] text-[11px] font-mono">
                            {exerciseList.length} esercizi
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 line-clamp-2">
                          {exerciseList.map((e: any) => e.name).join(' · ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Indietro
            </button>
          ) : (
            <div />
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-zinc-200 flex items-center gap-1.5"
            >
              Avanti <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#E50914] text-white hover:bg-red-600 shadow-lg shadow-red-950/40 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-white" /> Elabora Scheda Top Gym
            </button>
          )}

          {step === 6 && (
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#E50914] text-white hover:bg-red-600 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Applica Scheda & Avvia Macrociclo
            </button>
          )}
        </div>

      </div>
    </div>
  );
}