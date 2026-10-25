import { M_B1_SPLIT_BASE, M_B2_SPLIT_ANTAGONISTI } from './topgym-templates';
import { TOPGYM_OVER40_TEMPLATES } from './over40-templates';
import { HATFIELD_4D_TEMPLATES } from './topgym-hatfield-4d';
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
  primaryEngine: 'TOPGYM_BLOCKS' | 'HARDTOPGYM' | 'ACETO' | 'NOCERINO' | 'POWERBLOCK_HYBRID' | 'BLOOD_VOLUME_OVERLOAD' | 'HELMS_PYRAMID' | 'BIKINI_WAVE' | string;
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
  },

  // --------------------------------------------------------------------------
  // T02: FULL BODY 2 GIORNI MINIMALIST ESSENTIALS (TOPGYM_BLOCKS)
  // --------------------------------------------------------------------------
  T02: {
    id: 'T02',
    title: 'Full Body 2 Giorni Minimalist Essentials',
    group: 'PRINCIPIANTE',
    daysCount: 2,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Protocollo minimale per chi ha solo 2 giorni: frequenza Full Body a stimolo denso con multiarticolari fondamentali e buffer controllato.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Full Body A (Spinta Orizzontale & Quadricipiti)',
        sessionFocus: 'Panca, Pressa, Rematore, Spalle & Braccia',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1s.' },
          { order: 2, name: 'Leg press a 45� o Hack squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa profonda controllata.' },
          { order: 3, name: 'Rematore con manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomito aderente al busto.' },
          { order: 4, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Estensione completa.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 6, name: 'Calf raise alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Fermo in allungamento 2s.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Full Body B (Catena Posteriore & Spinta Inclinata)',
        sessionFocus: 'Stacco Rumeno, Lat Machine, Lento & Braccia',
        exercises: [
          { order: 1, name: 'Stacco rumeno con manubri o bilanciere', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca profonda.' },
          { order: 2, name: 'Lat machine presa prona', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione piena allo sterno.' },
          { order: 3, name: 'Military press con manubri seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Traiettoria verticale pulita.' },
          { order: 4, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 1s in contrazione.' },
          { order: 5, name: 'Super-serie: Curl manubri + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pump braccia finale.' },
          { order: 6, name: 'Crunch ai cavi o su fitball', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Espirazione forzata.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T03: FULL BODY 3 GIORNI DUP DAILY UNDULATING (HELMS_PYRAMID)
  // --------------------------------------------------------------------------
  T03: {
    id: 'T03',
    title: 'Full Body 3 Giorni DUP (Daily Undulating Periodization)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'HELMS_PYRAMID',
    description: 'Periodizzazione ondulata Helms: G1 Forza Neurale (5 rep, RIR 2), G2 Ipertrofia Meccanica (8-10 rep, RIR 1-2), G3 Pompaggio Metabolico (12-15 rep, RIR 0-1).',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: DUP Heavy (Forza Neurale Sub-Massimale)',
        sessionFocus: 'Carichi Alti, Basse Ripetizioni, Buffer Solido',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo 1s netto, traiettoria solida.' },
          { order: 2, name: 'Squat al multipower o libero', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita costante al parallelo.' },
          { order: 3, name: 'Trazioni presa neutra o Lat machine', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione esplosiva controllata.' },
          { order: 4, name: 'Lento avanti con bilanciere o manubri', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 3, reps: '6', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Stivaggio scapolare solido.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: DUP Moderate (Tensione Meccanica & Ipertrofia)',
        sessionFocus: 'Ripetizioni Medie, Tut Controllato',
        exercises: [
          { order: 1, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa in 3 secondi.' },
          { order: 2, name: 'Leg press a 45�', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta piena sul tallone.' },
          { order: 3, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Depressione scapolare.' },
          { order: 4, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Bacino indietro.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Controllo eccentrico.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: DUP Light (Stress Metabolico & Congestione)',
        sessionFocus: 'Alte Ripetizioni, Recuperi Brevi, Cedimento',
        exercises: [
          { order: 1, name: 'Croci ai cavi alti su panca inclinata', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Tensione continua sul pettorale.' },
          { order: 2, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set all\'ultima serie.' },
          { order: 3, name: 'Leg curl seduto o disteso', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Contrazione di picco.' },
          { order: 4, name: 'Lat machine presa inversa', targetMuscle: 'Gran Dorsale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Focus fasci bassi.' },
          { order: 5, name: 'Super-serie: Curl bilanciere EZ + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Massimo pompaggio finale.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T05: PUSH / PULL / LEGS 3 GIORNI CLASSIC HYPERTROPHY (TOPGYM_BLOCKS)
  // --------------------------------------------------------------------------
  T05: {
    id: 'T05',
    title: 'Push / Pull / Legs 3 Giorni Classic Hypertrophy',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'La split piu amata in sala con Gambe 1x: G1 Spinta (Petto/Spalle/Tricipiti), G2 Trazione (Dorso/Bicipiti), G3 Gambe concentrato. Aderenza assoluta.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Petto, Spalle Anteriori/Laterali, Tricipiti)',
        sessionFocus: 'Spinta Orizzontale & Verticale ad Alto Pompaggio',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Arco naturale e fermo 1s.' },
          { order: 2, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Gomiti a 45�.' },
          { order: 3, name: 'Shoulder press manubri o macchina', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta fluida.' },
          { order: 4, name: 'Dips alle parallele o Chest press guidata', targetMuscle: 'Petto/Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Leggera inclinazione in avanti.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Ultima serie stripping a scalare.' },
          { order: 6, name: 'Pushdown al cavo con corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Apertura finale della corda.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Dorso, Deltoidi Posteriori, Bicipiti)',
        sessionFocus: 'Trazione Verticale & Orizzontale, Spessore e Ampiezza',
        exercises: [
          { order: 1, name: 'Lat machine presa prona larga', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Petto alto e scapole bloccate.' },
          { order: 2, name: 'Rematore con bilanciere o Pulley basso', targetMuscle: 'Spessore Schiena', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Tirata all\'ombelico.' },
          { order: 3, name: 'Pulley maniglia aperta o Lat presa inversa', targetMuscle: 'Dorso Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo in eccentrica.' },
          { order: 4, name: 'Alzate a 90� su panca inclinata o cavi', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Gomiti alti.' },
          { order: 5, name: 'Curl con bilanciere EZ in piedi', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '8-10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Zero slancio di schiena.' },
          { order: 6, name: 'Hammer curl con manubri', targetMuscle: 'Brachiale/Avambracci', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Presa a martello salda.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs & Addome (1 Sola Volta a Settimana)',
        sessionFocus: 'Quadricipiti, Ischiocrurali & Core Completo',
        exercises: [
          { order: 1, name: 'Squat al multipower o Leg press 45�', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita piena.' },
          { order: 2, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Focus cerniera d\'anca.' },
          { order: 3, name: 'Affondi camminati con manubri', targetMuscle: 'Gambe/Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Passo medio controllato.' },
          { order: 4, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima.' },
          { order: 5, name: 'Leg curl seduto o sdraiato', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Flessione completa.' },
          { order: 6, name: 'Calf raise in piedi + Crunch', targetMuscle: 'Polpacci & Core', segment: 'METABOLICO', sets: 4, reps: '15+15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Super-serie di chiusura.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T06: UPPER / LOWER 4 GIORNI DOPPIA PROGRESSIONE (TOPGYM_BLOCKS)
  // --------------------------------------------------------------------------
  T06: {
    id: 'T06',
    title: 'Upper / Lower 4 Giorni Doppia Progressione',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Gold standard equilibrato a 4 giorni su doppia progressione di carico e ripetizioni: 2 sedute Upper e 2 sedute Lower a stimolo bilanciato.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper A (Focus Spinta Orizzontale & Trazione)',
        sessionFocus: 'Panca Piana, Lat, Spinte Inclinata & Braccia',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Progressione doppia: aumenta carico a 8 rep.' },
          { order: 2, name: 'Lat machine presa prona larga', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione piena.' },
          { order: 3, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa profonda.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare.' },
          { order: 5, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Controllo eccentrico.' },
          { order: 6, name: 'Pushdown al cavo barra dritta', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Estensione completa.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower A (Focus Quadricipiti & Polpacci)',
        sessionFocus: 'Squat, Pressa, Leg Extension & Ischiocrurali',
        exercises: [
          { order: 1, name: 'Squat al multipower o bilanciere libero', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita al parallelo.' },
          { order: 2, name: 'Leg press a 45�', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Piedi a larghezza spalle.' },
          { order: 3, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 1s in contrazione.' },
          { order: 4, name: 'Leg curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa lenta.' },
          { order: 5, name: 'Calf raise alla pressa', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pausa 2s in massimo allungamento.' },
          { order: 6, name: 'Crunch su panca inclinata o cavi', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Arrotolamento del bacino.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper B (Focus Spinta Verticale & Spessore)',
        sessionFocus: 'Military Press, Trazioni, Inclinata & Bicipiti',
        exercises: [
          { order: 1, name: 'Military press con bilanciere o manubri', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta decisa sopra la testa.' },
          { order: 2, name: 'Trazioni presa neutra o Lat inversa', targetMuscle: 'Dorso/Bicipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione al petto.' },
          { order: 3, name: 'Panca inclinata con bilanciere', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Inclinazione a 30�.' },
          { order: 4, name: 'Rematore con manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata pura di gomito.' },
          { order: 5, name: 'Croci ai cavi alti', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Enfasi sull\'allungamento.' },
          { order: 6, name: 'Curl bilanciere sagomato EZ', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti fissi ai fianchi.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower B (Focus Catena Posteriore & Glutei)',
        sessionFocus: 'Stacco Rumeno, Hack Squat, Femorali & Addome',
        exercises: [
          { order: 1, name: 'Stacco rumeno con bilanciere', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Schiena neutra, cerniera d\'anca.' },
          { order: 2, name: 'Hack squat o Leg press a piedi alti', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta sui talloni.' },
          { order: 3, name: 'Affondi posteriori con manubri', targetMuscle: 'Glutei/Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo lungo per enfasi gluteo.' },
          { order: 4, name: 'Leg curl seduto a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 0-1', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% ultima serie.' },
          { order: 5, name: 'Calf seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Contrazione di picco 1s.' },
          { order: 6, name: 'Plank isometrico + Reverse crunch', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '45s+15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Stabilita addominale.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T08: FEMMINILE 3 GIORNI RICOMPOSIZIONE PHA (TOPGYM_BLOCKS)
  // --------------------------------------------------------------------------
  T08: {
    id: 'T08',
    title: 'Femminile 3 Giorni Ricomposizione PHA',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Protocollo Peripheral Heart Action: alternanza di stazioni Lower e Upper per massimizzare il ritorno venoso e prevenire la ritenzione idrica da cortisolo.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: PHA Lower Glutei / Upper Spinta & Drenaggio',
        sessionFocus: 'Hip Thrust, Lat Machine, Affondi & Deltoidi',
        exercises: [
          { order: 1, name: 'Hip thrust con bilanciere o multipower', targetMuscle: 'Glutei', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Pausa di 2 secondi in alto.' },
          { order: 2, name: 'Lat machine presa neutra o prona', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Depressione scapolare per postura.' },
          { order: 3, name: 'Affondi bulgari con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Busto inclinato a 45� in avanti.' },
          { order: 4, name: 'Spinte manubri panca a 30� snelle', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Carico moderato, traiettoria controllata.' },
          { order: 5, name: 'Slanci al cavo basso per gluteo', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua.' },
          { order: 6, name: 'Alzate laterali con manubri leggeri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Tonificazione e v-taper.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: PHA Cerniera d\'Anca / Upper Trazione & Core',
        sessionFocus: 'Stacco Rumeno, Pulley, Step Up & Addome',
        exercises: [
          { order: 1, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Allungamento profondo senza piegare schiena.' },
          { order: 2, name: 'Pulley basso con maniglia stretta', targetMuscle: 'Dorso Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura toracica.' },
          { order: 3, name: 'Step up su box con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta concentrata solo sulla gamba alta.' },
          { order: 4, name: 'Shoulder press manubri seduta', targetMuscle: 'Deltoidi', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta controllata.' },
          { order: 5, name: 'Abductor machine su 3 inclinazioni', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio metabolico glutei.' },
          { order: 6, name: 'Plank isometrico a terra', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '45s', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Ombelico risucchiato alla colonna.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: PHA Total Body Tonicita & Drenaggio Finale',
        sessionFocus: 'Goblet Squat, Glute Bridge, Cavi & Cardio LISS',
        exercises: [
          { order: 1, name: 'Goblet squat con manubrio o kettlebell', targetMuscle: 'Gambe/Glutei', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Piedi a papera, discesa profonda.' },
          { order: 2, name: 'Trazioni alla easy power o Lat inversa', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Attivazione dorsale pulita.' },
          { order: 3, name: 'Glute bridge a terra con disco', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Squeeze gluteo di 2 secondi.' },
          { order: 4, name: 'Croci ai cavi per petto snello', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 2', technique: 'NONE', notes: 'Allungamento e apertura spalle.' },
          { order: 5, name: 'Kickback cavo basso per gluteo alto', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio senza sovraccarico.' },
          { order: 6, name: 'Camminata in salita LISS drenante', targetMuscle: 'Cardio', segment: 'METABOLICO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'LISS 65%', technique: 'NONE', notes: 'Pendenza 8-10%, velocita 4.5 km/h.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T09: FEMMINILE 4 GIORNI GLUTE & HIP THRUST SPECIALIZATION (TOPGYM_BLOCKS)
  // --------------------------------------------------------------------------
  T09: {
    id: 'T09',
    title: 'Femminile 4 Giorni Glute & Hip Thrust Specialization',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'TOPGYM_BLOCKS',
    description: 'Specializzazione Glutei su 4 sedute: 2 giorni Lower pesanti con cerniera d\'anca e Hip Thrust + 2 giorni Upper snelli posturali per V-taper e punto vita stretto.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Glute Day Heavy (Hip Thrust, Affondi & Medio Gluteo)',
        sessionFocus: 'Carico Pesante su Glutei & Catena Posteriore',
        exercises: [
          { order: 1, name: 'Hip thrust con bilanciere olimpico', targetMuscle: 'Glutei', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Fermo 2s in estensione piena del bacino.' },
          { order: 2, name: 'Affondi in deficit con manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Piede anteriore su disco per maggiore ROM.' },
          { order: 3, name: 'Cable pull-through ai cavi bassi', targetMuscle: 'Catena Posteriore', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura decisa dei glutei in avanti.' },
          { order: 4, name: 'Abductor machine su 3 inclinazioni', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Busto avanti, neutro e indietro (strip finale).' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper V-Taper & Core Posturale',
        sessionFocus: 'Schiena a V, Deltoidi e Punto Vita Stretto',
        exercises: [
          { order: 1, name: 'Lat machine presa a V', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione verticale per apertura dorsale.' },
          { order: 2, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Deltoidi tonici per dare risalto al punto vita.' },
          { order: 3, name: 'Pulley basso con maniglia aperta', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Depressione scapolare correttiva.' },
          { order: 4, name: 'Croci ai cavi su panca a 30�', targetMuscle: 'Petto Snello', segment: 'METABOLICO', sets: 2, reps: '15', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Solo apertura e allungamento leggero.' },
          { order: 5, name: 'Crunch su fitball o declinata', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Espirazione completa.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Glute & Posterior Chain (Stacco Rumeno & Femorali)',
        sessionFocus: 'Allungamento Ischiocrurali & Pompaggio Glutei',
        exercises: [
          { order: 1, name: 'Stacco rumeno con bilanciere', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Carico progressivo con schiena bloccata.' },
          { order: 2, name: 'Hip thrust al multipower', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Squeeze continuo di 2 secondi in alto.' },
          { order: 3, name: 'Leg curl seduto a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa in 3 secondi.' },
          { order: 4, name: 'Kickback al cavo basso gamba tesa', targetMuscle: 'Gluteo Alto', segment: 'METABOLICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento metabolico puro.' },
          { order: 5, name: 'Calf raise alla pressa o gradino', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Favorisce il drenaggio linfatico.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper Snello & Cardio Drenante',
        sessionFocus: 'Spinte Leggere, Rematore Cavo, Glutei Finish & LISS',
        exercises: [
          { order: 1, name: 'Spinte manubri panca a 30� snelle', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria pulita senza sforzo estremo.' },
          { order: 2, name: 'Row al cavo singolo orizzontale', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 3, reps: '12 per lato', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Rotazione controllata.' },
          { order: 3, name: 'Alzate a 90� ai cavi bassi', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Apertura spalle.' },
          { order: 4, name: 'Hyperextension focus glutei a 45�', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Schiena arrotondata e spinta di bacino.' },
          { order: 5, name: 'Camminata in salita LISS post-allenamento', targetMuscle: 'Cardio Drenante', segment: 'METABOLICO', sets: 1, reps: '20 min', restSeconds: 0, effort: 'LISS', technique: 'NONE', notes: 'Inclinazione 10-12%, camminata continua.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T10: PUSH / PULL / LEGS + UPPER PUMP 4 GIORNI (NOCERINO)
  // --------------------------------------------------------------------------
  T10: {
    id: 'T10',
    title: 'Push / Pull / Legs + Upper Pump 4 Giorni (Metodo Nocerino)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'NOCERINO',
    description: 'Uomo Gambe 1x a totale tutela articolare: G1 Push, G2 Pull, G3 Legs, G4 Upper Body Pumping. Solo macchine convergenti e cavi a tensione continua.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push Biomeccanico (Convergenze & Cavi)',
        sessionFocus: 'Chest Press Convergente, Spinte Cavi & Tricipiti',
        exercises: [
          { order: 1, name: 'Chest press convergente su panca piana', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Traiettoria ad arco convergente, zero usura spalle.' },
          { order: 2, name: 'Spinte con manubri su panca a 30� con convergenza', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura dei manubri senza toccarli.' },
          { order: 3, name: 'Shoulder press convergente guidata', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti sotto i polsi.' },
          { order: 4, name: 'Croci ai cavi ad altezza spalle (Cross Cable)', targetMuscle: 'Petto Sternale', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua anche in chiusura.' },
          { order: 5, name: 'Pushdown al cavo con barra dritta presa stretta', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% ultima serie.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull Biomeccanico (Traiettorie Guidate & Dorsali)',
        sessionFocus: 'Lat Convergente, Pulley Ergonomico, Pullover & Bicipiti',
        exercises: [
          { order: 1, name: 'Lat machine convergente con maniglie indipendenti', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Trazione lungo il piano scapolare naturale.' },
          { order: 2, name: 'Pulley basso con impugnatura neutra ergonomica', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 4, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti attaccati ai fianchi.' },
          { order: 3, name: 'Pullover al cavo alto con corda o barra sagomata', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Massimo allungamento sotto carico.' },
          { order: 4, name: 'Alzate a 90� ai cavi incrociati', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione costante sul deltoide posteriore.' },
          { order: 5, name: 'Curl su panca inclinata al cavo basso', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Braccio indietro per allungare il capo lungo.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs Biomeccanico Guidato (1 Sola Volta a Settimana)',
        sessionFocus: 'Leg Press, Extension Continua, Femorali & Polpacci',
        exercises: [
          { order: 1, name: 'Leg press a 45� o orizzontale a camme', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Piedi a larghezza spalle, zero stacco lombare.' },
          { order: 2, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Contrazione di 1s in alto.' },
          { order: 3, name: 'Leg curl sdraiato guidato', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Bacino bloccato sulla cuscineria.' },
          { order: 4, name: 'Calf machine in piedi guidata', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Discesa profonda e fermo 2s.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper Body Pumping (Congestione & Braccia Piene)',
        sessionFocus: 'Multipower, Triangolo, Cavi Singoli & Super-Serie',
        exercises: [
          { order: 1, name: 'Panca piana al multipower con fermo al petto', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Fermo netto di 1 secondo.' },
          { order: 2, name: 'Lat machine presa stretta a triangolo', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione profonda allo sterno.' },
          { order: 3, name: 'Alzate laterali al cavo singolo dietro la schiena', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento puro del deltoide.' },
          { order: 4, name: 'Super-serie: Curl su panca Scott + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip 30% all\'ultimo giro. Pompaggio massimo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T14: UPPER / LOWER BIOMECCANICO 4 GIORNI (NOCERINO)
  // --------------------------------------------------------------------------
  T14: {
    id: 'T14',
    title: 'Upper / Lower Biomeccanico 4 Giorni (Metodo Nocerino)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'NOCERINO',
    description: 'Upper/Lower a 4 giorni su macchine isotoniche e cavi a tensione continua: elimina il sovraccarico assiale sulla colonna per chi soffre di dolori lombari o alle spalle.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Biomeccanico 1 (Convergenza Spinta & Trazione)',
        sessionFocus: 'Chest Press, Lat Divergente, Spinte 30� & Cavi',
        exercises: [
          { order: 1, name: 'Chest press guidata convergente', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Traiettoria protetta per le spalle.' },
          { order: 2, name: 'Lat machine divergente con bracci indipendenti', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Allineamento perfetto delle fibre dorsali.' },
          { order: 3, name: 'Spinte con manubri su panca a 30�', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Controllo eccentrico in 3 secondi.' },
          { order: 4, name: 'Pulley convergente o Row machine guidata', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Chiusura delle scapole.' },
          { order: 5, name: 'Alzate laterali ai cavi bassi incrociati', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua al picco.' },
          { order: 6, name: 'French press al cavo alto con corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Allungamento del capo lungo.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Biomeccanico 1 (Presse & Camme Isotoniche)',
        sessionFocus: 'Pressa 45�, Extension, Curl Seduto & Polpacci',
        exercises: [
          { order: 1, name: 'Leg press a 45� a piedi bassi', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione massima del ginocchio senza alzare il bacino.' },
          { order: 2, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 1 secondo in contrazione.' },
          { order: 3, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Protezione totale del rachide lombare.' },
          { order: 4, name: 'Calf raise alla pressa orizzontale', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pausa di 2 secondi in allungamento.' },
          { order: 5, name: 'Crunch ai cavi in ginocchio', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Flessione del torace sul bacino.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper Biomeccanico 2 (Spalle, Trazioni & Braccia)',
        sessionFocus: 'Shoulder Press Guidata, Easy Power, Croci & Cavi',
        exercises: [
          { order: 1, name: 'Shoulder press convergente guidata', targetMuscle: 'Deltoidi', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Traiettoria guidata senza usura acromiale.' },
          { order: 2, name: 'Trazioni guidate alla easy power o Lat inversa', targetMuscle: 'Dorso/Bicipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione continua al petto.' },
          { order: 3, name: 'Croci ai cavi su panca inclinata a 30�', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione costante anche in chiusura.' },
          { order: 4, name: 'Pulley unilaterale al cavo orizzontale', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10 per lato', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Focus fasci medi e bassi.' },
          { order: 5, name: 'Curl ai cavi alti a crocifisso', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Picco di contrazione bicipite.' },
          { order: 6, name: 'Pushdown con presa inversa al cavo', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Focus capo laterale e mediale.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Biomeccanico 2 (Hack Squat & Femorali Guidati)',
        sessionFocus: 'Hack Squat, Stacco Multipower & Ischiocrurali',
        exercises: [
          { order: 1, name: 'Hack squat guidato a pedana media', targetMuscle: 'Gambe/Glutei', segment: 'NEURALE', sets: 3, reps: '10', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Schiena completamente appoggiata allo schienale.' },
          { order: 2, name: 'Stacco rumeno al multipower', targetMuscle: 'Ischiocrurali/Glutei', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria verticale obbligata, zero oscillazioni.' },
          { order: 3, name: 'Affondi al multipower con passo lungo', targetMuscle: 'Glutei/Gambe', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Stivaggio perfetto del ginocchio.' },
          { order: 4, name: 'Leg curl sdraiato a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Pausa di 1 secondo in flessione.' },
          { order: 5, name: 'Calf raise seduto alla macchina', targetMuscle: 'Soleo', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Contrazione piena.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T15: PUSH / PULL / LEGS / SPALLE-BRACCIA 4 GIORNI (ACETO)
  // --------------------------------------------------------------------------
  T15: {
    id: 'T15',
    title: 'Push / Pull / Legs / Spalle-Braccia 4 Giorni (Metodo Aceto)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'ACETO',
    description: 'Uomo Gambe 1x ad altissima intensita estetica: G1 Push, G2 Pull, G3 Gambe, G4 Spalle & Braccia Specialization. Tecniche Rest-Pause e cedimento concentrico Chris Aceto.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push Aceto Density (Petto & Tricipiti Pesanti)',
        sessionFocus: 'Inclinata Rest-Pause, Panca Manubri, Dips & Cedimento',
        exercises: [
          { order: 1, name: 'Panca inclinata con bilanciere a 30�', targetMuscle: 'Petto Alto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Ultima serie: Rest-Pause 15s e altre 2-3 ripetizioni.' },
          { order: 2, name: 'Spinte manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Discesa profonda e spinta esplosiva.' },
          { order: 3, name: 'Croci manubri su panca piana con fermo', targetMuscle: 'Petto Sternale', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0-1', technique: 'NONE', notes: 'Massimo allungamento sotto carico.' },
          { order: 4, name: 'Dips alle parallele con sovraccarico', targetMuscle: 'Petto Basso/Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Inclinazione busto in avanti.' },
          { order: 5, name: 'Pushdown con barra a V pesante', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip 30% all\'ultima serie fino a esaurimento.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull Aceto Density (Spessore Dorso & Trapezi)',
        sessionFocus: 'T-Bar Pesante, Lat Machine, Pulley & Stacco Parziale',
        exercises: [
          { order: 1, name: 'T-Bar Row presa stretta a maniglia', targetMuscle: 'Spessore Schiena', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Rest-Pause sull\'ultima serie target.' },
          { order: 2, name: 'Lat machine presa prona larga', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Trazione violenta allo sterno.' },
          { order: 3, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% all\'ultima serie.' },
          { order: 4, name: 'Stacco parziale dai blocchi o multipower', targetMuscle: 'Catena Posteriore/Trapezi', segment: 'MECCANICO', sets: 3, reps: '6', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Partenza da sotto al ginocchio.' },
          { order: 5, name: 'Scrollate con manubri pesanti (Shrugs)', targetMuscle: 'Trapezi Alti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Fermo 2s in massima contrazione.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs Blast (1 Sola Volta a Settimana)',
        sessionFocus: 'Leg Press Pesante, Multipower, Extension & Ischiocrurali',
        exercises: [
          { order: 1, name: 'Leg press a 45� a pieno carico', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 150, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Rest-Pause sull\'ultima serie (10 rep + 15s + 4 rep).' },
          { order: 2, name: 'Squat al multipower a piedi avanti', targetMuscle: 'Gambe/Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'Cedimento', technique: 'NONE', notes: 'Profondita piena.' },
          { order: 3, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 75, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set finale.' },
          { order: 4, name: 'Stacco rumeno con manubri pesanti', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento brutale.' },
          { order: 5, name: 'Leg curl sdraiato a pieno ROM', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Rest-Pause finale.' },
          { order: 6, name: 'Calf raise in piedi alla macchina', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Bruciore puro.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Delts & Arms Blast (Specializzazione V-Taper & Braccia)',
        sessionFocus: 'Lento Manubri, Alzate Laterali, Bicipiti & Tricipiti Aceto',
        exercises: [
          { order: 1, name: 'Lento avanti con manubri su panca a 75�', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Rest-Pause sull\'ultima serie target.' },
          { order: 2, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Triplo drop set all\'ultima serie.' },
          { order: 3, name: 'Alzate a 90� su panca inclinata', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Spalle a palla di cannone.' },
          { order: 4, name: 'Super-serie: Curl bilanciere EZ + Skull Crusher', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '8-10+8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Congestione brutale.' },
          { order: 5, name: 'Super-serie: Hammer curl + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10-12+10-12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio finale estremo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T20: MONOMUSCOLARE 4 GIORNI CLASSIC BRO-SPLIT (ACETO)
  // --------------------------------------------------------------------------
  T20: {
    id: 'T20',
    title: 'Monomuscolare 4 Giorni Classic Bro-Split (Metodo Aceto)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'ACETO',
    description: 'La classica split da sala pesi su 4 giorni: G1 Petto/Tricipiti, G2 Dorso/Bicipiti, G3 Gambe (1 sola volta!), G4 Spalle/Addome. Massimo pompaggio localizzato.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Petto & Tricipiti (Pompaggio Localizzato)',
        sessionFocus: 'Panca Piana, Inclinata, Dips, Croci & French Press',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Progressione classica di carico.' },
          { order: 2, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Alto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Discesa profonda.' },
          { order: 3, name: 'Dips alle parallele a corpo libero o zavorra', targetMuscle: 'Petto Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Inclinazione busto.' },
          { order: 4, name: 'Croci ai cavi orizzontali', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set finale.' },
          { order: 5, name: 'French press con bilanciere EZ su panca', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti chiusi.' },
          { order: 6, name: 'Pushdown con corda al cavo', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Apertura finale corda.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Dorso & Bicipiti (Spessore, Ampiezza & Braccia)',
        sessionFocus: 'Trazioni, Rematore, Lat, Pulley & Curl',
        exercises: [
          { order: 1, name: 'Trazioni alla sbarra presa prona o Lat pesante', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'Cedimento', technique: 'NONE', notes: 'ROM completo fino al petto.' },
          { order: 2, name: 'Rematore bilanciere presa supina (Yates)', targetMuscle: 'Spessore Schiena', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Tirata decisa all\'ombelico.' },
          { order: 3, name: 'Lat machine presa inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti aderenti.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip 30% ultima serie.' },
          { order: 5, name: 'Curl con bilanciere in piedi', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Zero slancio lombare.' },
          { order: 6, name: 'Curl su panca inclinata con manubri', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Allungamento profondo.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe & Polpacci (1 Sola Volta a Settimana)',
        sessionFocus: 'Squat, Pressa, Extension, Rumeno & Core',
        exercises: [
          { order: 1, name: 'Squat con bilanciere o multipower', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita al parallelo.' },
          { order: 2, name: 'Leg press a 45�', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'Cedimento', technique: 'NONE', notes: 'Piedi a larghezza spalle.' },
          { order: 3, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Doppio drop set finale.' },
          { order: 4, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Cerniera d\'anca profonda.' },
          { order: 5, name: 'Leg curl sdraiato', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Discesa controllata.' },
          { order: 6, name: 'Calf raise in piedi + Crunch ai cavi', targetMuscle: 'Polpacci & Core', segment: 'METABOLICO', sets: 4, reps: '15+15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Super-serie finale.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Spalle & Braccia Richiamo',
        sessionFocus: 'Military Press, Alzate Laterali, 90� & Super-Serie Braccia',
        exercises: [
          { order: 1, name: 'Military press con manubri su panca a 75�', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 120, effort: 'Cedimento', technique: 'NONE', notes: 'Traiettoria pulita.' },
          { order: 2, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip all\'ultima serie.' },
          { order: 3, name: 'Alzate a 90� su panca inclinata', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti alti.' },
          { order: 4, name: 'Tirate al mento al cavo basso presa larga', targetMuscle: 'Deltoidi/Trapezi', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti che guidano il movimento.' },
          { order: 5, name: 'Super-serie: Curl alternato manubri + Dips tra panche', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio volumetrico finale.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T21: TORSO / GAMBE / SPALLE-BRACCIA 3 GIORNI POWER-HYPER (HARDTOPGYM)
  // --------------------------------------------------------------------------
  T21: {
    id: 'T21',
    title: 'Torso / Gambe / Spalle & Braccia 3 Giorni Power-Hyper (Metodo Hatfield)',
    group: 'AVANZATO',
    daysCount: 3,
    primaryEngine: 'HARDTOPGYM',
    description: 'Uomo Gambe 1x su 3 giorni Metodo Hatfield: sequenza rigida Neurale CAT (compensatory acceleration) -> Meccanico -> Metabolico su Torso, Gambe e Braccia.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Torso Completo (Neurale -> Meccanico -> Metabolico)',
        sessionFocus: 'Panca CAT, Trazioni, Spinte Inclinata, Pulley & Cavi',
        exercises: [
          { order: 1, name: 'Panca piana bilanciere (CAT Neurale)', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Accelerazione compensatoria massima nella fase concentrica.' },
          { order: 2, name: 'Trazioni presa prona zavorrate o Lat pesante', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Esplosivita in trazione.' },
          { order: 3, name: 'Spinte manubri panca a 30� (Tensione Meccanica)', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'TUT 3-0-1 controllato.' },
          { order: 4, name: 'Pulley basso con maniglia a V (Tensione Meccanica)', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare marcata.' },
          { order: 5, name: 'Croci ai cavi inclinata (Stress Metabolico)', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Tensione continua senza pause.' },
          { order: 6, name: 'Pullover al cavo alto con corda (Stress Metabolico)', targetMuscle: 'Gran Dorsale', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Massimo allungamento sotto carico.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Gambe & Core (1 Sola Volta a Settimana)',
        sessionFocus: 'Squat CAT, Stacco Rumeno, Affondi, Extension & Calf',
        exercises: [
          { order: 1, name: 'Squat con bilanciere o multipower (CAT Neurale)', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa controllata e risalita alla massima velocita.' },
          { order: 2, name: 'Stacco rumeno con bilanciere (Neurale/Meccanico)', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Carico pesante con cerniera pulita.' },
          { order: 3, name: 'Affondi con manubri posteriori (Tensione Meccanica)', targetMuscle: 'Gambe/Glutei', segment: 'MECCANICO', sets: 3, reps: '8 per gamba', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Passo controllato.' },
          { order: 4, name: 'Leg curl seduto (Tensione Meccanica)', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa in 3 secondi.' },
          { order: 5, name: 'Leg extension a tensione continua (Metabolico)', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% ultima serie.' },
          { order: 6, name: 'Calf raise alla pressa (Metabolico)', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Fermo in allungamento 2s.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Spalle & Braccia (Neurale -> Meccanico -> Metabolico)',
        sessionFocus: 'Military Press, Dips, Alzate Laterali, Curl & Pushdown',
        exercises: [
          { order: 1, name: 'Military press in piedi con bilanciere (CAT Neurale)', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta esplosiva sopra la testa.' },
          { order: 2, name: 'Dips alle parallele pesanti (CAT Neurale)', targetMuscle: 'Tricipiti/Petto', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Eventuale zavorra controllata.' },
          { order: 3, name: 'Alzate laterali con manubri (Tensione Meccanica)', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti leggermente flessi.' },
          { order: 4, name: 'Curl con bilanciere EZ in piedi (Tensione Meccanica)', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Isolamento puro.' },
          { order: 5, name: 'Face pull al cavo alto (Stress Metabolico)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Extrarotazione di spalla.' },
          { order: 6, name: 'Super-serie: Pushdown corda + Curl Scott (Metabolico)', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio estremo di chiusura.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T23: HYBRID POWER-BUILDING 5 GIORNI (POWERBLOCK_HYBRID)
  // --------------------------------------------------------------------------
  T23: {
    id: 'T23',
    title: 'Hybrid Power-Building 5 Giorni (Fitschen/Wilson)',
    group: 'AVANZATO',
    daysCount: 5,
    primaryEngine: 'POWERBLOCK_HYBRID',
    description: 'Protocollo ibrido Fitschen/Wilson su 5 sedute: 2 giorni Neurale Power sui Big 3 sub-failure (Upper Power / Lower Power) + 3 giorni a blocchi ipertrofici ad alta densita.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Power (Big 3 Sub-Failure Neurale)',
        sessionFocus: 'Panca Piana Pesante, Rematore Bilanciere & Military',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere (Big 3)', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '3-5', restSeconds: 180, effort: 'RIR 1-2', technique: 'NONE', notes: 'Carico sub-massimale, controllo perfetto.' },
          { order: 2, name: 'Rematore con bilanciere pesante', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Schiena a 45�, tirata esplosiva.' },
          { order: 3, name: 'Military press con bilanciere in piedi', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 3, reps: '5', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta verticale pura.' },
          { order: 4, name: 'Dips con sovraccarico', targetMuscle: 'Tricipiti/Petto', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa controllata.' },
          { order: 5, name: 'Curl bilanciere dritto pesante', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Presa salda.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Power (Squat & Stacco Sub-Failure Neurale)',
        sessionFocus: 'Squat Pesante, Stacco Rumeno & Leg Press',
        exercises: [
          { order: 1, name: 'Squat con bilanciere olimpico (Big 3)', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '3-5', restSeconds: 180, effort: 'RIR 1-2', technique: 'NONE', notes: 'Affondo solido al parallelo.' },
          { order: 2, name: 'Stacco rumeno con bilanciere', targetMuscle: 'Ischiocrurali', segment: 'NEURALE', sets: 3, reps: '5', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca pesante.' },
          { order: 3, name: 'Leg press a 45� a pieno carico', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta sui talloni.' },
          { order: 4, name: 'Calf raise in piedi alla macchina', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Pausa 2s in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Block Day - Push Hypertrophy',
        sessionFocus: 'Spinte 30�, Chest Press, Cavi & Alzate Laterali',
        exercises: [
          { order: 1, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 2, name: 'Chest press convergente guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione continua.' },
          { order: 3, name: 'Croci ai cavi su panca piana', targetMuscle: 'Petto Sternale', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio ematico.' },
          { order: 4, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip all\'ultima serie.' },
          { order: 5, name: 'Pushdown barra dritta al cavo', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Estensione completa.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Block Day - Pull Hypertrophy',
        sessionFocus: 'Lat Presa Neutra, Pulley, T-Bar & Deltoidi Posteriori',
        exercises: [
          { order: 1, name: 'Lat machine presa a V o neutra', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione piena.' },
          { order: 2, name: 'Pulley basso con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare.' },
          { order: 3, name: 'T-bar row su panca o guidato', targetMuscle: 'Spessore Schiena', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti stretti.' },
          { order: 4, name: 'Alzate a 90� ai cavi incrociati', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti alti.' },
          { order: 5, name: 'Curl su panca inclinata con manubri', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Supinazione marcata.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Block Day - Legs Hypertrophy & Arms Finisher',
        sessionFocus: 'Hack Squat, Extension, Femorali & Super-Serie Braccia',
        exercises: [
          { order: 1, name: 'Hack squat o Leg press a 45�', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa lenta.' },
          { order: 2, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Drop set 30% ultima serie.' },
          { order: 3, name: 'Leg curl sdraiato', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Contrazione di picco.' },
          { order: 4, name: 'Super-serie: Curl bilanciere EZ + French press', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '10+10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Braccia piene a fine microciclo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T24: FEMMINILE 4 GIORNI BIKINI AESTHETIC & DELTOIDI (BIKINI_WAVE)
  // --------------------------------------------------------------------------
  T24: {
    id: 'T24',
    title: 'Femminile 4 Giorni Bikini Aesthetic & Deltoidi (Metodo Bikini Wave)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'BIKINI_WAVE',
    description: 'Protocollo Bikini Wave su 4 giorni: modulazione triadica (Low, Moderate, High reps) prioritizzata su glutei alti e deltoidi laterali per massimizzare la linea a clessidra.',
    generateSessions: () => [
      {
        dayLabel: 'Sessione A: Glute Wave Heavy (L) + Deltoidi Moderate (M)',
        sessionFocus: 'Hip Thrust Pesante, Affondi Deficit & Spalle Laterali',
        exercises: [
          { order: 1, name: 'Hip thrust con bilanciere (Low Reps Heavy)', targetMuscle: 'Glutei', segment: 'NEURALE', sets: 4, reps: '5-6', restSeconds: 150, effort: 'RIR 1', technique: 'NONE', notes: 'Modulazione Low: carico elevato con fermo 2s in alto.' },
          { order: 2, name: 'Affondi con manubri su rialzo (Moderate)', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '8-10 per gamba', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Modulazione Moderate: busto inclinato avanti.' },
          { order: 3, name: 'Alzate laterali con manubri (Moderate)', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Deltoide tonico per clessidra.' },
          { order: 4, name: 'Face pull ai cavi alti (High Reps)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Extrarotazione di spalla.' }
        ]
      },
      {
        dayLabel: 'Sessione B: Upper V-Taper Moderate (M) & Core Stretto',
        sessionFocus: 'Lat Machine, Pulley, Spinte Snelle & Addome',
        exercises: [
          { order: 1, name: 'Lat machine convergente presa neutra (Moderate)', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Allargamento della schiena alta per assottigliare la vita.' },
          { order: 2, name: 'Pulley basso con impugnatura media (Moderate)', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Apertura toracica e scapole depresse.' },
          { order: 3, name: 'Spinte con manubri su panca a 30� snelle', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Carico moderato, traiettoria fluida.' },
          { order: 4, name: 'Crunch su panca declinata o fitball', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Espirazione forzata.' },
          { order: 5, name: 'Plank vacuum isometrico', targetMuscle: 'Trasverso Addome', segment: 'METABOLICO', sets: 3, reps: '45s', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Pancia tirata in dentro.' }
        ]
      },
      {
        dayLabel: 'Sessione C: Glute & Posterior Wave Moderate (M) + Pump (H)',
        sessionFocus: 'Stacco Rumeno, Multipower & Abductor Pumping',
        exercises: [
          { order: 1, name: 'Stacco rumeno con bilanciere olimpico (Low/Mod)', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca profonda.' },
          { order: 2, name: 'Hip thrust al multipower (Moderate)', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Contrazione di picco costante.' },
          { order: 3, name: 'Leg curl seduto a tensione continua (Moderate)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Discesa in 3 secondi.' },
          { order: 4, name: 'Abductor machine su 3 inclinazioni (High Reps)', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '20-25', restSeconds: 45, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Modulazione High reps per bruciore metabolico.' }
        ]
      },
      {
        dayLabel: 'Sessione D: Delts High/Pump (H) + Glute Metabolic Finish (H)',
        sessionFocus: 'Alzate ai Cavi, Kickback Glutei & Drenaggio',
        exercises: [
          { order: 1, name: 'Alzate laterali al cavo singolo (High Reps)', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua al picco.' },
          { order: 2, name: 'Alzate a 90� ai cavi bassi (High Reps)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento deltoide posteriore.' },
          { order: 3, name: 'Slanci al cavo basso gamba tesa (High Reps)', targetMuscle: 'Gluteo Alto', segment: 'METABOLICO', sets: 4, reps: '20 per gamba', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio del gluteo senza affaticamento lombare.' },
          { order: 4, name: 'Glute bridge a terra a corpo libero (High Reps)', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '25-30', restSeconds: 30, effort: 'Cedimento', technique: 'NONE', notes: 'Esaurimento finale con squeeze continuo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T26: ARNOLD SPLIT 6 GIORNI CONGESTIONE MUSCOLARE (ACETO)
  // --------------------------------------------------------------------------
  T26: {
    id: 'T26',
    title: 'Arnold Split 6 Giorni Congestione Muscolare (Metodo Aceto)',
    group: 'AVANZATO',
    daysCount: 6,
    primaryEngine: 'ACETO',
    description: 'La celebre split antagonista su 6 giorni: G1/G4 Petto & Schiena, G2/G5 Spalle & Braccia, G3/G6 Gambe & Addome. Altissima congestione muscolare e densita Aceto.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Petto & Schiena Antagonisti (Heavy)',
        sessionFocus: 'Panca Piana, Trazioni, Inclinata & Rematore Superset',
        exercises: [
          { order: 1, name: 'Super-serie: Panca piana bilanciere + Trazioni sbarra', targetMuscle: 'Petto & Dorso', segment: 'NEURALE', sets: 4, reps: '6-8+6-8', restSeconds: 120, effort: 'Cedimento', technique: 'NONE', notes: 'Lavoro antagonista per congestione massima.' },
          { order: 2, name: 'Super-serie: Spinte 30� manubri + Rematore bilanciere', targetMuscle: 'Petto & Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10+8-10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Spinta inclinata e trazione orizzontale.' },
          { order: 3, name: 'Super-serie: Croci panca inclinata + Pulley basso', targetMuscle: 'Petto & Dorso', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Allungamento e strizzata finale.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Spalle & Braccia Antagonisti (Heavy)',
        sessionFocus: 'Lento Manubri, Alzate Laterali, Bicipiti & Tricipiti',
        exercises: [
          { order: 1, name: 'Lento avanti con manubri su panca a 75�', targetMuscle: 'Deltoidi', segment: 'NEURALE', sets: 4, reps: '8-10', restSeconds: 90, effort: 'Cedimento', technique: 'REST_PAUSE', notes: 'Rest-Pause sull\'ultima serie.' },
          { order: 2, name: 'Alzate laterali con manubri in piedi', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip 30% ultima serie.' },
          { order: 3, name: 'Alzate a 90� su panca inclinata', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti alti.' },
          { order: 4, name: 'Super-serie: Curl bilanciere EZ + French press EZ', targetMuscle: 'Bicipiti & Tricipiti', segment: 'MECCANICO', sets: 4, reps: '10+10', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Braccia piene.' },
          { order: 5, name: 'Super-serie: Hammer curl + Pushdown corda', targetMuscle: 'Bicipiti & Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio terminale.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Gambe & Addome A (Quadricipiti Focus)',
        sessionFocus: 'Squat, Leg Press, Extension, Femorali & Polpacci',
        exercises: [
          { order: 1, name: 'Squat con bilanciere olimpico o multipower', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita piena.' },
          { order: 2, name: 'Leg press a 45�', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Piedi a larghezza spalle.' },
          { order: 3, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip all\'ultima serie.' },
          { order: 4, name: 'Stacco rumeno con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 5, name: 'Leg curl seduto o sdraiato', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Contrazione di picco.' },
          { order: 6, name: 'Calf raise alla pressa + Crunch declinato', targetMuscle: 'Polpacci & Core', segment: 'METABOLICO', sets: 4, reps: '15+15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Super-serie finale.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Petto & Schiena Antagonisti (Density & Cavi)',
        sessionFocus: 'Chest Press + Lat Presa a V, Croci Cavi & Pullover',
        exercises: [
          { order: 1, name: 'Super-serie: Chest press guidata + Lat presa a V', targetMuscle: 'Petto & Dorso', segment: 'MECCANICO', sets: 4, reps: '10+10', restSeconds: 90, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua guidata.' },
          { order: 2, name: 'Super-serie: Croci cavi alti + Pullover al cavo', targetMuscle: 'Petto & Dorso', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento e allungamento.' },
          { order: 3, name: 'Super-serie: Dips su panche + Row al cavo basso', targetMuscle: 'Petto & Dorso', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio toracico totale.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Spalle & Braccia Antagonisti (Density & Pompaggio)',
        sessionFocus: 'Shoulder Press, Alzate Cavi, Panca Scott & Cavi',
        exercises: [
          { order: 1, name: 'Shoulder press guidata o multipower', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 4, reps: '10', restSeconds: 75, effort: 'Cedimento', technique: 'NONE', notes: 'Spinta continua.' },
          { order: 2, name: 'Alzate laterali al cavo singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento puro.' },
          { order: 3, name: 'Tirate al mento al cavo basso presa larga', targetMuscle: 'Deltoidi/Trapezi', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Gomiti alti.' },
          { order: 4, name: 'Super-serie: Curl su panca Scott + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 4, reps: '10+10', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip sull\'ultimo giro.' },
          { order: 5, name: 'Super-serie: Curl concentrato + French press manubrio', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Bruciore e congestione terminale.' }
        ]
      },
      {
        dayLabel: 'Giorno 6: Gambe & Catena Posteriore B (Femorali Focus)',
        sessionFocus: 'Hack Squat, Stacco Rumeno, Femorali & Polpacci',
        exercises: [
          { order: 1, name: 'Hack squat o Leg press a piedi alti', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta piena sui talloni.' },
          { order: 2, name: 'Stacco rumeno con bilanciere o manubri', targetMuscle: 'Ischiocrurali/Glutei', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo del femorale.' },
          { order: 3, name: 'Leg curl sdraiato a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'Cedimento', technique: 'STRIPPING_DROP_SET', notes: 'Strip finale.' },
          { order: 4, name: 'Leg extension a fine seduta', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Cedimento', technique: 'NONE', notes: 'Pompaggio vascolare.' },
          { order: 5, name: 'Calf machine seduto per soleo', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Pausa in contrazione.' },
          { order: 6, name: 'Reverse crunch su panca inclinata', targetMuscle: 'Addome', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Salita del bacino controllata.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // T27: UPPER / LOWER 6 GIORNI HIGH FREQUENCY (HELMS_PYRAMID)
  // --------------------------------------------------------------------------
  T27: {
    id: 'T27',
    title: 'Upper / Lower 6 Giorni High Frequency (Metodo Helms)',
    group: 'AVANZATO',
    daysCount: 6,
    primaryEngine: 'HELMS_PYRAMID',
    description: 'Multifrequenza 3x Upper/Lower (U/L/U/L/U/L) di Eric Helms: micro-sessioni compatte da 12-14 serie con rigorosa gestione del RIR per massimizzare la sintesi proteica.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper 1 (Forza Orizzontale & Ampiezza)',
        sessionFocus: 'Panca Piana, Rematore Bilanciere & Spinte 30�',
        exercises: [
          { order: 1, name: 'Panca piana con bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo 1s netto al petto.' },
          { order: 2, name: 'Rematore con bilanciere su panca o libero', targetMuscle: 'Dorso', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Schiena bloccata a 45�.' },
          { order: 3, name: 'Spinte manubri panca a 30�', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa profonda.' },
          { order: 4, name: 'Lat machine presa prona', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione verticale solida.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower 1 (Quadricipiti Heavy & Polpacci)',
        sessionFocus: 'Squat Pesante, Leg Press & Femorali',
        exercises: [
          { order: 1, name: 'Squat con bilanciere olimpico', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '4-6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Profondita al parallelo.' },
          { order: 2, name: 'Leg press a 45�', targetMuscle: 'Gambe', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta piena sui talloni.' },
          { order: 3, name: 'Leg curl sdraiato a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa lenta in 3s.' },
          { order: 4, name: 'Calf raise in piedi alla macchina', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Pausa 2s in allungamento.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper 2 (Ipertrofia Verticale & Spalle)',
        sessionFocus: 'Military Press, Trazioni, Dips & Pulley',
        exercises: [
          { order: 1, name: 'Military press con bilanciere in piedi', targetMuscle: 'Spalle', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta decisa sopra la testa.' },
          { order: 2, name: 'Trazioni presa neutra o Lat machine', targetMuscle: 'Dorso/Bicipiti', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Trazione piena.' },
          { order: 3, name: 'Dips alle parallele', targetMuscle: 'Petto/Tricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Controllo eccentrico.' },
          { order: 4, name: 'Pulley basso con maniglia a V', targetMuscle: 'Dorso Medio', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Adduzione scapolare.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower 2 (Cerniera d\'Anca & Glutei)',
        sessionFocus: 'Stacco Rumeno, Hip Thrust, Extension & Polpacci',
        exercises: [
          { order: 1, name: 'Stacco rumeno con bilanciere', targetMuscle: 'Ischiocrurali/Glutei', segment: 'NEURALE', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca controllata.' },
          { order: 2, name: 'Hip thrust con bilanciere o multipower', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Fermo di 2s in alto.' },
          { order: 3, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Pompaggio controllato.' },
          { order: 4, name: 'Calf seduto alla macchina', targetMuscle: 'Soleo', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Contrazione di picco.' }
        ]
      },
      {
        dayLabel: 'Giorno 5: Upper 3 (Volume & Isolamento)',
        sessionFocus: 'Chest Press, Lat Larga, Alzate Laterali & Braccia',
        exercises: [
          { order: 1, name: 'Chest press convergente o manubri', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione costante.' },
          { order: 2, name: 'Lat machine presa prona larga', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura alare dorsale.' },
          { order: 3, name: 'Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 45, effort: 'RIR 0-1', technique: 'NONE', notes: 'Pompaggio deltoidi.' },
          { order: 4, name: 'Super-serie: Curl bicipiti + Pushdown corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Braccia in pump.' }
        ]
      },
      {
        dayLabel: 'Giorno 6: Lower 3 (Catena Posteriore & Pompaggio)',
        sessionFocus: 'Leg Press Piedi Alti, Affondi, Curl & Core',
        exercises: [
          { order: 1, name: 'Leg press a 45� a piedi alti', targetMuscle: 'Glutei/Gambe', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta talloni per catena cinetica.' },
          { order: 2, name: 'Affondi con manubri posteriori', targetMuscle: 'Gambe/Glutei', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Passo controllato.' },
          { order: 3, name: 'Leg curl seduto a tensione continua', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0-1', technique: 'NONE', notes: 'Esaurimento ischiocrurali.' },
          { order: 4, name: 'Crunch a terra + Plank', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '15+45s', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Stabilita finale del tronco.' }
        ]
      }
    ]
  },

};

// ============================================================================
// RICERCA RIGOROSA PER FREQUENZA ESATTA
// ============================================================================

// Assicura che getTemplatesForExactDays cerchi nell'intero catalogo unificato
export function getTemplatesForExactDays(days: number): TemplateMeta[] {
  // Prende tutti i template registrati nel catalogo
  const all = Object.values(TOPGYM_TEMPLATES_CATALOG);
  
  // Ritorna tutte le schede che corrispondono a quel numero di giorni
  return all.filter((tpl: any) => {
    const daysMatch = tpl.daysCount === days || tpl.daysPerWeek === days;
    return daysMatch;
  });
}

// 3. Tutti i template del catalogo senza filtri
export function getAllCatalogTemplates(): TemplateMeta[] {
  return Object.values(TOPGYM_TEMPLATES_CATALOG);
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

  const normalizedGoal = (goal || '').toUpperCase();

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
    } else if (normalizedGoal === 'STRENGTH' || profile === 'AGGRESSIVO_NEURALE') {
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
      // DONNA: Bikini Modular Fitschen/Wilson vs Aceto vs Base
      if (level === 'AVANZATO' && profile === 'METABOLICO_PUMPING') {
        selectedId = 'T28';
        rationale = `Frequenza 4 Giorni (Donna Avanzata Pump): Template T28 Focus Glutei & Spalle su motore Chris ACETO con tecniche ad alta densità (Rest-Pause e parziali pulsate su Abductor).`;
      } else if (level === 'INTERMEDIO' || normalizedGoal.includes('GLUTE') || normalizedGoal.includes('BIKINI') || normalizedGoal === 'HYPERTROPHY') {
        selectedId = 'T32';
        rationale = `Frequenza 4 Giorni (Bikini Division): Template T32 Fitschen & Wilson Bikini 4-Day Modular su motore BIKINI_WAVE. Onde triadiche con carichi pesanti (L: 4-6 rep) su stacchi/hip thrust e isolamento glutei/deltoidi ad alta densità (15-30 rep).`;
      } else {
        selectedId = 'T18';
        rationale = `Frequenza 4 Giorni (Donna Base): Template T18 Upper/Lower con serie Back-Off (-25%) e LISS drenante post-seduta.`;
      }
    } else {
      // UOMO / UNISEX: Helms Pyramid vs Hatfield vs Nocerino
      if (normalizedGoal === 'STRENGTH' || profile === 'AGGRESSIVO_NEURALE') {
        selectedId = 'T11';
        rationale = `Frequenza 4 Giorni (Forza/Power): Template T11 Upper/Lower Hatfield su motore HARDTOPGYM (Bosco-Colli) con progressione neurale in CAT e micro-overload (+2.5%/+5%).`;
      } else if (level === 'INTERMEDIO' || normalizedGoal === 'HYPERTROPHY') {
        selectedId = 'T31';
        rationale = `Frequenza 4 Giorni (Evidence-Based Ipertrofia): Template T31 Eric Helms (The Muscle & Strength Pyramid) su motore HELMS_PYRAMID. Wave Loading lineare sui compound pesanti (4x6 -> 4x5 -> 4x4) e Double Progression (3x12-15) sugli isolamenti con gestione scientifica RPE.`;
      } else {
        selectedId = 'T16';
        rationale = `Frequenza 4 Giorni (Ipertrofia Biomeccanica): Template T16 Torso/Arti su motore NOCERINO con 4 fasi progressive, protezione articolare e tensione continua sui distretti prioritari.`;
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
    } else if (normalizedGoal === 'STRENGTH' || profile === 'AGGRESSIVO_NEURALE' || normalizedGoal.includes('POWER')) {
      selectedId = 'T29';
      rationale = `Frequenza 5 Giorni (Powerbuilding Scientifico): Template T29 Fitschen & Wilson Power-Block Periodization su motore POWERBLOCK_HYBRID. Day 1 Power neurale (Big 3 con AMRAP al 90% autoregolato) + 4 Block Days a mesocicli triadici di ripetizioni (5-7 -> 8-10 -> 10-15 -> 15-30).`;
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
    if (gender === 'FEMALE') {
      selectedId = 'T33';
      rationale = `Frequenza 6 Giorni (Bikini Elite Gara): Template T33 Fitschen & Wilson Bikini Division 6-Day Elite Contest Plan su motore BIKINI_WAVE. Tripla modulazione (Low 4-6 rep, Moderate 8-12 rep, High 15-30 rep) con incremento del volume delle serie solo sui fondamentali della catena cinetica.`;
    } else if (level === 'AVANZATO' || profile === 'METABOLICO_PUMPING') {
      selectedId = 'T30';
      rationale = `Frequenza 6 Giorni (Doppia Stimolazione Cellulare): Template T30 Fitschen & Wilson Blood Volume & Maximum Overload su motore BLOOD_VOLUME_OVERLOAD. Rotazione a 6 workout (3 ON, 1 OFF, 2 ON, 1 OFF): Overload pesanti 3x4-7 con cedimento progressivo a 4 fasi + superserie Blood Volume a cadenza 3-0-3.`;
    } else {
      selectedId = 'T25';
      rationale = `Frequenza 6 Giorni: Template T25 Chris ACETO PPL x2 ad altissima frequenza e volume, con Rest-Pause sistematico e Stripping to 10.`;
    }
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

export function generateSessionsFromTemplateDays(days: any[]): TemplateSession[] {
  if (!Array.isArray(days)) return [];
  return days.map((day: any, dIdx: number) => {
    let rawExercises: any[] = [];
    if (Array.isArray(day.exercises)) {
      rawExercises = day.exercises;
    } else if (Array.isArray(day.segments)) {
      rawExercises = day.segments.flatMap((seg: any) =>
        (seg.exercises || []).map((ex: any) => ({
          ...ex,
          segment: ex.segment || seg.type || 'MECCANICO',
        }))
      );
    }

    return {
      dayLabel: day.title || `Giorno ${dIdx + 1}`,
      sessionFocus: day.title || 'Sessione Target',
      exercises: rawExercises.map((ex: any, eIdx: number) => ({
        order: eIdx + 1,
        name: ex.name || ex.exercise || `Esercizio ${eIdx + 1}`,
        targetMuscle: ex.targetMuscle || 'Distretto Primario',
        segment: (ex.segment || 'MECCANICO') as any,
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps || '8-10'),
        restSeconds: Number(ex.restSeconds) || 90,
        effort: ex.effort || 'RIR 1-2',
        technique: (ex.technique || 'NONE') as any,
        notes: ex.notes || '',
      })),
    };
  });
}

export function convertTemplateToProgramDays(
  template: any,
  gender: Gender
): any[] {
  // Percorso 1: template con metodo generateSessions
  let sessions: TemplateSession[] = [];
  if (typeof template.generateSessions === 'function') {
    try {
      sessions = template.generateSessions(gender);
    } catch (e) {
      console.warn("Errore durante generateSessions, fallback su days:", e);
    }
  }

  // Percorso 2: fallback difensivo se sessions � vuoto ma esistono i days
  if ((!sessions || sessions.length === 0) && Array.isArray(template.days)) {
    sessions = generateSessionsFromTemplateDays(template.days);
  }

  return (sessions || []).map((session, dayIdx) => ({
    id: `${(template.id || 'tpl').toLowerCase()}_day_${dayIdx + 1}`,
    title: `${session.dayLabel} [${template.id || ''}]`,
    isPeriodized: true,
    method: template.primaryEngine || 'TOPGYM_BLOCKS',
    exercises: (session.exercises || []).map((ex, exIdx) => ({
      id: `ex_${(template.id || 'tpl').toLowerCase()}_${dayIdx}_${exIdx}`,
      name: ex.name,
      baseSets: ex.sets,
      baseReps: ex.reps,
      baseRestSeconds: ex.restSeconds,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.restSeconds,
      restSeconds: ex.restSeconds,
      targetMuscle: ex.targetMuscle || 'Corpo Libero',
      segment: ex.segment || 'MECCANICO',
      technique: ex.technique || 'NONE',
      notes: `[${ex.segment || 'MECCANICO'}] ${ex.effort || ''} | ${ex.notes || ''}${ex.technique && ex.technique !== 'NONE' ? ` | Tecnica: ${ex.technique}` : ''}`
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
  daysCount: 5,
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
  daysCount: 6,
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
  daysCount: 4,
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
  daysCount: 4,
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
  daysCount: 6,
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

// ============================================================================
// ESPORTAZIONE UNIFICATA CATALOGO COMPLETO (T01 - T33)
// ============================================================================

export const TEMPLATE_T34: TemplateMeta = {
  id: 'T34',
  title: 'Top Gym Classico 4 Giorni (Petto-Spalle-Bic / Gambe-Dorso-Tric)',
  group: 'INTERMEDIO',
  daysCount: 4,
  primaryEngine: 'TOPGYM_BLOCKS',
  description: 'Split primaria del Metodo TOP GYM a 4 sedute. Massima freschezza neurale su Panca e Squat: Petto-Spalle-Bicipiti e Gambe-Dorso-Tricipiti a frequenza modulata.',
  generateSessions: () => generateSessionsFromTemplateDays(M_B1_SPLIT_BASE),
};

export const TEMPLATE_T35: TemplateMeta = {
  id: 'T35',
  title: 'Top Gym Antagonisti 4 Giorni (Petto-Dorso-Tric / Gambe-Spalle-Bic)',
  group: 'AVANZATO',
  daysCount: 4,
  primaryEngine: 'TOPGYM_BLOCKS',
  description: 'Split fondamentale ad accoppiamento antagonista TOP GYM. Spinta e trazione coordinate per massimo stimolo vascolare: Petto-Dorso-Tricipiti e Gambe-Spalle-Bicipiti.',
  generateSessions: () => generateSessionsFromTemplateDays(M_B2_SPLIT_ANTAGONISTI),
};

export const ALL_TOPGYM_TEMPLATES: TemplateMeta[] = [
  ...TOPGYM_OVER40_TEMPLATES,
  ...HATFIELD_4D_TEMPLATES,
  ...Object.values(TOPGYM_TEMPLATES_CATALOG),
  TEMPLATE_T29 as any,
  TEMPLATE_T30 as any,
  TEMPLATE_T31 as any,
  TEMPLATE_T32 as any,
  TEMPLATE_T33 as any,
  TEMPLATE_T34,
  TEMPLATE_T35,
];

// Garanzia retrocompatibilita': assegna generateSessions a tutti i template privi di esso
[TEMPLATE_T29, TEMPLATE_T30, TEMPLATE_T31, TEMPLATE_T32, TEMPLATE_T33].forEach(t => {
  if (t && !(t as any).generateSessions) {
    (t as any).generateSessions = () => generateSessionsFromTemplateDays((t as any).days);
  }
});
