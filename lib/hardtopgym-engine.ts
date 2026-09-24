// lib/hardtopgym-engine.ts
// MOTORE METODOLOGICO HARDTOPGYM (Emilio They + Bosco & Colli)

export type HardTopGymPhase = 
  | 'PHASE_1_BASE'         // Costruzione di Base (4-6 sett.)
  | 'PHASE_2_ADVANCED'     // Preparazione Avanzata (6-8 sett.)
  | 'PHASE_3_DEEP_SHOCK'   // Stimolazione Profonda / Urto / Sblocco (8-10 sett.)
  | 'PHASE_4_PRE_CONTEST'  // Pre-Gara & Contest (-30 gg)
  | 'PHASE_5_RECOVERY';    // Post-Gara Recupero (2-4 sett.)

// Alias di compatibilità
export type HardPhase = HardTopGymPhase;

export type HardSplit = '3_DAYS' | '4_DAYS' | '5_DAYS_PMC' | '6_DAYS_MONO';

export type IntraSessionCategory = 
  | 'NEURAL_TESTO'         // Fase 1: 2-4 reps, CAT, 70-85% 1RM, Rec 2'30"-3'30" (Picco Testosterone)
  | 'MECHANICAL_TENSION'   // Fase 2: 6-10 reps, pesante-controllato, Rec 1'30"-2'30" (Fibre IIa/IIb)
  | 'METABOLIC_GH';        // Fase 3: 8-15+ reps, isotensivo, Rec 45"-90" (Cedimento & Picco GH)

export type HardExecutionTUT = 
  | 'CAT'                  // Concentrica esplosiva / Eccentrica frenata 2-3"
  | 'ISOTENSIVE_SLOW'      // 3"-1"-3"-0" Tensione continua
  | 'PEAK_CONTRACTION'     // Fermo 2-3" in massimo accorciamento
  | 'SUPERSLOW'            // 10" concentrica - 5" eccentrica
  | 'BURNS_PARTIALS';      // Mezze ripetizioni a cedimento

export type SpecialTechnique = 
  | 'NONE'
  | 'POF_MESOTONIA'        // Position of Flexion - Esercizio Intermedio
  | 'POF_STRETCH'          // Position of Flexion - Massimo Allungamento
  | 'POF_PEAK'             // Position of Flexion - Massimo Accorciamento
  | 'STRIPPING_3_DROP'     // Cedimento + 3 scarichi del 20-30%
  | 'REST_PAUSE_THEY'      // Cedimento 4-6 reps + 15" + 1-2 reps + 15" + forzata
  | 'PIRAMIDE_INVERTITA'   // 1 set 6-8 + scarichi + recupero + risalita forzata
  | 'GIANT_SET'            // 4-5 esercizi continui stesso distretto
  | 'NEGATIVE_PURE'        // 110-120% 1RM frenata 6-8"
  | 'PEAK_POWER';          // Esercizio pesante + scarico 10kg e pulsazioni 7-8"

export interface HardTopGymExercise {
  id: string;
  order: number;
  muscleGroup: string;
  name: string;
  category: IntraSessionCategory;
  sets: number;
  reps: string;
  targetWeight?: number;
  rpeTarget: number;
  tut: HardExecutionTUT | string;
  effortBuffer: string;          // es. "RIR 2-3", "Cedimento Concentrico", "RIR 0"
  specialTechnique: SpecialTechnique;
  restSeconds: number;
  notes?: string;
  executionType: string;
}

export interface HardTopGymWorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  splitType?: string;
  exercises: HardTopGymExercise[];
}

export interface HardTopGymProgram {
  id: string;
  athleteId: string;
  model: 'HARDTOPGYM';
  phase: HardTopGymPhase;
  currentWeek: number;
  totalWeeks: number;
  splitDaysCount: 3 | 4 | 5 | 6;
  weakPointMuscle?: string;      // Distretto target PMC (es. "Femorali")
  days: HardTopGymWorkoutDay[];
  contestCountdownDays?: number; // Valorizzato se in FASE 4 (es. -20 gg dal D-Day)
}

/**
 * GENERATORE ALGORITMICO SCHEDE HARDTOPGYM
 */
