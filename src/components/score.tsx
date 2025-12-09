interface ScoreProps {
  scores: number[];
  playerNames: string[];
}

const Score = ({ scores, playerNames }: ScoreProps) => {
  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-4">
        {playerNames.map((name, idx) => (
          <div
            key={idx}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
          >
            <p className="text-sm text-muted-foreground font-semibold mb-1">
              {name}
            </p>
            <p className="text-4xl font-black text-primary">{scores[idx]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Score;
