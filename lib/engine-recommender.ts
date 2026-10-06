// lib/engine-recommender.ts

export type EngineType = 'TOPGYM_BLOCKS' | 'HARDTOPGYM' | 'ACETO' | 'NOCERINO';
export type AthleteExperience = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PrimaryGoal = 'HYPERTROPHY' | 'STRENGTH_HYPERTROPHY' | 'FITNESS_COMPOSITION' | 'CONTEST_PREP';
export type AvailableDays = 2 | 3 | 4 | 5 | 6;
export type IntensityPreference = 'BUFFER' | 'FAILURE_HEAVY' | 'FAILURE_PUMP' | 'TUT_CONTROLLED';
export type PeriodizationHorizon = 'SHORT_TERM' | 'CYCLIC_4_WEEKS' | 'CHAMPIONSHIP_6_WEEKS' | 'LONG_TERM_4_MONTHS';

export interface QuestionnaireAnswers {
  experience: AthleteExperience;
  goal: PrimaryGoal;
  daysPerWeek: AvailableDays;
  intensity: IntensityPreference;
  horizon: PeriodizationHorizon;
}

export interface EngineRecommendationResult {
  recommendedEngine: EngineType;
  matchScore: number; // Percentuale 0 - 100
  rationale: string;
  suggestedSplit: string;
  scores: Record<EngineType, number>;
}

