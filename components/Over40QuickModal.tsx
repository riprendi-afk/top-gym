'use client';

import React, { useState, useEffect } from 'react';
import { TOPGYM_OVER40_TEMPLATES } from '@/lib/over40-templates';
import { convertTemplateToProgramDays, Gender } from '@/lib/topgym-catalog';
import { exportProgramToPDF } from '@/lib/lib/exportPdf';
import { 
  X, 
  Download, 
  User, 
  Calendar, 
  Activity, 
  ShieldCheck,
  Trash2,
  Plus,
  RotateCcw,
  Edit3,
  Layers
} from 'lucide-react';

interface Over40QuickModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Over40QuickModal({ isOpen, onClose }: Over40QuickModalProps) {
  const [selectedId, setSelectedId] = useState<string>('TG-O40-01');
  const [athleteName, setAthleteName] = useState<string>('Cliente TOP GYM');
  const [gender, setGender] = useState<Gender>('MALE');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Stato per le sedute modulabili
  const [editableDays, setEditableDays] = useState<any[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'OVER40' | 'SCOLIOSI'>('ALL');

  const currentTemplate = TOPGYM_OVER40_TEMPLATES.find(t => t.id === selectedId) || TOPGYM_OVER40_TEMPLATES[0];

  // Inizializza o ricarica le sedute al cambio del template o del genere
  useEffect(() => {
    if (currentTemplate) {
      const initialDays = convertTemplateToProgramDays(currentTemplate as any, gender);
      setEditableDays(JSON.parse(JSON.stringify(initialDays)));
      setActiveDayIndex(0);
    }
  }, [selectedId, gender]);

  if (!isOpen) return null;

  // Ripristina la scheda originale del template
  const handleResetToDefault = () => {
    if (currentTemplate) {
      const initialDays = convertTemplateToProgramDays(currentTemplate as any, gender);
      setEditableDays(JSON.parse(JSON.stringify(initialDays)));
    }
  };

  // Modifica campo esercizio
  const handleUpdateExercise = (dayIdx: number, exIdx: number, field: string, value: any) => {
    setEditableDays(prev => {
      const clone = [...prev];
      clone[dayIdx].exercises[exIdx] = {
        ...clone[dayIdx].exercises[exIdx],
        [field]: value
      };
      return clone;
    });
  };

  // Rimuovi esercizio
  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    setEditableDays(prev => {
      const clone = [...prev];
      clone[dayIdx].exercises = clone[dayIdx].exercises.filter((_: any, idx: number) => idx !== exIdx);
      // Ricalcola ordini numerici
      clone[dayIdx].exercises.forEach((ex: any, idx: number) => {
        ex.order = idx + 1;
      });
      return clone;
    });
  };

  // Aggiungi nuovo esercizio personalizzato
  const handleAddExercise = (dayIdx: number) => {
    setEditableDays(prev => {
      const clone = [...prev];
      const newOrder = clone[dayIdx].exercises.length + 1;
      clone[dayIdx].exercises.push({
        order: newOrder,
        name: 'Nuovo Esercizio Personalizzato',
        targetMuscle: 'Target',
        segment: 'MECCANICO',
        sets: 3,
        reps: '12 reps',
        restSeconds: 60,
        effort: 'RIR 2',
        technique: 'NONE',
        notes: 'Esecuzione controllata'
      });
      return clone;
    });
  };

