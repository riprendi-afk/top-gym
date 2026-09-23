// lib/topgym-templates.ts
// MATRICE DEI TEMPLATE E SPLIT SETTIMANALI (7 MASCHILI · 7 FEMMINILI) · METODO TOP GYM

import { EngineWorkoutDay, MacroBlock, TopGymStimulus, ExecutionType } from './topgym-engine';

export type AthleteGender = 'MALE' | 'FEMALE';

export interface TopGymSplitTemplate {
  id: string;
  name: string;
  block: MacroBlock;
  gender: AthleteGender;
  daysCount: number;
  type: 'BASE' | 'ALTERNATIVE_1' | 'ALTERNATIVE_2';
  description: string;
  focus: string;
  days: EngineWorkoutDay[];
}

/**
 * Riconosce in modo intelligente il genere dal nome dell'atleta
 */
export function detectAthleteGender(displayName?: string): AthleteGender {
  if (!displayName) return 'MALE';
  const clean = displayName.trim().toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');

  const femaleExceptions = new Set([
    'alice', 'beatrice', 'irene', 'carmen', 'ester', 'noemi', 'nicole', 'miriam', 
    'matilde', 'adele', 'rachele', 'chloe', 'zoe', 'ines', 'iris', 'astrid'
  ]);

  const maleExceptions = new Set([
    'andrea', 'luca', 'mattia', 'nicola', 'elia', 'gianluca', 'gianmaria', 
    'tobia', 'sasha', 'michele', 'battista', 'evangelista'
  ]);

  if (femaleExceptions.has(clean)) return 'FEMALE';
  if (maleExceptions.has(clean)) return 'MALE';
  if (clean.endsWith('a')) return 'FEMALE';

  return 'MALE';
}

// ============================================================================
// 1. TEMPLATE MASCHILI (7 SPLIT)
// ============================================================================

