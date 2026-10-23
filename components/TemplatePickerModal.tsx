'use client';

import React, { useState } from 'react';
import { X, Layers, Check, Sparkles, Dumbbell, Zap, Flame, Shield } from 'lucide-react';

export interface SplitTemplate {
  id: string;
  splitName: string;
  category: string;
  daysCount: number;
  engine: string;
  description: string;
  tags: string[];
  days: any[];
}

export const TOP_GYM_SPLITS: SplitTemplate[] = [
  {
    id: 'ppl-3',
    splitName: 'Push / Pull / Legs (3 Giorni)',
    category: 'Ipertrofia Classica',
    daysCount: 3,
    engine: 'TOPGYM_BLOCKS',
    description: 'Split classica: Spinta, Trazione e Gambe. Massima efficienza biomeccanica e recupero ideale.',
    tags: ['PPL', '3 Giorni', 'Full Focus'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno A - Spinta (Push)',
        focus: 'Petto, Deltoidi Anteriori e Laterali, Tricipiti',
        exercises: [
          { id: 'ex-1-1', name: 'Panca Piana con Bilanciere', sets: 4, reps: '6-8', rest: 120, target: 'Carico progressivo RPE 8' },
          { id: 'ex-1-2', name: 'Spinte con Manubri su Panca Inclinata 30°', sets: 3, reps: '8-10', rest: 90, target: 'Focus parte clavicolare' },
          { id: 'ex-1-3', name: 'Dip alle Parallele (o Chest Press)', sets: 3, reps: '8-10', rest: 90, target: 'ROM profondo controllato' },
          { id: 'ex-1-4', name: 'Military Press con Bilanciere / Dumbbell Shoulder Press', sets: 3, reps: '8-10', rest: 90, target: 'Spinta verticale pura' },
          { id: 'ex-1-5', name: 'Alzate Laterali ai Cavi / Manubri', sets: 4, reps: '12-15', rest: 60, target: 'Tensione continua al picco' },
          { id: 'ex-1-6', name: 'Pushdown al Cavo con Corda', sets: 3, reps: '10-12', rest: 60, target: 'Squeeze tricipiti' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno B - Trazione (Pull)',
        focus: 'Dorso, Deltoidi Posteriori, Bicipiti',
        exercises: [
          { id: 'ex-2-1', name: 'Stacco da Terra / Mezzi Stacchi sui Blocchi', sets: 3, reps: '5-6', rest: 150, target: 'Forza pura catena posteriore' },
          { id: 'ex-2-2', name: 'Trazioni alla Sbarra (o Lat Machine Presa Larga)', sets: 4, reps: '6-8', rest: 120, target: 'Fase eccentrica 3 secondi' },
          { id: 'ex-2-3', name: 'Rematore con Bilanciere Presa Prona', sets: 3, reps: '8-10', rest: 90, target: 'Spessore gran dorsale' },
          { id: 'ex-2-4', name: 'Pulley Basso con Presa Stretta', sets: 3, reps: '10-12', rest: 75, target: 'Contrazione scapolare 1s' },
          { id: 'ex-2-5', name: 'Face Pull con Cavo Alto', sets: 4, reps: '12-15', rest: 60, target: 'Extrarotazione e deltoide post.' },
          { id: 'ex-2-6', name: 'Curl con Bilanciere Sagomato (EZ)', sets: 3, reps: '8-10', rest: 75, target: 'Tensione costante bicipiti' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno C - Gambe & Addome (Legs)',
        focus: 'Quadricipiti, Femorali, Glutei, Polpacci, Core',
        exercises: [
          { id: 'ex-3-1', name: 'Back Squat con Bilanciere', sets: 4, reps: '6-8', rest: 150, target: 'Profondità parallelo RPE 8' },
          { id: 'ex-3-2', name: 'Leg Press a 45°', sets: 3, reps: '10-12', rest: 90, target: 'Volume e carico pesante' },
          { id: 'ex-3-3', name: 'Romanian Deadlift (RDL) con Manubri', sets: 3, reps: '8-10', rest: 90, target: 'Allungamento femorali controllato' },
          { id: 'ex-3-4', name: 'Leg Extension', sets: 3, reps: '12-15', rest: 60, target: 'Isolamento quadricipite' },
          { id: 'ex-3-5', name: 'Calf Raise in Piedi alla Smith Machine', sets: 4, reps: '15-20', rest: 60, target: 'Fermo 2s in basso e in alto' },
          { id: 'ex-3-6', name: 'Plank Addominale & Crunch al Cavo', sets: 3, reps: '15-20', rest: 60, target: 'Stabilità del core' }
        ]
      }
    ]
  },
  {
    id: 'ppl-5',
    splitName: 'Push / Pull / Legs Sequenziale (5 Giorni)',
    category: 'Ipertrofia Avanzata',
    daysCount: 5,
    engine: 'NOCERINO',
    description: 'Rotazione PPL con frequenza 2x a rotazione continua. Volume denso per atleti intermedi/avanzati.',
    tags: ['PPL Sequenziale', '5 Giorni', 'Frequenza Alta'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno 1 - Push 1 (Heavy Chest & Shoulders)',
        focus: 'Forza Petto e Spalle',
        exercises: [
          { id: 'p1-1', name: 'Panca Piana con Bilanciere', sets: 4, reps: '5-6', rest: 120, target: 'RPE 8.5' },
          { id: 'p1-2', name: 'Military Press con Bilanciere', sets: 4, reps: '6-8', rest: 120, target: 'Carico progressivo' },
          { id: 'p1-3', name: 'Spinte Manubri su Inclinata', sets: 3, reps: '8-10', rest: 90, target: 'TUT controllato' },
          { id: 'p1-4', name: 'Alzate Laterali Manubri', sets: 4, reps: '12-15', rest: 60, target: 'Cedimento tecnico' },
          { id: 'p1-5', name: 'Dip alle Parallele con Sovraccarico', sets: 3, reps: '8-10', rest: 90, target: 'Focus tricipiti/petto' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno 2 - Pull 1 (Heavy Back & Biceps)',
        focus: 'Spessore Dorso e Trazione Pesante',
        exercises: [
          { id: 'pl1-1', name: 'Stacco da Terra Tradizionale', sets: 3, reps: '5', rest: 150, target: 'Forza massima' },
          { id: 'pl1-2', name: 'Rematore con Bilanciere', sets: 4, reps: '6-8', rest: 120, target: 'Spessore' },
          { id: 'pl1-3', name: 'Lat Machine Presa Neutra Stretta', sets: 3, reps: '8-10', rest: 90, target: 'Allungamento completo' },
          { id: 'pl1-4', name: 'Rear Delt Fly con Manubri', sets: 4, reps: '12-15', rest: 60, target: 'Isolamento' },
          { id: 'pl1-5', name: 'Curl con Bilanciere In Piedi', sets: 3, reps: '8-10', rest: 75, target: 'Braccia pesanti' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno 3 - Legs 1 (Quad & Glute Focus)',
        focus: 'Forza Arti Inferiori',
        exercises: [
          { id: 'l1-1', name: 'Back Squat', sets: 4, reps: '6', rest: 150, target: 'Intensità alta' },
          { id: 'l1-2', name: 'Hack Squat / Leg Press', sets: 3, reps: '8-10', rest: 90, target: 'Quadricipiti' },
          { id: 'l1-3', name: 'Affondi Camminati con Manubri', sets: 3, reps: '10x gamba', rest: 75, target: 'Glutei e stabilità' },
          { id: 'l1-4', name: 'Leg Extension', sets: 3, reps: '12-15', rest: 60, target: 'Pump metabolico' },
          { id: 'l1-5', name: 'Calf Seduto alla Machine', sets: 4, reps: '15-20', rest: 60, target: 'Soleo' }
        ]
      },
      {
        id: 'day-4',
        name: 'Giorno 4 - Push 2 (Incline & Lateral Delt Focus)',
        focus: 'Ipertrofia Superiore e Tricipiti',
        exercises: [
          { id: 'p2-1', name: 'Panca Inclinata con Bilanciere', sets: 4, reps: '8-10', rest: 90, target: 'Petto alto' },
          { id: 'p2-2', name: 'Croci ai Cavi su Panca Piana', sets: 3, reps: '12-15', rest: 60, target: 'Picco di contrazione' },
          { id: 'p2-3', name: 'Lento Avanti con Manubri Seduto', sets: 3, reps: '8-10', rest: 90, target: 'Deltoidi' },
          { id: 'p2-4', name: 'Alzate Laterali Cavo Basso Singolo', sets: 4, reps: '12-15', rest: 60, target: 'Isolamento' },
          { id: 'p2-5', name: 'French Press su Panca con EZ', sets: 3, reps: '10-12', rest: 75, target: 'Capo lungo tricipite' }
        ]
      },
      {
        id: 'day-5',
        name: 'Giorno 5 - Pull 2 (Width & Arm Density)',
        focus: 'Ampiezza Dorso e Bicipiti',
        exercises: [
          { id: 'pl2-1', name: 'Trazioni alla Sbarra Zavorrate', sets: 4, reps: '6-8', rest: 120, target: 'Ampiezza dorso' },
          { id: 'pl2-2', name: 'Pulley Basso Presa Larga', sets: 3, reps: '10-12', rest: 90, target: 'Romboide e trapezio medio' },
          { id: 'pl2-3', name: 'Pullover al Cavo Alto', sets: 3, reps: '12-15', rest: 60, target: 'Isolamento dorsale' },
          { id: 'pl2-4', name: 'Curl su Panca Inclinata con Manubri', sets: 3, reps: '10-12', rest: 75, target: 'Capo lungo bicipite' },
          { id: 'pl2-5', name: 'Hammer Curl ai Cavi con Corda', sets: 3, reps: '12-15', rest: 60, target: 'Brachiale e avambracci' }
        ]
      }
    ]
  },
  {
    id: 'upper-lower-4',
    splitName: 'Upper / Lower (4 Giorni)',
    category: 'Forza & Tensione Meccanica',
    daysCount: 4,
    engine: 'HELMS_PYRAMID',
    description: 'Frequenza 2x rigorosa su parte superiore e inferiore del corpo. Bilanciamento perfetto di carichi e recupero.',
    tags: ['Upper/Lower', '4 Giorni', '2x/Week'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno A - Upper 1 (Forza Orizzontale & Braccia)',
        focus: 'Petto, Dorso e Braccia',
        exercises: [
          { id: 'ul-1', name: 'Panca Piana Bilanciere', sets: 4, reps: '6', rest: 120, target: 'Progressione lineare' },
          { id: 'ul-2', name: 'Rematore con Manubrio Singolo', sets: 4, reps: '8', rest: 90, target: 'Carico pesante' },
          { id: 'ul-3', name: 'Military Press Seduto', sets: 3, reps: '8-10', rest: 90, target: 'Spalle' },
          { id: 'ul-4', name: 'Pulley Basso a un Braccio', sets: 3, reps: '10-12', rest: 60, target: 'Simmetria dorsale' },
          { id: 'ul-5', name: 'Curl con Manubri Alternato', sets: 3, reps: '10-12', rest: 60, target: 'Bicipiti' },
          { id: 'ul-6', name: 'Dip tra Panche o Parallele', sets: 3, reps: '10-12', rest: 60, target: 'Tricipiti' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno B - Lower 1 (Squat & Catena Posteriore)',
        focus: 'Cosce e Polpacci',
        exercises: [
          { id: 'ul-7', name: 'Back Squat', sets: 4, reps: '6-8', rest: 150, target: 'Fondamentale gambe' },
          { id: 'ul-8', name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rest: 90, target: 'Femorali' },
          { id: 'ul-9', name: 'Leg Press 45°', sets: 3, reps: '10-12', rest: 90, target: 'Volume' },
          { id: 'ul-10', name: 'Leg Curl Seduto', sets: 3, reps: '12-15', rest: 60, target: 'Isolamento' },
          { id: 'ul-11', name: 'Calf in Piedi', sets: 4, reps: '15-20', rest: 60, target: 'Polpacci' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno C - Upper 2 (Forza Verticale & Ipertrofia)',
        focus: 'Spalle, Dorso e Petto',
        exercises: [
          { id: 'ul-12', name: 'Trazioni alla Sbarra Presa Supina', sets: 4, reps: '6-8', rest: 120, target: 'Trazione verticale' },
          { id: 'ul-13', name: 'Spinte Manubri su Panca Inclinata', sets: 4, reps: '8-10', rest: 90, target: 'Spinta inclinata' },
          { id: 'ul-14', name: 'Rematore al Cavo Seduto', sets: 3, reps: '10-12', rest: 75, target: 'Dorso' },
          { id: 'ul-15', name: 'Alzate Laterali Manubri', sets: 4, reps: '12-15', rest: 60, target: 'Deltoidi laterali' },
          { id: 'ul-16', name: 'Pushdown con Asta Dritta', sets: 3, reps: '10-12', rest: 60, target: 'Tricipiti' }
        ]
      },
      {
        id: 'day-4',
        name: 'Giorno D - Lower 2 (Stacco & Quad Focus)',
        focus: 'Catena Posteriore e Gambe',
        exercises: [
          { id: 'ul-17', name: 'Stacco da Terra Trap Bar / Convenzionale', sets: 3, reps: '5', rest: 150, target: 'Forza' },
          { id: 'ul-18', name: 'Front Squat o Goblet Squat', sets: 3, reps: '8-10', rest: 90, target: 'Focus quadricipiti' },
          { id: 'ul-19', name: 'Affondi con Manubri', sets: 3, reps: '10x gamba', rest: 75, target: 'Glutei' },
          { id: 'ul-20', name: 'Leg Extension', sets: 3, reps: '12-15', rest: 60, target: 'Pompaggio' },
          { id: 'ul-21', name: 'Plank & Addome alle Parallele', sets: 3, reps: '15-20', rest: 60, target: 'Core' }
        ]
      }
    ]
  },
  {
    id: 'torso-arti-4',
    splitName: 'Torso / Arti (4 Giorni)',
    category: 'Specializzazione Muscolare',
    daysCount: 4,
    engine: 'NOCERINO',
    description: 'Isola il lavoro di tronco da quello di braccia e gambe. Ottimo per colmare carenze su bicipiti, tricipiti e deltoidi.',
    tags: ['Torso/Arti', '4 Giorni', 'Focus Braccia'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno 1 - Torso A (Petto & Dorso Pesante)',
        focus: 'Muscoli del Tronco',
        exercises: [
          { id: 'ta-1', name: 'Panca Piana con Bilanciere', sets: 4, reps: '6-8', rest: 120, target: 'Spinta pesante' },
          { id: 'ta-2', name: 'Trazioni alla Sbarra / Lat Machine', sets: 4, reps: '6-8', rest: 120, target: 'Trazione verticale' },
          { id: 'ta-3', name: 'Spinte Manubri su Inclinata 30°', sets: 3, reps: '8-10', rest: 90, target: 'Clavicolare' },
          { id: 'ta-4', name: 'Rematore Manubrio Singolo', sets: 3, reps: '8-10', rest: 90, target: 'Spessore' },
          { id: 'ta-5', name: 'Croci ai Cavi dal Basso', sets: 3, reps: '12-15', rest: 60, target: 'Isolamento petto' },
          { id: 'ta-6', name: 'Pullover con Manubrio', sets: 3, reps: '12-15', rest: 60, target: 'Gabbia toracica' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno 2 - Arti A (Cosce, Polpacci, Super-set Braccia)',
        focus: 'Gambe e Braccia complete',
        exercises: [
          { id: 'ta-7', name: 'Squat con Bilanciere', sets: 4, reps: '6-8', rest: 150, target: 'Cosce' },
          { id: 'ta-8', name: 'Leg Press 45°', sets: 3, reps: '10-12', rest: 90, target: 'Carico quadricipiti' },
          { id: 'ta-9', name: 'Curl Bilanciere in Superset con French Press', sets: 3, reps: '8-10', rest: 90, target: 'Super-set antagonista' },
          { id: 'ta-10', name: 'Hammer Curl in Superset con Pushdown Corda', sets: 3, reps: '10-12', rest: 75, target: 'Brachiale / Tricipiti' },
          { id: 'ta-11', name: 'Calf Raise in Piedi', sets: 4, reps: '15-20', rest: 60, target: 'Polpacci' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno 3 - Torso B (Spalle, Dorso Ampiezza, Petto Alto)',
        focus: 'Spalle e Tronco densità',
        exercises: [
          { id: 'ta-12', name: 'Military Press In Piedi', sets: 4, reps: '6-8', rest: 120, target: 'Spalle pesanti' },
          { id: 'ta-13', name: 'Rematore con Bilanciere Presa Inversa', sets: 4, reps: '8-10', rest: 90, target: 'Dorso basso' },
          { id: 'ta-14', name: 'Chest Press Inclinata', sets: 3, reps: '8-10', rest: 90, target: 'Petto alto' },
          { id: 'ta-15', name: 'Pulley Basso Presa Larga', sets: 3, reps: '10-12', rest: 75, target: 'Spessore alto' },
          { id: 'ta-16', name: 'Alzate Laterali Manubri', sets: 4, reps: '12-15', rest: 60, target: 'Deltoidi laterali' }
        ]
      },
      {
        id: 'day-4',
        name: 'Giorno 4 - Arti B (Catena Posteriore & Braccia Density)',
        focus: 'Femorali, Glutei e Isolamento Braccia',
        exercises: [
          { id: 'ta-17', name: 'Romanian Deadlift con Bilanciere', sets: 4, reps: '8-10', rest: 120, target: 'Catena posteriore' },
          { id: 'ta-18', name: 'Affondi con Manubri', sets: 3, reps: '10x gamba', rest: 75, target: 'Glutei e stabilità' },
          { id: 'ta-19', name: 'Curl Manubri Panca Scott', sets: 3, reps: '10-12', rest: 75, target: 'Picco bicipiti' },
          { id: 'ta-20', name: 'Dip alle Parallele per Tricipiti', sets: 3, reps: '10-12', rest: 75, target: 'Tricipiti corpo libero' },
          { id: 'ta-21', name: 'Calf Seduto alla Macchina', sets: 4, reps: '20', rest: 60, target: 'Soleo' }
        ]
      }
    ]
  },
  {
    id: 'bikini-wave-5',
    splitName: '5-Day Bikini Wave System (Wilson 2014)',
    category: 'Periodizzazione Femminile & Glutei',
    daysCount: 5,
    engine: 'BIKINI_WAVE',
    description: 'Sistema a onde L/M/H basato sulle Tabelle 7.4-7.6 di Wilson & Fitschen. Focus su glutei, catena posteriore e punto vita.',
    tags: ['Bikini Wave', '5 Giorni', 'Glute Focus'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno 1 - Glute Heavy & Deltoidi Laterali',
        focus: 'Carico Pesante Glutei e Sagoma Spalle',
        exercises: [
          { id: 'bw-1', name: 'Barbell Hip Thrust (Fermo 2s in alto)', sets: 4, reps: '8-10', rest: 120, target: 'Carico massimo glutei' },
          { id: 'bw-2', name: 'Squat Bulgaro con Manubri', sets: 3, reps: '10-12 x gamba', rest: 90, target: 'Gluteo e stabilità' },
          { id: 'bw-3', name: 'Leg Press Piedi Alti e Larghi', sets: 3, reps: '10-12', rest: 90, target: 'Catena posteriore' },
          { id: 'bw-4', name: 'Alzate Laterali con Manubri (Drop set ultima)', sets: 4, reps: '12-15', rest: 60, target: 'Focus deltoidi laterali' },
          { id: 'bw-5', name: 'Abductor Machine con Busto Inclinato', sets: 3, reps: '15-20', rest: 60, target: 'Medio gluteo' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno 2 - Dorso & Braccia (Punto Vita Tapering)',
        focus: 'V-Taper e Tonificazione Superiore',
        exercises: [
          { id: 'bw-6', name: 'Lat Machine Presa Neutra', sets: 4, reps: '10-12', rest: 75, target: 'V-Taper punto vita' },
          { id: 'bw-7', name: 'Pulley Basso Presa Stretta', sets: 3, reps: '10-12', rest: 75, target: 'Dorso e postura' },
          { id: 'bw-8', name: 'Lento Avanti Seduta con Manubri', sets: 3, reps: '10-12', rest: 75, target: 'Spalle' },
          { id: 'bw-9', name: 'Pushdown Cavi per Tricipiti', sets: 3, reps: '12-15', rest: 60, target: 'Tonificazione' },
          { id: 'bw-10', name: 'Plank Isometrico & Vacuum Addominale', sets: 3, reps: '45-60s', rest: 60, target: 'Trasverso addome' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno 3 - Glute Pump & Hamstrings RDL',
        focus: 'Femorali e Glutei Tensione Continua',
        exercises: [
          { id: 'bw-11', name: 'Romanian Deadlift con Manubri (RDL)', sets: 4, reps: '10-12', rest: 90, target: 'Allungamento femorali' },
          { id: 'bw-12', name: 'Cable Kickback (Slanci ai Cavi)', sets: 3, reps: '12-15 x gamba', rest: 60, target: 'Isolamento gluteo' },
          { id: 'bw-13', name: 'Leg Curl Seduto o Sdraiato', sets: 3, reps: '12-15', rest: 60, target: 'Femorali' },
          { id: 'bw-14', name: 'Hip Thrust con Banda Elastica', sets: 3, reps: '15-20', rest: 60, target: 'Burn out metabolico' },
          { id: 'bw-15', name: 'Calf Raise in Piedi', sets: 3, reps: '15-20', rest: 60, target: 'Polpacci' }
        ]
      },
      {
        id: 'day-4',
        name: 'Giorno 4 - Upper Body Shape & Core',
        focus: 'Petto Alto, Deltoidi e Stabilità',
        exercises: [
          { id: 'bw-16', name: 'Spinte Manubri su Panca Inclinata', sets: 3, reps: '10-12', rest: 75, target: 'Tono decolleté' },
          { id: 'bw-17', name: 'Alzate Laterali ai Cavi Singoli', sets: 4, reps: '12-15', rest: 60, target: 'Ampiezza spalle' },
          { id: 'bw-18', name: 'Face Pull con Corda', sets: 3, reps: '15', rest: 60, target: 'Postura e deltoide post.' },
          { id: 'bw-19', name: 'Curl con Manubri a Martello', sets: 3, reps: '12-15', rest: 60, target: 'Braccia' },
          { id: 'bw-20', name: 'Crunch Inverso su Panca Inclinata', sets: 3, reps: '15-20', rest: 60, target: 'Addome basso' }
        ]
      },
      {
        id: 'day-5',
        name: 'Giorno 5 - Full Glute Overload & Hip Band',
        focus: 'Picco di Volume Glutei e Definizione',
        exercises: [
          { id: 'bw-21', name: 'KAS Glute Bridge con Bilanciere', sets: 4, reps: '10-12', rest: 90, target: 'Contrazione di picco' },
          { id: 'bw-22', name: 'Iperestensioni a 45° Focus Glutei (Dorso curvo)', sets: 3, reps: '12-15', rest: 60, target: 'Flessione d anca' },
          { id: 'bw-23', name: 'Step Up su Panca con Manubri', sets: 3, reps: '10x gamba', rest: 60, target: 'Gluteo monopodalico' },
          { id: 'bw-24', name: 'Frog Pumps con Manubrio', sets: 3, reps: '20-25', rest: 45, target: 'Pompaggio finale' }
        ]
      }
    ]
  },
  {
    id: 'hard-topgym-4',
    splitName: 'Hard TopGym: Urto & T13 (4 Giorni)',
    category: 'Old School & Alta Intensità',
    daysCount: 4,
    engine: 'HARDTOPGYM',
    description: 'Metodo Emilio They / Nocerino. Serie pesanti, negative lente, eccentrica enfatizzata e cedimento tecnico controllato.',
    tags: ['Hard TopGym', '4 Giorni', 'Urto & They'],
    days: [
      {
        id: 'day-1',
        name: 'Giorno A - Spalle & Braccia (Urto Emilio They)',
        focus: 'Spalle pesanti e Braccia',
        exercises: [
          { id: 'ht-1', name: 'Lento Avanti con Bilanciere (Negative 3s)', sets: 4, reps: '6-8', rest: 120, target: 'Urto They' },
          { id: 'ht-2', name: 'Alzate Laterali con Manubri Pesanti', sets: 4, reps: '8-10', rest: 75, target: 'Tensione continua' },
          { id: 'ht-3', name: 'Curl Bilanciere in Piedi Pesante', sets: 4, reps: '6-8', rest: 90, target: 'Braccia d urto' },
          { id: 'ht-4', name: 'French Press con Bilanciere Sagomato', sets: 4, reps: '6-8', rest: 90, target: 'Tricipiti pesanti' },
          { id: 'ht-5', name: 'Super-set: Curl Scott + Pushdown Corda', sets: 3, reps: '10-12', rest: 60, target: 'Pompaggio conclusivo' }
        ]
      },
      {
        id: 'day-2',
        name: 'Giorno B - Gambe & Polpacci (Alta Intensità They)',
        focus: 'Squat e Gambe ad altissimo sforzo',
        exercises: [
          { id: 'ht-6', name: 'Back Squat Profondo', sets: 4, reps: '6-8', rest: 150, target: 'Carico pesante eccentrica lenta' },
          { id: 'ht-7', name: 'Leg Press a Piedi Bassi', sets: 3, reps: '8-10', rest: 90, target: 'Quadricipiti' },
          { id: 'ht-8', name: 'Leg Curl Sdraiato (Rest-pause)', sets: 3, reps: '8+4+4', rest: 90, target: 'Femorali' },
          { id: 'ht-9', name: 'Leg Extension Stripping', sets: 3, reps: '10+10', rest: 60, target: 'Esaurimento' },
          { id: 'ht-10', name: 'Calf Machine in Piedi', sets: 4, reps: '15', rest: 60, target: 'Fermo in allungamento' }
        ]
      },
      {
        id: 'day-3',
        name: 'Giorno C - Petto & Tricipiti (T13 Nocerino)',
        focus: 'TUT 40-60 secondi & Cedimento Controllato',
        exercises: [
          { id: 'ht-11', name: 'Panca Piana Bilanciere con Fermo 1s', sets: 4, reps: '6-8', rest: 120, target: 'T13 Tensione Meccanica' },
          { id: 'ht-12', name: 'Spinte Manubri su Panca 30°', sets: 3, reps: '8-10', rest: 90, target: 'TUT 45s' },
          { id: 'ht-13', name: 'Dip alle Parallele con Sovraccarico', sets: 3, reps: '8-10', rest: 90, target: 'Petto e tricipiti' },
          { id: 'ht-14', name: 'Croci ai Cavi dall Alto', sets: 3, reps: '12-15', rest: 60, target: 'Pompaggio' },
          { id: 'ht-15', name: 'Tricipiti ai Cavi con Corda Stripping', sets: 3, reps: '10+10', rest: 60, target: 'Capo laterale' }
        ]
      },
      {
        id: 'day-4',
        name: 'Giorno D - Dorso & Bicipiti (Spessore & Trazione)',
        focus: 'Dorso pesante e Trazione pura',
        exercises: [
          { id: 'ht-16', name: 'Stacco da Terra con Bilanciere', sets: 3, reps: '5', rest: 150, target: 'Forza sovraccarico' },
          { id: 'ht-17', name: 'Rematore Pesante Presa Prona', sets: 4, reps: '6-8', rest: 120, target: 'Dorso They' },
          { id: 'ht-18', name: 'Trazioni alla Sbarra con Zavorra', sets: 3, reps: '6-8', rest: 120, target: 'Ampiezza' },
          { id: 'ht-19', name: 'Pulley Basso Presa Stretta', sets: 3, reps: '10-12', rest: 75, target: 'Contrazione 1s' },
          { id: 'ht-20', name: 'Curl con Manubri a Martello', sets: 3, reps: '8-10', rest: 60, target: 'Brachioradiale' }
        ]
      }
    ]
  }
];

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (days: any, templateName: string) => void;
  [key: string]: any;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSelectTemplate
}: TemplatePickerModalProps) {
  const [selectedId, setSelectedId] = useState<string>('ppl-3');

  if (!isOpen) return null;

  const handleApply = (tpl: SplitTemplate) => {
    onSelectTemplate(tpl.days, tpl.splitName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12151B] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER MODALE */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#E50914]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                Template Split Master Coach
              </h2>
              <p className="text-xs text-zinc-400">
                Seleziona uno split: la scheda completa con tutti gli esercizi e le serie viene caricata istantaneamente.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LISTA SPLIT */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {TOP_GYM_SPLITS.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#181C24] border-[#E50914]/60 shadow-lg shadow-[#E50914]/10'
                    : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white tracking-wide">
                      {tpl.splitName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono font-bold">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-mono font-bold">
                      {tpl.daysCount} Giorni
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    {tpl.days.map((d: any, i: number) => (
                      <span key={i} className="text-[10px] bg-black/60 border border-white/5 px-2 py-0.5 rounded text-zinc-400 font-mono">
                        {d.name.split('-')[0].trim()}: {d.exercises?.length || 0} ex
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(tpl);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Carica Split</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            {TOP_GYM_SPLITS.length} Split disponibili • Caricamento istantaneo in 1 click
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
