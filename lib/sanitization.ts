import { Exercise, WorkoutDay } from './types';

export interface SanitizedExercise extends Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetWeight: string;
  rpeTarget: string;
  restSeconds: number;
  executionType: any;
  tut: string;
  notes: string;
}

export interface SanitizedWorkoutDay extends WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  exercises: SanitizedExercise[];
  weekOverrides: Record<string, any>;
}

export function sanitizeExercise(ex: any, dayIdx: number, exIdx: number): SanitizedExercise {
  const rawWeight = String(ex?.targetWeight ?? '').trim();
  const cleanWeight = (rawWeight === 'undefined' || rawWeight === 'NaN' || rawWeight === 'null' || !rawWeight) ? '' : rawWeight;

  const rawReps = String(ex?.reps ?? '8').trim();
  const cleanReps = (rawReps === 'undefined' || rawReps === 'NaN' || rawReps === 'null' || !rawReps) ? '8' : rawReps;

  const cleanSets = (typeof ex?.sets === 'number' && ex.sets > 0)
    ? ex.sets
    : (parseInt(String(ex?.sets), 10) || 3);

  const cleanRest = parseInt(String(ex?.restSeconds), 10) || 90;

  return {
    ...ex,
    id: ex?.id || `ex-${dayIdx}-${exIdx}`,
    name: String(ex?.name || 'Esercizio').trim(),
    sets: cleanSets,
    reps: cleanReps,
    targetWeight: cleanWeight,
    restSeconds: cleanRest,
    executionType: ex?.executionType || 'NORMAL',
    tut: (ex?.tut && !String(ex.tut).includes('undefined')) ? String(ex.tut) : '2-0-1-0',
    notes: (ex?.notes && !String(ex.notes).includes('undefined')) ? String(ex.notes) : '',
    rpeTarget: String(ex?.rpeTarget || '8').trim(),
  };
}

export function sanitizeWorkoutDay(day: any, dayIdx: number): SanitizedWorkoutDay {
  const exercises = Array.isArray(day?.exercises)
    ? day.exercises.map((ex: any, exIdx: number) => sanitizeExercise(ex, dayIdx, exIdx))
    : [];

  return {
    ...day,
    id: day?.id || `day-${dayIdx}`,
    dayNumber: day?.dayNumber || dayIdx + 1,
    title: `G${day?.dayNumber || dayIdx + 1}`,
    exercises,
    weekOverrides: (day?.weekOverrides && typeof day.weekOverrides === 'object') ? day.weekOverrides : {},
  };
}

export function sanitizeProgramDays(programDays: any): SanitizedWorkoutDay[] {
  if (!Array.isArray(programDays)) return [];
  return programDays.map((day, idx) => sanitizeWorkoutDay(day, idx));
}
