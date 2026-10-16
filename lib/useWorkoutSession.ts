'use client';

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
  const endTimeRef = useRef<number | null>(null);
  const lastBeepRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Inizializzazione AudioContext Web Audio API
  const playBeep = useCallback((freq = 880, duration = 0.15) => {
    try {
      if (typeof window === 'undefined') return;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const triggerVibration = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }, []);

  // Gestione Screen Wake Lock (schermo sempre attivo durante i recuperi)
  const requestWakeLock = useCallback(async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (!wakeLockRef.current) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          wakeLockRef.current.addEventListener('release', () => {
            wakeLockRef.current = null;
          });
        }
      } catch {}
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch {}
    }
  }, []);

  // Avvio timer con timestamp assoluto (immune al blocco di iOS Safari)
  const completeSet = useCallback((segment: ExerciseSegment, customRestSec?: number) => {
    try { playBeep(0, 0.001); } catch {}
    const defaultTime = customRestSec ?? SEGMENT_REST_TIMES[segment];
    endTimeRef.current = Date.now() + defaultTime * 1000;
    lastBeepRef.current = null;
    setRestSecondsRemaining(defaultTime);
    setIsRestActive(true);
    requestWakeLock();
  }, [playBeep, requestWakeLock]);

  const adjustRestTime = useCallback((deltaSeconds: number) => {
    if (endTimeRef.current === null) return;
    endTimeRef.current += deltaSeconds * 1000;
    const sec = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setRestSecondsRemaining(sec);
  }, []);

  const stopRestTimer = useCallback(() => {
    endTimeRef.current = null;
    lastBeepRef.current = null;
    setIsRestActive(false);
    setRestSecondsRemaining(null);
    releaseWakeLock();
  }, [releaseWakeLock]);

  // Loop ad alta precisione con sync istantaneo al risveglio dello schermo
  useEffect(() => {
    if (!isRestActive || endTimeRef.current === null) return;

    const checkCountdown = () => {
      if (endTimeRef.current === null) return;
      const secLeft = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRestSecondsRemaining(secLeft);

      if (secLeft === 5 && lastBeepRef.current !== 5) {
        lastBeepRef.current = 5;
        playBeep(520, 0.12);
        triggerVibration(100);
      } else if (secLeft === 3 && lastBeepRef.current !== 3) {
        lastBeepRef.current = 3;
        playBeep(520, 0.12);
        triggerVibration(100);
      } else if (secLeft <= 0) {
        playBeep(880, 0.2);
        setTimeout(() => playBeep(1046, 0.2), 140);
        setTimeout(() => playBeep(1318, 0.35), 280);
        triggerVibration([250, 100, 250, 100, 400]);
        stopRestTimer();
      }
    };

    checkCountdown();
    const intervalId = setInterval(checkCountdown, 500);

    // Gestione risveglio telefono da standby
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkCountdown();
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isRestActive, playBeep, triggerVibration, stopRestTimer, requestWakeLock]);

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

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
