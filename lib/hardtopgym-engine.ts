// lib/hardtopgym-engine.ts
// MOTORE METODOLOGICO HARDTOPGYM (Emilio They + Bosco & Colli)

export type HardTopGymPhase = 
  | 'PHASE_1_BASE'         // Costruzione di Base (4-6 sett.)
  | 'PHASE_2_ADVANCED'     // Preparazione Avanzata (6-8 sett.)
  | 'PHASE_3_DEEP_SHOCK'   // Stimolazione Profonda / Urto / Sblocco (8-10 sett.)
  | 'PHASE_4_PRE_CONTEST'  // Pre-Gara & Contest (-30 gg al D-Day)
  | 'PHASE_5_RECOVERY';    // Post-Gara Recupero (2-4 sett.)

export type HardPhase = HardTopGymPhase;
export type HardSplit = '3_DAYS' | '4_DAYS' | '5_DAYS_PMC' | '6_DAYS_MONO';

export type IntraSessionCategory = 
  | 'NEURAL_TESTO'         // Fase 1: CAT, 70-85% 1RM, Rec 2'30"-3'30" (Picco Testosterone)
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
  effortBuffer: string;
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
  weakPointMuscle?: string;
  days: HardTopGymWorkoutDay[];
  contestCountdownDays?: number;
}