export function generateHardTopGymProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string = 'Cosce/Femorali',
  contestDaysLeft: number = 30
): HardTopGymWorkoutDay[] {
  const makeId = () => `hard-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // =========================================================================
  // FASE 1: COSTRUZIONE DI BASE (They Bulk / CAT / Picco Testosterone Bosco)
  // =========================================================================
  if (phase === 'PHASE_1_BASE') {
    if (split === '3_DAYS') {
      return [
        {
          id: makeId(),
          dayNumber: 1,
          title: 'Giorno 1: Spinta & Efficienza Neurale CAT',
          exercises: [
            {
              id: makeId(),
              order: 1,
              name: 'Panca Piana Bilanciere',
              muscleGroup: 'Petto',
              category: 'NEURAL_TESTO',
              sets: 5,
              reps: '4-6',
              rpeTarget: 8,
              restSeconds: 180,
              tut: 'CAT',
              effortBuffer: 'RIR 2-3 (Buffer)',
              specialTechnique: 'NONE',
              notes: 'Fase 1 Bosco: Massima accelerazione concentrica. Picco Testosterone.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 2,
              name: 'Lento Avanti Bilanciere',
              muscleGroup: 'Spalle',
              category: 'NEURAL_TESTO',
              sets: 4,
              reps: '6-8',
              rpeTarget: 8,
              restSeconds: 150,
              tut: 'CAT',
              effortBuffer: 'RIR 2',
              specialTechnique: 'NONE',
              notes: 'Spinta esplosiva a gomiti stretti, stop 1" al petto.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 3,
              name: 'Panca Stretta Tricipiti',
              muscleGroup: 'Tricipiti',
              category: 'MECHANICAL_TENSION',
              sets: 4,
              reps: '6-8',
              rpeTarget: 8.5,
              restSeconds: 120,
              tut: 'ISOTENSIVE_SLOW',
              effortBuffer: 'RIR 1.5',
              specialTechnique: 'NONE',
              notes: 'Gomiti aderenti al busto. Tensione meccanica.',
              executionType: 'REGULAR'
            }
          ]
        },
        {
          id: makeId(),
          dayNumber: 2,
          title: 'Giorno 2: Arti Inferiori & Catena Cinetica',
          exercises: [
            {
              id: makeId(),
              order: 1,
              name: 'Squat con Bilanciere',
              muscleGroup: 'Quadricipiti',
              category: 'NEURAL_TESTO',
              sets: 5,
              reps: '4-6',
              rpeTarget: 8,
              restSeconds: 210,
              tut: 'CAT',
              effortBuffer: 'RIR 2 (Buffer)',
              specialTechnique: 'NONE',
              notes: 'Massimo reclutamento UM ad alta soglia. Zero rimbalzo.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 2,
              name: 'Stacco Gambe Tese',
              muscleGroup: 'Femorali',
              category: 'MECHANICAL_TENSION',
              sets: 4,
              reps: '6-8',
              rpeTarget: 8,
              restSeconds: 150,
              tut: '3-0-1-0',
              effortBuffer: 'RIR 2',
              specialTechnique: 'POF_STRETCH',
              notes: 'Massimo allungamento eccentrico dei femorali. Bacino indietro.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 3,
              name: 'Calf in Piedi Bilanciere',
              muscleGroup: 'Polpacci',
              category: 'METABOLIC_GH',
              sets: 4,
              reps: '10-12',
              rpeTarget: 9,
              restSeconds: 90,
              tut: 'PEAK_CONTRACTION',
              effortBuffer: 'RIR 1',
              specialTechnique: 'POF_PEAK',
              notes: 'Fermo isometrico 2" in massimo allungamento su gradino.',
              executionType: 'REGULAR'
            }
          ]
        },
        {
          id: makeId(),
          dayNumber: 3,
          title: 'Giorno 3: Trazione Dorsale & Flessori',
          exercises: [
            {
              id: makeId(),
              order: 1,
              name: 'Stacco da Terra Regolare',
              muscleGroup: 'Dorso',
              category: 'NEURAL_TESTO',
              sets: 4,
              reps: '4-6',
              rpeTarget: 8,
              restSeconds: 210,
              tut: 'CAT',
              effortBuffer: 'RIR 2',
              specialTechnique: 'NONE',
              notes: 'Reclutamento sistemico neuro-endocrino. Ripartenza da fermo a ogni rep.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 2,
              name: 'Trazioni alla Sbarra / Lat Machine',
              muscleGroup: 'Dorso',
              category: 'MECHANICAL_TENSION',
              sets: 4,
              reps: '6-8',
              rpeTarget: 8.5,
              restSeconds: 150,
              tut: '2-1-1-0',
              effortBuffer: 'RIR 1.5',
              specialTechnique: 'POF_MESOTONIA',
              notes: 'Petto alto verso la sbarra, adduzione scapolare decisa.',
              executionType: 'REGULAR'
            },
            {
              id: makeId(),
              order: 3,
              name: 'Curl Bilanciere Sagomato',
              muscleGroup: 'Bicipiti',
              category: 'METABOLIC_GH',
              sets: 4,
              reps: '6-8',
              rpeTarget: 8.5,
              restSeconds: 120,
              tut: 'ISOTENSIVE_SLOW',
              effortBuffer: 'RIR 1',
              specialTechnique: 'NONE',
              notes: 'Zero oscillazione del busto. Massima contrazione di picco.',
              executionType: 'REGULAR'
            }
          ]
        }
      ];
    }

    // Default: Split 4 giorni Base
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Giorno 1: Torso Spinta Neurale (Panca & Lento)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2-3', specialTechnique: 'NONE', notes: 'Stimolo Neurale Bosco: 75-80% 1RM a massima velocità.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Preservazione del Testosterone.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Dip Parallele zavorrate', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Tensione meccanica profonda.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Gambe Complete Pesanti',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 210, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Costruzione di base They: discesa solida, risalita violenta.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Piedi a larghezza spalle, profondità completa.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Curl Seduto / Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 1" nel punto di massima flessione.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Torso Trazione & Schiena',
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 5, reps: '5-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Tirata esplosiva con schiena bloccata.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Trazioni Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Fermo isometrico 1" al petto.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pulley Basso al Cavo', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tensione continua senza slancio.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: 'Giorno 4: Catena Posteriore, Braccia & Addome',
        exercises: [
          { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 4, reps: '4-6', rpeTarget: 8, restSeconds: 210, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Reclutamento UM ad altissima soglia.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Curl Manubri Panca Inclinata', muscleGroup: 'Bicipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento del capo lungo del bicipite.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'French Press Bilanciere EZ', muscleGroup: 'Tricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Gomiti fermi, discesa controllata alla fronte.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // =========================================================================
  // FASE 2: PREPARAZIONE AVANZATA (Split Antagonisti They / Ibrido Neurale + GH)
  // =========================================================================
  if (phase === 'PHASE_2_ADVANCED') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Giorno 1: Antagonisti They A (Petto - Dorso - Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 4, reps: '5-6', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Fase 1 Neurale Bosco: Stimolo Testosterone.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Rematore Manubrio Singolo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Fase 2 Meccanica: Tensione continua pesante.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Croci Manubri Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Stiramento P.O.F.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Lat Machine Presa Inversa', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 1" a clavicole toccate.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Fase 3 Metabolica Bosco: Accumulo lattacido e impennata del GH.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Antagonisti They B (Gambe - Spalle - Bicipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 4, reps: '5-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Stimolo Neurale primario.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento Dietro / Avanti Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spinta piena senza blocco articolare.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'P.O.F. di Stiramento per i femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Stop isometrico 1" a braccia parallele.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Curl Panca Scott Bilanciere EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Fase Metabolica GH: Bruciore e pump massimo.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Antagonisti They A (Richiamo & Densità)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Bilanciere', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Tensione meccanica sulla porzione clavicolare.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Massimo reclutamento ampiezza schiena.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pectoral Machine / Cavi', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'P.O.F. Accorciamento con Peak Contraction 2".', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Pullover Manubrio', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8.5, restSeconds: 60, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'P.O.F. Allungamento cassa toracica.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'French Press Cavo Basso', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Tricipiti a cedimento concentrico.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: 'Giorno 4: Antagonisti They B (Richiamo Catena Posteriore & Spalle)',
        exercises: [
          { id: makeId(), order: 1, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spinta talloni, tensione costante.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Peak Contraction 2" in estensione completa.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 4, reps: '8-10', rpeTarget: 9, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Flessione decisa, discesa frenata.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Face Pull al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Deltoidi posteriori e trapezio.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Hammer Curl con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: '2-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Brachiale e brachioradiale.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // =========================================================================
  // FASE 3: STIMOLAZIONE PROFONDA, URTO & SBLOCCO (P.O.F. / Stripping / Rest-Pause)
  // =========================================================================
  if (phase === 'PHASE_3_DEEP_SHOCK') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Giorno 1: Urto Pettorali & Tricipiti (Metodo P.O.F. & Stripping)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere (Mesotonia P.O.F.)', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 4, reps: '6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Base They: Esercizio Intermedio. Carico elevato.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Croci Panca 30° Manubri (Allungamento P.O.F.)', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento delle fasce connettivali.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pectoral Machine (Accorciamento P.O.F.)', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping They: Raggiungi il cedimento a 8 reps, scarica del 25% due volte senza sosta.', executionType: 'STRIPPING' },
          { id: makeId(), order: 4, name: 'French Press Bilanciere EZ (Mesotonia)', muscleGroup: 'Tricipiti', category: 'MECHANICAL_TENSION', sets: 3, reps: '6-8', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Discesa controllata dietro la testa.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda (Stripping)', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 60, tut: 'BURNS_PARTIALS', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'Cedimento finale totale.', executionType: 'STRIPPING' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Urto Quadricipiti & Polpacci (Rest-Pause & P.O.F.)',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere (Mesotonia P.O.F.)', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 4, reps: '6', rpeTarget: 8.5, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Pesi submassimali in CAT.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Hack Squat / Sissy Squat (Allungamento P.O.F.)', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'Massimo stiramento del retto femorale.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Extension (Accorciamento P.O.F.)', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 3, reps: '6+2+2 REST-PAUSE', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'REST_PAUSE_THEY', notes: 'Rest-Pause They: 6 reps a cedimento, stop 15", 2 reps, stop 15", 2 reps forzate.', executionType: 'REST_PAUSE' },
          { id: makeId(), order: 4, name: 'Calf in Piedi su Macchina', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 4, reps: '10+10+10 STRIPPING', rpeTarget: 10, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping con fermo a ogni singola ripetizione.', executionType: 'STRIPPING' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Urto Dorsali & Deltoidi Posteriori (Peak-Power)',
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore Bilanciere 45° (Mesotonia P.O.F.)', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 4, reps: '6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Esercizio base multiarticolare pesante.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pullover Manubrio (Allungamento P.O.F.)', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Espansione toracica e allungamento del dorsale.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Lat Machine Presa Stretta (Accorciamento)', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping They per esaurimento miofibrillare.', executionType: 'STRIPPING' },
          { id: makeId(), order: 4, name: 'Alzate a 90° Panca Inclinata', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Fascio posteriore con peak contraction.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: 'Giorno 4: Urto Femorali, Spalle & Bicipiti',
        exercises: [
          { id: makeId(), order: 1, name: 'Stacco Rumeno Bilanciere (Allungamento P.O.F.)', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 150, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Tensione eccentrica continua sui femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Curl Sdraiato (Accorciamento)', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 3, reps: '6+2+2 REST-PAUSE', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'REST_PAUSE_THEY', notes: 'Rest-Pause They: massimo esaurimento con fermo 2".', executionType: 'REST_PAUSE' },
          { id: makeId(), order: 3, name: 'Lento Avanti Manubri', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spinta solida per i deltoidi.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Curl Bilanciere Scott (P.O.F.)', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 75, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0', specialTechnique: 'STRIPPING_3_DROP', notes: 'Saturazione ematica del bicipite brachiale.', executionType: 'STRIPPING' }
        ]
      }
    ];
  }

  // =========================================================================
  // FASE 4: VERSO LA GARA (They Countdown al D-Day)
  // =========================================================================
  if (phase === 'PHASE_4_PRE_CONTEST') {
    if (contestDaysLeft <= 5) {
      return [
        {
          id: makeId(),
          dayNumber: 1,
          title: 'Pre-Gara D-5 / D-1: Stop Gambe & Posing Isometrico They',
          exercises: [
            { id: makeId(), order: 1, name: 'Posing Isometrico Obbligatorie (Mattina)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Conduzione del glicogeno nelle cellule senza infiammazione muscolare.', executionType: 'ISOMETRIE' },
            { id: makeId(), order: 2, name: 'Posing Isometrico Obbligatorie (Pomeriggio)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Controllo del vuoto addominale e separazione striata.', executionType: 'ISOMETRIE' }
          ]
        }
      ];
    }

    if (contestDaysLeft <= 9) {
      return [
        {
          id: makeId(),
          dayNumber: 1,
          title: 'Carbing Down: Svuotamento Torso (Pompaggio ad Alta Densità)',
          exercises: [
            { id: makeId(), order: 1, name: 'Spinte con Manubri su Panca', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Deplezione totale glicogeno intramuscolare.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Pulley al Cavo Presa Larga', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Attivazione glicogeno-sintetasi.', executionType: 'REGULAR' },
            { id: makeId(), order: 3, name: 'Alzate Laterali con Manubri Leggeri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Densità vascolare estrema.', executionType: 'REGULAR' }
          ]
        },
        {
          id: makeId(),
          dayNumber: 2,
          title: 'Carbing Down: Svuotamento Braccia & Complementari',
          exercises: [
            { id: makeId(), order: 1, name: 'Pushdown al Cavo', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Pause brevissime.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Curl ai Cavi Alti', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Massimo bruciore e capillarizzazione.', executionType: 'REGULAR' }
          ]
        }
      ];
    }

    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Pre-Contest: Torso Qualità & Preservazione Densità CAT',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Preservazione delle fibre IIb ad alta soglia senza forzate.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Croci Cavi + Pectoral Machine', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 3, reps: '12+12 SUPERSET', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Separazione muscolare e picco continuo.', executionType: 'SUPERSET' },
          { id: makeId(), order: 3, name: 'Lat Machine Presa a V', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Dettaglio dorsale.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // =========================================================================
  // FASE 5: RECUPERO POST-GARA (Metodo PUMP & Maxi-Pump They)
  // =========================================================================
  return [
    {
      id: makeId(),
      dayNumber: 1,
      title: 'Post-Gara: Circuito Rigenerante PUMP They (Total Body)',
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Inclinata Manubri Leggeri', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Zero cedimento. Massimo afflusso ematico e decontrattura.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Lat Machine Dietro / Avanti Lenta', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Scarico articolare e sfiammatura tendinea.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Leg Extension Leggero', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Wash-out delle scorie metaboliche.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Leg Curl Seduto Leggero', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Circolazione periferica distrettuale.', executionType: 'REGULAR' }
      ]
    }
  ];
}
/**
 * Calcola l'avanzamento automatico in base a workoutHistory e alla dimensione della split (3, 4, 5 o 6 giorni)
 */
export function calculateHardTopGymProgress(
    workoutHistory: any[],
    athleteId: string | undefined,
    splitDaysCount: number
  ) {
    // 1. Assicura che la split sia compresa tra 3 e 6
    const splitSize = Math.max(3, Math.min(6, splitDaysCount || 4));
  
    // 2. Filtra gli allenamenti completati dall'atleta attivo
    const completedWorkouts = Array.isArray(workoutHistory)
      ? workoutHistory.filter(w => {
          if (!w) return false;
          if (!athleteId) return true;
          return (
            w.athleteId === athleteId ||
            w.userId === athleteId ||
            w.athlete_id === athleteId ||
            w.user_id === athleteId
          );
        })
      : [];
  
    const totalCompleted = completedWorkouts.length;
  
    // 3. Calcolo settimana corrente (ciclo base a 4 settimane: 1, 2, 3, 4 Deload)
    const completedWeeks = Math.floor(totalCompleted / splitSize);
    const currentWeek = (completedWeeks % 4) + 1; // Ruota da 1 a 4
    const workoutInCurrentWeek = (totalCompleted % splitSize) + 1;
    const isDeloadWeek = currentWeek === 4;
    const isCycleCompleted = completedWeeks > 0 && completedWeeks % 4 === 0 && (totalCompleted % splitSize === 0);
  
    return {
      splitSize,
      totalCompleted,
      currentWeek,
      workoutInCurrentWeek,
      isDeloadWeek,
      isCycleCompleted
    };
  }
  
  /**
   * Modula la scheda attiva in base alla settimana calcolata
   */
  export function applyHardTopGymWeekProgression(
    days: any[],
    targetWeek: number
  ): any[] {
    return days.map(day => ({
      ...day,
      exercises: (day.exercises || []).map((ex: any) => {
        // SETTIMANA 4: SCARICO ATTIVO (DELOAD)
        if (targetWeek === 4) {
          return {
            ...ex,
            sets: Math.max(2, (ex.sets || 3) - 1),
            rpeTarget: Math.max(6, (ex.rpeTarget || 8) - 1.5),
            notes: `[SETTIMANA 4 · SCARICO ATTIVO] Volume -30%, esecuzione tecnica a buffer controllato (RIR 3-4).`
          };
        }
  
        // SETTIMANA 3: INTENSIFICAZIONE MASSIMA & TECNICHE D'URTO
        if (targetWeek === 3) {
          return {
            ...ex,
            rpeTarget: Math.min(10, (ex.rpeTarget || 8) + 0.5),
            notes: `[SETTIMANA 3 · INTENSIFICAZIONE] Massimo reclutamento UM. Spingere al limite del buffer (RIR 1-0.5).`
          };
        }
  
        // SETTIMANA 2: ACCUMULO E MICRO-INCREMENTO
        if (targetWeek === 2) {
          return {
            ...ex,
            notes: `[SETTIMANA 2 · ACCUMULO] Cerca un micro-incremento (+1.25/+2.5 kg) mantenendo la massima accelerazione CAT.`
          };
        }
  
        // SETTIMANA 1: FASE BASE
        return {
          ...ex,
          notes: `[SETTIMANA 1 · SETUP NEURALE] Focus assoluto su velocità concentrica (CAT) e controllo eccentrico.`
        };
      })
    }));
  }