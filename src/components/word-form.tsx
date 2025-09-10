import { useState } from 'react';
import isValidMove from '../utils/isValidMove';
import changeFen from '../utils/changeFen';
import fenToBoard from '../utils/fenToBoard';
import Message from './message';
import { localDictionary } from '../utils/constants';

type WordFormProps = {
  selectedCell: { x: number; y: number } | null;
  fen: string;
  setFen: (fen: string) => void;
  setSelectedCell: (pos: { x: number; y: number } | null) => void;
};

const WordForm = ({
  selectedCell,
  fen,
  setFen,
  setSelectedCell,
}: WordFormProps) => {
  const [letter, setLetter] = useState('');
  const [word, setWord] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1500);
  };

  const makeMove = () => {
    if (!selectedCell) return;

    const upperWord = word.toUpperCase();
    const newFen = changeFen(selectedCell, fen, letter);
    const boardArr = fenToBoard(newFen);

    if (!localDictionary.includes(upperWord)) {
      showMessage(`❌ Слова "${upperWord}" немає у словнику`);
      return;
    }

    if (!isValidMove(boardArr, upperWord, selectedCell)) {
      showMessage(`❌ Слово "${upperWord}" неможливо викласти на дошку`);
      return;
    }

    setFen(newFen);
    setLetter('');
    setWord('');
    setSelectedCell(null);
  };

  return (
    <>
      <form
        className="flex gap-4 items-center bg-white py-6 rounded-xl shadow-lg w-4/5 text-3xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          makeMove();
        }}
      >
        <input
          type="text"
          name="letter-input"
          id="letter-input"
          maxLength={1}
          required
          value={letter}
          placeholder="А"
          autoComplete="off"
          onChange={(e) => setLetter(e.target.value.toUpperCase())}
          className="w-[64px] text-center px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <input
          type="text"
          name="word-input"
          id="word-input"
          required
          placeholder="Введіть слово"
          value={word}
          autoComplete="off"
          onChange={(e) => setWord(e.target.value.toUpperCase())}
          className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <input
          disabled={!word || !letter || !selectedCell}
          type="submit"
          value="✔️"
          className="px-3 py-3 border border-gray-300 text-white font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
        />
      </form>

      {message && <Message message={message!} />}
    </>
  );
};

export default WordForm;
