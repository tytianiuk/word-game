'use client';

import fenToBoard from '../utils/fenToBoard';

interface BoardProps {
  size: number;
  fen: string;
  selectedCell: { x: number; y: number } | null;
  onSelectCell: (cell: { x: number; y: number }) => void;
}

const Board = ({ size, fen, selectedCell, onSelectCell }: BoardProps) => {
  const board = fenToBoard(fen);

  return (
    <div className="card p-6">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.map((row, y) =>
          row.map((letter, x) => (
            <button
              key={`${y}-${x}`}
              onClick={() => {
                if (!letter) onSelectCell({ x, y });
              }}
              className={`w-20 h-20 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                selectedCell?.x === x && selectedCell?.y === y
                  ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                  : letter
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {letter}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
