'use client';

import type React from 'react';

import { Dispatch, SetStateAction, useState } from 'react';
import isValidMove from '../utils/isValidMove';
import changeFen from '../utils/changeFen';
import fenToBoard from '../utils/fenToBoard';

interface WordFormProps {
  selectedCell: { x: number; y: number } | null;
  fen: string;
  formError?: string;
  setFormError: Dispatch<SetStateAction<string>>;
  onWordPlaced: (newFen: string, word: string) => void;
}

const WordForm = ({
  selectedCell,
  fen,
  formError,
  setFormError,
  onWordPlaced,
}: WordFormProps) => {
  const [word, setWord] = useState('');
  const [newLetter, setNewLetter] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormError('');
    const wordUpper = word.toUpperCase();
    const newFen = changeFen(selectedCell!, fen, newLetter);
    const board = fenToBoard(newFen);

    if (!isValidMove(board, wordUpper, selectedCell!)) {
      setError('Неможливий хід');
      return;
    }

    onWordPlaced(newFen, word);
    setWord('');
  };

  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/8">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Нова буква
          </label>
          <input
            type="text"
            value={newLetter}
            onChange={(e) =>
              setNewLetter(e.target.value.slice(0, 1).toUpperCase())
            }
            maxLength={1}
            placeholder="А"
            className="w-full px-4 py-2 text-center text-lg font-bold bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="w-7/8">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Ваше слово
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            placeholder="Введіть слово укр. мовою"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {displayError && (
        <p className="text-sm text-destructive font-semibold">{displayError}</p>
      )}

      <button
        type="submit"
        disabled={!word.trim() || !newLetter.trim() || !selectedCell}
        className="btn-primary w-full"
      >
        Розмістити слово
      </button>
    </form>
  );
};
export default WordForm;