  // Esportazione PDF con le modifiche apportate
  const handleExportPDF = () => {
    const finalName = athleteName.trim() || 'Cliente TOP GYM (Desk)';
    setIsExporting(true);

    try {
      exportProgramToPDF(finalName, currentTemplate.title, editableDays);
    } catch (err) {
      console.error('Errore durante la generazione PDF:', err);
      window.alert('Si � verificato un errore durante l\'esportazione del PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTemplates = TOPGYM_OVER40_TEMPLATES.filter(tmpl => {
    if (categoryFilter === 'OVER40') return tmpl.id.startsWith('TG-O40');
    if (categoryFilter === 'SCOLIOSI') return tmpl.id.startsWith('SCO');
    return true;
  });

  const activeDay = editableDays[activeDayIndex] || editableDays[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-emerald-500/30 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* HEADER MODALE */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0E1116]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Desk TOP GYM � Schede Statiche Modulabili (Stampa Rapida PDF)
              </h3>
              <p className="text-xs text-zinc-400">
                Seleziona la scheda base, adatta gli esercizi al cliente e scarica subito il PDF personalizzato
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

        {/* CONTENUTO SCORREVOLE */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300 text-xs">

          {/* BOX DATI ATLETA & GENERE */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Nome Atleta / Cliente:
              </label>
              <input
                type="text"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                placeholder="Es. Mario Rossi, Anna Bianchi..."
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-400 block">
                Nessun account richiesto: apparir� nell'intestazione ufficiale del documento PDF.
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

          {/* SELEZIONE TEMPLATE CON FILTRO CATEGORIA */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Scheda Base di Partenza:
              </label>
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                    categoryFilter === 'ALL' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tutte (10)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('OVER40')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                    categoryFilter === 'OVER40' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Over 40 (5)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('SCOLIOSI')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                    categoryFilter === 'SCOLIOSI' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Posturali / Scoliosi (5)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredTemplates.map((tmpl) => {
                const isSelected = tmpl.id === selectedId;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedId(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-900 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-zinc-900/40 border-white/5 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {tmpl.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          {tmpl.daysCount} Giorni
                        </span>
                      </div>
                      <b className={`text-[11px] block line-clamp-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {tmpl.title}
                      </b>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MODULO DI MODIFICA ESERCIZI (EDITOR INTERATTIVO) */}
          <div className="bg-[#0E1116] border border-white/10 rounded-xl p-4 space-y-4">
            
            {/* INTESTAZIONE EDITOR E TASTO RESET */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Modifica Esercizi della Scheda ({currentTemplate.id})
                </h4>
              </div>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-2.5 py-1 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Ripristina la lista originaria di esercizi prevista dal template"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                Ripristina Esercizi Originali
              </button>
            </div>

            {/* SELETTORE SEDUTE / GIORNI */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {editableDays.map((day: any, dIdx: number) => {
                const isActive = dIdx === activeDayIndex;
                return (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => setActiveDayIndex(dIdx)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {day.dayLabel || `Seduta ${dIdx + 1}`}
                  </button>
                );
              })}
            </div>

            {/* LISTA ESERCIZI MODIFICABILI DELLA SEDUTA CORRENTE */}
            {activeDay && (
              <div className="space-y-2.5">
                <div className="text-[11px] text-zinc-400 italic">
                  {activeDay.sessionFocus}
                </div>

                <div className="space-y-2">
                  {activeDay.exercises.map((ex: any, exIdx: number) => (
                    <div 
                      key={exIdx}
                      className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center gap-2.5 hover:border-white/20 transition"
                    >
                      {/* ORDINE */}
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {ex.order || exIdx + 1}
                      </span>

                      {/* NOME ESERCIZIO MODIFICABILE */}
                      <div className="flex-1 w-full md:w-auto">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Nome Esercizio</label>
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => handleUpdateExercise(activeDayIndex, exIdx, 'name', e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* SERIE & REPS */}
                      <div className="w-full md:w-44 grid grid-cols-2 gap-1.5 shrink-0">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Serie</label>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) => handleUpdateExercise(activeDayIndex, exIdx, 'sets', parseInt(e.target.value) || 1)}
                            className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-xs text-center text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Ripetizioni</label>
                          <input
                            type="text"
                            value={ex.reps}
                            onChange={(e) => handleUpdateExercise(activeDayIndex, exIdx, 'reps', e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded px-2 py-1.5 text-xs text-center text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* NOTE & ACCORGIMENTI */}
                      <div className="flex-1 w-full md:w-auto">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Note Posturali / Recupero</label>
                        <input
                          type="text"
                          value={ex.notes || ''}
                          onChange={(e) => handleUpdateExercise(activeDayIndex, exIdx, 'notes', e.target.value)}
                          placeholder="Note, RIR, recupero o focus posturale..."
                          className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* TASTO ELIMINA ESERCIZIO */}
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(activeDayIndex, exIdx)}
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition self-end md:self-center shrink-0 cursor-pointer"
                        title="Rimuovi esercizio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PULSANTE AGGIUNGI ESERCIZIO */}
                <button
                  type="button"
                  onClick={() => handleAddExercise(activeDayIndex)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-zinc-400 hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi Esercizio a questa Seduta
                </button>
              </div>
            )}

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
            {isExporting ? 'Generazione PDF in corso...' : 'Scarica PDF con Modifiche'}
          </button>
        </div>

      </div>
    </div>
  );
}