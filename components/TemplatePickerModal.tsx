'use client';

import React, { useState, useMemo } from 'react';
import {
  X, Layers, Check, Search, Filter, Sparkles,
  Dumbbell, Zap, Flame, Shield, Users, Calendar
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

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSelectTemplate,
  athleteName = ''
}: TemplatePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDaysFilter, setSelectedDaysFilter] = useState<number | 'ALL'>('ALL');
  const [genderFilter, setGenderFilter] = useState<Gender>('MALE');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('T01');

  // Catalogo completo 33 schede
  const templates: TemplateMeta[] = useMemo(() => {
    return Array.isArray(ALL_TOPGYM_TEMPLATES) ? ALL_TOPGYM_TEMPLATES : [];
  }, []);

  // Filtro reattivo
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const q = searchQuery.toLowerCase().trim();
      const title = (tpl.title || (tpl as any).name || '').toLowerCase();
      const id = (tpl.id || '').toLowerCase();
      const desc = (tpl.description || '').toLowerCase();
      const engine = (tpl.primaryEngine || (tpl as any).engine || '').toLowerCase();

      const matchesSearch = !q || title.includes(q) || id.includes(q) || desc.includes(q) || engine.includes(q);

      const days = tpl.daysCount || 3;
      const matchesDays = selectedDaysFilter === 'ALL' || days === selectedDaysFilter;

      // Filtro genere
      const isFemaleTemplate = desc.includes('femminile') || title.includes('femminile') || desc.includes('bikini') || desc.includes('glute');
      const matchesGender = genderFilter === 'FEMALE' ? true : !isFemaleTemplate || title.includes('unisex');

      return matchesSearch && matchesDays && (genderFilter === 'FEMALE' ? isFemaleTemplate || !title.includes('uomo') : !isFemaleTemplate);
    });
  }, [templates, searchQuery, selectedDaysFilter, genderFilter]);

  if (!isOpen) return null;

  const handleApply = (tpl: TemplateMeta) => {
    try {
      const days = convertTemplateToProgramDays(tpl, genderFilter);
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
                  Catalogo Master: 33 Template Split
                </h2>
                <p className="text-xs text-zinc-400">
                  {athleteName ? `Assegnazione per atleta: ${athleteName}` : 'Seleziona lo split target da caricare nel Builder'}
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

          {/* BARRA RICERCA & FILTRI RAPIDI */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cerca per nome, metodo (Nocerino, Aceto, Helms...) o codice (T01-T33)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* TOGGLE GENERE */}
            <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setGenderFilter('MALE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  genderFilter === 'MALE'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Uomo
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('FEMALE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  genderFilter === 'FEMALE'
                    ? 'bg-pink-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Donna / Bikini
              </button>
            </div>
          </div>

          {/* FILTRI GIORNI */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-zinc-500 font-mono text-[11px] mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Frequenza:
            </span>
            {(['ALL', 2, 3, 4, 5, 6] as const).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setSelectedDaysFilter(days)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                  selectedDaysFilter === days
                    ? 'bg-white/20 text-white border border-white/20'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {days === 'ALL' ? 'Tutte' : `${days} Giorni`}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-zinc-400 font-mono">
              {filteredTemplates.length} di {templates.length} template disponibili
            </span>
          </div>
        </div>

        {/* LISTA TEMPLATE SCHEDE */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              Nessun template corrispondente ai filtri selezionati.
            </div>
          ) : (
            filteredTemplates.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              const days = tpl.daysCount || 3;
              const engine = tpl.primaryEngine || (tpl as any).engine || 'TOPGYM';

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#181C24] border-[#E50914]/60 shadow-lg shadow-[#E50914]/10'
                      : 'bg-black/30 border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-black">
                        {tpl.id}
                      </span>
                      <span className="text-sm font-black text-white tracking-wide">
                        {tpl.title || (tpl as any).name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono font-bold">
                        {days} Giorni / Settimana
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold">
                        {engine}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                      {tpl.description}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-zinc-500">
                      <span>Gruppo: {tpl.group || 'STANDARD'}</span>
                      <span>•</span>
                      <span>Livello: {(tpl as any).targetLevel || 'INTERMEDIO'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(tpl);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
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
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            Catalogo Master TOP GYM • 33 Template Integrati con Esercizi, Serie, Reps e Motori
          </span>
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
