// lib/aceto-engine.ts
// CHRIS ACETO CHAMPIONSHIP BODYBUILDING ENGINE - VERSIONE INTEGRALE

export type AcetoSplitDays = 3 | 4 | 5 | 6;

export interface AcetoExercise {
  order: number;
  name: string;
  category: "Compound Base" | "Angle/Dumbbell" | "Isolation/Machine";
  sets: number;
  reps: string;
  load_guideline: string;
  rir: number;
  rest_seconds: number;
  notes: string;
}

export interface AcetoWorkoutDay {
  day_number: number;
  day_label: string;
  target_muscles: string[];
  exercises: AcetoExercise[];
}

export interface AcetoProgram {
  program_name: string;
  split_type: string;
  current_week: number;
  total_weeks: number;
  workout_days: AcetoWorkoutDay[];
}

// 1. TASSONOMIA COMPLETA DEGLI ESERCIZI ACETO
export const ACETO_EXERCISE_TAXONOMY = {
  PETTO: {
    base: ["Panca Piana Bilanciere", "Distensioni su Panca Inclinata con Bilanciere"],
    angle: ["Distensioni Manubri su Panca Inclinata 30°", "Croci Manubri su Panca Piana"],
    isolation: ["Pectoral Machine", "Chest Press", "Croci ai Cavi Alti"],
  },
  DORSO: {
    base: ["Rematore con Bilanciere", "Trazioni alla Sbarra zavorrate", "Stacco da Terra"],
    angle: ["Rematore Manubrio Singolo", "T-Bar Row", "Lat Machine Avanti"],
    isolation: ["Pulley Basso", "Pullover con Manubrio", "Rowing Machine"],
  },
  SPALLE: {
    base: ["Lento Avanti Bilanciere", "Spinte Manubri da Seduto"],
    lateral: ["Alzate Laterali con Manubri", "Alzate Laterali al Cavo"],
    rear_traps: ["Alzate a 90° con Manubri", "Face Pull alla Corda", "Scrollate con Bilanciere"],
  },
  QUADRICIPITI: {
    base: ["Squat con Bilanciere", "Front Squat"],
    mass: ["Leg Press a 45°", "Hack Squat"],
    isolation: ["Leg Extension", "Affondi in Camminata"],
  },
  FEMORALI: {
    base: ["Stacco Rumeno con Bilanciere (RDL)", "Stacco a Gambe Tese con Manubri"],
    isolation: ["Leg Curl Sdraiato (Lying Leg Curl)", "Leg Curl Seduto"],
  },
  BICIPITI: {
    base: ["Curl Bilanciere Diritto in Piedi", "Curl con Bilanciere Sagomato EZ"],
    angle: ["Curl Alternato Manubri su Panca Inclinata 45°"],
    isolation: ["Preacher Curl (Panca Scott)", "Hammer Curl con Manubri"],
  },
  TRICIPITI: {
    base: ["Panca Piana Presa Stretta", "Dips alle Parallele zavorrate"],
    heavy: ["French Press Bilanciere Sagomato EZ"],
    isolation: ["Pushdown Cavo con Corda", "Pushdown Barra Dritta"],
  },
  POLPACCI_ADDOME: {
    calves: ["Standing Calf Machine", "Seated Calf Raise"],
    abs: ["Crunch a terra gambe a 90°", "Elevazioni Gambe alle Parallele"],
  },
};

