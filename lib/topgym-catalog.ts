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
// ============================================================================
// TOPGYM EXPANSION: NUOVI MOTORI & TEMPLATE ADDIZIONALI (T29 - T33)
// ============================================================================

export type TopGymExtendedEngine = 
  | 'TOPGYM_BLOCKS'
  | 'HARDTOPGYM'
  | 'ACETO'
  | 'NOCERINO'
  | 'POWERBLOCK_HYBRID'
  | 'BLOOD_VOLUME_OVERLOAD'
  | 'HELMS_PYRAMID'
  | 'BIKINI_WAVE';

// ----------------------------------------------------------------------------
// T29: POWER BLOCK PERIODIZATION (Fitschen & Wilson)
// 5 Giorni: 1 Power Day + 4 Bodybuilding Block Days a rotazione
// ----------------------------------------------------------------------------
export const TEMPLATE_T29 = {
  id: 'T29',
  title: 'Power-Block Periodization (Fitschen/Wilson)',
  gender: 'unisex',
  level: 'intermediate',
  profile: 'powerbuilder',
  daysPerWeek: 5,
  goal: 'forza_ipertrofia',
  primaryEngine: 'POWERBLOCK_HYBRID' as TopGymExtendedEngine,
  description: 'Fusione tra progressione neurale sui Big 3 e blocchi ipertrofici a onde di ripetizioni triadiche (5-7 -> 8-10 -> 10-15 -> 15-30).',
  days: [
    {
      dayNumber: 1,
      title: 'Giorno 1: Powerlifting Neurale (Big 3 AMRAP Sub-Failure)',
      segments: [
        {
          type: 'NEURALE',
          name: 'Core Lifts - Reclutamento Specifico',
          exercises: [
            { name: 'Barbell Back Squat', sets: 5, reps: '5-3-1', restSeconds: 180, notes: '2x5@70%, 2x3@80%, 1x1@90%. Ultimo set: AMRAP a buffer 1 RIR. Se >=3 rep, +2.5kg la sett. successiva.' },
            { name: 'Barbell Bench Press', sets: 5, reps: '5-3-1', restSeconds: 180, notes: '2x5@70%, 2x3@80%, 1x1@90%. Ultimo set: AMRAP sub-cedimento. Se >=3 rep, +2.5kg.' },
            { name: 'Conventional Deadlift', sets: 5, reps: '5-3-1', restSeconds: 180, notes: '2x5@70%, 2x3@80%, 1x1@90%. Ultimo set: AMRAP sub-cedimento. Se >=3 rep, +2.5kg.' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Heavy Accessory Overload',
          exercises: [
            { name: 'Dumbbell Flat Bench Press', sets: 3, reps: '4-6', restSeconds: 120, notes: 'Focus stabilità scapolare e ROM profondo' },
            { name: 'Cable Seated Low Row', sets: 3, reps: '4-6', restSeconds: 120, notes: 'Trazione orizzontale a gomiti stretti' }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Accessori Articolari',
          exercises: [
            { name: 'Lying Leg Curl', sets: 3, reps: '4-6', restSeconds: 90, notes: 'Flessione del ginocchio a carico elevato' },
            { name: 'Standing Calf Raise', sets: 3, reps: '4-6', restSeconds: 90, notes: 'Pausa di 2s in massimo allungamento' }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Giorno 2: Block Day - Gambe & Spalle',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Quadricipiti & Catena Cinetica',
          exercises: [
            { name: 'Hack Squat', sets: 4, reps: 'Block Reps', restSeconds: 120, notes: 'W1-3: 5-7 rep | W4-6: 8-10 rep | W7-9: 10-15 rep | W10-12: 15-30 rep' },
            { name: 'Leg Press 45°', sets: 2, reps: 'Block Reps', restSeconds: 120, notes: 'ROM profondo senza retroversione' },
            { name: 'Leg Extension', sets: 4, reps: 'Block Reps', restSeconds: 90, notes: 'Picco di contrazione 1s' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Flessori & Polpacci',
          exercises: [
            { name: 'Seated Hamstring Curl', sets: 3, reps: 'Block Reps', restSeconds: 90 },
            { name: 'Dumbbell Walking Lunges', sets: 2, reps: 'Block Reps', restSeconds: 90, notes: 'Passo lungo, busto leggermente flesso' },
            { name: 'Calf Press su Leg Press', sets: 4, reps: 'Block Reps', restSeconds: 60 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Deltoidi Multi-Angolo',
          exercises: [
            { name: 'Dumbbell Overhead Press', sets: 3, reps: 'Block Reps', restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise', sets: 3, reps: 'Block Reps', restSeconds: 60 },
            { name: 'Dumbbell Rear Delt Raise', sets: 3, reps: 'Block Reps', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Giorno 3: Block Day - Schiena, Trapezi & Bicipiti',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Spessore e Ampiezza Dorso',
          exercises: [
            { name: 'T-Bar Row supportato', sets: 4, reps: 'Block Reps', restSeconds: 120, notes: 'W1-3: 5-7 | W4-6: 8-10 | W7-9: 10-15 | W10-12: 15-30' },
            { name: 'Pull-Up (o Lat Machine presa prona)', sets: 5, reps: 'Block Reps', restSeconds: 120 },
            { name: 'Cable Seated Row presa a V', sets: 4, reps: 'Block Reps', restSeconds: 90 },
            { name: 'Deadlift da rialzo / Stacco regolare', sets: 2, reps: 'Block Reps', restSeconds: 120 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Trapezi e Flessori del Braccio',
          exercises: [
            { name: 'Dumbbell Shrugs', sets: 3, reps: 'Block Reps', restSeconds: 60, notes: 'Squeeze al vertice senza rotazione' },
            { name: 'Dumbbell Bicep Curl alternato', sets: 4, reps: 'Block Reps', restSeconds: 60 },
            { name: 'Preacher Curl con bilanciere sagomato', sets: 2, reps: 'Block Reps', restSeconds: 60 },
            { name: 'Hammer Curl con manubri', sets: 2, reps: 'Block Reps', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Giorno 4: Block Day - Petto, Tricipiti & Addome',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Catena Anteriore Superiore',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: 3, reps: 'Block Reps', restSeconds: 120, notes: 'Panca a 30° | W1-3: 5-7 | W4-6: 8-10 | W7-9: 10-15 | W10-12: 15-30' },
            { name: 'Machine Chest Press', sets: 4, reps: 'Block Reps', restSeconds: 90 },
            { name: 'Cable Crossover / Croci ai cavi', sets: 4, reps: 'Block Reps', restSeconds: 60 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Estensori del Braccio',
          exercises: [
            { name: 'Cable Pushdown con barra', sets: 4, reps: 'Block Reps', restSeconds: 60 },
            { name: 'Overhead Cable Triceps Extension', sets: 4, reps: 'Block Reps', restSeconds: 60 }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Stabilità Centrale',
          exercises: [
            { name: 'Cable Woodchopper / Crunch cavo', sets: 3, reps: '15-20', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 5,
      title: 'Giorno 5: Block Rotation (Rotazione 4° Giorno)',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Rotazione Settimanale Distretti',
          exercises: [
            { name: 'Hack Squat / T-Bar Row / Incline Press', sets: 4, reps: 'Block Reps', restSeconds: 120, notes: 'Esegui il distretto programmato per la rotazione (Settimana 1: Gambe/Spalle, Settimana 2: Dorso/Bicipiti, Settimana 3: Petto/Tricipiti).' },
            { name: 'Esercizio Multiarticolare Complementare', sets: 4, reps: 'Block Reps', restSeconds: 90 },
            { name: 'Isolamento Distretto Target', sets: 4, reps: 'Block Reps', restSeconds: 60 }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// T30: BLOOD VOLUME MAXIMUM OVERLOAD (Fitschen & Wilson)
// Rotazione completa sui 6 Workout originali (Tabella 7.3)
// Cadenza: 3 ON, 1 OFF, 2 ON, 1 OFF
// ============================================================================
export const TEMPLATE_T30 = {
  id: 'T30',
  title: 'Blood Volume & Maximum Overload (Fitschen/Wilson)',
  gender: 'unisex' as const,
  level: 'advanced' as const,
  profile: 'bodybuilder' as const,
  daysPerWeek: 6,
  goal: 'ipertrofia_pura',
  primaryEngine: 'BLOOD_VOLUME_OVERLOAD' as any,
  description: 'Programma originale da competizione a doppia stimolazione cellulare di Fitschen & Wilson: alternanza tra Overload pesante (3x4-7 a cedimento progressivo) e Blood Volume (14-20 rep in superset con tempo 3-0-3).',
  days: [
    {
      dayNumber: 1,
      title: 'Workout 1: Dorso & Trapezi (Overload) + Deltoidi (Blood Volume)',
      segments: [
        {
          type: 'NEURALE' as const,
          name: 'Overload: Schiena e Trapezi Meccanico Pesante',
          exercises: [
            { name: 'Deadlift da terra', sets: 3, reps: '4-7', restSeconds: 180, notes: 'Overload. W1-2: 1-2 RIR | W3: set 3 a cedimento | W4: cedimento su tutti i set. Se completi 7 rep, aumenta il carico.' },
            { name: 'Pull-Up (Trazioni alla sbarra)', sets: 3, reps: '4-7', restSeconds: 150, notes: 'Zavorra se necessario per restare nel range 4-7 rep.' },
            { name: 'Lat Pulldown presa prona larga', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Trazione al petto, gomiti in basso.' },
            { name: 'T-Bar Row con carico libero', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Busto inclinato a 45°.' },
            { name: 'Low Machine Row presa neutra', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Focus retrazione scapolare.' },
            { name: 'Barbell Shrug', sets: 2, reps: '4-7', restSeconds: 90, notes: 'Scrollate con bilanciere pesante.' }
          ]
        },
        {
          type: 'METABOLICO' as const,
          name: 'Blood Volume: Spalle (Superset TUT 3-0-3)',
          exercises: [
            { name: 'Dumbbell Lateral Raise', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 1A: Cadenza 3s salita, 3s discesa, squeeze al picco. Rest max 10s.' },
            { name: 'Dumbbell Overhead Shoulder Press', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 1B: Tensione continua senza lockout. Rest 90s a fine superset.' },
            { name: 'Rear Delt Machine Fly (Reverse Pec Deck)', sets: 3, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 2A: TUT 3-0-3. Rest max 10s.' },
            { name: 'Barbell Upright Row', sets: 3, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 2B: Tirate al mento/petto con presa media. Rest 90s.' }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Workout 2: Gambe & Addominali (Blood Volume)',
      segments: [
        {
          type: 'METABOLICO' as const,
          name: 'Blood Volume: Quadricipiti, Flessori & Polpacci (TUT 3-0-3)',
          exercises: [
            { name: 'Leg Extension', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 1A: TUT 3-0-3 con 1s di squeeze isometrico in alto. Rest 10s.' },
            { name: 'Leg Press 45°', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 1B: Pompaggio continuo, no blocco alle ginocchia. Rest 90s.' },
            { name: 'Lying Hamstring Leg Curl', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 2A: TUT 3-0-3. Rest 10s.' },
            { name: 'Hack Squat', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 2B: Discesa controllata 3s. Rest 90s.' },
            { name: 'Barbell Hip Thrust', sets: 2, reps: '14-20', restSeconds: 60, notes: 'Squeeze gluteo di 2s al vertice.' },
            { name: 'Dumbbell Standing Calf Raise', sets: 2, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 3A: Rest 10s.' },
            { name: 'Toe Press su Leg Press', sets: 2, reps: '14-20', restSeconds: 60, notes: 'SUPERSET 3B: Rest 60s.' }
          ]
        },
        {
          type: 'CORE_CARDIO' as const,
          name: 'Blood Volume: Addominali (TUT 3-0-3)',
          exercises: [
            { name: 'Decline Sit-Up', sets: 3, reps: '14-20', restSeconds: 45, notes: 'Contrazione addominale continua.' },
            { name: 'Cable Crunch al cavo alto', sets: 3, reps: '14-20', restSeconds: 45, notes: 'Flessione del tronco senza tirare con le braccia.' }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Workout 3: Petto (Overload) + Bicipiti & Tricipiti (Blood Volume)',
      segments: [
        {
          type: 'NEURALE' as const,
          name: 'Overload: Pettorali Meccanico Pesante',
          exercises: [
            { name: 'Barbell Flat Bench Press', sets: 3, reps: '4-7', restSeconds: 180, notes: 'Overload pesante. Rest 2-4 min. Se chiudi 7 rep, aumenta il carico la prossima volta.' },
            { name: 'Decline Barbell Bench Press', sets: 3, reps: '4-7', restSeconds: 150, notes: 'Panca declinata con carico elevato.' },
            { name: 'Incline Dumbbell Bench Press', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Panca a 30°.' },
            { name: 'Pec Deck Machine', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Chiusura controllata.' }
          ]
        },
        {
          type: 'METABOLICO' as const,
          name: 'Blood Volume: Braccia (Superset TUT 3-0-3)',
          exercises: [
            { name: 'Dumbbell Hammer Curl', sets: 3, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 1A: Presa neutra, TUT 3-0-3. Rest 10s.' },
            { name: 'Barbell Bicep Curl', sets: 3, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 1B: Bilanciere dritto, gomiti stabili. Rest 90s.' },
            { name: 'Wide Grip Dumbbell Curl', sets: 3, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 2A: Presa larga extraruotata. Rest 10s.' },
            { name: 'Cable Low Bicep Curl', sets: 3, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 2B: Tensione continua al cavo. Rest 90s.' },
            { name: 'V-Bar Cable Triceps Pushdown', sets: 3, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 3A: Gomiti aderenti ai fianchi. Rest 10s.' },
            { name: 'Dumbbell Skullcrusher su panca piana', sets: 3, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 3B: Estensione tricipiti. Rest 90s.' },
            { name: 'Two-Arm Dumbbell Kickback', sets: 3, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 4A: Busto a 90°, picco di 1s. Rest 10s.' },
            { name: 'Machine Triceps Extension', sets: 3, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 4B: Pompaggio continuo. Rest 90s.' }
          ]
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Workout 4: Deltoidi (Overload) + Dorso & Trapezi (Blood Volume)',
      segments: [
        {
          type: 'NEURALE' as const,
          name: 'Overload: Deltoidi Meccanico Pesante',
          exercises: [
            { name: 'Dumbbell Standing Military Press', sets: 3, reps: '4-7', restSeconds: 180, notes: 'Overload spalle. Se chiudi 7 rep, aumenta il peso la volta successiva.' },
            { name: 'Dumbbell Standing Lateral Raise', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Carico pesante 4-7 rep con controllo eccentrico.' },
            { name: 'Reverse Pec Deck Fly', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Deltoide posteriore con carico elevato.' },
            { name: 'Barbell Upright Row', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Tirate pesanti al petto.' }
          ]
        },
        {
          type: 'METABOLICO' as const,
          name: 'Blood Volume: Schiena & Trapezi (Superset TUT 3-0-3)',
          exercises: [
            { name: 'Neutral-Grip Cable Seated Row', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 1A: TUT 3-0-3, squeeze dorsale 1s. Rest 10s.' },
            { name: 'Standing Bent-Over Dumbbell Row', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 1B: Trazione bilanciata con manubri. Rest 90s.' },
            { name: 'Horizontal Machine Chest-Supported Row', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 2A: TUT 3-0-3. Rest 10s.' },
            { name: 'Neutral-Grip Lat Pulldown', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 2B: Presa triangolo o parallela. Rest 90s.' },
            { name: 'Dumbbell Shrug', sets: 1, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 3A: Pompaggio trapezi. Rest 10s.' },
            { name: 'Straight-Bar Cable Shrug', sets: 1, reps: '14-20', restSeconds: 60, notes: 'SUPERSET 3B: Rest 60s.' }
          ]
        }
      ]
    },
    {
      dayNumber: 5,
      title: 'Workout 5: Gambe & Addominali (Overload)',
      segments: [
        {
          type: 'NEURALE' as const,
          name: 'Overload: Gambe Meccanico Pesante',
          exercises: [
            { name: 'Barbell Back Squat', sets: 3, reps: '4-7', restSeconds: 180, notes: 'Overload squat pesante. Rest 2-4 min. Se chiudi 7 rep, aumenta il peso.' },
            { name: 'Leg Extension con carico elevato', sets: 3, reps: '4-7', restSeconds: 120 },
            { name: 'Dumbbell Lying Leg Curl', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Manubrio stretto tra i piedi (o leg curl macchinario pesante).' },
            { name: 'Stiff-Leg Deadlift (Mezzi stacchi gambe tese)', sets: 3, reps: '4-7', restSeconds: 150, notes: 'Carico pesante sulla catena posteriore.' },
            { name: 'Dumbbell Walking Lunges', sets: 1, reps: '7-10/leg', restSeconds: 90, notes: '1 serie pesante da 7-10 passi per gamba.' },
            { name: 'Machine Hip Abduction', sets: 2, reps: '10', restSeconds: 60, notes: 'Carico medio-pesante per 10 rep.' },
            { name: 'Machine Hip Adduction', sets: 2, reps: '10', restSeconds: 60, notes: 'Carico medio-pesante per 10 rep.' },
            { name: 'Standing Calf Raise', sets: 2, reps: '10', restSeconds: 60, notes: 'Pausa di 2s in massimo allungamento.' }
          ]
        },
        {
          type: 'CORE_CARDIO' as const,
          name: 'Overload: Addominali con Sovraccarico',
          exercises: [
            { name: 'Weighted Sit-Up su declinata', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Disco al petto o dietro la nuca. 4-7 rep pesanti.' },
            { name: 'Machine Abdominal Crunch', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Carico pesante alla macchina.' }
          ]
        }
      ]
    },
    {
      dayNumber: 6,
      title: 'Workout 6: Petto (Blood Volume) + Bicipiti & Tricipiti (Overload)',
      segments: [
        {
          type: 'METABOLICO' as const,
          name: 'Blood Volume: Petto (Superset TUT 3-0-3)',
          exercises: [
            { name: 'Dumbbell Flat Fly', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 1A: TUT 3-0-3 con squeeze pettorale al picco. Rest 10s.' },
            { name: 'Dumbbell Flat Bench Press', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 1B: Pompaggio continuo senza sosta in lockout. Rest 90s.' },
            { name: 'Pec Deck Machine', sets: 4, reps: '14-20', restSeconds: 10, notes: 'SUPERSET 2A: TUT 3-0-3. Rest 10s.' },
            { name: 'Hammer Incline Chest Press', sets: 4, reps: '14-20', restSeconds: 90, notes: 'SUPERSET 2B: Spinta inclinata continua. Rest 90s.' }
          ]
        },
        {
          type: 'NEURALE' as const,
          name: 'Overload: Bicipiti Meccanico Pesante',
          exercises: [
            { name: 'Barbell Bicep Curl', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Overload bicipiti. Rest 2 min. Se chiudi 7 rep, aumenta il carico.' },
            { name: 'Dumbbell Hammer Curl pesante', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Carico pesante per il brachioradiale.' },
            { name: 'Machine Preacher Curl', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Isolamento bicipiti su panca Scott.' }
          ]
        },
        {
          type: 'NEURALE' as const,
          name: 'Overload: Tricipiti Meccanico Pesante',
          exercises: [
            { name: 'Straight-Bar Cable Triceps Pushdown', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Overload tricipiti con sbarra dritta pesante. Se chiudi 7 rep, aumenta il carico.' },
            { name: 'Barbell Skullcrusher su panca piana', sets: 3, reps: '4-7', restSeconds: 120, notes: 'Bilanciere sagomato alla fronte.' },
            { name: 'Dumbbell Overhead Triceps Extension', sets: 3, reps: '4-7', restSeconds: 90, notes: 'Estensione a due mani sopra la testa.' }
          ]
        }
      ]
    }
  ]
};

// ----------------------------------------------------------------------------
// T31: ERIC HELMS INTERMEDIATE BODYBUILDING (The Muscle & Strength Pyramid)
// 4 Giorni: Upper / Lower Split con Wave Loading e Double Progression
// ----------------------------------------------------------------------------
export const TEMPLATE_T31 = {
  id: 'T31',
  title: 'Helms Intermediate Upper/Lower (Pyramid Method)',
  gender: 'unisex',
  level: 'intermediate',
  profile: 'bodybuilder',
  daysPerWeek: 4,
  goal: 'ipertrofia_pura',
  primaryEngine: 'HELMS_PYRAMID' as TopGymExtendedEngine,
  description: 'Programmazione metodologica evidence-based Eric Helms: Wave Loading periodizzato sui compound pesanti e Double Progression controllata sugli isolamenti a RIR calibrato.',
  days: [
    {
      dayNumber: 1,
      title: 'Lower Body 1 - Focus Squat & Tensione Quadricipiti',
      segments: [
        {
          type: 'NEURALE',
          name: 'Compound Primario: Wave Loading',
          exercises: [
            { name: 'Barbell Back Squat', sets: 4, reps: '4-6', restSeconds: 180, notes: 'W1: 4x6 @RPE 7-8 | W2: 4x5 (+2.5kg) @RPE 8 | W3: 4x4 (+2.5kg) @RPE 8.5-9 | W4: Deload 2x4 (carico W1, RPE 6)' },
            { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '4-6', restSeconds: 150, notes: 'Controllo eccentrico 2-3s a ginocchio semiflesso. Stesso schema di progressione wave.' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Accessori Meccanici: Double Progression',
          exercises: [
            { name: 'Leg Extension', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression: inizia con carico per 3x8, porta a 3x12 prima di salire di peso.' },
            { name: 'Lying Leg Curl', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression 8-12 rep' }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Glutei & Polpacci',
          exercises: [
            { name: 'Seated Hip Abduction Machine', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Double progression 12-15 rep' },
            { name: 'Standing Calf Raise', sets: 4, reps: '6-8', restSeconds: 90, notes: 'Pausa di 2s al fondo della fase eccentrica' }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Upper Body 1 - Spinta Orizzontale & Trazione Primaria',
      segments: [
        {
          type: 'NEURALE',
          name: 'Compound Orizzontali: Wave Loading',
          exercises: [
            { name: 'Barbell Flat Bench Press', sets: 4, reps: '4-6', restSeconds: 180, notes: 'W1: 4x6 @RPE 7-8 | W2: 4x5 (+2.5kg) | W3: 4x4 (+2.5kg) | W4: Deload 2x4' },
            { name: 'Barbell Bent-Over Row', sets: 3, reps: '6-8', restSeconds: 120, notes: 'Schiena a 45°, trazione all addome basso' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Upper Body Secondari: Double Progression',
          exercises: [
            { name: 'Incline Dumbbell Bench Press', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression 8-12 rep' },
            { name: 'Chin-Ups (Trazioni presa supina o Lat Machine)', sets: 3, reps: '8-12', restSeconds: 90, notes: 'ROM completo con estensione scapolare' }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Deltoidi & Braccia',
          exercises: [
            { name: 'Dumbbell Lateral Raise', sets: 3, reps: '8-12', restSeconds: 60, notes: 'Double progression 8-12 rep' },
            { name: 'Overhead Cable Triceps Extension', sets: 3, reps: '8-12', restSeconds: 60 },
            { name: 'Incline Dumbbell Bicep Curl', sets: 3, reps: '8-12', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Lower Body 2 - Leg Press & Catena Posteriore',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Multiarticolari di Volume',
          exercises: [
            { name: 'Leg Press 45°', sets: 3, reps: '8-12', restSeconds: 120, notes: 'Double progression: 3x8 fino a 3x12 con esecuzione fluida' },
            { name: 'Weighted Back Extension (Iperestensioni con disco)', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Focus su attivazione glutei e lombari' }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Isolamento Quadricipiti, Flessori & Polpacci',
          exercises: [
            { name: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Double progression 12-15 rep' },
            { name: 'Seated Leg Curl', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Double progression 12-15 rep' },
            { name: 'Seated Calf Raise', sets: 4, reps: '8-12', restSeconds: 60, notes: 'Focus su muscolo soleo' }
          ]
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Upper Body 2 - Spinta Verticale & Densità Pectoro-Dorsale',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Compound Spinta e Trazione Verticale',
          exercises: [
            { name: 'Flat Dumbbell Press', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression 8-12 rep' },
            { name: 'Lat Pulldown presa prona', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression 8-12 rep' },
            { name: 'Standing Overhead Barbell Press (Military)', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Double progression 8-12 rep' },
            { name: 'Cable Seated Row con triangolo', sets: 3, reps: '8-12', restSeconds: 90 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Rifinitura e Pompaggio',
          exercises: [
            { name: 'Cable Chest Flyes', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Double progression 12-15 rep' },
            { name: 'Triceps Rope Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
            { name: 'EZ-Bar Bicep Curl', sets: 3, reps: '12-15', restSeconds: 60 }
          ]
        }
      ]
    }
  ]
};

// ----------------------------------------------------------------------------
// T32: BIKINI DIVISION 4-DAY MODULAR (Fitschen & Wilson)
// 4 Giorni: Progettato specificamente per donne - Glute, Hamstrings & Delts Priority
// ----------------------------------------------------------------------------
export const TEMPLATE_T32 = {
  id: 'T32',
  title: 'Bikini Division 4-Day Modular (Fitschen/Wilson)',
  gender: 'female',
  level: 'intermediate',
  profile: 'bikini',
  daysPerWeek: 4,
  goal: 'tonificazione_glutei',
  primaryEngine: 'BIKINI_WAVE' as TopGymExtendedEngine,
  description: 'Adattamento modulare a 4 giorni del protocollo da competizione Fitschen/Wilson. Focus assoluto su glutei, deltoidi e catena cinetica posteriore, con alternanza di stimoli Low/Moderate/High reps.',
  days: [
    {
      dayNumber: 1,
      title: 'Sessione A: Schiena Bassa (L) + Glutei Ipertrofici (M) + Addome',
      segments: [
        {
          type: 'NEURALE',
          name: 'Heavy Posterior Chain (Low Reps)',
          exercises: [
            { name: 'Conventional Deadlift (o Semi-Sumo)', sets: 3, reps: '4-6', restSeconds: 150, notes: 'W1-3: 3x6 | W4-6: 3x5 | W7-9: 3x4. Focus femorali e glutei.' },
            { name: 'Pendlay Row / Barbell Row a 90°', sets: 3, reps: '4-8', restSeconds: 120, notes: 'W1-3: 6-8 rep | W4-6: 5-7 rep | W7-9: 4-6 rep.' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Glute Hypertrophy (Moderate Reps)',
          exercises: [
            { name: 'Barbell Hip Thrust', sets: 3, reps: '6-12', restSeconds: 90, notes: 'W1-3: 10-12 rep | W4-6: 8-10 rep | W7-9: 6-10 rep. Pausa 2s in chiusura.' },
            { name: 'Dumbbell Walking Lunges per gamba', sets: 3, reps: '8-12', restSeconds: 90, notes: 'Passo lungo per massimo allungamento gluteo.' },
            { name: 'Weighted 45° Back Extension (Focus Glutei)', sets: 3, reps: '10-15', restSeconds: 60, notes: 'Piedi extraruotati a 45°, colonna bloccata.' }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Addome & Stabilità',
          exercises: [
            { name: 'Cable Crunch al cavo alto', sets: 3, reps: '10-15', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Sessione B: Deltoidi (L/M) + Dorso Superiore + Spinta',
      segments: [
        {
          type: 'NEURALE',
          name: 'Spalle e Spinta (Low/Mod Reps)',
          exercises: [
            { name: 'Barbell Standing Overhead Press', sets: 3, reps: '4-6', restSeconds: 120, notes: 'W1-3: 3x6 | W4-6: 3x5 | W7-9: 3x4.' },
            { name: 'Incline Dumbbell Bench Press', sets: 3, reps: '6-12', restSeconds: 90, notes: 'Solo per supporto pettorale clavicolare.' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Ampiezza Dorso & V-Shape',
          exercises: [
            { name: 'Pull-Up / Lat Machine presa neutra', sets: 3, reps: '6-10', restSeconds: 90, notes: 'Fondamentale per la proporzione V-Shape Bikini.' },
            { name: 'Chest Supported Dumbbell Row', sets: 3, reps: '8-12', restSeconds: 90 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Isolamento Deltoidi Laterali & Braccia',
          exercises: [
            { name: 'Seated Dumbbell Lateral Raise', sets: 4, reps: '8-15', restSeconds: 60, notes: 'W1-3: 10-15 | W4-6: 8-12 | W7-9: 8-10.' },
            { name: 'Overhead Cable Triceps Extension', sets: 2, reps: '10-15', restSeconds: 60 },
            { name: 'Standing EZ-Bar Curl', sets: 2, reps: '10-15', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Sessione C: Lower Body (L) + Glute Pump (High Reps)',
      segments: [
        {
          type: 'NEURALE',
          name: 'Gambe Forza (Low Reps)',
          exercises: [
            { name: 'Barbell Back Squat (o Front Squat)', sets: 3, reps: '4-6', restSeconds: 150, notes: 'W1-3: 3x6 | W4-6: 3x5 | W7-9: 3x4.' },
            { name: 'Romanian Deadlift con manubri', sets: 3, reps: '4-6', restSeconds: 120, notes: 'Enfasi sull allungamento femorale.' }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Catena Posteriore Intermedia',
          exercises: [
            { name: 'Bulgarian Split Squat per gamba', sets: 3, reps: '6-10', restSeconds: 90, notes: 'Busto inclinato a 45° per isolare il grande gluteo.' },
            { name: 'Seated Hamstring Leg Curl', sets: 3, reps: '6-10', restSeconds: 75 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Glute Density Pump (High Reps: 15-30)',
          exercises: [
            { name: 'Cable Pull-Through', sets: 3, reps: '15-25', restSeconds: 60, notes: 'Squeeze gluteo di 2s al picco.' },
            { name: 'Banded Hip Thrust (o manubrio su panca)', sets: 3, reps: '20-30', restSeconds: 45, notes: 'Bruciore metabolico continuo.' },
            { name: 'Machine Hip Abductor', sets: 3, reps: '20-30', restSeconds: 45 }
          ]
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Sessione D: Deltoidi Pompaggio (H) + Dorso (H) + Glute Finisher',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Trazione e Deltoidi Multi-Angolo',
          exercises: [
            { name: 'Reverse-Grip Lat Pulldown', sets: 3, reps: '6-12', restSeconds: 90 },
            { name: 'Standing 1-Arm Side Lateral Raise', sets: 4, reps: '6-10', restSeconds: 60, notes: 'Inclinati leggermente verso l esterno' },
            { name: 'Rear Delt Dumbbell Raise', sets: 3, reps: '8-12', restSeconds: 60 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'High-Rep Metabolic Finishers (15-30 Reps)',
          exercises: [
            { name: 'Cable Side Lateral Raise', sets: 4, reps: '20-30', restSeconds: 45, notes: 'Tensione continua al cavo basso.' },
            { name: 'Straight-Arm Cable Pulldown', sets: 3, reps: '20-30', restSeconds: 45, notes: 'Isolamento del gran dorsale.' },
            { name: 'Single-Leg Cable Glute Kickback', sets: 3, reps: '20-25', restSeconds: 45, notes: 'Isolamento gluteo alto/medio.' }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Core Rotation',
          exercises: [
            { name: 'Russian Twist a terra', sets: 3, reps: '10-15/side', restSeconds: 45 }
          ]
        }
      ]
    }
  ]
};

// ----------------------------------------------------------------------------
// T33: BIKINI DIVISION 6-DAY ELITE (Fitschen & Wilson Original Contest Plan)
// 6 Giorni: Il protocollo da gara completo di Peter Fitschen & Cliff Wilson
// ----------------------------------------------------------------------------
export const TEMPLATE_T33 = {
  id: 'T33',
  title: 'Bikini Division 6-Day Elite (Fitschen/Wilson Original)',
  gender: 'female',
  level: 'advanced',
  profile: 'bikini',
  daysPerWeek: 6,
  goal: 'definizione_gara',
  primaryEngine: 'BIKINI_WAVE' as TopGymExtendedEngine,
  description: 'Il protocollo autentico per atlete Bikini estratto da Fitschen & Wilson: 6 sessioni settimanali a onde triadiche di volume, alternando carichi pesanti (L: 4-6), ipertrofici (M: 8-12) e metabolici (H: 15-30).',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: Back (L) + Glutes (M) + Abs',
      segments: [
        {
          type: 'NEURALE',
          name: 'Back Low Reps',
          exercises: [
            { name: 'Deadlift', sets: 3, reps: '4-6', restSeconds: 150, notes: 'W1: 3x6 | W2: 4x6 | W3: 5x6 (W4-6: 5 rep | W7-9: 4 rep)' },
            { name: 'Pendlay Row', sets: 3, reps: '4-8', restSeconds: 120, notes: 'W1-3: 6-8 rep | W4-6: 5-7 rep | W7-9: 4-6 rep' },
            { name: 'Pull-Up', sets: 2, reps: '4-8', restSeconds: 120 },
            { name: 'Dumbbell Row', sets: 2, reps: '5-10', restSeconds: 90 }
          ]
        },
        {
          type: 'MECCANICO',
          name: 'Glutes Moderate Reps',
          exercises: [
            { name: 'Dumbbell Lunge per gamba', sets: 3, reps: '8-12', restSeconds: 90 },
            { name: 'Barbell Hip Thrust', sets: 3, reps: '8-12', restSeconds: 90 },
            { name: 'Weighted Back Extension', sets: 3, reps: '8-15', restSeconds: 60 }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Abs',
          exercises: [
            { name: 'Cable Crunch', sets: 3, reps: '10-15', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Day 2: Chest (M) + Shoulders (M) + Arms (M)',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Upper Body Moderate Reps',
          exercises: [
            { name: 'Dumbbell Bench Press', sets: 3, reps: '6-12', restSeconds: 90 },
            { name: 'Dumbbell Overhead Press', sets: 3, reps: '6-12', restSeconds: 90 },
            { name: 'Seated Side Lateral Raise', sets: 3, reps: '8-15', restSeconds: 60 },
            { name: 'Parallel Bars Dip (o panca)', sets: 3, reps: '6-12', restSeconds: 90 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Arms Hypertrophy',
          exercises: [
            { name: 'Standing EZ-Bar Curl', sets: 3, reps: '6-12', restSeconds: 60 },
            { name: 'Overhead Cable Extension', sets: 3, reps: '8-15', restSeconds: 60 },
            { name: 'Rope Cable Curl', sets: 3, reps: '8-15', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Day 3: Lower Body (L) + Glutes (H) + Abs',
      segments: [
        {
          type: 'NEURALE',
          name: 'Lower Body Low Reps',
          exercises: [
            { name: 'Barbell Squat', sets: 3, reps: '4-6', restSeconds: 150, notes: 'W1: 3x6 | W2: 4x6 | W3: 5x6' },
            { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '4-6', restSeconds: 120 },
            { name: 'Leg Extension', sets: 2, reps: '5-10', restSeconds: 90 },
            { name: 'Hamstring Curl', sets: 2, reps: '5-10', restSeconds: 90 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Glutes High Reps (15-30 Reps)',
          exercises: [
            { name: 'Step-Back Dumbbell Lunge', sets: 3, reps: '15-20', restSeconds: 60 },
            { name: 'Cable Pull-Through', sets: 3, reps: '15-25', restSeconds: 60 },
            { name: 'Banded Hip Thrust', sets: 3, reps: '20-30', restSeconds: 45 }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Abs',
          exercises: [
            { name: 'Lying Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 }
          ]
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Day 4: Shoulders (L) + Back (H)',
      segments: [
        {
          type: 'NEURALE',
          name: 'Shoulders Low Reps',
          exercises: [
            { name: 'Barbell Overhead Press', sets: 3, reps: '4-6', restSeconds: 120 },
            { name: '1-Arm Standing Side Lateral Raise', sets: 3, reps: '5-10', restSeconds: 60 },
            { name: 'Barbell Upright Row', sets: 2, reps: '5-10', restSeconds: 60 },
            { name: '1-Arm Braced Rear Raise', sets: 2, reps: '5-10', restSeconds: 60 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Back High Reps (15-30 Reps)',
          exercises: [
            { name: 'Moto Row (Cavo basso)', sets: 3, reps: '15-20', restSeconds: 60 },
            { name: 'Chest-Supported Row con manubri', sets: 3, reps: '15-20', restSeconds: 60 },
            { name: 'Straight-Arm Cable Pressdown', sets: 3, reps: '20-30', restSeconds: 45 }
          ]
        }
      ]
    },
    {
      dayNumber: 5,
      title: 'Day 5: Glutes (L) + Legs (H) + Abs',
      segments: [
        {
          type: 'NEURALE',
          name: 'Glutes Low Reps',
          exercises: [
            { name: 'Heavy Barbell Hip Thrust', sets: 3, reps: '4-6', restSeconds: 150, notes: 'W1: 3x6 | W2: 4x6 | W3: 5x6' },
            { name: 'Bulgarian Split Squat per gamba', sets: 3, reps: '4-8', restSeconds: 90 },
            { name: 'Sumo Leg Press', sets: 2, reps: '5-10', restSeconds: 90 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Legs High Reps (15-30 Reps)',
          exercises: [
            { name: 'Hack Squat discesa controllata', sets: 3, reps: '15-20', restSeconds: 75 },
            { name: 'Leg Extension', sets: 3, reps: '20-30', restSeconds: 45 },
            { name: 'Hamstring Curl', sets: 3, reps: '20-30', restSeconds: 45 },
            { name: 'Standing Calf Raise', sets: 3, reps: '15-25', restSeconds: 45 }
          ]
        },
        {
          type: 'CORE_CARDIO',
          name: 'Abs',
          exercises: [
            { name: 'Russian Twist con disco', sets: 3, reps: '8-12/side', restSeconds: 45 }
          ]
        }
      ]
    },
    {
      dayNumber: 6,
      title: 'Day 6: Back (M) + Glutes (H) + Shoulders (H)',
      segments: [
        {
          type: 'MECCANICO',
          name: 'Back Moderate Reps',
          exercises: [
            { name: 'Reverse-Grip Pulldown', sets: 3, reps: '6-12', restSeconds: 90 },
            { name: 'Meadows Row (T-bar ad un braccio)', sets: 3, reps: '6-12', restSeconds: 90 },
            { name: 'Wide-Grip Cable Seated Row', sets: 3, reps: '8-15', restSeconds: 75 }
          ]
        },
        {
          type: 'METABOLICO',
          name: 'Glutes & Shoulders High Reps Pump',
          exercises: [
            { name: 'Single-Leg Hip Thrust', sets: 3, reps: '15-20', restSeconds: 60 },
            { name: 'Cable Glute Kickback', sets: 3, reps: '20-25', restSeconds: 45 },
            { name: 'Machine Abductor', sets: 3, reps: '20-30', restSeconds: 45 },
            { name: 'Cable Side Lateral Raise', sets: 5, reps: '20-30', restSeconds: 45, notes: 'Volume estremo sui deltoidi laterali' }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// AGGIORNAMENTO DEL REGISTRO DEI TEMPLATE
// Aggiunta non distruttiva all'array del catalogo
// ============================================================================
export const EXTENDED_TEMPLATES = [
  TEMPLATE_T29,
  TEMPLATE_T30,
  TEMPLATE_T31,
  TEMPLATE_T32,
  TEMPLATE_T33
];

// ============================================================================
// AGGIORNAMENTO DI RESOLVETOPGYMTEMPLATE (ROUTING ADDIZIONALE A 5 ASSI)
// ============================================================================

export interface ResolveTemplateParams {
  gender: 'male' | 'female' | 'unisex';
  level: 'beginner' | 'intermediate' | 'advanced';
  profile: 'bodybuilder' | 'powerbuilder' | 'bikini' | 'wellness' | 'fitness';
  daysPerWeek: number;
  goal: string;
}

/**
 * Risolutore additivo del wizard di TopGym:
 * Mappa i 5 assi verso i nuovi protocolli T29-T33 preservando i rami preesistenti.
 */
export function resolveExtendedTopGymTemplate(params: ResolveTemplateParams): string | null {
  const { gender, level, profile, daysPerWeek, goal } = params;

  // 1. RAMO BIKINI (Target Donna, Glutei & Proporzioni da palco)
  if (gender === 'female' || profile === 'bikini' || profile === 'wellness') {
    if (daysPerWeek === 4) {
      return 'T32'; // Bikini Division 4-Day Modular
    }
    if (daysPerWeek >= 5) {
      return 'T33'; // Bikini Division 6-Day Elite
    }
  }

  // 2. RAMO POWERBUILDER / IBRIDO FORZA-IPERTROFIA (Fitschen/Wilson Power-Block)
  if (profile === 'powerbuilder' || goal === 'forza_ipertrofia') {
    if (daysPerWeek === 5) {
      return 'T29'; // Power-Block Periodization 5 Days
    }
  }

  // 3. RAMO DENSITÀ ESTREMA & OVERLOAD (Fitschen/Wilson Blood Volume)
  if (profile === 'bodybuilder' && level === 'advanced' && (daysPerWeek === 5 || daysPerWeek === 6)) {
    if (goal === 'ipertrofia_pura' || goal === 'densita') {
      return 'T30'; // Blood Volume & Maximum Overload
    }
  }

  // 4. RAMO UPPER / LOWER INTERMEDIO RIGOROSO (Eric Helms)
  if (daysPerWeek === 4 && (level === 'intermediate' || level === 'advanced')) {
    if (goal === 'ipertrofia_pura' || goal === 'massa') {
      return 'T31'; // Helms Intermediate Upper/Lower
    }
  }

  // Se nessun ramo della nuova tranche intercetta la combinazione, ritorna null
  // per far scattare la resolveTopGymTemplate standard (T01 - T28).
  return null;
}