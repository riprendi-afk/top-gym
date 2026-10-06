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
// GENERATORE COMPLETO DEI 30 TEMPLATE TOP GYM
// ============================================================================

export const TOPGYM_TEMPLATES_CATALOG: Record<string, TemplateMeta> = {
  // --- GRUPPO A: PRINCIPIANTI (T01 - T10) ---
  T01: {
    id: 'T01',
    title: 'Full Body 3 Giorni Lineare (A-B-A / B-A-B)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Progressione lineare Kraemer su multiarticolari fondamentali.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno A: Full Body Fondamentale',
        sessionFocus: 'Schema Motorio Spinta & Gambe',
        exercises: [
          { order: 1, name: 'Squat al Multipower / Box Squat', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'NONE', notes: 'Profondità costante, zero cedimento.' },
          { order: 2, name: 'Panca piana bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1 secondo.' },
          { order: 3, name: 'Lat machine presa prona', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione al mento con gomiti in basso.' },
          { order: 4, name: 'Panca lombari hyperextension', targetMuscle: 'Lombari', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza iperestendere.' }
        ]
      },
      {
        dayLabel: 'Giorno B: Full Body Trazione & Stabilità',
        sessionFocus: 'Catena Posteriore & Spinta Verticale',
        exercises: [
          { order: 1, name: 'Stacco da terra rumeno bilanciere', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione d\'anca e schiena neutra.' },
          { order: 2, name: 'Lento con manubri seduto', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata senza inarcare la lombare.' },
          { order: 3, name: 'Pulley basso con triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in fuori e spalle depresse.' },
          { order: 4, name: 'Crunch a terra a gambe a 90°', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione forzata a ogni contrazione.' }
        ]
      },
      {
        dayLabel: 'Giorno C: Full Body Richiamo',
        sessionFocus: 'Consolidamento Schemi Motori A-B',
        exercises: [
          { order: 1, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Piedi a centro pedana.' },
          { order: 2, name: 'Chest Press orizzontale', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria vincolata guidata.' },
          { order: 3, name: 'Rematore manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomito verso la tasca posteriore.' },
          { order: 4, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '40"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta isometrica neutra.' }
        ]
      }
    ]
  },
  T02: {
    id: 'T02',
    title: 'Full Body Macchine Guidate (Basso Stress Tecnico)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Nessun peso libero assiale per superare l\'ansia da carico in totale sicurezza.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Macchine Base A',
        sessionFocus: 'Spinta e Trazione Isotonica Guidata',
        exercises: [
          { order: 1, name: 'Leg Press 45°', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 120, effort: 'RIR 3 (Buffer Alto)', technique: 'NONE', notes: 'Massima stabilità sul sedile.' },
          { order: 2, name: 'Chest Press convergente', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta fluida con impugnatura neutra.' },
          { order: 3, name: 'Lat Machine presa larga', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Barra al petto senza oscillazione.' },
          { order: 4, name: 'Abdominal Machine', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Movimento controllato.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Macchine Base B',
        sessionFocus: 'Catena Posteriore & Spalle Isotoniche',
        exercises: [
          { order: 1, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '12', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Perno centrato sul ginocchio.' },
          { order: 2, name: 'Shoulder Press a selettore', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Seduta regolata a 90°.' },
          { order: 3, name: 'Vertical Row (Pulley alto guidato)', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Petto contro il cuscino d\'appoggio.' },
          { order: 4, name: 'Hyperextension panca lombari', targetMuscle: 'Lombari', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Corpo libero senza dischi.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Macchine Total Body',
        sessionFocus: 'Full Body Integrato Guidato',
        exercises: [
          { order: 1, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo 1" in alto.' },
          { order: 2, name: 'Pec Fly (Pectoral Machine)', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura con gomiti semi-flessi.' },
          { order: 3, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione decisa all\'addome.' },
          { order: 4, name: 'Crunch al cavo con corda', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Flessione del tronco controllata.' }
        ]
      }
    ]
  },
  T03: {
    id: 'T03',
    title: 'Upper / Lower 4 Giorni Fondamentale',
    group: 'PRINCIPIANTE',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Frequenza raddoppiata a carichi fissi e buffer 2-3 per automatizzare i gesti.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper A',
        sessionFocus: 'Spinta e Trazione Orizzontale',
        exercises: [
          { order: 1, name: 'Panca piana bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Presa simmetrica, piedi piantati a terra.' },
          { order: 2, name: 'Rematore con manubri su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Tirata controllata verso i fianchi.' },
          { order: 3, name: 'Lento con manubri', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta verticale in asse con le orecchie.' },
          { order: 4, name: 'Pushdown fune cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti fissi ai fianchi.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower A',
        sessionFocus: 'Quadricipiti e Catena Posteriore Base',
        exercises: [
          { order: 1, name: 'Squat al Multipower', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Talloni stabili, discesa controllata.' },
          { order: 2, name: 'Leg Curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione d\'arresto senza sollevare il bacino.' },
          { order: 3, name: 'Hyperextension con fermo 1"', targetMuscle: 'Lombari', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Attivazione lombare e glutea.' },
          { order: 4, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper B',
        sessionFocus: 'Spinta e Trazione Verticale',
        exercises: [
          { order: 1, name: 'Lat machine presa neutra', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione decisa al petto.' },
          { order: 2, name: 'Spinte con manubri su panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti a 45° rispetto al busto.' },
          { order: 3, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Busto fermo, mignoli all\'insù.' },
          { order: 4, name: 'Curl con manubri alternato', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Supinazione decisa in salita.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower B',
        sessionFocus: 'Stacco Rumeno e Glutei Base',
        exercises: [
          { order: 1, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Schiena dritta, spinta dei fianchi indietro.' },
          { order: 2, name: 'Leg Press 45°', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa senza staccare l\'osso sacro.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Contrazione continua.' },
          { order: 4, name: 'Crunch al tappetino con disco al petto', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Salita lenta espirando.' }
        ]
      }
    ]
  },
  T07: {
    id: 'T07',
    title: 'Femminile Cerniera d\'Anca & Glutei (3 Giorni)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Enfasi biomeccanica su Hip Thrust, Box Squat e RDL con fermo isometrico in accorciamento.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Glutei & Catena Posteriore Focus',
        sessionFocus: 'Attivazione Cerniera d\'Anca',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere o macchina', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto a ogni ripetizione.' },
          { order: 2, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Focus su allungamento femorale.' },
          { order: 3, name: 'Lat machine presa inversa', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Spalle rilassate prima di tirare.' },
          { order: 4, name: 'Abductor machine busto avanti', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura con sosta di 1".' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper V-Taper & Core Femminile',
        sessionFocus: 'Postura, Deltoidi e Dorsali',
        exercises: [
          { order: 1, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto / Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Mantenimento tono clavicolare.' },
          { order: 2, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura scapolare controllata.' },
          { order: 3, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria pulita senza dondolare.' },
          { order: 4, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Bacino retroverso e glutei serrati.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe Globale & Richiamo Gluteo',
        sessionFocus: 'Box Squat e Isometrie',
        exercises: [
          { order: 1, name: 'Box Squat con manubrio o al Multipower', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sulla panca senza rilassare il core.' },
          { order: 2, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza strappi.' },
          { order: 3, name: 'Slanci al cavo per glutei (Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'RIR 1', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di contrazione al punto massimo.' },
          { order: 4, name: 'Camminata in salita LISS (Tapis Roulant)', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h, drenaggio attivo.' }
        ]
      }
    ]
  },

  // --- GRUPPO B: INTERMEDI (T11 - T20) ---
  T11: {
    id: 'T11',
    title: 'Upper / Lower 4 Giorni Metodo Hatfield',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HARDTOPGYM',
    description: 'Sequenza Neurale -> Meccanico -> Metabolico con progressione settimanale dei carichi.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Hatfield Power',
        sessionFocus: 'Neurale Pesante Torso',
        exercises: [
          { order: 1, name: 'Panca piana bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 180, effort: 'RIR 2 (CAT)', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Spinta esplosiva concentrica al massimo carico.' },
          { order: 2, name: 'Rematore bilanciere presa prona', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Busto solido a 45°.' },
          { order: 3, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Cedimento concentrico solo all\'ultima serie.' },
          { order: 4, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Hatfield Power',
        sessionFocus: 'Neurale Pesante Gambe',
        exercises: [
          { order: 1, name: 'Squat con bilanciere libero o Hack Squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa controllata di 3", risalita potente.' },
          { order: 2, name: 'Stacco da terra rumeno', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Femorali in massima tensione.' },
          { order: 3, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 1', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie target + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1.5" di fermo in massima contrazione.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper Hatfield Hypertrophy',
        sessionFocus: 'Volume Meccanico & Metabolico Torso',
        exercises: [
          { order: 1, name: 'Trazioni zavorrate o Lat machine pesante', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione piena con fermo al petto.' },
          { order: 2, name: 'Lento avanti con manubri', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 3, name: 'Chest Press convergente', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 4, name: 'French press EZ + Curl bilanciere', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset antagonisti braccia.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Hatfield Hypertrophy',
        sessionFocus: 'Densità Gambe & Pompaggio',
        exercises: [
          { order: 1, name: 'Leg Press piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta dai talloni con ROM profondo.' },
          { order: 2, name: 'Affondi camminati con manubri', targetMuscle: 'Quadricipiti / Glutei', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo medio con busto controllato.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a esaurimento.' },
          { order: 4, name: 'Calf alla macchina', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Fermo 2" in allungamento.' }
        ]
      }
    ]
  },
  T18: {
    id: 'T18',
    title: 'Femminile Upper / Lower con Back-Off',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Alto volume glutei/catena posteriore, serie back-off (-25%) e LISS post-allenamento.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei Neurale & Catena Posteriore)',
        sessionFocus: 'Hip Thrust, Stacco Rumeno & Back-Off',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto. Tibie verticali.' },
          { order: 2, name: 'Stacco Rumeno con manubri (RDL)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa 3" controllata a metà tibia.' },
          { order: 3, name: 'Leg Press 45° piedi alti', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie standard + 1 serie back-off -25% a cedimento.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima flessione.' },
          { order: 5, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 0', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (V-Taper & Deltoidi Laterali)',
        sessionFocus: 'Dorso, Spalle e Postura',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Trazione esplosiva al petto.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45° per tutelare la spalla.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Alzate laterali con manubri seduta', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a fine seduta.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti Controllati & Isolamento Gluteo)',
        sessionFocus: 'Box Squat, Bulgari e Slanci Cavo',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower (Talloni larghi)', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sul box alto.' },
          { order: 2, name: 'Affondi bulgari con manubri', targetMuscle: 'Gluteo / Anca', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato a 20° per colpire il gluteo.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti articolari.' },
          { order: 4, name: 'Slanci al cavo basso (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B (Trazione, Spalle Rotonde & Braccia)',
        sessionFocus: 'Dorso Orizzontale, Spalle e Braccia Funzionali',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca inclinata', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in appoggio, gomiti aderenti.' },
          { order: 2, name: 'Lento avanti con manubri', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 3, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Cavo dietro la schiena + back-off.' },
          { order: 4, name: 'Pushdown corda + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset antagonisti braccia.' }
        ]
      }
    ]
  },

  // --- GRUPPO C: AVANZATI (T21 - T30) ---
  T25: {
    id: 'T25',
    title: 'Push / Pull / Legs 6 Giorni Multifrequenza 2x',
    group: 'AVANZATO',
    daysCount: 6,
    primaryEngine: 'ACETO',
    description: 'Protocollo Chris Aceto ad altissimo volume e reclutamento fibre IIb.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push A (Petto Pesante & Spalle Anteriori)',
        sessionFocus: 'Sovraccarico Meccanico Clavicolare',
        exercises: [
          { order: 1, name: 'Panca piana bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico Reale', technique: 'REST_PAUSE', notes: 'Ultima serie: 20" rest-pause.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'Cedimento + Forzate', technique: 'NONE', notes: '2 reps forzate assistite.' },
          { order: 3, name: 'Chest Press convergente', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 a fine serie.' },
          { order: 4, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo in alto al parallelo.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull A (Dorso Spessore & Bicipiti)',
        sessionFocus: 'Spessore Dorsale e Catena Posteriore',
        exercises: [
          { order: 1, name: 'Rack Pull (Stacco parziale al rack)', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Massimo carico assoluto con 20" rest-pause.' },
          { order: 2, name: 'Rematore bilanciere presa prona', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 3, reps: '8', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Trazione decisa all\'ombelico.' },
          { order: 3, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip set scalando il 30%.' },
          { order: 4, name: 'Curl con bilanciere dritto', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '8', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '8 reps + 4 parziali dal basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs A (Quadricipiti Dominant)',
        sessionFocus: 'Reclutamento Fibre IIb Arti Inferiori',
        exercises: [
          { order: 1, name: 'Hack Squat o Squat bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Discesa profonda, 20" rest-pause all\'ultima.' },
          { order: 2, name: 'Leg Press 45° piedi stretti', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip set to 10 pesante.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in massima estensione.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Flessione decisa senza rimbalzi.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Push B (Spalle & Pettorale Alto)',
        sessionFocus: 'Deltoidi e Fascio Clavicolare',
        exercises: [
          { order: 1, name: 'Military Press con bilanciere in piedi', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Spinta esplosiva con core serrato.' },
          { order: 2, name: 'Panca inclinata 45° bilanciere', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Discesa 3" controllata.' },
          { order: 3, name: 'Alzate laterali manubri in piedi', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 10 reps + 10 scalate.' },
          { order: 4, name: 'Pushdown barra a V cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo in massima distensione.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Pull B (Ampiezza Dorso & Ischiocrurali)',
        sessionFocus: 'Gran Dorsale e Catena Posteriore',
        exercises: [
          { order: 1, name: 'Trazioni zavorrate o Lat machine pesante', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Trazione decisa con 20" rest-pause.' },
          { order: 2, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo dei femorali.' },
          { order: 3, name: 'Face pull cavo alto con corda', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua verso la fronte.' },
          { order: 4, name: 'Curl su panca inclinata 60° con manubri', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Massimo allungamento del gomito indietro.' }
        ]
      },
      {
        dayLabel: 'Giorno 6: Legs B (Catena Posteriore & Femorali)',
        sessionFocus: 'Ischiocrurali, Glutei e Densità',
        exercises: [
          { order: 1, name: 'Stacco a gambe semitese bilanciere', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Concentrica esplosiva, 20" rest-pause.' },
          { order: 2, name: 'Leg Press piedi larghi e alti', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '12-15', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 scalando il 25%.' },
          { order: 3, name: 'Leg curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Contrazione di picco di 1".' },
          { order: 4, name: 'Calf seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso.' }
        ]
      }
    ]
  },
  T28: {
    id: 'T28',
    title: 'Femminile Advanced Focus Glutei & Spalle',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'ACETO',
    description: 'Hip Thrust neurale pesante, jump set con bulgari, parziali pulsate su Abductor e rest-pause.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei & Catena Posteriore Heavy)',
        sessionFocus: 'Hip Thrust Neurale e Femorali Pesanti',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '2" di fermo in alto + 20" rest-pause all\'ultima serie.' },
          { order: 2, name: 'Stacco rumeno pesante con bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Schiena iper-stabile, allungamento profondo.' },
          { order: 3, name: 'Leg Press 45° piedi alti', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 10 reps + max reps scalando il 30%.' },
          { order: 4, name: 'Abductor machine busto a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '15 reps complete + 8 mezze ripetizioni pulsate in allungamento.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (Deltoidi Sculpt & Dorso V-Taper)',
        sessionFocus: 'Spalle Rotonde e Ampiezza Dorsale',
        exercises: [
          { order: 1, name: 'Lat machine presa neutra stretta', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Trazione al petto con 20" rest-pause.' },
          { order: 2, name: 'Lento con manubri seduta', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 3, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a cedimento.' },
          { order: 4, name: 'Face pull corda cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo continuo.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti & Isolamento Anca)',
        sessionFocus: 'Squat Guidato, Affondi e Cavi',
        exercises: [
          { order: 1, name: 'Hack Squat o Box Squat al Multipower', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '20" rest-pause sulla seconda serie allenante.' },
          { order: 2, name: 'Affondi bulgari con manubri', targetMuscle: 'Gluteo', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 90, effort: 'RIR 0', technique: 'NONE', notes: 'Busto a 25° in avanti.' },
          { order: 3, name: 'Slanci cavo basso per gluteo (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 4, name: 'Camminata in salita LISS defaticante', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Tapis roulant pendenza 4% a 5 km/h.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B & Core (Richiamo Upper & Torso)',
        sessionFocus: 'Dorso Orizzontale, Petto Funzionale & Addome',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione gomito-bacino.' },
          { order: 2, name: 'Spinte manubri panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 3, name: 'Alzate laterali manubri in piedi', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale.' },
          { order: 4, name: 'Plank con abduzione gamba', targetMuscle: 'Core / Glutei', segment: 'CORE_CARDIO', sets: 3, reps: '40"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Core bloccato in isometria.' }
        ]
      }
    ]
  }
};

// ============================================================================
// RESOLVER DETERMINISTICO A 3 DIMENSIONI TOP GYM
// ============================================================================

export function resolveTopGymTemplate(
  gender: Gender,
  level: TrainingLevel,
  profile: PsychologicalProfile,
  daysPerWeek: number
): { template: TemplateMeta; rationale: string } {
  // Routing guidato dal sesso, livello e profilo psicologico
  let templateKey = 'T01';
  let rationale = '';

  if (level === 'NEOFITA') {
    if (gender === 'FEMALE') {
      templateKey = daysPerWeek >= 4 ? 'T03' : 'T07';
      rationale = 'Atleta donna principiante: priorità su cerniera d\'anca, glutei e postura V-taper senza sovraccarichi assiali che innescano ritenzione idrica.';
    } else if (profile === 'CAUTO_ANSIA_CARICO') {
      templateKey = 'T02';
      rationale = 'Atleta principiante cauto: azzeramento del rischio percepito sotto bilanciere, lavoro su macchine guidate e buffer RIR 2-3 per consolidare gli schemi.';
    } else if (daysPerWeek >= 4) {
      templateKey = 'T03';
      rationale = 'Upper/Lower su 4 giorni per consolidare la tecnica dei gesti fondamentali a carico controllato.';
    } else {
      templateKey = 'T01';
      rationale = 'Full Body 3 giorni a progressione lineare di Kraemer per costruire coordinazione e aderenza.';
    }
  } else if (level === 'INTERMEDIO') {
    if (gender === 'FEMALE') {
      templateKey = 'T18';
      rationale = 'Atleta donna intermedia: alto volume su glutei e catena posteriore con back-off a -25% sui complementari e LISS rigenerativo post-allenamento.';
    } else if (profile === 'METABOLICO_PUMPING' || profile === 'AGGRESSIVO_NEURALE') {
      templateKey = 'T11';
      rationale = 'Metodo Hatfield: architettura Neurale -> Meccanico -> Metabolico su 4 giorni per modulare l\'effort senza eccedere nel danno neurale precoce.';
    } else {
      templateKey = 'T11';
      rationale = 'Template Hatfield consolidato: 4 giorni bilanciati con progressione del sovraccarico.';
    }
  } else {
    // AVANZATO
    if (gender === 'FEMALE') {
      templateKey = 'T28';
      rationale = 'Donna avanzata: Hip Thrust neurale pesante, superserie e contrazioni pulsate parziali per reclutare le fibre IIb del gluteo ad alta intensità.';
    } else if (daysPerWeek >= 5) {
      templateKey = 'T25';
      rationale = 'Chris Aceto PPL 2x su 6 giorni: massima modulazione del volume con tecniche Rest-Pause e Stripping to 10 a cedimento concentrico reale.';
    } else {
      templateKey = 'T25';
      rationale = 'Split avanzata ad alto volume con tecniche speciali di reclutamento rapido.';
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