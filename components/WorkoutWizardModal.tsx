'use client';

import React, { useState, useMemo } from 'react';
import {
  Gender,
  TrainingLevel,
  convertTemplateToProgramDays,
  TemplateMeta,
  ALL_TOPGYM_TEMPLATES
} from '@/lib/topgym-catalog';
import { 
  Zap, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Dumbbell, 
  Sparkles, 
  Search, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';

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
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);

  // Preferenze pratiche da palestra
  const [legPreference, setLegPreference] = useState<string>('LEGS_ONCE');
  const [trainingStyle, setTrainingStyle] = useState<string>('MACHINES_PUMP');

  // Stato selezione
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMeta | null>(null);
  const [filterDays, setFilterDays] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalogo unificato di tutti i 33 template
  const fullCatalog: TemplateMeta[] = useMemo(() => {
    if (!Array.isArray(ALL_TOPGYM_TEMPLATES)) return [];
    return [...ALL_TOPGYM_TEMPLATES].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true })
    );
  }, []);

  const getTemplateDaysCount = (tmpl: any): number => {
    if (!tmpl) return 4;
    return (
      tmpl.daysCount ??
      tmpl.daysPerWeek ??
      (Array.isArray(tmpl.days) ? tmpl.days.length : 0) ??
      4
    );
  };

  const getTemplateTitle = (tmpl: any): string => {
    if (!tmpl) return '';
    return tmpl.title || tmpl.name || tmpl.id || 'Template';
  };

  // ==========================================================================
  // MOTORE DI VALUTAZIONE CLINICA & SCORING SU TUTTI I 33 TEMPLATE
  // ==========================================================================
  const diagnosticResult = useMemo(() => {
    if (fullCatalog.length === 0) return null;

    const scored = fullCatalog.map((t: any) => {
      let score = 0;
      const tDays = getTemplateDaysCount(t);
      const title = (getTemplateTitle(t) || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const engine = t.primaryEngine || 'TOPGYM_BLOCKS';

      // 1. Frequenza (giorni)
      if (tDays === daysPerWeek) {
        score += 90;
      } else if (Math.abs(tDays - daysPerWeek) === 1) {
        score += 15;
      } else {
        score -= 90;
      }

      // 2. Filtro Sesso Rigoroso
      const isFemaleTemplate = desc.includes('femminile') || title.includes('femminile') || desc.includes('bikini') || desc.includes('glute') || (t as any).gender === 'FEMALE';
      if (gender === 'FEMALE') {
        if (isFemaleTemplate) score += 60;
        else score -= 60;
      } else {
        if (isFemaleTemplate) score -= 500; // MAI proporre scheda femminile a un uomo
        else score += 30;
      }

      // 3. Gestione Gambe & Split per UOMO
      if (gender === 'MALE') {
        const isUpperLower = title.includes('upper / lower') || title.includes('upper/lower');

        if (legPreference === 'LEGS_ONCE') {
          // Esclusione rigida di Upper/Lower
          if (isUpperLower) score -= 300;

          // 4 GIORNI GAMBE 1X: T16 (Torso / Arti Biomeccanico)
          if (daysPerWeek === 4) {
            if (t.id === 'T16' || title.includes('torso / arti')) score += 200;
          }

          // 3 GIORNI GAMBE 1X: T13 (PPL Biomeccanica) o T12 (PPL Hatfield)
          if (daysPerWeek === 3) {
            if (t.id === 'T13' || t.id === 'T12') score += 150;
          }

          // 5 GIORNI GAMBE 1X: T17 (PPL + Torso/Braccia) o T22 (Monomuscolare)
          if (daysPerWeek === 5) {
            if (t.id === 'T17' || t.id === 'T22') score += 150;
          }
        } else if (legPreference === 'LEGS_BALANCED') {
          // Equilibrato (Upper/Lower 2x)
          if (isUpperLower) score += 120;
          if (t.id === 'T11' || t.id === 'T31') score += 90;
        } else if (legPreference === 'POWER_COMPOUND') {
          // Fondamentali pesanti
          if (t.id === 'T29' || t.id === 'T11' || t.id === 'T31' || engine === 'POWERBLOCK_HYBRID' || engine === 'HARDTOPGYM') score += 120;
        }
      }

      // 4. Gestione per DONNA
      if (gender === 'FEMALE') {
        if (legPreference === 'GLUTES_HYPER') {
          if (['T07', 'T18', 'T28', 'T32', 'T19'].includes(t.id)) score += 100;
          if (desc.includes('glutei') || desc.includes('cerniera')) score += 60;
        } else if (legPreference === 'BIKINI_CONTEST') {
          if (['T32', 'T33', 'T28'].includes(t.id)) score += 120;
          if (engine === 'BIKINI_WAVE' || desc.includes('bikini')) score += 80;
        } else {
          if (['T04', 'T01', 'T18'].includes(t.id)) score += 60;
        }
      }

      // 5. Stile di allenamento & Feeling articolare
      if (trainingStyle === 'MACHINES_PUMP') {
        if (engine === 'NOCERINO' || engine === 'BLOOD_VOLUME_OVERLOAD') score += 50;
        if (desc.includes('biomeccanica') || desc.includes('tensione continua')) score += 30;
      } else if (trainingStyle === 'FREE_WEIGHTS') {
        if (engine === 'HELMS_PYRAMID' || engine === 'POWERBLOCK_HYBRID' || engine === 'HARDTOPGYM') score += 50;
        if (desc.includes('fondamentali') || desc.includes('bilanciere') || desc.includes('rir')) score += 30;
      } else if (trainingStyle === 'DENSITY_BURNOUT') {
        if (engine === 'ACETO' || engine === 'HARDTOPGYM') score += 50;
        if (desc.includes('rest-pause') || desc.includes('cedimento')) score += 30;
      }

      return { template: t, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored[0]?.template || fullCatalog[0];
    const alt = scored.find(s => s.template.id !== top.id)?.template || fullCatalog[1] || top;

    let rationaleText = '';
    if (gender === 'MALE' && legPreference === 'LEGS_ONCE') {
      rationaleText = 'Ideale per chi cerca massimo impatto visivo e divertimento: concentra lo stimolo su sedute Torso/Braccia ad alto pompaggio e riserva una sola seduta mirata alle gambe. Azzerata la noia e garantita la continuita.';
    } else if (gender === 'FEMALE' && legPreference === 'GLUTES_HYPER') {
      rationaleText = 'Priorita assoluta a Glutei e Catena Posteriore, associata a un lavoro Upper snello e a bassa infiammazione per prevenire ritenzione idrica da cortisolo.';
    } else if (gender === 'FEMALE' && legPreference === 'BIKINI_CONTEST') {
      rationaleText = 'Protocollo a onde triadiche: combina carichi pesanti su Hip Thrust e stacchi con pompaggio ad alte ripetizioni sui glutei e v-taper spalle/dorso.';
    } else if (trainingStyle === 'MACHINES_PUMP') {
      rationaleText = 'Focus totale su macchine a traiettoria guidata e cavi a tensione continua: massimizza il reclutamento muscolare proteggendo colonna e articolazioni da sovraccarichi usuranti.';
    } else {
      rationaleText = 'Distribuzione bilanciata con progressione rigorosa dei carichi: perfetta per costruire forza solida e progressione tecnica costante.';
    }

    return {
      topMatch: top,
      alternative: alt,
      rationale: rationaleText
    };
  }, [fullCatalog, gender, daysPerWeek, legPreference, trainingStyle]);

  if (!isOpen) return null;

  const handleNextToDiagnostics = () => {
    if (diagnosticResult?.topMatch) {
      setSelectedTemplate(diagnosticResult.topMatch);
      setFilterDays(daysPerWeek);
    }
    setStep(3);
  };

  const handleApply = () => {
    const target = selectedTemplate || diagnosticResult?.topMatch;
    if (target) {
      const programDays = convertTemplateToProgramDays(target, gender);
      const totalDays = getTemplateDaysCount(target);
      const engineName = target.primaryEngine || 'TOPGYM_BLOCKS';
      const targetTitle = getTemplateTitle(target);
      onApplyProgram(
        programDays,
        engineName,
        `Template ${target.id} (${targetTitle}) su Motore ${engineName} (${totalDays} sedute) applicato con successo!`
      );
      onClose();
    }
  };

  const renderEngineBadge = (engine: string) => {
    switch (engine) {
      case 'NOCERINO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Biomeccanica Nocerino</span>;
      case 'ACETO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-[#E50914] border border-red-500/30">Chris Aceto Density</span>;
      case 'POWERBLOCK_HYBRID':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Fitschen · PowerBlock</span>;
      case 'BLOOD_VOLUME_OVERLOAD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">Fitschen · Blood Volume</span>;
      case 'HELMS_PYRAMID':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Helms · The Pyramid</span>;
      case 'BIKINI_WAVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">Fitschen · Bikini Wave</span>;
      case 'HARDTOPGYM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">HardTopGym · Hatfield</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">TopGym Blocks Lineare</span>;
    }
  };

  const displayedCatalog = fullCatalog.filter((t: any) => {
    const tDays = getTemplateDaysCount(t);
    const matchesDays = filterDays === 'ALL' || tDays === filterDays;
    const q = searchQuery.toLowerCase().trim();
    const title = getTemplateTitle(t).toLowerCase();
    const matchesSearch =
      !q ||
      t.id.toLowerCase().includes(q) ||
      title.includes(q) ||
      ((t.description || '').toLowerCase().includes(q));
    return matchesDays && matchesSearch;
  });

  const activeDaysPreview = selectedTemplate
    ? convertTemplateToProgramDays(selectedTemplate, gender)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

        {/* HEADER MODALE */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0E1116]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center text-[#E50914]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Assistente Decisionale Schede - TOP GYM
              </h3>
              <p className="text-xs text-zinc-400">
                Diagnosi su 33 Template e 8 Motori Scientifici per la massima aderenza
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENUTO A STEP */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase text-[#E50914] tracking-widest">Passo 1 di 2</span>
                <h2 className="text-xl font-black text-white">Chi e l atleta e quanto tempo ha?</h2>
                <p className="text-xs text-zinc-400">Impostiamo la frequenza reale prima di scegliere lo splitting muscolare.</p>
              </div>

              {/* SESSO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Sesso / Profilo Anatomico:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'MALE'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <span>Uomo (Upper / V-Taper)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'FEMALE'
                        ? 'bg-pink-600/20 border-pink-500 text-pink-300 ring-1 ring-pink-500'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <span>Donna (Glutei / Modellamento)</span>
                  </button>
                </div>
              </div>

              {/* FREQUENZA GIORNI */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Frequenza Settimanale Reale:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        daysPerWeek === d
                          ? 'bg-[#E50914]/20 border-[#E50914] text-white ring-1 ring-[#E50914]'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <b className="text-base block">{d}</b>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Giorni</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LIVELLO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Esperienza di Allenamento:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PRINCIPIANTE', label: 'Base / Ripresa', desc: '< 1 anno o stop' },
                    { id: 'INTERMEDIO', label: 'Intermedio', desc: '1 - 3 anni continui' },
                    { id: 'AVANZATO', label: 'Avanzato', desc: '> 3 anni / carichi alti' }
                  ].map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLevel(l.id as TrainingLevel)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        level === l.id
                          ? 'bg-white/10 border-white/40 text-white'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <b className="text-xs block text-white">{l.label}</b>
                      <span className="text-[10px] text-zinc-400">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#E50914] text-white font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                >
                  Continua al Passo 2 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase text-[#E50914] tracking-widest">Passo 2 di 2</span>
                <h2 className="text-xl font-black text-white">Focus Muscolare & Sensibilita Articolare</h2>
                <p className="text-xs text-zinc-400">Adattiamo la scheda al feeling della persona per garantire continuita.</p>
              </div>

              {/* FOCUS GAMBE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  {gender === 'MALE' ? 'Come vuole gestire le Gambe?' : 'Priorita Silhouette & Lower Body:'}
                </label>
                <div className="space-y-2">
                  {gender === 'MALE' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setLegPreference('LEGS_ONCE')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'LEGS_ONCE'
                            ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-sm text-white">Gambe 1x a settimana (Focus Upper Body)</b>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">Piu Amata in Sala</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            Sedute dedicate a Petto, Dorso, Spalle e Braccia piene, con 1 sola seduta Gambe concentrata. Zero noia e massima aderenza.
                          </p>
                        </div>
                        {legPreference === 'LEGS_ONCE' && <Check className="w-5 h-5 text-[#E50914]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLegPreference('LEGS_BALANCED')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'LEGS_BALANCED'
                            ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <b className="text-sm text-white">Equilibrato (50% Torso / 50% Gambe)</b>
                          <p className="text-xs text-zinc-400 mt-1">
                            Upper / Lower classico con 2 sedute di gambe a settimana per chi vuole sviluppo proporzionato.
                          </p>
                        </div>
                        {legPreference === 'LEGS_BALANCED' && <Check className="w-5 h-5 text-[#E50914]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLegPreference('POWER_COMPOUND')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'POWER_COMPOUND'
                            ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <b className="text-sm text-white">Power & Fondamentali Pesanti (Squat, Panca, Stacco)</b>
                          <p className="text-xs text-zinc-400 mt-1">
                            Per chi ama caricare i dischi e testare serie AMRAP sui Big 3.
                          </p>
                        </div>
                        {legPreference === 'POWER_COMPOUND' && <Check className="w-5 h-5 text-[#E50914]" />}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setLegPreference('GLUTES_HYPER')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'GLUTES_HYPER'
                            ? 'bg-zinc-900 border-pink-500 ring-1 ring-pink-500'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-sm text-white">Focus Glutei & Catena Posteriore (Upper Snello)</b>
                            <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded font-bold">Consigliata</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            Stimolo primario su Hip Thrust, stacchi e slanci; stimolo Upper drenante senza ingrossare il torace.
                          </p>
                        </div>
                        {legPreference === 'GLUTES_HYPER' && <Check className="w-5 h-5 text-pink-500" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLegPreference('BIKINI_CONTEST')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'BIKINI_CONTEST'
                            ? 'bg-zinc-900 border-pink-500 ring-1 ring-pink-500'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <b className="text-sm text-white">Bikini Wave & Clessidra (Glutei + Spalle/V-Taper)</b>
                          <p className="text-xs text-zinc-400 mt-1">
                            Onde a 3 settimane con carichi pesanti alternati ad alto volume metabolico per linea snella.
                          </p>
                        </div>
                        {legPreference === 'BIKINI_CONTEST' && <Check className="w-5 h-5 text-pink-500" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLegPreference('BALANCED_FIT')}
                        className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          legPreference === 'BALANCED_FIT'
                            ? 'bg-zinc-900 border-pink-500 ring-1 ring-pink-500'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <b className="text-sm text-white">Total Body Tonificazione Equilibrata</b>
                          <p className="text-xs text-zinc-400 mt-1">
                            Distribuzione uniforme su tutto il corpo per benessere generale.
                          </p>
                        </div>
                        {legPreference === 'BALANCED_FIT' && <Check className="w-5 h-5 text-pink-500" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* STILE DI ALLENAMENTO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Sensibilita Articolare & Feeling Preferito:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MACHINES_PUMP', label: 'Macchine, Cavi & Pump', desc: 'Zero usura articolare, convergenze guidate, ottimo pompaggio.' },
                    { id: 'FREE_WEIGHTS', label: 'Bilancieri & Forza', desc: 'Movimenti liberi, gestione RIR progressiva e carichi crescenti.' },
                    { id: 'DENSITY_BURNOUT', label: 'Alta Densita & Intensita', desc: 'Rest-Pause, TUT controllato e cedimento muscolare mirato.' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTrainingStyle(s.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        trainingStyle === s.id
                          ? 'bg-white/10 border-white/50 text-white ring-1 ring-white/50'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <b className="text-xs block text-white">{s.label}</b>
                      <span className="text-[10px] text-zinc-400 block mt-1">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 font-bold text-xs uppercase hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Indietro
                </button>

                <button
                  type="button"
                  onClick={handleNextToDiagnostics}
                  className="px-6 py-3 rounded-xl bg-[#E50914] text-white font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                >
                  Genera Diagnosi & Schede <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && diagnosticResult && (
            <div className="space-y-6">
              
              {/* BOX TOP MATCH */}
              <div className="bg-gradient-to-br from-zinc-900 via-[#161a22] to-zinc-900 border-2 border-[#E50914] rounded-2xl p-5 shadow-2xl relative">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#E50914] text-white flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3" /> Top Match 100%
                    </span>
                    {renderEngineBadge(diagnosticResult.topMatch.primaryEngine)}
                    <span className="text-[11px] font-mono text-zinc-400">
                      ID: <b className="text-white">{diagnosticResult.topMatch.id}</b> · {getTemplateDaysCount(diagnosticResult.topMatch)} Giorni
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(diagnosticResult.topMatch);
                      handleApply();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E50914] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Carica Questa Scheda Consigliata
                  </button>
                </div>

                <h3 className="text-lg font-black text-white">
                  {getTemplateTitle(diagnosticResult.topMatch)}
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  {diagnosticResult.topMatch.description}
                </p>

                {/* RAZIONALE PRATICO */}
                <div className="mt-3 bg-black/40 border border-white/5 rounded-xl p-3 flex items-start gap-2.5 text-xs text-zinc-300">
                  <Info className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <b className="text-white block text-[11px] uppercase tracking-wider mb-0.5">Perche questa scelta per il tuo cliente:</b>
                    <span>{diagnosticResult.rationale}</span>
                  </div>
                </div>

                {/* ALTERNATIVA */}
                {diagnosticResult.alternative && diagnosticResult.alternative.id !== diagnosticResult.topMatch.id && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">Alternativa Valida:</span>
                      <b className="text-white">[{diagnosticResult.alternative.id}] {getTemplateTitle(diagnosticResult.alternative)}</b>
                      {renderEngineBadge(diagnosticResult.alternative.primaryEngine)}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(diagnosticResult.alternative)}
                      className="text-xs text-[#E50914] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Visualizza Alternativa <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* ANTEPRIMA */}
              {selectedTemplate && (
                <div className="bg-[#0E1116] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-[#E50914]" />
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Anteprima Sedute: {getTemplateTitle(selectedTemplate)} [{selectedTemplate.id}]
                      </h4>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {activeDaysPreview.length} Sedute Generate
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {activeDaysPreview.map((day: any, dIdx: number) => (
                      <div key={day.id || dIdx} className="bg-zinc-900/70 border border-white/5 p-3 rounded-lg space-y-1.5">
                        <b className="text-xs text-white block truncate">{day.title || ('Giorno ' + (dIdx + 1))}</b>
                        <span className="text-[10px] text-zinc-400 block font-mono">
                          {day.exercises?.length || 0} esercizi
                        </span>
                        <div className="text-[10px] text-zinc-500 line-clamp-2">
                          {(day.exercises || []).slice(0, 3).map((e: any) => e.name).join(', ')}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATALOGO COMPLETO 33 TEMPLATE */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-zinc-400" />
                      Esplora Tutti i {fullCatalog.length} Template del Catalogo
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Puoi ignorare il consiglio automatico e scegliere manualmente qualsiasi scheda:
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-[11px]">
                      {(['ALL', 2, 3, 4, 5, 6] as const).map(f => (
                        <button
                          key={String(f)}
                          type="button"
                          onClick={() => setFilterDays(f)}
                          className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                            filterDays === f
                              ? 'bg-[#E50914] text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {f === 'ALL' ? 'Tutti' : (f + 'G')}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cerca T01, Hatfield..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {displayedCatalog.map(tmpl => {
                    const isSelected = selectedTemplate?.id === tmpl.id;
                    const daysCount = getTemplateDaysCount(tmpl);
                    const titleText = getTemplateTitle(tmpl);

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <b className="text-[11px] font-mono text-[#E50914]">{tmpl.id}</b>
                            {renderEngineBadge(tmpl.primaryEngine)}
                          </div>
                          <b className={`text-xs block line-clamp-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                            {titleText}
                          </b>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {daysCount} Giorni · {tmpl.group || 'Completo'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 font-bold text-xs uppercase hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Modifica Risposte
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    Selezionato: <b className="text-white">[{selectedTemplate?.id || diagnosticResult.topMatch.id}]</b>
                  </span>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-6 py-3 rounded-xl bg-[#E50914] text-white font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    <Check className="w-4 h-4" /> Carica Scheda Selezionata
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}