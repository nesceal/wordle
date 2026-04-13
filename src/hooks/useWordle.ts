import { useCallback, useReducer } from 'react';

import {
  ANSWER_LIST,
  MaxAttempts,
  WordLength,
  WORD_LIST,
} from '../lib/constants';

import { KeyStatus, WordleStatus } from '../lib/enums';
import { Guess, GameState } from '../lib/types';

type GameAction =
  | { type: 'delete' }
  | { type: 'enter' }
  | { type: 'key'; letter: string }
  | { type: 'reset' }
  | { type: 'resume' };

const getLetterResult = (
  guess: string[],
  answer: string,
  keyResults: { [key: string]: KeyStatus },
): KeyStatus[] => {
  const result: KeyStatus[] = Array(guess.length).fill(KeyStatus.Absent);
  const answerArray = answer.split('');
  const guessArray = [...guess];

  // reset keyboard tile colors for current guess
  for (let i = 0; i < guessArray.length; i++) {
    keyResults[guessArray[i]] = KeyStatus.Absent;
  }

  // first pass: check for correct letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === answerArray[i]) {
      result[i] = KeyStatus.Correct;
      keyResults[guessArray[i]] = KeyStatus.Correct;
      answerArray[i] = '';
      guessArray[i] = '';
    } else {
      if (
        keyResults[guessArray[i]] !== KeyStatus.Correct &&
        keyResults[guessArray[i]] !== KeyStatus.Present
      ) {
        keyResults[guessArray[i]] = KeyStatus.Absent;
      }
    }
  }

  // second pass: check for present letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] !== '' && answerArray.includes(guessArray[i])) {
      const letterIndex = answerArray.indexOf(guessArray[i]);

      result[i] = KeyStatus.Present;
      answerArray[letterIndex] = '';

      if (keyResults[guessArray[i]] !== KeyStatus.Correct) {
        keyResults[guessArray[i]] = KeyStatus.Present;
      }
    }
  }

  return result;
};

const reducer = (state: GameState, action: GameAction): GameState => {
  const isGameOver =
    state.status === WordleStatus.Answered ||
    state.status === WordleStatus.Completed;

  switch (action.type) {
    case 'key':
      if (!isGameOver && state.currentGuess.length < WordLength) {
        return {
          ...state,
          currentGuess: state.currentGuess + action.letter,
        };
      } else {
        return state;
      }
    case 'delete':
      if (!isGameOver) {
        return {
          ...state,
          currentGuess: state.currentGuess.slice(0, -1),
        };
      } else {
        return state;
      }
    case 'enter':
      if (!isGameOver) {
        if (state.currentGuess.length === WordLength) {
          if (!WORD_LIST.includes(state.currentGuess)) {
            return {
              ...state,
              status: WordleStatus.InvalidWord,
            };
          }

          const newKeyResults = { ...state.keyResults };

          const result = getLetterResult(
            state.currentGuess.split(''),
            state.answer,
            newKeyResults,
          );

          const newGuess: Guess = { word: state.currentGuess, result };
          const newGuesses = [...state.guesses, newGuess];

          const newStatus =
            state.currentGuess === state.answer
              ? WordleStatus.Answered
              : newGuesses.length >= MaxAttempts
                ? WordleStatus.Completed
                : WordleStatus.Playing;

          return {
            ...state,
            currentGuess: '',
            guesses: newGuesses,
            keyResults: newKeyResults,
            status: newStatus,
          };
        } else {
          return {
            ...state,
            status: WordleStatus.InvalidGuess,
          };
        }
      } else {
        return { ...initialState, answer: generateAnswer() };
      }
    case 'reset':
      return { ...initialState, answer: generateAnswer() };
    case 'resume':
      return {
        ...state,
        status: WordleStatus.Playing,
      };
    default:
      return state;
  }
};

const generateAnswer = () => {
  const i = Math.floor(Math.random() * ANSWER_LIST.length);
  return ANSWER_LIST[i];
};

const initialState: GameState = {
  answer: '',
  currentGuess: '',
  guesses: [],
  keyResults: {},
  status: WordleStatus.Playing,
};

export const useWordle = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onDelete = useCallback(() => {
    dispatch({ type: 'delete' });
  }, []);

  const onEnter = useCallback(() => {
    dispatch({ type: 'enter' });
  }, []);

  const onKey = useCallback((letter: string) => {
    dispatch({ type: 'key', letter: letter });
  }, []);

  const onReset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const onResume = useCallback(() => {
    dispatch({ type: 'resume' });
  }, []);

  return {
    ...state,
    onDelete,
    onEnter,
    onKey,
    onReset,
    onResume,
  };
};
