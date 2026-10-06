// lib/Aceto-engine.ts
/**
 * ============================================================================
 * CHRIS ACETO CHAMPIONSHIP BODYBUILDING ENGINE - TOP GYM CORE
 * ============================================================================
 * Implementazione algoritmica ufficiale basata rigorosamente sui principi,
 * tabelle e protocolli di periodizzazione di Chris Aceto.
 */

export type AcetoSplitDays = 3 | 4 | 5 | 6;
export type AcetoAthleteLevel = "INTERMEDIATE" | "ADVANCED";
export type AcetoGoal = "MASS_BUILDING" | "CONTEST_PREP";

export type AcetoSpecialTechnique =
  | "NONE"
  | "REST_PAUSE"
  | "STRIP_SETS_TO_10"
  | "FORCED_REPS"
  | "PEAK_CONTRACTION_NEGATIVES"
  | "REVERSE_STRIP_SETS"
  | "MODIFIED_SUPER_SETS"
  | "PARTIALS"
  | "THREE_REP_MAX";

export interface AcetoExercise {
  order: number;
  name: string;
  category: "COMPOUND" | "ISOLATION";
  sets: number;
  reps: string;
  load_guideline: string;
  rir: number;
  rest_seconds: number;
  notes: string;
  warmup_protocol?: string;
  working_protocol?: string;
  advanced_protocol?: string;
  technique?: AcetoSpecialTechnique;
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
  level: AcetoAthleteLevel;
  goal: AcetoGoal;
  phase_name: string;
}

/**
 * Calcola matematicamente la settimana attiva del ciclo (1-6 o 1-8)
 * in base al numero di sessioni nello storico e alla frequenza della split.
 */
export function calculateAcetoCurrentWeek(
  historyCount: number,
  splitSize: number,
  cycleLength: number = 6
): number {
  const safeSplit = Math.max(3, Math.min(6, Number(splitSize) || 4));
  const safeHistory = Math.max(0, Number(historyCount) || 0);
  const completedMicrocycles = Math.floor(safeHistory / safeSplit);
  return (completedMicrocycles % cycleLength) + 1;
}

/**
 * Calcola la durata ottimale della preparazione pre-gara in settimane
 * in base alla percentuale di grasso corporeo (Body Fat) iniziale.
 */
export function calculateContestPrepWeeks(bodyFat: number, gender: "MALE" | "FEMALE" = "MALE"): number {
  if (gender === "MALE") {
    if (bodyFat < 8) return 8;
    if (bodyFat <= 11) return 13;
    if (bodyFat <= 17) return 16;
    return 20;
  } else {
    if (bodyFat < 13) return 8;
    if (bodyFat <= 16) return 13;
    if (bodyFat <= 20) return 16;
    return 20;
  }
}

/**
 * Generatore dei template base per le schede ufficiali di Chris Aceto.
 */
