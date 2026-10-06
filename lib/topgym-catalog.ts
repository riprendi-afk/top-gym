// lib/topgym-catalog.ts

export type Gender = 'MALE' | 'FEMALE';
export type TrainingLevel = 'NEOFITA' | 'INTERMEDIO' | 'AVANZATO';
export type PsychologicalProfile =
  | 'CAUTO_ANSIA_CARICO'
  | 'AGGRESSIVO_NEURALE'
  | 'METABOLICO_PUMPING'
  | 'TIME_CONSTRAINED';

export type HatfieldSegment = 'NEURALE' | 'MECCANICO' | 'METABOLICO' | 'CORE_CARDIO';

export interface ExerciseDefinition {
  order: number;
  name: string;
  targetMuscle: string;
  segment: HatfieldSegment;
  sets: number;
  reps: string;
  restSeconds: number;
  effort: string;
  technique: string;
  notes: string;
}

export interface TemplateSession {
  dayLabel: string;
  sessionFocus: string;
  exercises: ExerciseDefinition[];
}

export interface TemplateMeta {
  id: string; // T01 .. T30
  title: string;
  group: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZATO';
  daysCount: number;
  primaryEngine: 'TOPGYM_BLOCKS' | 'HARDTOPGYM' | 'ACETO' | 'NOCERINO';
  description: string;
  generateSessions: (gender: Gender) => TemplateSession[];
}

// ============================================================================
// CATALOGO MASTER CON SCHEDE AVANZATE A 6-8 ESERCIZI
// ============================================================================

