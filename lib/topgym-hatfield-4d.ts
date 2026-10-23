import { TemplateMeta } from './topgym-catalog';

export const HATFIELD_4D_TEMPLATES: TemplateMeta[] = [
  // -------------------------------------------------------------------
  // T34: SPLIT 1 - UPPER / LOWER TRADIZIONALE
  // -------------------------------------------------------------------
  {
    id: 'T34',
    title: 'Hatfield 4D · Split 1: Upper / Lower Tradizionale',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split 4 giorni Upper/Lower multifrequenza con metodo Hatfield: Neurale (CAT), Meccanico e Metabolico.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper A (Focus Spinta Orizzontale & Tirata)',
        sessionFocus: 'Petto, Dorso Spessore, Tricipiti',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2-3', technique: 'NONE', notes: 'Cadenza CAT esplosiva.' },
          { order: 2, name: 'Rematore con Manubrio Singolo', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione controllata con gomito aderente.' },
          { order: 3, name: 'Spinte con Manubri su Panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'ROM profondo e fermo al petto.' },
          { order: 4, name: 'Pulley Basso al Triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare completa.' },
          { order: 5, name: 'Croci ai Cavi su Panca Piana', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Picco di contrazione isometrica 1".' },
          { order: 6, name: 'French Press con Bilanciere EZ', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Flessione del gomito controllata.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower A (Focus Catena Anteriore & Squat)',
        sessionFocus: 'Quadricipiti, Catena Posteriore, Polpacci',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Discesa controllata in 3".' },
          { order: 2, name: 'Stacco Rumeno con Bilanciere (RDL)', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca e schiena neutra.' },
          { order: 3, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Piedi a centro pedana.' },
          { order: 4, name: 'Leg Curl Seduto', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Tensione continua senza strappi.' },
          { order: 5, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Bruciore lattacido controllato.' },
          { order: 6, name: 'Calf Machine in Piedi', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Fermo 1" in massima contrazione.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper B (Focus Spinta Verticale & Trazione)',
        sessionFocus: 'Dorso Ampiezza, Deltoidi, Bicipiti',
        exercises: [
          { order: 1, name: 'Trazioni alla Sbarra (Zavorrate o Neutre)', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Salita esplosiva al petto.' },
          { order: 2, name: 'Military Press con Bilanciere in Piedi', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Stabilità del core e traiettoria verticale.' },
          { order: 3, name: 'Rematore con Bilanciere Presa Prona', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Busto inclinato a 45 gradi.' },
          { order: 4, name: 'Chest Press Machine', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione costante guidata.' },
          { order: 5, name: 'Alzate Laterali con Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Nessun compenso con la schiena.' },
          { order: 6, name: 'Curl con Bilanciere Sagomato EZ', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Gomiti fissi lungo i fianchi.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower B (Focus Catena Posteriore & Stacco)',
        sessionFocus: 'Stacco, Catena Posteriore, Core',
        exercises: [
          { order: 1, name: 'Stacco da Terra Regolare (Deadlift)', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Spinta potente dai talloni.' },
          { order: 2, name: 'Hack Squat o Front Squat', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Profondità massima al parallelo.' },
          { order: 3, name: 'Affondi Camminati con Manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '10 passi per gamba.' },
          { order: 4, name: 'Leg Curl Sdraiato', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio flessori.' },
          { order: 5, name: 'Standing Calf alla Smith Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'ROM completo in allungamento.' },
          { order: 6, name: 'Plank Addominale Isometrico', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '60"', restSeconds: 60, effort: 'RIR 1', technique: 'ISOMETRIE', notes: 'Tenuta solida con glutei contratti.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T35: SPLIT 2 - PUSH / PULL CLASSICO (GAMBE INTEGRATE)
  // -------------------------------------------------------------------
  {
    id: 'T35',
    title: 'Hatfield 4D · Split 2: Push / Pull Classico (Gambe Integrate)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split 4 giorni Push/Pull con gambe integrate su base Hatfield: Neurale pesante, Meccanico e Isolamento.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push A (Focus Petto & Quadricipiti)',
        sessionFocus: 'Spinta Orizzontale, Squat, Spalle, Tricipiti',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo al petto di 1 secondo.' },
          { order: 2, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Carico pesante e discesa fluida.' },
          { order: 3, name: 'Spinte Manubri su Panca Inclinata a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Focus clavicolare.' },
          { order: 4, name: 'Leg Extension', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Fermo isometrico 1" in alto.' },
          { order: 5, name: 'Alzate Laterali con Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Traiettoria sul piano scapolare.' },
          { order: 6, name: 'Pushdown Cavi con Barra Diritta', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Gomiti fermi e bloccati.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull A (Focus Dorso & Catena Posteriore)',
        sessionFocus: 'Stacco, Tirata Verticale, Flessori, Bicipiti',
        exercises: [
          { order: 1, name: 'Stacco da Terra con Bilanciere', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 3', technique: 'NONE', notes: 'Setup solido prima della trazione.' },
          { order: 2, name: 'Trazioni alla Sbarra Presa Supina', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Petto che tocca la sbarra.' },
          { order: 3, name: 'Stacco Rumeno con Manubri', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Massimo allungamento ischiocrurali.' },
          { order: 4, name: 'Pulley al Basso con Maniglia a V', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Presa stretta al basso ventre.' },
          { order: 5, name: 'Leg Curl Seduto', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione metabolica.' },
          { order: 6, name: 'Curl con Bilanciere Sagomato EZ', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Movimento pulito.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Push B (Focus Deltoidi & Catena Anteriore)',
        sessionFocus: 'Military Press, Leg Press, Dip, Tricipiti',
        exercises: [
          { order: 1, name: 'Military Press Bilanciere in Piedi', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta esplosiva in lock-out.' },
          { order: 2, name: 'Leg Press 45° a Piedi Medi', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Discesa profonda controllata.' },
          { order: 3, name: 'Dip alle Parallele (con sovraccarico)', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Leggera inclinazione del tronco.' },
          { order: 4, name: 'Affondi Fissi con Manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '10 reps per lato.' },
          { order: 5, name: 'Croci ai Cavi Alti', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Chiusura frontale al bacino.' },
          { order: 6, name: 'French Press su Panca a 30° con Manubri', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Presa neutra parallela.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Pull B (Focus Spessore Schiena & Bicipiti)',
        sessionFocus: 'Rematore Pesante, Lat Larga, Catena Post, Bicipiti',
        exercises: [
          { order: 1, name: 'Rematore con Bilanciere Presa Supina', targetMuscle: 'Upper Back', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Presa Yates a contatto coscia.' },
          { order: 2, name: 'Lat Machine Presa Larga Prona', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Trazione al clavicolare.' },
          { order: 3, name: 'Glute Ham Raise o Hyper-extension Flessori', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Attivazione gluteo-femorale.' },
          { order: 4, name: 'Pullover con Manubrio su Panca', targetMuscle: 'Dorso', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Grande espansione toracica.' },
          { order: 5, name: 'Face Pull al Cavo Alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Rotazione esterna degli omeri.' },
          { order: 6, name: 'Hammer Curl con Manubri', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Focus brachioradiale.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T36: SPLIT 3 - PUSH / PULL / LEGS + UPPER (FREQUENZA TORACE)
  // -------------------------------------------------------------------
  {
    id: 'T36',
    title: 'Hatfield 4D · Split 3: Push / Pull / Legs + Upper (Ibrido Frequenza Torace)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split ibrida PPL + richiamo Upper Body a 4 giorni con triplice stimolo cellulare (CAT, MAV, Metabolico).',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Petto – Spalle Anteriori/Laterali – Tricipiti)',
        sessionFocus: 'Spinta Orizzontale & Verticale, Tricipiti',
        exercises: [
          { order: 1, name: 'Panca Piana Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta CAT potente.' },
          { order: 2, name: 'Military Press Bilanciere', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti sotto il bilanciere.' },
          { order: 3, name: 'Incline Dumbbell Press (30°)', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Profondità e tensione continua.' },
          { order: 4, name: 'Alzate Laterali Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Cadenza fluida.' },
          { order: 5, name: 'Croci ai Cavi Bassi', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Chiusura all\'altezza del petto alto.' },
          { order: 6, name: 'Pushdown con Corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Apertura finale delle mani.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Dorso – Deltoidi Posteriori – Bicipiti)',
        sessionFocus: 'Trazione Verticale & Orizzontale, Bicipiti',
        exercises: [
          { order: 1, name: 'Trazioni alla Sbarra Zavorrate', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Sovraccarico progressivo.' },
          { order: 2, name: 'Rematore Bilanciere a 45°', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione forte ai fianchi.' },
          { order: 3, name: 'Lat Machine Presa Neutra Stretta', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Massima adduzione.' },
          { order: 4, name: 'Rematore Singolo al Cavo Basso', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Torsione controllata.' },
          { order: 5, name: 'Rear Delt Fly ai Cavi (Croci Inverse)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento deltoide posteriore.' },
          { order: 6, name: 'Incline Dumbbell Curl', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Panca a 45° in massimo allungamento.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Legs (Gambe Complete & Core)',
        sessionFocus: 'Squat, RDL, Quadricipiti, Flessori, Polpacci',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Profondità rigorosa sotto il parallelo.' },
          { order: 2, name: 'Stacco Rumeno (RDL) con Bilanciere', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Tensione eccentrica 3".' },
          { order: 3, name: 'Leg Press 45° a Piedi Alti e Larghi', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Focus glutei e adduttori.' },
          { order: 4, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Bruciore finale.' },
          { order: 5, name: 'Lying Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione metabolica.' },
          { order: 6, name: 'Sitting Calf Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento del soleo.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper Body (Richiamo Bilanciato Spinta/Trazione)',
        sessionFocus: 'Spinte Piane, Pulley, Spalle, Superset Braccia',
        exercises: [
          { order: 1, name: 'Spinte Manubri su Panca Piana', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta pesante manubri.' },
          { order: 2, name: 'Rematore al Pulley Presa Larga', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Presa prona larga al torace.' },
          { order: 3, name: 'Shoulder Press Machine', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria vincolata fluida.' },
          { order: 4, name: 'Pectoral Machine', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Fermo 1" in massima adduzione.' },
          { order: 5, name: 'Face Pull al Cavo', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Cavo all\'altezza degli occhi.' },
          { order: 6, name: 'Superset Braccia (Curl Cavi + Pushdown)', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 90, effort: 'RIR 0', technique: 'SUPERSET', notes: 'Saturazione senza pausa tra i due esercizi.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T37: SPLIT 4 - PUSH / PULL / LEGS + LOWER (FREQUENZA GAMBE)
  // -------------------------------------------------------------------
  {
    id: 'T37',
    title: 'Hatfield 4D · Split 4: Push / Pull / Legs + Lower (Ibrido Frequenza Gambe)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split ibrida PPL + richiamo Lower Catena Posteriore con specializzazione Stacco, Hip Thrust e Squat.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Push (Upper Spinta)',
        sessionFocus: 'Panca Piana, Spinte 30°, Lento, Dips',
        exercises: [
          { order: 1, name: 'Panca Piana Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta CAT esplosiva.' },
          { order: 2, name: 'Spinte Manubri su Panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Massimo allungamento.' },
          { order: 3, name: 'Lento Avanti Seduto con Manubri', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta pulita sopra la testa.' },
          { order: 4, name: 'Chest Press Incline', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione a cedimento.' },
          { order: 5, name: 'Alzate Laterali al Cavo Singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Cavo basso dietro la schiena.' },
          { order: 6, name: 'Dips alle Parallele per Tricipiti', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Busto eretto focus tricipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Pull (Upper Trazione)',
        sessionFocus: 'Rematore Bilanciere, Lat Inversa, Pulley, Bicipiti',
        exercises: [
          { order: 1, name: 'Rematore con Bilanciere Presa Prona', targetMuscle: 'Upper Back', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Tonnellaggio elevato.' },
          { order: 2, name: 'Lat Machine Presa Inversa', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Presa supina a larghezza spalle.' },
          { order: 3, name: 'Pulley Basso al Triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Adduzione scapolare costante.' },
          { order: 4, name: 'Croci Inverse alla Pectoral Machine', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento posteriore.' },
          { order: 5, name: 'Curl Bilanciere in Piedi', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Bilanciere dritto o sagomato.' },
          { order: 6, name: 'Hammer Curl con Corda al Cavo Basso', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio brachioradiale.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower A (Focus Catena Anteriore & Squat)',
        sessionFocus: 'Squat, Hack Squat, Affondi, Polpacci',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Carico pesante e controllo del bacino.' },
          { order: 2, name: 'Hack Squat a 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa a 3 secondi.' },
          { order: 3, name: 'Affondi Fissi con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 2', technique: 'NONE', notes: '10 reps per lato.' },
          { order: 4, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Massimo bruciore locale.' },
          { order: 5, name: 'Seated Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Richiamo flessori.' },
          { order: 6, name: 'Standing Calf Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Fermo 1" in allungamento.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower B (Focus Catena Posteriore, Stacco & Glutei)',
        sessionFocus: 'Deadlift, Hip Thrust, RDL, Glutei',
        exercises: [
          { order: 1, name: 'Stacco da Terra Regolare (o Semi-Sumo)', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 3', technique: 'NONE', notes: 'Spinta violenta a terra.' },
          { order: 2, name: 'Hip Thrust con Bilanciere', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo 1" in massima estensione.' },
          { order: 3, name: 'Stacco Rumeno con Manubri (RDL)', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa lenta.' },
          { order: 4, name: 'Lying Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 4, reps: '10-12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Contrazione di picco.' },
          { order: 5, name: 'Cavi Kickback per Glutei o Abductor Machine', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione metabolica glutei.' },
          { order: 6, name: 'Calf alla Leg Press 45°', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Piedi su bordo pedana.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T38: SPLIT 5 - TORSO / GAMBE & BRACCIA (TRONCO VS PERIFERIA)
  // -------------------------------------------------------------------
  {
    id: 'T38',
    title: 'Hatfield 4D · Split 5: Torso / Gambe & Braccia (Tronco vs Periferia)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split 4 giorni Tronco vs Periferia: Neurale pesante sui grandi schemi motori e lavoro diretto su braccia e gambe.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Torso A (Focus Spinta Pettorale & Spessore Dorso)',
        sessionFocus: 'Panca Piana, Rematore Manubrio, Spalle, Croci',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Reclutamento CAT.' },
          { order: 2, name: 'Rematore con Manubrio', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Arco di trazione dorsale.' },
          { order: 3, name: 'Incline Chest Press', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Tensione continua.' },
          { order: 4, name: 'Pulley al Basso con Barra Presa Stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Schiacciamento scapole.' },
          { order: 5, name: 'Alzate Laterali con Manubri Seduto', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Nessuna spinta d\'anca.' },
          { order: 6, name: 'Croci ai Cavi Alti', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio sternale.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Gambe & Braccia A (Focus Catena Anteriore & Braccia)',
        sessionFocus: 'Squat, Pressa, Curl EZ, French Press',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 210, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale arti inferiori.' },
          { order: 2, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Carico pesante.' },
          { order: 3, name: 'Leg Curl Seduto', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione sui flessori.' },
          { order: 4, name: 'Curl con Bilanciere EZ in Piedi', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Meccanico bicipiti pesante.' },
          { order: 5, name: 'French Press con Bilanciere Sagomato', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa alla fronte.' },
          { order: 6, name: 'Superset Metabolico Braccia: Hammer Curl Cavo + Pushdown Corda', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 75, effort: 'RIR 0', technique: 'SUPERSET', notes: 'Bruciore massimo periferico.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Torso B (Focus Larghezza Dorso & Spalle)',
        sessionFocus: 'Trazioni, Military Press, Inclinata, Face Pull',
        exercises: [
          { order: 1, name: 'Trazioni alla Sbarra Zavorrate (o Lat Pesante)', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'CAT alla sbarra.' },
          { order: 2, name: 'Military Press Bilanciere', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 135, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta overhead pesante.' },
          { order: 3, name: 'Spinte con Manubri su Panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione costante al petto alto.' },
          { order: 4, name: 'Rematore con Manubri su Panca Inclinata a 45°', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Appoggio torace rigido.' },
          { order: 5, name: 'Alzate Laterali al Cavo Basso', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Tensione continua del cavo.' },
          { order: 6, name: 'Face Pull al Cavo Alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Extrarotazione di chiusura.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Gambe & Braccia B (Focus Catena Posteriore & Braccia)',
        sessionFocus: 'Stacco da Terra, RDL, Braccia Inclinata & Dips',
        exercises: [
          { order: 1, name: 'Stacco da Terra con Bilanciere', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Grande forza neurale.' },
          { order: 2, name: 'Stacco Rumeno con Manubri', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Ischiocrurali sotto carico.' },
          { order: 3, name: 'Affondi Camminati con Manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '10 passi per arto.' },
          { order: 4, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione metabolica.' },
          { order: 5, name: 'Curl Manubri su Panca Inclinata a 45°', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 4, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Capo lungo bicipiti.' },
          { order: 6, name: 'Dips tra Due Panche (con sovraccarico)', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 90, effort: 'RIR 0', technique: 'NONE', notes: 'Carico disco sulle gambe.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T39: SPLIT 6 - FULL BODY ALTERNATA (A - B - A - B)
  // -------------------------------------------------------------------
  {
    id: 'T39',
    title: 'Hatfield 4D · Split 6: Full Body Alternata (A - B - A - B)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Full body 4 giorni ad alta frequenza con ondulazione neurale/meccanica e rotazione angoli articolari.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Full Body A (Focus Neurale Squat & Spinta Upper)',
        sessionFocus: 'Squat Neurale, Panca Meccanica, Dorso, Braccia',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 210, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale squat fondamentale.' },
          { order: 2, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Meccanico pesante petto.' },
          { order: 3, name: 'Rematore con Manubrio', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione pura.' },
          { order: 4, name: 'Leg Curl Sdraiato', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Focus femorali.' },
          { order: 5, name: 'Alzate Laterali con Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico deltoidi.' },
          { order: 6, name: 'Curl con Bilanciere Sagomato EZ', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Isolamento bicipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Full Body B (Focus Neurale Stacco & Tirata Upper)',
        sessionFocus: 'Stacco Neurale, Military, Trazioni, Pressa',
        exercises: [
          { order: 1, name: 'Stacco da Terra Regolare', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 3', technique: 'NONE', notes: 'Stacco da terra neurale.' },
          { order: 2, name: 'Military Press Bilanciere', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta verticale pesante.' },
          { order: 3, name: 'Trazioni alla Sbarra Presa Neutra', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Trazione dorsale completa.' },
          { order: 4, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spinta arti inferiori.' },
          { order: 5, name: 'Croci ai Cavi Bassi', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio petto.' },
          { order: 6, name: 'Pushdown con Barra al Cavo Alto', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento tricipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Full Body A (Variazione Angoli e Carichi)',
        sessionFocus: 'Front Squat, Spinte Inclinata, Pulley, RDL',
        exercises: [
          { order: 1, name: 'Front Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti alti e busto eretto.' },
          { order: 2, name: 'Spinte Manubri su Panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Inclinata manubri.' },
          { order: 3, name: 'Pulley Basso al Triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Tirata orizzontale.' },
          { order: 4, name: 'Stacco Rumeno con Manubri', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 105, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione dell\'anca.' },
          { order: 5, name: 'Alzate Laterali al Cavo Singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento deltoide laterale.' },
          { order: 6, name: 'Incline Dumbbell Curl', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Allungamento bicipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Full Body B (Variazione Angoli e Pompaggio)',
        sessionFocus: 'Panca Richiamo, Lat Larga, Affondi, Lento',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere (Richiamo Carico)', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '3', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Velocità esecutiva e CAT.' },
          { order: 2, name: 'Lat Machine Presa Larga Prona', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Ampiezza schiena.' },
          { order: 3, name: 'Affondi Camminati con Manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '10 passi per arto.' },
          { order: 4, name: 'Lento con Manubri Seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta manubri da seduto.' },
          { order: 5, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Bruciore quadricipiti.' },
          { order: 6, name: 'French Press con Bilanciere EZ', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio tricipiti.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T40: SPLIT 7 - PHAT MODIFICATO SU 4 GIORNI (POWER / HYPERTROPHY)
  // -------------------------------------------------------------------
  {
    id: 'T40',
    title: 'Hatfield 4D · Split 7: PHAT Modificato 4D (Power / Hypertrophy)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Power Hypertrophy Adaptive Training su 4 giorni: 2 giorni Power Neurale (CAT) e 2 giorni Ipertrofia Metabolica.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Upper Power (Carichi Pesanti & Potenza Neurale)',
        sessionFocus: 'Panca CAT, Rematore Bilanciere, Military, Dips',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Accelerazione compensatoria CAT.' },
          { order: 2, name: 'Rematore con Bilanciere Pesante', targetMuscle: 'Upper Back', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'CAT esplosivo al petto.' },
          { order: 3, name: 'Military Press Bilanciere', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '5-6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Overhead power.' },
          { order: 4, name: 'Trazioni alla Sbarra Zavorrate', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione zavorrata pesante.' },
          { order: 5, name: 'Spinte Manubri su Panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Carico manubri alto.' },
          { order: 6, name: 'Dips alle Parallele (con zavorra)', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Tricipiti con zavorra.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Power (Forza Pura Arti Inferiori)',
        sessionFocus: 'Squat CAT, Stacco Terra, Leg Press, RDL Pesante',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Squat CAT potenza pura.' },
          { order: 2, name: 'Stacco da Terra Regolare', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '3-4', restSeconds: 240, effort: 'RIR 2-3', technique: 'NONE', notes: 'Tonnellaggio massimale.' },
          { order: 3, name: 'Leg Press 45° a Carico Alto', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Carico elevato.' },
          { order: 4, name: 'Stacco Rumeno con Bilanciere', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Catena posteriore pesante.' },
          { order: 5, name: 'Standing Calf alla Smith Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Fermo 2" in basso.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper Hypertrophy (Tensione Meccanica Continua & Metabolico)',
        sessionFocus: 'Incline Press, Lat Larga, Pectoral Stripping, Superset',
        exercises: [
          { order: 1, name: 'Incline Chest Press Machine', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Tensione continua.' },
          { order: 2, name: 'Lat Machine Presa Larga al Petto', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Schiacciamento dorsale.' },
          { order: 3, name: 'Rematore Singolo con Manubrio', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento massimo.' },
          { order: 4, name: 'Pectoral Machine', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 75, effort: 'RIR 0', technique: 'STRIPPING', notes: 'Stripping a 1 drop nell\'ultima serie.' },
          { order: 5, name: 'Alzate Laterali con Manubri Seduto', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Bruciore deltoide.' },
          { order: 6, name: 'Superset Braccia (Curl Scott Bilanciere EZ + Pushdown Cavi)', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10-12+10-12', restSeconds: 90, effort: 'RIR 0', technique: 'SUPERSET', notes: 'Superset Scott + Pushdown.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Hypertrophy (Stress Metabolico & Volume Muscolare)',
        sessionFocus: 'Hack Squat 3" discesa, Affondi, Leg Curl 10+MAX, Rest-Pause',
        exercises: [
          { order: 1, name: 'Hack Squat a 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Discesa frenata in 3".' },
          { order: 2, name: 'Affondi Camminati con Manubri', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '12 passi per gamba.' },
          { order: 3, name: 'Lying Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 4, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: '10_PIU_MAX', notes: 'Tecnica 10 + MAX nell\'ultima serie.' },
          { order: 4, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 0', technique: 'REST_PAUSE', notes: 'Rest-Pause nell\'ultima serie.' },
          { order: 5, name: 'Seated Calf Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 4, reps: '15-20', restSeconds: 45, effort: 'RIR 0', technique: 'NONE', notes: 'Pump metabolico al soleo.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T41: SPLIT 8 - CINEMATICA: ORIZZONTALE / VERTICALE
  // -------------------------------------------------------------------
  {
    id: 'T41',
    title: 'Hatfield 4D · Split 8: Cinematica Orizzontale / Verticale',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Split basata sui piani cinematici: Orizzontale + Quad e Verticale + Catena Posteriore in multifrequenza 2x.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Orizzontale + Quad A (Spinta/Tirata Orizzontale & Ginocchio)',
        sessionFocus: 'Panca Piana, Rematore Bilanciere, Squat, Pulley',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale spinta orizzontale.' },
          { order: 2, name: 'Rematore con Bilanciere Presa Prona', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Meccanico tirata orizzontale.' },
          { order: 3, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Meccanico catena anteriore.' },
          { order: 4, name: 'Chest Press Machine Presa Neutra', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spinta guidata.' },
          { order: 5, name: 'Pulley Basso con Maniglia Larga', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Focus centro schiena.' },
          { order: 6, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento metabolico quadricipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Verticale + Catena Posteriore A (Spinta/Tirata Verticale & Anca)',
        sessionFocus: 'Trazioni, Military, RDL, Lat Inversa, Leg Curl',
        exercises: [
          { order: 1, name: 'Trazioni alla Sbarra Zavorrate (Presa Prona)', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 5, reps: '4-5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale tirata verticale.' },
          { order: 2, name: 'Military Press Bilanciere in Piedi', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 4, reps: '6', restSeconds: 135, effort: 'RIR 2', technique: 'NONE', notes: 'Meccanico spinta verticale.' },
          { order: 3, name: 'Stacco Rumeno con Bilanciere (RDL)', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca catena posteriore.' },
          { order: 4, name: 'Lat Machine Presa Inversa Stretta', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione verticale supina.' },
          { order: 5, name: 'Shoulder Press Machine', targetMuscle: 'Deltoidi Anteriori', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Saturazione spalle.' },
          { order: 6, name: 'Leg Curl Seduto', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico flessori.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Orizzontale + Quad B (Variazione Angoli e Densità)',
        sessionFocus: 'Spinte Piane Manubri, T-Bar, Leg Press Stretta, Sissy Squat',
        exercises: [
          { order: 1, name: 'Spinte con Manubri su Panca Piana', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta manubri pesante.' },
          { order: 2, name: 'Rematore al T-Bar con Appoggio al Petto', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'T-Bar con appoggio torace.' },
          { order: 3, name: 'Leg Press 45° a Piedi Stretti', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 120, effort: 'RIR 1', technique: 'NONE', notes: 'Focus vasto laterale.' },
          { order: 4, name: 'Croci con Manubri su Panca Piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 5, name: 'Pulley al Basso a Presa Stretta', targetMuscle: 'Dorso', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico dorso.' },
          { order: 6, name: 'Sissy Squat al Cavo o a Corpo Libero', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Bruciore quadricipiti estremo.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Verticale + Catena Posteriore B (Variazione Angoli e Isolamento)',
        sessionFocus: 'Lento Manubri, Lat V-Bar, Gambe Semitese, Face Pull',
        exercises: [
          { order: 1, name: 'Lento Avanti Seduto con Manubri', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale spalle.' },
          { order: 2, name: 'Lat Machine Presa Neutra V-Bar', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '8-10', restSeconds: 105, effort: 'RIR 1-2', technique: 'NONE', notes: 'Tirata triangolo.' },
          { order: 3, name: 'Stacco da Terra a Gambe Semitese', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Catena posteriore.' },
          { order: 4, name: 'Alzate Laterali con Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico deltoidi.' },
          { order: 5, name: 'Lying Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento flessori.' },
          { order: 6, name: 'Face Pull al Cavo Alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Extrarotazione posteriore.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T42: SPLIT 9 - ANTERIOR / POSTERIOR CHAIN
  // -------------------------------------------------------------------
  {
    id: 'T42',
    title: 'Hatfield 4D · Split 9: Anterior / Posterior Chain',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: 'Catena Anteriore vs Catena Posteriore su 4 giorni con alternanza di stimoli neurali e saturazione metabolica.',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Anterior Chain A (Quadricipiti – Petto – Deltoidi Anteriori – Addome)',
        sessionFocus: 'Squat Neurale, Panca Bilanciere, Pressa, Spinte 30°',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 210, effort: 'RIR 2', technique: 'NONE', notes: 'Forza neurale catena anteriore.' },
          { order: 2, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta pesante petto.' },
          { order: 3, name: 'Leg Press 45° Piedi Bassi (Focus Vasto)', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Piedi a bordo inferiore per focus ginocchio.' },
          { order: 4, name: 'Spinte con Manubri su Panca Inclinata a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Inclinata manubri.' },
          { order: 5, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico quadricipiti.' },
          { order: 6, name: 'Crunch ai Cavi in Ginocchio', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Flessione del busto con diaframma svuotato.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Posterior Chain A (Dorso – Flessori – Glutei – Deltoidi Posteriori – Tricipiti)',
        sessionFocus: 'Stacco Neurale, Trazioni, RDL, Pulley, French Press',
        exercises: [
          { order: 1, name: 'Stacco da Terra Regolare', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 4, reps: '4', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Reclutamento totale catena posteriore.' },
          { order: 2, name: 'Trazioni alla Sbarra Zavorrate', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 4, reps: '6', restSeconds: 150, effort: 'RIR 2', technique: 'NONE', notes: 'Trazione zavorrata.' },
          { order: 3, name: 'Stacco Rumeno con Bilanciere', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Cerniera d\'anca RDL.' },
          { order: 4, name: 'Pulley al Basso Presa Neutra', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Dorso spessore.' },
          { order: 5, name: 'Lying Leg Curl', targetMuscle: 'Femorali', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico flessori.' },
          { order: 6, name: 'French Press con Bilanciere EZ', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Capo lungo tricipiti.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Anterior Chain B (Variazione Esercizi)',
        sessionFocus: 'Front Squat / Hack, Dips, Affondi Fissi, Lento Manubri',
        exercises: [
          { order: 1, name: 'Front Squat o Hack Squat', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Catena anteriore pesante.' },
          { order: 2, name: 'Dips alle Parallele (con zavorra)', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta pettorale profonda.' },
          { order: 3, name: 'Affondi Fissi con Manubri', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: '10 reps per arto.' },
          { order: 4, name: 'Croci ai Cavi su Panca Inclinata', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Isolamento petto alto.' },
          { order: 5, name: 'Lento con Manubri Seduto', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Spalle manubri.' },
          { order: 6, name: 'Hanging Leg Raise', targetMuscle: 'Addome', segment: 'CORE_CARDIO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Sollevamento gambe alla sbarra controllato.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Posterior Chain B (Variazione Esercizi e Dettaglio)',
        sessionFocus: 'Rematore Supino, Hip Thrust, Lat Larga, Good Morning',
        exercises: [
          { order: 1, name: 'Rematore con Bilanciere Presa Supina', targetMuscle: 'Upper Back', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale tirata supina.' },
          { order: 2, name: 'Hip Thrust con Bilanciere', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 135, effort: 'RIR 2', technique: 'NONE', notes: 'Glutei estensione d\'anca.' },
          { order: 3, name: 'Lat Machine Presa Larga Dietro o al Petto', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione ampia al petto.' },
          { order: 4, name: 'Good Morning con Bilanciere', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 2', technique: 'NONE', notes: 'Flessione del tronco controllata.' },
          { order: 5, name: 'Face Pull al Cavo Alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico rotatori.' },
          { order: 6, name: 'Pushdown Cavi con Corda', targetMuscle: 'Tricipiti', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio tricipiti.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------
  // T43: SPLIT 10 - SPECIALIZZAZIONE / WEAK POINT SPLIT
  // -------------------------------------------------------------------
  {
    id: 'T43',
    title: 'Hatfield 4D · Split 10: Specializzazione / Weak Point Split',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'HATFIELD',
    description: '2 giorni Upper/Lower di mantenimento base + 2 giorni specializzazione carenze (Spalle/Braccia e Dorso/Deltoidi Post).',
    generateSessions: () => [
      {
        dayLabel: 'Giorno 1: Full Upper Base (Manutenzione Generale Tronco)',
        sessionFocus: 'Panca Piana, Rematore Manubrio, Military, Lat Machine',
        exercises: [
          { order: 1, name: 'Panca Piana con Bilanciere', targetMuscle: 'Petto', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Mantenimento forza tronco.' },
          { order: 2, name: 'Rematore con Manubrio', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Dorso pesante.' },
          { order: 3, name: 'Military Press Bilanciere', targetMuscle: 'Deltoidi Anteriori', segment: 'MECCANICO', sets: 3, reps: '6', restSeconds: 120, effort: 'RIR 2', technique: 'NONE', notes: 'Spalle composto.' },
          { order: 4, name: 'Lat Machine Presa Larga', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 90, effort: 'RIR 1', technique: 'NONE', notes: 'Trazione verticale.' },
          { order: 5, name: 'Croci ai Cavi Piani', targetMuscle: 'Petto', segment: 'METABOLICO', sets: 2, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Pompaggio petto.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Full Lower Base (Manutenzione Generale Gambe)',
        sessionFocus: 'Squat, Stacco da Terra, Pressa, RDL',
        exercises: [
          { order: 1, name: 'Back Squat con Bilanciere', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 210, effort: 'RIR 2', technique: 'NONE', notes: 'Mantenimento carichi squat.' },
          { order: 2, name: 'Stacco da Terra Regolare', targetMuscle: 'Femorali', segment: 'NEURALE', sets: 3, reps: '4', restSeconds: 210, effort: 'RIR 2-3', technique: 'NONE', notes: 'Forza stacco.' },
          { order: 3, name: 'Leg Press 45°', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Tensione gambe.' },
          { order: 4, name: 'Stacco Rumeno con Manubri', targetMuscle: 'Femorali', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 2', technique: 'NONE', notes: 'Catena posteriore.' },
          { order: 5, name: 'Leg Extension Machine', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 2, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Metabolico.' },
          { order: 6, name: 'Standing Calf Machine', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Polpacci.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Focus Carenza 1 — Spalle & Braccia (Volume Meccanico & Tecniche Speciali)',
        sessionFocus: 'Lento Manubri, Alzate 10+MAX, Curl EZ, French, Superset Stripping',
        exercises: [
          { order: 1, name: 'Lento Avanti Seduto con Manubri', targetMuscle: 'Deltoidi Anteriori', segment: 'NEURALE', sets: 5, reps: '5', restSeconds: 150, effort: 'RIR 1-2', technique: 'NONE', notes: 'Neurale primario spalle.' },
          { order: 2, name: 'Alzate Laterali con Manubri', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 75, effort: 'RIR 1', technique: 'NONE', notes: 'Volume meccanico spalle.' },
          { order: 3, name: 'Alzate Laterali al Cavo Singolo', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 0', technique: '10_PIU_MAX', notes: 'Tecnica 10 + MAX nell\'ultima serie.' },
          { order: 4, name: 'Curl con Bilanciere Sagomato EZ', targetMuscle: 'Bicipiti', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Sovraccarico bicipiti.' },
          { order: 5, name: 'French Press su Panca Piana con Bilanciere', targetMuscle: 'Tricipiti', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 105, effort: 'RIR 1', technique: 'NONE', notes: 'Sovraccarico tricipiti.' },
          { order: 6, name: 'Superset Metabolico Braccia: Hammer Curl Manubri + Pushdown Cavo', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 90, effort: 'RIR 0', technique: 'STRIPPING', notes: 'Stripping a 1 drop finale.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Focus Carenza 2 — Dorso & Deltoidi Posteriori (Volume & Densitizzazione)',
        sessionFocus: 'Trazioni Zavorrate, Rematore 45°, Pulley Back-off, Rear Delt Rest-Pause',
        exercises: [
          { order: 1, name: 'Trazioni alla Sbarra Zavorrate', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '5', restSeconds: 180, effort: 'RIR 2', technique: 'NONE', notes: 'Neurale dorso.' },
          { order: 2, name: 'Rematore Bilanciere a Busto Flesso a 45°', targetMuscle: 'Upper Back', segment: 'MECCANICO', sets: 4, reps: '6-8', restSeconds: 120, effort: 'RIR 1-2', technique: 'NONE', notes: 'Spessore schiena.' },
          { order: 3, name: 'Pulley al Basso Presa Stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '8-10', restSeconds: 105, effort: 'RIR 0', technique: 'BACK_OFF', notes: 'Back-off set a cedimento (-25% carico).' },
          { order: 4, name: 'Lat Machine Presa Neutra Stretta', targetMuscle: 'Gran Dorsale', segment: 'MECCANICO', sets: 3, reps: '10-12', restSeconds: 75, effort: 'RIR 0', technique: 'NONE', notes: 'Dorsale in allungamento.' },
          { order: 5, name: 'Rear Delt Fly alla Macchina (Pectoral Inversa)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 0', technique: 'REST_PAUSE', notes: 'Rest-Pause finale (cluster da 15" pause).' },
          { order: 6, name: 'Face Pull al Cavo Alto', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 0', technique: 'NONE', notes: 'Extrarotazione e pompaggio.' }
        ]
      }
    ]
  }
];
