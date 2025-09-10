import Score from './components/score';
import Board from './components/board';
import WordForm from './components/word-form';
import PlayerContainer from './components/player-container';
import { useState } from 'react';
import { mockFen } from './utils/constants';
const mockScore = [5, 10];
const App = () => {
  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fen, setFen] = useState<string>(mockFen);
  return (
    <div className="flex min-h-screen">
      <PlayerContainer />
      <div className="flex-2 grid gap-4 justify-items-center">
        <Score score={mockScore} />
        <Board
          size={5}
          setSelectedCell={setSelectedCell}
          selectedCell={selectedCell}
          fen={fen}
        />
        <WordForm
          selectedCell={selectedCell}
          fen={fen}
          setFen={setFen}
          setSelectedCell={setSelectedCell}
        />
      </div>
      <PlayerContainer />
    </div>
  );
};

export default App;
