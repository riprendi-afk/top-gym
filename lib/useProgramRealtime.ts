import { useEffect, useRef } from 'react';
import { initProgramsRealtime } from './store';

/**
 * Hook per la sincronizzazione realtime del programma.
 * Utilizza useRef per stabilizzare la callback ed evitare disconnessioni cicliche.
 */
export function useProgramRealtime(
  userId: string | undefined, 
  onUpdate: (updatedProgram: any) => void
) {
  // Mantiene il riferimento sempre aggiornato all'ultima callback fornita
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!userId) return;

    // Avvia l'ascolto richiamando la reference stabile
    const unsubscribe = initProgramsRealtime(userId, (newProgram) => {
      onUpdateRef.current(newProgram);
    });

    // Pulizia eseguita SOLO quando userId cambia o il componente viene smontato
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]); // Dipendenza solo da userId: zero riconnessioni a vuoto
}