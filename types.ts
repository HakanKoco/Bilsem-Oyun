
export interface Theme {
  name?: string;
  background: string;
  primary: string;
  musicMood?: string;
}

export interface Pair {
  source: string; // Emoji
  target: string; // Emoji
}

export interface Level {
  index: number;
  pairs: Pair[];
  question: string[]; // Array of source emojis
  options: string[][]; // Array of arrays of target emojis (distractors included)
  correct: string[]; // The correct target emoji(s)
  voiceOver: string; // Text for TTS
}

export interface Vocabulary {
  emoji: string;
  english: string;
}

export interface Coloring {
  templateId: 'fish' | 'lion' | 'bird' | 'cat';
}

export interface GameSession {
  theme: Theme;
  levels: Level[];
  coloring: Coloring;
  vocabulary: Vocabulary[];
}

export enum GameState {
  MENU,
  LOADING,
  PLAYING,
  COLORING,
  ERROR
}
