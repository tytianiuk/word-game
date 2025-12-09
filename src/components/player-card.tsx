import type { Player } from '../types/player';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  score: number;
}

const PlayerCard = ({ player, isCurrentPlayer, score }: PlayerCardProps) => {
  return (
    <div
      className={`card ${
        isCurrentPlayer ? 'border-primary border-2 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{player.name}</h3>
          {isCurrentPlayer && (
            <p className="text-xs text-primary font-semibold">Ваш хід</p>
          )}
        </div>
        <div
          className={`px-3 py-1 rounded-full font-bold ${
            isCurrentPlayer
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {score}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-semibold">Слова:</p>
        <div className="flex flex-wrap gap-2">
          {player.words.map((word, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-semibold"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
