import { describe, expect, it } from 'vitest';
import {
  normalizeExerciseKey,
  extractLoadsFromWorkoutHistory,
  resolveInitialExerciseWeight,
} from '@/lib/workout-loads';

describe('Logica Precompilazione Carichi Storici (workout-loads)', () => {
  it('normalizza correttamente i nomi degli esercizi rimuovendo spazi e maiuscole', () => {
    expect(normalizeExerciseKey('Panca Piana Bilanciere')).toBe('panca piana bilanciere');
    expect(normalizeExerciseKey('   SQUAT   LIBERO  ')).toBe('squat libero');
    expect(normalizeExerciseKey('')).toBe('');
  });

  it('estrae correttamente gli ultimi carichi dalle sedute salvate in workoutHistory', () => {
    const mockHistory = [
      {
        created_at: '2026-11-10T10:00:00Z',
        logs: [
          { exerciseName: 'Panca Piana', weight: 90, reps: 6 },
          { exerciseName: 'Rematore Bilanciere', weight: 75, reps: 8 },
        ],
      },
      {
        created_at: '2026-11-03T10:00:00Z',
        logs: [
          { exerciseName: 'Panca Piana', weight: 80, reps: 8 },
          { exerciseName: 'Squat', weight: 110, reps: 5 },
        ],
      },
    ];

    const extracted = extractLoadsFromWorkoutHistory(mockHistory);

    // Panca Piana deve prendere 90 (seduta più recente del 10 nov) e non 80
    expect(extracted['panca piana']).toBe(90);
    expect(extracted['rematore bilanciere']).toBe(75);
    expect(extracted['squat']).toBe(110);
  });

  it('dà priorità al carico storico rispetto al target generico del coach', () => {
    const historyMap = {
      'panca piana bilanciere': 85,
    };

    const resolved = resolveInitialExerciseWeight(
      'Panca Piana Bilanciere',
      historyMap,
      '70'
    );

    expect(resolved).toBe('85');
  });

  it('ripiega sul carico del coach se non esiste uno storico per l\'atleta', () => {
    const historyMap = {};

    const resolved = resolveInitialExerciseWeight(
      'Stacco Rumeno',
      historyMap,
      '60'
    );

    expect(resolved).toBe('60');
  });

  it('restituisce stringa vuota se non c\'è né storico né carico del coach', () => {
    const historyMap = {};

    const resolved = resolveInitialExerciseWeight(
      'Croci ai Cavi',
      historyMap,
      '0'
    );

    expect(resolved).toBe('');
  });
});