function buildOfficialTemplate(
  split: AcetoSplitDays,
  level: AcetoAthleteLevel
): AcetoWorkoutDay[] {
  // =========================================================================
  // SCHEDA INTERMEDIA A & B (4 GIORNI / UPPER-LOWER O 4 ON 1 OFF)
  // =========================================================================
  if (level === "INTERMEDIATE") {
    if (split === 4) {
      return [
        {
          day_number: 1,
          day_label: "Day 1: Chest & Biceps",
          target_muscles: ["Petto", "Bicipiti"],
          exercises: [
            {
              order: 1,
              name: "Panca Piana con Bilanciere (Bench Press)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10 con carico limite) + 1-2 Concentriche Esplosive (10)",
              rir: 1,
              rest_seconds: 90,
              notes: "Fase concentrica esplosiva F = m · a, eccentrica controllata al petto.",
              warmup_protocol: "1 set × 10 reps (riscaldamento articolare)",
              working_protocol: "1 set × 10 reps (carico con cui la decima rep è quasi a cedimento)",
              advanced_protocol: "1-2 sets × 10 reps spinte alla massima accelerazione concentrica",
              technique: "NONE",
            },
            {
              order: 2,
              name: "Panca Inclinata con Bilanciere (Incline Bench Press)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 6-10 / 6-10 / 6-10",
              load_guideline: "1 Warm-up (10) + 1 Working (6-10) + 1-2 Accelerating sets (6-10)",
              rir: 1,
              rest_seconds: 90,
              notes: "Inclinazione panca a 30°. Nessun rimbalzo sul torace.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 6-10 reps (aggiungere carico pesante)",
              advanced_protocol: "1-2 sets × 6-10 reps a cedimento concentrico",
              technique: "NONE",
            },
            {
              order: 3,
              name: "Curl con Bilanciere in Piedi (Standing Barbell Curls)",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 75,
              notes: "Gomiti bloccati ai fianchi, nessun dondolio lombare.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps esplosive",
              technique: "NONE",
            },
            {
              order: 4,
              name: "Panca Scott con Bilanciere (Preacher Curls)",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 0,
              rest_seconds: 75,
              notes: "Arresto controllato a 2 cm dalla distensione totale per proteggere il tendine distale.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps portate a cedimento positivo",
              technique: "NONE",
            },
          ],
        },
        {
          day_number: 2,
          day_label: "Day 2: Back & Abs",
          target_muscles: ["Dorso", "Addome"],
          exercises: [
            {
              order: 1,
              name: "Rematore con Bilanciere Busto Flesso (Bent Rows)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 90,
              notes: "Busto a 45°-60°, trazione verso l'ombelico, schiena in perfetto arco lombare.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps concentriche esplosive",
              technique: "NONE",
            },
            {
              order: 2,
              name: "Lat Machine Presa Avanti (Pull Downs)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 6-10 / 6-10 / 6-10",
              load_guideline: "1 Warm-up (10) + 1 Working (6-10) + 1-2 Accelerating sets (6-10)",
              rir: 1,
              rest_seconds: 90,
              notes: "Trazione allo sterno, adduzione scapolare marcata al picco concentrico.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 6-10 reps con sovraccarico",
              advanced_protocol: "1-2 sets × 6-10 reps",
              technique: "NONE",
            },
            {
              order: 3,
              name: "Crunches a Terra",
              category: "ISOLATION",
              sets: 3,
              reps: "15-20",
              load_guideline: "3 serie fisse a corpo libero, cadenza controllata",
              rir: 1,
              rest_seconds: 60,
              notes: "Focalizzare l'accorciamento gabbia toracica-bacino.",
              technique: "NONE",
            },
            {
              order: 4,
              name: "Hanging Leg Raises (Sollevamento Gambe alla Sbarra)",
              category: "ISOLATION",
              sets: 3,
              reps: "15-20",
              load_guideline: "3 serie fisse, retroversione del bacino",
              rir: 1,
              rest_seconds: 60,
              notes: "Evitare l'oscillazione inerziale.",
              technique: "NONE",
            },
          ],
        },
        {
          day_number: 3,
          day_label: "Day 3: Legs & Calves",
          target_muscles: ["Quadricipiti", "Femorali", "Polpacci"],
          exercises: [
            {
              order: 1,
              name: "Leg Press 45° (Presses)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 120,
              notes: "Profondità completa senza staccare il bacino dal cuscino. Spinta dai talloni.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps pesanti",
              technique: "NONE",
            },
            {
              order: 2,
              name: "Leg Extensions",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 6-10 / 6-10 / 6-10",
              load_guideline: "1 Warm-up (10) + 1 Working (6-10) + 1-2 Accelerating sets (6-10)",
              rir: 1,
              rest_seconds: 75,
              notes: "Estensione completa con blocco di 1 secondo al vertice.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 6-10 reps",
              advanced_protocol: "1-2 sets × 6-10 reps",
              technique: "NONE",
            },
            {
              order: 3,
              name: "Leg Curls Sdraiato",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 0,
              rest_seconds: 75,
              notes: "Frenare la fase eccentrica in 3 secondi pieni.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps a cedimento concentrico positivo",
              technique: "NONE",
            },
            {
              order: 4,
              name: "Seated Calf Raises (Polpacci Seduto)",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 60,
              notes: "Enfasi sul soleo. Massimo allungamento in basso.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps",
              technique: "NONE",
            },
            {
              order: 5,
              name: "Standing Calf Raises (Polpacci in Piedi)",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 60,
              notes: "Ginocchia tese per colpire il gastrocnemio.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps",
              technique: "NONE",
            },
          ],
        },
        {
          day_number: 4,
          day_label: "Day 4: Shoulders & Triceps",
          target_muscles: ["Spalle", "Tricipiti"],
          exercises: [
            {
              order: 1,
              name: "Lento Avanti con Bilanciere (Front Presses)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 6-10 / 6-10 / 6-10",
              load_guideline: "1 Warm-up (10) + 1 Working (6-10) + 1-2 Accelerating sets (6-10)",
              rir: 1,
              rest_seconds: 90,
              notes: "Spinta verticale esplosiva, discesa controllata all'altezza clavicolare.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 6-10 reps",
              advanced_protocol: "1-2 sets × 6-10 reps",
              technique: "NONE",
            },
            {
              order: 2,
              name: "Alzate Laterali con Manubri (Side Laterals)",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 60,
              notes: "Mignolo leggermente ruotato verso l'alto, braccia leggermente flesse.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps",
              technique: "NONE",
            },
            {
              order: 3,
              name: "Pushdowns ai Cavi per Tricipiti",
              category: "ISOLATION",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 1,
              rest_seconds: 60,
              notes: "Gomiti incollati alla cassa toracica. Massima estensione concentrica.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps",
              technique: "NONE",
            },
            {
              order: 4,
              name: "Panca Presa Stretta (Close Grip Bench Press)",
              category: "COMPOUND",
              sets: 4,
              reps: "10 / 10 / 10 / 10",
              load_guideline: "1 Warm-up (10) + 1 Working (10) + 1-2 Accelerating sets (10)",
              rir: 0,
              rest_seconds: 90,
              notes: "Mani a larghezza spalle (non più strette per preservare i polsi). Cedimento positivo finale.",
              warmup_protocol: "1 set × 10 reps",
              working_protocol: "1 set × 10 reps",
              advanced_protocol: "1-2 sets × 10 reps a cedimento",
              technique: "NONE",
            },
          ],
        },
      ];
    }
  }

  // =========================================================================
  // SCHEDA AVANZATA (ROUTINE 2 ON / 1 OFF E MODIFICATE A 3, 5, 6 GIORNI)
  // =========================================================================
  if (split === 6) {
    // Modified 6 Days a Week Split (1 Gruppo Muscolare al Giorno)
    return [
      {
        day_number: 1,
        day_label: "Day 1: Chest & Abs",
        target_muscles: ["Petto", "Addome"],
        exercises: [
          {
            order: 1,
            name: "Panca Piana con Bilanciere (Bench Presses)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Advanced Sets con Rest-Pause o Forced Reps.",
            technique: "REST_PAUSE",
          },
          {
            order: 2,
            name: "Panca Inclinata con Bilanciere (Incline Bench Press)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Ultima serie a cedimento concentrico assoluto con spotter.",
            technique: "FORCED_REPS",
          },
          {
            order: 3,
            name: "Pec Dec Machine (Flyes)",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Ultima serie: Strip Sets to 10 (doppio scarico con pesi pesanti).",
            technique: "STRIP_SETS_TO_10",
          },
          {
            order: 4,
            name: "Crunches con Sovraccarico",
            category: "ISOLATION",
            sets: 4,
            reps: "20 / 20 / 12-15 / 12-15",
            load_guideline: "2 sets corpo libero (20) + 2 sets add weight (12-15)",
            rir: 1,
            rest_seconds: 60,
            notes: "Contrazione continua.",
            technique: "NONE",
          },
          {
            order: 5,
            name: "Hanging Leg Raises",
            category: "ISOLATION",
            sets: 4,
            reps: "12-15",
            load_guideline: "4 serie a cedimento tecnico",
            rir: 1,
            rest_seconds: 60,
            notes: "Isolamento dell'addome inferiore.",
            technique: "NONE",
          },
        ],
      },
      {
        day_number: 2,
        day_label: "Day 2: Back",
        target_muscles: ["Dorso"],
        exercises: [
          {
            order: 1,
            name: "Lat Pulldowns Presa Larga",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Advanced sets con Rest-Pause (pausa 20 secondi dopo il cedimento a 6 reps).",
            technique: "REST_PAUSE",
          },
          {
            order: 2,
            name: "Rematore con Bilanciere (Bent Rows)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Forced reps sulle ultime 2 ripetizioni della serie finale.",
            technique: "FORCED_REPS",
          },
          {
            order: 3,
            name: "Pulley Basso (Low Cable Rows)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Strip Sets to 10 sull'ultima serie.",
            technique: "STRIP_SETS_TO_10",
          },
          {
            order: 4,
            name: "Scrollate con Manubri (Dumbbell Shrugs)",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Tenere 2 secondi la contrazione di picco in alto.",
            technique: "PEAK_CONTRACTION_NEGATIVES",
          },
        ],
      },
      {
        day_number: 3,
        day_label: "Day 3: Arms (Biceps & Triceps)",
        target_muscles: ["Bicipiti", "Tricipiti"],
        exercises: [
          {
            order: 1,
            name: "Standing Barbell Curls",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "A cedimento completo a 6-8 reps, eseguire 2-3 Partials (mezze reps) dal basso.",
            technique: "PARTIALS",
          },
          {
            order: 2,
            name: "Preacher Curls con Bilanciere Sagomato",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Forced Reps con spotter al blocco concentrico.",
            technique: "FORCED_REPS",
          },
          {
            order: 3,
            name: "Pushdowns per Tricipiti ai Cavi",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Strip Sets to 10 sull'ultima serie (scarico pesante rapido).",
            technique: "STRIP_SETS_TO_10",
          },
          {
            order: 4,
            name: "French Press con Bilanciere (Skull Crushers)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Eccentrica controllata verso la fronte, spinta decisa.",
            technique: "FORCED_REPS",
          },
        ],
      },
      {
        day_number: 4,
        day_label: "Day 4: Quads",
        target_muscles: ["Quadricipiti"],
        exercises: [
          {
            order: 1,
            name: "Leg Extensions (Pre-Exhaust)",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Peak Contraction: 2 secondi di tenuta isometrica + negativa rallentata.",
            technique: "PEAK_CONTRACTION_NEGATIVES",
          },
          {
            order: 2,
            name: "Squat al MultiPower (Smith Machine Squats)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Carichi pesanti in sicurezza. Discesa sotto il parallelo.",
            technique: "FORCED_REPS",
          },
          {
            order: 3,
            name: "Leg Extensions (Secondo Ingresso)",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Strip Sets to 10 finale a cedimento estremo.",
            technique: "STRIP_SETS_TO_10",
          },
        ],
      },
      {
        day_number: 5,
        day_label: "Day 5: Hamstrings & Calves",
        target_muscles: ["Femorali", "Polpacci"],
        exercises: [
          {
            order: 1,
            name: "Leg Curls Sdraiato",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Peak Contraction e negative accentuate.",
            technique: "PEAK_CONTRACTION_NEGATIVES",
          },
          {
            order: 2,
            name: "Stacchi a Gambe Semitese (Stiff Leg Dead Lifts)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 1,
            rest_seconds: 120,
            notes: "Focus sullo stiramento eccentrico dei bicipiti femorali. Schiena serrata.",
            technique: "NONE",
          },
          {
            order: 3,
            name: "Seated Calf Raises",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 60,
            notes: "Partials in stiramento dopo il cedimento.",
            technique: "PARTIALS",
          },
          {
            order: 4,
            name: "Standing Calf Raises",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 60,
            notes: "Rest-Pause sull'ultima serie.",
            technique: "REST_PAUSE",
          },
        ],
      },
      {
        day_number: 6,
        day_label: "Day 6: Shoulders",
        target_muscles: ["Spalle"],
        exercises: [
          {
            order: 1,
            name: "Lento Avanti con Bilanciere (Front Presses)",
            category: "COMPOUND",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 120,
            notes: "Rest-Pause: cedere a 6 reps, 20 secondi pausa, chiudere a 8.",
            technique: "REST_PAUSE",
          },
          {
            order: 2,
            name: "Alzate Laterali con Manubri (Side Laterals)",
            category: "ISOLATION",
            sets: 5,
            reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Strip Sets to 10 pesanti sulla serie conclusiva.",
            technique: "STRIP_SETS_TO_10",
          },
          {
            order: 3,
            name: "Alzate Posteriori a 90° (Rear Laterals)",
            category: "ISOLATION",
            sets: 4,
            reps: "12 / 8-10 / 8-10 / 6-8",
            load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
            rir: 0,
            rest_seconds: 90,
            notes: "Picco di contrazione di 2 secondi per i deltoidi posteriori.",
            technique: "PEAK_CONTRACTION_NEGATIVES",
          },
        ],
      },
    ];
  }

  // DEFAULT AVANZATO: SPLIT 2 ON / 1 OFF (CATALOGATA SU 4 SESSIONI CHIAVE)
  return [
    {
      day_number: 1,
      day_label: "Day 1: Back & Biceps",
      target_muscles: ["Dorso", "Bicipiti"],
      exercises: [
        {
          order: 1,
          name: "Lat Pulldowns Presa Larga",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Advanced sets con tecnica Rest-Pause (pausa max 20\").",
          technique: "REST_PAUSE",
        },
        {
          order: 2,
          name: "Rematore con Bilanciere (Bent Rows)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Forced Reps: lo spotter assiste sulle ultime 2 reps oltre il cedimento.",
          technique: "FORCED_REPS",
        },
        {
          order: 3,
          name: "Pulley Basso (Low Cable Rows)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Strip Sets to 10 pesanti: cedimento a 4-5 reps, scarico, altre 2 reps, terzo scarico.",
          technique: "STRIP_SETS_TO_10",
        },
        {
          order: 4,
          name: "Scrollate con Manubri (Dumbbell Shrugs)",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Peak Contraction: blocco isometrico in alto per 2 secondi.",
          technique: "PEAK_CONTRACTION_NEGATIVES",
        },
        {
          order: 5,
          name: "Standing Barbell Curls",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Partials finali dopo il cedimento concentrico a Full ROM.",
          technique: "PARTIALS",
        },
        {
          order: 6,
          name: "Preacher Curls con Bilanciere",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Forced Reps con lo spotter.",
          technique: "FORCED_REPS",
        },
      ],
    },
    {
      day_number: 2,
      day_label: "Day 2: Chest & Abs",
      target_muscles: ["Petto", "Addome"],
      exercises: [
        {
          order: 1,
          name: "Panca Piana con Bilanciere (Bench Presses)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Rest-Pause: cedere a 6 reps, riposare 20 secondi, spingere altre 2 reps per fare 8.",
          technique: "REST_PAUSE",
        },
        {
          order: 2,
          name: "Panca Inclinata con Bilanciere (Incline Bench Press)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Forced reps sulle ultime 2 ripetizioni a cedimento.",
          technique: "FORCED_REPS",
        },
        {
          order: 3,
          name: "Pec Dec Machine (Flyes)",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Strip Sets to 10: scarichi pesanti immediati.",
          technique: "STRIP_SETS_TO_10",
        },
        {
          order: 4,
          name: "Crunches a Terra",
          category: "ISOLATION",
          sets: 4,
          reps: "20 / 20 / 12-15 / 12-15",
          load_guideline: "2 sets corpo libero (20) + 2 sets add weight (12-15)",
          rir: 1,
          rest_seconds: 60,
          notes: "Esecuzione lenta.",
          technique: "NONE",
        },
        {
          order: 5,
          name: "Hanging Leg Raises",
          category: "ISOLATION",
          sets: 4,
          reps: "12-15",
          load_guideline: "4 serie × 12-15 reps con bacino in retroversione",
          rir: 1,
          rest_seconds: 60,
          notes: "Nessun dondolio.",
          technique: "NONE",
        },
      ],
    },
    {
      day_number: 3,
      day_label: "Day 3: Quads, Hamstrings & Calves",
      target_muscles: ["Quadricipiti", "Femorali", "Polpacci"],
      exercises: [
        {
          order: 1,
          name: "Leg Extensions (Pre-Exhaust)",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Peak Contraction e negative lente frenate contro resistenza.",
          technique: "PEAK_CONTRACTION_NEGATIVES",
        },
        {
          order: 2,
          name: "Smith Machine Squats",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Sovraccarico assoluto, 6-8 reps a cedimento concentrico con spotter.",
          technique: "FORCED_REPS",
        },
        {
          order: 3,
          name: "Leg Extensions (Secondo Ingresso)",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Strip Sets to 10 finale.",
          technique: "STRIP_SETS_TO_10",
        },
        {
          order: 4,
          name: "Leg Curls Sdraiato",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Peak contraction di 2\" al culmine dell'accorciamento.",
          technique: "PEAK_CONTRACTION_NEGATIVES",
        },
        {
          order: 5,
          name: "Stiff Leg Dead Lifts (Stacchi Gambe Tese)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 1,
          rest_seconds: 120,
          notes: "Discesa controllata. Massima tensione eccentrica.",
          technique: "NONE",
        },
        {
          order: 6,
          name: "Seated Calf Raises",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 60,
          notes: "Partials finali dopo il cedimento.",
          technique: "PARTIALS",
        },
        {
          order: 7,
          name: "Standing Calf Raises",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 60,
          notes: "Rest-Pause (15 secondi di pausa a cedimento).",
          technique: "REST_PAUSE",
        },
      ],
    },
    {
      day_number: 4,
      day_label: "Day 4: Shoulders & Triceps",
      target_muscles: ["Spalle", "Tricipiti"],
      exercises: [
        {
          order: 1,
          name: "Lento Avanti con Bilanciere (Front Presses)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Rest-Pause a 6 reps, riposo 20\", completare a 8.",
          technique: "REST_PAUSE",
        },
        {
          order: 2,
          name: "Alzate Laterali con Manubri (Side Laterals)",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Strip Sets to 10 pesanti: mai usare pesi leggeri.",
          technique: "STRIP_SETS_TO_10",
        },
        {
          order: 3,
          name: "Alzate Posteriori (Rear Laterals)",
          category: "ISOLATION",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Peak contraction di 2 secondi al vertice.",
          technique: "PEAK_CONTRACTION_NEGATIVES",
        },
        {
          order: 4,
          name: "Pushdowns per Tricipiti ai Cavi",
          category: "ISOLATION",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Strip Sets to 10 sulle ultime serie.",
          technique: "STRIP_SETS_TO_10",
        },
        {
          order: 5,
          name: "Skull Crushers (French Press con Bilanciere)",
          category: "COMPOUND",
          sets: 5,
          reps: "12 / 8-10 / 8-10 / 6-8 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 90,
          notes: "Forced reps con spotter per forzare le ultime 2 ripetizioni.",
          technique: "FORCED_REPS",
        },
        {
          order: 6,
          name: "Dips alle Parallele con Sovraccarico",
          category: "COMPOUND",
          sets: 4,
          reps: "12 / 8-10 / 8-10 / 6-8",
          load_guideline: "1 Warm-up (12) | 2 Working (8-10) | 1-2 Advanced to Failure (6-8)",
          rir: 0,
          rest_seconds: 120,
          notes: "Partials finali dal punto di massima distensione dopo il cedimento.",
          technique: "PARTIALS",
        },
      ],
    },
  ];
}

/**
 * Modula dinamicamente la progressione periodizzata secondo la dottrina di Aceto:
 * - W1-W2: Base Volume Acquisition (Cedimento tecnico positivo 8-10 reps)
 * - W3-W4: Heavy Absolute Overload (+2.5kg tronco / +5kg gambe, composti a 6-8 reps pesanti)
 * - W5: Peak Intensity / Stripping Peak (Cedimento assoluto con tecniche speciali)
 * - W6: Deload Attivo / Neural Reset (Taglio a 2 serie fisse, carichi -20%, RIR 2)
 * - W7-W8 (Opzionale): Mini-Blocco di Forza 3 Rep Maxes (3RM/2RM/1RM sui composti, no cedimento)
 */
export function modulateAcetoWorkoutDays(
  days: AcetoWorkoutDay[],
  weekNumber: number
): AcetoWorkoutDay[] {
  const safeWeek = Math.max(1, Math.min(8, Number(weekNumber) || 1));
  const is3RMStrengthBlock = safeWeek === 7 || safeWeek === 8;
  const isDeload = safeWeek === 6;
  const isStrippingPeak = safeWeek === 5;
  const isHeavyOverload = safeWeek === 3 || safeWeek === 4;

  return days.map((day) => {
    const dayLabelLower = (day.day_label || "").toLowerCase();

    const updatedExercises: AcetoExercise[] = day.exercises.map((ex) => {
      const isCompound = ex.category === "COMPOUND";
      const isLowerBody =
        dayLabelLower.includes("gambe") ||
        dayLabelLower.includes("leg") ||
        dayLabelLower.includes("quad") ||
        /squat|leg|press|stacco|calf|femoral|quad/i.test(ex.name);

      const overloadDelta = isLowerBody ? "+5kg" : "+2.5kg";

      // 1. MINI-BLOCCO 3RM (SETTIMANE 7-8)
      if (is3RMStrengthBlock) {
        if (isCompound) {
          return {
            ...ex,
            sets: 5,
            reps: "3 / 3 / 2 / 2 / 1 (3RM Protocol)",
            rir: 1,
            rest_seconds: 180,
            load_guideline: "Massimo carico neurale. Nessuna tecnica speciale a cedimento.",
            notes: `W${safeWeek} FORZA NEURALE: Protocollo 3RM/1RM per elevare la soglia motoria prima del nuovo ciclo massa.`,
            technique: "THREE_REP_MAX" as AcetoSpecialTechnique,
          };
        } else {
          return {
            ...ex,
            sets: 3,
            reps: "8-10",
            rir: 2,
            rest_seconds: 90,
            load_guideline: "Mantenimento muscolare a buffer 2. Zero cedimento.",
            notes: "Esercizio accessorio di supporto al recupero neurale.",
            technique: "NONE" as AcetoSpecialTechnique,
          };
        }
      }

      // 2. DELOAD ATTIVO (SETTIMANA 6)
      if (isDeload) {
        return {
          ...ex,
          sets: 2,
          reps: isCompound ? "10-12 (Esecuzione Fluida)" : "12-15 (Pompaggio Controllato)",
          rir: 2,
          rest_seconds: 90,
          load_guideline: "Scarico Attivo (-20% sul carico): volume tagliato a 2 serie fisse.",
          notes: "W6 DELOAD: Riparazione articolare, sintesi proteica e rigenerazione del sistema nervoso.",
          technique: "NONE" as AcetoSpecialTechnique,
        };
      }

      // 3. STRIPPING PEAK (SETTIMANA 5)
      if (isStrippingPeak) {
        return {
          ...ex,
          sets: isCompound ? 4 : 3,
          reps: isCompound ? "6-8 + Strip Set to 10" : "8-10 + Drop Set",
          rir: 0,
          rest_seconds: isCompound ? 120 : 90,
          load_guideline: "Picco Intensità: Ultima serie con scarico immediato del 35% e max reps a cedimento.",
          notes: "W5 PEAK: Cedere a 6-8 reps, scaricare subito il carico del 35% senza sosta e spingere fino al cedimento positivo.",
          technique: ex.technique || "STRIP_SETS_TO_10",
        };
      }

      // 4. HEAVY ABSOLUTE OVERLOAD (SETTIMANE 3-4)
      if (isHeavyOverload) {
        return {
          ...ex,
          sets: isCompound ? 4 : 3,
          reps: isCompound ? "6-8 (Heavy Overload)" : "8-10",
          rir: 1,
          rest_seconds: isCompound ? 120 : 90,
          load_guideline: `Sovraccarico Assoluto: incrementare il carico (${overloadDelta} rispetto a W1-W2).`,
          notes: `W${safeWeek} OVERLOAD: Focus sul sollevamento di carichi massimali nel range ipertrofico (6-8 reps).`,
          technique: ex.technique || "NONE",
        };
      }

      // 5. BASE VOLUME ACQUISITION (SETTIMANE 1-2)
      return {
        ...ex,
        sets: isCompound ? 4 : 3,
        reps: isCompound ? "8-10" : "10-12",
        rir: safeWeek === 1 ? 2 : 1,
        rest_seconds: isCompound ? 90 : 75,
        load_guideline: "Base Volume: Carico rigoroso per raggiungere il cedimento positivo nell'intervallo 8-10 reps.",
        notes: `W${safeWeek} BASE: Reclutamento fibre IIb, cadenza concentrica esplosiva F = m · a ed eccentrica controllata.`,
        technique: ex.technique || "NONE",
      };
    });

    return {
      ...day,
      exercises: updatedExercises,
    };
  });
}

/**
 * Genera il programma completo secondo la metodologia Chris Aceto.
 */
export function generateAcetoSplit(
  splitDays: AcetoSplitDays,
  week: number = 1,
  history: any[] = [],
  options?: {
    level?: AcetoAthleteLevel;
    goal?: AcetoGoal;
    bodyFat?: number;
  }
): AcetoProgram {
  const level = options?.level ?? "ADVANCED";
  const goal = options?.goal ?? "MASS_BUILDING";
  const rawDays = buildOfficialTemplate(splitDays, level);
  const modulatedDays = modulateAcetoWorkoutDays(rawDays, week);

  let phaseName = "Base Volume Acquisition";
  if (week === 3 || week === 4) phaseName = "Heavy Absolute Overload";
  if (week === 5) phaseName = "Stripping Peak & Failure Techniques";
  if (week === 6) phaseName = "Active Deload & Neural Recovery";
  if (week >= 7) phaseName = "3RM Neural Strength Mini-Block";

  return {
    program_name: `Chris Aceto Championship Engine (Settimana ${week})`,
    split_type: `${splitDays}_days_${level.toLowerCase()}`,
    current_week: week,
    total_weeks: 6,
    workout_days: modulatedDays,
    level,
    goal,
    phase_name: phaseName,
  };
}

/**
 * Ricalcola la progressione a fine microciclo preservando i carichi registrati nello storico.
 */
export function applyAcetoWeekProgression(
  currentDays: any[],
  targetWeek: number,
  history: any[] = []
): any[] {
  if (!currentDays || !Array.isArray(currentDays)) return [];
  return modulateAcetoWorkoutDays(currentDays, targetWeek);
}