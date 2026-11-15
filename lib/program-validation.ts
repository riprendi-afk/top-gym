// lib/program-validation.ts

export interface ExerciseInput {
  name: string;
  sets: number;
  reps: number;
  restSeconds?: number;
}

export interface ProgramInput {
  name: string;
  clientName?: string;
  exercises: ExerciseInput[];
}

export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Valida i dati di un programma di allenamento prima del salvataggio.
 */
export function validateProgram(program: Partial<ProgramInput>): ValidationResult {
  const errors: string[] = [];

  if (!program.name || program.name.trim().length === 0) {
    errors.push("Il nome del programma è obbligatorio");
  }

  if (!program.exercises || program.exercises.length === 0) {
    errors.push("Aggiungi almeno un esercizio");
  } else {
    program.exercises.forEach((exercise, index) => {
      const position = index + 1;

      if (!exercise.name || exercise.name.trim().length === 0) {
        errors.push(`L'esercizio #${position} deve avere un nome`);
      }

      if (typeof exercise.sets !== 'number' || exercise.sets <= 0) {
        errors.push(`L'esercizio #${position} deve avere almeno 1 serie`);
      }

      if (typeof exercise.reps !== 'number' || exercise.reps <= 0) {
        errors.push(`L'esercizio #${position} deve avere almeno 1 ripetizione`);
      }

      if (exercise.restSeconds !== undefined && exercise.restSeconds < 0) {
        errors.push(`Il recupero dell'esercizio #${position} non può essere negativo`);
      }
    });
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
