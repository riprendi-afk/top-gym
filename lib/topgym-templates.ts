// lib/topgym-templates.ts
// MATRICE DEI TEMPLATE E SPLIT SETTIMANALI (MASCHILI E FEMMINILI) · METODO TOP GYM

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
 * Riconosce in modo intelligente il genere dal nome dell'atleta (con gestione eccezioni italiane)
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
// 1. TEMPLATE MASCHILI ORIGINALI (BLOCCO 1, 2 E 3)
// ============================================================================

// SPLIT BASE B1 UOMO: G1/G3 Petto-Spalle-Bicipiti | G2/G4 Gambe-Dorso-Tricipiti
const B1_SPLIT_BASE: EngineWorkoutDay[] = [
  {
    id: 'b1_base_d1',
    dayNumber: 1,
    title: 'G1: Petto · Spalle · Bicipiti (Focus Neurale Panca)',
    exercises: [
      {
        id: 'b1_d1_ex1',
        name: 'Panca Piana Bilanciere',
        muscleGroup: 'Petto',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '6',
        targetWeight: '75',
        rpeTarget: 7.5,
        restSeconds: 180,
        executionType: 'REGULAR',
        tut: '2-0-X-1',
        notes: 'Assetto scapolare serrato, fermo al petto netto di 1", spinta esplosiva a buffer (RIR 2-3).'
      },
      {
        id: 'b1_d1_ex2',
        name: 'Spinte con Manubri su Panca 30°',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '26',
        rpeTarget: 8.0,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Controllo eccentrico continuo, nessun blocco articolare in alto.'
      },
      {
        id: 'b1_d1_ex3',
        name: 'Military Press / Lento Avanti Bilanciere',
        muscleGroup: 'Spalle',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6',
        targetWeight: '45',
        rpeTarget: 7.5,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-X-0',
        notes: 'Glutei e addome serrati, traiettoria verticale pulita.'
      },
      {
        id: 'b1_d1_ex4',
        name: 'Alzate Laterali con Manubri',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12',
        targetWeight: '10',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Stop isometrico di 1" a parallelo, zero slanci lombari.'
      },
      {
        id: 'b1_d1_ex5',
        name: 'Curl Bilanciere Sagomato (EZ)',
        muscleGroup: 'Bicipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '30',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Gomiti fissi ai fianchi, enfasi sul picco di contrazione.'
      }
    ]
  },
  {
    id: 'b1_base_d2',
    dayNumber: 2,
    title: 'G2: Gambe · Dorso · Tricipiti (Focus Neurale Squat)',
    exercises: [
      {
        id: 'b1_d2_ex1',
        name: 'Squat con Bilanciere',
        muscleGroup: 'Gambe',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '6',
        targetWeight: '90',
        rpeTarget: 7.5,
        restSeconds: 180,
        executionType: 'REGULAR',
        tut: '2-0-X-0',
        notes: 'Profondità sotto il parallelo, stabilità del piede a tripode, buffer costante.'
      },
      {
        id: 'b1_d2_ex2',
        name: 'Leg Press 45°',
        muscleGroup: 'Gambe',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '160',
        rpeTarget: 8.0,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Scendi profondo senza retroversione del bacino.'
      },
      {
        id: 'b1_d2_ex3',
        name: 'Trazioni alla Sbarra / Lat Machine Presa Larga',
        muscleGroup: 'Dorso',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6-8',
        targetWeight: '0',
        rpeTarget: 8.0,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Depressione scapolare prima del tiraggio, petto verso la sbarra.'
      },
      {
        id: 'b1_d2_ex4',
        name: 'Pulley Basso Presa Stretta',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '55',
        rpeTarget: 8.5,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Allungamento controllato ed adduzione scapolare in chiusura.'
      },
      {
        id: 'b1_d2_ex5',
        name: 'French Press su Panca con Bilanciere EZ',
        muscleGroup: 'Tricipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '32',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Flessione del gomito controllata dietro la testa per prestirare il capo lungo.'
      }
    ]
  },
  {
    id: 'b1_base_d3',
    dayNumber: 3,
    title: 'G3: Petto · Spalle · Bicipiti (Focus Inclinata & Densità)',
    exercises: [
      {
        id: 'b1_d3_ex1',
        name: 'Panca Inclinata Bilanciere (30°)',
        muscleGroup: 'Petto',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '6',
        targetWeight: '65',
        rpeTarget: 7.5,
        restSeconds: 180,
        executionType: 'REGULAR',
        tut: '2-0-X-1',
        notes: 'Fascio claveare in massimo reclutamento, fermo 1" controllato.'
      },
      {
        id: 'b1_d3_ex2',
        name: 'Dip alle Parallele (Petto focus)',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '0',
        rpeTarget: 8.0,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Busto inclinato in avanti, gomiti a 45 gradi.'
      },
      {
        id: 'b1_d3_ex3',
        name: 'Lento con Manubri da Seduto',
        muscleGroup: 'Spalle',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '20',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Range completo fino all\'altezza delle orecchie.'
      },
      {
        id: 'b1_d3_ex4',
        name: 'Alzate Laterali al Cavo Singolo',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '7.5',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Tensione costante anche nella fase iniziale del movimento.'
      },
      {
        id: 'b1_d3_ex5',
        name: 'Curl con Manubri a Martello (Hammer)',
        muscleGroup: 'Bicipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10',
        targetWeight: '14',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Focus su brachiale e brachioradiale, zero oscillazioni del tronco.'
      }
    ]
  },
  {
    id: 'b1_base_d4',
    dayNumber: 4,
    title: 'G4: Gambe · Dorso · Tricipiti (Focus Stacco / Catena Posteriore)',
    exercises: [
      {
        id: 'b1_d4_ex1',
        name: 'Stacco da Terra con Bilanciere (o Rumeno)',
        muscleGroup: 'Gambe',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '5-6',
        targetWeight: '110',
        rpeTarget: 7.5,
        restSeconds: 180,
        executionType: 'REGULAR',
        tut: '2-0-X-0',
        notes: 'Spinta con le gambe, catena posteriore attiva, schiena perfettamente neutra.'
      },
      {
        id: 'b1_d4_ex2',
        name: 'Leg Curl Seduto / Sdraiato',
        muscleGroup: 'Gambe',
        stimulusType: 'METABOLIC',
        sets: 4,
        reps: '10-12',
        targetWeight: '45',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '3-0-1-1',
        notes: 'Flessione del ginocchio decisa con 1" di contrazione di picco.'
      },
      {
        id: 'b1_d4_ex3',
        name: 'Rematore con Bilanciere Presa Prona (Yates o 45°)',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8',
        targetWeight: '60',
        rpeTarget: 8.0,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Trazione verso l\'ombelico con gomiti aderenti.'
      },
      {
        id: 'b1_d4_ex4',
        name: 'Lat Machine Presa Neutra / Triangolo',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '60',
        rpeTarget: 8.5,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Range di movimento profondo, allungamento dorsale in risalita.'
      },
      {
        id: 'b1_d4_ex5',
        name: 'Pushdown ai Cavi con Corda',
        muscleGroup: 'Tricipiti',
        stimulusType: 'METABOLIC',
        sets: 4,
        reps: '12',
        targetWeight: '22',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Apertura finale della corda in blocco articolare per reclutare il capo laterale.'
      }
    ]
  }
];