// 2. GENERATORE DI SCHEDE SETTIMANALI (SPLIT 3, 4, 5, 6 GIORNI)
export function generateAcetoSplit(days: AcetoSplitDays, week: number = 1, history?: any[]): AcetoProgram {
  const isDeload = week === 6;
  const isPeak = week === 5;
  const isOverload = week === 3 || week === 4;

  const getExerciseNotes = (baseNotes: string, isIsolation: boolean): string => {
    if (isDeload) return "Deload: RIR 2 fisso, carico ridotto del 20%, focus controllo tecnico.";
    if (isPeak && isIsolation) return "Picco: Ultima serie con Stripping (-35%) o Back-off (-25%) a cedimento assoluto.";
    if (isOverload) return "Sovraccarico Assoluto: forzare +2.5kg tronco / +5kg gambe a parità di reps. " + baseNotes;
    return baseNotes;
  };

  // --- SPLIT 3 GIORNI (Recupero / Frequenza Ibrida) ---
  const split3: AcetoWorkoutDay[] = [
    {
      day_number: 1,
      day_label: "Giorno 1: Spinta & Quadricipiti",
      target_muscles: ["Pettorali", "Spalle", "Tricipiti", "Quadricipiti"],
      exercises: [
        {
          order: 1,
          name: "Squat con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "12-10-8-6",
          load_guideline: "Piramidale ascendente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 180,
          notes: getExerciseNotes("Discesa controllata 3 secondi, concentrica esplosiva.", false),
        },
        {
          order: 2,
          name: "Panca Piana Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale a salire fino a 6RM",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Drive concentrico violento, tocco sterno controllato.", false),
        },
        {
          order: 3,
          name: "Lento Avanti Bilanciere",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Spinta dal mento con blocco scapolare.", false),
        },
        {
          order: 4,
          name: "Panca Piana Presa Stretta",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Carico pesante a cedimento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Presa larghezza spalle, gomiti aderenti ai fianchi.", false),
        },
        {
          order: 5,
          name: "Leg Extension",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "TUT continuo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Picco di contrazione 1 sec in estensione completa.", true),
        },
      ],
    },
    {
      day_number: 2,
      day_label: "Giorno 2: Trazione, Catena Posteriore & Addome",
      target_muscles: ["Dorsali", "Deltoidi Posteriori", "Bicipiti", "Femorali", "Addome"],
      exercises: [
        {
          order: 1,
          name: "Rematore con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale a salire",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Busto inclinato a 45 gradi, tirata all'ombelico.", false),
        },
        {
          order: 2,
          name: "Stacco Rumeno con Bilanciere (RDL)",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-8",
          load_guideline: "Carico medio-pesante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Massimo allungamento ischiocrurali, colonna neutra.", false),
        },
        {
          order: 3,
          name: "Face Pull alla Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "Focus deltoide posteriore",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Extra-rotazione omerale a fine corsa.", true),
        },
        {
          order: 4,
          name: "Curl Bilanciere Diritto in Piedi",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Corpo bloccato, nessun cheating lombare.", false),
        },
        {
          order: 5,
          name: "Elevazioni Gambe alle Parallele",
          category: "Isolation/Machine",
          sets: 3,
          reps: "15-20",
          load_guideline: "A corpo libero",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Retroversione del bacino al punto massimo.", true),
        },
      ],
    },
    {
      day_number: 3,
      day_label: "Giorno 3: Full Body & Mass Overload",
      target_muscles: ["Gambe", "Petto", "Dorso", "Braccia", "Polpacci"],
      exercises: [
        {
          order: 1,
          name: "Leg Press a 45°",
          category: "Compound Base",
          sets: 4,
          reps: "10-10-8-8",
          load_guideline: "Massimo carico controllato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Discesa profonda senza staccare il bacino.", false),
        },
        {
          order: 2,
          name: "Distensioni Manubri su Panca Inclinata 30°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Cedimento concentrico positivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Allungamento profondo in basso.", false),
        },
        {
          order: 3,
          name: "T-Bar Row",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "10-8-8",
          load_guideline: "Carico consistente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti stretti a ridosso del busto.", false),
        },
        {
          order: 4,
          name: "Pushdown Cavo con Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Tensione costante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Apertura completa della corda al blocco.", true),
        },
        {
          order: 5,
          name: "Curl Alternato Manubri Panca 45°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Supinazione completa",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Isolamento bicipite in allungamento.", false),
        },
        {
          order: 6,
          name: "Standing Calf Machine",
          category: "Isolation/Machine",
          sets: 4,
          reps: "15-20",
          load_guideline: "Isometria 2 sec in alto",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Allungamento completo del tendine d'Achille in basso.", true),
        },
      ],
    },
  ];

  // --- SPLIT 4 GIORNI (The Golden Pro Split) ---
  const split4: AcetoWorkoutDay[] = [
    {
      day_number: 1,
      day_label: "Giorno 1: Pettorali, Bicipiti & Addome",
      target_muscles: ["Pettorali", "Bicipiti", "Addome"],
      exercises: [
        {
          order: 1,
          name: "Panca Piana Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale ascendente fino a 6RM",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Fase concentrica esplosiva, eccentrica controllata in 2-3 sec.", false),
        },
        {
          order: 2,
          name: "Distensioni Manubri su Panca Inclinata 30°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico fisso a cedimento positivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Massimo stretch in basso, chiusura fluida senza bloccare i gomiti.", false),
        },
        {
          order: 3,
          name: "Croci ai Cavi Alti",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Picco di contrazione 1 sec.",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Tensione continua con apertura controllata.", true),
        },
        {
          order: 4,
          name: "Curl Bilanciere Diritto in Piedi",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale a salire",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Corpo bloccato, nessun dondolio con la schiena.", false),
        },
        {
          order: 5,
          name: "Curl Alternato Manubri Panca 45°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico costante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Supinazione completa durante la risalita.", false),
        },
        {
          order: 6,
          name: "Elevazioni Gambe alle Parallele",
          category: "Isolation/Machine",
          sets: 3,
          reps: "15-20",
          load_guideline: "A corpo libero",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Contrazione di picco in alto.", true),
        },
      ],
    },
    {
      day_number: 2,
      day_label: "Giorno 2: Quadricipiti, Femorali & Polpacci",
      target_muscles: ["Quadricipiti", "Femorali", "Polpacci"],
      exercises: [
        {
          order: 1,
          name: "Squat con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "12-10-8-8",
          load_guideline: "Piramidale ascendente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 180,
          notes: getExerciseNotes("Discesa controllata 3 sec., risalita decisa.", false),
        },
        {
          order: 2,
          name: "Leg Press a 45°",
          category: "Compound Base",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Carico massimale controllato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Piedi a metà pedana, ginocchia in asse.", false),
        },
        {
          order: 3,
          name: "Leg Extension",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "TUT elevato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Isolamento continuo sul quadricipite.", true),
        },
        {
          order: 4,
          name: "Stacco Rumeno con Bilanciere (RDL)",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-8",
          load_guideline: "Carico medio-pesante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Schiena neutra, allungamento profondo dei femorali.", false),
        },
        {
          order: 5,
          name: "Leg Curl Sdraiato (Lying Leg Curl)",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-8",
          load_guideline: "Carico a cedimento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Bacino compresso sul cuscino durante la flessione.", true),
        },
        {
          order: 6,
          name: "Standing Calf Machine",
          category: "Isolation/Machine",
          sets: 4,
          reps: "15-20",
          load_guideline: "Contrazione isometrica 2 sec. al picco",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Massima escursione articolare.", true),
        },
      ],
    },
    {
      day_number: 3,
      day_label: "Giorno 3: Spalle, Tricipiti & Trapezi",
      target_muscles: ["Spalle", "Tricipiti", "Trapezi"],
      exercises: [
        {
          order: 1,
          name: "Lento Avanti Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Blocco scapolare solido, spinta rigorosa.", false),
        },
        {
          order: 2,
          name: "Alzate Laterali con Manubri",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Carico rigoroso",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Guida il movimento con i gomiti senza slancio di schiena.", false),
        },
        {
          order: 3,
          name: "Face Pull alla Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "Focus deltoide posteriore",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Extra-rotazione dell'omero a fine trazione.", true),
        },
        {
          order: 4,
          name: "Panca Piana Presa Stretta",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale a salire",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Presa larghezza spalle, gomiti vicini al corpo.", false),
        },
        {
          order: 5,
          name: "Pushdown Cavo con Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Apertura della corda in basso",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Gomiti bloccati ai fianchi, nessun movimento della spalla.", true),
        },
      ],
    },
    {
      day_number: 4,
      day_label: "Giorno 4: Dorsali & Bassa Schiena",
      target_muscles: ["Dorsali", "Bassa Schiena"],
      exercises: [
        {
          order: 1,
          name: "Rematore con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Sovraccarico progressivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Busto stabile a 45 gradi, trazione decisa all'ombelico.", false),
        },
        {
          order: 2,
          name: "Lat Machine Avanti",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "10-8-8",
          load_guideline: "Presa prona larga",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Depressione scapolare solida prima del tiraggio.", false),
        },
        {
          order: 3,
          name: "T-Bar Row",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico consistente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti stretti per massimo spessore muscolare.", false),
        },
        {
          order: 4,
          name: "Pullover con Manubrio",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Focus allungamento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Braccia semidistese, allungamento profondo del grandorsale.", true),
        },
      ],
    },
  ];

  // --- SPLIT 5 GIORNI (Separazione Quadricipiti / Femorali) ---
  const split5: AcetoWorkoutDay[] = [
    {
      day_number: 1,
      day_label: "Giorno 1: Pettorali & Addome",
      target_muscles: ["Pettorali", "Addome"],
      exercises: [
        {
          order: 1,
          name: "Panca Piana Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale fino al 6RM",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Fase concentrica esplosiva, eccentrica 2-3 sec.", false),
        },
        {
          order: 2,
          name: "Distensioni Manubri su Panca Inclinata 30°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico pesante a cedimento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Stretch completo al petto.", false),
        },
        {
          order: 3,
          name: "Croci ai Cavi Alti",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Picco contrazione 1s",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Tensione continua senza rilascio.", true),
        },
        {
          order: 4,
          name: "Elevazioni Gambe alle Parallele",
          category: "Isolation/Machine",
          sets: 3,
          reps: "15-20",
          load_guideline: "Corpo libero",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Retroflessione bacino.", true),
        },
      ],
    },
    {
      day_number: 2,
      day_label: "Giorno 2: Dorsali, Trapezi & Bassa Schiena",
      target_muscles: ["Dorsali", "Trapezi", "Bassa Schiena"],
      exercises: [
        {
          order: 1,
          name: "Rematore con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Busto 45 gradi rigoroso.", false),
        },
        {
          order: 2,
          name: "Lat Machine Avanti",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "10-8-8",
          load_guideline: "Presa larga",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Depressione scapolare ad inizio trazione.", false),
        },
        {
          order: 3,
          name: "T-Bar Row",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico elevato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti aderenti.", false),
        },
        {
          order: 4,
          name: "Scrollate con Bilanciere",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Elevazione scapolare",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Nessuna rotazione delle spalle, trazione solo verso l'alto.", true),
        },
      ],
    },
    {
      day_number: 3,
      day_label: "Giorno 3: Quadricipiti & Polpacci",
      target_muscles: ["Quadricipiti", "Polpacci"],
      exercises: [
        {
          order: 1,
          name: "Squat con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "12-10-8-8",
          load_guideline: "Piramidale ascendente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 180,
          notes: getExerciseNotes("Discesa controllata 3 secondi.", false),
        },
        {
          order: 2,
          name: "Leg Press a 45°",
          category: "Compound Base",
          sets: 4,
          reps: "10-10-10-10",
          load_guideline: "Carico massimale controllato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Piedi a metà pedana.", false),
        },
        {
          order: 3,
          name: "Leg Extension",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "TUT elevato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Isolamento continuo.", true),
        },
        {
          order: 4,
          name: "Standing Calf Machine",
          category: "Isolation/Machine",
          sets: 4,
          reps: "15-20",
          load_guideline: "Isometria 2 sec in alto",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Allungamento profondo al tallone.", true),
        },
      ],
    },
    {
      day_number: 4,
      day_label: "Giorno 4: Spalle & Bicipiti",
      target_muscles: ["Spalle", "Bicipiti"],
      exercises: [
        {
          order: 1,
          name: "Lento Avanti Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Spinta dal mento solida.", false),
        },
        {
          order: 2,
          name: "Alzate Laterali con Manubri",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Carico controllato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Guida con i gomiti.", false),
        },
        {
          order: 3,
          name: "Face Pull alla Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "12-12-12",
          load_guideline: "Cavi alti",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Extra-rotazione omero.", true),
        },
        {
          order: 4,
          name: "Curl Bilanciere Diritto in Piedi",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti fermi contro i fianchi.", false),
        },
        {
          order: 5,
          name: "Curl Alternato Manubri Panca 45°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Costante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Supinazione in risalita.", false),
        },
      ],
    },
    {
      day_number: 5,
      day_label: "Giorno 5: Femorali & Tricipiti",
      target_muscles: ["Femorali", "Tricipiti"],
      exercises: [
        {
          order: 1,
          name: "Stacco Rumeno con Bilanciere (RDL)",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-8-6",
          load_guideline: "Carico progressivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Focus allungamento posteriore.", false),
        },
        {
          order: 2,
          name: "Leg Curl Sdraiato (Lying Leg Curl)",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-8",
          load_guideline: "Cedimento positivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Bacino incollato alla panca.", true),
        },
        {
          order: 3,
          name: "Panca Piana Presa Stretta",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Presa larghezza spalle.", false),
        },
        {
          order: 4,
          name: "Pushdown Cavo con Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Isolamento cavo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Apertura corda in basso.", true),
        },
      ],
    },
  ];

  // --- SPLIT 6 GIORNI (Monomuscolare Avanzata Aceto - They) ---
  const split6: AcetoWorkoutDay[] = [
    {
      day_number: 1,
      day_label: "Giorno 1: Deltoidi & Trapezi",
      target_muscles: ["Spalle", "Trapezi"],
      exercises: [
        {
          order: 1,
          name: "Lento Avanti Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Spinta dal mento esplosiva.", false),
        },
        {
          order: 2,
          name: "Alzate Laterali con Manubri",
          category: "Angle/Dumbbell",
          sets: 4,
          reps: "10-10-8-8",
          load_guideline: "Rigore tecnico",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Guida con i gomiti.", false),
        },
        {
          order: 3,
          name: "Alzate a 90° con Manubri",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "12-10-10",
          load_guideline: "Carico controllato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Busto parallelo al pavimento.", false),
        },
        {
          order: 4,
          name: "Scrollate con Bilanciere",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Carico pesante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Elevazione pura senza rotazione.", true),
        },
      ],
    },
    {
      day_number: 2,
      day_label: "Giorno 2: Dorsali & Bassa Schiena",
      target_muscles: ["Dorsali", "Bassa Schiena"],
      exercises: [
        {
          order: 1,
          name: "Rematore con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Busto a 45 gradi.", false),
        },
        {
          order: 2,
          name: "Trazioni alla Sbarra zavorrate",
          category: "Compound Base",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Zavorra a cedimento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Trazione al petto piena.", false),
        },
        {
          order: 3,
          name: "T-Bar Row",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Carico elevato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti stretti per spessore.", false),
        },
        {
          order: 4,
          name: "Pullover con Manubrio",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Allungamento dorsale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Respirazione profonda nel punto inferiore.", true),
        },
      ],
    },
    {
      day_number: 3,
      day_label: "Giorno 3: Quadricipiti",
      target_muscles: ["Quadricipiti"],
      exercises: [
        {
          order: 1,
          name: "Squat con Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "12-10-8-8",
          load_guideline: "Piramidale ascendente",
          rir: isDeload ? 2 : 0,
          rest_seconds: 180,
          notes: getExerciseNotes("Discesa controllata 3 secondi.", false),
        },
        {
          order: 2,
          name: "Leg Press a 45°",
          category: "Compound Base",
          sets: 4,
          reps: "10-10-10-8",
          load_guideline: "Carico massimo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Pedana centrale, spinta talloni.", false),
        },
        {
          order: 3,
          name: "Leg Extension",
          category: "Isolation/Machine",
          sets: 4,
          reps: "12-12-10-10",
          load_guideline: "TUT elevato",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Isolamento e bruciore continuo.", true),
        },
      ],
    },
    {
      day_number: 4,
      day_label: "Giorno 4: Pettorali",
      target_muscles: ["Pettorali"],
      exercises: [
        {
          order: 1,
          name: "Panca Piana Bilanciere",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-6-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 150,
          notes: getExerciseNotes("Drive concentrico esplosivo.", false),
        },
        {
          order: 2,
          name: "Distensioni Manubri su Panca Inclinata 30°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Cedimento positivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Apertura ampia, contrazione alta.", false),
        },
        {
          order: 3,
          name: "Croci ai Cavi Alti",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Tensione continua",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Picco di contrazione 1 secondo.", true),
        },
      ],
    },
    {
      day_number: 5,
      day_label: "Giorno 5: Braccia Complete (Push-Pull)",
      target_muscles: ["Bicipiti", "Tricipiti"],
      exercises: [
        {
          order: 1,
          name: "Curl Bilanciere Diritto in Piedi",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Zero cheating con le spalle.", false),
        },
        {
          order: 2,
          name: "Panca Piana Presa Stretta",
          category: "Compound Base",
          sets: 3,
          reps: "10-8-6",
          load_guideline: "Piramidale",
          rir: isDeload ? 2 : 0,
          rest_seconds: 90,
          notes: getExerciseNotes("Gomiti stretti aderenti al tronco.", false),
        },
        {
          order: 3,
          name: "Curl Alternato Manubri Panca 45°",
          category: "Angle/Dumbbell",
          sets: 3,
          reps: "8-8-8",
          load_guideline: "Costante",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Supinazione in risalita.", false),
        },
        {
          order: 4,
          name: "Pushdown Cavo con Corda",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-10",
          load_guideline: "Isolamento",
          rir: isDeload ? 2 : 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Apertura corda al blocco.", true),
        },
      ],
    },
    {
      day_number: 6,
      day_label: "Giorno 6: Femorali & Polpacci",
      target_muscles: ["Femorali", "Polpacci"],
      exercises: [
        {
          order: 1,
          name: "Stacco Rumeno con Bilanciere (RDL)",
          category: "Compound Base",
          sets: 4,
          reps: "10-8-8-6",
          load_guideline: "Progressivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 120,
          notes: getExerciseNotes("Allungamento ischiocrurali massimo.", false),
        },
        {
          order: 2,
          name: "Leg Curl Sdraiato (Lying Leg Curl)",
          category: "Isolation/Machine",
          sets: 3,
          reps: "10-10-8",
          load_guideline: "Cedimento positivo",
          rir: isDeload ? 2 : 0,
          rest_seconds: 75,
          notes: getExerciseNotes("Flessione completa senza muovere le anche.", true),
        },
        {
          order: 3,
          name: "Standing Calf Machine",
          category: "Isolation/Machine",
          sets: 4,
          reps: "15-20",
          load_guideline: "Isometria 2s",
          rir: 0,
          rest_seconds: 60,
          notes: getExerciseNotes("Escursione articolare profonda.", true),
        },
      ],
    },
  ];

  let selectedWorkoutDays: AcetoWorkoutDay[];
  switch (days) {
    case 3:
      selectedWorkoutDays = split3;
      break;
    case 5:
      selectedWorkoutDays = split5;
      break;
    case 6:
      selectedWorkoutDays = split6;
      break;
    case 4:
    default:
      selectedWorkoutDays = split4;
      break;
  }

  return {
    program_name: `Chris Aceto Championship Engine (Settimana ${week})`,
    split_type: `${days}_days`,
    current_week: week,
    total_weeks: 6,
    workout_days: selectedWorkoutDays,
  };
}

