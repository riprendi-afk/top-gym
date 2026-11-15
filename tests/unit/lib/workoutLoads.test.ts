import { describe, expect, it } from 'vitest';
import {
  normalizeExerciseKey,
  resolveInitialExerciseWeight,
} from '@/lib/workout-loads';

describe('Logica Precompilazione Carichi Storici (workout-loads)', () => {
  it('normalizza correttamente i nomi degli esercizi rimuovendo spazi e maiuscole', () => {
    expect(normalizeExerciseKey('Panca Piana Bilanciere')).toBe('panca piana bilanciere');
    expect(normalizeExerciseKey('   SQUAT   LIBERO  ')).toBe('squat libero');
    expect(normalizeExerciseKey('')).toBe('');
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

    // L'atleta aveva fatto 85kg: proponiamo 85kg, non il valore vecchio 70kg
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
