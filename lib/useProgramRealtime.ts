import { useEffect } from 'react';
import { initProgramsRealtime } from './store';

/**
 * Hook personalizzato per attivare la sincronizzazione realtime del programma
 */
export function useProgramRealtime(userId: string | undefined, onUpdate: (updatedProgram: any) => void) {
  useEffect(() => {
    if (!userId) return;

    // Avvia l'ascolto
    const unsubscribe = initProgramsRealtime(userId, (newProgram) => {
      onUpdate(newProgram);
    });

    // Pulisce la connessione quando il componente si chiude
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, onUpdate]);
}