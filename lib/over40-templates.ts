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
  }

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

];