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
  const supabase = getSupabase();

  // Stati per la gestione della vista
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Scarico volumetrico veloce (-40% serie)
  const handleApplyDeload = () => {
    if (!window.confirm("Applicare lo scarico volumetrico (-40% serie su tutte le settimane)?")) return;
    const deloaded = programDays.map((day: any) => ({
      ...day,
      exercises: day.exercises?.map((ex: any) => ({
        ...ex,
        sets: Math.max(1, Math.round((Number(ex.sets) || 3) * 0.6)),
      })),
    }));
    setProgramDays(deloaded);
    setBuilderSuccessMessage("⚡ Scarico volumetrico (-40%) applicato con successo!");
    setTimeout(() => setBuilderSuccessMessage(null), 4000);
  };

  // Esportazione PDF
  const handlePrintPDF = () => {
    const printName = window.prompt("Nome atleta da stampare sul PDF:", activeAthlete?.displayName);
    if (printName !== null) {
      exportProgramToPDF(printName.trim() || activeAthlete?.displayName, programName, programDays);
    }
  };

  // Salvataggio modifiche e propagazione settimane (W1–W16)
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
      setBuilderSuccessMessage("⚠️ Seleziona un atleta valido prima di salvare!");
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
          console.error("Errore notifica DB:", err);
        }

        try {
          await sendPushNotification(
            targetId,
            isMasterCoach ? "Nuova Scheda Metodo TOPGYM! 🏋️" : "Nuova Scheda Assegnata! 🏋️",
            `Il Coach ha aggiornato il programma (${programName || "Nuova scheda"}).`,
            "/"
          );
        } catch (err) {
          console.error("Errore notifica Push:", err);
        }
      }

      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata a ${activeAthlete?.displayName || "Atleta"}!`);
      setTimeout(() => setBuilderSuccessMessage(null), 4000);
    } catch (e: any) {
      setBuilderSuccessMessage(`❌ Errore durante il salvataggio: ${e?.message || "Riprova"}`);
      setTimeout(() => setBuilderSuccessMessage(null), 6000);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. BARRA DI CONTROLLO SUPERIORE SNELLA (SENZA DOPPIONI) */}
      <div className="bg-[#161922] border border-zinc-700/60 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Info Atleta Selezionato */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Atleta:</span>
              <span className="text-xs font-black text-white">{activeAthlete?.displayName || "Nessun atleta selezionato"}</span>
            </div>
            <p className="text-[10px] text-zinc-400">
              {programDays.length} Giornate Attive &bull; Programmazione W1–W16
            </p>
          </div>
        </div>

        {/* Azioni Rapide Centrali e Schermo Intero */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyDeload}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-600 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Riduci le serie del 40% su tutte le settimane"
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Scarico (-40%)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-600 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Stampa PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTimelineModalOpen(!isTimelineModalOpen)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-600 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            {isTimelineModalOpen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Riduci</span>
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

      {/* Messaggio di Feedback Notifiche / Errori */}
      {builderSuccessMessage && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-center font-bold text-xs shadow-sm">
          {builderSuccessMessage}
        </div>
      )}

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

      {/* 3. MATRICE MACROCICLO W1-W16 */}
      <div className="w-full">
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