const makeId = () => `hard-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// ============================================================================
// GENERATORE SCHEDE METODO HARDTOPGYM (THEY & BOSCO-COLLI)
// ============================================================================
export function generateHardTopGymProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string = 'Cosce/Femorali',
  contestDaysLeft: number = 30
): HardTopGymWorkoutDay[] {

  // --------------------------------------------------------------------------
  // SPLIT 3 GIORNI (Spinta / Gambe / Trazione)
  // --------------------------------------------------------------------------
  if (split === '3_DAYS') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Giorno 1: Spinta & Efficienza Neurale CAT (Petto - Spalle - Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2-3', specialTechnique: 'NONE', notes: 'Fase 1 Bosco: Massima accelerazione concentrica volontaria. Picco di Testosterone.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Spinta esplosiva a gomiti chiusi.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Dip alle Parallele zavorrate', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento sotto carico.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Fase 3 Bosco: Accumulo lattacido e impennata del GH.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Gambe Complete & Catena Posteriore (Quadricipiti - Femorali - Polpacci)',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 210, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Discesa controllata 3", risalita violenta. Zero rimbalzo.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Piedi a larghezza spalle, profondità totale.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Stacco Gambe Tese con Bilanciere', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: '3-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento eccentrico dei femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Calf in Piedi su Gradino', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 4, reps: '10-12', rpeTarget: 9, restSeconds: 75, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Fermo statico 2" in massimo allungamento.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Trazione Schiena & Braccia (Dorso - Deltoidi Post - Bicipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 4, reps: '4-6', rpeTarget: 8, restSeconds: 210, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Reclutamento sistemico UM ad alta soglia. Ripartenza da terra.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Tirata decisa all\'ombelico con schiena bloccata.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Fermo 1" a clavicole toccate.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Curl Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 4, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Massima tensione continua senza oscillazioni del tronco.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --------------------------------------------------------------------------
  // SPLIT 4 GIORNI (Standard Antagonisti They: Petto/Dorso/Tri & Gambe/Spalle/Bi)
  // --------------------------------------------------------------------------
  if (split === '4_DAYS') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Giorno 1: Antagonisti They A (Petto - Dorso - Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 4, reps: '5-6', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'CAT esplosivo Bosco per stimolo Testosterone.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Rematore Manubrio Singolo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Tensione meccanica profonda.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Croci Manubri su Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento P.O.F.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Lat Machine Presa Inversa', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 1".', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Pushdown al Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Picco di GH e accumulo lattacido.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Antagonisti They B (Gambe - Spalle - Bicipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 4, reps: '5-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'Reclutamento neurale primario.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento con Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spinta piena.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Stiramento femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Fermo 1" a braccia parallele.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Curl su Panca Scott Bilanciere EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Massima saturazione ematica.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Antagonisti They A (Richiamo Torso & P.O.F.)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Bilanciere', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Porzione clavicolare del pettorale.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Trazioni alla Sbarra Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Adduzione scapolare decisa.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pectoral Machine', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 2".', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Pullover con Manubrio', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8.5, restSeconds: 60, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento cassa toracica.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'French Press Cavo Basso', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Cedimento concentrico finale.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: 'Giorno 4: Antagonisti They B (Richiamo Catena Posteriore & Spalle)',
        exercises: [
          { id: makeId(), order: 1, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spinta con i talloni.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 2".', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 4, reps: '8-10', rpeTarget: 9, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Flessione decisa, discesa frenata.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Face Pull al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Deltoidi posteriori e trapezi.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Hammer Curl con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: '2-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Brachiale per spessore braccio.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --------------------------------------------------------------------------
  // SPLIT 5 GIORNI (Specializzazione PMC Punti Carenti They)
  // --------------------------------------------------------------------------
  if (split === '5_DAYS_PMC') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: `Giorno 1: Specializzazione PMC 1 · ${weakPoint} (Lavoro Neurale & Meccanico Pesante)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Squat con Bilanciere' : 'Panca Piana Bilanciere', muscleGroup: weakPoint, category: 'NEURAL_TESTO', sets: 5, reps: '4-6', rpeTarget: 8.5, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'PMC Priorità: Massima concentrazione e carichi pesanti su target carente.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Hack Squat / Leg Press' : 'Spinte Manubri su Panca', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Tensione meccanica continua.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: weakPoint.includes('Cosce') ? 'Leg Extension con Peak 2"' : 'Croci ai Cavi con Peak 2"', muscleGroup: weakPoint, category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 75, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Massima contrazione a picco.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Torso Spinta a Volume Ridotto (Petto & Spalle)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata con Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Volume moderato per preservare il recupero sistemico.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento Avanti con Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'CAT rapido.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Alzate Laterali al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Isolamento deltoide laterale.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Torso Trazione a Volume Ridotto (Dorso & Braccia)',
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore con Bilanciere 45°', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Schiena bloccata, tirata fluida.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lat Machine Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Allungamento completo.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Curl Alternato con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tricipiti/bicipiti in mantenimento.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: `Giorno 4: Specializzazione PMC 2 · ${weakPoint} (Richiamo Catena Posteriore & Densità)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Stacco Rumeno con Bilanciere' : 'Dip alle Parallele zavorrate', muscleGroup: weakPoint, category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 150, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'PMC Richiamo: enfasi sull\'allungamento eccentrico.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Leg Curl Seduto' : 'Panca Stretta con Bilanciere', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_MESOTONIA', notes: 'Tensione miofibrillare selettiva.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: weakPoint.includes('Cosce') ? 'Calf su Macchina' : 'Pushdown al Cavo', muscleGroup: weakPoint, category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Bruciore e saturazione vascolare.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 5,
        title: `Giorno 5: Saturazione Totale PMC · ${weakPoint} (Super-Pump & Stripping)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Sissy Squat / Affondi Camminati' : 'Croci Cavi Incrociati', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 75, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'Massimo stiramento continuo.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Leg Extension Stripping' : 'Pectoral Machine Stripping', muscleGroup: weakPoint, category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: '2-2-1-0', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping They: cedimento e 2 scarichi del 25% consecutivi.', executionType: 'STRIPPING' },
          { id: makeId(), order: 3, name: 'Crunch Addominali su Panca Inclinata', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '20', rpeTarget: 9, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Chiusura sessione.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --------------------------------------------------------------------------
  // SPLIT 6 GIORNI (Monomuscolare Off-Season / Pre-Gara Emilio They)
  // --------------------------------------------------------------------------
  return [
    {
      id: makeId(),
      dayNumber: 1,
      title: 'Giorno 1: Spalle Complete & Trapezi (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 5, reps: '5-6', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'Stimolo neurale Bosco per Testosterone.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Fermo 1" a parallelo.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Alzate Laterali su Panca Inclinata', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'Allungamento P.O.F.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Face Pull al Cavo Alto', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 2" per deltoide posteriore.', executionType: 'REGULAR' },
        { id: makeId(), order: 5, name: 'Scrollate con Manubri (Shrugs)', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: '2-2-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Trapezi in contrazione di picco.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId(),
      dayNumber: 2,
      title: 'Giorno 2: Dorsali & Bassa Schiena (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 4, reps: '4-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Reclutamento UM ad altissima soglia.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Rematore con Bilanciere 45°', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Spessore gran dorsale.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Trazioni alla Sbarra Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Ampiezza a triangolo.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Pullover con Manubrio Trasversale', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8.5, restSeconds: 60, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento gran dorsale.', executionType: 'REGULAR' },
        { id: makeId(), order: 5, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Saturazione ematica e pump.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId(),
      dayNumber: 3,
      title: 'Giorno 3: Quadricipiti a Saturazione (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', sets: 5, reps: '5-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'Pilastro massa e potenza arti inferiori.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Leg Press 45° Pesante', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Carico submassimale.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Hack Squat / Sissy Squat', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'Isolamento retto femorale in allungamento.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Leg Extension con Peak Contraction', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Fermo 2" in estensione completa.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId(),
      dayNumber: 4,
      title: 'Giorno 4: Pettorali & Cassa Toracica (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', sets: 5, reps: '5-6', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'CAT concentrico a massima accelerazione volontaria.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Panca Inclinata con Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Discesa profonda controllata.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Croci su Panca 30° Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento fasce connettivali.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Dip alle Parallele', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '2-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Inclinazione in avanti del tronco.', executionType: 'REGULAR' },
        { id: makeId(), order: 5, name: 'Pectoral Machine / Cavi Incrociati', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 2".', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId(),
      dayNumber: 5,
      title: 'Giorno 5: Braccia Complete Alternato (Bicipiti & Tricipiti Push-Pull)',
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Stretta Bilanciere', muscleGroup: 'Tricipiti', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'Gomiti aderenti al busto.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Curl con Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'POF_MESOTONIA', notes: 'Zero oscillazione.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'French Press Bilanciere EZ', muscleGroup: 'Tricipiti', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento tricipiti.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Curl Manubri su Panca Inclinata', muscleGroup: 'Bicipiti', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Capo lungo bicipite in stiramento.', executionType: 'REGULAR' },
        { id: makeId(), order: 5, name: 'Pushdown al Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Apertura corda in basso.', executionType: 'REGULAR' },
        { id: makeId(), order: 6, name: 'Curl su Panca Scott EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 1".', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId(),
      dayNumber: 6,
      title: 'Giorno 6: Femorali & Polpacci (Catena Posteriore They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco Gambe Tese con Bilanciere', muscleGroup: 'Femorali', category: 'NEURAL_TESTO', sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: '3-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento eccentrico dei bicipiti femorali.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Discesa controllata 3 secondi.', executionType: 'REGULAR' },
        { id: makeId(), order: 3, name: 'Leg Curl Seduto con Peak Contraction', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Fermo statico 2" in flessione massima.', executionType: 'REGULAR' },
        { id: makeId(), order: 4, name: 'Calf in Piedi su Macchina', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 4, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: '2-2-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Fermo 2" in allungamento su gradino.', executionType: 'REGULAR' },
        { id: makeId(), order: 5, name: 'Calf Seduto (Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '15-20', rpeTarget: 9.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Bruciore e saturazione del soleo.', executionType: 'REGULAR' }
      ]
    }
  ];
}

// ============================================================================
// CALCOLO AVANZAMENTO AUTOMATICO DA WORKOUT HISTORY
// ============================================================================
export function calculateHardTopGymProgress(
  workoutHistory: any[],
  athleteId: string | undefined,
  splitDaysCount: number
) {
  const splitSize = Math.max(3, Math.min(6, splitDaysCount || 4));

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
  const completedWeeks = Math.floor(totalCompleted / splitSize);
  const currentWeek = (completedWeeks % 4) + 1;
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

// ============================================================================
// APPLICAZIONE MODULAZIONE SETTIMANALE SULLA SCHEDA ATTIVA
// ============================================================================
export function applyHardTopGymWeekProgression(
  days: any[],
  targetWeek: number
): any[] {
  return days.map(day => ({
    ...day,
    exercises: (day.exercises || []).map((ex: any) => {
      if (targetWeek === 4) {
        return {
          ...ex,
          sets: Math.max(2, (ex.sets || 3) - 1),
          rpeTarget: Math.max(6, (ex.rpeTarget || 8) - 1.5),
          notes: `[SETTIMANA 4 · SCARICO ATTIVO] Volume -30%, esecuzione tecnica a buffer controllato (RIR 3-4).`
        };
      }

      if (targetWeek === 3) {
        return {
          ...ex,
          rpeTarget: Math.min(10, (ex.rpeTarget || 8) + 0.5),
          notes: `[SETTIMANA 3 · INTENSIFICAZIONE] Reclutamento UM massimo. Spingere al limite del buffer (RIR 1-0.5).`
        };
      }

      if (targetWeek === 2) {
        return {
          ...ex,
          notes: `[SETTIMANA 2 · ACCUMULO] Micro-incremento (+1.25/+2.5 kg) mantenendo massima accelerazione CAT.`
        };
      }

      return {
        ...ex,
        notes: `[SETTIMANA 1 · SETUP NEURALE] Focus assoluto su velocità concentrica (CAT) e controllo eccentrico.`
      };
    })
  }));
}