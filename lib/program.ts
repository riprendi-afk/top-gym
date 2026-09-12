import type { DayCount, ExerciseDraft, WorkoutDay } from './types';

export const defaultExerciseDraft = (): ExerciseDraft => ({
  name: '',
  sets: 4,
  reps: '8-10',
  weight: '',
  rpe: '8',
  rest: 90,
  type: 'NORMAL',
  tut: '2-0-1-0',
  notes: '',
});

export const createEmptyDay = (dayNumber: number): WorkoutDay => ({
  id: `day-${dayNumber}-${crypto.randomUUID?.() ?? `${Date.now()}-${dayNumber}`}`,
  dayNumber,
  title: '',
  exercises: [],
});

export const resizeProgramDays = (days: WorkoutDay[], count: DayCount): WorkoutDay[] => {
  if (count === days.length) return days;
  if (count > days.length) {
    const extra = Array.from({ length: count - days.length }, (_, i) =>
      createEmptyDay(days.length + i + 1)
    );
    return [...days, ...extra];
  }
  return days.slice(0, count).map((day, index) => ({ ...day, dayNumber: index + 1 }));
};

export const DEFAULT_PROGRAM_NAME = 'Hypertrophy Phase A';

export const createStarterProgram = (): WorkoutDay[] => [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Push',
    exercises: [
      {
        id: '1',
        name: 'Panca Piana Bilanciere',
        sets: 4,
        reps: '8-10',
        targetWeight: '80',
        rpeTarget: '8',
        restSeconds: 90,
        executionType: 'NORMAL',
        tut: '3-0-1-0',
        notes: 'Fermo al petto 1 sec',
      },
      {
        id: '4',
        name: 'Lento Avanti Manubri',
        sets: 3,
        reps: '10-12',
        targetWeight: '24',
        rpeTarget: '8',
        restSeconds: 60,
        executionType: 'DROP_SET',
        tut: '2-0-1-0',
        notes: 'Ultima serie scarico 20%',
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Pull',
    exercises: [
      {
        id: '3',
        name: 'Trazioni + Dip In Superset',
        sets: 3,
        reps: 'Max',
        targetWeight: 'BW',
        rpeTarget: '9',
        restSeconds: 90,
        executionType: 'SUPERSET',
        tut: '2-0-1-0',
        notes: 'Esegui trazioni poi subito dip',
      },
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Legs',
    exercises: [
      {
        id: '2',
        name: 'Squat Promo',
        sets: 4,
        reps: '6-8',
        targetWeight: '110',
        rpeTarget: '8.5',
        restSeconds: 120,
        executionType: 'REST_PAUSE',
        tut: '2-0-1-0',
        notes: 'Profondità sotto il parallelo',
      },
    ],
  },
  { id: 'day-4', dayNumber: 4, title: '', exercises: [] },
];