export function evaluateAthleteProfile(answers: QuestionnaireAnswers): EngineRecommendationResult {
  const scores: Record<EngineType, number> = {
    TOPGYM_BLOCKS: 0,
    HARDTOPGYM: 0,
    ACETO: 0,
    NOCERINO: 0
  };

  // 1. ESPERIENZA
  switch (answers.experience) {
    case 'BEGINNER':
      scores.TOPGYM_BLOCKS += 40;
      scores.NOCERINO += 15;
      scores.HARDTOPGYM += 5;
      scores.ACETO += 0;
      break;
    case 'INTERMEDIATE':
      scores.TOPGYM_BLOCKS += 25;
      scores.HARDTOPGYM += 30;
      scores.NOCERINO += 35;
      scores.ACETO += 20;
      break;
    case 'ADVANCED':
      scores.ACETO += 40;
      scores.NOCERINO += 30;
      scores.HARDTOPGYM += 30;
      scores.TOPGYM_BLOCKS += 10;
      break;
  }

  // 2. GIORNI SETTIMANALI DISPONIBILI
  switch (answers.daysPerWeek) {
    case 2:
      scores.TOPGYM_BLOCKS += 35;
      scores.HARDTOPGYM += 15;
      scores.NOCERINO += 5;
      scores.ACETO += 0;
      break;
    case 3:
      scores.NOCERINO += 40; // Ottimale per i 3 giorni rotanti
      scores.HARDTOPGYM += 30;
      scores.TOPGYM_BLOCKS += 25;
      scores.ACETO += 15;
      break;
    case 4:
      scores.ACETO += 35; // 4 ON 1 OFF o Intermedio A/B
      scores.HARDTOPGYM += 30;
      scores.TOPGYM_BLOCKS += 25;
      scores.NOCERINO += 20;
      break;
    case 5:
    case 6:
      scores.ACETO += 45; // 2 ON 1 OFF o Monomuscolare 6 giorni
      scores.TOPGYM_BLOCKS += 15;
      scores.HARDTOPGYM += 10;
      scores.NOCERINO += 15;
      break;
  }

  // 3. OBIETTIVO PRIMARIO
  switch (answers.goal) {
    case 'FITNESS_COMPOSITION':
      scores.TOPGYM_BLOCKS += 35;
      scores.HARDTOPGYM += 20;
      scores.NOCERINO += 15;
      scores.ACETO += 10;
      break;
    case 'STRENGTH_HYPERTROPHY':
      scores.HARDTOPGYM += 35;
      scores.NOCERINO += 30;
      scores.TOPGYM_BLOCKS += 20;
      scores.ACETO += 20;
      break;
    case 'HYPERTROPHY':
      scores.ACETO += 35;
      scores.NOCERINO += 30;
      scores.HARDTOPGYM += 25;
      scores.TOPGYM_BLOCKS += 15;
      break;
    case 'CONTEST_PREP':
      scores.ACETO += 45;
      scores.NOCERINO += 25;
      scores.HARDTOPGYM += 15;
      scores.TOPGYM_BLOCKS += 0;
      break;
  }

  // 4. STILE D'INTENSITÀ PREFERITO
  switch (answers.intensity) {
    case 'BUFFER':
      scores.TOPGYM_BLOCKS += 35;
      scores.NOCERINO += 15;
      scores.HARDTOPGYM += 0;
      scores.ACETO += 5;
      break;
    case 'FAILURE_HEAVY':
      scores.HARDTOPGYM += 40;
      scores.ACETO += 25;
      scores.NOCERINO += 20;
      scores.TOPGYM_BLOCKS += 5;
      break;
    case 'FAILURE_PUMP':
      scores.ACETO += 40;
      scores.NOCERINO += 20;
      scores.HARDTOPGYM += 15;
      scores.TOPGYM_BLOCKS += 10;
      break;
    case 'TUT_CONTROLLED':
      scores.NOCERINO += 45; // TUT 2-0-2 rigoroso a 24 secondi
      scores.ACETO += 20;
      scores.TOPGYM_BLOCKS += 15;
      scores.HARDTOPGYM += 10;
      break;
  }

  // 5. ORIZZONTE DI PROGRAMMAZIONE
  switch (answers.horizon) {
    case 'SHORT_TERM':
      scores.TOPGYM_BLOCKS += 30;
      scores.HARDTOPGYM += 20;
      scores.ACETO += 10;
      scores.NOCERINO += 5;
      break;
    case 'CYCLIC_4_WEEKS':
      scores.HARDTOPGYM += 35;
      scores.TOPGYM_BLOCKS += 20;
      scores.ACETO += 15;
      scores.NOCERINO += 15;
      break;
    case 'CHAMPIONSHIP_6_WEEKS':
      scores.ACETO += 40;
      scores.HARDTOPGYM += 20;
      scores.NOCERINO += 20;
      scores.TOPGYM_BLOCKS += 10;
      break;
    case 'LONG_TERM_4_MONTHS':
      scores.NOCERINO += 45; // 4 mesi sequenziali: Carico -> Reps -> Scarico -> Serie -> Densità
      scores.ACETO += 20;
      scores.HARDTOPGYM += 15;
      scores.TOPGYM_BLOCKS += 10;
      break;
  }

  // CALCOLO VINCITORE CON CICLO FOR..OF (Risolve il bug di narrowing TS2678)
  const engineKeys: EngineType[] = ['TOPGYM_BLOCKS', 'HARDTOPGYM', 'ACETO', 'NOCERINO'];
  let bestEngine: EngineType = 'TOPGYM_BLOCKS';
  let highestScore = -1;

  for (const engine of engineKeys) {
    if (scores[engine] > highestScore) {
      highestScore = scores[engine];
      bestEngine = engine;
    }
  }

  // Normalizzazione punteggio percentuale
  const normalizedMatch = Math.min(99, Math.round((highestScore / 195) * 100));

  let rationale = '';
  let suggestedSplit = '';

  switch (bestEngine) {
    case 'NOCERINO':
      rationale = 'Il profilo richiede progressione controllata a lungo termine basata sul tempo sotto tensione (TUT 2-0-2) e rotazione a 3 giorni. Il metodo a 4 fasi di Piero Nocerino assicura adattamenti fisiologici ordinati: carico nel M1, ripetizioni nel M2, volume serie nel M3 e densità nel M4.';
      suggestedSplit = '3 Giorni Rotanti (Schiena/Femorali/Bicipiti, Gambe/Lombari/Addome, Petto/Spalle/Tricipiti)';
      break;
    case 'ACETO':
      rationale = 'L\'atleta ha maturato una solida anzianità e ricerca la massima ipertrofia tramite sovraccarico assoluto, reclutamento fibre IIb e tecniche ad alta intensità (Rest-Pause, Strip Sets, Negatives). Il microciclo a 6 settimane con progressione dei carichi è ottimale.';
      suggestedSplit = answers.daysPerWeek >= 5 ? 'Avanzato 2 ON / 1 OFF (o Monomuscolare 6 Giorni)' : 'Intermedio A/B 4 Giorni (4 ON 1 OFF)';
      break;
    case 'HARDTOPGYM':
      rationale = 'Ideale per atleti che rispondono al massimo sforzo neurale con sedute brevi e intense (Heavy Duty / Bosco-Colli). La programmazione mensile a 4 settimane modula lo stimolo ormonale alternando settimane di carico a buffer ridotto e scarico strategico.';
      suggestedSplit = '3 o 4 Giorni ad Alta Intensità Neurale';
      break;
    case 'TOPGYM_BLOCKS':
    default:
      rationale = 'La configurazione ottimale privilegia la progressione lineare a blocchi con buffer gestibile e volume distribuito. Permette di costruire aderenza, coordinazione intermuscolare e base di lavoro senza rischio di sovrallenamento sistemico.';
      suggestedSplit = `${answers.daysPerWeek} Giorni Multi-frequenza / Upper-Lower`;
      break;
  }

  return {
    recommendedEngine: bestEngine,
    matchScore: normalizedMatch,
    rationale,
    suggestedSplit,
    scores
  };
}