'use client';

import React, { useState } from 'react';
import { TOPGYM_OVER40_TEMPLATES } from '@/lib/over40-templates';
import { convertTemplateToProgramDays, Gender } from '@/lib/topgym-catalog';
import { exportProgramToPDF } from '@/lib/lib/exportPdf';
import { 
  X, 
  FileText, 
  Download, 
  Check, 
  User, 
  Calendar, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

interface Over40QuickModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Over40QuickModal({ isOpen, onClose }: Over40QuickModalProps) {
  const [selectedId, setSelectedId] = useState<string>('TG-O40-01');
  const [athleteName, setAthleteName] = useState<string>('Cliente Over 40');
  const [gender, setGender] = useState<Gender>('MALE');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTemplate = TOPGYM_OVER40_TEMPLATES.find(t => t.id === selectedId) || TOPGYM_OVER40_TEMPLATES[0];

  const handleExportPDF = () => {
    const finalName = athleteName.trim() || 'Cliente Over 40 (Ospite Desk)';
    setIsExporting(true);

    try {
      const programDays = convertTemplateToProgramDays(currentTemplate as any, gender);
      exportProgramToPDF(finalName, currentTemplate.title, programDays);
    } catch (err) {
      console.error('Errore durante la generazione PDF Over 40:', err);
      window.alert('Si � verificato un errore durante l\'esportazione del PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-emerald-500/30 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* HEADER MODALE */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0E1116]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Desk Over 40 � TOP GYM (Stampa Rapida PDF)
              </h3>
              <p className="text-xs text-zinc-400">
                Schede fisse pre-impostate pronte alla stampa per clienti non iscritti, over 40 o esigenze posturali
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

        {/* CONTENUTO */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* BOX NOME CLIENTE & PROFILO */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Nome Atleta / Cliente (Da stampare sul PDF):
              </label>
              <input
                type="text"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                placeholder="Es. Mario Rossi, Anna Bianchi..."
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-400 block">
                Nessun account richiesto: questo nome apparir� direttamente nell'intestazione della scheda PDF.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Profilo Fisiologico:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('MALE')}
                  className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                    gender === 'MALE'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Uomo
                </button>
                <button
                  type="button"
                  onClick={() => setGender('FEMALE')}
                  className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                    gender === 'FEMALE'
                      ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                      : 'bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Donna
                </button>
              </div>
            </div>
          </div>

          {/* SELEZIONE DEI SCHEDE STATICHE TOP GYM */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Seleziona la Scheda Statica Fissa:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOPGYM_OVER40_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedId;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedId(tmpl.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-900 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {tmpl.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {tmpl.daysCount} Giorni/Sett.
                        </span>
                      </div>
                      <b className={`text-xs block ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {tmpl.title}
                      </b>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                        <span>Selezionato</span>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ANTEPRIMA SEDUTE DELLA SCHEDA SELEZIONATA */}
          <div className="bg-[#0E1116] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Anteprima Scheda: {currentTemplate.title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {currentTemplate.daysCount} Sedute
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {currentTemplate.generateSessions(gender).slice(0, 3).map((sess, idx) => (
                <div key={idx} className="bg-zinc-900/70 border border-white/5 p-3 rounded-lg space-y-1">
                  <b className="text-xs text-white block truncate">{sess.dayLabel}</b>
                  <span className="text-[10px] text-zinc-400 block line-clamp-1">{sess.sessionFocus}</span>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1">
                    {sess.exercises.length} esercizi (Esempio: {sess.exercises[0]?.name})
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER AZIONI */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E1116] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase transition cursor-pointer"
          >
            Chiudi
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generazione PDF in corso...' : 'Scarica PDF Immediato (Senza Account)'}
          </button>
        </div>

      </div>
    </div>
  );
}