// FUNZIONE PROGRESSIONE SETTIMANALE CHRIS ACETO (W1 -> W6)
export function applyAcetoWeekProgression(
  currentDays: any[],
  targetWeek: number,
  history?: any[]
): any[] {
  const week = Math.max(1, Math.min(6, targetWeek));
  const isDeload = week === 6;
  const isPeak = week === 5;
  const isOverload = week === 3 || week === 4;

  const findMaxLoad = (exName: string): number | null => {
    if (!history || !Array.isArray(history)) return null;
    let max = 0;
    const target = exName.toLowerCase().trim();
    for (const session of history) {
      const logs = session.logs || session.workout_logs || [];
      if (Array.isArray(logs)) {
        for (const l of logs) {
          const name = (l.exercise_name || l.exerciseName || l.name || "").toLowerCase().trim();
          if (name && (target.includes(name) || name.includes(target))) {
            const w = Number(l.effectiveLoad || l.weight || 0);
            if (w > max) max = w;
          }
        }
      }
    }
    return max > 0 ? max : null;
  };

  return currentDays.map((day: any) => {
    const updatedExercises = (day.exercises || []).map((ex: any) => {
      const isLower =
        (day.target_muscles || []).some((m: string) =>
          /quadricipiti|femorali|gambe/i.test(m)
        ) || /squat|press|stacco|leg/i.test(ex.name);

      const isCompound =
        ex.category === "Compound Base" ||
        /panca|squat|rematore|lento|stacco|press/i.test(ex.name);

      const maxHist = findMaxLoad(ex.name);

      let sets = ex.sets || 3;
      let reps = ex.reps || "8-10";
      let rir = 0;
      let load_guideline = ex.load_guideline || "";
      let notes = ex.notes || "";

      if (isDeload) {
        sets = 2; // Taglio volumetrico: 2 serie fisse
        reps = isCompound ? "10-10" : "12-12";
        rir = 2;
        const deloadKg = maxHist ? Math.round(maxHist * 0.8) : null;
        load_guideline = deloadKg ? `Scarico: ${deloadKg} kg (-20%)` : "Scarico Attivo (-20% carico)";
        notes = "DELOAD W6: 2 serie a RIR 2 fisso. Zero cedimento, recupero articolare.";
      } else if (isPeak) {
        sets = isCompound ? 4 : 3;
        reps = isCompound ? "10-8-6-6" : "8-10";
        rir = 0;
        if (!isCompound) {
          const dropKg = maxHist ? Math.round(maxHist * 0.65) : null;
          load_guideline = dropKg
            ? `${maxHist} kg a cedimento + Drop a ${dropKg} kg`
            : "Ultima serie Stripping (-35%)";
          notes = "PICCO W5: Ultima serie con Stripping immediato a cedimento positivo estremo.";
        } else {
          load_guideline = maxHist ? `Consolida: ${maxHist} kg` : "Carico picco consolidato";
          notes = "PICCO W5: Mantieni i carichi massimi consolidati in W3-W4.";
        }
      } else if (isOverload) {
        sets = isCompound ? 4 : 3;
        reps = isCompound ? "10-8-6-6" : "8-10";
        rir = 0;
        const inc = isLower ? 5 : 2.5;
        const targetKg = maxHist ? maxHist + inc : null;
        load_guideline = targetKg ? `Target Overload: ${targetKg} kg (+${inc} kg)` : `Forzare +${inc} kg`;
        notes = `OVERLOAD W${week}: Cedimento concentrico positivo (RIR 0). Reclutamento fibre veloci IIb.`;
      } else {
        sets = isCompound ? 4 : 3;
        reps = isCompound ? "10-8-8-8" : "8-10";
        rir = 0;
        load_guideline = maxHist ? `Base: ${maxHist} kg` : "Piramidale ascendente a cedimento";
        notes = `FASE BASE W${week}: Concentrica esplosiva, eccentrica controllata 2-3s. RIR 0.`;
      }

      return {
        ...ex,
        sets,
        reps,
        rir,
        load_guideline,
        notes,
      };
    });

    return {
      ...day,
      exercises: updatedExercises,
    };
  });
}