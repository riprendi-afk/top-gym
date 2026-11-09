import { describe, expect, it } from 'vitest';
import {
  calculateExerciseTonnage,
  calculateTotalSessionTonnage,
  calculateWeeklySetsByMuscle,
  CalculatedExercise,
} from '@/lib/program-calculations';

describe('Calcoli Matematici Programma (programCalculations)', () => {
  describe('calculateExerciseTonnage()', () => {
    it('calcola correttamente il tonnellaggio standard (es. 4 serie x 8 reps x 100 kg = 3200 kg)', () => {
      const tonnage = calculateExerciseTonnage(4, 8, 100);
      expect(tonnage).toBe(3200);
    });

    it('gestisce correttamente i carichi con cifre decimali (es. 3 x 10 x 22.5 kg = 675 kg)', () => {
      const tonnage = calculateExerciseTonnage(3, 10, 22.5);
      expect(tonnage).toBe(675);
    });

    it('restituisce 0 per esercizi a corpo libero o con carichi nulli/negativi', () => {
      expect(calculateExerciseTonnage(3, 10, 0)).toBe(0);
      expect(calculateExerciseTonnage(0, 10, 80)).toBe(0);
      expect(calculateExerciseTonnage(3, 0, 80)).toBe(0);
      expect(calculateExerciseTonnage(3, 10, -50)).toBe(0);
    });
  });

  describe('calculateTotalSessionTonnage()', () => {
    it('somma correttamente il tonnellaggio di tutti gli esercizi della sessione', () => {
      const workoutSession: CalculatedExercise[] = [
        { name: 'Panca Piana', muscle: 'PETTORALI', sets: 4, reps: 6, weightKg: 100 }, // 2400 kg
        { name: 'Spinte Manubri', muscle: 'PETTORALI', sets: 3, reps: 10, weightKg: 30 }, // 900 kg
        { name: 'Croci Cavi', muscle: 'PETTORALI', sets: 3, reps: 15, weightKg: 15 },    // 675 kg
      ];

      const totalTonnage = calculateTotalSessionTonnage(workoutSession);
      expect(totalTonnage).toBe(3975); // 2400 + 900 + 675
    });

    it('restituisce 0 se la sessione non contiene esercizi', () => {
      expect(calculateTotalSessionTonnage([])).toBe(0);
    });
  });

  describe('calculateWeeklySetsByMuscle()', () => {
    it('raggruppa correttamente il volume delle serie per gruppo muscolare', () => {
      const workoutSession: CalculatedExercise[] = [
        { name: 'Squat', muscle: 'GAMBE', sets: 5, reps: 5, weightKg: 120 },
        { name: 'Leg Extension', muscle: 'GAMBE', sets: 3, reps: 12, weightKg: 50 },
        { name: 'Panca Piana', muscle: 'PETTORALI', sets: 4, reps: 8, weightKg: 90 },
      ];

      const volumeMap = calculateWeeklySetsByMuscle(workoutSession);

      expect(volumeMap['GAMBE']).toBe(8);      // 5 + 3 serie
      expect(volumeMap['PETTORALI']).toBe(4);  // 4 serie
      expect(volumeMap['DORSALI']).toBeUndefined();
    });
  });
});