// --- 1.1 UOMO B1: BASE 4 GIORNI (Petto-Spalle-Bic / Quad-Dorso-Tric) ---
const M_B1_SPLIT_BASE: EngineWorkoutDay[] = [
  {
    id: 'b1_base_d1',
    dayNumber: 1,
    title: 'G1: Petto · Spalle · Bicipiti (Focus Neurale Panca)',
    exercises: [
      { id: 'b1_d1_ex1', name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', stimulusType: 'NEURAL', sets: 5, reps: '6', targetWeight: '75', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-1', notes: 'Assetto scapolare serrato, fermo al petto netto di 1", spinta esplosiva a buffer (RIR 2-3).' },
      { id: 'b1_d1_ex2', name: 'Spinte con Manubri su Panca 30°', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Controllo eccentrico continuo, nessun blocco articolare in alto.' },
      { id: 'b1_d1_ex3', name: 'Military Press / Lento Avanti Bilanciere', muscleGroup: 'Spalle', stimulusType: 'NEURAL', sets: 4, reps: '6', targetWeight: '45', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', notes: 'Glutei e addome serrati, traiettoria verticale pulita.' },
      { id: 'b1_d1_ex4', name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Stop isometrico di 1" a parallelo, zero slanci lombari.' },
      { id: 'b1_d1_ex5', name: 'Curl Bilanciere Sagomato (EZ)', muscleGroup: 'Bicipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Gomiti fissi ai fianchi, enfasi sul picco di contrazione.' }
    ]
  },
  {
    id: 'b1_base_d2',
    dayNumber: 2,
    title: 'G2: Gambe · Dorso · Tricipiti (Focus Neurale Squat)',
    exercises: [
      { id: 'b1_d2_ex1', name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', stimulusType: 'NEURAL', sets: 5, reps: '6', targetWeight: '90', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', notes: 'Profondità sotto il parallelo, stabilità del piede a tripode, buffer costante.' },
      { id: 'b1_d2_ex2', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '160', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Scendi profondo senza retroversione del bacino.' },
      { id: 'b1_d2_ex3', name: 'Trazioni alla Sbarra / Lat Machine Presa Larga', muscleGroup: 'Dorso', stimulusType: 'NEURAL', sets: 4, reps: '6-8', targetWeight: '0', rpeTarget: 8.0, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Depressione scapolare prima del tiraggio, petto verso la sbarra.' },
      { id: 'b1_d2_ex4', name: 'Pulley Basso Presa Stretta', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '55', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Allungamento controllato ed adduzione scapolare in chiusura.' },
      { id: 'b1_d2_ex5', name: 'French Press su Panca con Bilanciere EZ', muscleGroup: 'Tricipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '32', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Flessione del gomito controllata dietro la testa per prestirare il capo lungo.' }
    ]
  },
  {
    id: 'b1_base_d3',
    dayNumber: 3,
    title: 'G3: Petto · Spalle · Bicipiti (Focus Inclinata & Densità)',
    exercises: [
      { id: 'b1_d3_ex1', name: 'Panca Inclinata Bilanciere (30°)', muscleGroup: 'Petto', stimulusType: 'NEURAL', sets: 5, reps: '6', targetWeight: '65', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-1', notes: 'Fascio claveare in massimo reclutamento, fermo 1" controllato.' },
      { id: 'b1_d3_ex2', name: 'Dip alle Parallele (Petto focus)', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '0', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Busto inclinato in avanti, gomiti a 45 gradi.' },
      { id: 'b1_d3_ex3', name: 'Lento con Manubri da Seduto', muscleGroup: 'Spalle', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '20', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Range completo fino all\'altezza delle orecchie.' },
      { id: 'b1_d3_ex4', name: 'Alzate Laterali al Cavo Singolo', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '7.5', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Tensione costante anche nella fase iniziale del movimento.' },
      { id: 'b1_d3_ex5', name: 'Curl con Manubri a Martello (Hammer)', muscleGroup: 'Bicipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10', targetWeight: '14', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Focus su brachiale e brachioradiale, zero oscillazioni del tronco.' }
    ]
  },
  {
    id: 'b1_base_d4',
    dayNumber: 4,
    title: 'G4: Gambe · Dorso · Tricipiti (Focus Stacco / Catena Posteriore)',
    exercises: [
      { id: 'b1_d4_ex1', name: 'Stacco da Terra con Bilanciere (o Rumeno)', muscleGroup: 'Femorali', stimulusType: 'NEURAL', sets: 5, reps: '5-6', targetWeight: '110', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', notes: 'Spinta con le gambe, catena posteriore attiva, schiena perfettamente neutra.' },
      { id: 'b1_d4_ex2', name: 'Leg Curl Seduto / Sdraiato', muscleGroup: 'Femorali', stimulusType: 'METABOLIC', sets: 4, reps: '10-12', targetWeight: '45', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-1', notes: 'Flessione del ginocchio decisa con 1" di contrazione di picco.' },
      { id: 'b1_d4_ex3', name: 'Rematore con Bilanciere Presa Prona (Yates o 45°)', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8', targetWeight: '60', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Trazione verso l\'ombelico con gomiti aderenti.' },
      { id: 'b1_d4_ex4', name: 'Lat Machine Presa Neutra / Triangolo', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '60', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Range di movimento profondo, allungamento dorsale in risalita.' },
      { id: 'b1_d4_ex5', name: 'Pushdown ai Cavi con Corda', muscleGroup: 'Tricipiti', stimulusType: 'METABOLIC', sets: 4, reps: '12', targetWeight: '22', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Apertura finale della corda in blocco articolare per reclutare il capo laterale.' }
    ]
  }
];

// --- 1.2 UOMO B1: UPPER / LOWER 4 GIORNI ---
const M_B1_SPLIT_UPPER_LOWER: EngineWorkoutDay[] = [
  {
    id: 'b1_ul_d1',
    dayNumber: 1,
    title: 'G1: Upper A (Forza Panca & Trazioni)',
    exercises: [
      { id: 'b1_ul_1', name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', sets: 5, reps: '6', targetWeight: '75', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_2', name: 'Trazioni Zavorrate / Lat Machine', muscleGroup: 'Dorso', sets: 5, reps: '6', targetWeight: '0', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_3', name: 'Spinte con Manubri Panca 30°', muscleGroup: 'Petto', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_4', name: 'Pulley al Cavo', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '55', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_5', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 3, reps: '12', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_6', name: 'Super-set Braccia (Curl EZ + Pushdown)', muscleGroup: 'Bicipiti', sets: 3, reps: '10+10', targetWeight: '25', rpeTarget: 8.0, restSeconds: 90, executionType: 'SUPERSET', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ul_d2',
    dayNumber: 2,
    title: 'G2: Lower A (Forza Squat & Catena Anteriore)',
    exercises: [
      { id: 'b1_ul_7', name: 'Squat Bilanciere', muscleGroup: 'Quadricipiti', sets: 5, reps: '6', targetWeight: '90', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_8', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', sets: 4, reps: '8-10', targetWeight: '160', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_9', name: 'Affondi con Manubri in Avanzamento', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 per gamba', targetWeight: '16', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_10', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '12-15', targetWeight: '40', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_11', name: 'Calf Raise Seduto / In Piedi', muscleGroup: 'Polpacci', sets: 4, reps: '15', targetWeight: '50', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b1_ul_d3',
    dayNumber: 3,
    title: 'G3: Upper B (Forza Military & Spessore Dorso)',
    exercises: [
      { id: 'b1_ul_12', name: 'Military Press Bilanciere', muscleGroup: 'Spalle', sets: 5, reps: '6', targetWeight: '45', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_13', name: 'Rematore con Bilanciere Prono', muscleGroup: 'Dorso', sets: 5, reps: '6', targetWeight: '65', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_14', name: 'Dip alle Parallele con Sovraccarico', muscleGroup: 'Petto', sets: 4, reps: '8', targetWeight: '10', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_15', name: 'Lat Machine Presa a Triangolo', muscleGroup: 'Dorso', sets: 4, reps: '10', targetWeight: '60', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_16', name: 'Face Pull ai Cavi', muscleGroup: 'Spalle', sets: 4, reps: '12-15', targetWeight: '20', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_17', name: 'Curl Martello + French Press Manubri', muscleGroup: 'Bicipiti', sets: 3, reps: '10+10', targetWeight: '14', rpeTarget: 8.0, restSeconds: 90, executionType: 'SUPERSET', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ul_d4',
    dayNumber: 4,
    title: 'G4: Lower B (Forza Stacco & Catena Posteriore)',
    exercises: [
      { id: 'b1_ul_18', name: 'Stacco da Terra Bilanciere', muscleGroup: 'Femorali', sets: 5, reps: '5', targetWeight: '110', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_19', name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_20', name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', sets: 4, reps: '10-12', targetWeight: '40', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_21', name: 'Leg Press Piedi Alti (Enfasi Glutei/Femorali)', muscleGroup: 'Glutei', sets: 3, reps: '12', targetWeight: '140', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_22', name: 'Calf alla Pressa', muscleGroup: 'Polpacci', sets: 4, reps: '12-15', targetWeight: '120', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 1.3 UOMO B1: PUSH / PULL / LEGS 3 GIORNI ---
const M_B1_SPLIT_PPL_3D: EngineWorkoutDay[] = [
  {
    id: 'b1_ppl3_d1',
    dayNumber: 1,
    title: 'G1: Push (Panca Piana & Forza Spinta)',
    exercises: [
      { id: 'b1_p3_1', name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', sets: 5, reps: '5-6', targetWeight: '80', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-1', stimulusType: 'NEURAL', notes: 'Fermo 1" netto al petto, RIR 2-3 rigoroso.' },
      { id: 'b1_p3_2', name: 'Military Press con Bilanciere', muscleGroup: 'Spalle', sets: 4, reps: '6', targetWeight: '45', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_p3_3', name: 'Spinte Manubri su Panca 30°', muscleGroup: 'Petto', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_4', name: 'Dip alle Parallele', muscleGroup: 'Petto', sets: 3, reps: '8-10', targetWeight: '0', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_5', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 3, reps: '12', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_p3_6', name: 'French Press Bilanciere EZ', muscleGroup: 'Tricipiti', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ppl3_d2',
    dayNumber: 2,
    title: 'G2: Pull (Stacco da Terra & Trazione)',
    exercises: [
      { id: 'b1_p3_7', name: 'Stacco da Terra con Bilanciere', muscleGroup: 'Dorso', sets: 5, reps: '5', targetWeight: '115', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL', notes: 'Focus neurale massimo, schiena bloccata, no cedimento.' },
      { id: 'b1_p3_8', name: 'Trazioni alla Sbarra Presa Prona', muscleGroup: 'Dorso', sets: 4, reps: '6-8', targetWeight: '0', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b1_p3_9', name: 'Rematore con Bilanciere 45°', muscleGroup: 'Dorso', sets: 4, reps: '8', targetWeight: '60', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_10', name: 'Pulley Basso al Triangolo', muscleGroup: 'Dorso', sets: 3, reps: '10', targetWeight: '55', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_11', name: 'Face Pull con Corda ai Cavi', muscleGroup: 'Spalle', sets: 3, reps: '12-15', targetWeight: '20', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_p3_12', name: 'Curl con Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ppl3_d3',
    dayNumber: 3,
    title: 'G3: Legs (Squat Bilanciere & Catena Inferiore)',
    exercises: [
      { id: 'b1_p3_13', name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', sets: 5, reps: '6', targetWeight: '90', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL', notes: 'Piedi stabili, discesa sotto al parallelo, buffer 2 reps.' },
      { id: 'b1_p3_14', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', sets: 4, reps: '8-10', targetWeight: '160', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_15', name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_p3_16', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '12', targetWeight: '40', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_p3_17', name: 'Leg Curl Seduto o Sdraiato', muscleGroup: 'Femorali', sets: 3, reps: '10-12', targetWeight: '40', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_p3_18', name: 'Calf alla Pressa o Macchina', muscleGroup: 'Polpacci', sets: 4, reps: '15', targetWeight: '90', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 1.4 UOMO B2-B3: ANTAGONISTI BASE 4 GIORNI ---
const M_B2_SPLIT_ANTAGONISTI: EngineWorkoutDay[] = [
  {
    id: 'b2_antag_d1',
    dayNumber: 1,
    title: 'G1: Petto · Dorso · Tricipiti (Antagonisti Spinta/Trazione A)',
    exercises: [
      { id: 'b2_d1_1', name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', stimulusType: 'NEURAL', sets: 4, reps: '6', targetWeight: '80', rpeTarget: 8.0, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Mantenimento della forza pura a inizio seduta.' },
      { id: 'b2_d1_2', name: 'Rematore T-Bar con Appoggio al Petto', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '50', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Trazione piena, massima adduzione scapolare. Cedimento sull\'ultima serie.' },
      { id: 'b2_d1_3', name: 'Spinte Manubri su Panca Inclinata 30°', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Cedimento concentrico reale sull\'ultima serie.' },
      { id: 'b2_d1_4', name: 'Lat Machine Presa Neutra Stretta', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10', targetWeight: '65', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Gomiti portati ai fianchi, stretch profondo in fase di risalita.' },
      { id: 'b2_d1_5', name: 'Croci ai Cavi dall\'Alto su Panca / In Piedi', muscleGroup: 'Petto', stimulusType: 'METABOLIC', sets: 3, reps: '10 + MAX', targetWeight: '12.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-2', notes: '10 reps piene @ buffer 0, scarico immediato del 40% del pacco pesi e avanti a cedimento.' },
      { id: 'b2_d1_6', name: 'Pushdown con Cavo Singolo / Barra a V', muscleGroup: 'Tricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '10-12', targetWeight: '25', rpeTarget: 9.5, restSeconds: 60, executionType: 'STRIPPING', tut: '2-0-1-1', notes: 'Stripping a 1 scarico sull\'ultima serie (-35% peso fino a cedimento).' }
    ]
  },
  {
    id: 'b2_antag_d2',
    dayNumber: 2,
    title: 'G2: Gambe · Spalle · Bicipiti (Catena Anteriore & Spalle)',
    exercises: [
      { id: 'b2_d2_1', name: 'Squat con Bilanciere o Hack Squat', muscleGroup: 'Quadricipiti', stimulusType: 'NEURAL', sets: 4, reps: '6-8', targetWeight: '95', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Alzata pesante di stimolo neurale e tensione meccanica.' },
      { id: 'b2_d2_2', name: 'Leg Press a 45°', muscleGroup: 'Quadricipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10-12', targetWeight: '180', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Profondità massima, piedi a centro pedana.' },
      { id: 'b2_d2_3', name: 'Leg Extension', muscleGroup: 'Quadricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', notes: 'Saturazione quadricipiti: 10 reps a cedimento + scarico 40% a max reps.' },
      { id: 'b2_d2_4', name: 'Shoulder Press con Manubri / Machine', muscleGroup: 'Spalle', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '22', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Spinta fluida senza serrare i gomiti.' },
      { id: 'b2_d2_5', name: 'Alzate Laterali con Manubri o ai Cavi', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12', targetWeight: '10', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', notes: 'Stripping a 1-2 scarichi sull\'ultima serie.' },
      { id: 'b2_d2_6', name: 'Curl su Panca Inclinata a 45° con Manubri', muscleGroup: 'Bicipiti', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10', targetWeight: '12', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Massimo prestiramento del capo lungo del bicipite.' }
    ]
  },
  {
    id: 'b2_antag_d3',
    dayNumber: 3,
    title: 'G3: Petto · Dorso · Tricipiti (Antagonisti Spinta/Trazione B)',
    exercises: [
      { id: 'b2_d3_1', name: 'Panca Inclinata con Manubri', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Carico pesante controllato in discesa, tocca le spalle e spingi.' },
      { id: 'b2_d3_2', name: 'Pulley al Basso o Row Machine', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '60', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Trazione solida all\'addome con gomiti bassi.' },
      { id: 'b2_d3_3', name: 'Chest Press Machine / Dip', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '60', rpeTarget: 9.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Cedimento concentrico garantito in sicurezza sulla macchina.' },
      { id: 'b2_d3_4', name: 'Pull-down a Braccia Tese al Cavo Alto', muscleGroup: 'Dorso', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '22', rpeTarget: 9.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Isolamento del gran dorsale con massimo allungamento in alto.' },
      { id: 'b2_d3_5', name: 'Dip tra due Panche / Parallele', muscleGroup: 'Tricipiti', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '15', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Discesa profonda senza intrarotare le spalle.' },
      { id: 'b2_d3_6', name: 'Estensioni Tricipiti sopra la testa con Cavo', muscleGroup: 'Tricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '17.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', notes: 'Pompaggio del capo lungo con scarico rapido al cedimento.' }
    ]
  },
  {
    id: 'b2_antag_d4',
    dayNumber: 4,
    title: 'G4: Gambe · Spalle · Bicipiti (Catena Posteriore & Spalle)',
    exercises: [
      { id: 'b2_d4_1', name: 'Stacco Rumeno con Bilanciere o Manubri', muscleGroup: 'Femorali', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '80', rpeTarget: 8.5, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Enfasi totale sui femorali e glutei in fase di allungamento.' },
      { id: 'b2_d4_2', name: 'Leg Curl Sdraiato o in Piedi', muscleGroup: 'Femorali', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10', targetWeight: '40', rpeTarget: 9.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Contrazione di picco marcata a ginocchio flesso.' },
      { id: 'b2_d4_3', name: 'Alzate Laterali ai Cavi Incrociati o Macchina', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 4, reps: '12-15', targetWeight: '7.5', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', notes: 'Bruciore e congestione del deltoide laterale con scarico finale.' },
      { id: 'b2_d4_4', name: 'Deltoidi Posteriori al Cavo / Pec Deck inverso', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '15', targetWeight: '35', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Gomiti leggermente flessi, zero intervento dei trapezi superiori.' },
      { id: 'b2_d4_5', name: 'Spider Curl su Panca Inclinata con Bilanciere EZ', muscleGroup: 'Bicipiti', stimulusType: 'METABOLIC', sets: 3, reps: '10 + MAX', targetWeight: '20', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', notes: 'Braccia a perpendicolo verso il basso, isolamento puro senza compensi.' }
    ]
  }
];

// --- 1.5 UOMO B2-B3: PUSH / PULL COMPLETO 4 GIORNI ---
const M_B2_SPLIT_PUSH_PULL: EngineWorkoutDay[] = [
  {
    id: 'b2_pp_d1',
    dayNumber: 1,
    title: 'G1: Push A (Petto · Spalle Ant/Lat · Tricipiti)',
    exercises: [
      { id: 'b2_pp_1', name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', sets: 4, reps: '6-8', targetWeight: '80', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_2', name: 'Spinte Manubri su Panca Inclinata', muscleGroup: 'Petto', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_3', name: 'Lento Avanti con Manubri', muscleGroup: 'Spalle', sets: 3, reps: '8-10', targetWeight: '20', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_4', name: 'Alzate Laterali al Cavo', muscleGroup: 'Spalle', sets: 3, reps: '12-15', targetWeight: '7.5', rpeTarget: 9.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_5', name: 'French Press con Bilanciere EZ', muscleGroup: 'Tricipiti', sets: 3, reps: '10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_6', name: 'Pushdown Corda ai Cavi', muscleGroup: 'Tricipiti', sets: 3, reps: '10 + MAX', targetWeight: '20', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d2',
    dayNumber: 2,
    title: 'G2: Pull A (Dorso Ampiezza/Spessore · Deltoidi Post · Bicipiti)',
    exercises: [
      { id: 'b2_pp_7', name: 'Trazioni / Lat Machine Presa Larga', muscleGroup: 'Dorso', sets: 4, reps: '6-8', targetWeight: '0', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b2_pp_8', name: 'Rematore Bilanciere a 45°', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '60', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_9', name: 'Pulley Presa Stretta al Cavo', muscleGroup: 'Dorso', sets: 3, reps: '10-12', targetWeight: '55', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_10', name: 'Face Pull con Corda', muscleGroup: 'Spalle', sets: 3, reps: '12-15', targetWeight: '20', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_11', name: 'Curl Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_12', name: 'Curl a Martello ai Cavi', muscleGroup: 'Bicipiti', sets: 3, reps: '10 + MAX', targetWeight: '17.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d3',
    dayNumber: 3,
    title: 'G3: Push B (Enfasi Gambe Quad · Petto Alto · Spalle)',
    exercises: [
      { id: 'b2_pp_13', name: 'Squat Bilanciere o Hack Squat', muscleGroup: 'Quadricipiti', sets: 4, reps: '6-8', targetWeight: '90', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_14', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', sets: 4, reps: '10-12', targetWeight: '180', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_15', name: 'Panca Inclinata con Bilanciere', muscleGroup: 'Petto', sets: 4, reps: '8', targetWeight: '65', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_16', name: 'Croci ai Cavi dal Basso', muscleGroup: 'Petto', sets: 3, reps: '12-15', targetWeight: '10', rpeTarget: 9.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_17', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d4',
    dayNumber: 4,
    title: 'G4: Pull B (Enfasi Catena Posteriore · Dorso Densità · Bicipiti)',
    exercises: [
      { id: 'b2_pp_18', name: 'Stacco da Terra Rumeno', muscleGroup: 'Femorali', sets: 4, reps: '8', targetWeight: '85', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_19', name: 'Leg Curl Seduto', muscleGroup: 'Femorali', sets: 4, reps: '10-12', targetWeight: '45', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_20', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '10', targetWeight: '60', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_21', name: 'Rematore con Manubrio Singolo', muscleGroup: 'Dorso', sets: 3, reps: '10 per lato', targetWeight: '26', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_22', name: 'Curl su Panca Scott con Manubrio', muscleGroup: 'Bicipiti', sets: 3, reps: '10 + MAX', targetWeight: '12', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 1.6 UOMO B2-B3: PPL + UPPER RICHIAMO 4 GIORNI ---
const M_B2_SPLIT_PPL_UPPER: EngineWorkoutDay[] = [
  {
    id: 'b2_pplu_d1',
    dayNumber: 1,
    title: 'G1: Push (Petto Carico Pesante & Rest-Pause)',
    exercises: [
      { id: 'b2_pu_1', name: 'Panca Inclinata Manubri', muscleGroup: 'Petto', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC', notes: 'Rest-Pause sull\'ultima serie: cedimento -> 15" -> max reps.' },
      { id: 'b2_pu_2', name: 'Dip alle Parallele Zavorrate', muscleGroup: 'Petto', sets: 3, reps: '8', targetWeight: '10', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_3', name: 'Chest Press Machine', muscleGroup: 'Petto', sets: 3, reps: '10 + MAX', targetWeight: '60', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_4', name: 'Shoulder Press con Manubri', muscleGroup: 'Spalle', sets: 4, reps: '8-10', targetWeight: '22', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_5', name: 'Alzate Laterali ai Cavi', muscleGroup: 'Spalle', sets: 4, reps: '12', targetWeight: '7.5', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_6', name: 'French Press con Bilanciere EZ', muscleGroup: 'Tricipiti', sets: 3, reps: '10', targetWeight: '32', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b2_pplu_d2',
    dayNumber: 2,
    title: 'G2: Pull (Dorso Larghezza, Spessore & Bicipiti)',
    exercises: [
      { id: 'b2_pu_7', name: 'Lat Machine Presa Neutra Stretta', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '65', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_8', name: 'Rematore con Manubrio Singolo', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_9', name: 'Pulley Basso al Cavo', muscleGroup: 'Dorso', sets: 3, reps: '10 + MAX', targetWeight: '55', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_10', name: 'Deltoidi Posteriori Pec Deck Inverso', muscleGroup: 'Spalle', sets: 4, reps: '12-15', targetWeight: '35', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_11', name: 'Curl su Panca Inclinata a 45°', muscleGroup: 'Bicipiti', sets: 4, reps: '10', targetWeight: '12', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_12', name: 'Curl a Martello ai Cavi Basso', muscleGroup: 'Bicipiti', sets: 3, reps: '10 + MAX', targetWeight: '17.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pplu_d3',
    dayNumber: 3,
    title: 'G3: Legs (Enfasi Gambe Completa & Back-off)',
    exercises: [
      { id: 'b2_pu_13', name: 'Hack Squat o Squat al Multipower', muscleGroup: 'Quadricipiti', sets: 4, reps: '8', targetWeight: '100', rpeTarget: 9.0, restSeconds: 120, executionType: 'BACK_OFF', tut: '3-0-1-0', stimulusType: 'NEURAL', notes: 'Back-off finale a -25% a cedimento concentrico.' },
      { id: 'b2_pu_14', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', sets: 4, reps: '10-12', targetWeight: '190', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_15', name: 'Stacco Rumeno con Bilanciere', muscleGroup: 'Femorali', sets: 4, reps: '8-10', targetWeight: '80', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_16', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_17', name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', sets: 3, reps: '10', targetWeight: '40', rpeTarget: 9.5, restSeconds: 60, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_18', name: 'Calf alla Pressa', muscleGroup: 'Polpacci', sets: 4, reps: '15', targetWeight: '130', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pplu_d4',
    dayNumber: 4,
    title: 'G4: Upper Body Pump (Richiamo Densità & Braccia)',
    exercises: [
      { id: 'b2_pu_19', name: 'Panca Piana con Manubri', muscleGroup: 'Petto', sets: 3, reps: '8-10', targetWeight: '30', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_20', name: 'Trazioni / Lat Machine Presa Larga', muscleGroup: 'Dorso', sets: 3, reps: '8', targetWeight: '0', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_21', name: 'Croci ai Cavi dall\'Alto', muscleGroup: 'Petto', sets: 3, reps: '12-15', targetWeight: '12.5', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-2', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_22', name: 'Pulley al Basso con Corda', muscleGroup: 'Dorso', sets: 3, reps: '10-12', targetWeight: '50', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pu_23', name: 'Alzate Laterali Manubri a Sedere', muscleGroup: 'Spalle', sets: 4, reps: '15', targetWeight: '8', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pu_24', name: 'Super-set Braccia (Curl EZ + Pushdown)', muscleGroup: 'Bicipiti', sets: 4, reps: '10+10', targetWeight: '25', rpeTarget: 9.5, restSeconds: 75, executionType: 'SUPERSET', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  }
];

// --- 1.7 UOMO B2-B3: PRO SPLIT 5 GIORNI HIGH VOLUME ---
const M_B2_SPLIT_5D_PRO: EngineWorkoutDay[] = [
  {
    id: 'b2_5d_d1',
    dayNumber: 1,
    title: 'G1: Petto & Addome (Volume & 10+MAX)',
    exercises: [
      { id: 'b2_5d_1', name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', sets: 4, reps: '6-8', targetWeight: '82.5', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_5d_2', name: 'Spinte Manubri su Panca Inclinata', muscleGroup: 'Petto', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_3', name: 'Dip alle Parallele', muscleGroup: 'Petto', sets: 3, reps: '10', targetWeight: '0', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_4', name: 'Croci ai Cavi dall\'Alto', muscleGroup: 'Petto', sets: 3, reps: '10 + MAX', targetWeight: '12.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-2', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_5', name: 'Crunch ai Cavi / Macchina Addome', muscleGroup: 'Addome', sets: 4, reps: '15', targetWeight: '40', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_5d_d2',
    dayNumber: 2,
    title: 'G2: Dorso & Deltoidi Posteriori (Ampiezza & Spessore)',
    exercises: [
      { id: 'b2_5d_6', name: 'Trazioni alla Sbarra / Lat Machine Presa Larga', muscleGroup: 'Dorso', sets: 4, reps: '6-8', targetWeight: '0', rpeTarget: 8.5, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b2_5d_7', name: 'Rematore T-Bar al Petto', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '55', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_8', name: 'Pulley Basso Presa Stretta', muscleGroup: 'Dorso', sets: 3, reps: '10 + MAX', targetWeight: '60', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_9', name: 'Pulldown a Braccia Tese al Cavo', muscleGroup: 'Dorso', sets: 3, reps: '12-15', targetWeight: '22', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_10', name: 'Face Pull con Corda ai Cavi', muscleGroup: 'Spalle', sets: 4, reps: '15', targetWeight: '20', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_5d_d3',
    dayNumber: 3,
    title: 'G3: Gambe Focus Catena Anteriore (Squat & Pressa)',
    exercises: [
      { id: 'b2_5d_11', name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', sets: 4, reps: '6-8', targetWeight: '95', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_5d_12', name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', sets: 4, reps: '10-12', targetWeight: '190', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_13', name: 'Affondi con Manubri in Avanzamento', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 per gamba', targetWeight: '18', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_14', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_15', name: 'Calf Raise alla Macchina o Seduto', muscleGroup: 'Polpacci', sets: 4, reps: '15', targetWeight: '50', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_5d_d4',
    dayNumber: 4,
    title: 'G4: Spalle & Braccia (Deltoidi 3D & Pump)',
    exercises: [
      { id: 'b2_5d_16', name: 'Shoulder Press con Manubri', muscleGroup: 'Spalle', sets: 4, reps: '8-10', targetWeight: '22', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_17', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 4, reps: '12', targetWeight: '10', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_18', name: 'Curl con Bilanciere EZ in Piedi', muscleGroup: 'Bicipiti', sets: 4, reps: '8-10', targetWeight: '32', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_19', name: 'French Press con Manubri su Panca', muscleGroup: 'Tricipiti', sets: 4, reps: '10', targetWeight: '12', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_20', name: 'Super-set Martello Cavi + Pushdown Corda', muscleGroup: 'Bicipiti', sets: 3, reps: '10+10', targetWeight: '20', rpeTarget: 10, restSeconds: 60, executionType: 'SUPERSET', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_5d_d5',
    dayNumber: 5,
    title: 'G5: Catena Posteriore & Richiamo Spinta',
    exercises: [
      { id: 'b2_5d_21', name: 'Stacco da Terra Rumeno', muscleGroup: 'Femorali', sets: 4, reps: '8', targetWeight: '90', rpeTarget: 8.5, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_5d_22', name: 'Leg Curl Seduto o Sdraiato', muscleGroup: 'Femorali', sets: 4, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_5d_23', name: 'Iperestensioni Glutei/Femorali', muscleGroup: 'Glutei', sets: 3, reps: '12', targetWeight: '15', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_24', name: 'Panca Inclinata con Manubri', muscleGroup: 'Petto', sets: 3, reps: '10', targetWeight: '26', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_5d_25', name: 'Lat Machine Presa a Triangolo', muscleGroup: 'Dorso', sets: 3, reps: '10', targetWeight: '60', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' }
    ]
  }
];

// ============================================================================
// 2. TEMPLATE FEMMINILI (7 SPLIT)
// ============================================================================

// --- 2.1 DONNA B1: BASE 4 GIORNI (Hip Thrust Neurale & Glutei) ---
const F_B1_SPLIT_BASE: EngineWorkoutDay[] = [
  {
    id: 'f_b1_d1',
    dayNumber: 1,
    title: 'G1: Glutei Focus Neurale & Schiena (Hip Thrust Neurale)',
    exercises: [
      { id: 'f_b1_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', stimulusType: 'NEURAL', sets: 5, reps: '6', targetWeight: '80', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-1-X-1', notes: 'Fermo isometrico di 1" in cima per fissare l\'attivazione glutea. Rigoroso BUFFER (RIR 2-3).' },
      { id: 'f_b1_2', name: 'Stacco Rumeno con Manubri (RDL)', muscleGroup: 'Femorali', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '20', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Cerniera d\'anca profonda, stretch sui femorali a schiena neutra.' },
      { id: 'f_b1_3', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '35', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Trazione controllata al petto, postura scapolare perfetta.' },
      { id: 'f_b1_4', name: 'Glute Kickback al Cavo Basso', muscleGroup: 'Glutei', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Focus sul grande gluteo, nessun compenso con la zona lombare.' },
      { id: 'f_b1_5', name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '5', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Isolamento deltoide laterale per modellare le linee clavicolari.' }
    ]
  },
  {
    id: 'f_b1_d2',
    dayNumber: 2,
    title: 'G2: Gambe Quad-Focus & Spinta Upper (Squat / Bulgari)',
    exercises: [
      { id: 'f_b1_6', name: 'Squat con Bilanciere o Box Squat', muscleGroup: 'Quadricipiti', stimulusType: 'NEURAL', sets: 5, reps: '6', targetWeight: '50', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', notes: 'Assetto stabile, profondità al parallelo, buffer costante.' },
      { id: 'f_b1_7', name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10 per gamba', targetWeight: '12', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Busto inclinato a 30° per massimizzare il reclutamento del gluteo.' },
      { id: 'f_b1_8', name: 'Spinte con Manubri su Panca Inclinata 30°', muscleGroup: 'Petto', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10', targetWeight: '12', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Spinta controllata, stabilità delle spalle.' },
      { id: 'f_b1_9', name: 'Leg Extension', muscleGroup: 'Quadricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '12', targetWeight: '30', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Estensione controllata con 1" di contrazione in cima.' },
      { id: 'f_b1_10', name: 'Pushdown Corda ai Cavi (Tricipiti)', muscleGroup: 'Tricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '12', targetWeight: '12.5', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Gomiti fermi ai fianchi, apertura corda finale.' }
    ]
  },
  {
    id: 'f_b1_d3',
    dayNumber: 3,
    title: 'G3: Catena Posteriore & Dorso (Stacco Semi-sumo)',
    exercises: [
      { id: 'f_b1_11', name: 'Stacco da Terra Semi-Sumo con Bilanciere', muscleGroup: 'Glutei', stimulusType: 'NEURAL', sets: 5, reps: '5-6', targetWeight: '65', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', notes: 'Ginocchia aperte in linea con le punte dei piedi, spinta pelvica in chiusura con RIR 2-3.' },
      { id: 'f_b1_12', name: 'Rematore con Manubrio su Panca', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10 per lato', targetWeight: '14', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Trazione pura del gomito verso il bacino.' },
      { id: 'f_b1_13', name: 'Leg Curl Seduto o Sdraiato', muscleGroup: 'Femorali', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10-12', targetWeight: '30', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-1', notes: 'Flessione decisa senza staccare il bacino dal cuscino.' },
      { id: 'f_b1_14', name: 'Abductor Machine con Busto Inclinato', muscleGroup: 'Glutei', stimulusType: 'METABOLIC', sets: 4, reps: '15', targetWeight: '40', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Busto inclinato in avanti per colpire medio e piccolo gluteo.' },
      { id: 'f_b1_15', name: 'Curl Bicipiti con Manubri a Martello', muscleGroup: 'Bicipiti', stimulusType: 'METABOLIC', sets: 3, reps: '12', targetWeight: '7', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Isolamento flessori senza oscillare.' }
    ]
  },
  {
    id: 'f_b1_d4',
    dayNumber: 4,
    title: 'G4: Densità Glutei & Spalle (Hip Thrust Variato & Affondi)',
    exercises: [
      { id: 'f_b1_16', name: 'Hip Thrust al Multipower o Bilanciere', muscleGroup: 'Glutei', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '75', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '2-1-1-1', notes: 'Fermo 1" in massima estensione d\'anca a buffer.' },
      { id: 'f_b1_17', name: 'Leg Press 45° Piedi Alti e Larghi', muscleGroup: 'Glutei', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10', targetWeight: '110', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Spinta con i talloni per attivare glutei e femorali.' },
      { id: 'f_b1_18', name: 'Lento Avanti con Manubri', muscleGroup: 'Spalle', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10', targetWeight: '10', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Spinta fluida senza inarcare la schiena.' },
      { id: 'f_b1_19', name: 'Alzate Laterali al Cavo Singolo', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12-15', targetWeight: '5', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Tensione costante e continua.' },
      { id: 'f_b1_20', name: 'Calf Raise alla Macchina o su Gradino', muscleGroup: 'Polpacci', stimulusType: 'METABOLIC', sets: 3, reps: '15', targetWeight: '30', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', notes: 'Fermo in allungamento 1" e spinta completa.' }
    ]
  }
];

// --- 2.2 DONNA B1: UPPER / LOWER SPECIALIZZAZIONE GLUTEI 4 GIORNI ---
const F_B1_SPLIT_UL_GLUTE: EngineWorkoutDay[] = [
  {
    id: 'f_b1_ulg_d1',
    dayNumber: 1,
    title: 'G1: Lower A (Forza Hip Thrust & Glutei)',
    exercises: [
      { id: 'f_ulg_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', sets: 5, reps: '6', targetWeight: '85', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-1-X-1', stimulusType: 'NEURAL', notes: 'Fermo 1" in alto, tensione sui glutei, RIR 2-3.' },
      { id: 'f_ulg_2', name: 'Squat con Bilanciere o Goblet Squat', muscleGroup: 'Quadricipiti', sets: 4, reps: '8', targetWeight: '45', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_3', name: 'Affondi Bulgari Manubri', muscleGroup: 'Glutei', sets: 3, reps: '10 per gamba', targetWeight: '12', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_4', name: 'Leg Curl Seduto', muscleGroup: 'Femorali', sets: 3, reps: '12', targetWeight: '30', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ulg_5', name: 'Abductor Machine con Busto avanti', muscleGroup: 'Glutei', sets: 4, reps: '15', targetWeight: '45', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b1_ulg_d2',
    dayNumber: 2,
    title: 'G2: Upper A (Dorso Larghezza & Spalle 3D)',
    exercises: [
      { id: 'f_ulg_6', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '35', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_7', name: 'Spinte Manubri su Panca Inclinata', muscleGroup: 'Petto', sets: 3, reps: '10', targetWeight: '12', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_8', name: 'Pulley al Basso Presa Stretta', muscleGroup: 'Dorso', sets: 3, reps: '10-12', targetWeight: '30', rpeTarget: 8.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_9', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 4, reps: '12-15', targetWeight: '6', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ulg_10', name: 'Pushdown ai Cavi con Corda', muscleGroup: 'Tricipiti', sets: 3, reps: '12', targetWeight: '12.5', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b1_ulg_d3',
    dayNumber: 3,
    title: 'G3: Lower B (Forza Stacco Rumeno & Cavi)',
    exercises: [
      { id: 'f_ulg_11', name: 'Stacco Rumeno con Bilanciere', muscleGroup: 'Femorali', sets: 5, reps: '6', targetWeight: '55', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'NEURAL', notes: 'Focus cerniera d\'anca e prestiramento dei femorali.' },
      { id: 'f_ulg_12', name: 'Leg Press Piedi Alti e Larghi', muscleGroup: 'Glutei', sets: 4, reps: '10', targetWeight: '120', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_13', name: 'Glute Kickback al Cavo Basso', muscleGroup: 'Glutei', sets: 4, reps: '12 per lato', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ulg_14', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '12-15', targetWeight: '30', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ulg_15', name: 'Calf alla Macchina', muscleGroup: 'Polpacci', sets: 3, reps: '15', targetWeight: '30', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b1_ulg_d4',
    dayNumber: 4,
    title: 'G4: Upper B (Spalle & Densità Schiena)',
    exercises: [
      { id: 'f_ulg_16', name: 'Shoulder Press Manubri da Seduta', muscleGroup: 'Spalle', sets: 4, reps: '8-10', targetWeight: '12', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_17', name: 'Rematore con Manubrio su Panca', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '14', rpeTarget: 8.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_18', name: 'Lat Machine Presa Inversa', muscleGroup: 'Dorso', sets: 3, reps: '10-12', targetWeight: '35', rpeTarget: 8.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ulg_19', name: 'Alzate Laterali al Cavo Singolo', muscleGroup: 'Spalle', sets: 4, reps: '12-15', targetWeight: '5', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ulg_20', name: 'Curl Manubri a Martello', muscleGroup: 'Bicipiti', sets: 3, reps: '12', targetWeight: '7', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 2.3 DONNA B1: FULL BODY 3 GIORNI (Tonificazione & Base Neurale) ---
const F_B1_SPLIT_FULL_3D: EngineWorkoutDay[] = [
  {
    id: 'f_b1_fb3_d1',
    dayNumber: 1,
    title: 'G1: Full Body A (Focus Neurale Hip Thrust)',
    exercises: [
      { id: 'f_fb3_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', sets: 5, reps: '6', targetWeight: '80', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-1-X-1', stimulusType: 'NEURAL' },
      { id: 'f_fb3_2', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '35', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_3', name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', sets: 3, reps: '8-10 per gamba', targetWeight: '12', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_4', name: 'Spinte Manubri su Panca 30°', muscleGroup: 'Petto', sets: 3, reps: '10', targetWeight: '12', rpeTarget: 8.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_5', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 3, reps: '12-15', targetWeight: '5', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b1_fb3_d2',
    dayNumber: 2,
    title: 'G2: Full Body B (Focus Neurale Squat & Dorso)',
    exercises: [
      { id: 'f_fb3_6', name: 'Squat con Bilanciere o Box Squat', muscleGroup: 'Quadricipiti', sets: 5, reps: '6', targetWeight: '50', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'f_fb3_7', name: 'Rematore Manubrio Singolo', muscleGroup: 'Dorso', sets: 4, reps: '8-10 per lato', targetWeight: '14', rpeTarget: 8.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_8', name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', sets: 4, reps: '8-10', targetWeight: '20', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_9', name: 'Shoulder Press Manubri', muscleGroup: 'Spalle', sets: 3, reps: '10', targetWeight: '10', rpeTarget: 8.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_10', name: 'Leg Curl Seduto', muscleGroup: 'Femorali', sets: 3, reps: '12', targetWeight: '30', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b1_fb3_d3',
    dayNumber: 3,
    title: 'G3: Full Body C (Focus Semi-Sumo & Cavi)',
    exercises: [
      { id: 'f_fb3_11', name: 'Stacco da Terra Semi-Sumo', muscleGroup: 'Glutei', sets: 5, reps: '5', targetWeight: '65', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'f_fb3_12', name: 'Leg Press Piedi Alti e Larghi', muscleGroup: 'Glutei', sets: 4, reps: '10', targetWeight: '110', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_fb3_13', name: 'Pulldown a Braccia Tese al Cavo', muscleGroup: 'Dorso', sets: 3, reps: '12', targetWeight: '17.5', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_fb3_14', name: 'Abductor Machine con Busto Inclinato', muscleGroup: 'Glutei', sets: 4, reps: '15', targetWeight: '40', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_fb3_15', name: 'Dip tra due Panche (Tricipiti)', muscleGroup: 'Tricipiti', sets: 3, reps: '10-12', targetWeight: '0', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 2.4 DONNA B2-B3: TRASFORMAZIONE E QUALITÀ GLUTEI 4 GIORNI ---
const F_B2_SPLIT_QUALITA: EngineWorkoutDay[] = [
  {
    id: 'f_b2_d1',
    dayNumber: 1,
    title: 'G1: Glutei Effort & Upper Spinta (Back-off & 10+MAX)',
    exercises: [
      { id: 'f_b2_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', stimulusType: 'NEURAL', sets: 4, reps: '6-8', targetWeight: '90', rpeTarget: 8.5, restSeconds: 120, executionType: 'BACK_OFF', tut: '2-1-1-1', notes: 'Serie pesante seguita da back-off a -25% portato a cedimento concentrico.' },
      { id: 'f_b2_2', name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '14', rpeTarget: 9.5, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Cedimento concentrico reale sull\'ultima serie.' },
      { id: 'f_b2_3', name: 'Shoulder Press Machine / Manubri', muscleGroup: 'Spalle', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '18', rpeTarget: 9.0, restSeconds: 75, executionType: 'REST_PAUSE', tut: '2-0-1-0', notes: 'REST-PAUSE: 12 reps a cedimento -> 15" pausa -> max reps -> 15" pausa -> max reps.' },
      { id: 'f_b2_4', name: 'Abductor Machine con Busto Inclinato', muscleGroup: 'Glutei', stimulusType: 'METABOLIC', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', notes: '10 reps a cedimento + scarico immediato del 40% a max reps con parziali pulsate finali.' }
    ]
  },
  {
    id: 'f_b2_d2',
    dayNumber: 2,
    title: 'G2: Schiena & Catena Posteriore (Rest-Pause & Kickback Cavi)',
    exercises: [
      { id: 'f_b2_6', name: 'Stacco Rumeno con Bilanciere (RDL)', muscleGroup: 'Femorali', stimulusType: 'NEURAL', sets: 4, reps: '6-8', targetWeight: '60', rpeTarget: 8.5, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Carico pesante controllato in discesa a schiena serrata.' },
      { id: 'f_b2_7', name: 'Lat Machine Presa Inversa / Neutra', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '8-10', targetWeight: '40', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '2-0-1-1', notes: 'REST-PAUSE sull\'ultima serie: cedimento -> 15" pausa -> max reps.' },
      { id: 'f_b2_8', name: 'Leg Curl Seduto', muscleGroup: 'Femorali', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '35', rpeTarget: 9.5, restSeconds: 60, executionType: 'STRIPPING', tut: '2-0-1-1', notes: 'Stripping a 1 scarico (-35%) al sopraggiungere del cedimento.' },
      { id: 'f_b2_9', name: 'Glute Kickback al Cavo Basso con Isometria', muscleGroup: 'Glutei', stimulusType: 'METABOLIC', sets: 3, reps: '12 + Iso', targetWeight: '12.5', rpeTarget: 10, restSeconds: 60, executionType: 'ISOMETRIE', tut: '2-0-1-2', notes: 'Al termine dell\'ultima rep a cedimento, mantieni 10-15s di contrazione isometrica statica di picco.' }
    ]
  },
  {
    id: 'f_b2_d3',
    dayNumber: 3,
    title: 'G3: Quadricipiti & Spalle Densità (Leg Press & Parziali)',
    exercises: [
      { id: 'f_b2_11', name: 'Leg Press 45° a ROM Completo', muscleGroup: 'Quadricipiti', stimulusType: 'NEURAL', sets: 4, reps: '8-10', targetWeight: '140', rpeTarget: 9.0, restSeconds: 120, executionType: 'REST_PAUSE', tut: '3-0-1-0', notes: 'REST-PAUSE su macchina guidata: cedimento a 10 reps -> 15" pausa -> max reps.' },
      { id: 'f_b2_12', name: 'Leg Extension', muscleGroup: 'Quadricipiti', stimulusType: 'METABOLIC', sets: 3, reps: '10 + MAX', targetWeight: '35', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', notes: '10 reps piene + scarico rapido del 40% a cedimento concentrico.' },
      { id: 'f_b2_13', name: 'Alzate Laterali ai Cavi con Parziali', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '12 + Parziali', targetWeight: '6', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', notes: 'Al cedimento a ROM completo, continua con 6-10 mezze ripetizioni pulsate veloci.' },
      { id: 'f_b2_14', name: 'Dip tra due Panche per Tricipiti', muscleGroup: 'Tricipiti', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '12', targetWeight: '0', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Focus sul tono e definizione del retro-braccio.' }
    ]
  },
  {
    id: 'f_b2_d4',
    dayNumber: 4,
    title: 'G4: Massimo Pompaggio Glutei & Modellamento Upper (Isometrie)',
    exercises: [
      { id: 'f_b2_16', name: 'Hip Thrust al Multipower con Isometria Finale', muscleGroup: 'Glutei', stimulusType: 'HYPERTROPHIC', sets: 4, reps: '10-12 + Iso', targetWeight: '80', rpeTarget: 10, restSeconds: 90, executionType: 'ISOMETRIE', tut: '2-1-1-1', notes: 'All\'ultima serie a cedimento, mantieni 15 secondi di contrazione statica isometrica di picco.' },
      { id: 'f_b2_17', name: 'Rematore al Pulley Basso con Corda', muscleGroup: 'Dorso', stimulusType: 'HYPERTROPHIC', sets: 3, reps: '10-12', targetWeight: '35', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Apertura corda all\'addome con contrazione dorsale pura.' },
      { id: 'f_b2_18', name: 'Abductor Machine Stripping + Parziali', muscleGroup: 'Glutei', stimulusType: 'METABOLIC', sets: 3, reps: '15 + Parziali', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: 'PARZIALI', tut: '2-0-1-1', notes: 'Stripping a 1 scarico seguito da 8 parziali pulsate in massima apertura.' },
      { id: 'f_b2_19', name: 'Deltoidi Posteriori al Cavo Alto / Reverse Fly', muscleGroup: 'Spalle', stimulusType: 'METABOLIC', sets: 3, reps: '15', targetWeight: '7.5', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', notes: 'Postura scapolare aperta per aprire il cingolo scapolare.' }
    ]
  }
];

// --- 2.5 DONNA B2-B3: GLUTEI & SPALLE 3X FOCUS SILHOUETTE 4 GIORNI ---
const F_B2_SPLIT_GLUTE_DELTS: EngineWorkoutDay[] = [
  {
    id: 'f_b2_gd_d1',
    dayNumber: 1,
    title: 'G1: Glutei Pesanti & Deltoidi (Hip Thrust & Rest-Pause)',
    exercises: [
      { id: 'f_gd_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', sets: 4, reps: '8-10', targetWeight: '95', rpeTarget: 9.0, restSeconds: 120, executionType: 'REST_PAUSE', tut: '2-1-1-1', stimulusType: 'NEURAL', notes: 'Rest-Pause sull\'ultima serie per massima saturazione.' },
      { id: 'f_gd_2', name: 'Shoulder Press Manubri da Seduta', muscleGroup: 'Spalle', sets: 4, reps: '8-10', targetWeight: '14', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_gd_3', name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', sets: 3, reps: '10 per gamba', targetWeight: '14', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_gd_4', name: 'Alzate Laterali ai Cavi Singoli', muscleGroup: 'Spalle', sets: 4, reps: '12', targetWeight: '6', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_5', name: 'Glute Kickback al Cavo con Isometria', muscleGroup: 'Glutei', sets: 3, reps: '12 + Iso', targetWeight: '12.5', rpeTarget: 10, restSeconds: 60, executionType: 'ISOMETRIE', tut: '2-0-1-2', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_gd_d2',
    dayNumber: 2,
    title: 'G2: Schiena & Femorali (RDL & Trazione)',
    exercises: [
      { id: 'f_gd_6', name: 'Stacco Rumeno con Bilanciere', muscleGroup: 'Femorali', sets: 4, reps: '8-10', targetWeight: '60', rpeTarget: 8.5, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_gd_7', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '40', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_gd_8', name: 'Pulley al Basso con Corda', muscleGroup: 'Dorso', sets: 3, reps: '10 + MAX', targetWeight: '35', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_9', name: 'Face Pull con Corda', muscleGroup: 'Spalle', sets: 4, reps: '15', targetWeight: '17.5', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_gd_d3',
    dayNumber: 3,
    title: 'G3: Quad-Glute & Deltoidi Laterali',
    exercises: [
      { id: 'f_gd_11', name: 'Leg Press 45° Piedi Alti', muscleGroup: 'Glutei', sets: 4, reps: '10-12', targetWeight: '140', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_gd_12', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '10 + MAX', targetWeight: '35', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_13', name: 'Alzate Laterali con Manubri a Sedere', muscleGroup: 'Spalle', sets: 4, reps: '12 + Parziali', targetWeight: '6', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_14', name: 'Abductor Machine con Busto Inclinato', muscleGroup: 'Glutei', sets: 4, reps: '15 + Parziali', targetWeight: '45', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_gd_d4',
    dayNumber: 4,
    title: 'G4: Glutei Isometrie & Braccia/Spalle Tone',
    exercises: [
      { id: 'f_gd_16', name: 'Hip Thrust Multipower con Isometria Finale', muscleGroup: 'Glutei', sets: 4, reps: '10-12 + Iso', targetWeight: '85', rpeTarget: 10, restSeconds: 90, executionType: 'ISOMETRIE', tut: '2-1-1-1', stimulusType: 'HYPERTROPHIC', notes: 'Fermo 15s alla fine dell\'ultima serie.' },
      { id: 'f_gd_17', name: 'Leg Curl Seduto', muscleGroup: 'Femorali', sets: 3, reps: '10', targetWeight: '35', rpeTarget: 9.5, restSeconds: 60, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_18', name: 'Deltoidi Posteriori al Cavo Alto', muscleGroup: 'Spalle', sets: 3, reps: '15', targetWeight: '7.5', rpeTarget: 9.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_gd_19', name: 'Pushdown con Corda ai Cavi', muscleGroup: 'Tricipiti', sets: 3, reps: '12', targetWeight: '15', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 2.6 DONNA B2-B3: GLUTEI SPECIALIZZAZIONE SU 3 GIORNI ---
const F_B2_SPLIT_GLUTE_3D: EngineWorkoutDay[] = [
  {
    id: 'f_b2_g3_d1',
    dayNumber: 1,
    title: 'G1: Lower Glute Focus (Hip Thrust & Bulgari)',
    exercises: [
      { id: 'f_g3_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', sets: 4, reps: '8-10', targetWeight: '90', rpeTarget: 9.5, restSeconds: 120, executionType: '10_PIU_MAX', tut: '2-1-1-1', stimulusType: 'HYPERTROPHIC', notes: '10 reps a cedimento + scarico 40% a max reps.' },
      { id: 'f_g3_2', name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', sets: 3, reps: '10 per gamba', targetWeight: '12', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_3', name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', sets: 4, reps: '10', targetWeight: '22', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_4', name: 'Abductor Machine', muscleGroup: 'Glutei', sets: 4, reps: '15 + Parziali', targetWeight: '45', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_g3_d2',
    dayNumber: 2,
    title: 'G2: Upper Silhouette (V-Taper & Spalle)',
    exercises: [
      { id: 'f_g3_6', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '8-10', targetWeight: '40', rpeTarget: 9.0, restSeconds: 90, executionType: 'REST_PAUSE', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_7', name: 'Lento Avanti con Manubri', muscleGroup: 'Spalle', sets: 4, reps: '10', targetWeight: '12', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_8', name: 'Pulley al Basso Presa Stretta', muscleGroup: 'Dorso', sets: 3, reps: '10 + MAX', targetWeight: '35', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_g3_9', name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', sets: 4, reps: '12', targetWeight: '6', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_g3_10', name: 'Pushdown Corda ai Cavi', muscleGroup: 'Tricipiti', sets: 3, reps: '12', targetWeight: '12.5', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_g3_d3',
    dayNumber: 3,
    title: 'G3: Full Body Density (Glutei & Tono)',
    exercises: [
      { id: 'f_g3_11', name: 'Leg Press 45° Piedi Alti', muscleGroup: 'Glutei', sets: 4, reps: '10', targetWeight: '130', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_12', name: 'Glute Kickback al Cavo Basso', muscleGroup: 'Glutei', sets: 3, reps: '12 + Iso', targetWeight: '12.5', rpeTarget: 10, restSeconds: 60, executionType: 'ISOMETRIE', tut: '2-0-1-2', stimulusType: 'METABOLIC' },
      { id: 'f_g3_13', name: 'Rematore con Manubrio Singolo', muscleGroup: 'Dorso', sets: 3, reps: '10 per lato', targetWeight: '14', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_g3_14', name: 'Deltoidi Posteriori Cavo Alto', muscleGroup: 'Spalle', sets: 3, reps: '15', targetWeight: '7.5', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// --- 2.7 DONNA B2-B3: DEFINIZIONE & CIRCOLAZIONE LISS 4 GIORNI ---
const F_B2_SPLIT_METABOLIC_LISS: EngineWorkoutDay[] = [
  {
    id: 'f_b2_ml_d1',
    dayNumber: 1,
    title: 'G1: Lower PHA Circolatorio (Glutei & Dorso)',
    exercises: [
      { id: 'f_ml_1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', sets: 4, reps: '10', targetWeight: '85', rpeTarget: 8.5, restSeconds: 90, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_2', name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', sets: 4, reps: '10', targetWeight: '35', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_3', name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', sets: 3, reps: '10', targetWeight: '20', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_4', name: 'Spinte con Manubri su Panca', muscleGroup: 'Petto', sets: 3, reps: '12', targetWeight: '12', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'f_b2_ml_d2',
    dayNumber: 2,
    title: 'G2: Glutei Isolamento & Deltoidi Cavi',
    exercises: [
      { id: 'f_ml_6', name: 'Abductor Machine con Busto Inclinato', muscleGroup: 'Glutei', sets: 4, reps: '15', targetWeight: '45', rpeTarget: 10, restSeconds: 45, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ml_7', name: 'Leg Curl Seduto o Sdraiato', muscleGroup: 'Femorali', sets: 4, reps: '12', targetWeight: '30', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ml_8', name: 'Alzate Laterali al Cavo Singolo', muscleGroup: 'Spalle', sets: 4, reps: '12', targetWeight: '5', rpeTarget: 10, restSeconds: 45, executionType: 'STRIPPING', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ml_9', name: 'Glute Kickback al Cavo Basso', muscleGroup: 'Glutei', sets: 3, reps: '15 + Iso', targetWeight: '10', rpeTarget: 10, restSeconds: 45, executionType: 'ISOMETRIE', tut: '2-0-1-2', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'f_b2_ml_d3',
    dayNumber: 3,
    title: 'G3: Quad-Glute & Tono Upper',
    exercises: [
      { id: 'f_ml_11', name: 'Leg Press Piedi Alti e Larghi', muscleGroup: 'Glutei', sets: 4, reps: '10-12', targetWeight: '130', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_12', name: 'Pulley al Basso Presa Stretta', muscleGroup: 'Dorso', sets: 4, reps: '10', targetWeight: '35', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_13', name: 'Affondi con Manubri in Avanzamento', muscleGroup: 'Glutei', sets: 3, reps: '12 per gamba', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_14', name: 'Shoulder Press con Manubri', muscleGroup: 'Spalle', sets: 3, reps: '10', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'f_b2_ml_d4',
    dayNumber: 4,
    title: 'G4: Full Body Metabolic Finish & Isometrie',
    exercises: [
      { id: 'f_ml_16', name: 'Hip Thrust Multipower con Isometria Finale', muscleGroup: 'Glutei', sets: 4, reps: '12 + Iso', targetWeight: '80', rpeTarget: 10, restSeconds: 90, executionType: 'ISOMETRIE', tut: '2-1-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'f_ml_17', name: 'Leg Extension', muscleGroup: 'Quadricipiti', sets: 3, reps: '12 + Parziali', targetWeight: '30', rpeTarget: 10, restSeconds: 45, executionType: 'PARZIALI', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ml_18', name: 'Face Pull con Corda', muscleGroup: 'Spalle', sets: 3, reps: '15', targetWeight: '17.5', rpeTarget: 9.0, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'f_ml_19', name: 'Dip tra due Panche (Tricipiti)', muscleGroup: 'Tricipiti', sets: 3, reps: '12', targetWeight: '0', rpeTarget: 8.5, restSeconds: 45, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'METABOLIC' }
    ]
  }
];

// ============================================================================
// 3. REGISTRO TOTALE (14 TEMPLATE COMPLETI: 7 UOMO · 7 DONNA)
// ============================================================================

export const TOP_GYM_SPLIT_TEMPLATES: TopGymSplitTemplate[] = [
  // --- UOMO (7 TEMPLATE) ---
  {
    id: 'b1_base',
    name: 'UOMO · Blocco 1: Base (Petto-Spalle-Bic / Gambe-Dorso-Tric)',
    block: 'BLOCCO_1_FORZA',
    gender: 'MALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Split primaria raccomandata per il Blocco 1. Consente massima freschezza neurale su Panca e Squat, eliminando l\'affaticamento degli antagonisti prima dei carichi pesanti.',
    focus: 'Forza Ipertrofica Neurale · Buffer RIR 2-4',
    days: M_B1_SPLIT_BASE
  },
  {
    id: 'b1_upper_lower',
    name: 'UOMO · Blocco 1: Alternativa 1 (Upper / Lower Tradizionale)',
    block: 'BLOCCO_1_FORZA',
    gender: 'MALE',
    daysCount: 4,
    type: 'ALTERNATIVE_1',
    description: 'Struttura pura a 4 giorni su due sedute Upper e due sedute Lower. Ideale per atleti che prediligono la rotazione pura per distretti anatomici principali.',
    focus: 'Equilibrio Neurale e Frequenza 2x',
    days: M_B1_SPLIT_UPPER_LOWER
  },
  {
    id: 'b1_ppl_3d',
    name: 'UOMO · Blocco 1: Split 3 Giorni (Push / Pull / Legs Neurale)',
    block: 'BLOCCO_1_FORZA',
    gender: 'MALE',
    daysCount: 3,
    type: 'ALTERNATIVE_2',
    description: 'Programmazione concentrata su 3 sedute settimanali per atleti che necessitano di maggiore recupero sistemico mantenendo intatta la progressione sui grandi fondamentali.',
    focus: 'Frequenza 3x · Massima Intensità Neurale & Recupero',
    days: M_B1_SPLIT_PPL_3D
  },
  {
    id: 'b2_antagonisti',
    name: 'UOMO · Blocchi 2-3: Base (Antagonisti Petto-Dorso-Tric / Gambe-Spalle-Bic)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'MALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Split fondamentale del Metodo TOP GYM per i Blocchi 2 e 3. Massimo pompaggio tramite accoppiamento di gruppi antagonisti e spazio completo per tecniche di intensità.',
    focus: 'Trasformazione Ipertrofica & Qualità Muscolare',
    days: M_B2_SPLIT_ANTAGONISTI
  },
  {
    id: 'b2_push_pull',
    name: 'UOMO · Blocchi 2-3: Alternativa 1 (Push / Pull Completo)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'MALE',
    daysCount: 4,
    type: 'ALTERNATIVE_1',
    description: 'Rotazione di spinta e trazione completa con isolamento metabolico a fine seduta portato a cedimento concentrico.',
    focus: 'Effort Meccanico & Cedimento',
    days: M_B2_SPLIT_PUSH_PULL
  },
  {
    id: 'b2_ppl_legs_upper',
    name: 'UOMO · Blocchi 2-3: PPL + Upper Richiamo (4 Giorni Ipertrofia Pura)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'MALE',
    daysCount: 4,
    type: 'ALTERNATIVE_2',
    description: 'Rotazione moderna a 4 sedute con 3 giorni Push-Pull-Legs pesanti più una quarta seduta di richiamo e densità per busto e braccia.',
    focus: 'Densità Muscolare & Volume Frequente Upper',
    days: M_B2_SPLIT_PPL_UPPER
  },
  {
    id: 'b3_split_5d',
    name: 'UOMO · Blocchi 2-3: High Volume Pro Split (5 Giorni per Distretto)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'MALE',
    daysCount: 5,
    type: 'ALTERNATIVE_1',
    description: 'Struttura avanzata a 5 giorni (Petto, Dorso, Gambe, Spalle/Braccia, Richiamo Posteriore) ideale per atleti avanzati ad alta capacità di lavoro.',
    focus: 'Volume Estremo, Cedimento e Isolamento 3D',
    days: M_B2_SPLIT_5D_PRO
  },

  // --- DONNA (7 TEMPLATE) ---
  {
    id: 'f_b1_base',
    name: 'DONNA · Blocco 1: Base (Hip Thrust, Semi-sumo & Glutei)',
    block: 'BLOCCO_1_FORZA',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Programmazione femminile con focus su Hip Thrust, Semi-sumo e stabilità pelvica a buffer (RIR 2-3).',
    focus: 'Cerniera d\'Anca, Glutei e Stabilità Pelvica',
    days: F_B1_SPLIT_BASE
  },
  {
    id: 'f_b1_ul_glute',
    name: 'DONNA · Blocco 1: Upper / Lower Specializzazione Glutei',
    block: 'BLOCCO_1_FORZA',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'ALTERNATIVE_1',
    description: 'Due sedute Lower focalizzate su glutei e femorali a carico progressivo alternate a due sedute Upper per il modellamento della parte superiore.',
    focus: 'Frequenza 2x Glutei & Armonia Clavicolare',
    days: F_B1_SPLIT_UL_GLUTE
  },
  {
    id: 'f_b1_full_3d',
    name: 'DONNA · Blocco 1: Full Body 3 Giorni (Tonificazione & Base Neurale)',
    block: 'BLOCCO_1_FORZA',
    gender: 'FEMALE',
    daysCount: 3,
    type: 'ALTERNATIVE_2',
    description: 'Split totale corpo intero su 3 giorni settimanali: perfetta per atlete che preferiscono frequenze ridotte con stimolo neurale e metabolico distribuito.',
    focus: 'Full Body 3x · Stimolo Glutei Costante & Recupero',
    days: F_B1_SPLIT_FULL_3D
  },
  {
    id: 'f_b2_qualita',
    name: 'DONNA · Blocchi 2-3: Base (Qualità Glutei, 10+MAX & Rest-Pause)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Massimo stimolo estetico: Rest-Pause, 10+MAX, Parziali pulsate, Isometrie a fine serie e defaticamento post-seduta.',
    focus: 'Ipertrofia Glutei, Modellamento Upper & Circolo LISS',
    days: F_B2_SPLIT_QUALITA
  },
  {
    id: 'f_b2_glute_delts_high_freq',
    name: 'DONNA · Blocchi 2-3: Glutei & Spalle 3x Focus Silhouette',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'ALTERNATIVE_1',
    description: 'Specializzazione ad altissimo impatto visivo focalizzata su glutei, deltoidi laterali e punto vita.',
    focus: 'Silhouette a Clessidra, Deltoidi 3D & Glutei Pieni',
    days: F_B2_SPLIT_GLUTE_DELTS
  },
  {
    id: 'f_b2_lower_upper_3d',
    name: 'DONNA · Blocchi 2-3: Glutei Specializzazione su 3 Giorni',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'FEMALE',
    daysCount: 3,
    type: 'ALTERNATIVE_2',
    description: 'Routine compatta a 3 giorni per i blocchi avanzati: seduta Lower glutei pesanti, seduta Upper silhouette e seduta Full body densità.',
    focus: 'Effort e Densità Concentrata su 3 Giorni',
    days: F_B2_SPLIT_GLUTE_3D
  },
  {
    id: 'f_b3_metabolic_circ',
    name: 'DONNA · Blocchi 2-3: Definizione & Circolazione LISS (Anti-Ritenzione)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'ALTERNATIVE_1',
    description: 'Programma a circuito periferico PHA per evitare ritenzione idrica e infiammazione agli arti inferiori.',
    focus: 'Circolazione, Densità Senza Infiammazione & Glutei',
    days: F_B2_SPLIT_METABOLIC_LISS
  }
];

/**
 * Restituisce i template adatti al Blocco in uso.
 * I template del genere riconosciuto compaiono prioritariamente in cima.
 */
export function getRecommendedTemplatesForBlock(
  block: MacroBlock,
  athleteNameOrGender?: string
): TopGymSplitTemplate[] {
  const blockKey = (block === 'BLOCCO_1_FORZA') ? 'BLOCCO_1_FORZA' : 'BLOCCO_2_TRASFORMAZIONE';
  const matchesBlock = TOP_GYM_SPLIT_TEMPLATES.filter(t => t.block === blockKey);

  if (!athleteNameOrGender) {
    return matchesBlock;
  }

  const targetGender: AthleteGender = 
    (athleteNameOrGender === 'FEMALE' || athleteNameOrGender === 'MALE')
      ? athleteNameOrGender
      : detectAthleteGender(athleteNameOrGender);

  return [...matchesBlock].sort((a, b) => {
    if (a.gender === targetGender && b.gender !== targetGender) return -1;
    if (a.gender !== targetGender && b.gender === targetGender) return 1;
    return 0;
  });
}

/**
 * Recupera un template per ID clonando la struttura per evitare mutazioni di memoria
 */
export function getTemplateById(templateId: string): TopGymSplitTemplate | null {
  const found = TOP_GYM_SPLIT_TEMPLATES.find(t => t.id === templateId);
  if (!found) return null;
  return JSON.parse(JSON.stringify(found));
}