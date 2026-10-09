// lib/topgym-catalog.ts

export type Gender = 'MALE' | 'FEMALE';
export type TrainingLevel = 'NEOFITA' | 'INTERMEDIO' | 'AVANZATO';
export type PsychologicalProfile =
  | 'CAUTO_ANSIA_CARICO'
  | 'AGGRESSIVO_NEURALE'
  | 'METABOLICO_PUMPING'
  | 'TIME_CONSTRAINED';

export type TrainingGoal = 'HYPERTROPHY' | 'STRENGTH' | 'COMPOSITION' | 'CONTEST';

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
  id: string;
  title: string;
  group: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZATO';
  daysCount: number; // 2, 3, 4, 5 o 6
  primaryEngine: 'TOPGYM_BLOCKS' | 'HARDTOPGYM' | 'ACETO' | 'NOCERINO';
  description: string;
  generateSessions: (gender: Gender) => TemplateSession[];
}

// ============================================================================
// CATALOGO MASTER CON RIGOROSA SUDDIVISIONE PER FREQUENZA (2, 3, 4, 5, 6 GG)
// ============================================================================

export const TOPGYM_TEMPLATES_CATALOG: Record<string, TemplateMeta> = {
  // --------------------------------------------------------------------------
  // 2 GIORNI
  // --------------------------------------------------------------------------
  T04: {
    id: 'T04',
    title: 'Torso / Gambe 2 Giorni Base (Time-Constrained)',
    group: 'PRINCIPIANTE',
    daysCount: 2,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Frequenza minima ad alta efficienza: G1 Upper Body completo, G2 Lower Body completo con buffer controllato.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Torso Completo (Spinta & Trazione)',
        sessionFocus: 'Multiarticolari Tronco e Braccia',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1 secondo.' },
          { order: 2, name: 'Lat machine presa prona larga', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione controllata al petto.' },
          { order: 3, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45° rispetto al busto.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Petto in fuori e spalle depresse.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 6, name: 'Curl bilanciere EZ + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Superset braccia a fine seduta.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Gambe & Catena Posteriore',
        sessionFocus: 'Squat, Stacco, Pressa & Polpacci',
        exercises: [
          { order: 1, name: 'Squat al Multipower o Libero', targetMuscle: 'Quadricipiti/Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Profondità costante al parallelo.' },
          { order: 2, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Allungamento profondo dei femorali.' },
          { order: 3, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie back-off -25% a cedimento.' },
          { order: 4, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in alto.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Contrazione continua.' },
          { order: 6, name: 'Calf alla pressa + Crunch a terra', targetMuscle: 'Polpacci & Core', segment: 'CORE_CARDIO', sets: 3, reps: '15+15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Superset polpacci e addome.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3 GIORNI
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
          { order: 1, name: 'Squat al Multipower / Box Squat', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'NONE', notes: 'Profondità costante al parallelo.' },
          { order: 2, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1 secondo.' },
          { order: 3, name: 'Lat machine presa prona', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione al mento con gomiti in basso.' },
          { order: 4, name: 'Lento con manubri seduto', targetMuscle: 'Spalle', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 5, name: 'Panca lombari hyperextension', targetMuscle: 'Lombari', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido.' },
          { order: 6, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta addominale solida.' }
        ]
      },
      {
        dayLabel: 'Giorno B: Full Body Catena Posteriore & Trazione',
        sessionFocus: 'Cerniera d\'Anca, Dorso & Braccia',
        exercises: [
          { order: 1, name: 'Stacco rumeno con manubri', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione d\'anca e schiena neutra.' },
          { order: 2, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Piedi a centro pedana.' },
          { order: 3, name: 'Pulley basso con triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in fuori e spalle depresse.' },
          { order: 4, name: 'Spinte manubri su panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti a 45°.' },
          { order: 5, name: 'Curl manubri + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Superset braccia.' },
          { order: 6, name: 'Crunch su tappetino a gambe flesse', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione completa.' }
        ]
      },
      {
        dayLabel: 'Giorno C: Full Body Consolidamento',
        sessionFocus: 'Richiamo Globale & Macchine Guidate',
        exercises: [
          { order: 1, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 2, name: 'Chest Press orizzontale', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria vincolata guidata.' },
          { order: 3, name: 'Rematore manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Gomito verso la tasca posteriore.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Perno allineato al ginocchio.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Spalle', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria a 45°.' },
          { order: 6, name: 'Plank con tenuta isometrica', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '40"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Controllo della parete addominale.' }
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
    description: 'Enfasi su cerniera d\'anca (Hip Thrust/RDL), V-taper e prevenzione ritenzione idrica con LISS drenante.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Glutei Pesanti & Catena Posteriore',
        sessionFocus: 'Attivazione Cerniera d\'Anca e Femorali',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere o macchina', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto.' },
          { order: 2, name: 'Stacco rumeno con manubri (RDL)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa 3" controllata.' },
          { order: 3, name: 'Lat machine presa inversa stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Postura aperta.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido.' },
          { order: 5, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura con sosta di 1".' },
          { order: 6, name: 'Camminata in salita LISS (Tapis Roulant)', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper V-Taper & Core Posturale',
        sessionFocus: 'Dorso, Deltoidi e Spalle Rotonde',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Tirata al petto.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Mantenimento tono clavicolare.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura scapolare.' },
          { order: 4, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria pulita.' },
          { order: 5, name: 'Pushdown fune per tricipiti', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura in basso.' },
          { order: 6, name: 'Plank a terra', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Retroversione del bacino.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe Globale & Richiamo Glutei',
        sessionFocus: 'Box Squat, Affondi e Isolamento Gluteo',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower / Libero', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sulla panca.' },
          { order: 2, name: 'Affondi camminati con manubri', targetMuscle: 'Glutei / Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo lungo, busto flesso.' },
          { order: 3, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'ROM controllato.' },
          { order: 4, name: 'Slanci al cavo per glutei (Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'RIR 1', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di contrazione.' },
          { order: 5, name: 'Hyperextension busto curvo per glutei', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Piedi a 45° all\'esterno.' },
          { order: 6, name: 'Bike reclinata defaticante LISS', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pedalata fluida a 70 rpm.' }
        ]
      }
    ]
  },
  T12: {
    id: 'T12',
    title: 'Push / Pull / Legs 3 Giorni Power-Hyper (Bosco-Colli)',
    group: 'AVANZATO',
    daysCount: 3,
    primaryEngine: 'HARDTOPGYM',
    description: 'Protocollo PPL per atleti avanzati su stimolo neurale CAT (Compensatory Acceleration) e micro-overload progressivo.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Petto, Spalle Anteriori & Tricipiti)',
        sessionFocus: 'Forza Neurale Panca, Volume Meccanico & Stripping Deltoidi',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Pettorale Centrale', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 150, effort: 'RIR 1-2 (CAT)', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Fermo al petto di 1", spinta esplosiva concentrica.' },
          { order: 2, name: 'Spinte con manubri su panca a 30°', targetMuscle: 'Fascio Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Freno eccentrico di 3".' },
          { order: 3, name: 'Chest Press convergente a selettore', targetMuscle: 'Pettorale Basso/Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie a -25% a cedimento.' },
          { order: 4, name: 'Lento avanti con manubri seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 5, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Ultima serie: drop set a scalare del 30%.' },
          { order: 6, name: 'French press bilanciere EZ panca piana', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa controllata dietro la nuca.' },
          { order: 7, name: 'Pushdown al cavo alto con corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Aprire la corda con fermo di 1.5".' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Dorso Spessore, Ampiezza & Bicipiti)',
        sessionFocus: 'Rack Pull Neurale, Trazioni Pesanti & Pompaggio Braccia',
        exercises: [
          { order: 1, name: 'Rack Pull / Stacco al rack da sotto il ginocchio', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'RIR 1-2', technique: 'NONE', notes: 'Carico elevato, chiusura d\'anca decisa.' },
          { order: 2, name: 'Rematore con bilanciere presa prona', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione all\'ombelico con schiena bloccata.' },
          { order: 3, name: 'Lat machine presa neutra / Trazioni', targetMuscle: 'Gran Dorsale (Ampiezza)', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 1" al petto.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps pesanti + scarico 40% a max reps.' },
          { order: 5, name: 'Face pull al cavo alto con corda', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Tirata alla fronte.' },
          { order: 6, name: 'Curl con bilanciere sagomato EZ', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti fissi ai fianchi.' },
          { order: 7, name: 'Hammer curl con manubri su panca inclinata', targetMuscle: 'Brachioradiale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set all\'ultima serie.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs (Quadricipiti, Ischiocrurali & Polpacci)',
        sessionFocus: 'Squat Pesante, Volume Pressa & Catena Posteriore',
        exercises: [
          { order: 1, name: 'Squat con bilanciere libero / Hack Squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 180, effort: 'RIR 2 (Tecnico)', technique: 'NONE', notes: 'Discesa in 3 secondi controllati.' },
          { order: 2, name: 'Leg Press 45° piedi a centro pedana', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie a -25% a cedimento.' },
          { order: 3, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Allungamento massimo dei femorali.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei / Gambe', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato di 20°.' },
          { order: 5, name: 'Leg extension alla macchina', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a esaurimento.' },
          { order: 6, name: 'Leg curl sdraiato o seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo di 1.5" a massima flessione.' },
          { order: 7, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso.' }
        ]
      }
    ]
  },
  // NUOVO MOTORE NOCERINO (3 GIORNI)
  T13: {
    id: 'T13',
    title: 'Biomeccanica 3 Giorni PPL a Tensione Continua (Metodo Nocerino)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'NOCERINO',
    description: 'Ottimizzazione delle curve di resistenza, macchine isotoniche e convergenze articolari con auto-avanzamento su 4 fasi biomeccaniche.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push Biomeccanico (Allineamento Fibre)',
        sessionFocus: 'Convergenza Clavicolare & Cavi Orizzontali',
        exercises: [
          { order: 1, name: 'Chest Press convergente a selettore', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta lungo la linea delle fibre clavicolari.' },
          { order: 2, name: 'Croci ai cavi panca 30° con profilo a campana', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'ISOMETRIA_DI_PICCO', notes: 'Tensione costante all\'apice.' },
          { order: 3, name: 'Lento manubri panca a 75° con extrarotazione', targetMuscle: 'Spalle Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Presa a 45° senza stress acromiale.' },
          { order: 4, name: 'Alzate laterali al cavo singolo dietro la schiena', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Cavo all\'altezza del ginocchio per braccio di leva ottimale.' },
          { order: 5, name: 'Pushdown barra a V con gomiti serrati', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Bloccare la spalla in retroversione.' },
          { order: 6, name: 'Estensioni sopra la nuca al cavo basso', targetMuscle: 'Tricipiti (Capo Lungo)', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Massimo allungamento del capo lungo.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull Biomeccanico (Trazione sui Piani di Movimento)',
        sessionFocus: 'Dorsale Puro, Traiettoria Iliaca & Bicipiti',
        exercises: [
          { order: 1, name: 'Lat Machine unilaterale al cavo (Tirata Iliaca)', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8 per lato', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomito verso la cresta iliaca senza torsione.' },
          { order: 2, name: 'Pulley con presa neutra divergente', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare controllata.' },
          { order: 3, name: 'Rematore alla macchina a petto appoggiato', targetMuscle: 'Dorso Alto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento', technique: 'BACK_OFF_CEDIMENTO', notes: 'Eliminazione completa del compenso lombare.' },
          { order: 4, name: 'Face pull al cavo alto con doppia corda', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Doppia corda per aumentare il ROM posteriore.' },
          { order: 5, name: 'Curl su panca inclinata a 60° (Stretch Capo Lungo)', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti fissi dietro il busto.' },
          { order: 6, name: 'Spider Curl con manubri su panca a 45°', targetMuscle: 'Bicipiti (Picco)', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Massimo accorciamento concentrico.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs Biomeccanico (Isolamento Articolare)',
        sessionFocus: 'Catene Chiuse/Aperte & Stabilizzazione Anca',
        exercises: [
          { order: 1, name: 'Hack Squat con piedi a base stretta', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria guidata con massimo affondo sicuro.' },
          { order: 2, name: 'Leg Press orizzontale a selettore', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Piedi bassi per enfasi sui vasti.' },
          { order: 3, name: 'Leg Curl seduto (Isolamento Femorale in Flessione)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 75, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Busto inclinato avanti per pre-stirare i femorali.' },
          { order: 4, name: 'Stacco rumeno ai manubri con fermo in allungamento', targetMuscle: 'Catena Posteriore', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 2" nel punto di massima tensione.' },
          { order: 5, name: 'Leg Extension (Profilo di Tensione Ottimale)', targetMuscle: 'Retto Femorale', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 6, name: 'Calf seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Fermo di 2" in stretch profondo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4 GIORNI
  // --------------------------------------------------------------------------
  T11: {
    id: 'T11',
    title: 'Upper / Lower 4 Giorni Metodo Hatfield (Bosco-Colli)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HARDTOPGYM',
    description: 'Sequenza Neurale -> Meccanico -> Metabolico con progressione settimanale Bosco-Colli su 4 microcicli ormonali.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Hatfield Power',
        sessionFocus: 'Neurale Pesante Torso',
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
        dayLabel: 'Giorno 2: Lower Hatfield Power',
        sessionFocus: 'Neurale Pesante Gambe & Stacco',
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
        dayLabel: 'Giorno 3: Upper Hatfield Hypertrophy',
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
        dayLabel: 'Giorno 4: Lower Hatfield Hypertrophy',
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
  // NUOVO MOTORE NOCERINO (4 GIORNI)
  T16: {
    id: 'T16',
    title: 'Torso / Arti Biomeccanico 4 Giorni (Metodo Nocerino)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'NOCERINO',
    description: 'Split Torso/Arti biomeccanica con isolamento dei profili di carico (braccia/deltoidi prioritari) e 4 fasi biomeccaniche progressive.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Torso (Spinta & Trazione Biomeccanica)',
        sessionFocus: 'Petto & Dorso a Tensione Continua',
        exercises: [
          { order: 1, name: 'Chest Press convergente inclinata', targetMuscle: 'Petto Alto', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta convergente a gomiti bloccati sul piano scapolare.' },
          { order: 2, name: 'Lat Machine presa neutra stretta', targetMuscle: 'Dorso Basso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione verticale con petto espanso.' },
          { order: 3, name: 'Panca piana manubri con pronazione controllata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa profonda senza rimbalzo.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Depressione scapolare prima del tiraggio.' },
          { order: 5, name: 'Croci ai cavi orizzontali', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" a massima adduzione.' },
          { order: 6, name: 'Pullover al cavo alto con corda', targetMuscle: 'Gran Dorsale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Braccia semitese.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Arti & Deltoidi (Gambe, Braccia & Spalle Focus)',
        sessionFocus: 'Quadricipiti, Deltoidi e Super-Set Braccia',
        exercises: [
          { order: 1, name: 'Hack Squat o Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta uniforme a talloni saldi.' },
          { order: 2, name: 'Lento con manubri panca a 75°', targetMuscle: 'Spalle Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Freno di 3" nella fase eccentrica.' },
          { order: 3, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 4, name: 'Curl bilanciere sagomato EZ panca Scott', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Braccia in appoggio stabile.' },
          { order: 5, name: 'French press con manubri su panca a 30°', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa controllata verso i lati del capo.' },
          { order: 6, name: 'Leg Extension alla macchina', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" in alto.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Torso Richiamo & Densità',
        sessionFocus: 'Spessore Dorsale, Croci e Deltoidi Posteriori',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca orizzontale', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8 per lato', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata radente il fianco.' },
          { order: 2, name: 'Chest Press orizzontale a presa neutra', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Presa a martello per preservare la cuffia.' },
          { order: 3, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata continua al mento.' },
          { order: 4, name: 'Pectoral Machine (Pec Fly)', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 5, name: 'Face pull al cavo alto con corda', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua alla fronte.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Catena Posteriore & Specializzazione Braccia',
        sessionFocus: 'Femorali, Glutei e Superset Bicipiti/Tricipiti',
        exercises: [
          { order: 1, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo senza flessione lombare.' },
          { order: 2, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'Cedimento', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie a -25% a cedimento.' },
          { order: 3, name: 'Super-Set: Curl manubri inclinata + Pushdown fune', targetMuscle: 'Bicipiti + Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10+10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Antagonisti continui.' },
          { order: 4, name: 'Hammer curl al cavo basso con corda', targetMuscle: 'Brachioradiale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Presa neutra solida.' },
          { order: 5, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Stretch di 2" in basso.' }
        ]
      }
    ]
  },
  T18: {
    id: 'T18',
    title: 'Femminile Upper / Lower con Back-Off (4 Giorni)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Alto volume glutei/catena posteriore, serie back-off (-25%) e LISS post-allenamento.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei Neurale & Catena Posteriore)',
        sessionFocus: 'Hip Thrust, Stacco Rumeno, Pressa & Back-Off',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2 (Tecnico)', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto. Tibie verticali.' },
          { order: 2, name: 'Stacco Rumeno con manubri (RDL)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa 3" controllata.' },
          { order: 3, name: 'Leg Press 45° piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie back-off -25% a cedimento.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato a 20°.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima flessione.' },
          { order: 6, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 0', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 7, name: 'Tapis roulant in pendenza LISS', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (V-Taper, Deltoidi & Postura)',
        sessionFocus: 'Dorso, Deltoidi Laterali & Fascio Clavicolare',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra stretta', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Trazione esplosiva al petto.' },
          { order: 2, name: 'Spinte manubri su panca a 30°', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45°.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Lento con manubri seduta', targetMuscle: 'Spalle Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 5, name: 'Alzate laterali con manubri seduta', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a fine serie.' },
          { order: 6, name: 'Pushdown fune cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura corda continua.' },
          { order: 7, name: 'Plank su avambracci', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta isometrica neutra.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti Controllati & Allungamento Glutei)',
        sessionFocus: 'Box Squat, Leg Extension & Slanci Cavi',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower (Talloni larghi)', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sul box alto.' },
          { order: 2, name: 'Leg Press 45° piedi intermedi', targetMuscle: 'Quadricipiti / Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa profonda controllata.' },
          { order: 3, name: 'Stacco rumeno con manubri su rialzo', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento femorale continuo.' },
          { order: 4, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti.' },
          { order: 5, name: 'Slanci al cavo basso (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 6, name: 'Leg Curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1" in alto.' },
          { order: 7, name: 'Bike reclinata defaticante LISS', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pedalata a 70 rpm.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B (Trazione Orizzontale, Spalle & Braccia)',
        sessionFocus: 'Dorso Orizzontale, Spalle Rotonde & Superset Braccia',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca inclinata', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in appoggio, gomiti aderenti.' },
          { order: 2, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata pulita al petto.' },
          { order: 3, name: 'Spinte manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Mantenimento tono.' },
          { order: 4, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Cavo dietro la schiena + back-off -25%.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua a 90°.' },
          { order: 6, name: 'Pushdown corda + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset braccia.' },
          { order: 7, name: 'Crunch su palla medica / tappetino', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione profonda.' }
        ]
      }
    ]
  },
  T28: {
    id: 'T28',
    title: 'Femminile Advanced Focus Glutei & Spalle (4 Giorni)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'ACETO',
    description: 'Hip Thrust neurale pesante, superserie con bulgari e parziali pulsate su Abductor.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glutei & Catena Posteriore Heavy)',
        sessionFocus: 'Hip Thrust Neurale e Femorali Pesanti',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '2" di fermo in alto + 20" rest-pause all\'ultima.' },
          { order: 2, name: 'Stacco rumeno pesante con bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 3, name: 'Leg Press 45° piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 10 reps + max reps scalando il 30%.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Busto inclinato a 25°.' },
          { order: 5, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima contrazione.' },
          { order: 6, name: 'Abductor machine busto a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '15 reps complete + 8 parziali pulsate.' },
          { order: 7, name: 'Tapis roulant in pendenza LISS', targetMuscle: 'Cardio Drenante', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h.' }
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
  },

  // --------------------------------------------------------------------------
  // 5 GIORNI
  // --------------------------------------------------------------------------
  T17: {
    id: 'T17',
    title: 'Top Gym 5 Giorni Avanzata: PPL + Torso & Braccia/Spalle',
    group: 'AVANZATO',
    daysCount: 5,
    primaryEngine: 'ACETO',
    description: 'Split completa a 5 sessioni settimanali: Push, Pull, Legs, Upper Torso Richiamo, Specializzazione Braccia & Spalle con tecniche Chris Aceto.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Petto, Spalle Anteriori & Tricipiti)',
        sessionFocus: 'Sovraccarico Concentrico Pettorale & Rest-Pause',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Pettorale Centrale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '20" rest-pause all\'ultima serie.' },
          { order: 2, name: 'Spinte con manubri panca a 30°', targetMuscle: 'Fascio Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Freno eccentrico di 3".' },
          { order: 3, name: 'Chest Press convergente a selettore', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop-set to 10 a cedimento.' },
          { order: 4, name: 'Dip parallele con sovraccarico', targetMuscle: 'Petto Basso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato a 30°.' },
          { order: 5, name: 'Lento avanti con manubri', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 6, name: 'French press bilanciere EZ panca piana', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Discesa dietro la testa controllata.' },
          { order: 7, name: 'Pushdown al cavo alto con corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Aprire la corda con sosta di 1".' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Dorso Spessore, Ampiezza & Bicipiti)',
        sessionFocus: 'Rack Pull Neurale & Rematore Pesante',
        exercises: [
          { order: 1, name: 'Rack Pull da sotto il ginocchio', targetMuscle: 'Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Massimo carico assoluto con 20" rest-pause.' },
          { order: 2, name: 'Rematore con bilanciere presa prona', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione decisa all\'ombelico con busto a 45°.' },
          { order: 3, name: 'Lat machine presa neutra stretta', targetMuscle: 'Dorso (Ampiezza)', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata continua al petto.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set to 10 a fine serie.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Tirata alla fronte continua.' },
          { order: 6, name: 'Curl con bilanciere sagomato EZ', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '8 reps + 4 mezze ripetizioni dal basso.' },
          { order: 7, name: 'Hammer curl con manubri su panca a 60°', targetMuscle: 'Brachioradiale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Presa neutra solida.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs (Quadricipiti, Ischiocrurali & Polpacci)',
        sessionFocus: 'Hack Squat, Pressa 45° & Femorali',
        exercises: [
          { order: 1, name: 'Hack Squat o Squat bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Discesa profonda, 20" rest-pause all\'ultima.' },
          { order: 2, name: 'Leg Press 45° piedi paralleli', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie a -25% a cedimento.' },
          { order: 3, name: 'Stacco rumeno con bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo dei femorali.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei / Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Piede posteriore su panca.' },
          { order: 5, name: 'Leg extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a esaurimento.' },
          { order: 6, name: 'Leg curl seduto o sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" in flessione.' },
          { order: 7, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper Torso Antagonistico (Petto & Dorso Volume)',
        sessionFocus: 'Super-Set Antagonisti e Spessore/Ampiezza',
        exercises: [
          { order: 1, name: 'Panca inclinata 30° con manubri', targetMuscle: 'Petto Clavicolare', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Freno eccentrico rigoroso di 3".' },
          { order: 2, name: 'Rematore con manubrio su panca', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8 per lato', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione pesante al bacino.' },
          { order: 3, name: 'Chest Press orizzontale a selettore', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 4, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata pulita al petto.' },
          { order: 5, name: 'Croci ai cavi alti per petto', targetMuscle: 'Petto Basso', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di fermo continuo in chiusura.' },
          { order: 6, name: 'Pullover al cavo alto con corda', targetMuscle: 'Gran Dorsale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Braccia semi-tese, allungamento dorsale.' },
          { order: 7, name: 'Crunch su palla medica con disco al petto', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '20', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura toracica ad alta densità.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Arms & Shoulders Sculpt (Deltoidi & Braccia)',
        sessionFocus: 'Deltoidi Laterali a Pompaggio & Super-Set Braccia',
        exercises: [
          { order: 1, name: 'Military Press con bilanciere in piedi', targetMuscle: 'Spalle Anteriori', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Spinta esplosiva con core serrato.' },
          { order: 2, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop-set 10 reps + 10 scalate.' },
          { order: 3, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Sosta di 1" al parallelo.' },
          { order: 4, name: 'Alzate a 90° su panca inclinata', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua a busto fermo.' },
          { order: 5, name: 'Super-Set: Curl bilanciere sagomato EZ + French press EZ', targetMuscle: 'Bicipiti + Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10+10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Antagonisti continui senza pausa.' },
          { order: 6, name: 'Curl su panca inclinata 60° con manubri', targetMuscle: 'Bicipiti (Capo Lungo)', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Allungamento profondo indietro.' },
          { order: 7, name: 'Pushdown barra dritta cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a cedimento.' }
        ]
      }
    ]
  },
  T22: {
    id: 'T22',
    title: 'Monomuscolare 5 Giorni Top Gym (1 Distretto al Giorno)',
    group: 'AVANZATO',
    daysCount: 5,
    primaryEngine: 'ACETO',
    description: 'Split classica su 5 giorni: G1 Petto, G2 Dorso, G3 Gambe, G4 Spalle, G5 Braccia ad altissimo focus locale.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Petto & Addome',
        sessionFocus: 'Sovraccarico Meccanico Pettorale Completo',
        exercises: [
          { order: 1, name: 'Panca piana bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: '20" rest-pause all\'ultima serie.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Freno eccentrico di 3".' },
          { order: 3, name: 'Chest Press convergente', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip set to 10 a cedimento.' },
          { order: 4, name: 'Dip parallele con sovraccarico', targetMuscle: 'Petto Basso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Inclinazione busto avanti.' },
          { order: 5, name: 'Croci ai cavi orizzontali / alti', targetMuscle: 'Petto Isolamento', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: '1" di contrazione continua.' },
          { order: 6, name: 'Pectoral Machine (Pec Fly)', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 7, name: 'Crunch al cavo con corda in ginocchio', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '20', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura toracica ad alta densità.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Dorso & Catena Posteriore',
        sessionFocus: 'Spessore e Ampiezza Dorsale Completa',
        exercises: [
          { order: 1, name: 'Stacco da terra / Rack Pull al ginocchio', targetMuscle: 'Dorso/Posteriore', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Massimo carico assoluto.' },
          { order: 2, name: 'Rematore con bilanciere presa prona', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione decisa all\'ombelico.' },
          { order: 3, name: 'Trazioni zavorrate o Lat machine neutra', targetMuscle: 'Ampiezza Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione pulita al petto.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Strip-set terminale a 10 reps.' },
          { order: 5, name: 'Rematore manubrio su panca', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Gomito verso la tasca posteriore.' },
          { order: 6, name: 'Pullover al cavo alto con corda', targetMuscle: 'Gran Dorsale', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Sosta in basso.' },
          { order: 7, name: 'Hyperextension con sovraccarico al petto', targetMuscle: 'Lombari', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Estensione controllata.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe (Quadricipiti, Ischiocrurali & Polpacci)',
        sessionFocus: 'Volume Sistemico e Tensione Meccanica Arti Inferiori',
        exercises: [
          { order: 1, name: 'Squat con bilanciere libero / Hack Squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 180, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Discesa profonda controllata.' },
          { order: 2, name: 'Leg Press 45° a piedi paralleli', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 120, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie a -25% a cedimento.' },
          { order: 3, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 4, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei / Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato di 20°.' },
          { order: 5, name: 'Leg extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set finale.' },
          { order: 6, name: 'Leg curl seduto o sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" in flessione.' },
          { order: 7, name: 'Calf alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Stretch di 2" in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Spalle & Deltoidi Completi',
        sessionFocus: 'Deltoidi Anteriori, Laterali e Posteriori',
        exercises: [
          { order: 1, name: 'Military Press bilanciere in piedi', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Spinta esplosiva con core serrato.' },
          { order: 2, name: 'Lento con manubri seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 3, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 10 reps + 10 scalate.' },
          { order: 4, name: 'Alzate laterali ai cavi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Sosta di 1" al parallelo.' },
          { order: 5, name: 'Alzate a 90° su panca a 45°', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Busto aderente al cuscino.' },
          { order: 6, name: 'Face pull corda cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua alla fronte.' },
          { order: 7, name: 'Scrollate con manubri (Shrugs)', targetMuscle: 'Trapezio', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in massima elevazione.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Braccia (Bicipiti, Tricipiti & Avambracci)',
        sessionFocus: 'Super-Set Antagonisti e Pompaggio Brachiale',
        exercises: [
          { order: 1, name: 'French press bilanciere EZ panca piana', targetMuscle: 'Tricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'REST_PAUSE', notes: 'Discesa controllata dietro la nuca.' },
          { order: 2, name: 'Curl con bilanciere dritto / sagomato EZ', targetMuscle: 'Bicipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'RIPETIZIONI_PARZIALI', notes: '8 reps + 4 parziali dal basso.' },
          { order: 3, name: 'Super-Set: Pushdown barra a V + Curl manubri inclinata', targetMuscle: 'Tricipiti + Bicipiti', segment: 'MECCANICO', sets: 3, reps: '10+10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Esecuzione continua senza pausa intermedia.' },
          { order: 4, name: 'Dip tra due panche con sovraccarico', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Disco sulle cosce + scarico a corpo libero.' },
          { order: 5, name: 'Curl alla panca Scott con manubrio / bilanciere EZ', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Drop set all\'ultima serie.' },
          { order: 6, name: 'Pushdown corda al cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura della corda in basso.' },
          { order: 7, name: 'Hammer curl con manubri in piedi', targetMuscle: 'Brachioradiale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Presa neutra solida.' }
        ]
      }
    ]
  },
  T19: {
    id: 'T19',
    title: 'Femminile 5 Giorni Glute & High-Density Body Sculpt',
    group: 'INTERMEDIO',
    daysCount: 5,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Split femminile su 5 sessioni: 3 sedute Lower a focus complementare (Glute-Ham, Quad-Glute, Glute-Pump) e 2 sedute Upper V-Taper.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Lower A (Glute & Ham Focus Heavy)',
        sessionFocus: 'Hip Thrust Neurale e Femorali Pesanti',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere zavorrato', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 2" in alto. Tibie verticali.' },
          { order: 2, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa 3" controllata.' },
          { order: 3, name: 'Leg Press 45° piedi alti e larghi', targetMuscle: 'Glutei / Femorali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 serie back-off -25% a cedimento.' },
          { order: 4, name: 'Leg Curl seduto', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Fermo 1.5" a massima flessione.' },
          { order: 5, name: 'Abductor machine busto avanti a 45°', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 6, name: 'Hyperextension con focus glutei (busto curvo)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Piedi a 45°.' },
          { order: 7, name: 'Tapis roulant in salita LISS drenante', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pendenza 4%, velocità 5 km/h.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (Dorso V-Taper & Deltoidi)',
        sessionFocus: 'Spalle Rotonde, Lat Machine & Postura',
        exercises: [
          { order: 1, name: 'Lat Machine presa neutra stretta', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'COMPENSATORY_ACCELERATION_CAT', notes: 'Trazione esplosiva al petto.' },
          { order: 2, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45°.' },
          { order: 3, name: 'Pulley basso con corda', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: '3 serie + 1 back-off -25% a cedimento.' },
          { order: 4, name: 'Lento con manubri seduta', targetMuscle: 'Spalle Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Panca a 75°.' },
          { order: 5, name: 'Alzate laterali con manubri seduta', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set a fine serie.' },
          { order: 6, name: 'Pushdown fune cavo alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura corda continua.' },
          { order: 7, name: 'Plank su avambracci', targetMuscle: 'Core', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta isometrica neutra.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Quadricipiti Controllati & Glutei)',
        sessionFocus: 'Box Squat, Affondi Bulgari & Leg Extension',
        exercises: [
          { order: 1, name: 'Box Squat al Multipower / Libero', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Pausa di 1" sulla panca.' },
          { order: 2, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto inclinato a 20°.' },
          { order: 3, name: 'Leg Press 45° piedi intermedi', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa profonda controllata.' },
          { order: 4, name: 'Leg Extension alla macchina', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento fluido senza scatti.' },
          { order: 5, name: 'Slanci al cavo basso (Cable Kickback)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 6, name: 'Calf alla macchina o alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Stretch di 2" in basso.' },
          { order: 7, name: 'Bike reclinata defaticante LISS', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Pedalata a 70 rpm.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B (Trazione Orizzontale & Spalle Rotonde)',
        sessionFocus: 'Dorso Orizzontale, Cavi e Braccia Funzionali',
        exercises: [
          { order: 1, name: 'Rematore manubrio su panca inclinata', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Petto in appoggio, gomiti aderenti.' },
          { order: 2, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata pulita al petto.' },
          { order: 3, name: 'Spinte manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Mantenimento tono.' },
          { order: 4, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'BACK_OFF_CEDIMENTO', notes: 'Cavo dietro la schiena + back-off -25%.' },
          { order: 5, name: 'Face pull corda al cavo alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Apertura continua a 90°.' },
          { order: 6, name: 'Pushdown corda + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'NONE', notes: 'Superset braccia.' },
          { order: 7, name: 'Crunch su palla medica / tappetino', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Espirazione profonda.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Glute Pump & Core Sculpt (Densità Metabolica)',
        sessionFocus: 'Isolamento Gluteo ad Alta Ripetizione & Drenaggio',
        exercises: [
          { order: 1, name: 'Hip Thrust monopodalico con manubrio o al Multipower', targetMuscle: 'Gluteo Unilaterale', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Risoluzione asimmetrie con 1" in alto.' },
          { order: 2, name: 'Stacco rumeno gambe semitese con manubri', targetMuscle: 'Ischiocrurali/Glutei', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 3, name: 'Abductor machine (Serie 10+MAX)', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'SERIE_10_PLUS_MAX', notes: '10 reps + scarico 40% a max reps.' },
          { order: 4, name: 'Slanci cavo orizzontale o al pulley', targetMuscle: 'Grande Gluteo', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'Cedimento Concentrico', technique: 'ISOMETRIA_DI_PICCO', notes: 'Contrazione di picco continua.' },
          { order: 5, name: 'Affondi indietro con manubri alternati', targetMuscle: 'Glutei / Gambe', segment: 'METABOLICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Passo lungo all\'indietro.' },
          { order: 6, name: 'Plank con abduzione gamba alternata', targetMuscle: 'Core / Glutei', segment: 'CORE_CARDIO', sets: 3, reps: '45"', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Tenuta isometrica neutra.' },
          { order: 7, name: 'Tapis roulant pendenza 5% LISS drenante', targetMuscle: 'Cardio', segment: 'CORE_CARDIO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Aerobico', technique: 'NONE', notes: 'Camminata fluida a 4.8 km/h.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6 GIORNI
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
  }
};

// ============================================================================
// RICERCA RIGOROSA PER FREQUENZA ESATTA
// ============================================================================

export function getTemplatesForExactDays(exactDays: number): TemplateMeta[] {
  return Object.values(TOPGYM_TEMPLATES_CATALOG).filter(
    (tmpl) => tmpl.daysCount === exactDays
  );
}

export function resolveTopGymTemplate(
  gender: Gender,
  level: TrainingLevel,
  profile: PsychologicalProfile,
  daysPerWeek: number,
  goal: string = 'HYPERTROPHY'
): { recommendedTemplate: TemplateMeta; availableTemplates: TemplateMeta[]; rationale: string } {
  const availableTemplates = getTemplatesForExactDays(daysPerWeek);

  let selectedId = availableTemplates[0]?.id || 'T01';
  let rationale = '';

  // --------------------------------------------------------------------------
  // 2 GIORNI
  // --------------------------------------------------------------------------
  if (daysPerWeek === 2) {
    selectedId = 'T04';
    rationale = `Frequenza 2 Giorni: Template T04 Torso/Gambe Base su motore TOPGYM Classico ad alta efficienza per massimizzare il tempo a disposizione.`;
  }
  // --------------------------------------------------------------------------
  // 3 GIORNI
  // --------------------------------------------------------------------------
  else if (daysPerWeek === 3) {
    if (gender === 'FEMALE') {
      selectedId = 'T07';
      rationale = `Frequenza 3 Giorni (Donna): Template T07 Cerniera d'Anca & Glutei (Hip Thrust, femorali, V-taper e LISS drenante per prevenzione ritenzione idrica).`;
    } else if (level === 'NEOFITA') {
      selectedId = 'T01';
      rationale = `Frequenza 3 Giorni (Neofita): Template T01 Full Body Lineare Kraemer con buffer RIR 2 per apprendimento schemi motori fondamentali.`;
    } else if (goal === 'STRENGTH' || profile === 'AGGRESSIVO_NEURALE') {
      selectedId = 'T12';
      rationale = `Frequenza 3 Giorni (Forza/Neurale): Template T12 Push/Pull/Legs su motore HARDTOPGYM (Bosco-Colli) con CAT (accelerazione compensatoria) e progressione settimanale dei carichi.`;
    } else {
      selectedId = 'T13';
      rationale = `Frequenza 3 Giorni (Ipertrofia Biomeccanica): Template T13 su motore NOCERINO a curve di resistenza continue, allineamento fibre muscolari e isolamento articolare guidato.`;
    }
  }
  // --------------------------------------------------------------------------
  // 4 GIORNI
  // --------------------------------------------------------------------------
  else if (daysPerWeek === 4) {
    if (gender === 'FEMALE') {
      if (level === 'AVANZATO' || profile === 'METABOLICO_PUMPING') {
        selectedId = 'T28';
        rationale = `Frequenza 4 Giorni (Donna Avanzata): Template T28 Focus Glutei & Spalle su motore Chris ACETO con tecniche ad alta densità (Rest-Pause e parziali pulsate su Abductor).`;
      } else {
        selectedId = 'T18';
        rationale = `Frequenza 4 Giorni (Donna Intermedia): Template T18 Upper/Lower con serie Back-Off (-25%) e LISS drenante post-seduta.`;
      }
    } else {
      if (goal === 'STRENGTH' || profile === 'AGGRESSIVO_NEURALE') {
        selectedId = 'T11';
        rationale = `Frequenza 4 Giorni (Forza/Power): Template T11 Upper/Lower Hatfield su motore HARDTOPGYM (Bosco-Colli) con progressione neurale in CAT e micro-overload (+2.5%/+5%).`;
      } else {
        selectedId = 'T16';
        rationale = `Frequenza 4 Giorni (Ipertrofia/Biomeccanica): Template T16 Torso/Arti su motore NOCERINO con 4 fasi progressive, protezione articolare e tensione continua sui distretti prioritari.`;
      }
    }
  }
  // --------------------------------------------------------------------------
  // 5 GIORNI
  // --------------------------------------------------------------------------
  else if (daysPerWeek === 5) {
    if (gender === 'FEMALE') {
      selectedId = 'T19';
      rationale = `Frequenza 5 Giorni (Donna): Template T19 con 3 sedute Lower complementari (Glute-Ham, Quad-Glute, Glute-Pump) e 2 sedute Upper V-Taper.`;
    } else if (profile === 'METABOLICO_PUMPING' || profile === 'TIME_CONSTRAINED') {
      selectedId = 'T22';
      rationale = `Frequenza 5 Giorni (Monomuscolare): Template T22 Chris ACETO su 5 sessioni a distretto singolo per massimo pompaggio e cedimento muscolare profondo.`;
    } else {
      selectedId = 'T17';
      rationale = `Frequenza 5 Giorni (PPL + Specializzazione): Template T17 Chris ACETO su 5 sedute con richiamo antagonisti e braccia/spalle dedicate.`;
    }
  }
  // --------------------------------------------------------------------------
  // 6 GIORNI
  // --------------------------------------------------------------------------
  else {
    selectedId = 'T25';
    rationale = `Frequenza 6 Giorni: Template T25 Chris ACETO PPL x2 ad altissima frequenza e volume, con Rest-Pause sistematico e Stripping to 10.`;
  }

  const recommendedTemplate = TOPGYM_TEMPLATES_CATALOG[selectedId] || availableTemplates[0];

  return {
    recommendedTemplate,
    availableTemplates,
    rationale
  };
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