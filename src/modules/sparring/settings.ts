// Die Kulissen des Sparrings (P4, `docs/gremium-sprachpartner.md` §9).
//
// Eigene Datei, damit die Liste ohne React prüfbar ist — und weil sie wachsen
// wird: Der Ort ist der Rahmen, nicht der Inhalt, aber ein Rahmen, den man
// wiedererkennt, macht den Unterschied zwischen „Übung" und „Situation".
//
// `brief` geht wörtlich in den Prompt. Deshalb steht dort, WER man ist und WIE
// geredet wird — nicht nur, wo. Bei den moderneren Szenen ausdrücklich:
// normales Erwachsenen-Schwedisch, keine Jugendsprache (Vorgabe des Projekts).

import type { DialogScene } from '../../domain/dialog';

export interface SparringSetting {
  id: DialogScene;
  title: string;
  partner: string;
  /** Der Satz, der als Kulisse in den Prompt geht. */
  brief: string;
}

/** Kulissen. Bewusst wenige und alltäglich — der Ort ist Rahmen, nicht Inhalt. */
export const SETTINGS: SparringSetting[] = [
  {
    id: 'cafe',
    title: 'Im Café',
    partner: 'Elin, die Bedienung',
    brief: 'Ein Café in Stockholm. Du bist die Bedienung und kommst an den Tisch des Gastes.',
  },
  {
    id: 'garage',
    title: 'In der Werkstatt',
    partner: 'Kalle, ein Kumpel',
    brief: 'Eine Hobby-Werkstatt. Du schraubst mit deinem Kumpel am Auto und redest nebenbei.',
  },
  {
    id: 'station',
    title: 'Am Bahnhof',
    partner: 'Jonas am Schalter',
    brief: 'Der Hauptbahnhof. Du stehst am Schalter und hilfst einem Reisenden weiter.',
  },
  {
    id: 'shop',
    title: 'Beim Einkaufen',
    partner: 'Maja im Laden',
    brief: 'Ein kleiner Laden. Du bist im Verkauf und sprichst einen Kunden an.',
  },
  {
    id: 'lake',
    title: 'Am See',
    partner: 'Erik beim Angeln',
    brief: 'Ein ruhiger See am Abend. Ihr sitzt beim Angeln und unterhaltet euch.',
  },
  {
    id: 'gaming',
    title: 'Zocken über Discord',
    partner: 'Nils im Sprachkanal',
    brief:
      'Ihr spielt zusammen online und redet über Sprachchat. Lockerer Ton unter Freunden, ' +
      'aber normales Erwachsenen-Schwedisch — keine Jugendsprache, keine Abkürzungen.',
  },
  {
    id: 'track',
    title: 'Auf der Rallye-Strecke',
    partner: 'Pelle im Fahrerlager',
    brief:
      'Fahrerlager bei einer kleinen Rallye. Ihr steht zwischen den Autos, redet über den ' +
      'Lauf, das Wetter und die Technik.',
  },
  {
    id: 'stadium',
    title: 'Beim Spiel',
    partner: 'Sara auf der Tribüne',
    brief: 'Ein Fußballspiel am Wochenende. Ihr sitzt nebeneinander und redet über das Spiel.',
  },
  {
    id: 'hotel',
    title: 'An der Rezeption',
    partner: 'Anders an der Rezeption',
    brief: 'Ein Hotel am Abend. Du stehst an der Rezeption und kümmerst dich um einen Gast.',
  },
  {
    id: 'clinic',
    title: 'Beim Arzt',
    partner: 'Ingrid in der Praxis',
    brief:
      'Eine Arztpraxis. Du bist am Empfang und fragst freundlich, worum es geht. Bleib ' +
      'einfach und alltäglich — keine Fachbegriffe.',
  },
];
