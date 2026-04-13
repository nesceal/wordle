import { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Footer, Header, Landing, Loading, Modal, Wordle } from './components';
import { useWordleState } from './context';
import { GameStatus } from './lib/enums';

import styles from './app.module.scss';

Chart.register(...registerables, ChartDataLabels);

const App = () => {
  const { gameStatus, stats, setStats } = useWordleState();

  useEffect(() => {
    const initialState = {
      currentStreak: 0,
      distribution: new Array(6).fill(0),
      maxStreak: 0,
      totalPlayed: 0,
      totalWon: 0,
    };

    const prevStats = localStorage.getItem('nai-react-wordle');

    if (!prevStats) setStats(initialState);
    else setStats(JSON.parse(prevStats));
  }, [setStats]);

  return (
    <main className={styles.app}>
      <Modal />
      <div className={styles.page}>
        {!stats && <Loading />}
        {stats && (
          <>
            <Header />
            <div className={styles.content}>
              {gameStatus === GameStatus.Overview && <Landing />}
              {gameStatus === GameStatus.Playing && <Wordle />}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default App;
