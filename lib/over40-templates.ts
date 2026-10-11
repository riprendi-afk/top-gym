import { TemplateMeta, TemplateSession, Gender } from './topgym-catalog';

export const BOMPA_OVER40_TEMPLATES: TemplateMeta[] = [
  // --------------------------------------------------------------------------
  // 1. BOMPA-O40-01: Adattamento Anatomico (AA) Circuit - Full Body
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-01',
    title: 'Adattamento Anatomico (AA) Circuit - Full Body (Tudor Bompa)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Circuito a stazioni Full Body a basso impatto articolare: capillarizzazione, rinforzo tendineo, eccentriche controllate (2-3s) e recupero attivo.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Seduta 1: Circuito Adattamento Anatomico (Giro A)',
        sessionFocus: '3-4 Giri a stazioni · 45-60" rec tra stazioni · 2-3\' tra i giri',
        exercises: [
          { order: 1, name: 'Leg press orizzontale o 45°', targetMuscle: 'Gambe / Spinta', segment: 'NEURALE', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Discesa frenata 3s, nessun blocco articolare al ginocchio.' },
          { order: 2, name: 'Spinte con manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Presa semi-prona neutra per salvaguardia della cuffia dei rotatori.' },
          { order: 3, name: 'Lat pulldown presa prona media', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Depressione scapolare solida, tirata allo sterno.' },
          { order: 4, name: 'Step-Up su box o panca bassa', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Controllo dell\'allineamento ginocchio-bacino.' },
          { order: 5, name: 'Dumbbell shoulder press seduto', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '35-40% 1RM', technique: 'CIRCUITO', notes: 'Schienale a 75-80° per scaricare l\'area lombare.' },
          { order: 6, name: 'Pulley orizzontale al cavo', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Fermo di 1s in massima adduzione scapolare.' },
          { order: 7, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Movimento fluido a tensione continua protetta.' },
          { order: 8, name: 'Hyperextension su panca a 45°', targetMuscle: 'Catena Posteriore', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Allineamento tronco-bacino senza iperlordosi lombare.' },
          { order: 9, name: 'Plank a terra o su panca', targetMuscle: 'Core Isometrico', segment: 'METABOLICO', sets: 3, reps: '40-45s', restSeconds: 90, effort: 'Isometrico', technique: 'CIRCUITO', notes: 'Compattezza glutei-addome, rachide in asse neutrale.' }
        ]
      },
      {
        dayLabel: 'Seduta 2: Circuito Adattamento Anatomico (Giro B)',
        sessionFocus: 'Ripetizione circuito con focus su ROM e respirazione diaframmatica',
        exercises: [
          { order: 1, name: 'Leg press orizzontale o 45°', targetMuscle: 'Gambe / Spinta', segment: 'NEURALE', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Discesa frenata 3s, zero blocco articolare.' },
          { order: 2, name: 'Spinte con manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Presa neutra salva-spalle.' },
          { order: 3, name: 'Lat pulldown presa prona media', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Apertura toracica e scapole depresse.' },
          { order: 4, name: 'Step-Up su box o panca bassa', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Stabilità del bacino.' },
          { order: 5, name: 'Dumbbell shoulder press seduto', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '35-40% 1RM', technique: 'CIRCUITO', notes: 'Schienale inclinato salva-rachide.' },
          { order: 6, name: 'Pulley orizzontale al cavo', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Spalle basse e petto in fuori.' },
          { order: 7, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Flessione del ginocchio controllata.' },
          { order: 8, name: 'Hyperextension su panca a 45°', targetMuscle: 'Catena Posteriore', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Focus estensione anca, non lombare.' },
          { order: 9, name: 'Plank a terra o su panca', targetMuscle: 'Core Isometrico', segment: 'METABOLICO', sets: 3, reps: '40-45s', restSeconds: 90, effort: 'Isometrico', technique: 'CIRCUITO', notes: 'Retroversione bacino.' }
        ]
      },
      {
        dayLabel: 'Seduta 3: Circuito Adattamento Anatomico (Giro C)',
        sessionFocus: 'Chiusura microciclo settimanale · Massima capillarizzazione',
        exercises: [
          { order: 1, name: 'Leg press orizzontale o 45°', targetMuscle: 'Gambe / Spinta', segment: 'NEURALE', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Cadenza fluida 3-0-1.' },
          { order: 2, name: 'Spinte con manubri su panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Discesa profonda controllata.' },
          { order: 3, name: 'Lat pulldown presa prona media', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Gomiti che guidano verso il basso.' },
          { order: 4, name: 'Step-Up su box o panca bassa', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Spinta solo sul tallone alto.' },
          { order: 5, name: 'Dumbbell shoulder press seduto', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '35-40% 1RM', technique: 'CIRCUITO', notes: 'Spinta fino a estensione naturale.' },
          { order: 6, name: 'Pulley orizzontale al cavo', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Squeeze scapolare 1 secondo.' },
          { order: 7, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Isolamento catena flessoria.' },
          { order: 8, name: 'Hyperextension su panca a 45°', targetMuscle: 'Catena Posteriore', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Attivazione glutei in salita.' },
          { order: 9, name: 'Plank a terra o su panca', targetMuscle: 'Core Isometrico', segment: 'METABOLICO', sets: 3, reps: '40-45s', restSeconds: 90, effort: 'Isometrico', technique: 'CIRCUITO', notes: 'Massima compattezza del corsetto.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. BOMPA-O40-02: Muscular Endurance (M-E) - Upper / Lower
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-02',
    title: 'Muscular Endurance (M-E) Upper / Lower (Tudor Bompa)',
    group: 'INTERMEDIO',
    daysCount: 4,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Split Upper/Lower 4 giorni per ricomposizione e aumento EPOC: serie dense a 15-20 ripetizioni, recuperi ridotti a 45-60" e zero usura articolare.',
    generateSessions: (): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Upper Body M-E (Spinta, Trazione & Braccia)',
        sessionFocus: 'Alta densità lattacida e volume moderato',
        exercises: [
          { order: 1, name: 'Chest press guidata o spinte manubri 30°', targetMuscle: 'Petto', segment: 'NEURALE', sets: 3, reps: '15-18', restSeconds: 45, effort: '50-60% 1RM (RIR 2)', technique: 'NONE', notes: 'Controllo eccentrico continuo.' },
          { order: 2, name: 'Seal Row o Rematore con appoggio torace', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15-18', restSeconds: 45, effort: '50-60% 1RM (RIR 2)', technique: 'NONE', notes: 'Torace vincolato per azzerare il carico lombare.' },
          { order: 3, name: 'Shoulder press con manubri da seduto', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Gomiti a 45-60° dal busto.' },
          { order: 4, name: 'Pulley al cavo basso con fune', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '15-20', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Apertura delle estremità fune al contatto addominale.' },
          { order: 5, name: 'Superset: Pushdown cavo + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '15+15', restSeconds: 60, effort: 'Medio-Leggero', technique: 'SUPERSET', notes: 'Esecuzione continua tra i due esercizi.' },
          { order: 6, name: 'Cardio LISS Tapis Roulant inclinato', targetMuscle: 'Cardio Defaticante', segment: 'METABOLICO', sets: 1, reps: '10-12 min', restSeconds: 0, effort: 'LISS', technique: 'NONE', notes: 'Pendenza 4-5%, camminata costante senza corsa.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Body M-E (Accosciata Guidata & Catena Posteriore)',
        sessionFocus: 'Alta densità arti inferiori a basso impatto',
        exercises: [
          { order: 1, name: 'Goblet Squat o Box Squat con manubrio', targetMuscle: 'Quadricipiti/Glutei', segment: 'NEURALE', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Seduta al box a 90° per eliminare forze di taglio sul ginocchio.' },
          { order: 2, name: 'Stacco Rumeno con manubri (Dumbbell RDL)', targetMuscle: 'Ischiocrurali/Glutei', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '50-55% 1RM', technique: 'NONE', notes: 'Focus su allungamento femorali e schiena neutra.' },
          { order: 3, name: 'Leg press orizzontale a piedi distanziati', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '18-20', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Profondità controllata senza stacco del bacino.' },
          { order: 4, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'METABOLICO', sets: 3, reps: '15-18', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Cadenza 2-0-2 a tensione costante.' },
          { order: 5, name: 'Calf raise seduto', targetMuscle: 'Soleo', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 30, effort: 'Medio-Leggero', technique: 'NONE', notes: 'Fermo di 1s in massimo allungamento.' },
          { order: 6, name: 'Pallof Press al cavo', targetMuscle: 'Core Anti-Rotazione', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cavo Medio', technique: 'NONE', notes: 'Bacino e spalle bloccati, zero torsioni.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Upper Body M-E (Densità & Drenaggio)',
        sessionFocus: 'Richiamo tronco a stimolo metabolico',
        exercises: [
          { order: 1, name: 'Spinte manubri panca a 30° presa neutra', targetMuscle: 'Petto', segment: 'NEURALE', sets: 3, reps: '15-18', restSeconds: 45, effort: '50-60% 1RM', technique: 'NONE', notes: 'Gomiti a 45°, tutela spalla.' },
          { order: 2, name: 'Lat machine presa a triangolo o inversa', targetMuscle: 'Dorso Basso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Trazione verticale solida.' },
          { order: 3, name: 'Alzate laterali con manubri leggeri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Controllo della discesa in 2s.' },
          { order: 4, name: 'Pulley orizzontale a presa larga', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 45, effort: '50% 1RM', technique: 'NONE', notes: 'Apertura toracica.' },
          { order: 5, name: 'French press ai cavi + Curl corda', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '15+15', restSeconds: 60, effort: 'Medio-Leggero', technique: 'SUPERSET', notes: 'Super-serie di pompaggio braccia.' },
          { order: 6, name: 'Cyclette orizzontale decongestionante', targetMuscle: 'Cardio', segment: 'METABOLICO', sets: 1, reps: '10 min', restSeconds: 0, effort: 'Costante 65 RPM', technique: 'NONE', notes: 'Ritorno venoso attivo.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Body M-E (Glutei, Catena Posteriore & Core)',
        sessionFocus: 'Tono arti inferiori senza carichi compressivi',
        exercises: [
          { order: 1, name: 'Leg press a 45° a piedi alti', targetMuscle: 'Gambe/Glutei', segment: 'NEURALE', sets: 3, reps: '18-20', restSeconds: 60, effort: '50% 1RM', technique: 'NONE', notes: 'Spinta sui talloni, zero carico sulla schiena.' },
          { order: 2, name: 'Glute bridge a terra o panca con manubrio', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '15-18', restSeconds: 45, effort: 'Medio', technique: 'NONE', notes: 'Fermo 2s in alto.' },
          { order: 3, name: 'Step up controllato su panca', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Discesa lenta.' },
          { order: 4, name: 'Leg extension a tensione continua', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15-18', restSeconds: 45, effort: '45% 1RM', technique: 'NONE', notes: 'Isolamento finale.' },
          { order: 5, name: 'Calf raise alla pressa orizzontale', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 30, effort: 'Medio', technique: 'NONE', notes: 'Allungamento profondo.' },
          { order: 6, name: 'Dead Bug a terra con controllo lombare', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Schiena incollata al tappetino.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. BOMPA-O40-03: Ibrido MxS Mantenimento & Circuito M-E - Full Body
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-03',
    title: 'Ibrido MxS Mantenimento & Circuito M-E (Tudor Bompa)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Protocollo ibrido Tudor Bompa: Blocco 1 Neurale a carichi pesanti (75-80% 1RM, RIR 2) per densità ossea e forza + Blocco 2 in Triset M-E continuo per tono e dispendio calorico.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Seduta A: Focus Anca & Spinta (Neurale + Triset M-E)',
        sessionFocus: 'Blocco 1 Neurale MxS + Blocco 2 Triset M-E continuo',
        exercises: [
          { order: 1, name: 'Hip Thrust con bilanciere o multipower', targetMuscle: 'Glutei / Neurale', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: '75-80% 1RM (RIR 2)', technique: 'NONE', notes: 'Buffer RIR 2 fisso, fermo 1s in massima estensione anca.' },
          { order: 2, name: 'Affondi camminati con manubri', targetMuscle: 'Triset Esercizio 1', segment: 'MECCANICO', sets: 3, reps: '12 passi/gamba', restSeconds: 0, effort: 'Manubri Leggeri', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 3, name: 'Spinte manubri su panca piana', targetMuscle: 'Triset Esercizio 2', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 0, effort: '50% 1RM', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 4, name: 'Lat pulldown presa prona', targetMuscle: 'Triset Esercizio 3', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 90, effort: '50% 1RM', technique: 'TRISET', notes: 'Recupero 90" a fine triset; completare 3 round.' }
        ]
      },
      {
        dayLabel: 'Seduta B: Focus Ginocchio & Trazione (Neurale + Triset M-E)',
        sessionFocus: 'Blocco 1 Neurale MxS + Blocco 2 Triset M-E continuo',
        exercises: [
          { order: 1, name: 'Leg Press 45° o Box Squat guidato', targetMuscle: 'Quadricipiti / Neurale', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: '75-80% 1RM (RIR 2)', technique: 'NONE', notes: 'Buffer RIR 2, discesa in 3s controllata.' },
          { order: 2, name: 'Stacco Rumeno con manubri', targetMuscle: 'Triset Esercizio 1', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 0, effort: '50% 1RM', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 3, name: 'Shoulder press machine guidata', targetMuscle: 'Triset Esercizio 2', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 0, effort: '50% 1RM', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 4, name: 'Pulley presa neutra orizzontale', targetMuscle: 'Triset Esercizio 3', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 90, effort: '50% 1RM', technique: 'TRISET', notes: 'Recupero 90" a fine triset; completare 3 round.' }
        ]
      },
      {
        dayLabel: 'Seduta C: Focus Neurale Upper & Tono Lower (Neurale + Triset)',
        sessionFocus: 'Blocco 1 Neurale MxS + Blocco 2 Triset M-E continuo',
        exercises: [
          { order: 1, name: 'Lat Machine al petto o Trazioni assistite', targetMuscle: 'Dorso / Neurale', segment: 'NEURALE', sets: 4, reps: '6', restSeconds: 150, effort: '75-80% 1RM (RIR 2)', technique: 'NONE', notes: 'Buffer RIR 2, massima traiettoria verticale.' },
          { order: 2, name: 'Goblet Squat (fermo 1s in accosciata)', targetMuscle: 'Triset Esercizio 1', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 0, effort: 'Medio', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 3, name: 'Push-up su panca inclinata o rialzo', targetMuscle: 'Triset Esercizio 2', segment: 'MECCANICO', sets: 3, reps: '12-15', restSeconds: 0, effort: 'Corpo Libero', technique: 'TRISET', notes: 'Transizione immediata al successivo.' },
          { order: 4, name: 'Abductor machine (busto flesso avanti)', targetMuscle: 'Triset Esercizio 3', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 90, effort: 'Medio-Leggero', technique: 'TRISET', notes: 'Recupero 90" a fine triset; completare 3 round.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. BOMPA-O40-04: Split Agonisti / Antagonisti ad Alta Densità
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-04',
    title: 'Split Agonisti / Antagonisti ad Alta Densità (Tudor Bompa)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Super-coppie antagoniste a recupero sfalsato (30" e 60"): massimo stimolo cardiovascolare continuo senza affaticamento neurale periferico.',
    generateSessions: (): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Torso Push / Pull (Coppie Antagoniste A-B-C)',
        sessionFocus: 'Super-coppie antagoniste ad alta densità',
        exercises: [
          { order: 1, name: 'A1. Spinte su panca inclinata con manubri', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 30, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa ad A2 dopo 30".' },
          { order: 2, name: 'A2. Lat Machine presa inversa stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia A.' },
          { order: 3, name: 'B1. Chest Press orizzontale guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 30, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a B2 dopo 30".' },
          { order: 4, name: 'B2. Rematore con manubrio singolo su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15 per lato', restSeconds: 60, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia B.' },
          { order: 5, name: 'C1. Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 30, effort: 'Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a C2 dopo 30".' },
          { order: 6, name: 'C2. Face Pull ai cavi per deltoidi posteriori', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 60, effort: 'Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia C.' },
          { order: 7, name: 'Crunch su fitball con retroversione bacino', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Massima espirazione e chiusura costale.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Lower Quad / Hamstrings (Coppie Antagoniste A-B-C)',
        sessionFocus: 'Super-coppie antagoniste gambe e catena posteriore',
        exercises: [
          { order: 1, name: 'A1. Leg Press 45° o orizzontale', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 3, reps: '12-15', restSeconds: 45, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa ad A2 dopo 45".' },
          { order: 2, name: 'A2. Stacco Rumeno (RDL) con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia A.' },
          { order: 3, name: 'B1. Split Squat bulgaro a corpo libero', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 30, effort: 'Corpo Libero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a B2 dopo 30".' },
          { order: 4, name: 'B2. Leg Curl seduto o prono', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia B.' },
          { order: 5, name: 'C1. Leg Extension a cadenza frenata (3s ecc)', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 30, effort: 'Medio-Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a C2 dopo 30".' },
          { order: 6, name: 'C2. Glute Bridge a terra con carico', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '18-20', restSeconds: 60, effort: 'Disco/Manubrio', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti la coppia C.' },
          { order: 7, name: 'Decongestione Cyclette orizzontale', targetMuscle: 'Cardio', segment: 'METABOLICO', sets: 1, reps: '12 min', restSeconds: 0, effort: '65 RPM', technique: 'NONE', notes: 'Recupero attivo e smaltimento metabolico.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Torso Push / Pull 2 (Richiamo Antagonista)',
        sessionFocus: 'Super-coppie parte superiore a stimolo denso',
        exercises: [
          { order: 1, name: 'A1. Spinte su panca inclinata con manubri', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 30, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa ad A2 dopo 30".' },
          { order: 2, name: 'A2. Lat Machine presa inversa stretta', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 3, name: 'B1. Chest Press orizzontale guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 30, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a B2 dopo 30".' },
          { order: 4, name: 'B2. Rematore con manubrio su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15 per lato', restSeconds: 60, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 5, name: 'C1. Alzate laterali con manubri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 30, effort: 'Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a C2 dopo 30".' },
          { order: 6, name: 'C2. Face Pull ai cavi per deltoidi posteriori', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15-20', restSeconds: 60, effort: 'Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 7, name: 'Crunch su fitball con retroversione', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Espirazione profonda.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Lower Quad / Hamstrings 2 (Richiamo Antagonista)',
        sessionFocus: 'Super-coppie arti inferiori a stimolo vascolare',
        exercises: [
          { order: 1, name: 'A1. Leg Press 45° o orizzontale', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 3, reps: '12-15', restSeconds: 45, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa ad A2 dopo 45".' },
          { order: 2, name: 'A2. Stacco Rumeno (RDL) con manubri', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: '60% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 3, name: 'B1. Split Squat bulgaro a corpo libero', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 30, effort: 'Corpo Libero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a B2 dopo 30".' },
          { order: 4, name: 'B2. Leg Curl seduto o prono', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: '55% 1RM', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 5, name: 'C1. Leg Extension a cadenza frenata (3s ecc)', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 30, effort: 'Medio-Leggero', technique: 'SUPERSET_ANTAGONISTA', notes: 'Passa a C2 dopo 30".' },
          { order: 6, name: 'C2. Glute Bridge a terra con carico', targetMuscle: 'Glutei', segment: 'METABOLICO', sets: 3, reps: '18-20', restSeconds: 60, effort: 'Disco/Manubrio', technique: 'SUPERSET_ANTAGONISTA', notes: 'Riposa 60" e ripeti.' },
          { order: 7, name: 'Decongestione Cyclette orizzontale', targetMuscle: 'Cardio', segment: 'METABOLICO', sets: 1, reps: '12 min', restSeconds: 0, effort: '65 RPM', technique: 'NONE', notes: 'Smaltimento lattato attivo.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. BOMPA-O40-05: Full Body Step-Loading 3:1 a Carico Ondulato
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-05',
    title: 'Full Body Step-Loading 3:1 a Carico Ondulato (Tudor Bompa)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Progressione a onde 3:1 (Sett 1: 3x15 50%, Sett 2: 4x15 55%, Sett 3: 4x12-14 60%, Sett 4: 2x12 45% Deload). Prevenzione sistematica dello stallo e dell\'overtraining.',
    generateSessions: (): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Full Body Step-Loading A',
        sessionFocus: 'Box Squat, Trazione Neutra, Panca Manubri & Core',
        exercises: [
          { order: 1, name: 'Box Squat su panca (seduta a 90°)', targetMuscle: 'Quadricipiti/Glutei', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Zero forze di taglio rotulee, spinta dai talloni.' },
          { order: 2, name: 'Lat Pulldown presa neutra a triangolo', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Traiettoria salva-spalle, torace alto.' },
          { order: 3, name: 'Panca piana con manubri (gomiti a 45°)', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Arresto del manubrio all\'altezza dello sterno.' },
          { order: 4, name: 'Stacco Rumeno con manubri o bilanciere', targetMuscle: 'Catena Posteriore', segment: 'MECCANICO', sets: 4, reps: '10-12', restSeconds: 75, effort: '55-60% 1RM', technique: 'STEP_LOADING', notes: 'Apertura scapolare e mantenimento curve fisiologiche.' },
          { order: 5, name: 'Alzate laterali al cavo o manubri leggeri', targetMuscle: 'Deltoidi', segment: 'METABOLICO', sets: 4, reps: '12-15', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Esecuzione pulita senza compensi lombari.' },
          { order: 6, name: 'Dead Bug a terra', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Rachide lombare perfettamente aderente al suolo.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Full Body Step-Loading B',
        sessionFocus: 'Leg Press, Rematore Appoggio, Chest Press & Femorali',
        exercises: [
          { order: 1, name: 'Leg press a 45° a piedi paralleli', targetMuscle: 'Gambe', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Discesa controllata senza rimbalzo.' },
          { order: 2, name: 'Rematore con appoggio torace su panca', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Schiena completamente scarica.' },
          { order: 3, name: 'Chest press convergente guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Tensione continua.' },
          { order: 4, name: 'Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '12', restSeconds: 60, effort: '50% 1RM', technique: 'STEP_LOADING', notes: 'Cadenza 2-0-2.' },
          { order: 5, name: 'Pulley al cavo basso con fune', targetMuscle: 'Deltoidi Posteriori / Schiena', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Apertura fune allo sterno.' },
          { order: 6, name: 'Plank su panca', targetMuscle: 'Core', segment: 'METABOLICO', sets: 3, reps: '40s', restSeconds: 45, effort: 'Isometrico', technique: 'NONE', notes: 'Addome compatto.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Full Body Step-Loading C',
        sessionFocus: 'Goblet Squat, Lat Presa Larga, Spinte 30° & Hyperextension',
        exercises: [
          { order: 1, name: 'Box Squat o Goblet Squat controllato', targetMuscle: 'Quadricipiti', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Controllo della profondità.' },
          { order: 2, name: 'Lat Pulldown presa prona media', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Trazione verticale continua.' },
          { order: 3, name: 'Spinte manubri panca a 30°', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: '50-60% 1RM', technique: 'STEP_LOADING', notes: 'Gomiti a 45° dal busto.' },
          { order: 4, name: 'Hyperextension su panca a 45°', targetMuscle: 'Glutei/Catena Posteriore', segment: 'MECCANICO', sets: 4, reps: '15', restSeconds: 60, effort: 'Corpo Libero', technique: 'STEP_LOADING', notes: 'Movimento fluido senza slanci.' },
          { order: 5, name: 'Face pull ai cavi alti', targetMuscle: 'Extrarotatori Spalla', segment: 'METABOLICO', sets: 4, reps: '15', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Spalle aperte e depresse.' },
          { order: 6, name: 'Pallof press al cavo', targetMuscle: 'Core Anti-Rotazione', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 45, effort: 'Medio', technique: 'NONE', notes: 'Resistenza alla torsione.' }
        ]
      }
    ]
  }
];