export const TOPGYM_TEMPLATES_CATALOG: Record<string, TemplateMeta> = {
  // --------------------------------------------------------------------------
  // T01: PRINCIPIANTE 3 GIORNI (Full Body Lineare Kraemer - 6 Esercizi)
  // --------------------------------------------------------------------------
  T01: {
    id: 'T01',
    title: 'Full Body 3 Giorni Lineare (A-B-A / B-A-B)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Progressione lineare Kraemer su multiarticolari fondamentali e complementari di stabilità.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno A: Full Body Fondamentale & Spinta',
        sessionFocus: 'Schema Motorio Gambe, Spinta & Trazione',
        exercises: [
          { order: 1, name: 'Squat al Multipower / Box Squat', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'NONE', notes: 'Profondità costante al parallelo, zero cedimento.' },
          { order: 2, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1 secondo, scapole addotte.' },
          { order: 3, name: 'Lat machine presa prona', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione al mento con gomiti in basso.' },
          { order: 4, name: 'Lento con manubri seduto', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata senza inarcare la lombare.' },
          { order: 5, name: 'Panca lombari hyperextension', targetMuscle: 'Lombari/Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza iperestendere.' },
          { order: 6, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Bacino neutro e tenuta addominale solida.' }
        ]
      },
      {
        dayLabel: 'Giorno B: Full Body Catena Posteriore & Trazione',
        sessionFocus: 'Cerniera d\'Anca, Dorso & Braccia',
        exercises: [
          { order: 1, name: 'Stacco rumeno con manubri', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione d\'anca e schiena perfettamente neutra.' },
          { order: 2, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Piedi a centro pedana, discesa profonda.' },
          { order: 3, name: 'Pulley basso con triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in fuori e spalle depresse.' },
          { order: 4, name: 'Spinte con manubri su panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti a 45° rispetto al busto.' },
          { order: 5, name: 'Curl manubri alternato + Pushdown cavo', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Superset antagonisti braccia.' },
          { order: 6, name: 'Crunch su tappetino a gambe flesse', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione completa in chiusura.' }
        ]
      },
      {
        dayLabel: 'Giorno C: Full Body Consolidamento & Volume',
        sessionFocus: 'Richiamo Globale e Macchine Guidate',
        exercises: [
          { order: 1, name: 'Leg Press 45° (Carico medio-pesante)', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata dai talloni.' },
          { order: 2, name: 'Chest Press orizzontale a selettore', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria vincolata guidata.' },
          { order: 3, name: 'Rematore manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomito verso la tasca posteriore.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Perno allineato all\'asse del ginocchio.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria a 45° sul piano scapolare.' },
          { order: 6, name: 'Plank con ginocchia al petto', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '30"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Controllo della parete addominale.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T07: FEMMINILE 3 GIORNI (Cerniera d'Anca & Glutei - 6 Esercizi)
  // --------------------------------------------------------------------------
  T07: {
    id: 'T07',
    title: 'Femminile Cerniera d\'Anca & Glutei (3 Giorni)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Enfasi su cerniera d\'anca (Hip Thrust/RDL), V-taper e prevenzione della ritenzione idrica con LISS drenante.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Glutei Pesanti & Catena Posteriore',
        sessionFocus: 'Attivazione Cerniera d\'Anca e Femorali',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere o macchina', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto a ogni ripetizione.' },
          { order: 2, name: 'Stacco rumeno con manubri (RDL)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Frecce eccentrica controllata di 3".' },
          { order: 3, name: 'Lat machine presa inversa stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Postura scapolare aperta.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti.' },
          { order: 5, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura con sosta di 1".' },
          { order: 6, name: 'Camminata in salita LISS (Tapis Roulant)', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h per favorire il ritorno venoso.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper V-Taper & Core Posturale',
        sessionFocus: 'Dorso, Deltoidi e Spalle Rotonde',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Tirata al petto a gomiti stretti.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto / Clavicolare', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Mantenimento tono clavicolare senza esagerare.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura scapolare controllata.' },
          { order: 4, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria pulita senza slancio del busto.' },
          { order: 5, name: 'Pushdown fune per tricipiti', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura della corda in basso.' },
          { order: 6, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Retroversione del bacino solida.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe Globale & Richiamo Glutei',
        sessionFocus: 'Box Squat, Affondi e Isolamento Gluteo',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower / Libero', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sulla panca senza rilassare il core.' },
          { order: 2, name: 'Affondi camminati con manubri', targetMuscle: 'Glutei / Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo lungo, busto leggermente flesso in avanti.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'ROM controllato senza scatti articolari.' },
          { order: 4, name: 'Slanci al cavo per glutei (Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'RIR 1', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di contrazione al punto massimo.' },
          { order: 5, name: 'Hyperextension con focus glutei (busto curvo)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Piedi a 45° all\'esterno, schiena arrotondata.' },
          { order: 6, name: 'Bike reclinata defaticante LISS', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pedalata fluida a 70 rpm.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T12: AVANZATO / INTERMEDIO 3 GIORNI (PPL High-Volume Top Gym - 7 Esercizi)
  // --------------------------------------------------------------------------
  T12: {
    id: 'T12',
    title: 'Push / Pull / Legs 3 Giorni Avanzata (High-Density Top Gym)',
    group: 'AVANZATO',
    daysCount: 3,
    primaryEngine: 'HARDTOPGYM',
    description: 'Protocollo PPL a 3 giorni per atleti intermedi/avanzati: 7 esercizi a seduta strutturati sui segmenti Hatfield con tecniche speciali.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Petto, Spalle Anteriori/Laterali & Tricipiti)',
        sessionFocus: 'Forza Neurale Panca, Volume Meccanico & Stripping Deltoidi',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Pettorale Centrale', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 150, effort: 'RIR 1-2 (CAT)', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Fermo al petto di 1", spinta esplosiva concentrica massimale.' },
          { order: 2, name: 'Spinte con manubri su panca a 30°', targetMuscle: 'Fascio Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Freno eccentrico di 3", massima estensione in sicurezza.' },
          { order: 3, name: 'Chest Press convergente a selettore', targetMuscle: 'Pettorale Basso/Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie pesanti + 1 serie finale scaricata del 25% a cedimento.' },
          { order: 4, name: 'Lento avanti con manubri seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°, spinta lineare in asse con le orecchie.' },
          { order: 5, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Ultima serie: 12 reps -> drop 30% -> max reps -> drop 30% -> max reps.' },
          { order: 6, name: 'French press bilanciere EZ su panca piana', targetMuscle: 'Tricipiti (Capo Lungo)', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa dietro la nuca controllata, gomiti stretti.' },
          { order: 7, name: 'Pushdown al cavo alto con corda', targetMuscle: 'Tricipiti (Capo Laterale)', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Aprire la corda in basso con sosta isometrica di 1.5".' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Dorso Spessore, Ampiezza, Posteriori & Bicipiti)',
        sessionFocus: 'Rack Pull Neurale, Trazioni Pesanti & Pompaggio Braccia',
        exercises: [
          { order: 1, name: 'Rack Pull / Stacco al rack da sotto il ginocchio', targetMuscle: 'Catena Posteriore / Dorso', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'RIR 1-2', technique: 'NONE', notes: 'Carico elevato, chiusura d\'anca decisa e scapole serrate.' },
          { order: 2, name: 'Rematore con bilanciere presa prona 45°', targetMuscle: 'Gran Dorsale / Spessore', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione decisa all\'ombelico con schiena bloccata.' },
          { order: 3, name: 'Trazioni alla sbarra zavorrate / Lat machine neutra', targetMuscle: 'Gran Dorsale (Ampiezza)', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo di 1" al petto, discesa completa in allungamento.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps pesanti + scarico immediato del 40% a max ripetizioni.' },
          { order: 5, name: 'Face pull al cavo alto con corda', targetMuscle: 'Deltoidi Posteriori & Extra-rotatori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Tirata alla fronte con apertura gomiti a 90°.' },
          { order: 6, name: 'Curl con bilanciere dritto / sagomato EZ', targetMuscle: 'Bicipiti Brachiali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti fermi ai fianchi, salita esplosiva e discesa in 3".' },
          { order: 7, name: 'Hammer curl con manubri su panca inclinata', targetMuscle: 'Brachioradiale / Bicipite', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Presa neutra, drop set all\'ultima serie.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs (Quadricipiti, Ischiocrurali, Glutei & Polpacci)',
        sessionFocus: 'Squat Pesante, Volume Pressa & Isolamento Catena Posteriore',
        exercises: [
          { order: 1, name: 'Squat con bilanciere libero / Hack Squat', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 180, effort: 'RIR 2 (Tecnico)', technique: 'NONE', notes: 'Discesa in 3 secondi controllati, risalita decisa senza rimbalzo.' },
          { order: 2, name: 'Leg Press 45° a piedi paralleli a centro pedana', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie target + 1 serie finale a -25% a cedimento concentrico.' },
          { order: 3, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Bacino proiettato indietro, allungamento massimo dei femorali.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei / Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Piede posteriore su panca, busto inclinato di 20°.' },
          { order: 5, name: 'Leg extension alla macchina', targetMuscle: 'Quadricipiti (Retto Femorale)', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a esaurimento positivo.' },
          { order: 6, name: 'Leg curl sdraiato o seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo di 1.5" in massima flessione.' },
          { order: 7, name: 'Calf alla pressa o alla Smith Machine', targetMuscle: 'Polpacci (Gastrocnemio)', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso e contrazione di 1" in alto.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T11: INTERMEDIO 4 GIORNI (Upper / Lower Hatfield - 7 Esercizi)
  // --------------------------------------------------------------------------
  T11: {
    id: 'T11',
    title: 'Upper / Lower 4 Giorni Metodo Hatfield',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HARDTOPGYM',
    description: 'Sequenza Neurale -> Meccanico -> Metabolico con progressione settimanale dei carichi su 7 esercizi a seduta.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Hatfield Power & Neurale',
        sessionFocus: 'Neurale Pesante Panca, Trazioni & Spalle',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 150, effort: 'RIR 2 (CAT)', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Spinta esplosiva concentrica al massimo carico.' },
          { order: 2, name: 'Rematore bilanciere presa prona', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Busto solido a 45°.' },
          { order: 3, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa controllata in 3 secondi.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Petto aperto e spalle depresse.' },
          { order: 5, name: 'Lento con manubri seduto', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta in asse verticale.' },
          { order: 6, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 7, name: 'Pushdown barra a V cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Hatfield Power & Neurale',
        sessionFocus: 'Neurale Pesante Squat, Stacco & Catena Posteriore',
        exercises: [
          { order: 1, name: 'Squat con bilanciere libero / Hack Squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa controllata di 3", risalita potente.' },
          { order: 2, name: 'Stacco da terra rumeno bilanciere', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Femorali in massima tensione, schiena neutra.' },
          { order: 3, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie target + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Affondi camminati con manubri', targetMuscle: 'Glutei / Gambe', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo medio con tronco saldo.' },
          { order: 5, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a esaurimento.' },
          { order: 6, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1.5" di fermo in massima flessione.' },
          { order: 7, name: 'Calf alla macchina in piedi', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Fermo 2" in massimo stretch.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper Hatfield Hypertrophy & Pump',
        sessionFocus: 'Volume Meccanico, Trazioni & Braccia',
        exercises: [
          { order: 1, name: 'Lat machine presa prona / Trazioni', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione piena con fermo al petto.' },
          { order: 2, name: 'Spinte manubri panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Controllo della discesa.' },
          { order: 3, name: 'Chest Press convergente a selettore', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 4, name: 'Rematore manubrio singolo su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione gomito radente il fianco.' },
          { order: 5, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set all\'ultima serie.' },
          { order: 6, name: 'French press EZ + Curl bilanciere EZ', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset antagonisti braccia.' },
          { order: 7, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua della corda.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Hatfield Hypertrophy & Pump',
        sessionFocus: 'Densità Metabolica, Gambe & Addome',
        exercises: [
          { order: 1, name: 'Leg Press piedi larghi e alti', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta dai talloni con ROM completo.' },
          { order: 2, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Schiena neutra, tensione femorale.' },
          { order: 3, name: 'Hack Squat / Multipower piedi avanzati', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Serie back-off -25% a fine esercizio.' },
          { order: 4, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set finale.' },
          { order: 5, name: 'Leg Curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di contrazione continua.' },
          { order: 6, name: 'Calf seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch profondo in basso.' },
          { order: 7, name: 'Crunch al cavo con corda (in ginocchio)', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Flessione toracica espirando.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T18: FEMMINILE 4 GIORNI (Upper / Lower con Back-Off - 7 Esercizi)
  // --------------------------------------------------------------------------
  T18: {
    id: 'T18',
    title: 'Femminile Upper / Lower con Back-Off (4 Giorni)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Alto volume glutei/catena posteriore, serie back-off (-25%) e LISS post-allenamento su 7 esercizi completi.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei Neurale & Catena Posteriore)',
        sessionFocus: 'Hip Thrust, Stacco Rumeno, Pressa & Back-Off',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto a ogni ripetizione. Tibie verticali.' },
          { order: 2, name: 'Stacco Rumeno con manubri (RDL)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa 3" controllata fermandosi a metà tibia.' },
          { order: 3, name: 'Leg Press 45° piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie standard + 1 serie back-off -25% a cedimento.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato a 20° per colpire il gluteo.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima flessione.' },
          { order: 6, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 0', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 7, name: 'Tapis roulant in pendenza LISS', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h per drenaggio lattato.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (V-Taper, Deltoidi & Postura)',
        sessionFocus: 'Dorso, Deltoidi Laterali & Fascio Clavicolare',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra stretta', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Trazione esplosiva al petto.' },
          { order: 2, name: 'Spinte manubri su panca a 30°', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45° per tutelare l\'articolazione.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Lento con manubri seduta', targetMuscle: 'Spalle Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°, spinta controllata.' },
          { order: 5, name: 'Alzate laterali con manubri seduta', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a fine serie.' },
          { order: 6, name: 'Pushdown fune cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura corda continua.' },
          { order: 7, name: 'Plank su avambracci', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Bacino retroverso e glutei serrati.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti Controllati & Glutei in Allungamento)',
        sessionFocus: 'Box Squat, Affondi, Leg Extension & Slanci Cavi',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower (Talloni larghi)', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sul box alto.' },
          { order: 2, name: 'Leg Press 45° piedi intermedi', targetMuscle: 'Quadricipiti / Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa profonda senza sollevare i talloni.' },
          { order: 3, name: 'Stacco rumeno con manubri su rialzo', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo dei femorali.' },
          { order: 4, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti articolari.' },
          { order: 5, name: 'Slanci al cavo basso (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 6, name: 'Leg Curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in massima flessione.' },
          { order: 7, name: 'Bike reclinata defaticante LISS', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pedalata a bassa resistenza a 70 rpm.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B (Trazione Orizzontale, Spalle & Braccia)',
        sessionFocus: 'Dorso Orizzontale, Spalle Rotonde & Superset Braccia',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca inclinata', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in appoggio, gomiti aderenti.' },
          { order: 2, name: 'Lat machine presa inversa', targetMuscle: 'Dorso (Fascio Basso)', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata controllata al petto.' },
          { order: 3, name: 'Spinte manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Movimento fluido di mantenimento tono.' },
          { order: 4, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Cavo dietro la schiena + back-off -25%.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua a 90°.' },
          { order: 6, name: 'Pushdown corda + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset antagonisti braccia.' },
          { order: 7, name: 'Crunch su palla medica / tappetino', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura toracica espirando.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T25: AVANZATO 6 GIORNI (Chris Aceto PPL x2 - 7 Esercizi)
  // --------------------------------------------------------------------------
  T25: {
    id: 'T25',
    title: 'Push / Pull / Legs 6 Giorni Multifrequenza 2x (Metodo Aceto)',
    group: 'AVANZATO',
    daysCount: 6,
    primaryEngine: 'ACETO',
    description: 'Protocollo Chris Aceto ad altissimo volume e reclutamento fibre IIb: 7 esercizi a seduta con Rest-Pause e Stripping to 10.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push A (Petto Pesante & Spalle Anteriori/Laterali)',
        sessionFocus: 'Sovraccarico Meccanico Clavicolare & Rest-Pause',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Pettorale Centrale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Ultima serie: 20" rest-pause all\'esaurimento.' },
          { order: 2, name: 'Spinte con manubri su panca a 30°', targetMuscle: 'Fascio Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'Cedimento + Forzate', technique: 'NONE', notes: '2 reps forzate assistite.' },
          { order: 3, name: 'Chest Press convergente a selettore', targetMuscle: 'Pettorale Basso/Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 a fine serie.' },
          { order: 4, name: 'Dip alle parallele zavorrate', targetMuscle: 'Pettorale / Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato in avanti.' },
          { order: 5, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo in alto al parallelo.' },
          { order: 6, name: 'French press bilanciere EZ panca piana', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Discesa controllata dietro la nuca.' },
          { order: 7, name: 'Pushdown barra a V cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a cedimento.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull A (Dorso Spessore & Bicipiti Pesanti)',
        sessionFocus: 'Rack Pull Neurale, Rematore & Bicipiti Massimali',
        exercises: [
          { order: 1, name: 'Rack Pull (Stacco al rack da sotto il ginocchio)', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Massimo carico assoluto con 20" rest-pause.' },
          { order: 2, name: 'Rematore bilanciere presa prona', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 3, reps: '8', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Trazione decisa all\'ombelico con busto a 45°.' },
          { order: 3, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 a fine serie.' },
          { order: 4, name: 'Pullover al cavo alto con corda', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di sosta a braccia tese in basso.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua verso la fronte.' },
          { order: 6, name: 'Curl con bilanciere dritto in piedi', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '8 reps + 4 parziali dal basso a esaurimento.' },
          { order: 7, name: 'Curl manubri su panca a 60°', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Massimo allungamento gomiti indietro.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs A (Quadricipiti Dominant & Forza)',
        sessionFocus: 'Hack Squat, Pressa Stretta & Isolamento Neurale',
        exercises: [
          { order: 1, name: 'Hack Squat o Squat bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Discesa profonda, 20" rest-pause all\'ultima serie.' },
          { order: 2, name: 'Leg Press 45° piedi stretti e bassi', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 pesante con -25% carico.' },
          { order: 3, name: 'Affondi bulgari alla Smith Machine', targetMuscle: 'Quadricipiti / Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Ginocchio avanti sopra la caviglia.' },
          { order: 4, name: 'Leg Extension alla macchina', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" in massima estensione.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Flessione decisa senza rimbalzi.' },
          { order: 6, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso e fermo in alto.' },
          { order: 7, name: 'Crunch al cavo con corda in ginocchio', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Chiusura toracica ad alta densità.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Push B (Spalle, Pettorale Alto & Tricipiti)',
        sessionFocus: 'Military Press Neurale & Drop Set Deltoidi',
        exercises: [
          { order: 1, name: 'Military Press bilanciere in piedi', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Spinta esplosiva con core serrato.' },
          { order: 2, name: 'Panca inclinata 45° bilanciere', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Discesa 3" controllata.' },
          { order: 3, name: 'Spinte manubri panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido a ROM completo.' },
          { order: 4, name: 'Croci ai cavi alti', targetMuscle: 'Pettorale Basso', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Incrocio mani con 1" di contrazione.' },
          { order: 5, name: 'Alzate laterali manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop-set 10 reps pesanti + 10 scalate.' },
          { order: 6, name: 'Dip alle parallele a corpo libero / sovraccarico', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti aderenti al corpo.' },
          { order: 7, name: 'Pushdown corda per tricipiti', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a cedimento.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Pull B (Dorso Ampiezza & Ischiocrurali)',
        sessionFocus: 'Trazioni Zavorrate, Stacco Rumeno & Deltoidi Posteriori',
        exercises: [
          { order: 1, name: 'Trazioni alla sbarra zavorrate / Lat Machine', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Trazione decisa al petto con 20" rest-pause.' },
          { order: 2, name: 'Stacco rumeno con manubri o bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo dei femorali.' },
          { order: 3, name: 'Lat machine presa inversa stretta', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a 10 colpi.' },
          { order: 4, name: 'Rematore manubrio singolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione gomito-bacino.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua alla fronte.' },
          { order: 6, name: 'Curl su panca a 60° con manubri', targetMuscle: 'Bicipiti (Capo Lungo)', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Allungamento profondo in basso.' },
          { order: 7, name: 'Curl alla panca Scott bilanciere EZ', targetMuscle: 'Bicipiti (Picco)', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set finale a cedimento.' }
        ]
      },
      {
        dayLabel: 'Giorno 6: Legs B (Catena Posteriore, Femorali & Polpacci)',
        sessionFocus: 'Stacco Gambe Semitese, Pressa Piedi Alti & Drop Set',
        exercises: [
          { order: 1, name: 'Stacco a gambe semitese bilanciere', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Concentrica esplosiva, 20" rest-pause all\'ultima.' },
          { order: 2, name: 'Leg Press 45° piedi larghi e alti', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 scalando il 25%.' },
          { order: 3, name: 'Leg curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 4, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Contrazione di picco di 1.5".' },
          { order: 4, name: 'Affondi camminati con manubri', targetMuscle: 'Glutei / Gambe', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo lungo per focus gluteo.' },
          { order: 5, name: 'Leg extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Pompaggio terminale.' },
          { order: 6, name: 'Calf seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso.' },
          { order: 7, name: 'Plank con ginocchia al petto alternato', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta addominale continua.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T28: FEMMINILE AVANZATO 4 GIORNI (Glutei & Spalle Heavy - 7 Esercizi)
  // --------------------------------------------------------------------------
  T28: {
    id: 'T28',
    title: 'Femminile Advanced 4 Giorni Focus Glutei & Spalle',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'ACETO',
    description: 'Hip Thrust neurale pesante, jump set con bulgari, parziali pulsate su Abductor e rest-pause su 7 esercizi completi.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei & Catena Posteriore Heavy)',
        sessionFocus: 'Hip Thrust Neurale, RDL Pesante & Parziali Abductor',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '2" di fermo in alto + 20" rest-pause all\'ultima serie.' },
          { order: 2, name: 'Stacco rumeno pesante con bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Schiena iper-stabile, allungamento profondo.' },
          { order: 3, name: 'Leg Press 45° piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 10 reps + max reps scalando il 30%.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Busto inclinato a 25° in avanti.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima contrazione.' },
          { order: 6, name: 'Abductor machine busto a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '15 reps complete + 8 mezze ripetizioni pulsate in allungamento.' },
          { order: 7, name: 'Tapis roulant in pendenza LISS', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h per drenaggio lattato.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (Deltoidi Sculpt & Dorso V-Taper)',
        sessionFocus: 'Spalle Rotonde, Rest-Pause e Ampiezza Dorsale',
        exercises: [
          { order: 1, name: 'Lat machine presa neutra stretta', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Trazione al petto con 20" rest-pause.' },
          { order: 2, name: 'Lento con manubri seduta', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 3, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Mantenimento tono clavicolare.' },
          { order: 4, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 back-off -25% a cedimento.' },
          { order: 5, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a cedimento.' },
          { order: 6, name: 'Face pull corda cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo continuo.' },
          { order: 7, name: 'Plank con abduzione gamba alternata', targetMuscle: 'Core / Glutei', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta isometrica neutra.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti & Isolamento Anca)',
        sessionFocus: 'Hack Squat Guidato, Affondi & Slanci Cavi',
        exercises: [
          { order: 1, name: 'Hack Squat o Box Squat al Multipower', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '20" rest-pause sulla seconda serie allenante.' },
          { order: 2, name: 'Leg Press 45° piedi intermedi', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa profonda controllata.' },
          { order: 3, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento femorale continuo.' },
          { order: 4, name: 'Leg Extension alla macchina', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti.' },
          { order: 5, name: 'Slanci cavo basso per gluteo (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 4, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 6, name: 'Leg Curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in alto.' },
          { order: 7, name: 'Camminata in salita LISS defaticante', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B & Core (Richiamo Upper & Torso)',
        sessionFocus: 'Dorso Orizzontale, Petto Funzionale & Addome',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione gomito-bacino.' },
          { order: 2, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata pulita al petto.' },
          { order: 3, name: 'Spinte manubri panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 4, name: 'Alzate laterali manubri in piedi', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a cedimento.' },
          { order: 5, name: 'Face pull corda cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo continuo.' },
          { order: 6, name: 'Pushdown corda + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset braccia a fine seduta.' },
          { order: 7, name: 'Crunch su tappetino con gambe a 90°', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '20', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione toracica profonda.' }
        ]
      }
    ]
  }
};

// ============================================================================
// MATRICE DETERMINISTICA: VINCOLO FERREO SUI GIORNI RICHIESTI DALL'UTENTE
// ============================================================================

export function resolveTopGymTemplate(
  gender: Gender,
  level: TrainingLevel,
  profile: PsychologicalProfile,
  daysPerWeek: number
): { template: TemplateMeta; rationale: string } {
  let templateKey = 'T01';
  let rationale = '';

  // --------------------------------------------------------------------------
  // CASO 1: SELEZIONE 3 GIORNI (daysPerWeek === 3 o <= 3)
  // --------------------------------------------------------------------------
  if (daysPerWeek <= 3) {
    if (gender === 'FEMALE') {
      templateKey = 'T07';
      rationale = 'Atleta Donna (3 Giorni): Template T07 Cerniera d\'Anca & Glutei a 6 esercizi completi. Priorità su Hip Thrust, catena posteriore e V-taper con drenaggio LISS.';
    } else if (level === 'AVANZATO') {
      templateKey = 'T12';
      rationale = 'Atleta Uomo Avanzato (3 Giorni): Template T12 Push/Pull/Legs ad alta densità (7 esercizi a seduta). Distribuisce il volume sui 3 macro-distretti evitando sovrallenamento sistemico.';
    } else if (level === 'INTERMEDIO') {
      templateKey = 'T12';
      rationale = 'Atleta Uomo Intermedio (3 Giorni): Template T12 Push/Pull/Legs a 7 esercizi con alternanza Neurale/Meccanico/Metabolico per massimizzare la crescita su frequenza a 3 sedute.';
    } else {
      templateKey = 'T01';
      rationale = 'Atleta Uomo Neofita (3 Giorni): Template T01 Full Body Lineare Kraemer a 6 esercizi per consolidare la tecnica dei gesti fondamentali a buffer costante (RIR 2).';
    }
  }

  // --------------------------------------------------------------------------
  // CASO 2: SELEZIONE 4 GIORNI (daysPerWeek === 4)
  // --------------------------------------------------------------------------
  else if (daysPerWeek === 4) {
    if (gender === 'FEMALE') {
      if (level === 'AVANZATO') {
        templateKey = 'T28';
        rationale = 'Atleta Donna Avanzata (4 Giorni): Template T28 Focus Glutei & Spalle a 7 esercizi. Hip Thrust neurale pesante, superserie con bulgari e parziali pulsate su Abductor.';
      } else {
        templateKey = 'T18';
        rationale = 'Atleta Donna Intermedia/Base (4 Giorni): Template T18 Upper/Lower con Back-off (-25%) e LISS drenante su 7 esercizi completi.';
      }
    } else {
      // Uomo 4 Giorni
      if (level === 'AVANZATO' || level === 'INTERMEDIO') {
        templateKey = 'T11';
        rationale = 'Atleta Uomo Intermedio/Avanzato (4 Giorni): Template T11 Upper/Lower Metodo Hatfield su 7 esercizi (Neurale Power -> Meccanico -> Metabolico Pumping).';
      } else {
        templateKey = 'T11';
        rationale = 'Atleta Uomo Neofita (4 Giorni): Template T11 Upper/Lower a volume distribuito e buffer controllato su 4 sessioni.';
      }
    }
  }

  // --------------------------------------------------------------------------
  // CASO 3: SELEZIONE 5 O 6 GIORNI (daysPerWeek >= 5)
  // --------------------------------------------------------------------------
  else {
    if (level === 'NEOFITA') {
      // Un neofita non deve fare 6 giorni: lo si protegge con spiegazione tecnica
      templateKey = gender === 'FEMALE' ? 'T18' : 'T11';
      rationale = 'Attenzione: per un neofita una frequenza a 5-6 giorni porta a sovrallenamento neurale precoce. Il sistema adatta il carico al Template su 4 giorni distribuiti con recupero programmato.';
    } else if (gender === 'FEMALE') {
      templateKey = 'T28';
      rationale = 'Atleta Donna Avanzata (Frequenza Alta): Template T28 con 4 sessioni primarie intensive e 1-2 sedute di richiamo/LISS drenante.';
    } else {
      templateKey = 'T25';
      rationale = 'Atleta Uomo Avanzato (6 Giorni): Template T25 Chris Aceto PPL x2 Multifrequenza ad alto volume (7 esercizi completi a seduta con Rest-Pause e Stripping to 10).';
    }
  }

  const selectedTemplate = TOPGYM_TEMPLATES_CATALOG[templateKey] || TOPGYM_TEMPLATES_CATALOG['T01'];
  return { template: selectedTemplate, rationale };
}

// ============================================================================
// CONVERTITORE VERSO IL FORMATO `programDays` DI app/page.tsx
// ============================================================================

export function convertTemplateToProgramDays(
  template: TemplateMeta,
  gender: Gender
): any[] {
  const sessions = template.generateSessions(gender);

  return sessions.map((session, dayIdx) => ({
    id: `${template.id.toLowerCase()}_day_${dayIdx + 1}`,
    title: `${session.dayLabel} [${template.id}]`,
    isPeriodized: true,
    method: template.primaryEngine,
    exercises: session.exercises.map((ex, exIdx) => ({
      id: `ex_${template.id.toLowerCase()}_${dayIdx}_${exIdx}`,
      name: ex.name,
      baseSets: ex.sets,
      baseReps: ex.reps,
      baseRestSeconds: ex.restSeconds,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.restSeconds,
      restSeconds: ex.restSeconds,
      targetMuscle: ex.targetMuscle,
      segment: ex.segment,
      technique: ex.technique,
      notes: `[${ex.segment}] ${ex.effort} | ${ex.notes}${ex.technique !== 'NONE' ? ` | ⚡ Tecnica: ${ex.technique}` : ''}`
    }))
  }));
}