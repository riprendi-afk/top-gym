// lib/hardtopgym-engine.ts
// MOTORE METODOLOGICO HARDTOPGYM (Emilio They + Bosco & Colli)
// Architettura Integrale Unificata (Uomo & Donna)

export type HardTopGymPhase = 
  | 'PHASE_1_BASE'         // Costruzione di Base (4-6 sett.)
  | 'PHASE_2_ADVANCED'     // Preparazione Avanzata (6-8 sett.)
  | 'PHASE_3_DEEP_SHOCK'   // Stimolazione Profonda / Urto / Sblocco (8-10 sett.)
  | 'PHASE_4_PRE_CONTEST'  // Pre-Gara & Contest (-30 gg al D-Day)
  | 'PHASE_5_RECOVERY';    // Post-Gara Recupero (2-4 sett.)

export type HardPhase = HardTopGymPhase;
export type HardSplit = '3_DAYS' | '4_DAYS' | '5_DAYS_PMC' | '6_DAYS_MONO';
export type HardGender = 'MALE' | 'FEMALE';

export type IntraSessionCategory = 
  | 'NEURAL_TESTO'         // Stimolo Neurale CAT (Picco Ormonale / Reclutamento UM)
  | 'MECHANICAL_TENSION'   // Lavoro Pesante Controllato (Fibre veloci)
  | 'METABOLIC_GH';        // Lavoro Metabolico / Isotensivo (GH & Capillarizzazione)

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

