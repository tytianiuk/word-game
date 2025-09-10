import Score from './components/score';
import Board from './components/board';
import WordForm from './components/word-form';
import PlayerContainer from './components/player-container';

const mockScore = [5, 10];
const App = () => {
  return (
    <div className="flex min-h-screen">
      <PlayerContainer />
      <div className="flex-2 grid gap-4 justify-items-center">
        <Score score={mockScore} />
        <Board />
        <WordForm />
      </div>
      <PlayerContainer />
    </div>
  );
};

export default App;
