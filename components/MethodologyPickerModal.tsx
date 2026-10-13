'use client';

import React from 'react';
import { X, Sparkles, BookOpen, Check } from 'lucide-react';

interface MethodologyPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (model: any) => void;
}

export default function MethodologyPickerModal({
  isOpen,
  onClose,
  currentModel,
  onSelectModel
}: MethodologyPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-[#12151B] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER MODALE */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E50914]/15 rounded-xl border border-[#E50914]/30 text-[#E50914]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Hub Metodologico &bull; Attività Istituzionale A.S.D.
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Seleziona la metodologia di programmazione o il framework scientifico per la scheda atleta.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO CLUSTER SCIENTIFICI */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* CLUSTER A: IPERTROFIA */}
            <div className="bg-black/50 border border-red-500/20 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 block pb-1 border-b border-red-500/10">
                  Cluster A: Ipertrofia & Biomeccanica
                </span>
                <p className="text-[10px] text-zinc-400 mt-1 mb-3">
                  Progressioni su multiarticolari, RIR controllato e lavoro ad alta tensione meccanica.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectModel("NOCERINO")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      ((currentModel as any) === "NOCERINO")
                        ? "bg-[#E50914] text-white shadow-lg shadow-red-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>🔬 Nocerino (T13)</span>
                    {((currentModel as any) === "NOCERINO") && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectModel("HARDTOPGYM")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      currentModel === "HARDTOPGYM"
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>⚡ Hatfield</span>
                    {currentModel === "HARDTOPGYM" && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectModel("ACETO")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      currentModel === "ACETO"
                        ? "bg-cyan-500 text-black shadow-lg shadow-cyan-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>🏆 Chris Aceto</span>
                    {currentModel === "ACETO" && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectModel("HELMS_PYRAMID")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      ((currentModel as any) === "HELMS_PYRAMID")
                        ? "bg-[#E50914] text-white shadow-lg shadow-red-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>🏛️ Helms Pyramid</span>
                    {((currentModel as any) === "HELMS_PYRAMID") && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* CLUSTER B: ESTETICA FEMMINILE */}
            <div className="bg-black/50 border border-rose-500/20 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 block pb-1 border-b border-rose-500/10">
                  Cluster B: Estetica Femminile
                </span>
                <p className="text-[10px] text-zinc-400 mt-1 mb-3">
                  Focus catena posteriore, deltoidi e modulazione DUP ad onde anti-edema.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectModel("BIKINI_WAVE")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      ((currentModel as any) === "BIKINI_WAVE")
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>✨ Bikini Wave System (T24)</span>
                    {((currentModel as any) === "BIKINI_WAVE") && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono leading-tight pt-2 border-t border-white/5">
                DUP a onde &bull; Glutei / Deltoidi &bull; Anti-edema
              </p>
            </div>

            {/* CLUSTER C: METODO & LONGEVITY */}
            <div className="bg-black/50 border border-emerald-500/20 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block pb-1 border-b border-emerald-500/10">
                  Cluster C: Metodo & Longevity
                </span>
                <p className="text-[10px] text-zinc-400 mt-1 mb-3">
                  Periodizzazione classica a blocchi o approccio posturale correttivo Schroth.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectModel("TOPGYM_BLOCKS")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      currentModel === "TOPGYM_BLOCKS"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>🛡️ TOPGYM Classico (Blocchi)</span>
                    {currentModel === "TOPGYM_BLOCKS" && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectModel("STATICA")}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between ${
                      ((currentModel as any) === "STATICA")
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                        : "text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>🌿 Desk & Longevity (Schroth)</span>
                    {((currentModel as any) === "STATICA") && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PIEDE MODALE */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-mono">
            Attivo: <b className="text-white">{String(currentModel)}</b>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
}
