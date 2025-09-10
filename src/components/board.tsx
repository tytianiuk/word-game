'use client';
import { useState, useEffect } from 'react';
import fenToBoard from '../utils/fenToBoard';

type BoardProps = {
  size: number;
  setSelectedCell: (pos: { x: number; y: number }) => void;
  selectedCell: { x: number; y: number } | null;
  fen: string;
};

const Board = ({ size, setSelectedCell, selectedCell, fen }: BoardProps) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{ y: number; x: number } | null>(
    selectedCell
  );

  useEffect(() => {
    setGrid(fenToBoard(fen));
    setSelected(selectedCell);
  }, [fen, selectedCell]);

  const handleClick = (row: number, col: number) => {
    if (grid[row][col] === '') {
      setSelectedCell({ x: col, y: row });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid border-4 border-gray-400 shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: 600,
          height: 600,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isSelected = selected?.y === y && selected?.x === x;
            return (
              <div
                key={`${y}-${x}`}
                onClick={() => handleClick(y, x)}
                className={`flex items-center justify-center border text-3xl font-bold cursor-pointer select-none 
                  ${isSelected ? 'border-4 border-red-600' : 'border-gray-700'}
                  ${cell === '' ? 'bg-white' : 'bg-gray-100'}
                  aspect-square
                `}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
