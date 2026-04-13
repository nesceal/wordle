import { useCallback, useEffect, useState } from 'react';

import { useWordleState } from '../../context';
import { useWordle } from '../../hooks/useWordle';

import AnswerGrid from '../grid';
import Keyboard from '../keyboard';
import Loading from '../loading';
import Notice from '../notice';

import { MaxAttempts, WordLength } from '../../lib/constants';
import { KeyStatus, WordleStatus } from '../../lib/enums';
import { Guess } from '../../lib/types';

const Wordle = () => {
  const [isDataSaved, setIsDataSaved] = useState(false);
  const { stats, setStats } = useWordleState();

  const {
    answer,
    currentGuess,
    guesses,
    keyResults,
    status,
    onDelete,
    onEnter,
    onKey,
    onReset,
    onResume,
  } = useWordle();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Enter') {
        onEnter();
      } else if (key === 'Backspace') {
        onDelete();
      } else if (/^[a-zA-Z]$/.test(key)) {
        onKey(key.toLowerCase());
      }
    },
    [onDelete, onEnter, onKey]
  );

  useEffect(() => {
    // generate a new answer for wordle
    onReset();

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!stats || isDataSaved) return;

    if (status === WordleStatus.Answered) {
      setIsDataSaved(true);
      const newDistribution = [...stats.distribution];
      newDistribution[guesses.length - 1] += 1;

      setStats({
        currentStreak: stats.currentStreak + 1,
        distribution: newDistribution,
        maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
        totalPlayed: stats.totalPlayed + 1,
        totalWon: stats.totalWon + 1,
      });
    } else if (status === WordleStatus.Completed) {
      setIsDataSaved(true);
      setStats({
        currentStreak: 0,
        distribution: [...stats.distribution],
        maxStreak: stats.maxStreak,
        totalPlayed: stats.totalPlayed + 1,
        totalWon: stats.totalWon,
      });
    }
  }, [guesses.length, isDataSaved, stats, status, setStats]);

  useEffect(() => {
    if (status === WordleStatus.Playing && isDataSaved) {
      setIsDataSaved(false);
    }
  }, [isDataSaved, status]);

  if (!stats) return <Loading />;

  const initialGuessResult = Array(WordLength).fill(KeyStatus.Default);

  // + 1 to take into account the current guess
  const fillLength = MaxAttempts - (guesses.length + 1);
  const fillArray: Guess[] =
    fillLength > 0
      ? Array(fillLength).fill({
          word: '',
          result: initialGuessResult,
        })
      : [];

  const currentGuessArray: Guess[] =
    guesses.length < MaxAttempts
      ? [
          {
            word: currentGuess,
            result: initialGuessResult,
          },
        ]
      : [];

  const guessesArray: Guess[] = [
    ...guesses,
    ...currentGuessArray,
    ...fillArray,
  ];

  return (
    <div>
      <Notice
        answer={answer}
        currentGuess={currentGuess}
        status={status}
        onResume={onResume}
      />
      <AnswerGrid
        currentTurn={guesses.length}
        guesses={guessesArray}
        status={status}
      />
      <Keyboard
        keyResults={keyResults}
        onDelete={onDelete}
        onEnter={onEnter}
        onKey={onKey}
      />
    </div>
  );
};

export default Wordle;
