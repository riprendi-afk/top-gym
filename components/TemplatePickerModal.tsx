'use client';

import React, { useState } from 'react';
import { X, Sparkles, Dumbbell, Check, Layers, User } from 'lucide-react';
import { 
  getRecommendedTemplatesForBlock, 
  detectAthleteGender, 
  TopGymSplitTemplate 
} from '@/lib/topgym-templates';
import { MacroBlock } from '@/lib/topgym-engine';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlock: MacroBlock;
  athleteName?: string;
  onSelectTemplate: (days: any[], templateName: string) => void;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  currentBlock,
  athleteName = '',
  onSelectTemplate
}: TemplatePickerModalProps) {
  if (!isOpen) return null;

  const detectedGender = detectAthleteGender(athleteName);
  const templates = getRecommendedTemplatesForBlock(currentBlock, athleteName);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id || ''
  );

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleConfirm = () => {
    if (!selectedTemplate) return;
    const confirmMsg = `Vuoi caricare il template "${selectedTemplate.name}"?
ATTENZIONE: Sostituirà gli esercizi attuali della scheda con quelli precompilati del template.`;
    
    if (window.confirm(confirmMsg)) {
      // Clona per evitare mutazioni
      const clonedDays = JSON.parse(JSON.stringify(selectedTemplate.days));
      onSelectTemplate(clonedDays, selectedTemplate.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* HEADER MODALE */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0E1116]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Selettore Template Schede · Metodo TOP GYM
              </h3>
              <p className="text-xs text-zinc-400">
                Atleta: <b className="text-white">{athleteName || 'Atleta'}</b> 
                <span className="ml-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/5">
                  <User className="w-3 h-3 text-[#E50914]" />
                  Profilo {detectedGender === 'FEMALE' ? 'Donna (Priorità Glutei/Fascia Estetica)' : 'Uomo (Priorità Forza Neurale/Upper)'}
                </span>
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

        {/* CORPO MODALE */}
        <div className="p-6 overflow-y-auto space-y-4">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Seleziona la Split Settimanale da caricare:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map(tmpl => {
              const isSelected = tmpl.id === selectedTemplateId;
              const isMatchingGender = tmpl.gender === detectedGender;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' 
                      : 'bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-900/70 text-zinc-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        tmpl.gender === 'FEMALE' 
                          ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {tmpl.gender === 'FEMALE' ? 'Donna' : 'Uomo'} · 4 Giorni
                      </span>

                      {isMatchingGender && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Sparkles className="w-3 h-3" /> Consigliato
                        </span>
                      )}
                    </div>

                    <b className={`text-sm block font-black ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                      {tmpl.name}
                    </b>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-mono">Focus: <b className="text-zinc-300">{tmpl.focus}</b></span>
                    {isSelected && <Check className="w-4 h-4 text-[#E50914]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ANTEPRIMA GIORNATE DEL TEMPLATE SELEZIONATO */}
          {selectedTemplate && (
            <div className="bg-[#0E1116] border border-white/5 rounded-xl p-4 mt-4 space-y-2.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#E50914]" />
                Anteprima Giornate ({selectedTemplate.days.length} sedute totali)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedTemplate.days.map(d => (
                  <div key={d.id} className="bg-zinc-900/60 p-2.5 rounded-lg border border-white/5">
                    <b className="text-zinc-200 block text-[11px]">{d.title}</b>
                    <span className="text-[10px] text-zinc-500">
                      {d.exercises.length} esercizi ({d.exercises.map(e => e.name).slice(0, 3).join(', ')}...)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER AZIONI */}
        <div className="p-4 border-t border-white/10 bg-[#0E1116] flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-[#E50914] hover:brightness-110 text-white rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
          >
            <Check className="w-4 h-4" /> Carica Template nella Scheda
          </button>
        </div>

      </div>
    </div>
  );
}