// ALTERNATIVA 1 B1 UOMO: Upper / Lower Tradizionale (G1/G3 Upper, G2/G4 Lower)
const B1_SPLIT_UPPER_LOWER: EngineWorkoutDay[] = [
  {
    id: 'b1_ul_d1',
    dayNumber: 1,
    title: 'G1: Upper A (Forza Panca & Trazioni)',
    exercises: [
      { id: 'b1_ul_1', name: 'Panca Piana Bilanciere', sets: 5, reps: '6', targetWeight: '75', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_2', name: 'Trazioni Zavorrate / Lat Machine', sets: 5, reps: '6', targetWeight: '0', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_3', name: 'Spinte con Manubri Panca 30°', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_4', name: 'Pulley al Cavo', sets: 4, reps: '8-10', targetWeight: '55', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_5', name: 'Alzate Laterali Manubri', sets: 3, reps: '12', targetWeight: '10', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_6', name: 'Super-set Braccia (Curl EZ + Pushdown)', sets: 3, reps: '10+10', targetWeight: '25', rpeTarget: 8.0, restSeconds: 90, executionType: 'SUPERSET', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ul_d2',
    dayNumber: 2,
    title: 'G2: Lower A (Forza Squat & Catena Anteriore)',
    exercises: [
      { id: 'b1_ul_7', name: 'Squat Bilanciere', sets: 5, reps: '6', targetWeight: '90', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_8', name: 'Leg Press 45°', sets: 4, reps: '8-10', targetWeight: '160', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_9', name: 'Affondi con Manubri in Avanzamento', sets: 3, reps: '10 per gamba', targetWeight: '16', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_10', name: 'Leg Extension', sets: 3, reps: '12-15', targetWeight: '40', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_11', name: 'Calf Raise Seduto / In Piedi', sets: 4, reps: '15', targetWeight: '50', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b1_ul_d3',
    dayNumber: 3,
    title: 'G3: Upper B (Forza Military & Spessore Dorso)',
    exercises: [
      { id: 'b1_ul_12', name: 'Military Press Bilanciere', sets: 5, reps: '6', targetWeight: '45', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_13', name: 'Rematore con Bilanciere Prono', sets: 5, reps: '6', targetWeight: '65', rpeTarget: 7.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b1_ul_14', name: 'Dip alle Parallele con Sovraccarico', sets: 4, reps: '8', targetWeight: '10', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_15', name: 'Lat Machine Presa a Triangolo', sets: 4, reps: '10', targetWeight: '60', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_16', name: 'Face Pull ai Cavi', sets: 4, reps: '12-15', targetWeight: '20', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_17', name: 'Curl Martello + French Press Manubri', sets: 3, reps: '10+10', targetWeight: '14', rpeTarget: 8.0, restSeconds: 90, executionType: 'SUPERSET', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' }
    ]
  },
  {
    id: 'b1_ul_d4',
    dayNumber: 4,
    title: 'G4: Lower B (Forza Stacco & Catena Posteriore)',
    exercises: [
      { id: 'b1_ul_18', name: 'Stacco da Terra Bilanciere', sets: 5, reps: '5', targetWeight: '110', rpeTarget: 7.5, restSeconds: 180, executionType: 'REGULAR', tut: '2-0-X-0', stimulusType: 'NEURAL' },
      { id: 'b1_ul_19', name: 'Stacco Rumeno con Manubri', sets: 4, reps: '8-10', targetWeight: '28', rpeTarget: 8.0, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_20', name: 'Leg Curl Sdraiato', sets: 4, reps: '10-12', targetWeight: '40', rpeTarget: 8.5, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b1_ul_21', name: 'Pressa Piedi Alti (Enfasi Glutei/Femorali)', sets: 3, reps: '12', targetWeight: '140', rpeTarget: 8.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b1_ul_22', name: 'Calf alla Pressa', sets: 4, reps: '12-15', targetWeight: '120', rpeTarget: 8.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-1-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// SPLIT BASE B2/B3 UOMO: G1/G3 Petto-Dorso-Tricipiti | G2/G4 Gambe-Spalle-Bicipiti
const B2_B3_SPLIT_ANTAGONISTI: EngineWorkoutDay[] = [
  {
    id: 'b2_antag_d1',
    dayNumber: 1,
    title: 'G1: Petto · Dorso · Tricipiti (Antagonisti Spinta/Trazione A)',
    exercises: [
      {
        id: 'b2_d1_1',
        name: 'Panca Piana con Bilanciere',
        muscleGroup: 'Petto',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6',
        targetWeight: '80',
        rpeTarget: 8.0,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Mantenimento della forza pura a inizio seduta.'
      },
      {
        id: 'b2_d1_2',
        name: 'Rematore T-Bar con Appoggio al Petto',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '50',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Trazione piena, massima adduzione scapolare. Cedimento sull\'ultima serie.'
      },
      {
        id: 'b2_d1_3',
        name: 'Spinte Manubri su Panca Inclinata 30°',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '28',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Cedimento concentrico reale sull\'ultima serie.'
      },
      {
        id: 'b2_d1_4',
        name: 'Lat Machine Presa Neutra Stretta',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10',
        targetWeight: '65',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Gomiti portati ai fianchi, stretch profondo in fase di risalita.'
      },
      {
        id: 'b2_d1_5',
        name: 'Croci ai Cavi dall\'Alto su Panca / In Piedi',
        muscleGroup: 'Petto',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10 + MAX',
        targetWeight: '12.5',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-2',
        notes: '10 reps piene @ buffer 0, scarico immediato del 40% del pacco pesi e avanti a cedimento.'
      },
      {
        id: 'b2_d1_6',
        name: 'Pushdown con Cavo Singolo / Barra a V',
        muscleGroup: 'Tricipiti',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '25',
        rpeTarget: 9.5,
        restSeconds: 60,
        executionType: 'STRIPPING',
        tut: '2-0-1-1',
        notes: 'Stripping a 1 scarico sull\'ultima serie (-35% peso fino a cedimento).'
      }
    ]
  },
  {
    id: 'b2_antag_d2',
    dayNumber: 2,
    title: 'G2: Gambe · Spalle · Bicipiti (Catena Anteriore & Spalle)',
    exercises: [
      {
        id: 'b2_d2_1',
        name: 'Squat con Bilanciere o Hack Squat',
        muscleGroup: 'Gambe',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6-8',
        targetWeight: '95',
        rpeTarget: 8.5,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Alzata pesante di stimolo neurale e tensione meccanica.'
      },
      {
        id: 'b2_d2_2',
        name: 'Leg Press a 45°',
        muscleGroup: 'Gambe',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10-12',
        targetWeight: '180',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Profondità massima, piedi a centro pedana.'
      },
      {
        id: 'b2_d2_3',
        name: 'Leg Extension',
        muscleGroup: 'Gambe',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10 + MAX',
        targetWeight: '45',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-1',
        notes: 'Saturazione quadricipiti: 10 reps a cedimento + scarico 40% a max reps.'
      },
      {
        id: 'b2_d2_4',
        name: 'Shoulder Press con Manubri / Machine',
        muscleGroup: 'Spalle',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '22',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Spinta fluida senza serrare i gomiti.'
      },
      {
        id: 'b2_d2_5',
        name: 'Alzate Laterali con Manubri o ai Cavi',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12',
        targetWeight: '10',
        rpeTarget: 10,
        restSeconds: 45,
        executionType: 'STRIPPING',
        tut: '2-0-1-1',
        notes: 'Stripping a 1-2 scarichi sull\'ultima serie.'
      },
      {
        id: 'b2_d2_6',
        name: 'Curl su Panca Inclinata a 45° con Manubri',
        muscleGroup: 'Bicipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10',
        targetWeight: '12',
        rpeTarget: 9.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Massimo prestiramento del capo lungo del bicipite.'
      }
    ]
  },
  {
    id: 'b2_antag_d3',
    dayNumber: 3,
    title: 'G3: Petto · Dorso · Tricipiti (Antagonisti Spinta/Trazione B)',
    exercises: [
      {
        id: 'b2_d3_1',
        name: 'Panca Inclinata con Manubri',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '28',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Carico pesante controllato in discesa, tocca le spalle e spingi.'
      },
      {
        id: 'b2_d3_2',
        name: 'Pulley al Basso o Row Machine',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '60',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Trazione solida all\'addome con gomiti bassi.'
      },
      {
        id: 'b2_d3_3',
        name: 'Chest Press Machine / Dip',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '60',
        rpeTarget: 9.5,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Cedimento concentrico garantito in sicurezza sulla macchina.'
      },
      {
        id: 'b2_d3_4',
        name: 'Pull-down a Braccia Tese al Cavo Alto',
        muscleGroup: 'Dorso',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '22',
        rpeTarget: 9.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Isolamento del gran dorsale con massimo allungamento in alto.'
      },
      {
        id: 'b2_d3_5',
        name: 'Dip tra due Panche / Parallele',
        muscleGroup: 'Tricipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '15',
        rpeTarget: 9.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Discesa profonda senza intrarotare le spalle.'
      },
      {
        id: 'b2_d3_6',
        name: 'Estensioni Tricipiti sopra la testa con Cavo',
        muscleGroup: 'Tricipiti',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '17.5',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-1',
        notes: 'Pompaggio del capo lungo con scarico rapido al cedimento.'
      }
    ]
  },
  {
    id: 'b2_antag_d4',
    dayNumber: 4,
    title: 'G4: Gambe · Spalle · Bicipiti (Catena Posteriore & Spalle)',
    exercises: [
      {
        id: 'b2_d4_1',
        name: 'Stacco Rumeno con Bilanciere o Manubri',
        muscleGroup: 'Gambe',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '80',
        rpeTarget: 8.5,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Enfasi totale sui femorali e glutei in fase di allungamento.'
      },
      {
        id: 'b2_d4_2',
        name: 'Leg Curl Sdraiato o in Piedi',
        muscleGroup: 'Gambe',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10',
        targetWeight: '40',
        rpeTarget: 9.5,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Contrazione di picco marcata a ginocchio flesso.'
      },
      {
        id: 'b2_d4_3',
        name: 'Alzate Laterali ai Cavi Incrociati o Macchina',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 4,
        reps: '12-15',
        targetWeight: '7.5',
        rpeTarget: 10,
        restSeconds: 45,
        executionType: 'STRIPPING',
        tut: '2-0-1-1',
        notes: 'Bruciore e congestione del deltoide laterale con scarico finale.'
      },
      {
        id: 'b2_d4_4',
        name: 'Deltoidi Posteriori al Cavo / Pec Deck inverso',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '15',
        targetWeight: '35',
        rpeTarget: 9.5,
        restSeconds: 45,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Gomiti leggermente flessi, zero intervento dei trapezi superiori.'
      },
      {
        id: 'b2_d4_5',
        name: 'Spider Curl su Panca Inclinata con Bilanciere EZ',
        muscleGroup: 'Bicipiti',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10 + MAX',
        targetWeight: '20',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-1',
        notes: 'Braccia a perpendicolo verso il basso, isolamento puro senza compensi.'
      }
    ]
  }
];

// ALTERNATIVA 1 B2/B3 UOMO: Push / Pull Classico su 4 Giorni
const B2_B3_SPLIT_PUSH_PULL: EngineWorkoutDay[] = [
  {
    id: 'b2_pp_d1',
    dayNumber: 1,
    title: 'G1: Push A (Petto · Spalle Ant/Lat · Tricipiti)',
    exercises: [
      { id: 'b2_pp_1', name: 'Panca Piana con Bilanciere', sets: 4, reps: '6-8', targetWeight: '80', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_2', name: 'Spinte Manubri su Panca Inclinata', sets: 4, reps: '8-10', targetWeight: '26', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_3', name: 'Lento Avanti con Manubri', sets: 3, reps: '8-10', targetWeight: '20', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_4', name: 'Alzate Laterali al Cavo', sets: 3, reps: '12-15', targetWeight: '7.5', rpeTarget: 9.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_5', name: 'French Press con Bilanciere EZ', sets: 3, reps: '10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_6', name: 'Pushdown Corda ai Cavi', sets: 3, reps: '10 + MAX', targetWeight: '20', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d2',
    dayNumber: 2,
    title: 'G2: Pull A (Dorso Ampiezza/Spessore · Deltoidi Post · Bicipiti)',
    exercises: [
      { id: 'b2_pp_7', name: 'Trazioni / Lat Machine Presa Larga', sets: 4, reps: '6-8', targetWeight: '0', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'NEURAL' },
      { id: 'b2_pp_8', name: 'Rematore Bilanciere a 45°', sets: 4, reps: '8-10', targetWeight: '60', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_9', name: 'Pulley Presa Stretta al Cavo', sets: 3, reps: '10-12', targetWeight: '55', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_10', name: 'Face Pull con Corda', sets: 3, reps: '12-15', targetWeight: '20', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_11', name: 'Curl Bilanciere Sagomato EZ', sets: 4, reps: '8-10', targetWeight: '30', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_12', name: 'Curl a Martello ai Cavi', sets: 3, reps: '10 + MAX', targetWeight: '17.5', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d3',
    dayNumber: 3,
    title: 'G3: Push B (Enfasi Gambe Quad · Petto Alto · Spalle)',
    exercises: [
      { id: 'b2_pp_13', name: 'Squat Bilanciere o Hack Squat', sets: 4, reps: '6-8', targetWeight: '90', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_14', name: 'Leg Press 45°', sets: 4, reps: '10-12', targetWeight: '180', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_15', name: 'Panca Inclinata con Bilanciere', sets: 4, reps: '8', targetWeight: '65', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_16', name: 'Croci ai Cavi dal Basso', sets: 3, reps: '12-15', targetWeight: '10', rpeTarget: 9.5, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'METABOLIC' },
      { id: 'b2_pp_17', name: 'Leg Extension', sets: 3, reps: '10 + MAX', targetWeight: '45', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  },
  {
    id: 'b2_pp_d4',
    dayNumber: 4,
    title: 'G4: Pull B (Enfasi Catena Posteriore · Dorso Densità · Bicipiti)',
    exercises: [
      { id: 'b2_pp_18', name: 'Stacco da Terra Rumeno', sets: 4, reps: '8', targetWeight: '85', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '3-0-1-0', stimulusType: 'NEURAL' },
      { id: 'b2_pp_19', name: 'Leg Curl Seduto', sets: 4, reps: '10-12', targetWeight: '45', rpeTarget: 9.0, restSeconds: 75, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_20', name: 'Lat Machine Presa Neutra', sets: 4, reps: '10', targetWeight: '60', rpeTarget: 9.0, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-1', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_21', name: 'Rematore con Manubrio Singolo', sets: 3, reps: '10 per lato', targetWeight: '26', rpeTarget: 9.0, restSeconds: 60, executionType: 'REGULAR', tut: '2-0-1-0', stimulusType: 'HYPERTROPHIC' },
      { id: 'b2_pp_22', name: 'Curl su Panca Scott con Manubrio', sets: 3, reps: '10 + MAX', targetWeight: '12', rpeTarget: 10, restSeconds: 60, executionType: '10_PIU_MAX', tut: '2-0-1-1', stimulusType: 'METABOLIC' }
    ]
  }
];

// ============================================================================
// 2. TEMPLATE FEMMINILI (BLOCCO 1, 2 E 3)
// ============================================================================

// FEMMINILE BLOCCO 1: FORZA IPERTROFICA FEMMINILE (15-16 SETTIMANE)
// Focus: Cerniera d'anca, stabilità pelvica, Hip Thrust, RDL e buffer rigoroso (RIR 2-3)
const FEMALE_B1_SPLIT: EngineWorkoutDay[] = [
  {
    id: 'f_b1_d1',
    dayNumber: 1,
    title: 'G1: Glutei Focus Neurale & Schiena (Hip Thrust Neurale)',
    exercises: [
      {
        id: 'f_b1_1',
        name: 'Barbell Hip Thrust',
        muscleGroup: 'Glutei',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '6',
        targetWeight: '80',
        rpeTarget: 7.5,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-1-X-1',
        notes: 'Fermo isometrico di 1" in cima per fissare l\'attivazione glutea. Rigoroso BUFFER (RIR 2-3).'
      },
      {
        id: 'f_b1_2',
        name: 'Stacco Rumeno con Manubri (RDL)',
        muscleGroup: 'Femorali / Glutei',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '20',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Cerniera d\'anca profonda, stretch sui femorali a schiena neutra.'
      },
      {
        id: 'f_b1_3',
        name: 'Lat Machine Presa Neutra',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '35',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Trazione controllata al petto, postura scapolare perfetta.'
      },
      {
        id: 'f_b1_4',
        name: 'Glute Kickback al Cavo Basso',
        muscleGroup: 'Glutei',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '10',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Focus sul grande gluteo, nessun compenso con la zona lombare.'
      },
      {
        id: 'f_b1_5',
        name: 'Alzate Laterali con Manubri',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '5',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Isolamento deltoide laterale per modellare le linee clavicolari.'
      }
    ]
  },
  {
    id: 'f_b1_d2',
    dayNumber: 2,
    title: 'G2: Gambe Quad-Focus & Spinta Upper (Squat / Bulgari)',
    exercises: [
      {
        id: 'f_b1_6',
        name: 'Squat con Bilanciere o Box Squat',
        muscleGroup: 'Gambe / Glutei',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '6',
        targetWeight: '50',
        rpeTarget: 7.5,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-X-0',
        notes: 'Assetto stabile, profondità al parallelo, buffer costante.'
      },
      {
        id: 'f_b1_7',
        name: 'Affondi Bulgari con Manubri',
        muscleGroup: 'Gambe / Glutei',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10 per gamba',
        targetWeight: '12',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Busto inclinato a 30° per massimizzare il reclutamento del gluteo.'
      },
      {
        id: 'f_b1_8',
        name: 'Spinte con Manubri su Panca Inclinata 30°',
        muscleGroup: 'Petto',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10',
        targetWeight: '12',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Spinta controllata, stabilità delle spalle.'
      },
      {
        id: 'f_b1_9',
        name: 'Leg Extension',
        muscleGroup: 'Gambe',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12',
        targetWeight: '30',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Estensione controllata con 1" di contrazione in cima.'
      },
      {
        id: 'f_b1_10',
        name: 'Pushdown Corda ai Cavi (Tricipiti)',
        muscleGroup: 'Tricipiti',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12',
        targetWeight: '12.5',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Gomiti fermi ai fianchi, apertura corda finale.'
      }
    ]
  },
  {
    id: 'f_b1_d3',
    dayNumber: 3,
    title: 'G3: Catena Posteriore & Dorso (Stacco Semi-sumo)',
    exercises: [
      {
        id: 'f_b1_11',
        name: 'Stacco da Terra Semi-Sumo con Bilanciere',
        muscleGroup: 'Gambe / Glutei',
        stimulusType: 'NEURAL',
        sets: 5,
        reps: '5-6',
        targetWeight: '65',
        rpeTarget: 7.5,
        restSeconds: 150,
        executionType: 'REGULAR',
        tut: '2-0-X-0',
        notes: 'Ginocchia aperte in linea con le punte dei piedi, spinta pelvica in chiusura con RIR 2-3.'
      },
      {
        id: 'f_b1_12',
        name: 'Rematore con Manubrio su Panca',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10 per lato',
        targetWeight: '14',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Trazione pura del gomito verso il bacino.'
      },
      {
        id: 'f_b1_13',
        name: 'Leg Curl Seduto o Sdraiato',
        muscleGroup: 'Femorali',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10-12',
        targetWeight: '30',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '3-0-1-1',
        notes: 'Flessione decisa senza staccare il bacino dal cuscino.'
      },
      {
        id: 'f_b1_14',
        name: 'Abductor Machine con Busto Inclinato',
        muscleGroup: 'Glutei',
        stimulusType: 'METABOLIC',
        sets: 4,
        reps: '15',
        targetWeight: '40',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Busto inclinato in avanti per colpire medio e piccolo gluteo.'
      },
      {
        id: 'f_b1_15',
        name: 'Curl Bicipiti con Manubri a Martello',
        muscleGroup: 'Bicipiti',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12',
        targetWeight: '7',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Isolamento flessori senza oscillare.'
      }
    ]
  },
  {
    id: 'f_b1_d4',
    dayNumber: 4,
    title: 'G4: Densità Glutei & Spalle (Hip Thrust Variato & Affondi)',
    exercises: [
      {
        id: 'f_b1_16',
        name: 'Hip Thrust al Multipower o Bilanciere',
        muscleGroup: 'Glutei',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '75',
        rpeTarget: 8.0,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '2-1-1-1',
        notes: 'Fermo 1" in massima estensione d\'anca a buffer.'
      },
      {
        id: 'f_b1_17',
        name: 'Leg Press 45° Piedi Alti e Larghi',
        muscleGroup: 'Glutei / Femorali',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10',
        targetWeight: '110',
        rpeTarget: 8.0,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Spinta con i talloni per attivare glutei e femorali.'
      },
      {
        id: 'f_b1_18',
        name: 'Lento Avanti con Manubri',
        muscleGroup: 'Spalle',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10',
        targetWeight: '10',
        rpeTarget: 8.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Spinta fluida senza inarcare la schiena.'
      },
      {
        id: 'f_b1_19',
        name: 'Alzate Laterali al Cavo Singolo',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12-15',
        targetWeight: '5',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Tensione costante e continua.'
      },
      {
        id: 'f_b1_20',
        name: 'Calf Raise alla Macchina o su Gradino',
        muscleGroup: 'Polpacci',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '15',
        targetWeight: '30',
        rpeTarget: 8.5,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-1-1-1',
        notes: 'Fermo in allungamento 1" e spinta completa.'
      }
    ]
  }
];

// FEMMINILE BLOCCO 2 & 3: TRASFORMAZIONE E QUALITÀ MUSCOLARE AL FEMMINILE (15-16 SETTIMANE)
// Focus: Rest-Pause, 10+MAX, Parziali pulsate, Isometrie a cedimento e defaticamento LISS
const FEMALE_B2_B3_SPLIT: EngineWorkoutDay[] = [
  {
    id: 'f_b2_d1',
    dayNumber: 1,
    title: 'G1: Glutei Effort & Upper Spinta (Back-off & 10+MAX)',
    exercises: [
      {
        id: 'f_b2_1',
        name: 'Barbell Hip Thrust',
        muscleGroup: 'Glutei',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6-8',
        targetWeight: '90',
        rpeTarget: 8.5,
        restSeconds: 120,
        executionType: 'BACK_OFF',
        tut: '2-1-1-1',
        notes: 'Serie pesante seguita da back-off a -25% portato a cedimento concentrico.'
      },
      {
        id: 'f_b2_2',
        name: 'Affondi Bulgari con Manubri',
        muscleGroup: 'Glutei',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '14',
        rpeTarget: 9.5,
        restSeconds: 90,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Cedimento concentrico reale sull\'ultima serie.'
      },
      {
        id: 'f_b2_3',
        name: 'Shoulder Press Machine / Manubri',
        muscleGroup: 'Spalle',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '18',
        rpeTarget: 9.0,
        restSeconds: 75,
        executionType: 'REST_PAUSE',
        tut: '2-0-1-0',
        notes: 'REST-PAUSE: 12 reps a cedimento -> 15" pausa -> max reps -> 15" pausa -> max reps.'
      },
      {
        id: 'f_b2_4',
        name: 'Abductor Machine con Busto Inclinato',
        muscleGroup: 'Glutei',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10 + MAX',
        targetWeight: '45',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-1',
        notes: '10 reps a cedimento + scarico immediato del 40% a max reps con parziali pulsate finali.'
      },
      {
        id: 'f_b2_5',
        name: 'Cardio LISS Defaticante (Tapis roulant pendenza)',
        muscleGroup: 'Cardio / Circolo',
        stimulusType: 'METABOLIC',
        sets: 1,
        reps: '10-12 min',
        targetWeight: '0',
        rpeTarget: 6.0,
        restSeconds: 0,
        executionType: 'REGULAR',
        tut: 'Costante',
        notes: 'Camminata in salita a ritmo costante per stimolare il microcircolo degli arti inferiori.'
      }
    ]
  },
  {
    id: 'f_b2_d2',
    dayNumber: 2,
    title: 'G2: Schiena & Catena Posteriore (Rest-Pause & Kickback Cavi)',
    exercises: [
      {
        id: 'f_b2_6',
        name: 'Stacco Rumeno con Bilanciere (RDL)',
        muscleGroup: 'Femorali / Glutei',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '6-8',
        targetWeight: '60',
        rpeTarget: 8.5,
        restSeconds: 120,
        executionType: 'REGULAR',
        tut: '3-0-1-0',
        notes: 'Carico pesante controllato in discesa a schiena serrata.'
      },
      {
        id: 'f_b2_7',
        name: 'Lat Machine Presa Inversa / Neutra',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '8-10',
        targetWeight: '40',
        rpeTarget: 9.0,
        restSeconds: 90,
        executionType: 'REST_PAUSE',
        tut: '2-0-1-1',
        notes: 'REST-PAUSE sull\'ultima serie: cedimento -> 15" pausa -> max reps.'
      },
      {
        id: 'f_b2_8',
        name: 'Leg Curl Seduto',
        muscleGroup: 'Femorali',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '35',
        rpeTarget: 9.5,
        restSeconds: 60,
        executionType: 'STRIPPING',
        tut: '2-0-1-1',
        notes: 'Stripping a 1 scarico (-35%) al sopraggiungere del cedimento.'
      },
      {
        id: 'f_b2_9',
        name: 'Glute Kickback al Cavo Basso con Isometria',
        muscleGroup: 'Glutei',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12 + Iso',
        targetWeight: '12.5',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: 'ISOMETRIE',
        tut: '2-0-1-2',
        notes: 'Al termine dell\'ultima rep a cedimento, mantieni 10-15s di contrazione isometrica statica di picco.'
      },
      {
        id: 'f_b2_10',
        name: 'Cardio LISS Defaticante (Stair Master / Cyclette)',
        muscleGroup: 'Cardio / Circolo',
        stimulusType: 'METABOLIC',
        sets: 1,
        reps: '10 min',
        targetWeight: '0',
        rpeTarget: 6.0,
        restSeconds: 0,
        executionType: 'REGULAR',
        tut: 'Costante',
        notes: 'Bassa intensità costante per favorire il recupero senza infiammazione.'
      }
    ]
  },
  {
    id: 'f_b2_d3',
    dayNumber: 3,
    title: 'G3: Quadricipiti & Spalle Densità (Leg Press & Parziali)',
    exercises: [
      {
        id: 'f_b2_11',
        name: 'Leg Press 45° a ROM Completo',
        muscleGroup: 'Gambe / Glutei',
        stimulusType: 'NEURAL',
        sets: 4,
        reps: '8-10',
        targetWeight: '140',
        rpeTarget: 9.0,
        restSeconds: 120,
        executionType: 'REST_PAUSE',
        tut: '3-0-1-0',
        notes: 'REST-PAUSE su macchina guidata: cedimento a 10 reps -> 15" pausa -> max reps.'
      },
      {
        id: 'f_b2_12',
        name: 'Leg Extension',
        muscleGroup: 'Gambe',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '10 + MAX',
        targetWeight: '35',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: '10_PIU_MAX',
        tut: '2-0-1-1',
        notes: '10 reps piene + scarico rapido del 40% a cedimento concentrico.'
      },
      {
        id: 'f_b2_13',
        name: 'Alzate Laterali ai Cavi con Parziali',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '12 + Parziali',
        targetWeight: '6',
        rpeTarget: 10,
        restSeconds: 45,
        executionType: 'PARZIALI',
        tut: '2-0-1-1',
        notes: 'Al cedimento a ROM completo, continua con 6-10 mezze ripetizioni pulsate veloci.'
      },
      {
        id: 'f_b2_14',
        name: 'Dip tra due Panche per Tricipiti',
        muscleGroup: 'Tricipiti',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '12',
        targetWeight: '0',
        rpeTarget: 9.0,
        restSeconds: 60,
        executionType: 'REGULAR',
        tut: '2-0-1-0',
        notes: 'Focus sul tono e definizione del retro-braccio.'
      },
      {
        id: 'f_b2_15',
        name: 'Cardio LISS Camminata in Salita',
        muscleGroup: 'Cardio / Circolo',
        stimulusType: 'METABOLIC',
        sets: 1,
        reps: '10-12 min',
        targetWeight: '0',
        rpeTarget: 6.0,
        restSeconds: 0,
        executionType: 'REGULAR',
        tut: 'Costante',
        notes: 'Tapis roulant pendenza 6-8%, velocità 4.5-5.0 km/h.'
      }
    ]
  },
  {
    id: 'f_b2_d4',
    dayNumber: 4,
    title: 'G4: Massimo Pompaggio Glutei & Modellamento Upper (Isometrie)',
    exercises: [
      {
        id: 'f_b2_16',
        name: 'Hip Thrust al Multipower con Isometria Finale',
        muscleGroup: 'Glutei',
        stimulusType: 'HYPERTROPHIC',
        sets: 4,
        reps: '10-12 + Iso',
        targetWeight: '80',
        rpeTarget: 10,
        restSeconds: 90,
        executionType: 'ISOMETRIE',
        tut: '2-1-1-1',
        notes: 'All\'ultima serie a cedimento, mantieni 15 secondi di contrazione statica isometrica di picco.'
      },
      {
        id: 'f_b2_17',
        name: 'Rematore al Pulley Basso con Corda',
        muscleGroup: 'Dorso',
        stimulusType: 'HYPERTROPHIC',
        sets: 3,
        reps: '10-12',
        targetWeight: '35',
        rpeTarget: 9.0,
        restSeconds: 75,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Apertura corda all\'addome con contrazione dorsale pura.'
      },
      {
        id: 'f_b2_18',
        name: 'Abductor Machine Stripping + Parziali',
        muscleGroup: 'Glutei',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '15 + Parziali',
        targetWeight: '45',
        rpeTarget: 10,
        restSeconds: 60,
        executionType: 'PARZIALI',
        tut: '2-0-1-1',
        notes: 'Stripping a 1 scarico seguito da 8 parziali pulsate in massima apertura.'
      },
      {
        id: 'f_b2_19',
        name: 'Deltoidi Posteriori al Cavo Alto / Reverse Fly',
        muscleGroup: 'Spalle',
        stimulusType: 'METABOLIC',
        sets: 3,
        reps: '15',
        targetWeight: '7.5',
        rpeTarget: 9.5,
        restSeconds: 45,
        executionType: 'REGULAR',
        tut: '2-0-1-1',
        notes: 'Postura scapolare aperta per aprire il cingolo scapolare.'
      },
      {
        id: 'f_b2_20',
        name: 'Cardio LISS Finale su Tapis Roulant',
        muscleGroup: 'Cardio / Circolo',
        stimulusType: 'METABOLIC',
        sets: 1,
        reps: '12 min',
        targetWeight: '0',
        rpeTarget: 6.0,
        restSeconds: 0,
        executionType: 'REGULAR',
        tut: 'Costante',
        notes: 'Smaltimento metabolico senza impatto infiammatorio.'
      }
    ]
  }
];

// ============================================================================
// 3. REGISTRO TOTALE TEMPLATE & FUNZIONI DI SELEZIONE GENDER-AWARE
// ============================================================================

export const TOP_GYM_SPLIT_TEMPLATES: TopGymSplitTemplate[] = [
  // --- TEMPLATE MASCHILI ---
  {
    id: 'b1_base',
    name: 'UOMO · Blocco 1: Base (Petto-Spalle-Bic / Gambe-Dorso-Tric)',
    block: 'BLOCCO_1_FORZA',
    gender: 'MALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Split primaria raccomandata per il Blocco 1. Consente massima freschezza neurale su Panca e Squat, eliminando l\'affaticamento degli antagonisti prima dei carichi pesanti.',
    focus: 'Forza Ipertrofica Neurale · Buffer RIR 2-4',
    days: B1_SPLIT_BASE
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
    days: B1_SPLIT_UPPER_LOWER
  },
  {
    id: 'b2_antagonisti',
    name: 'UOMO · Blocchi 2-3: Base (Antagonisti Petto-Dorso-Tric / Gambe-Spalle-Bic)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'MALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Split fondamentale del Metodo TOP GYM per i Blocchi 2 e 3. Massimo pompaggio tramite accoppiamento di gruppi antagonisti e spazio completo per tecniche di intensità (10+MAX, Rest-Pause, Stripping).',
    focus: 'Trasformazione Ipertrofica & Qualità Muscolare',
    days: B2_B3_SPLIT_ANTAGONISTI
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
    days: B2_B3_SPLIT_PUSH_PULL
  },

  // --- TEMPLATE FEMMINILI ---
  {
    id: 'f_b1_base',
    name: 'DONNA · Blocco 1: Forza Ipertrofica Femminile (Hip Thrust & Glutei)',
    block: 'BLOCCO_1_FORZA',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Programmazione femminile con focus su Hip Thrust, Semi-sumo e stabilità pelvica a buffer (RIR 2-3).',
    focus: 'Cerniera d\'Anca, Glutei e Stabilità Pelvica',
    days: FEMALE_B1_SPLIT
  },
  {
    id: 'f_b2_qualita',
    name: 'DONNA · Blocchi 2-3: Trasformazione & Qualità Glutei (10+MAX & Rest-Pause)',
    block: 'BLOCCO_2_TRASFORMAZIONE',
    gender: 'FEMALE',
    daysCount: 4,
    type: 'BASE',
    description: 'Massimo stimolo estetico: Rest-Pause, 10+MAX, Parziali pulsate, Isometrie a fine serie e 10-12m di cardio LISS.',
    focus: 'Ipertrofia Glutei, Modellamento Upper & Circolo LISS',
    days: FEMALE_B2_B3_SPLIT
  }
];

/**
 * Restituisce i template adatti al Blocco in uso.
 * Se viene fornito il nome o il genere dell'atleta, i template dedicati
 * a quel genere vengono posizionati prioritariamente in cima alla lista.
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