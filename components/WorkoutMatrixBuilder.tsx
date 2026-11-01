"use client";

import React, { useState } from "react";
import { UserCheck, Layers, Printer, TrendingDown, Maximize2, Minimize2 } from "lucide-react";
import TemplatePickerModal from "./TemplatePickerModal";
import MacrocycleTimelineModal from "./MacrocycleTimelineModal";
import { saveProgramToSupabase } from "@/lib/store";
import { sendPushNotification } from "@/lib/push";
import { getSupabase } from "@/lib/supabase";
import { exportProgramToPDF } from "@/lib/lib/exportPdf";

interface WorkoutMatrixBuilderProps {
  activeAthlete: any;
  activeAthleteId: string | null;
  targetUserId: string | null;
  programName: string;
  setProgramName: (name: string) => void;
  programDays: any[];
  setProgramDays: (days: any[]) => void;
  programmingModel: string | null;
  setProgrammingModel: (model: any) => void;
  isMasterCoach: boolean;
  currentBlock?: any;
  athletes?: any[];
  onSaveProgram: () => Promise<void>;
  builderSuccessMessage: string | null;
  setBuilderSuccessMessage: (msg: string | null) => void;
}

export default function WorkoutMatrixBuilder({
  activeAthlete,
  activeAthleteId,
  targetUserId,
  programName,
  setProgramName,
  programDays,
  setProgramDays,
  programmingModel,
  setProgrammingModel,
  isMasterCoach,
  currentBlock,
  athletes = [],
  onSaveProgram,
  builderSuccessMessage,
  setBuilderSuccessMessage,
}: WorkoutMatrixBuilderProps) {
  // 1. Inizializzazione sicura del client Supabase tramite la funzione di configurazione
  const supabase = getSupabase();

  // Stati locali per la visualizzazione dei modali interni
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Azione rapida: applica scarico volumetrico (-40% serie)
  const handleApplyDeload = () => {
    if (!window.confirm("Applicare lo scarico volumetrico (-40% serie su tutti i microcicli)?")) return;
    const deloaded = programDays.map((day: any) => ({
      ...day,
      exercises: day.exercises?.map((ex: any) => ({
        ...ex,
        sets: Math.max(1, Math.round((Number(ex.sets) || 3) * 0.6)),
      })),
    }));
    setProgramDays(deloaded);
    setBuilderSuccessMessage("⚡ Scarico volumetrico (-40%) applicato alla scheda!");
    setTimeout(() => setBuilderSuccessMessage(null), 4000);
  };

  // Azione rapida: stampa della scheda in formato PDF
  const handlePrintPDF = () => {
    const printName = window.prompt("Nome atleta da stampare sul PDF:", activeAthlete?.displayName);
    if (printName !== null) {
      exportProgramToPDF(printName.trim() || activeAthlete?.displayName, programName, programDays);
    }
  };

  // Gestione salvataggio modifiche e override delle settimane (W1–W16)
  const handleSaveOverrides = async (updatedDays: any[], overrides: any) => {
    const coachEmail = "riprendi@gmail.com";
    const daysWithOverrides = updatedDays.map((d: any) => ({
      ...d,
      isPeriodized: isMasterCoach,
      assignedByCoach: coachEmail,
      weekOverrides: overrides || d.weekOverrides || {},
    }));

    setProgramDays(daysWithOverrides);

    const savedMethod = (daysWithOverrides[0] as any)?.method || (daysWithOverrides[0] as any)?.programmingModel;
    if (savedMethod) {
      setProgrammingModel(savedMethod);
    }

    const targetId = activeAthleteId || targetUserId;
    if (!targetId || targetId === "default-user") {
      setBuilderSuccessMessage("⚠️ Seleziona un atleta valido prima di salvare gli override!");
      setTimeout(() => setBuilderSuccessMessage(null), 4000);
      return;
    }

    try {
      await saveProgramToSupabase(targetId, programName || "Scheda TOPGYM", daysWithOverrides);

      if (supabase && targetId) {
        try {
          await supabase.from("notifications").insert([
            {
              user_id: targetId,
              title: isMasterCoach ? "Nuova Scheda Metodo TOPGYM!" : "Nuova Scheda di Allenamento",
              message: isMasterCoach
                ? `Il Coach ha aggiornato il macrociclo "${programName}".`
                : `Il Coach ha aggiornato la tua scheda "${programName}".`,
              type: "program_assigned",
            },
          ]);
        } catch (err) {
          console.error("Errore salvataggio notifica DB:", err);
        }

        try {
          await sendPushNotification(
            targetId,
            isMasterCoach ? "Nuova Scheda Metodo TOPGYM! 🏋️" : "Nuova Scheda Assegnata! 🏋️",
            `Il Coach ha aggiornato il programma (${programName || "Nuova scheda"}).`,
            "/"
          );
        } catch (err) {
          console.error("Errore invio push notification:", err);
        }
      }

      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata con successo a ${activeAthlete?.displayName || "Atleta"}!`);
      setTimeout(() => setBuilderSuccessMessage(null), 4000);
    } catch (e: any) {
      setBuilderSuccessMessage(`❌ Errore durante il salvataggio: ${e?.message || "Riprova"}`);
      setTimeout(() => setBuilderSuccessMessage(null), 6000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. PANNELLO DI REGIA COACH */}
      <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Regia Scheda & Assegnazione Programma
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Atleta: <b className="text-white">{activeAthlete?.displayName || "Nessun atleta selezionato"}</b> &bull; Gestione centralizzata W1–W16
              </p>
            </div>
          </div>

          {/* PULSANTI DI AZIONE RAPIDA IN ALTO */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/30 flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Scegli Template</span>
            </button>

            <button
              type="button"
              onClick={handleApplyDeload}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              title="Riduci le serie del 40% su tutte le giornate"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Scarico (-40%)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Stampa PDF</span>
            </button>
          </div>
        </div>

        {/* NOME DELLA SCHEDA E TASTO MASTER SALVA E ASSEGNA */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Nome della Scheda
            </label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="Nome della Scheda..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-[#E50914] transition"
            />
          </div>

          <div className="sm:col-span-4 sm:self-end">
            <button
              type="button"
              onClick={onSaveProgram}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Salva e Assegna</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK A SCHERMO */}
        {builderSuccessMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs animate-in fade-in">
            {builderSuccessMessage}
          </div>
        )}
      </div>

      {/* 2. MODALE SELETTORE TEMPLATE */}
      <TemplatePickerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentBlock={currentBlock}
        athleteName={activeAthlete?.displayName || ""}
        onSelectTemplate={(days, templateName) => {
          setProgramDays(days);
          setProgramName(templateName);
          setBuilderSuccessMessage(`⚡ Template "${templateName}" caricato nella Matrice!`);
          setTimeout(() => setBuilderSuccessMessage(null), 4000);
        }}
      />

      {/* 3. MATRICE MACROCICLO W1-W16: SINGLE SOURCE OF TRUTH (A LARGHEZZA INTERA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Matrice Macrociclo (W1–W16) &bull; Single Source of Truth
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden sm:inline">
              {programDays.length} Giornate Attive
            </span>
            <button
              type="button"
              onClick={() => setIsTimelineModalOpen(!isTimelineModalOpen)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              {isTimelineModalOpen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Riduci Vista</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Schermo Intero</span>
                </>
              )}
            </button>
          </div>
        </div>

        <MacrocycleTimelineModal
          key={targetUserId || "timeline-inline"}
          inline={!isTimelineModalOpen}
          isOpen={true}
          onClose={() => setIsTimelineModalOpen(false)}
          athleteName={athletes.find((a: any) => a.id === targetUserId)?.displayName || activeAthlete?.displayName || "Atleta"}
          athleteId={targetUserId || activeAthleteId || ""}
          programDays={programDays}
          programmingModel={programmingModel as string}
          programName={programName}
          onProgramNameChange={setProgramName}
          onOpenTemplatePicker={() => setIsTemplateModalOpen(true)}
          onSaveOverrides={handleSaveOverrides}
        />
      </div>
    </div>
  );
}