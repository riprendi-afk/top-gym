import { describe, expect, it } from 'vitest';
import { validateProgram } from '@/lib/program-validation';

describe('validateProgram()', () => {
  it('rifiuta un programma senza esercizi', () => {
    const result = validateProgram({
      name: 'Scheda Ipertrofia A',
      exercises: [],
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Aggiungi almeno un esercizio');
  });

  it('rifiuta un programma con nome vuoto', () => {
    const result = validateProgram({
      name: '   ',
      exercises: [
        { name: 'Panca Piana', sets: 4, reps: 8, restSeconds: 90 },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Il nome del programma è obbligatorio');
  });

  it('rifiuta esercizi con serie o ripetizioni non valide', () => {
    const result = validateProgram({
      name: 'Scheda Forza',
      exercises: [
        { name: 'Squat', sets: 0, reps: -5, restSeconds: -30 },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContain("L'esercizio #1 deve avere almeno 1 serie");
    expect(result.errors).toContain("L'esercizio #1 deve avere almeno 1 ripetizione");
    expect(result.errors).toContain("Il recupero dell'esercizio #1 non può essere negativo");
  });

  it('accetta un programma valido e completo', () => {
    const result = validateProgram({
      name: 'Full Body Base',
      exercises: [
        { name: 'Stacco da terra', sets: 3, reps: 5, restSeconds: 120 },
        { name: 'Trazioni', sets: 3, reps: 8, restSeconds: 90 },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
