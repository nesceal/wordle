import { KeyList } from '../../lib/constants';
import { KeyStatus } from '../../lib/enums';
import { BackspaceIcon } from '../../lib/icons';

import styles from './index.module.scss';

interface KeyboardProps {
  keyResults: { [letter: string]: KeyStatus };
  onDelete: () => void;
  onEnter: () => void;
  onKey: (key: string) => void;
}

const Keyboard = ({ keyResults, onDelete, onEnter, onKey }: KeyboardProps) => {
  const renderKey = (letter: string) => {
    const isBackspace = letter === 'Backspace';
    const isEnter = letter === 'Enter';

    const colorClass = keyResults[letter] ? styles[keyResults[letter]] : undefined;

    const styleClass = isBackspace
      ? [styles.backspace, colorClass].filter(Boolean).join(' ')
      : isEnter
      ? [styles.enter, colorClass].filter(Boolean).join(' ')
      : colorClass;

    return (
      <button
        key={letter}
        className={styleClass}
        onClick={() => {
          if (isBackspace) onDelete();
          else if (isEnter) onEnter();
          else onKey(letter);
        }}>
        {isBackspace ? <BackspaceIcon /> : letter}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      {KeyList.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map(id => renderKey(id))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
