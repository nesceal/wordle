import { WordleStatus } from '../../lib/enums';
import styles from './index.module.scss';

interface NoticeProps {
  answer: string;
  currentGuess: string;
  status: WordleStatus;
  onResume: () => void;
}

const Notice = ({ answer, currentGuess, status, onResume }: NoticeProps) => {
  return (
    <div className={styles.container}>
      {status === WordleStatus.Answered && (
        <p className={styles.note}>Great job! Press ENTER to play again.</p>
      )}
      {status === WordleStatus.Completed && (
        <p className={styles.note}>
          Answer: <span className={styles.answer}>{answer}</span>. Press ENTER
          to play again.
        </p>
      )}
      {status === WordleStatus.InvalidGuess && (
        <p className={`${styles.note} ${styles.noteFade}`} onAnimationEnd={onResume}>
          <span className={styles.answer}>{currentGuess}</span>
          <span>does not have enough letters.</span>
        </p>
      )}
      {status === WordleStatus.InvalidWord && (
        <p className={`${styles.note} ${styles.noteFade}`} onAnimationEnd={onResume}>
          <span className={styles.answer}>{currentGuess}</span>
          <span>is not in the dictionary.</span>
        </p>
      )}
    </div>
  );
};

export default Notice;
