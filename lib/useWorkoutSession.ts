// hooks/useWorkoutSession.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export type ExerciseSegment = 'neural' | 'mechanical' | 'metabolic';

const SEGMENT_REST_TIMES: Record<ExerciseSegment, number> = {
  neural: 180,     // 3'00" (Lavoro neurale, forza sub-massimale / massimale)
  mechanical: 105, // 1'45" (Tensione meccanica, 6-10 reps)
  metabolic: 50,   // 50" (Stress metabolico, stripping, TUT prolungato)
};

export function useWorkoutSession() {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [isRestActive, setIsRestActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inizializzazione Web Audio API per segnali sonori discreti a fine recupero
  const playBeep = useCallback((freq = 880, duration = 0.15) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext non supportato o bloccato da autoplay policy
    }
  }, []);

  const triggerVibration = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Avvio automatico timer al completamento della serie
  const completeSet = useCallback((segment: ExerciseSegment, customRestSec?: number) => {
    const defaultTime = customRestSec ?? SEGMENT_REST_TIMES[segment];
    setRestSecondsRemaining(defaultTime);
    setIsRestActive(true);
  }, []);

  const adjustRestTime = useCallback((deltaSeconds: number) => {
    setRestSecondsRemaining((prev) => {
      if (prev === null) return null;
      const updated = prev + deltaSeconds;
      return updated > 0 ? updated : 0;
    });
  }, []);

  const stopRestTimer = useCallback(() => {
    setIsRestActive(false);
    setRestSecondsRemaining(null);
  }, []);

  // Loop del timer con trigger sonoro e vibrazione a 5, 3 e 0 secondi
  useEffect(() => {
    if (!isRestActive || restSecondsRemaining === null) return;

    if (restSecondsRemaining === 5 || restSecondsRemaining === 3) {
      playBeep(440, 0.1);
      triggerVibration(100);
    }

    if (restSecondsRemaining <= 0) {
      playBeep(880, 0.35);
      triggerVibration([250, 100, 250]);
      stopRestTimer();
      return;
    }

    const timerId = setInterval(() => {
      setRestSecondsRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRestActive, restSecondsRemaining, playBeep, triggerVibration, stopRestTimer]);

  return {
    activeExerciseIndex,
    setActiveExerciseIndex,
    restSecondsRemaining,
    isRestActive,
    completeSet,
    adjustRestTime,
    stopRestTimer,
  };
}