export type Side = "light" | "dark" | "neutral";

export interface Character {
  id: string;
  name: string;
  side: Side;
  era: string;
}

export interface Quote {
  id: string;
  text: string;
  characterId: string;
  source: string;
}

export const CHARACTERS: Character[] = [
  { id: "yoda", name: "Yoda", side: "light", era: "Prequel / Original" },
  { id: "vader", name: "Darth Vader", side: "dark", era: "Original Trilogy" },
  {
    id: "obi-wan",
    name: "Obi-Wan Kenobi",
    side: "light",
    era: "Prequel / Original",
  },
  {
    id: "palpatine",
    name: "Emperor Palpatine",
    side: "dark",
    era: "Prequel / Original",
  },
  {
    id: "luke",
    name: "Luke Skywalker",
    side: "light",
    era: "Original / Sequel",
  },
  {
    id: "leia",
    name: "Leia Organa",
    side: "neutral",
    era: "Original / Sequel",
  },
  { id: "han", name: "Han Solo", side: "neutral", era: "Original Trilogy" },
  {
    id: "mandalorian",
    name: "The Mandalorian",
    side: "neutral",
    era: "The Mandalorian",
  },
  {
    id: "ahsoka",
    name: "Ahsoka Tano",
    side: "light",
    era: "Clone Wars / Rebels",
  },
];

export const QUOTES: Quote[] = [
  // Yoda
  {
    id: "q1",
    characterId: "yoda",
    source: "The Empire Strikes Back",
    text: "Do. Or do not. There is no try.",
  },
  {
    id: "q2",
    characterId: "yoda",
    source: "The Phantom Menace",
    text: "Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering.",
  },
  {
    id: "q3",
    characterId: "yoda",
    source: "Return of the Jedi",
    text: "When nine hundred years old you reach, look as good you will not.",
  },
  {
    id: "q4",
    characterId: "yoda",
    source: "The Empire Strikes Back",
    text: "Size matters not. Look at me. Judge me by my size, do you?",
  },
  {
    id: "q5",
    characterId: "yoda",
    source: "Revenge of the Sith",
    text: "To be Jedi is to face the truth, and choose. Give off light, or darkness.",
  },
  // Darth Vader
  {
    id: "q6",
    characterId: "vader",
    source: "The Empire Strikes Back",
    text: "I am your father.",
  },
  {
    id: "q7",
    characterId: "vader",
    source: "A New Hope",
    text: "I find your lack of faith disturbing.",
  },
  {
    id: "q8",
    characterId: "vader",
    source: "Rogue One",
    text: "Be careful not to choke on your aspirations.",
  },
  {
    id: "q9",
    characterId: "vader",
    source: "The Empire Strikes Back",
    text: "There is no escape. Don't make me destroy you.",
  },
  // Obi-Wan
  {
    id: "q10",
    characterId: "obi-wan",
    source: "A New Hope",
    text: "The Force will be with you, always.",
  },
  {
    id: "q11",
    characterId: "obi-wan",
    source: "Revenge of the Sith",
    text: "You were the chosen one! It was said that you would destroy the Sith, not join them!",
  },
  {
    id: "q12",
    characterId: "obi-wan",
    source: "A New Hope",
    text: "In my experience, there's no such thing as luck.",
  },
  {
    id: "q13",
    characterId: "obi-wan",
    source: "Revenge of the Sith",
    text: "Hello there.",
  },
  // Palpatine
  {
    id: "q14",
    characterId: "palpatine",
    source: "Revenge of the Sith",
    text: "I am the Senate.",
  },
  {
    id: "q15",
    characterId: "palpatine",
    source: "Return of the Jedi",
    text: "Everything that has transpired has done so according to my design.",
  },
  {
    id: "q16",
    characterId: "palpatine",
    source: "Revenge of the Sith",
    text: "The dark side of the Force is a pathway to many abilities some consider to be unnatural.",
  },
  // Luke
  {
    id: "q17",
    characterId: "luke",
    source: "The Last Jedi",
    text: "I will not be the last Jedi.",
  },
  {
    id: "q18",
    characterId: "luke",
    source: "Return of the Jedi",
    text: "I am a Jedi, like my father before me.",
  },
  {
    id: "q19",
    characterId: "luke",
    source: "The Empire Strikes Back",
    text: "I don't believe it. That's why you fail.",
  },
  // Leia
  {
    id: "q20",
    characterId: "leia",
    source: "A New Hope",
    text: "Help me, Obi-Wan Kenobi. You're my only hope.",
  },
  {
    id: "q21",
    characterId: "leia",
    source: "The Last Jedi",
    text: "Hope is like the sun. If you only believe in it when you can see it, you'll never make it through the night.",
  },
  {
    id: "q22",
    characterId: "leia",
    source: "The Empire Strikes Back",
    text: "I love you. I know.",
  },
  // Han Solo
  {
    id: "q23",
    characterId: "han",
    source: "A New Hope",
    text: "Never tell me the odds.",
  },
  {
    id: "q24",
    characterId: "han",
    source: "The Empire Strikes Back",
    text: "I've got a bad feeling about this.",
  },
  {
    id: "q25",
    characterId: "han",
    source: "The Force Awakens",
    text: "That's not how the Force works!",
  },
  // Mandalorian
  {
    id: "q26",
    characterId: "mandalorian",
    source: "The Mandalorian",
    text: "This is the Way.",
  },
  {
    id: "q27",
    characterId: "mandalorian",
    source: "The Mandalorian",
    text: "I can bring you in warm, or I can bring you in cold.",
  },
  // Ahsoka
  {
    id: "q28",
    characterId: "ahsoka",
    source: "Clone Wars",
    text: "I am no Jedi.",
  },
  {
    id: "q29",
    characterId: "ahsoka",
    source: "Rebels",
    text: "I am becoming something new.",
  },
  {
    id: "q30",
    characterId: "ahsoka",
    source: "Clone Wars",
    text: "I won't leave you. Not this time.",
  },
];

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

export function getQuotesByCharacter(characterId: string): Quote[] {
  return QUOTES.filter((q) => q.characterId === characterId);
}

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export const SIDE_STYLES: Record<
  Side,
  { accent: string; border: string; badge: string }
> = {
  light: {
    accent: "text-blue-400",
    border: "border-blue-500/40",
    badge: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  },
  dark: {
    accent: "text-red-400",
    border: "border-red-500/40",
    badge: "bg-red-500/15 text-red-300 border border-red-500/30",
  },
  neutral: {
    accent: "text-amber-400",
    border: "border-amber-500/40",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  },
};
