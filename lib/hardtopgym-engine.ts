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

const makeId = () => `hard-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// ============================================================================
// 1. GENERATORE MATRICIALE: FASI THEY x SPLIT (3, 4, 5 PMC, 6 GIORNI)
// ============================================================================
export function generateHardTopGymProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string = 'Cosce/Femorali',
  contestDaysLeft: number = 30
): HardTopGymWorkoutDay[] {

  // --------------------------------------------------------------------------
  // CASO SPECIALE: FASE 5 POST-GARA (Metodo PUMP Total Body They)
  // --------------------------------------------------------------------------

  if (phase === 'PHASE_5_RECOVERY') {
    const recoveryDays: HardTopGymWorkoutDay[] = [
      {
        id: makeId(),
        dayNumber: 1,
        title: 'Post-Gara: Circuito Rigenerante PUMP They (Total Body A)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Manubri Leggeri', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Zero cedimento. Massimo afflusso ematico e decontrattura.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lat Machine Dietro / Avanti Lenta', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Scarico articolare e sfiammatura tendinea.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Extension Leggero', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Wash-out delle scorie metaboliche.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Leg Curl Seduto Leggero', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Circolazione periferica distrettuale.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Post-Gara: Circuito Rigenerante PUMP They (Total Body B)',
        exercises: [
          { id: makeId(), order: 1, name: 'Lento Avanti Manubri Leggeri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Pompaggio blando articolare.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pulley Basso al Cavo', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Rirrorazione ematica schiena.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pushdown Corda + Curl Manubri (Superset)', muscleGroup: 'Braccia', category: 'METABOLIC_GH', sets: 2, reps: '20+20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3', specialTechnique: 'NONE', notes: 'Wash-out braccia.', executionType: 'SUPERSET' }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Post-Gara: PHA Culturistico Rigenerante (Tronco-Gambe)',
        exercises: [
          { id: makeId(), order: 1, name: 'Pressa Orizzontale Leggera', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Metodo PHA: alternanza cuore-periferia contro stasi venosa e ritenzione idrica.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pectoral Machine Lieve', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Richiamo ematico al tronco superiore.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Calf Seduto (Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20-25', rpeTarget: 6.5, restSeconds: 30, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3', specialTechnique: 'NONE', notes: 'Attivazione della pompa surale per il ritorno venoso e linfatico.', executionType: 'REGULAR' }
        ]
      }
    ];

    return recoveryDays;
  }

  // --------------------------------------------------------------------------
  // CASO SPECIALE: FASE 4 PRE-GARA / COUNTDOWN AL D-DAY
  // --------------------------------------------------------------------------
  if (phase === 'PHASE_4_PRE_CONTEST') {
    // A -5 giorni: STOP GAMBE E SOLO POSING ISOMETRICO THEY
    if (contestDaysLeft <= 5) {
      return [
        {
          id: makeId(),
          dayNumber: 1,
          title: 'Pre-Gara D-5 / D-1: Stop Gambe & Posing Isometrico They',
          exercises: [
            { id: makeId(), order: 1, name: 'Posing Isometrico Obbligatorie (Sessione Mattina)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Conduzione del glicogeno intramuscolare senza indurre stress meccanico o infiammazione.', executionType: 'ISOMETRIE' },
            { id: makeId(), order: 2, name: 'Posing Isometrico Obbligatorie (Sessione Pomeriggio)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Controllo del vuoto addominale e separazione striata.', executionType: 'ISOMETRIE' }
          ]
        }
      ];
    }

    // Da -9 a -6 giorni: CARBING DOWN (Svuotamento Glicogeno They ad alta densità)
    if (contestDaysLeft <= 9) {
      return [
        {
          id: makeId(),
          dayNumber: 1,
          title: 'Carbing Down Day 1: Svuotamento Torso (Pompaggio ad Alta Densità)',
          exercises: [
            { id: makeId(), order: 1, name: 'Spinte con Manubri su Panca', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Deplezione totale del glicogeno intramuscolare per attivare la glicogeno-sintetasi.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Pulley al Cavo Presa Larga', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Pause brevissime.', executionType: 'REGULAR' },
            { id: makeId(), order: 3, name: 'Alzate Laterali Manubri Leggeri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Densità vascolare estrema.', executionType: 'REGULAR' }
          ]
        },
        {
          id: makeId(),
          dayNumber: 2,
          title: 'Carbing Down Day 2: Svuotamento Braccia & Complementari',
          exercises: [
            { id: makeId(), order: 1, name: 'Pushdown al Cavo', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Saturazione lattacida senza affanno neurale.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Curl ai Cavi Alti', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Massimo bruciore e capillarizzazione.', executionType: 'REGULAR' }
          ]
        },
        {
          id: makeId(),
          dayNumber: 3,
          title: 'Carbing Down Day 3: Svuotamento Gambe Lieve & Polpacci',
          exercises: [
            { id: makeId(), order: 1, name: 'Leg Extension Continuo', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 4, reps: '25', rpeTarget: 9, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Pesi leggeri, esaurimento glicogeno.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 4, reps: '25', rpeTarget: 9, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Nessun danno connettivale profondo.', executionType: 'REGULAR' }
          ]
        }
      ];
    }
  }

  // --------------------------------------------------------------------------
  // MATRICE METODOLOGICA PER FASE 1, FASE 2, FASE 3 E FASE 4 (>10 gg)
  // --------------------------------------------------------------------------

  // Definiamo i parametri in funzione della Fase:
  const isPhase1 = phase === 'PHASE_1_BASE';
  const isPhase2 = phase === 'PHASE_2_ADVANCED';
  const isPhase3 = phase === 'PHASE_3_DEEP_SHOCK';
  const isPhase4 = phase === 'PHASE_4_PRE_CONTEST';

  // Helper per configurare esercizio in base alla Fase attiva:
  const getExerciseConfig = (
    type: 'NEURAL_BASE' | 'MECHANICAL' | 'METABOLIC_ISOTENSIVE' | 'POF_ACCORCIAMENTO',
    defaultName: string,
    muscle: string
  ): {
    sets: number;
    reps: string;
    rpeTarget: number;
    restSeconds: number;
    tut: string;
    effortBuffer: string;
    specialTechnique: SpecialTechnique;
    notes: string;
    executionType: string;
  } => {
    // --- FASE 1: BASE (Bulk / CAT puro / Carichi alti / Buffer neurale) ---
    if (isPhase1) {
      if (type === 'NEURAL_BASE') {
        return {
          sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2-3 (Buffer)', specialTechnique: 'NONE', notes: 'Fase 1 Bosco: Massima accelerazione concentrica. Picco di Testosterone.', executionType: 'REGULAR'
        };
      }
      if (type === 'MECHANICAL') {
        return {
          sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Spinta pesante controllata in CAT. Zero cedimento.', executionType: 'REGULAR'
        };
      }
      // Nei metabolici in Fase 1 manteniamo 8-10 reps solide
      return {
        sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Complementare strutturale pesante.', executionType: 'REGULAR'
      };
    }

    // --- FASE 2: PREPARAZIONE AVANZATA (They Antagonisti / Cascata Bosco) ---
    if (isPhase2) {
      if (type === 'NEURAL_BASE') {
        return {
          sets: 4, reps: '5-6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5-2', specialTechnique: 'NONE', notes: 'Fase 1 Neurale Bosco: Stimolo Testosterone e reclutamento IIb.', executionType: 'REGULAR'
        };
      }
      if (type === 'MECHANICAL') {
        return {
          sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Fase 2 Meccanica: Tensione continua per fibre IIa.', executionType: 'REGULAR'
        };
      }
      return {
        sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Fase 3 Metabolica Bosco: Accumulo lattacido e picco di GH.', executionType: 'REGULAR'
      };
    }

    // --- FASE 3: URTO & SBLOCCO (Metodo P.O.F. / Stripping They / Rest-Pause) ---
    if (isPhase3) {
      if (type === 'NEURAL_BASE') {
        return {
          sets: 4, reps: '6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'P.O.F. Mesotonia (Intermedio): Carico submassimale in CAT.', executionType: 'REGULAR'
        };
      }
      if (type === 'MECHANICAL') {
        return {
          sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH', notes: 'P.O.F. Stiramento: Massimo allungamento delle fasce connettivali.', executionType: 'REGULAR'
        };
      }
      // Accorciamento / Isolamento in Fase 3 = STRIPPING O REST-PAUSE
      return {
        sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'P.O.F. Accorciamento: Stripping They con 2 scarichi del 25% a cedimento concentrico.', executionType: 'STRIPPING'
      };
    }

    // --- FASE 4: PRE-GARA (-30 a -10 gg) (Separazione striata / Superset) ---
    if (type === 'NEURAL_BASE') {
      return {
        sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Preservazione delle fibre IIb ad alta soglia senza logorio neurale.', executionType: 'REGULAR'
      };
    }
    return {
      sets: 3, reps: '12-15', rpeTarget: 9.5, restSeconds: 45, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Dettaglio e separazione muscolare striata.', executionType: 'REGULAR'
    };
  };

  // ==========================================================================
  // SPLIT 3 GIORNI (Spinta / Gambe / Trazione)
  // ==========================================================================
  if (split === '3_DAYS') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: `Giorno 1: Spinta & Torso Superiore (${phase.replace('PHASE_', 'Fase ')})`,
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Panca Piana Bilanciere', 'Petto') },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', ...getExerciseConfig('MECHANICAL', 'Lento Avanti Bilanciere', 'Spalle') },
          { id: makeId(), order: 3, name: 'Croci Manubri Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Croci Manubri Panca 30°', 'Petto') },
          { id: makeId(), order: 4, name: 'Pushdown al Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pushdown al Cavo', 'Tricipiti') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: `Giorno 2: Arti Inferiori & Catena Cinetica (${phase.replace('PHASE_', 'Fase ')})`,
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Squat con Bilanciere', 'Quadricipiti') },
          { id: makeId(), order: 2, name: 'Stacco Gambe Tese Bilanciere', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Stacco Gambe Tese', 'Femorali') },
          { id: makeId(), order: 3, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Leg Extension', 'Quadricipiti') },
          { id: makeId(), order: 4, name: 'Calf in Piedi su Gradino', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Calf in Piedi', 'Polpacci') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: `Giorno 3: Trazione Schiena & Braccia (${phase.replace('PHASE_', 'Fase ')})`,
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Rematore Bilanciere', 'Dorso') },
          { id: makeId(), order: 2, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Trazioni', 'Dorso') },
          { id: makeId(), order: 3, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pulley Basso', 'Dorso') },
          { id: makeId(), order: 4, name: 'Curl Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Curl Bilanciere EZ', 'Bicipiti') }
        ]
      }
    ];
  }

  // ==========================================================================
  // SPLIT 4 GIORNI (Standard Antagonisti Emilio They)
  // ==========================================================================
  if (split === '4_DAYS') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: `Giorno 1: Antagonisti They A (Petto - Dorso - Tricipiti)`,
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Panca Piana Bilanciere', 'Petto') },
          { id: makeId(), order: 2, name: 'Rematore Manubrio Singolo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Rematore Manubrio', 'Dorso') },
          { id: makeId(), order: 3, name: 'Croci Manubri su Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Croci 30°', 'Petto') },
          { id: makeId(), order: 4, name: 'Lat Machine Presa Inversa', muscleGroup: 'Dorso', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Lat Machine Inversa', 'Dorso') },
          { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pushdown Corda', 'Tricipiti') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: `Giorno 2: Antagonisti They B (Gambe - Spalle - Bicipiti)`,
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Squat Bilanciere', 'Quadricipiti') },
          { id: makeId(), order: 2, name: 'Lento con Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Lento Manubri', 'Spalle') },
          { id: makeId(), order: 3, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Stacco Rumeno', 'Femorali') },
          { id: makeId(), order: 4, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Alzate Laterali', 'Spalle') },
          { id: makeId(), order: 5, name: 'Curl Panca Scott Bilanciere EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Curl Scott EZ', 'Bicipiti') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: `Giorno 3: Antagonisti They A (Richiamo Torso & P.O.F.)`,
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Bilanciere', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('NEURAL_BASE', 'Panca Inclinata', 'Petto') },
          { id: makeId(), order: 2, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Trazioni Sbarra', 'Dorso') },
          { id: makeId(), order: 3, name: 'Pectoral Machine / Croci ai Cavi', muscleGroup: 'Petto', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pectoral Machine', 'Petto') },
          { id: makeId(), order: 4, name: 'Pullover con Manubrio', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Pullover Manubrio', 'Dorso') },
          { id: makeId(), order: 5, name: 'French Press Cavo Basso', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'French Press Cavo', 'Tricipiti') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: `Giorno 4: Antagonisti They B (Richiamo Gambe & Spalle)`,
        exercises: [
          { id: makeId(), order: 1, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Leg Press 45°', 'Quadricipiti') },
          { id: makeId(), order: 2, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Leg Extension', 'Quadricipiti') },
          { id: makeId(), order: 3, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Leg Curl Sdraiato', 'Femorali') },
          { id: makeId(), order: 4, name: 'Face Pull al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Face Pull', 'Spalle') },
          { id: makeId(), order: 5, name: 'Hammer Curl con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Hammer Curl', 'Bicipiti') }
        ]
      }
    ];
  }

  // ==========================================================================
  // SPLIT 5 GIORNI (Specializzazione PMC Punti Carenti They)
  // ==========================================================================
  if (split === '5_DAYS_PMC') {
    return [
      {
        id: makeId(),
        dayNumber: 1,
        title: `Giorno 1: Specializzazione PMC 1 · ${weakPoint} (Lavoro Meccanico Primario)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Squat con Bilanciere' : 'Panca Piana Bilanciere', muscleGroup: weakPoint, category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Fondamentale Pesante', weakPoint) },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Leg Press 45°' : 'Spinte con Manubri', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Multiarticolare Pesante', weakPoint) },
          { id: makeId(), order: 3, name: weakPoint.includes('Cosce') ? 'Leg Extension' : 'Croci ai Cavi', muscleGroup: weakPoint, category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Isolamento Accorciamento', weakPoint) }
        ]
      },
      {
        id: makeId(),
        dayNumber: 2,
        title: 'Giorno 2: Torso Spinta Mantenimento (Petto & Spalle)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Panca Inclinata', 'Petto') },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Lento Avanti', 'Spalle') },
          { id: makeId(), order: 3, name: 'Alzate Laterali al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Alzate Laterali', 'Spalle') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 3,
        title: 'Giorno 3: Torso Trazione Mantenimento (Dorso & Braccia)',
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Rematore Bilanciere', 'Dorso') },
          { id: makeId(), order: 2, name: 'Lat Machine Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Lat Machine Larga', 'Dorso') },
          { id: makeId(), order: 3, name: 'Curl con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Curl Manubri', 'Bicipiti') }
        ]
      },
      {
        id: makeId(),
        dayNumber: 4,
        title: `Giorno 4: Specializzazione PMC 2 · ${weakPoint} (Allungamento & Tensione)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Stacco Rumeno Bilanciere' : 'Dip alle Parallele', muscleGroup: weakPoint, category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Stacco Rumeno / Dip', weakPoint) },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Leg Curl Seduto' : 'French Press Bilanciere EZ', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Isolamento Stiramento', weakPoint) },
          { id: makeId(), order: 3, name: weakPoint.includes('Cosce') ? 'Calf su Macchina' : 'Pushdown al Cavo', muscleGroup: weakPoint, category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Saturazione', weakPoint) }
        ]
      },
      {
        id: makeId(),
        dayNumber: 5,
        title: `Giorno 5: Saturazione Totale PMC · ${weakPoint} (Super-Pump & Stripping)`,
        exercises: [
          { id: makeId(), order: 1, name: weakPoint.includes('Cosce') ? 'Hack Squat / Sissy Squat' : 'Croci Cavi Incrociati', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Stiramento Continuo', weakPoint) },
          { id: makeId(), order: 2, name: weakPoint.includes('Cosce') ? 'Leg Extension' : 'Pectoral Machine', muscleGroup: weakPoint, category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Stripping Saturazione', weakPoint) },
          { id: makeId(), order: 3, name: 'Crunch Addominali su Panca', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '20', rpeTarget: 9, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Chiusura sessione.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // ==========================================================================
  // SPLIT 6 GIORNI (Monomuscolare Off-Season / Pre-Gara Emilio They)
  // ==========================================================================
  return [
    {
      id: makeId(),
      dayNumber: 1,
      title: `Giorno 1: Spalle Complete & Trapezi (${phase.replace('PHASE_', 'Fase ')})`,
      exercises: [
        { id: makeId(), order: 1, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Lento Avanti Bilanciere', 'Spalle') },
        { id: makeId(), order: 2, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Alzate Laterali', 'Spalle') },
        { id: makeId(), order: 3, name: 'Alzate su Panca Inclinata', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Alzate Inclinata', 'Spalle') },
        { id: makeId(), order: 4, name: 'Face Pull al Cavo Alto', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Face Pull Cavo', 'Spalle') },
        { id: makeId(), order: 5, name: 'Scrollate con Manubri (Shrugs)', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Scrollate Manubri', 'Spalle') }
      ]
    },
    {
      id: makeId(),
      dayNumber: 2,
      title: `Giorno 2: Dorsali & Bassa Schiena (${phase.replace('PHASE_', 'Fase ')})`,
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Stacco da Terra', 'Dorso') },
        { id: makeId(), order: 2, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('NEURAL_BASE', 'Rematore Bilanciere', 'Dorso') },
        { id: makeId(), order: 3, name: 'Trazioni Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Trazioni Larga', 'Dorso') },
        { id: makeId(), order: 4, name: 'Pullover Manubrio Trasversale', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Pullover Manubrio', 'Dorso') },
        { id: makeId(), order: 5, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pulley Basso', 'Dorso') }
      ]
    },
    {
      id: makeId(),
      dayNumber: 3,
      title: `Giorno 3: Quadricipiti a Saturazione (${phase.replace('PHASE_', 'Fase ')})`,
      exercises: [
        { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Squat Bilanciere', 'Quadricipiti') },
        { id: makeId(), order: 2, name: 'Leg Press 45° Pesante', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Leg Press 45°', 'Quadricipiti') },
        { id: makeId(), order: 3, name: 'Hack Squat / Sissy Squat', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Hack Squat', 'Quadricipiti') },
        { id: makeId(), order: 4, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Leg Extension', 'Quadricipiti') }
      ]
    },
    {
      id: makeId(),
      dayNumber: 4,
      title: `Giorno 4: Pettorali & Cassa Toracica (${phase.replace('PHASE_', 'Fase ')})`,
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Panca Piana Bilanciere', 'Petto') },
        { id: makeId(), order: 2, name: 'Panca Inclinata Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Panca Inclinata Manubri', 'Petto') },
        { id: makeId(), order: 3, name: 'Croci su Panca 30° Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Croci 30°', 'Petto') },
        { id: makeId(), order: 4, name: 'Dip alle Parallele', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Dip Parallele', 'Petto') },
        { id: makeId(), order: 5, name: 'Pectoral Machine / Cavi', muscleGroup: 'Petto', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pectoral Machine', 'Petto') }
      ]
    },
    {
      id: makeId(),
      dayNumber: 5,
      title: `Giorno 5: Braccia Push-Pull (Bicipiti & Tricipiti Alternati)`,
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Stretta Bilanciere', muscleGroup: 'Tricipiti', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Panca Stretta', 'Tricipiti') },
        { id: makeId(), order: 2, name: 'Curl Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Curl EZ', 'Bicipiti') },
        { id: makeId(), order: 3, name: 'French Press Bilanciere EZ', muscleGroup: 'Tricipiti', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'French Press EZ', 'Tricipiti') },
        { id: makeId(), order: 4, name: 'Curl Manubri Panca Inclinata', muscleGroup: 'Bicipiti', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Curl Inclinata', 'Bicipiti') },
        { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Pushdown Corda', 'Tricipiti') },
        { id: makeId(), order: 6, name: 'Curl Panca Scott EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Curl Scott', 'Bicipiti') }
      ]
    },
    {
      id: makeId(),
      dayNumber: 6,
      title: `Giorno 6: Femorali & Polpacci (${phase.replace('PHASE_', 'Fase ')})`,
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco Gambe Tese Bilanciere', muscleGroup: 'Femorali', category: 'NEURAL_TESTO', ...getExerciseConfig('NEURAL_BASE', 'Stacco Gambe Tese', 'Femorali') },
        { id: makeId(), order: 2, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getExerciseConfig('MECHANICAL', 'Leg Curl Sdraiato', 'Femorali') },
        { id: makeId(), order: 3, name: 'Leg Curl Seduto con Peak 2"', muscleGroup: 'Femorali', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Leg Curl Seduto', 'Femorali') },
        { id: makeId(), order: 4, name: 'Calf in Piedi su Macchina', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getExerciseConfig('POF_ACCORCIAMENTO', 'Calf in Piedi', 'Polpacci') },
        { id: makeId(), order: 5, name: 'Calf Seduto (Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getExerciseConfig('METABOLIC_ISOTENSIVE', 'Calf Seduto', 'Polpacci') }
      ]
    }
  ];
}

// ============================================================================
// 2. CALCOLO AVANZAMENTO AUTOMATICO DA WORKOUT HISTORY
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
// 3. APPLICAZIONE MODULAZIONE SETTIMANALE SULLA SCHEDA ATTIVA
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