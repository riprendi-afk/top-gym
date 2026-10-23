'use client';

import React, { useState } from 'react';
import {
  BookOpen, Sparkles, Zap, Shield, Layers, Award,
  Flame, Activity, Target
} from 'lucide-react';

export default function MethodologiesGuide() {
  const [activeModel, setActiveModel] = useState<'BIKINI_WAVE' | 'HARDTOPGYM' | 'POWERBLOCK' | 'HELMS' | 'BLOOD_VOLUME'>('BIKINI_WAVE');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* HEADER ENCICLOPEDIA */}
      <div className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_10px_#E50914] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest text-[#E50914]">
                Top Gym • Compendio Tecnico Metodologico
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Metodologie & Linee Guida di Programmazione
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Documentazione scientifica dei motori di periodizzazione integrati nella piattaforma TOP GYM per la gestione del carico, RPE target e modulazione del volume.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-zinc-300">5 Motori Attivi</span>
          </div>
        </div>

        {/* TABS SELEZIONE MOTORE */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none border-t border-white/5 pt-4">
          <button
            type="button"
            onClick={() => setActiveModel('BIKINI_WAVE')}
            className={activeModel === 'BIKINI_WAVE' ? 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-rose-900/40' : 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Bikini Wave System (Wilson 2014)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModel('HARDTOPGYM')}
            className={activeModel === 'HARDTOPGYM' ? 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-[#E50914] to-red-700 text-white shadow-lg shadow-red-900/40' : 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Hard TopGym (They / Nocerino)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModel('POWERBLOCK')}
            className={activeModel === 'POWERBLOCK' ? 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/40' : 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-300" />
            <span>PowerBlock Hybrid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModel('HELMS')}
            className={activeModel === 'HELMS' ? 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40' : 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}
          >
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>Helms Muscle & Strength Pyramid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModel('BLOOD_VOLUME')}
            className={activeModel === 'BLOOD_VOLUME' ? 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-900/40' : 'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}
          >
            <Flame className="w-3.5 h-3.5 text-purple-300" />
            <span>Blood Volume Overload</span>
          </button>
        </div>
      </div>

      {/* DETTAGLIO MODELLO BIKINI WAVE */}
      {activeModel === 'BIKINI_WAVE' && (
        <div className="space-y-6">
          <div className="bg-[#12151B] border border-pink-500/20 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400">Letteratura Scientifica</span>
                <h2 className="text-lg font-black text-white">Bikini Wave System (Wilson & Fitschen, 2014)</h2>
              </div>
              <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold rounded-lg">
                Frequenza 5gg • Onde L/M/H
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Sistema di periodizzazione ondulatoria studiato per massimizzare l'ipertrofia e la densità nei distretti chiave (glutei, catena posteriore, deltoidi) salvaguardando il recupero connettivo tramite modulazione settimanale delle onde e reset ciclico delle serie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TABELLA 7.4 */}
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Layers className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Tabella 7.4: Wave Loading</h3>
              </div>
              <p className="text-[11px] text-zinc-400">
                La periodizzazione si articola su blocchi a 3 microcicli con volume e intensità oscillanti:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">Week 1 (Low Volume):</span>
                  <span className="text-zinc-400 text-[11px]">10-12 serie/gruppo. RPE 7-7.5. Stabilizzazione dello schema motorio e recupero neurale.</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">Week 2 (Medium Volume):</span>
                  <span className="text-zinc-400 text-[11px]">14-16 serie/gruppo. RPE 8-8.5. Incremento carico del 2.5% e tensione progressiva.</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-pink-300 block">Week 3 (High Volume - Urto):</span>
                  <span className="text-zinc-400 text-[11px]">18-22 serie/gruppo. RPE 9-10. Picco di affaticamento e stimolo metabolico massimo.</span>
                </div>
              </div>
            </div>

            {/* TABELLA 7.5 */}
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Target className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Tabella 7.5: Modulazione RPE & RIR</h3>
              </div>
              <p className="text-[11px] text-zinc-400">
                Gestione del buffer e prossimità al cedimento per prevenire il burnout del SNC:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">Microciclo L (RIR 2-3):</span>
                  <span className="text-zinc-400 text-[11px]">Almeno 2-3 ripetizioni in riserva. Enfasi sulla massima velocità della fase concentrica.</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">Microciclo M (RIR 1-2):</span>
                  <span className="text-zinc-400 text-[11px]">Cedimento tecnico sfiorato. Mantenimento del TUT senza perdita della traiettoria ottimale.</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-rose-300 block">Microciclo H (RIR 0-1):</span>
                  <span className="text-zinc-400 text-[11px]">Cedimento muscolare concentrico sull'ultima serie degli esercizi primari e accessori.</span>
                </div>
              </div>
            </div>

            {/* TABELLA 7.6 */}
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Activity className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Tabella 7.6: Reset 3 Serie & Reps</h3>
              </div>
              <p className="text-[11px] text-zinc-400">
                Meccanismo di de-carico e scalata delle ripetizioni per rilanciare la supercompensazione:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-300 block">Reset Ciclico a 3 Serie:</span>
                  <span className="text-zinc-400 text-[11px]">Dopo ogni picco High o fine mesociclo, tutti i target tornano a 3 serie rigide per 7 giorni per smaltire la fatica sistemica.</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">Scalata Ripetizioni:</span>
                  <span className="text-zinc-400 text-[11px]">Transizione progressiva: 12-15 reps (accumulo metabolico) &rarr; 8-10 reps (ipertrofia meccanica) &rarr; 6-8 reps (forza specifica).</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="font-bold text-white block">TUT Target Glutei:</span>
                  <span className="text-zinc-400 text-[11px]">Eccentrica controllata 3s, fermo 2s al picco isometrico in contrazione (Hip Thrust/RDL).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETTAGLIO MODELLO HARD TOPGYM */}
      {activeModel === 'HARDTOPGYM' && (
        <div className="space-y-6">
          <div className="bg-[#12151B] border border-red-500/20 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">Metodo Tradizionale Top Gym</span>
                <h2 className="text-lg font-black text-white">Hard TopGym: Emilio They & Nocerino (T13)</h2>
              </div>
              <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-bold rounded-lg">
                Alta Intensità • Periodizzazione ad Urto
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Fusione del Bodybuilding d'urto del Maestro Emilio They con i parametri T13 del Coach Nocerino. Pochi esercizi fondamentali ad altissima intensità di sforzo, serie pesanti-eccentriche, rest-pause programmato e scarichi rigorosi per provocare un adattamento ipertrofico profondo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-red-400 uppercase tracking-wider">Fase 1: Urto (W1-W3)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Sovraccarico meccanico brutale su 4 sedute settimanali. Panca, Squat e Stacchi con carichi all'80-85% 1RM portati a vero cedimento concentrico.
              </p>
            </div>
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Fase 2: Accumulo (W4-W7)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Espansione del volume con l'introduzione dei parametri T13 Nocerino: TUT compreso tra 40 e 60 secondi, recuperi brevi (60-75s) e superset antagonisti.
              </p>
            </div>
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Fase 3: Intensificazione (W8-W10)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Carichi submassimali all'85-92.5% 1RM, doppie e triple pesanti con rest-pause sui movimenti cardine, seguite da serie di stripping su macchine isotoniche.
              </p>
            </div>
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider">Fase 4: Deload (W11)</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Taglio del 50% del volume settimanale, carichi calmierati al 60% 1RM, RPE massimo di 6 per permettere al tessuto connettivo e al SNC di supercompensare.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DETTAGLIO MODELLO POWERBLOCK */}
      {activeModel === 'POWERBLOCK' && (
        <div className="bg-[#12151B] border border-indigo-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Modello Ibrido Forza-Ipertrofia</span>
              <h2 className="text-lg font-black text-white">PowerBlock Hybrid System</h2>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold rounded-lg">
              Progressione a Blocchi di Issurin
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Blocco A: Reclutamento Neurale (Compound)</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Gli esercizi primari (Squat, Panca, Stacco, Military) vengono gestiti a RPE 8-8.5 con schemi piramidali inversi o cluster sets (es. 4x3-5). Il focus è la massima produzione di forza e l'attivazione delle unità motorie ad alta soglia.
              </p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Blocco B: Ipertrofia Funzionale (Accessori)</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                I complementari vengono eseguiti a RIR 1-2 con 3-4 serie da 8-12 ripetizioni su manubri e cavi. Recuperi completi sui fondamentali (2-3 minuti), recuperi densi sugli accessori (60-90 secondi).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DETTAGLIO MODELLO HELMS */}
      {activeModel === 'HELMS' && (
        <div className="bg-[#12151B] border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Periodizzazione Evidence-Based</span>
              <h2 className="text-lg font-black text-white">The Muscle and Strength Training Pyramid (Eric Helms)</h2>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold rounded-lg">
              W1-W4 a Gradini di RPE
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            La gerarchia di Helms impone: Aderenza &rarr; Volume/Intensità/Frequenza (10-20 serie/settimana con frequenza 2x per gruppo) &rarr; Progressione &rarr; Recupero.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-emerald-400 font-bold block">W1: Introduzione</span>
              <span className="text-zinc-400 text-[11px]">RPE 7. Calibrazione dei carichi e verifica della tecnica.</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-emerald-400 font-bold block">W2: Sovraccarico</span>
              <span className="text-zinc-400 text-[11px]">RPE 8. Aumento reps o aggiunta del 2% del carico.</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-emerald-400 font-bold block">W3: Picco Stimolo</span>
              <span className="text-zinc-400 text-[11px]">RPE 9. Massimo impegno muscolare preservando la forma.</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-teal-400 font-bold block">W4: Scarico Attivo</span>
              <span className="text-zinc-400 text-[11px]">RPE 6. Riduzione del 40-50% del volume settimanale.</span>
            </div>
          </div>
        </div>
      )}

      {/* DETTAGLIO MODELLO BLOOD VOLUME */}
      {activeModel === 'BLOOD_VOLUME' && (
        <div className="bg-[#12151B] border border-purple-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">Stress Metabolico & Longevità</span>
              <h2 className="text-lg font-black text-white">Blood Volume Overload & Desk Longevity</h2>
            </div>
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold rounded-lg">
              Altissimo Afflusso Ematico
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Protocollo incentrato sul pompaggio intracellulare, occlusione parziale e serie ad alte ripetizioni (15-25 reps). Ottimizzato per atleti che necessitano di recupero articolare, soggetti con postura da scrivania o fasi rigenerative dopo mesocicli pesanti.
          </p>
        </div>
      )}
    </div>
  );
}
