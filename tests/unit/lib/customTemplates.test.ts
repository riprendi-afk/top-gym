import { describe, expect, it } from 'vitest';
import {
  buildTemplateDaysSnapshot,
  cloneTemplateDaysWithFreshIds,
} from '@/lib/custom-templates';

describe('Template Personalizzati Matrice W1-W16 (custom-templates)', () => {
  it('conserva tutte le variazioni di serie, ripetizioni, recuperi e note da W1 a W16', () => {
    const sampleDays = [
      {
        id: 'day_1',
        dayNumber: 1,
        title: 'Upper Body',
        exercises: [
          { id: 'ex_1', name: 'Panca Piana', sets: 3, reps: '8', weight: '100', restSeconds: 120 },
        ],
        weekOverrides: {
          1: { ex_1: { sets: 3, reps: '8', weight: '100', restSeconds: 120, notes: 'Buffer 2' } },
          16: { ex_1: { sets: 5, reps: '4', weight: '115', restSeconds: 180, notes: 'Picco forza' } },
        },
      },
    ];

    const snapshot = buildTemplateDaysSnapshot(sampleDays, true);
    expect(snapshot[0].exercises[0].weight).toBe('');
    expect(snapshot[0].weekOverrides[1].ex_1.sets).toBe(3);
    expect(snapshot[0].weekOverrides[16].ex_1.sets).toBe(5);
    expect(snapshot[0].weekOverrides[16].ex_1.reps).toBe('4');
  });

  it('rigenera nuovi ID esercizi riallineando le chiavi di tutte le settimane', () => {
    const savedDays = [
      {
        title: 'Lower Body',
        exercises: [{ id: 'old_ex_99', name: 'Squat', sets: 4, reps: '6' }],
        weekOverrides: {
          1: { old_ex_99: { sets: 4, reps: '6' } },
          8: { old_ex_99: { sets: 5, reps: '5' } },
        },
      },
    ];

    const cloned = cloneTemplateDaysWithFreshIds(savedDays);
    const newExId = cloned[0].exercises[0].id;
    expect(newExId).not.toBe('old_ex_99');
    expect(cloned[0].weekOverrides[8][newExId].sets).toBe(5);
  });
});