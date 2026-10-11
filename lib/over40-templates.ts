import { TemplateMeta, TemplateSession, Gender } from './topgym-catalog';

export const BOMPA_OVER40_TEMPLATES: TemplateMeta[] = [
    // --------------------------------------------------------------------------
  // 1. BOMPA-O40-01: Adattamento Anatomico (AA) Circuit - Full Body (Tudor Bompa)
  // --------------------------------------------------------------------------
  {
    id: 'BOMPA-O40-01',
    title: 'Adattamento Anatomico (AA) Circuit - Full Body (Tudor Bompa)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Vero circuito a stazioni Bompa: 3 giorni differenziati (A-B-C). 1 serie per stazione, 30" di cambio postazione, 2 minuti di pausa a fine giro (3 giri totali). Massima tutela tendinea.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Circuito AA - Variante A (Spinta & Dominanza Ginocchio)',
        sessionFocus: 'CIRCUITO 9 STAZIONI: 3 Giri completi � 30" tra le stazioni � 2 minuti di riposo tra i giri',
        exercises: [
          { order: 1, name: 'Stazione 1: Leg press orizzontale o 45�', targetMuscle: 'Gambe / Spinta', segment: 'NEURALE', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Giro 1-3. Discesa controllata 3s. Passa subito alla Stazione 2 dopo 30".' },
          { order: 2, name: 'Stazione 2: Chest press o spinte manubri panca piana', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Giro 1-3. Presa neutra salva-spalle. Passa alla Stazione 3 dopo 30".' },
          { order: 3, name: 'Stazione 3: Lat pulldown presa prona media', targetMuscle: 'Dorso', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM (RIR 2)', technique: 'CIRCUITO', notes: 'Giro 1-3. Trazione controllata allo sterno. Passa alla Stazione 4 dopo 30".' },
          { order: 4, name: 'Stazione 4: Leg curl seduto a camme', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Tensione continua protetta. Passa alla Stazione 5 dopo 30".' },
          { order: 5, name: 'Stazione 5: Shoulder press con manubri da seduto', targetMuscle: 'Deltoidi', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '35-40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Schienale inclinato a 75� per scarico lombare. Passa alla Stazione 6.' },
          { order: 6, name: 'Stazione 6: Pulley orizzontale con maniglia a V', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Fermo 1s in massima adduzione scapolare. Passa alla Stazione 7.' },
          { order: 7, name: 'Stazione 7: Calf raise in piedi o seduto', targetMuscle: 'Polpacci', segment: 'METABOLICO', sets: 3, reps: '15-20 reps', restSeconds: 30, effort: 'Medio-leggero', technique: 'CIRCUITO', notes: 'Giro 1-3. Pausa 1s in allungamento. Ritorno venoso. Passa alla Stazione 8.' },
          { order: 8, name: 'Stazione 8: Hyperextension su panca a 45�', targetMuscle: 'Catena Posteriore', segment: 'METABOLICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Giro 1-3. Cerniera d\'anca senza iperestensione lombare. Passa alla Stazione 9.' },
          { order: 9, name: 'Stazione 9: Plank isometrico a terra o su panca', targetMuscle: 'Core Stabilit�', segment: 'METABOLICO', sets: 3, reps: '40-45s', restSeconds: 120, effort: 'Isometrico', technique: 'CIRCUITO', notes: 'Fine Giro! Riposa 2 minuti completi, poi ricomincia dalla Stazione 1 (3 Giri totali).' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Circuito AA - Variante B (Cerniera d\'Anca & Trazione Posturale)',
        sessionFocus: 'CIRCUITO 9 STAZIONI: 3 Giri completi � 30" tra le stazioni � 2 minuti di riposo tra i giri',
        exercises: [
          { order: 1, name: 'Stazione 1: Goblet Box Squat su panca (seduta a 90�)', targetMuscle: 'Quadricipiti/Glutei', segment: 'NEURALE', sets: 3, reps: '15 reps', restSeconds: 30, effort: 'Medio (RIR 2)', technique: 'CIRCUITO', notes: 'Giro 1-3. Zero forze di taglio rotulee. Passa alla Stazione 2 dopo 30".' },
          { order: 2, name: 'Stazione 2: Stacco Rumeno con manubri (Dumbbell RDL)', targetMuscle: 'Ischiocrurali/Glutei', segment: 'MECCANICO', sets: 3, reps: '12-15 reps', restSeconds: 30, effort: '45-50% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Focus cerniera d\'anca e schiena neutra. Passa alla Stazione 3 dopo 30".' },
          { order: 3, name: 'Stazione 3: Spinte manubri su panca a 30� presa semi-neutra', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Gomiti a 45� per salvaguardia cuffia rotatori. Passa alla Stazione 4.' },
          { order: 4, name: 'Stazione 4: Pulley orizzontale a presa larga', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Apertura toracica e depressione scapolare. Passa alla Stazione 5.' },
          { order: 5, name: 'Stazione 5: Step-Up alternato su panca bassa o box', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 30, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Giro 1-3. Spinta solo sul tallone della gamba alta. Passa alla Stazione 6.' },
          { order: 6, name: 'Stazione 6: Alzate laterali con manubri leggeri', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: 'Leggero', technique: 'CIRCUITO', notes: 'Giro 1-3. Controllo eccentrico continuo. Passa alla Stazione 7.' },
          { order: 7, name: 'Stazione 7: Abductor machine su 3 inclinazioni', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '20 reps', restSeconds: 30, effort: 'Medio-leggero', technique: 'CIRCUITO', notes: 'Giro 1-3. Stabilizzatori anca e bacino. Passa alla Stazione 8.' },
          { order: 8, name: 'Stazione 8: Superset braccia: Pushdown cavi + Curl manubri', targetMuscle: 'Braccia', segment: 'METABOLICO', sets: 3, reps: '12+12 reps', restSeconds: 30, effort: 'Leggero', technique: 'CIRCUITO', notes: 'Giro 1-3. Tonificazione braccia senza sovraccarico. Passa alla Stazione 9.' },
          { order: 9, name: 'Stazione 9: Dead Bug a terra (schiena aderente)', targetMuscle: 'Core & Colonna Neutra', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 120, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Fine Giro! Riposa 2 minuti completi, poi ricomincia dalla Stazione 1 (3 Giri totali).' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Circuito AA - Variante C (Drenaggio Vascolare & Catena Posteriore)',
        sessionFocus: 'CIRCUITO 9 STAZIONI: 3 Giri completi � 30" tra le stazioni � 2 minuti di riposo tra i giri',
        exercises: [
          { order: 1, name: 'Stazione 1: Leg press orizzontale a piedi larghi e alti', targetMuscle: 'Adduttori / Glutei', segment: 'NEURALE', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Spinta sui talloni, bacino incollato allo schienale. Passa alla Stazione 2.' },
          { order: 2, name: 'Stazione 2: Lat pulldown presa inversa stretta', targetMuscle: 'Dorso Basso / Bicipiti', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '45% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Traiettoria verticale salva-spalle. Passa alla Stazione 3 dopo 30".' },
          { order: 3, name: 'Stazione 3: Chest press convergente guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Movimento fluido senza bloccare i gomiti. Passa alla Stazione 4.' },
          { order: 4, name: 'Stazione 4: Leg extension a cadenza rallentata', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Cadenza 2-0-2 a tensione costante. Passa alla Stazione 5 dopo 30".' },
          { order: 5, name: 'Stazione 5: Face pull ai cavi alti con corda', targetMuscle: 'Deltoidi Posteriori / Postura', segment: 'MECCANICO', sets: 3, reps: '15-18 reps', restSeconds: 30, effort: 'Leggero', technique: 'CIRCUITO', notes: 'Giro 1-3. Rinforzo extrarotatori della cuffia. Passa alla Stazione 6.' },
          { order: 6, name: 'Stazione 6: Glute bridge a terra o su panca con disco', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '15-18 reps', restSeconds: 30, effort: 'Medio', technique: 'CIRCUITO', notes: 'Giro 1-3. Squeeze gluteo di 2 secondi in alto. Passa alla Stazione 7.' },
          { order: 7, name: 'Stazione 7: Rematore su panca inclinata con manubri', targetMuscle: 'Dorso Medio', segment: 'METABOLICO', sets: 3, reps: '15 reps', restSeconds: 30, effort: '40% 1RM', technique: 'CIRCUITO', notes: 'Giro 1-3. Torace in appoggio per azzerare il carico lombare. Passa alla Stazione 8.' },
          { order: 8, name: 'Stazione 8: Calf raise alla pressa o gradino', targetMuscle: 'Polpacci / Pompa Vascolare', segment: 'METABOLICO', sets: 3, reps: '20 reps', restSeconds: 30, effort: 'Medio', technique: 'CIRCUITO', notes: 'Giro 1-3. Ritorno venoso e drenaggio linfatico. Passa alla Stazione 9.' },
          { order: 9, name: 'Stazione 9: Bird-Dog a terra o Plank su panca', targetMuscle: 'Core & Stabilit� Rachide', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 120, effort: 'Corpo Libero', technique: 'CIRCUITO', notes: 'Fine Giro! Riposa 2 minuti completi, poi ricomincia dalla Stazione 1 (3 Giri totali).' }
        ]
      }
    ]
  },

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
  },

  // --------------------------------------------------------------------------
  // 6. SCO-O40-01: Postural Decompression & Pelvic Balance (Scoliosi a "S")
  // --------------------------------------------------------------------------
  {
    id: 'SCO-O40-01',
    title: 'Postural Decompression & Pelvic Balance (Scoliosi a "S" 3 Giorni)',
    group: 'PRINCIPIANTE',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Protocollo specialistico per donna 40 anni con scoliosi destro-toracica e sinistro-lombare. Zero carichi assiali sulla colonna, decompressione attiva, supporto toracico su tutte le tirate e allineamento del cingolo pelvico.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Decompressione Assiale, Spinta Vincolata & Cingolo Pelvico',
        sessionFocus: 'Focus appoggio toracico vincolato, decompressione e attivazione glutei',
        exercises: [
          { order: 1, name: 'Leg press orizzontale a piedi paralleli medi', targetMuscle: 'Quadricipiti/Glutei', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 2 (45-50% 1RM)', technique: 'NONE', notes: 'Bacino e zona lombare incollati allo schienale. Zero stacco sacrale.' },
          { order: 2, name: 'Chest press convergente guidata da seduta', targetMuscle: 'Petto / Spinta', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Schienale a supporto totale, gomiti sotto la linea delle spalle.' },
          { order: 3, name: 'Lat machine presa a triangolo stretta (Focus Allungamento)', targetMuscle: 'Dorso in Decompressione', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Fermo di 2s in massimo allungamento in alto per decomprimere il rachide.' },
          { order: 4, name: 'Glute Bridge su panca con manubrio leggero', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: 'RIR 1-2', technique: 'NONE', notes: 'Squeeze di 2 secondi in alto. Spinta dai talloni per simmetrizzare il bacino.' },
          { order: 5, name: 'Abductor machine (busto eretto aderente)', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 3, reps: '18-20', restSeconds: 45, effort: 'Medio-Leggero', technique: 'NONE', notes: 'Rinforzo degli stabilizzatori pelvici per contrastare il disallineamento lombare.' },
          { order: 6, name: 'Dead Bug con respirazione diaframmatica guidata', targetMuscle: 'Core & Colonna Neutra', segment: 'METABOLICO', sets: 3, reps: '10 per lato', restSeconds: 60, effort: 'Corpo Libero', technique: 'NONE', notes: 'Espirazione forzata: schiaccia la zona lombare al suolo durante la discesa dell\'arto.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Trazione Toracica Scaricata, Ischiocrurali & Anti-Rotazione',
        sessionFocus: 'Focus scarico quadrato dei lombi, simmetria cingolo scapolare e stabilit�',
        exercises: [
          { order: 1, name: 'Seal Row o Rematore con manubri su panca a 30�', targetMuscle: 'Dorso Posturale', segment: 'NEURALE', sets: 4, reps: '12', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Torace incollato allo schienale: ZERO momento flettente sui paraspinali lombari.' },
          { order: 2, name: 'Leg curl seduto a camme guidate', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '12-15', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Protezione assoluta del nervo sciatico e della curva lombare.' },
          { order: 3, name: 'Spinte manubri panca a 30� con presa neutra', targetMuscle: 'Petto Clavicolare', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti a 45� per non creare asimmetrie sulla cuffia dei rotatori.' },
          { order: 4, name: 'Step-Up assistito su rialzo basso (con appoggio mani)', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '12 per gamba', restSeconds: 60, effort: 'Corpo Libero', technique: 'NONE', notes: 'Focus arto inibito: spinta verticale pura senza inclinare il bacino lateralmente.' },
          { order: 5, name: 'Pallof Press al cavo orizzontale da seduta', targetMuscle: 'Core Anti-Rotazione', segment: 'METABOLICO', sets: 3, reps: '12 per lato', restSeconds: 45, effort: 'Cavo Medio', technique: 'NONE', notes: 'Fondamentale per scoliosi: allineamento spalle-bacino contro la forza di torsione.' },
          { order: 6, name: 'Side Plank facilitato su ginocchia (Focus Lato Convesso)', targetMuscle: 'Stabilizzatori Laterali', segment: 'METABOLICO', sets: 3, reps: '30s per lato', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Insistere 5s in pi� sul lato della convessit� lombare sinistra per rinforzo.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Catena Posteriore a Catena Chiusa, Spalle & Drenaggio',
        sessionFocus: 'Focus postura scapolare destra, deltoidi e camminata a scarico lombare',
        exercises: [
          { order: 1, name: 'Leg press a 45� a piedi larghi e schienale inclinato', targetMuscle: 'Glutei / Catena Posteriore', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Supporto lombare massimo. Spinta sui talloni, discesa in 3 secondi controllata.' },
          { order: 2, name: 'Pulley orizzontale al cavo con appoggio piedi alto', targetMuscle: 'Centro Dorso', segment: 'MECCANICO', sets: 4, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Depressione scapolare decisa: contrasta l\'anteposizione della scapola destra.' },
          { order: 3, name: 'Hyperextension su panca a 45� (Range Ridotto)', targetMuscle: 'Glutei/Catena Posteriore', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 60, effort: 'Corpo Libero', technique: 'NONE', notes: 'Cerniera d\'anca pura: fermarsi all\'allineamento del tronco, MAI iperestendere la lordosi.' },
          { order: 4, name: 'Face Pull al cavo alto con corda (Focus Postura)', targetMuscle: 'Deltoidi Posteriori / Extrarotatori', segment: 'METABOLICO', sets: 3, reps: '15-18', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Apertura e derotazione cingolo scapolare.' },
          { order: 5, name: 'Alzate laterali con manubri leggeri da seduta', targetMuscle: 'Deltoidi Laterali', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Schiena appoggiata allo schienale a 80� per annullare i compensi del tronco.' },
          { order: 6, name: 'Cyclette orizzontale (Recline Bike) decongestionante', targetMuscle: 'Cardio Drenante Lombare', segment: 'METABOLICO', sets: 1, reps: '12-15 min', restSeconds: 0, effort: 'Cadenza 65 RPM', technique: 'NONE', notes: 'Schienale anatomico a sostegno lombare: riattiva il microcircolo senza impatti.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. SCO-O40-02: Functional Glute Sculpt & Anti-Rotational Density
  // --------------------------------------------------------------------------
  {
    id: 'SCO-O40-02',
    title: 'Functional Glute Sculpt & Anti-Rotational Density (Scoliosi Sicura)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Programma di rimodellamento glutei e v-taper per donna 40 anni con asimmetria scoliotica: massima enfasi estetica senza alcun carico su colonna e disco intervertebrale.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Sessione A: Glute Hypertrophy a Spinta Antero-Posteriore & Trazione',
        sessionFocus: 'Hip Thrust guidato, Trazione Inversa, Medigluteo & Allungamento',
        exercises: [
          { order: 1, name: 'Hip Thrust al Multipower con cuscino spesso', targetMuscle: 'Glutei Primari', segment: 'NEURALE', sets: 4, reps: '10-12', restSeconds: 90, effort: 'RIR 1-2', technique: 'NONE', notes: 'Vettore di forza orizzontale, ZERO carico assiale. Fermo di 2s in massima contrazione.' },
          { order: 2, name: 'Lat machine presa inversa a larghezza spalle', targetMuscle: 'Dorso Basso / Decompressione', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Gomiti che scorrono lungo il tronco, cassa toracica aperta.' },
          { order: 3, name: 'Affondi posteriori al multipower con passo lungo', targetMuscle: 'Glutei / Monopodalico', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Traiettoria guidata che impedisce sbilanciamenti del bacino scoliotico.' },
          { order: 4, name: 'Abductor machine su 3 inclinazioni (Busto Avanti/Neutro/Dietro)', targetMuscle: 'Medio Gluteo Pompaggio', segment: 'METABOLICO', sets: 4, reps: '20', restSeconds: 45, effort: 'Cedimento Tecnico', technique: 'STRIPPING_DROP_SET', notes: 'Rimodellamento gluteo alto e stabilizzazione bacino. Drop set all\'ultima serie.' },
          { order: 5, name: 'Croci ai cavi su panca a 30� per petto snello', targetMuscle: 'Petto / Postura', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'Leggero', technique: 'NONE', notes: 'Allungamento pettorale per contrastare le spalle chiuse.' },
          { order: 6, name: 'Bird-Dog a terra con fermo isometrico di 3 secondi', targetMuscle: 'Core & Multifido Asimmetrico', segment: 'METABOLICO', sets: 3, reps: '8 per lato', restSeconds: 45, effort: 'Corpo Libero', technique: 'NONE', notes: 'Estendi braccio e gamba opposti senza ruotare il bacino. Stabilit� profonda.' }
        ]
      },
      {
        dayLabel: 'Sessione B: Upper V-Taper, Deltoidi Sagomati & Core Anti-Flessione',
        sessionFocus: 'Schiena a V per assottigliare il punto vita senza toccare la colonna',
        exercises: [
          { order: 1, name: 'Row convergente guidato con supporto toracico', targetMuscle: 'Dorso / Spessore', segment: 'NEURALE', sets: 4, reps: '10-12', restSeconds: 75, effort: 'RIR 1-2', technique: 'NONE', notes: 'Impugnatura neutra. Schiena lombare totalmente neutra e scarica.' },
          { order: 2, name: 'Spinte con manubri su panca a 45� da seduta', targetMuscle: 'Deltoidi Anteriori / Petto Alto', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta fluida con gomiti controllati.' },
          { order: 3, name: 'Alzate laterali al cavo singolo dietro la schiena', targetMuscle: 'Deltoidi Laterali', segment: 'MECCANICO', sets: 4, reps: '12-15 per lato', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Tensione continua al picco: deltoidi rotondi per dare illusione di vita sottile.' },
          { order: 4, name: 'Pulley basso con fune allo sterno (Gomiti Larghi)', targetMuscle: 'Deltoidi Posteriori / Romboidi', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Apertura toracica ad ogni tirata.' },
          { order: 5, name: 'Superset braccia: Pushdown cavo + Curl manubri seduta', targetMuscle: 'Braccia Tonicit�', segment: 'METABOLICO', sets: 3, reps: '12+12', restSeconds: 60, effort: 'Medio', technique: 'SUPERSET', notes: 'Tonificazione braccia snelle senza affaticamento sistemico.' },
          { order: 6, name: 'Side Plank con appoggio sul gomito (Core Anti-Flessione)', targetMuscle: 'Obliqui & Trasverso', segment: 'METABOLICO', sets: 3, reps: '35s per lato', restSeconds: 45, effort: 'Isometrico', technique: 'NONE', notes: 'Rinforzo della parete addominale per sostenere la colonna curva.' }
        ]
      },
      {
        dayLabel: 'Sessione C: Lower Posterior Chain, Glute Pump & Decompressione',
        sessionFocus: 'Femorali isolati, glutei ad alta ripetizione e camminata in salita LISS',
        exercises: [
          { order: 1, name: 'Leg press orizzontale a piedi alti e uniti', targetMuscle: 'Glutei / Ischiocrurali', segment: 'NEURALE', sets: 4, reps: '12-15', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'Spinta potente sui talloni. Protezione discale totale.' },
          { order: 2, name: 'Slanci al cavo basso gamba tesa (Cable Kickback)', targetMuscle: 'Gluteo Alto', segment: 'MECCANICO', sets: 3, reps: '15 per gamba', restSeconds: 45, effort: 'Cedimento', technique: 'NONE', notes: 'Isolamento puro: busto flesso a 45� con appoggio mani sulla colonna del cavo.' },
          { order: 3, name: 'Leg curl seduto a tensione continua (Discesa 3s)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 4, reps: '12', restSeconds: 60, effort: 'RIR 1-2', technique: 'NONE', notes: 'Cadenza 3-0-1 per reclutare i flessori senza sollecitare il bacino.' },
          { order: 4, name: 'Glute bridge a terra a corpo libero (High Reps Finisher)', targetMuscle: 'Glutei Pompa Metabolica', segment: 'METABOLICO', sets: 3, reps: '25-30', restSeconds: 30, effort: 'Bruciore Puro', technique: 'NONE', notes: 'Esaurimento lattacido a zero carico vertebrale. Squeeze continuo.' },
          { order: 5, name: 'Calf raise alla pressa orizzontale', targetMuscle: 'Polpacci / Drenaggio', segment: 'METABOLICO', sets: 3, reps: '20', restSeconds: 30, effort: 'Medio', technique: 'NONE', notes: 'Fermo 2s in allungamento per favorire il ritorno venoso.' },
          { order: 6, name: 'Tapis Roulant camminata in salita moderata (LISS)', targetMuscle: 'Cardio Drenante / Decompressione', segment: 'METABOLICO', sets: 1, reps: '15 min', restSeconds: 0, effort: 'Pendenza 6-8%, Velocit� 4.5 km/h', technique: 'NONE', notes: 'Camminata fluida a schiena allungata: scarica la colonna e favorisce il consumo di lipidi.' }
        ]
      }
    ]
  },


  // --------------------------------------------------------------------------
  // TEMPLATE 1: TRADIZIONALE 3 GIORNI (UPPER / LOWER / FULL BODY) - SCOLIOSI
  // --------------------------------------------------------------------------
  {
    id: 'SCO-TRAD-3D',
    title: 'Scoliosi Tradizionale 3 Giorni (Upper / Lower / Full Body)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Protocollo asimmetrico correttivo a decompressione assiale per scoliosi destro-toracica e sinistro-lombare. Focus trazione asimmetrica, Schroth-modificato e zero compressione discale.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Giorno A: Upper Body (Focus Verticale) + Core',
        sessionFocus: 'Warm-up Sospensione + Tirata Asimmetrica & Stabilizzazione Scapolare',
        exercises: [
          { order: 1, name: 'Sospensione asimmetrica sbarra + Allungamento quadrupedia', targetMuscle: 'Decompressione Toracica', segment: 'NEURALE', sets: 3, reps: '30s scarico SX', restSeconds: 45, effort: 'Warm-up Attivo', technique: 'DECOMPRESSIONE', notes: 'Warm-up: peso scaricato prevalentemente a SX per aprire la concavit� toracica. Allungamento in quadrupedia.' },
          { order: 2, name: 'Lat Machine singola (Maniglia a D)', targetMuscle: 'Gran Dorsale Asimmetrico', segment: 'NEURALE', sets: 3, reps: '10-12 (+1 serie DX)', restSeconds: 60, effort: 'RIR 1-2', technique: 'ASIMMETRICO', notes: 'SX: allungamento estremo in risalita. DX: isometria 2" in chiusura. Eseguire +1 serie extra SOLO braccio DX.' },
          { order: 3, name: 'Chest Press guidata', targetMuscle: 'Petto / Spinta Tronco', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 75, effort: 'RIR 2', technique: 'NONE', notes: 'La macchina stabilizza il tronco. Focus: schiacciare bene la scapola destra contro lo schienale prima di spingere, per pareggiare il gibbo.' },
          { order: 4, name: 'Pulldown a braccia tese cavo singolo', targetMuscle: 'Dorsale / Postura', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 60, effort: 'RIR 1', technique: 'NONE', notes: 'Traiettoria a braccio teso controllata per stabilit� e reclutamento del gran dorsale.' },
          { order: 5, name: 'Pec Fly Rear Delt (Macchina deltoidi posteriori)', targetMuscle: 'Deltoidi Posteriori / Romboidi', segment: 'METABOLICO', sets: 3, reps: '12-15', restSeconds: 60, effort: 'Cedimento Tecnico', technique: 'ASIMMETRICO', notes: 'Lavora monolaterale o concentrati a strizzare fortissimo la spalla DESTRA per accorciare i romboidi stirati.' },
          { order: 6, name: 'Pallof Press in Ginocchio (Half-Kneeling)', targetMuscle: 'Core Anti-Rotazione', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 45, effort: 'Controllo Puro', technique: 'ANTI_ROTAZIONE', notes: 'Ginocchio SX a terra, resistenza del cavo proveniente da DESTRA.' }
        ]
      },
      {
        dayLabel: 'Giorno B: Lower Body (Zero Compressione) + Core',
        sessionFocus: 'Warm-up Gamba Inibita + Spinta Unilaterale & Glutei Senza Carico Lombare',
        exercises: [
          { order: 1, name: 'Abductor machine (Pre-attivazione medio gluteo)', targetMuscle: 'Medio Gluteo', segment: 'NEURALE', sets: 2, reps: '15', restSeconds: 45, effort: 'Pre-Attivazione', technique: 'ISOLAMENTO', notes: 'Warm-up: solo gamba inibita per pre-attivazione e stabilizzazione pelvica.' },
          { order: 2, name: 'Leg Press a 1 gamba (Singola)', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8-10 per lato', restSeconds: 75, effort: 'RIR 2', technique: 'UNILATERALE', notes: 'Schienale ben saldo, bacino incollato. Spinta controllata senza torsioni.' },
          { order: 3, name: 'Affondi Indietro (Reverse Lunge) LIBERI con manubri', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Senza Multipower: liberi per assecondare la mobilit� asimmetrica del bacino.' },
          { order: 4, name: 'Gluteus Machine guidata', targetMuscle: 'Grande Gluteo', segment: 'MECCANICO', sets: 4, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 1-2', technique: 'ISOLAMENTO', notes: 'Sostituisce lo stacco: isola il grande gluteo senza il minimo carico sulla zona lombare.' },
          { order: 5, name: 'Leg Extension Singola', targetMuscle: 'Quadricipiti', segment: 'METABOLICO', sets: 3, reps: '12 per gamba', restSeconds: 45, effort: 'RIR 1', technique: 'UNILATERALE', notes: 'Tensione continua e controllo eccentrico della discesa.' },
          { order: 6, name: 'Side Plank Schroth-Modificato', targetMuscle: 'Core Asimmetrico', segment: 'METABOLICO', sets: 3, reps: '40s', restSeconds: 45, effort: 'Isometrico', technique: 'SCHROTH', notes: 'Appoggio SOLO sul gomito DESTRO. Braccio SX oltre la testa, respiro diaframmatico a sinistra.' }
        ]
      },
      {
        dayLabel: 'Giorno C: Full Body (Tirata Orizzontale + Femorali)',
        sessionFocus: 'Rematore Asimmetrico, B-Stance, Face Pull & Dead Bug al Cavo',
        exercises: [
          { order: 1, name: 'Rematore 1 manubrio su panca', targetMuscle: 'Dorso Posturale', segment: 'NEURALE', sets: 4, reps: '8-10 (+1 serie DX)', restSeconds: 75, effort: 'RIR 1-2', technique: 'ASIMMETRICO', notes: 'SX: massima protrazione in discesa. DX: massima retrazione e isometria. Eseguire +1 serie extra SOLO braccio DX.' },
          { order: 2, name: 'Ponte Glutei B-Stance a terra', targetMuscle: 'Glutei / Bacino', segment: 'MECCANICO', sets: 4, reps: '12 per gamba', restSeconds: 60, effort: 'RIR 1', technique: 'B_STANCE', notes: 'Schiena a terra, una gamba spinge, l\'altra appoggia solo il tallone per equilibrio.' },
          { order: 3, name: 'Face Pull Asimmetrico al cavo', targetMuscle: 'Deltoidi Posteriori / Spalla', segment: 'MECCANICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'ASIMMETRICO', notes: 'Tirare pi� indietro col braccio DX per correggere l\'anteriorizzazione della spalla.' },
          { order: 4, name: 'Seated Leg Curl Unilaterale', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 1-2', technique: 'UNILATERALE', notes: 'Da seduto disattiva lo psoas e non inarca la lombare.' },
          { order: 5, name: 'Dead Bug Asimmetrico al cavo', targetMuscle: 'Core Integrato', segment: 'METABOLICO', sets: 3, reps: '10 estensioni', restSeconds: 45, effort: 'Controllo Totale', technique: 'ASIMMETRICO', notes: 'Cavo basso dietro la testa che tira indietro SOLO il braccio SINISTRO.' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TEMPLATE 2: A CIRCUITO 3 GIORNI (FUNCTIONAL / POSTURALE) - SCOLIOSI
  // --------------------------------------------------------------------------
  {
    id: 'SCO-CIRC-3D',
    title: 'Scoliosi a Circuito Funzionale & Posturale (3 Giorni)',
    group: 'INTERMEDIO',
    daysCount: 3,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Circuito a tempo 4-5 Round (40" ON / 20" OFF). Circuito A su catena anteriore e anti-rotazione, Circuito B su catena posteriore e anti-flessione. Compensazione posturale dinamica.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Circuito A (Catena Anteriore & Anti-Rotazione)',
        sessionFocus: '4-5 Round � 40" Lavoro / 20" Recupero � 2 minuti di riposo a fine round',
        exercises: [
          { order: 1, name: 'Bulgarian Split Squat 1 manubrio (Offset)', targetMuscle: 'Gambe Monopodalico', segment: 'NEURALE', sets: 4, reps: '40s', restSeconds: 20, effort: 'Medio', technique: 'CIRCUITO_OFFSET', notes: 'Manubrio tenuto solo dal lato della gamba inibita per contrastare lo sbilanciamento del bacino.' },
          { order: 2, name: 'Rematore al TRX / Cavo (1 braccio)', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Controllo', technique: 'CIRCUITO_ASIMMETRICO', notes: '40" solo a DX (isometria). Nel round successivo 40" solo a SX (allungamento).' },
          { order: 3, name: 'Pallof Press Isometrico in ginocchio (Cavo da DX)', targetMuscle: 'Core Anti-Rotazione', segment: 'MECCANICO', sets: 4, reps: '40s tenuta statica', restSeconds: 20, effort: 'Isometrico', technique: 'CIRCUITO_ISOMETRIA', notes: 'Tenuta statica 40" con resistenza del cavo da destra.' },
          { order: 4, name: 'Chest Press a macchina', targetMuscle: 'Petto / Cingolo Scapolare', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Controllato', technique: 'CIRCUITO_GUIDATO', notes: '40" controllati, focus sul blocco della scapola destra sullo schienale (sostituisce i push-up).' },
          { order: 5, name: 'Suitcase Carry (Camminata del contadino unilaterale)', targetMuscle: 'Quadrato dei Lombi / Core', segment: 'METABOLICO', sets: 4, reps: '40s', restSeconds: 120, effort: 'Pesante SX', technique: 'CIRCUITO_UNILATERALE', notes: 'Carico pesante solo mano SINISTRA per attivazione riflessa QL destro. Fine round: riposo 2 minuti!' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Circuito B (Catena Posteriore & Anti-Flessione)',
        sessionFocus: '4-5 Round � 40" Lavoro / 20" Recupero � 2 minuti di riposo a fine round',
        exercises: [
          { order: 1, name: 'Step-Up lento su panca liberi', targetMuscle: 'Gambe / Glutei', segment: 'NEURALE', sets: 4, reps: '40s', restSeconds: 20, effort: 'Cadenza Controllata', technique: 'CIRCUITO_MONOPODALICO', notes: 'Discesa eccentrica controllata, spinta solo sul tallone della gamba alta.' },
          { order: 2, name: 'Pulldown a braccia tese singolo (Solo Braccio DX)', targetMuscle: 'Gran Dorsale Destro', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Isolamento DX', technique: 'CIRCUITO_ASIMMETRICO', notes: 'Sostituisce il pullover. Tira e blocca al fianco per accorciare il dorso destro.' },
          { order: 3, name: 'Ponte Glutei B-Stance a terra (Isometria in alto)', targetMuscle: 'Gluteo Gamba Inibita', segment: 'MECCANICO', sets: 4, reps: '40s tenuta', restSeconds: 20, effort: 'Isometrico', technique: 'CIRCUITO_B_STANCE', notes: '40" spingendo con forza sulla gamba inibita con squeeze costante in alto.' },
          { order: 4, name: 'Waiter\'s Walk (Manubrio in alto sopra la testa)', targetMuscle: 'De-rotazione Toracica', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Braccio SX', technique: 'CIRCUITO_OVERHEAD', notes: 'Solo braccio SINISTRO in alto disteso per aprire la concavit� toracica.' },
          { order: 5, name: 'Barchetta asimmetrica a terra (Hollow Hold Asimmetrico)', targetMuscle: 'Core De-rotante', segment: 'METABOLICO', sets: 4, reps: '40s', restSeconds: 120, effort: 'Corpo Libero', technique: 'CIRCUITO_HALLOW', notes: 'Braccio SX esteso vicino all\'orecchio, braccio DX verso il tallone. Fine round: riposo 2 minuti!' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Circuito Integrazione Funzionale (A/B Alternato)',
        sessionFocus: 'Rotazione continua delle stazioni per simmetria globale e decompressione',
        exercises: [
          { order: 1, name: 'Bulgarian Split Squat 1 manubrio (Offset)', targetMuscle: 'Gambe Monopodalico', segment: 'NEURALE', sets: 4, reps: '40s', restSeconds: 20, effort: 'Medio', technique: 'CIRCUITO_OFFSET', notes: 'Manubrio sul lato gamba inibita.' },
          { order: 2, name: 'Pulldown a braccia tese singolo (Solo Braccio DX)', targetMuscle: 'Gran Dorsale DX', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Isolamento DX', technique: 'CIRCUITO_ASIMMETRICO', notes: 'Accorciamento dorso destro.' },
          { order: 3, name: 'Ponte Glutei B-Stance a terra (Isometria)', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Isometrico', technique: 'CIRCUITO_B_STANCE', notes: 'Spinta attiva gamba debole.' },
          { order: 4, name: 'Chest Press a macchina guidata', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '40s', restSeconds: 20, effort: 'Controllato', technique: 'CIRCUITO_GUIDATO', notes: 'Scapola destra ben salda allo schienale.' },
          { order: 5, name: 'Suitcase Carry (Camminata del contadino unilaterale)', targetMuscle: 'Core & QL', segment: 'METABOLICO', sets: 4, reps: '40s', restSeconds: 120, effort: 'Pesante SX', technique: 'CIRCUITO_UNILATERALE', notes: 'Carico solo a SX. Fine round: riposo 2 minuti!' }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TEMPLATE 3: TRADIZIONALE 4 GIORNI (UPPER / LOWER SPLIT) - SCOLIOSI
  // --------------------------------------------------------------------------
  {
    id: 'SCO-TRAD-4D',
    title: 'Scoliosi Tradizionale 4 Giorni (Upper / Lower Split)',
    group: 'AVANZATO',
    daysCount: 4,
    primaryEngine: 'BOMPA_PERIODIZATION',
    description: 'Split Upper/Lower su 4 giorni per scoliosi: G1 Lower A (spinta), G2 Upper A (trazione verticale), G3 Lower B (catena posteriore), G4 Upper B (trazione orizzontale). Zero carico assiale.',
    generateSessions: (gender: Gender): TemplateSession[] => [
      {
        dayLabel: 'Giorno 1: Lower A (Spinta Unilaterale & Stabilit� Pelvica)',
        sessionFocus: 'Leg Press Singola, Affondi Liberi, Extension & Suitcase Carry',
        exercises: [
          { order: 1, name: 'Leg Press Singola (Unilaterale)', targetMuscle: 'Quadricipiti / Glutei', segment: 'NEURALE', sets: 4, reps: '8 per lato', restSeconds: 75, effort: 'RIR 2', technique: 'UNILATERALE', notes: 'Schienale e bacino completamente bloccati. Spinta fluida.' },
          { order: 2, name: 'Affondi Indietro con manubri (Liberi)', targetMuscle: 'Gambe Monopodalico', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Movimento libero per assecondare la mobilit� asimmetrica del bacino.' },
          { order: 3, name: 'Leg Extension Singola', targetMuscle: 'Quadricipiti', segment: 'MECCANICO', sets: 3, reps: '12 (+1 serie gamba debole)', restSeconds: 45, effort: 'RIR 1', technique: 'UNILATERALE', notes: '+1 serie extra sulla gamba debole/inibita per pareggiare il volume.' },
          { order: 4, name: 'Ponte Glutei B-Stance a terra', targetMuscle: 'Glutei', segment: 'MECCANICO', sets: 4, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 1', technique: 'B_STANCE', notes: 'Spinta attiva sul piede di lavoro, tallone opposto di mero equilibrio.' },
          { order: 5, name: 'Suitcase Carry (Camminata del contadino)', targetMuscle: 'Core & QL Destro', segment: 'METABOLICO', sets: 4, reps: '20 metri', restSeconds: 60, effort: 'Carico a SX', technique: 'UNILATERALE', notes: 'Carico tenuto SOLO a SX per stabilizzare il lato lombare opposto.' }
        ]
      },
      {
        dayLabel: 'Giorno 2: Upper A (Tirata Verticale / Macchine Guidate)',
        sessionFocus: 'Lat Singola Asimmetrica, Chest Press, Bicipiti & Side Plank Schroth',
        exercises: [
          { order: 1, name: 'Lat Machine Singola (Maniglia D)', targetMuscle: 'Gran Dorsale', segment: 'NEURALE', sets: 4, reps: '8-10 (+1 serie DX)', restSeconds: 75, effort: 'RIR 1-2', technique: 'ASIMMETRICO', notes: 'SX: stretch profondo in alto. DX: isometria 2" in basso. +1 serie extra DX.' },
          { order: 2, name: 'Chest Press a macchina', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 75, effort: 'RIR 2', technique: 'GUIDATO', notes: 'Lavoro di spinta al 100% in sicurezza per il gibbo costale.' },
          { order: 3, name: 'Pulldown braccia tese singolo', targetMuscle: 'Dorso Posturale', segment: 'MECCANICO', sets: 3, reps: '12', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Focus attivazione dorsale a braccio teso.' },
          { order: 4, name: 'Curl Bicipiti manubri da seduta', targetMuscle: 'Bicipiti', segment: 'METABOLICO', sets: 3, reps: '10', restSeconds: 45, effort: 'RIR 1', technique: 'NONE', notes: 'Seduta con schienale a 75� per evitare compensi lombari.' },
          { order: 5, name: 'Side Plank Schroth-Modificato', targetMuscle: 'Core Asimmetrico', segment: 'METABOLICO', sets: 3, reps: '40s', restSeconds: 45, effort: 'Isometrico', technique: 'SCHROTH', notes: 'Appoggio SOLO su gomito DX, braccio SX proteso in alto.' }
        ]
      },
      {
        dayLabel: 'Giorno 3: Lower B (Catena Posteriore e Isolamento Gluteo)',
        sessionFocus: 'Gluteus Machine, Bulgaro Libero, Leg Curl Seduto & Abductor',
        exercises: [
          { order: 1, name: 'Gluteus Machine guidata', targetMuscle: 'Grande Gluteo', segment: 'NEURALE', sets: 4, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 1-2', technique: 'ISOLAMENTO', notes: 'Sostituisce definitivamente qualsiasi variante di stacco con bilanciere.' },
          { order: 2, name: 'Bulgarian Split Squat manubri liberi', targetMuscle: 'Glutei / Monopodalico', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Busto leggermente flesso avanti per focus gluteo, zero carico lombare.' },
          { order: 3, name: 'Leg Curl Singolo (Seduto)', targetMuscle: 'Ischiocrurali', segment: 'MECCANICO', sets: 3, reps: '10 per gamba', restSeconds: 60, effort: 'RIR 1-2', technique: 'UNILATERALE', notes: 'Disattivazione dello psoas in posizione seduta.' },
          { order: 4, name: 'Abductor Machine', targetMuscle: 'Medio Gluteo', segment: 'METABOLICO', sets: 4, reps: '12', restSeconds: 45, effort: 'RIR 1', technique: 'ISOLAMENTO', notes: 'Fondamentale per il medio gluteo che stabilizza il bacino.' },
          { order: 5, name: 'Dead Bug Asimmetrico (Cavo a SX)', targetMuscle: 'Core Anti-Estensione', segment: 'METABOLICO', sets: 4, reps: '10 rep', restSeconds: 45, effort: 'Controllo', technique: 'ASIMMETRICO', notes: 'Cavo basso da dietro che resiste solo al braccio sinistro.' }
        ]
      },
      {
        dayLabel: 'Giorno 4: Upper B (Tirata Orizzontale & Deltoide Posteriore)',
        sessionFocus: 'Rematore Manubrio Asimmetrico, Spinte Panca, Face Pull & Pallof',
        exercises: [
          { order: 1, name: 'Rematore 1 manubrio su panca', targetMuscle: 'Dorso Posturale', segment: 'NEURALE', sets: 4, reps: '8-10 (+1 serie DX)', restSeconds: 75, effort: 'RIR 1-2', technique: 'ASIMMETRICO', notes: 'SX: protrazione controllata / DX: retrazione forte. +1 serie extra DX.' },
          { order: 2, name: 'Spinte Panca Piana con manubri o Chest Press', targetMuscle: 'Petto', segment: 'MECCANICO', sets: 4, reps: '8', restSeconds: 60, effort: 'RIR 2', technique: 'NONE', notes: 'Presa semi-neutra, scapole ben addotte sullo schienale.' },
          { order: 3, name: 'Face Pull Asimmetrico al cavo', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '15', restSeconds: 45, effort: 'RIR 1', technique: 'ASIMMETRICO', notes: 'Tirata pi� accentuata a DX per spalla retroposa.' },
          { order: 4, name: 'Pec Fly Rear Delt (Macchina)', targetMuscle: 'Deltoidi Posteriori', segment: 'METABOLICO', sets: 3, reps: '12', restSeconds: 45, effort: 'Cedimento', technique: 'ASIMMETRICO', notes: 'Monolaterale o focus estremo sulla contrazione del lato DESTRO.' },
          { order: 5, name: 'Pallof Press in Ginocchio (Half-Kneeling)', targetMuscle: 'Core Anti-Rotazione', segment: 'METABOLICO', sets: 4, reps: '10 rep', restSeconds: 45, effort: 'Controllo', technique: 'ANTI_ROTAZIONE', notes: 'Resistenza del cavo proveniente da DESTRA.' }
        ]
      }
    ]
  },

];