const makeId = (p: string = 'hard') => `${p}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// ============================================================================
// ARCHIVIO 1: PROGRAMMAZIONE HARD BODYBUILDING MASCHILE (INTEGRALE EMILIO THEY)
// ============================================================================
function getMenProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string,
  contestDaysLeft: number
): HardTopGymWorkoutDay[] {
  const isBase = phase === 'PHASE_1_BASE';
  const isShock = phase === 'PHASE_3_DEEP_SHOCK';

  // Configurazione dei parametri esecutivi in base alla Fase attiva
  const getConfig = (type: 'NEURAL' | 'MECH' | 'METAB') => {
    if (isBase) {
      if (type === 'NEURAL') return { sets: 5, reps: '4-6', rpeTarget: 8, restSeconds: 180, tut: 'CAT', effortBuffer: 'RIR 2-3 (Buffer)', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Fase 1 Bosco: Massima accelerazione concentrica volontaria. Picco di Testosterone.', executionType: 'REGULAR' };
      if (type === 'MECH') return { sets: 4, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Tensione meccanica pesante in CAT. Zero cedimento.', executionType: 'REGULAR' };
      return { sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Complementare strutturale pesante.', executionType: 'REGULAR' };
    }
    if (isShock) {
      if (type === 'NEURAL') return { sets: 4, reps: '6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA' as SpecialTechnique, notes: 'P.O.F. Mesotonia They: Carico submassimale in CAT.', executionType: 'REGULAR' };
      if (type === 'MECH') return { sets: 3, reps: '8-10', rpeTarget: 9, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1', specialTechnique: 'POF_STRETCH' as SpecialTechnique, notes: 'P.O.F. Stiramento: Massimo allungamento fasciale.', executionType: 'REGULAR' };
      return { sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP' as SpecialTechnique, notes: 'Stripping They: Cedimento a 8 reps e 2 scarichi consecutivi del 25%.', executionType: 'STRIPPING' };
    }
    // Fase 2: Avanzata
    if (type === 'NEURAL') return { sets: 4, reps: '5-6', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Neurale Bosco: Preservazione del Testosterone.', executionType: 'REGULAR' };
    if (type === 'MECH') return { sets: 4, reps: '6-8', rpeTarget: 8.5, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Tensione meccanica continua.', executionType: 'REGULAR' };
    return { sets: 3, reps: '10-12', rpeTarget: 9.5, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE' as SpecialTechnique, notes: 'Metabolico Bosco: Accumulo lattacido e picco di GH.', executionType: 'REGULAR' };
  };

  // FASE 5: POST-GARA MASCHILE
  if (phase === 'PHASE_5_RECOVERY') {
    return [
      {
        id: makeId('m-rec1'), dayNumber: 1, title: 'Post-Gara: PUMP They Rigenerante (Total Body A)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Manubri Leggeri', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Zero cedimento. Massimo afflusso ematico e decontrattura.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lat Machine Lenta Avanti', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Scarico articolare e sfiammatura tendinea.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Leg Extension Leggero', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Wash-out delle scorie metaboliche.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('m-rec2'), dayNumber: 2, title: 'Post-Gara: PUMP They Rigenerante (Total Body B)',
        exercises: [
          { id: makeId(), order: 1, name: 'Lento Avanti Manubri Leggeri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Pompaggio blando articolare.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pulley Basso al Cavo', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 2, reps: '15-20', rpeTarget: 6, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3-4', specialTechnique: 'NONE', notes: 'Rirrorazione ematica schiena.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pushdown Corda + Curl Manubri', muscleGroup: 'Braccia', category: 'METABOLIC_GH', sets: 2, reps: '20+20', rpeTarget: 6.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3', specialTechnique: 'NONE', notes: 'Wash-out braccia.', executionType: 'SUPERSET' }
        ]
      },
      {
        id: makeId('m-rec3'), dayNumber: 3, title: 'Post-Gara: PHA Culturistico Rigenerante (Tronco-Gambe)',
        exercises: [
          { id: makeId(), order: 1, name: 'Pressa Orizzontale Leggera', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Metodo PHA: alternanza cuore-periferia contro stasi venosa.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pectoral Machine Lieve', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 2, reps: '20', rpeTarget: 6, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 4', specialTechnique: 'NONE', notes: 'Richiamo ematico al tronco superiore.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Calf Seduto (Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20-25', rpeTarget: 6.5, restSeconds: 30, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 3', specialTechnique: 'NONE', notes: 'Attivazione della pompa surale per il ritorno venoso.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // FASE 4: PRE-GARA MASCHILE (-30 a -1 gg)
  if (phase === 'PHASE_4_PRE_CONTEST') {
    if (contestDaysLeft <= 5) {
      return [
        {
          id: makeId('m-d5'), dayNumber: 1, title: 'Pre-Gara D-5 / D-1: Stop Gambe & Posing Isometrico They',
          exercises: [
            { id: makeId(), order: 1, name: 'Posing Isometrico Obbligatorie (Mattina)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Conduzione del glicogeno senza edema infiammatorio.', executionType: 'ISOMETRIE' },
            { id: makeId(), order: 2, name: 'Posing Isometrico Obbligatorie (Pomeriggio)', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0', specialTechnique: 'NONE', notes: 'Separazione striata e vuoto addominale.', executionType: 'ISOMETRIE' }
          ]
        }
      ];
    }
    if (contestDaysLeft <= 9) {
      return [
        {
          id: makeId('m-d9-1'), dayNumber: 1, title: 'Carbing Down: Svuotamento Torso (Pompaggio ad Alta Densità)',
          exercises: [
            { id: makeId(), order: 1, name: 'Spinte con Manubri su Panca', muscleGroup: 'Petto', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Deplezione totale glicogeno intramuscolare.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Pulley al Cavo Presa Larga', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Attivazione glicogeno-sintetasi.', executionType: 'REGULAR' },
            { id: makeId(), order: 3, name: 'Alzate Laterali Manubri Leggeri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '20-25', rpeTarget: 9.5, restSeconds: 30, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Densità vascolare estrema.', executionType: 'REGULAR' }
          ]
        },
        {
          id: makeId('m-d9-2'), dayNumber: 2, title: 'Carbing Down: Svuotamento Braccia & Complementari',
          exercises: [
            { id: makeId(), order: 1, name: 'Pushdown al Cavo', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Pause brevissime.', executionType: 'REGULAR' },
            { id: makeId(), order: 2, name: 'Curl ai Cavi Alti', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 5, reps: '20-25', rpeTarget: 9.5, restSeconds: 25, tut: '2-0-1-0', effortBuffer: 'RIR 0.5', specialTechnique: 'NONE', notes: 'Massimo bruciore e capillarizzazione.', executionType: 'REGULAR' }
          ]
        }
      ];
    }
  }

  // --- SPLIT 3 GIORNI UOMO ---
  if (split === '3_DAYS') {
    return [
      {
        id: makeId('m-3d1'), dayNumber: 1, title: 'Giorno 1: Spinta Neurale CAT (Petto - Spalle - Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Dip alle Parallele zavorrate', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-3d2'), dayNumber: 2, title: 'Giorno 2: Gambe Complete & Catena Posteriore',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Stacco Gambe Tese Bilanciere', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: 'Calf in Piedi su Gradino', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-3d3'), dayNumber: 3, title: 'Giorno 3: Trazione Schiena & Bicipiti',
        exercises: [
          { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: 'Curl Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      }
    ];
  }

  // --- SPLIT 4 GIORNI UOMO (Antagonisti Emilio They) ---
  if (split === '4_DAYS') {
    return [
      {
        id: makeId('m-4d1'), dayNumber: 1, title: 'Giorno 1: Antagonisti They A (Petto - Dorso - Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Piana Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Rematore Manubrio Singolo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Croci Manubri su Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: 'Lat Machine Presa Inversa', muscleGroup: 'Dorso', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-4d2'), dayNumber: 2, title: 'Giorno 2: Antagonisti They B (Gambe - Spalle - Bicipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Lento con Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 5, name: 'Curl Panca Scott Bilanciere EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-4d3'), dayNumber: 3, title: 'Giorno 3: Antagonisti They A (Richiamo Torso & P.O.F.)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Bilanciere', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: 'Trazioni alla Sbarra / Lat Machine', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: 'Pectoral Machine / Cavi', muscleGroup: 'Petto', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 4, name: 'Pullover con Manubrio', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 5, name: 'French Press Cavo Basso', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-4d4'), dayNumber: 4, title: 'Giorno 4: Antagonisti They B (Richiamo Gambe & Spalle)',
        exercises: [
          { id: makeId(), order: 1, name: 'Leg Press 45°', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 2, name: 'Leg Extension', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 3, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 4, name: 'Face Pull al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 5, name: 'Hammer Curl con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      }
    ];
  }

  // --- SPLIT 5 GIORNI UOMO (Specializzazione PMC Punti Carenti Integrale) ---
  if (split === '5_DAYS_PMC') {
    const isPettorali = weakPoint.includes('Pettorali');
    const isDorso = weakPoint.includes('Dorso');
    const isDeltoidi = weakPoint.includes('Deltoidi');
    const isBraccia = weakPoint.includes('Braccia');
    const isPolpacci = weakPoint.includes('Polpacci');

    return [
      {
        id: makeId('m-5d1'),
        dayNumber: 1,
        title: `Giorno 1: PMC Specializzazione 1 · ${weakPoint} (Lavoro Neurale & Meccanico Pesante)`,
        exercises: [
          { id: makeId(), order: 1, name: isPettorali ? 'Panca Piana Bilanciere' : isDorso ? 'Stacco da Terra' : isDeltoidi ? 'Lento Avanti Bilanciere' : isBraccia ? 'Panca Stretta Bilanciere' : isPolpacci ? 'Stacco Gambe Tese Bilanciere' : 'Squat con Bilanciere', muscleGroup: weakPoint, category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: isPettorali ? 'Panca Inclinata Manubri' : isDorso ? 'Rematore Bilanciere 45°' : isDeltoidi ? 'Lento con Manubri' : isBraccia ? 'Curl Bilanciere Sagomato EZ' : isPolpacci ? 'Leg Curl Sdraiato' : 'Leg Press 45°', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: isPettorali ? 'Croci Panca 30° Manubri' : isDorso ? 'Trazioni Presa Neutra' : isDeltoidi ? 'Alzate Laterali Manubri' : isBraccia ? 'French Press Bilanciere EZ' : isPolpacci ? 'Calf in Piedi su Macchina' : 'Hack Squat / Sissy Squat', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 4, name: isPettorali ? 'Pectoral Machine con Peak 2"' : isDorso ? 'Pulley al Cavo Basso' : isDeltoidi ? 'Face Pull Cavo Alto' : isBraccia ? 'Pushdown al Cavo con Corda' : isPolpacci ? 'Calf Seduto (Soleo)' : 'Leg Extension con Peak 2"', muscleGroup: weakPoint, category: 'METABOLIC_GH', ...getConfig('METAB') }
        ]
      },
      {
        id: makeId('m-5d2'),
        dayNumber: 2,
        title: 'Giorno 2: Torso Spinta Mantenimento (Petto, Spalle & Tricipiti)',
        exercises: [
          { id: makeId(), order: 1, name: 'Panca Inclinata Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Volume di mantenimento controllato.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 120, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'CAT rapido.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Dip alle Parallele', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Tensione meccanica.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Alzate Laterali al Cavo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Isolamento deltoide laterale.', executionType: 'REGULAR' },
          { id: makeId(), order: 5, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tricipiti in tenuta.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('m-5d3'),
        dayNumber: 3,
        title: 'Giorno 3: Torso Trazione Mantenimento (Dorso & Braccia)',
        exercises: [
          { id: makeId(), order: 1, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', sets: 3, reps: '6-8', rpeTarget: 8, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Schiena bloccata, tirata fluida.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Lat Machine Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Allungamento completo del gran dorsale.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8.5, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spessore schiena.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Curl Alternato con Manubri', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Bicipiti in mantenimento.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('m-5d4'),
        dayNumber: 4,
        title: `Giorno 4: PMC Specializzazione 2 · ${weakPoint} (P.O.F. Stiramento & Densità)`,
        exercises: [
          { id: makeId(), order: 1, name: isPettorali ? 'Spinte Manubri su Panca Inclinata' : isDorso ? 'Trazioni alla Sbarra zavorrate' : isDeltoidi ? 'Lento con Manubri da Seduto' : isBraccia ? 'Curl Manubri Panca Inclinata' : isPolpacci ? 'Stacco Rumeno con Manubri' : 'Stacco Rumeno Bilanciere', muscleGroup: weakPoint, category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
          { id: makeId(), order: 2, name: isPettorali ? 'Dip alle Parallele zavorrate' : isDorso ? 'Pullover Manubrio Trasversale' : isDeltoidi ? 'Alzate Laterali su Panca Inclinata' : isBraccia ? 'French Press Bilanciere EZ' : isPolpacci ? 'Leg Curl Seduto con Peak 2"' : 'Leg Press 45° Piedi Alti', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 3, name: isPettorali ? 'Croci ai Cavi dall\'Alto' : isDorso ? 'Lat Machine Presa Inversa' : isDeltoidi ? 'Tirate al Mento ai Cavi' : isBraccia ? 'Curl Panca Scott Bilanciere EZ' : isPolpacci ? 'Calf in Piedi su Gradino' : 'Leg Curl Sdraiato', muscleGroup: weakPoint, category: 'METABOLIC_GH', ...getConfig('METAB') },
          { id: makeId(), order: 4, name: 'Calf su Macchina / Addome', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 4, reps: '15-20', rpeTarget: 8.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Saturazione muscolare.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('m-5d5'),
        dayNumber: 5,
        title: `Giorno 5: PMC Specializzazione 3 · ${weakPoint} (Saturazione Super-Pump & Stripping They)`,
        exercises: [
          { id: makeId(), order: 1, name: isPettorali ? 'Croci Cavi Panca Piana' : isDorso ? 'Pulley Presa Stretta' : isDeltoidi ? 'Alzate Frontali con Disco' : isBraccia ? 'Curl Cavi Alti Push-Pull' : isPolpacci ? 'Leg Extension Leggero' : 'Hack Squat / Sissy Squat', muscleGroup: weakPoint, category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
          { id: makeId(), order: 2, name: isPettorali ? 'Pectoral Machine Stripping' : isDorso ? 'Lat Machine Stripping' : isDeltoidi ? 'Alzate Laterali Stripping' : isBraccia ? 'Pushdown Corda Stripping' : isPolpacci ? 'Calf Seduto Stripping' : 'Leg Extension Stripping', muscleGroup: weakPoint, category: 'METABOLIC_GH', sets: 3, reps: '8+8+8 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping They: Cedimento a 8 reps e 2 scarichi consecutivi senza sosta.', executionType: 'STRIPPING' },
          { id: makeId(), order: 3, name: 'Crunch Addominali su Panca Inclinata', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '20', rpeTarget: 9, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Chiusura ciclo settimanale.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --- SPLIT 6 GIORNI UOMO (Monomuscolare They Integrale: 5-6 Esercizi a Seduta) ---
  return [
    {
      id: makeId('m-6d1'), dayNumber: 1, title: 'Giorno 1: Spalle Complete & Trapezi (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Lento Avanti Bilanciere', muscleGroup: 'Spalle', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 3, name: 'Alzate Laterali su Panca Inclinata', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 4, name: 'Face Pull al Cavo Alto', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getConfig('METAB') },
        { id: makeId(), order: 5, name: 'Scrollate con Manubri (Shrugs)', muscleGroup: 'Spalle', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    },
    {
      id: makeId('m-6d2'), dayNumber: 2, title: 'Giorno 2: Dorsali & Bassa Schiena (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco da Terra Regolare', muscleGroup: 'Dorso', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Rematore Bilanciere 45°', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('NEURAL') },
        { id: makeId(), order: 3, name: 'Trazioni alla Sbarra Presa Larga', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 4, name: 'Pullover con Manubrio Trasversale', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 5, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    },
    {
      id: makeId('m-6d3'), dayNumber: 3, title: 'Giorno 3: Quadricipiti a Saturazione (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Squat con Bilanciere', muscleGroup: 'Quadricipiti', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Leg Press 45° Pesante', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 3, name: 'Hack Squat / Sissy Squat', muscleGroup: 'Quadricipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 4, name: 'Leg Extension con Peak Contraction', muscleGroup: 'Quadricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    },
    {
      id: makeId('m-6d4'), dayNumber: 4, title: 'Giorno 4: Pettorali & Cassa Toracica (Monomuscolare They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Piana con Bilanciere', muscleGroup: 'Petto', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Panca Inclinata con Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 3, name: 'Croci su Panca 30° Manubri', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 4, name: 'Dip alle Parallele', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 5, name: 'Pectoral Machine / Cavi Incrociati', muscleGroup: 'Petto', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    },
    {
      id: makeId('m-6d5'), dayNumber: 5, title: 'Giorno 5: Braccia Push-Pull (Bicipiti & Tricipiti Alternati)',
      exercises: [
        { id: makeId(), order: 1, name: 'Panca Stretta Bilanciere', muscleGroup: 'Tricipiti', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Curl con Bilanciere Sagomato EZ', muscleGroup: 'Bicipiti', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 3, name: 'French Press Bilanciere EZ', muscleGroup: 'Tricipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 4, name: 'Curl Manubri su Panca Inclinata', muscleGroup: 'Bicipiti', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 5, name: 'Pushdown al Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', ...getConfig('METAB') },
        { id: makeId(), order: 6, name: 'Curl su Panca Scott EZ', muscleGroup: 'Bicipiti', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    },
    {
      id: makeId('m-6d6'), dayNumber: 6, title: 'Giorno 6: Femorali & Polpacci (Catena Posteriore They)',
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco Gambe Tese con Bilanciere', muscleGroup: 'Femorali', category: 'NEURAL_TESTO', ...getConfig('NEURAL') },
        { id: makeId(), order: 2, name: 'Leg Curl Sdraiato', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', ...getConfig('MECH') },
        { id: makeId(), order: 3, name: 'Leg Curl Seduto con Peak Contraction', muscleGroup: 'Femorali', category: 'METABOLIC_GH', ...getConfig('METAB') },
        { id: makeId(), order: 4, name: 'Calf in Piedi su Macchina', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getConfig('METAB') },
        { id: makeId(), order: 5, name: 'Calf Seduto (Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', ...getConfig('METAB') }
      ]
    }
  ];
}

// ============================================================================
// ARCHIVIO 2: PROGRAMMAZIONE HARD BODYBUILDING FEMMINILE (GLUTEI P.O.F. & PHA)
// ============================================================================
function getWomenProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string,
  contestDaysLeft: number
): HardTopGymWorkoutDay[] {
  const isBase = phase === 'PHASE_1_BASE';
  const isShock = phase === 'PHASE_3_DEEP_SHOCK';

  // --- SPLIT 3 GIORNI DONNA ---
  if (split === '3_DAYS') {
    return [
      {
        id: makeId('w-3d1'), dayNumber: 1, title: 'Giorno 1: Glutei P.O.F. & Catena Posteriore CAT',
        exercises: [
          { id: makeId(), order: 1, name: 'Hip Thrust con Bilanciere', muscleGroup: 'Glutei', category: 'NEURAL_TESTO', sets: isBase ? 5 : 4, reps: isBase ? '6-8' : '8-10', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'P.O.F. Mesotonia They: Spinta esplosiva dai talloni e fermo 1" in alto.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'POF_STRETCH', notes: 'P.O.F. Stiramento: Massimo allungamento eccentrico dei femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: isShock ? 'Glute Kickback al Cavo Stripping' : 'Glute Kickback al Cavo', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 3, reps: isShock ? '10+10+10 STRIPPING' : '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: isShock ? 'RIR 0' : 'RIR 0.5', specialTechnique: isShock ? 'STRIPPING_3_DROP' : 'POF_PEAK', notes: 'P.O.F. Accorciamento: Stop 2" in massima contrazione.', executionType: isShock ? 'STRIPPING' : 'REGULAR' },
          { id: makeId(), order: 4, name: 'Calf Seduto (Pompa Venosa Soleo)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20', rpeTarget: 7, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Attivazione della pompa surale per drenare i liquidi.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-3d2'), dayNumber: 2, title: 'Giorno 2: PHA Torso & V-Shape (Drenaggio Linfatico & Vita Stretta)',
        exercises: [
          { id: makeId(), order: 1, name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'V-Taper They per valorizzare e restringere visivamente il punto vita.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Spinte Manubri su Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Tonificazione della porzione alta del busto.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Deltoidi rotondi, fermo 1" a parallelo, zero coinvolgimento del trapezio.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Crunch con Fermo Isometrico', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 3, reps: '15-20', rpeTarget: 8.5, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Controllo della parete addominale.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-3d3'), dayNumber: 3, title: 'Giorno 3: Glutei Accorciamento, Basso Lattato & PHA',
        exercises: [
          { id: makeId(), order: 1, name: 'Affondi Bulgari con Manubri (Busto Flesso)', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Busto inclinato a 45° per isolare il grande gluteo.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pulley al Cavo Presa Stretta (Alternanza PHA)', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 60, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Metodo PHA: richiamo ematico al tronco per evitare ristagni agli arti inferiori.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Abductor Machine a 45°', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 4, reps: isShock ? '10+10+10 STRIPPING' : '15-20', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: isShock ? 'STRIPPING_3_DROP' : 'POF_PEAK', notes: 'Medio gluteo: fermo 2" in massima abduzione.', executionType: isShock ? 'STRIPPING' : 'REGULAR' },
          { id: makeId(), order: 4, name: 'Leg Curl Seduto Leggero', muscleGroup: 'Femorali', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 8, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Pompaggio capillare senza stress infiammatorio.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --- SPLIT 4 GIORNI DONNA ---
  if (split === '4_DAYS') {
    return [
      {
        id: makeId('w-4d1'), dayNumber: 1, title: 'Giorno 1: Lower A · Glutei Pesanti CAT & Catena Posteriore',
        exercises: [
          { id: makeId(), order: 1, name: 'Hip Thrust con Bilanciere Pesante', muscleGroup: 'Glutei', category: 'NEURAL_TESTO', sets: 5, reps: isBase ? '6-8' : '8-10', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Mesotonia P.O.F.: Massima estensione dell\'anca e spinta esplosiva.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Stacco Rumeno con Bilanciere', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento profondo dei bicipiti femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Glute Kickback al Cavo Basso', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 3, reps: isShock ? '8+8+8 STRIPPING' : '12-15', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: isShock ? 'STRIPPING_3_DROP' : 'POF_PEAK', notes: 'Fermo statico 2" in accorciamento.', executionType: isShock ? 'STRIPPING' : 'REGULAR' },
          { id: makeId(), order: 4, name: 'Calf in Piedi su Macchina', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '15-20', rpeTarget: 8, restSeconds: 45, tut: '2-2-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Attivazione pompa venosa contro ristagno ematico.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-4d2'), dayNumber: 2, title: 'Giorno 2: Upper A · Dorso & Deltoidi Laterali (Focus Clessidra)',
        exercises: [
          { id: makeId(), order: 1, name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Apertura dorsale per restringere otticamente la vita.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Rematore con Manubrio Singolo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Trazione pulita all\'anca.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Alzate Laterali con Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Spalle rotonde, fermo 1" a parallelo.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tono posteriore del braccio.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-4d3'), dayNumber: 3, title: 'Giorno 3: Lower B · Glutei P.O.F. Stiramento & PHA Dinamico',
        exercises: [
          { id: makeId(), order: 1, name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Busto inclinato a 45° per isolamento del gluteo.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Leg Press 45° Piedi Alti e Larghi', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '10-12', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Enfasi sul distretto gluteo/femorale, spinta con talloni.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Abductor Machine Busto Avanti', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 4, reps: isShock ? '10+10+10 STRIPPING' : '15-20', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: isShock ? 'STRIPPING_3_DROP' : 'POF_PEAK', notes: 'Medio gluteo a saturazione con fermo 2".', executionType: isShock ? 'STRIPPING' : 'REGULAR' },
          { id: makeId(), order: 4, name: 'Calf Seduto (Pompa Venosa)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20', rpeTarget: 7, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Drenaggio dei liquidi ristagnanti.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-4d4'), dayNumber: 4, title: 'Giorno 4: Upper B & PHA Rigenerante (Spalle - Petto - Addome)',
        exercises: [
          { id: makeId(), order: 1, name: 'Spinte con Manubri Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Tono pettorale alto.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Adduzione scapolare e postura eretta.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Alzate Laterali al Cavo Singolo', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tensione continua sul deltoide.', executionType: 'REGULAR' },
          { id: makeId(), order: 4, name: 'Crunch a Terra con Espirazione Forzata', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '20', rpeTarget: 8.5, restSeconds: 45, tut: '2-1-1-0', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Svuotamento addominale.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --- SPLIT 5 GIORNI DONNA (PMC Glutei 3x Settimana) ---
  if (split === '5_DAYS_PMC') {
    return [
      {
        id: makeId('w-5d1'), dayNumber: 1, title: 'Giorno 1: PMC Glutei 1 · Lavoro Neurale Pesante CAT (Hip Thrust & RDL)',
        exercises: [
          { id: makeId(), order: 1, name: 'Hip Thrust con Bilanciere Pesante', muscleGroup: 'Glutei', category: 'NEURAL_TESTO', sets: 5, reps: '6-8', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'PMC Priorità: Massima spinta CAT dai talloni.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Stiramento dei flessori femorali.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Glute Kickback al Cavo', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Fermo 2" in massima contrazione.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-5d2'), dayNumber: 2, title: 'Giorno 2: Upper Armonico & V-Taper (Dorso & Deltoidi)',
        exercises: [
          { id: makeId(), order: 1, name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Ampiezza per armonizzare i fianchi.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Deltoidi laterali tondeggianti.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Pushdown Cavo con Corda', muscleGroup: 'Tricipiti', category: 'METABOLIC_GH', sets: 3, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Tono posteriore.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-5d3'), dayNumber: 3, title: 'Giorno 3: PMC Glutei 2 · Stiramento Unilaterale & Pompa Linfatica',
        exercises: [
          { id: makeId(), order: 1, name: 'Affondi Bulgari con Manubri (Busto Flesso)', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Massimo allungamento sotto carico.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Abductor Machine a 45°', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 4, reps: '15-20', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Peak contraction 2" sul medio gluteo.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Calf Seduto (Pompa Venosa)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20', rpeTarget: 7, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Attivazione soleo per favorire il ritorno linfatico.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-5d4'), dayNumber: 4, title: 'Giorno 4: Upper PHA & Addome (Spinte & Rematore)',
        exercises: [
          { id: makeId(), order: 1, name: 'Spinte con Manubri su Panca 30°', muscleGroup: 'Petto', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-0-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Tono pettorale alto.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Pulley Basso al Cavo', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 3, reps: '10-12', rpeTarget: 8, restSeconds: 75, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Dorso e postura.', executionType: 'REGULAR' },
          { id: makeId(), order: 3, name: 'Plank Isometrico Addominale', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 3, reps: '45" Tenuta', rpeTarget: 8.5, restSeconds: 45, tut: 'Isometria', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Stabilità del corsetto addominale.', executionType: 'REGULAR' }
        ]
      },
      {
        id: makeId('w-5d5'), dayNumber: 5, title: 'Giorno 5: PMC Glutei 3 · Saturazione Super-Pump & Stripping They',
        exercises: [
          { id: makeId(), order: 1, name: 'Ponte Glutei a Terra con Manubrio Pesante', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 75, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_MESOTONIA', notes: 'Fermo 2" in alto a ogni rep.', executionType: 'REGULAR' },
          { id: makeId(), order: 2, name: 'Abductor Machine Stripping', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 3, reps: '10+10+10 STRIPPING', rpeTarget: 10, restSeconds: 90, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0 (Cedimento)', specialTechnique: 'STRIPPING_3_DROP', notes: 'Stripping They: esaurimento e 2 scarichi consecutivi senza sosta.', executionType: 'STRIPPING' },
          { id: makeId(), order: 3, name: 'Calf in Piedi su Gradino', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 3, reps: '20', rpeTarget: 7, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Scarico venoso a fine ciclo settimanale.', executionType: 'REGULAR' }
        ]
      }
    ];
  }

  // --- SPLIT 6 GIORNI DONNA (Bikini / Contest Emilio They) ---
  return [
    {
      id: makeId('w-6d1'), dayNumber: 1, title: 'Giorno 1: Glutei Mesotonia & CAT (Hip Thrust)',
      exercises: [
        { id: makeId(), order: 1, name: 'Hip Thrust con Bilanciere Pesante', muscleGroup: 'Glutei', category: 'NEURAL_TESTO', sets: 5, reps: '6-8', rpeTarget: 8.5, restSeconds: 150, tut: 'CAT', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_MESOTONIA', notes: 'Spinta CAT con fermo 1" in alto.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Glute Kickback al Cavo', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Isolamento e peak contraction.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId('w-6d2'), dayNumber: 2, title: 'Giorno 2: Spalle Rotonde & Deltoidi Laterali',
      exercises: [
        { id: makeId(), order: 1, name: 'Alzate Laterali Manubri', muscleGroup: 'Spalle', category: 'MECHANICAL_TENSION', sets: 4, reps: '10-12', rpeTarget: 8.5, restSeconds: 60, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Fermo 1" a parallelo.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Face Pull al Cavo Alto', muscleGroup: 'Spalle', category: 'METABOLIC_GH', sets: 4, reps: '12-15', rpeTarget: 9, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 1', specialTechnique: 'POF_PEAK', notes: 'Deltoidi posteriori per postura eretta.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId('w-6d3'), dayNumber: 3, title: 'Giorno 3: Glutei Stiramento & Ischiocrurali',
      exercises: [
        { id: makeId(), order: 1, name: 'Stacco Rumeno con Manubri', muscleGroup: 'Femorali', category: 'NEURAL_TESTO', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 120, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Allungamento profondo catena posteriore.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Affondi Bulgari con Manubri', muscleGroup: 'Glutei', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8.5, restSeconds: 90, tut: '3-0-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'POF_STRETCH', notes: 'Busto inclinato a 45°.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId('w-6d4'), dayNumber: 4, title: 'Giorno 4: Schiena V-Taper & Punto Vita',
      exercises: [
        { id: makeId(), order: 1, name: 'Lat Machine Presa Neutra', muscleGroup: 'Dorso', category: 'MECHANICAL_TENSION', sets: 4, reps: '8-10', rpeTarget: 8, restSeconds: 90, tut: '2-1-1-0', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Adduzione scapolare decisa.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Pulley al Cavo Basso', muscleGroup: 'Dorso', category: 'METABOLIC_GH', sets: 3, reps: '10-12', rpeTarget: 8.5, restSeconds: 60, tut: '2-1-1-0', effortBuffer: 'RIR 1.5', specialTechnique: 'NONE', notes: 'Spessore e postura aperta.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId('w-6d5'), dayNumber: 5, title: 'Giorno 5: Glutei Accorciamento & Pompa Linfatica',
      exercises: [
        { id: makeId(), order: 1, name: 'Abductor Machine a 45°', muscleGroup: 'Glutei', category: 'METABOLIC_GH', sets: 4, reps: '15-20', rpeTarget: 9.5, restSeconds: 60, tut: 'PEAK_CONTRACTION', effortBuffer: 'RIR 0.5', specialTechnique: 'POF_PEAK', notes: 'Fermo 2" in massima abduzione.', executionType: 'REGULAR' },
        { id: makeId(), order: 2, name: 'Calf Seduto (Pompa Venosa)', muscleGroup: 'Polpacci', category: 'METABOLIC_GH', sets: 4, reps: '20', rpeTarget: 7, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 2', specialTechnique: 'NONE', notes: 'Drenaggio gambe.', executionType: 'REGULAR' }
      ]
    },
    {
      id: makeId('w-6d6'), dayNumber: 6, title: 'Giorno 6: Addome, Posing & PHA Culturistico',
      exercises: [
        { id: makeId(), order: 1, name: 'Posing Isometrico Linee They', muscleGroup: 'Addome', category: 'METABOLIC_GH', sets: 4, reps: '30" Tenuta', rpeTarget: 8.5, restSeconds: 60, tut: 'Isometria', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Controllo del vuoto addominale e separazione striata.', executionType: 'ISOMETRIE' },
        { id: makeId(), order: 2, name: 'Pushdown al Cavo + Alzate Laterali (Superset)', muscleGroup: 'Braccia', category: 'METABOLIC_GH', sets: 3, reps: '15+15', rpeTarget: 8.5, restSeconds: 45, tut: 'ISOTENSIVE_SLOW', effortBuffer: 'RIR 1', specialTechnique: 'NONE', notes: 'Wash-out braccia.', executionType: 'SUPERSET' }
      ]
    }
  ];
}

// ============================================================================
// ROUTER PRINCIPALE DI GENERAZIONE
// ============================================================================
export function generateHardTopGymProgram(
  phase: HardTopGymPhase,
  split: HardSplit,
  weakPoint: string = 'Cosce (Quadricipiti & Catena Posteriore)',
  contestDaysLeft: number = 30,
  gender: HardGender = 'MALE'
): HardTopGymWorkoutDay[] {
  if (gender === 'FEMALE') {
    return getWomenProgram(phase, split, weakPoint, contestDaysLeft);
  }
  return getMenProgram(phase, split, weakPoint, contestDaysLeft);
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
// APPLICAZIONE MODULAZIONE SETTIMANALE SULLA SCHEDA ATTIVA (ANCHE SU ESERCIZI CUSTOM)
// ============================================================================
export function applyHardTopGymWeekProgression(
  days: any[],
  targetWeek: number
): any[] {
  return days.map(day => ({
    ...day,
    exercises: (day.exercises || []).map((ex: any, idx: number) => {
      // 1. Preserviamo eventuali note personalizzate scritte a mano dal Coach
      const cleanCustomNotes = (ex.notes || '')
        .replace(/\[SETTIMANA \d.*?\]\s*/g, '')
        .trim();

      // 2. Inquadriamo l'esercizio nella sequenza ormonale Bosco-Colli
      // Se l'hai aggiunto tu e non ha categoria, la deduce dalla posizione
      const category: IntraSessionCategory = ex.category || (
        idx === 0 ? 'NEURAL_TESTO' : 
        idx === (day.exercises.length - 1) ? 'METABOLIC_GH' : 
        'MECHANICAL_TENSION'
      );

      // SETTIMANA 4: SCARICO ATTIVO (DELOAD)
      if (targetWeek === 4) {
        const deloadNote = `[SETTIMANA 4 · SCARICO ATTIVO] Volume -30%, esecuzione tecnica a buffer controllato (RIR 3-4).`;
        return {
          ...ex,
          category,
          sets: Math.max(2, (ex.sets || 3) - 1), // Taglio volume automatico
          rpeTarget: Math.max(6, (ex.rpeTarget || 8) - 1.5),
          effortBuffer: 'RIR 3-4 (Scarico Attivo)',
          notes: cleanCustomNotes ? `${deloadNote} Note: ${cleanCustomNotes}` : deloadNote
        };
      }

      // SETTIMANA 3: INTENSIFICAZIONE MASSIMA & URTO THEY
      if (targetWeek === 3) {
        const shockNote = category === 'METABOLIC_GH' 
          ? `[SETTIMANA 3 · INTENSIFICAZIONE] Cedimento concentrico (RIR 0) e massima saturazione metabolica.`
          : `[SETTIMANA 3 · INTENSIFICAZIONE] Spingere al limite del buffer (RIR 1-0.5). Reclutamento UM massimo.`;
        return {
          ...ex,
          category,
          rpeTarget: Math.min(10, (ex.rpeTarget || 8) + 0.5),
          effortBuffer: category === 'METABOLIC_GH' ? 'RIR 0 (Cedimento)' : 'RIR 1-0.5',
          notes: cleanCustomNotes ? `${shockNote} Note: ${cleanCustomNotes}` : shockNote
        };
      }

      // SETTIMANA 2: ACCUMULO E MICRO-INCREMENTO
      if (targetWeek === 2) {
        const accumNote = `[SETTIMANA 2 · ACCUMULO] Micro-incremento carichi (+1.25/+2.5 kg) mantenendo la massima accelerazione CAT.`;
        return {
          ...ex,
          category,
          effortBuffer: 'RIR 1.5-2',
          notes: cleanCustomNotes ? `${accumNote} Note: ${cleanCustomNotes}` : accumNote
        };
      }

      // SETTIMANA 1: SETUP NEURALE BASE
      const baseNote = `[SETTIMANA 1 · SETUP NEURALE] Focus assoluto su velocità concentrica (CAT) ed efficienza neurale.`;
      return {
        ...ex,
        category,
        effortBuffer: 'RIR 2-3 (Buffer)',
        notes: cleanCustomNotes ? `${baseNote} Note: ${cleanCustomNotes}` : baseNote
      };
    })
  }));
}