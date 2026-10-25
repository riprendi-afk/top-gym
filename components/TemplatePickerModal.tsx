'use client';

import React, { useState, useMemo } from 'react';
import {
  X, Layers, Check, Search, Calendar,
  Dumbbell, Sparkles, Shield, Flame, Activity, Zap
} from 'lucide-react';
import {
  ALL_TOPGYM_TEMPLATES,
  convertTemplateToProgramDays,
  Gender,
  TemplateMeta
} from '@/lib/topgym-catalog';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (days: any[], templateName: string) => void;
  currentBlock?: any;
  athleteName?: string;
  [key: string]: any;
}

type TemplateCategory = 'ALL' | 'MALE' | 'FEMALE' | 'POSTURAL';
type MethodologyFilter = 'ALL' | 'CLASSICO' | 'HATFIELD' | 'NOCERINO' | 'ACETO' | 'HELMS_FITSCHEN' | 'SCOLIOSI';

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSelectTemplate,
  athleteName = ''
}: TemplatePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDaysFilter, setSelectedDaysFilter] = useState<number | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory>('ALL');
  const [methodologyFilter, setMethodologyFilter] = useState<MethodologyFilter>('ALL');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('T01');

  const templates: TemplateMeta[] = useMemo(() => {
    return Array.isArray(ALL_TOPGYM_TEMPLATES) ? ALL_TOPGYM_TEMPLATES : [];
  }, []);

  const getTemplateClassification = (tpl: TemplateMeta): 'MALE' | 'FEMALE' | 'POSTURAL' => {
    const id = (tpl.id || '').toUpperCase();
    const title = (tpl.title || (tpl as any).name || '').toLowerCase();
    const desc = (tpl.description || '').toLowerCase();

    if (
      id.startsWith('SCO-') ||
      id.startsWith('TG-O40') ||
      title.includes('scoliosi') ||
      desc.includes('scoliosi') ||
      title.includes('postur') ||
      desc.includes('postur') ||
      title.includes('asimmetr') ||
      desc.includes('asimmetr') ||
      desc.includes('decompressione')
    ) {
      return 'POSTURAL';
    }

    if (
      title.includes('femminile') ||
      desc.includes('femminile') ||
      title.includes('bikini') ||
      desc.includes('bikini') ||
      title.includes('glute') ||
      desc.includes('glutei') ||
      (tpl as any).gender === 'female' ||
      (tpl as any).gender === 'FEMALE'
    ) {
      return 'FEMALE';
    }

    return 'MALE';
  };

  const getTemplateMethodology = (tpl: TemplateMeta): MethodologyFilter => {
    const id = (tpl.id || '').toUpperCase();
    const engine = (tpl.primaryEngine || (tpl as any).engine || '').toUpperCase();
    const title = (tpl.title || (tpl as any).name || '').toLowerCase();
    const desc = (tpl.description || '').toLowerCase();

    if (id.startsWith('SCO-') || title.includes('scoliosi') || desc.includes('scoliosi')) {
      return 'SCOLIOSI';
    }
    if (engine.includes('HATFIELD') || title.includes('hatfield') || desc.includes('hatfield')) {
      return 'HATFIELD';
    }
    if (engine.includes('NOCERINO') || title.includes('nocerino') || desc.includes('nocerino') || title.includes('biomeccanic')) {
      return 'NOCERINO';
    }
    if (engine.includes('ACETO') || engine.includes('HARDTOPGYM') || title.includes('aceto') || desc.includes('aceto') || title.includes('arnold') || title.includes('they')) {
      return 'ACETO';
    }
    if (engine.includes('HELMS') || engine.includes('POWERBLOCK') || engine.includes('BLOOD_VOLUME') || engine.includes('BIKINI_WAVE') || title.includes('fitschen') || title.includes('helms')) {
      return 'HELMS_FITSCHEN';
    }
    return 'CLASSICO';
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const q = searchQuery.toLowerCase().trim();
      const title = (tpl.title || (tpl as any).name || '').toLowerCase();
      const id = (tpl.id || '').toLowerCase();
      const desc = (tpl.description || '').toLowerCase();
      const engine = (tpl.primaryEngine || (tpl as any).engine || '').toLowerCase();

      const matchesSearch = !q || title.includes(q) || id.includes(q) || desc.includes(q) || engine.includes(q);

      const days = tpl.daysCount || (tpl as any).daysPerWeek || 3;
      const matchesDays = selectedDaysFilter === 'ALL' || days === selectedDaysFilter;

      const classification = getTemplateClassification(tpl);
      const matchesCategory = categoryFilter === 'ALL' || categoryFilter === classification;

      const methodology = getTemplateMethodology(tpl);
      const matchesMethodology = methodologyFilter === 'ALL' || methodologyFilter === methodology;

      return matchesSearch && matchesDays && matchesCategory && matchesMethodology;
    });
  }, [templates, searchQuery, selectedDaysFilter, categoryFilter, methodologyFilter]);

  if (!isOpen) return null;

  const handleApply = (tpl: TemplateMeta) => {
    try {
      const classification = getTemplateClassification(tpl);
      const genderParam: Gender = classification === 'FEMALE' ? 'FEMALE' : 'MALE';
      const days = convertTemplateToProgramDays(tpl, genderParam);
      const title = tpl.title || (tpl as any).name || tpl.id || 'Template Top Gym';
      onSelectTemplate(days, title);
      onClose();
    } catch (e) {
      console.error("Errore caricamento template:", e);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER MODALE */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col gap-3 bg-black/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-[#E50914]" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  Catalogo Master Split & Metodologie
                </h2>
                <p className="text-xs text-zinc-400">
                  {athleteName ? `Assegnazione scheda per atleta: ${athleteName}` : 'Seleziona lo split target da caricare nel Builder'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BARRA RICERCA & FILTRI CATEGORIA A 3 COLORI */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1 items-stretch sm:items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cerca per codice (T01-T35, SCO), nome, stimolo o metodo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-xl shrink-0 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  categoryFilter === 'ALL'
                    ? 'bg-white/20 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Tutti
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('MALE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === 'MALE'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Uomo
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('FEMALE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === 'FEMALE'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40'
                    : 'text-pink-400 hover:bg-pink-500/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                Donna / Bikini
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('POSTURAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === 'POSTURAL'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Scoliosi / Postura
              </button>
            </div>
          </div>

          {/* FILTRI METODOLOGIA & FREQUENZA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] w-full sm:w-auto">
              <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold mr-1 shrink-0">Metodo:</span>
              {[
                { id: 'ALL', label: 'Tutti' },
                { id: 'CLASSICO', label: 'Top Gym Classico' },
                { id: 'HATFIELD', label: 'Hatfield' },
                { id: 'NOCERINO', label: 'Nocerino' },
                { id: 'ACETO', label: 'They / Aceto' },
                { id: 'HELMS_FITSCHEN', label: 'Helms & Fitschen' },
                { id: 'SCOLIOSI', label: 'Scoliosi' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethodologyFilter(m.id as MethodologyFilter)}
                  className={`px-2 py-0.5 rounded-md font-mono transition shrink-0 cursor-pointer ${
                    methodologyFilter === m.id
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-zinc-400 hover:text-white bg-black/30 hover:bg-white/5'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0 text-xs">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {(['ALL', 2, 3, 4, 5, 6] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSelectedDaysFilter(days)}
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] transition cursor-pointer ${
                    selectedDaysFilter === days
                      ? 'bg-[#E50914] text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {days === 'ALL' ? 'Tutte' : `${days}G`}
                </button>
              ))}
              <span className="text-[10px] text-zinc-500 font-mono ml-1">
                ({filteredTemplates.length})
              </span>
            </div>
          </div>
        </div>

        {/* LISTA SCHEDE A 3 COLORI */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              Nessun template corrispondente ai filtri selezionati.
            </div>
          ) : (
            filteredTemplates.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              const days = tpl.daysCount || (tpl as any).daysPerWeek || 3;
              const engine = tpl.primaryEngine || (tpl as any).engine || 'TOPGYM';
              const classification = getTemplateClassification(tpl);

              let borderStyle = 'border-white/5 hover:border-white/15 bg-black/30 hover:bg-white/5';
              let badgeColor = 'bg-white/10 text-zinc-300 border-white/20';
              let buttonBg = 'bg-[#E50914] hover:bg-red-600 text-white';
              let idTagColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';

              if (classification === 'MALE') {
                idTagColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                badgeColor = 'bg-blue-950/40 text-blue-300 border-blue-500/30';
                buttonBg = 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white';
                borderStyle = isSelected
                  ? 'bg-[#101827] border-blue-500/80 shadow-lg shadow-blue-950/30'
                  : 'bg-black/30 border-white/5 hover:border-blue-500/30 hover:bg-blue-950/10';
              } else if (classification === 'FEMALE') {
                idTagColor = 'bg-pink-500/20 text-pink-400 border-pink-500/30';
                badgeColor = 'bg-pink-950/40 text-pink-300 border-pink-500/30';
                buttonBg = 'bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white';
                borderStyle = isSelected
                  ? 'bg-[#221018] border-pink-500/80 shadow-lg shadow-pink-950/30'
                  : 'bg-black/30 border-white/5 hover:border-pink-500/30 hover:bg-pink-950/10';
              } else if (classification === 'POSTURAL') {
                idTagColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                badgeColor = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30';
                buttonBg = 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white';
                borderStyle = isSelected
                  ? 'bg-[#0E2018] border-emerald-500/80 shadow-lg shadow-emerald-950/30'
                  : 'bg-black/30 border-white/5 hover:border-emerald-500/30 hover:bg-emerald-950/10';
              }

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${borderStyle}`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded border font-mono font-black ${idTagColor}`}>
                        {tpl.id}
                      </span>
                      <span className="text-sm font-black text-white tracking-wide">
                        {tpl.title || (tpl as any).name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${badgeColor}`}>
                        {days} Giorni / Settimana
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-mono font-bold">
                        {engine}
                      </span>
                      {classification === 'POSTURAL' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Decompressione Rachide
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                      {tpl.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-zinc-500">
                      <span>Gruppo: {tpl.group || 'STANDARD'}</span>
                      <span>•</span>
                      <span>Categoria: {
                        classification === 'MALE' ? 'Uomo / Forza' :
                        classification === 'FEMALE' ? 'Donna / Bikini' : 'Scoliosi & Postura'
                      }</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(tpl);
                      }}
                      className={`px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${buttonBg}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Carica Scheda</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> 🔵 Uomo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> 🌸 Donna
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 🟢 Scoliosi & Postura
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
}
