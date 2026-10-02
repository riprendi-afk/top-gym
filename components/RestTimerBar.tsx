'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, X } from 'lucide-react';

interface RestTimerBarProps {
  todayLogsCount: number;
  onFinishWorkout: () => void;
  isSavingWorkout: boolean;
}

export default function RestTimerBar({
  todayLogsCount,
  onFinishWorkout,
  isSavingWorkout,
}: RestTimerBarProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const targetEndTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Beep Hardware con Web Audio API (funziona con cuffie Bluetooth e silenzioso attivo)
  const playBeepTone = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, startDelay: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + startDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + dur);
      };

      playTone(880, 0, 0.25);
      playTone(1174, 0.3, 0.45);
    } catch (err) {
      console.error('Impossibile riprodurre beep:', err);
    }
  }, []);

  const stopRest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    targetEndTimeRef.current = null;
    setRemainingSeconds(null);

    // Stop Keep-Alive Audio
    if (silentAudioRef.current) {
      silentAudioRef.current.pause();
      silentAudioRef.current.currentTime = 0;
    }
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }

    // Rilascio Wake Lock
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  const triggerTimerFinish = useCallback(() => {
    stopRest();
    playBeepTone();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 450]);
    }
  }, [stopRest, playBeepTone]);

  const updateDelta = useCallback(() => {
    if (!targetEndTimeRef.current) return;
    const diff = Math.ceil((targetEndTimeRef.current - Date.now()) / 1000);

    if (diff <= 0) {
      triggerTimerFinish();
    } else {
      setRemainingSeconds(diff);
    }
  }, [triggerTimerFinish]);

  const startRest = useCallback(
    (seconds: number) => {
      if (seconds <= 0) return;
      stopRest();

      // 1. Wake Lock
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then((lock) => {
          wakeLockRef.current = lock;
        }).catch(() => {});
      }

      // 2. Audio Keep-Alive
      try {
        if (!silentAudioRef.current) {
          silentAudioRef.current = new Audio(
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
          );
          silentAudioRef.current.loop = true;
        }
        silentAudioRef.current.play().catch(() => {});

        if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Recupero in corso',
            artist: 'TOP GYM',
            album: 'Timer Serie',
          });
          navigator.mediaSession.playbackState = 'playing';
        }
      } catch (_) {}

      // 3. Target Timestamp assoluto (zero drift in background)
      targetEndTimeRef.current = Date.now() + seconds * 1000;
      setRemainingSeconds(seconds);

      intervalRef.current = setInterval(updateDelta, 1000);
    },
    [stopRest, updateDelta]
  );

  // Listener Custom Event + Sincronizzazione al risveglio dello schermo
  useEffect(() => {
    const handleStartRestEvent = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        startRest(customEvent.detail);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && targetEndTimeRef.current) {
        updateDelta();
      }
    };

    window.addEventListener('topgym:start-rest', handleStartRestEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('topgym:start-rest', handleStartRestEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopRest();
    };
  }, [startRest, stopRest, updateDelta]);

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 z-40 max-w-5xl mx-auto bg-[#12151B]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {remainingSeconds !== null ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono font-bold">
            <Timer className="w-4 h-4 animate-pulse" />
            <span>
              Recupero: {Math.floor(remainingSeconds / 60)}:
              {(remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={stopRest}
              className="ml-1 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Interrompi recupero"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-zinc-400 font-medium">
            Sessione in corso - {todayLogsCount} set registrati
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onFinishWorkout}
        disabled={isSavingWorkout}
        className="bg-emerald-600 hover:brightness-110 text-white font-black px-6 py-3 rounded-xl uppercase text-xs tracking-wider cursor-pointer shadow-lg transition-all disabled:opacity-50"
      >
        {isSavingWorkout ? 'Salvataggio...' : 'Termina e Salva'}
      </button>
    </div>
  );
}