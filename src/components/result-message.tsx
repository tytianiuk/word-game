interface ResultMessageProps {
  gameResult: {
    winner: string;
    winnerScore: number;
    players: { name: string; score: number; words: string[] }[];
  };
  handleLeaveGame: () => void;
}

const ResultMessage = ({ gameResult, handleLeaveGame }: ResultMessageProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card p-8 max-w-md w-full space-y-6 text-center">
        <h2 className="text-3xl font-bold text-primary">Гра закінчена!</h2>

        <div className="space-y-2">
          <p className="text-lg font-semibold">
            Переможець:{' '}
            <span className="text-green-600">{gameResult.winner}</span>
          </p>
          <p className="text-muted-foreground">
            Очки:{' '}
            <span className="font-bold text-foreground">
              {gameResult.winnerScore}
            </span>
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="font-semibold">Результати:</h3>
          {gameResult.players.map((player) => (
            <div
              key={player.name}
              className="flex justify-between items-center bg-muted/50 p-3 rounded"
            >
              <span className="font-medium">{player.name}</span>
              <span className="text-sm text-muted-foreground">
                {player.score} очок ({player.words.length} слів)
              </span>
            </div>
          ))}
        </div>

        <button onClick={handleLeaveGame} className="btn btn-primary w-full">
          На лобі
        </button>
      </div>
    </div>
  );
};

export default ResultMessage;
