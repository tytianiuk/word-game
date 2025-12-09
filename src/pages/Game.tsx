import Score from '../components/score';
import Board from '../components/board';
import WordForm from '../components/word-form';
import PlayerContainer from '../components/player-container';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import calculateScore from '../utils/calculateScore';
import type { Player } from '../types/player';

const Game = () => {
  const { roomId } = useParams(); // беремо ID кімнати з URL
  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fen, setFen] = useState('00000/00000/ТРАВА/00000/00000');
  const [players, setPlayers] = useState<Player[]>([]);
  const [score, setScore] = useState<number[]>([0, 0]);

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (!name || !roomId) return;

    socket.emit('joinRoom', { name, roomId }, (success: boolean) => {
      if (!success) alert('❌ Помилка при приєднанні до кімнати!');
    });

    socket.on('fen', setFen);
    socket.on('players', setPlayers);

    return () => {
      socket.off('fen');
      socket.off('players');
    };
  }, [roomId]);

  useEffect(() => {
    setScore(calculateScore(players));
  }, [players]);

  return (
    <div className="flex min-h-screen">
      <PlayerContainer player={players[0]} />
      <div className="flex-2 grid gap-4 justify-items-center">
        <Score score={score} />
        <Board
          size={5}
          setSelectedCell={setSelectedCell}
          selectedCell={selectedCell}
          fen={fen}
          isSpectator={false}
        />
        <WordForm
          selectedCell={selectedCell}
          fen={fen}
          setFen={setFen}
          setSelectedCell={setSelectedCell}
        />
      </div>
      <PlayerContainer player={players[1]} />
    </div>
  );
};

export default Game;
