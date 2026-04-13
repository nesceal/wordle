'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { ModalObject, WordleObject } from './lib/types';
import { GameStatus } from './lib/enums';

interface WordleState {
  gameStatus: GameStatus;
  stats: WordleObject | null;
  modal: ModalObject | null;
}

type WordleAction =
  | { type: 'set_game'; payload: GameStatus }
  | { type: 'set_modal'; payload: ModalObject | null }
  | { type: 'set_stats'; payload: WordleObject | null };

const initialState: WordleState = {
  gameStatus: GameStatus.Overview,
  stats: null,
  modal: null,
};

const WordleContext = createContext<
  { state: WordleState; dispatch: Dispatch<WordleAction> } | undefined
>(undefined);

const reducer = (state: WordleState, action: WordleAction): WordleState => {
  switch (action.type) {
    case 'set_game':
      return {
        ...state,
        gameStatus: action.payload,
      };
    case 'set_modal':
      return {
        ...state,
        modal: action.payload,
      };
    case 'set_stats':
      localStorage.setItem('nai-react-wordle', JSON.stringify(action.payload));
      return {
        ...state,
        stats: action.payload,
      };
    default:
      return state;
  }
};

const WordleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <WordleContext.Provider value={value}>{children}</WordleContext.Provider>
  );
};

const useWordleState = () => {
  const context = useContext(WordleContext);

  if (context === undefined) {
    throw new Error('useWordleState must be used within a WordleProvider');
  }

  const { state, dispatch } = context;

  const setGame = useCallback(
    (status: GameStatus) => {
      dispatch({ type: 'set_game', payload: status });
    },
    [dispatch],
  );

  const setModal = useCallback(
    (modal: ModalObject | null) => {
      dispatch({ type: 'set_modal', payload: modal });
    },
    [dispatch],
  );

  const setStats = useCallback(
    (stats: WordleObject | null) => {
      dispatch({ type: 'set_stats', payload: stats });
    },
    [dispatch],
  );

  return {
    ...state,
    setGame,
    setModal,
    setStats,
  };
};

export { WordleProvider, useWordleState };
