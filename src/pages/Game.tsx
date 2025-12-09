'use client';

import { useState, useEffect, type SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initSocket, getSocket } from '../lib/socket';
import Board from '../components/board';
import PlayerCard from '../components/player-card';
import WordForm from '../components/word-form';
import ScoreDisplay from '../components/score';
import type { Player } from '../types/player';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fen, setFen] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [score, setScore] = useState([0, 0]);
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const username = localStorage.getItem('username') || 'Player';

  useEffect(() => {
    const socket = initSocket();

    socket.emit('game_ready', { roomId, username });

    socket.on('game_joined', (data) => {
      setCurrentPlayerId(data.playerId);
      setPlayers(data.players);
      setFen(data.fen);
    });

    socket.on('player_joined', (data) => {
      setPlayers(data.players);
    });

    socket.on('board_updated', (data) => {
      setPlayers(data.players);
      setFen(data.fen);
      setScore(data.scores);
    });

    socket.on('game_error', (data) => {
      console.error('Game error:', data.message);
    });

    return () => {
      socket.off('game_joined');
      socket.off('player_joined');
      socket.off('board_updated');
    };
  }, [roomId]);

  const handleLeaveGame = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('leave_room', { roomId });
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Word Master</h1>
            <p className="text-sm text-muted-foreground">Кімната: {roomId}</p>
          </div>
          <button
            onClick={handleLeaveGame}
            className="btn-outline text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            Вийти з гри
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-2">
            {players[0] && (
              <PlayerCard
                player={players[0]}
                isCurrentPlayer={currentPlayerId === players[0].name}
                score={score[0]}
              />
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ScoreDisplay
              scores={score}
              playerNames={players.map((p) => p.name)}
            />

            <div className="flex justify-center">
              <Board
                size={5}
                fen={fen}
                selectedCell={selectedCell}
                onSelectCell={setSelectedCell}
              />
            </div>

            <WordForm
              selectedCell={selectedCell}
              fen={fen}
              onWordPlaced={(newFen: SetStateAction<string>, word: string) => {
                setFen(newFen);
                const socket = getSocket();
                if (socket) {
                  socket.emit('place_word', {
                    roomId,
                    name: username,
                    fen: newFen,
                    word,
                  });
                }
                setSelectedCell(null);
              }}
            />
          </div>

          <div className="lg:col-span-2">
            {players[1] && (
              <PlayerCard
                player={players[1]}
                isCurrentPlayer={currentPlayerId === players[1].name}
                score={score[1]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
