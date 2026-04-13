import { KeyStatus, ModalContent, WordleStatus } from './enums';

export interface WordleObject {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
}

export interface ModalObject {
  content?: ModalContent;
  display: boolean;
}

export interface GameState {
  answer: string;
  currentGuess: string;
  guesses: Guess[];
  keyResults: { [letter: string]: KeyStatus };
  status: WordleStatus;
}

export interface Guess {
  word: string;
  result: Array<KeyStatus>;
}
