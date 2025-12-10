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
  const [currentTurn, setCurrentTurn] = useState('');
  const username = localStorage.getItem('username') || 'Player';

  useEffect(() => {
    const socket = initSocket();
    const savedRoomId = localStorage.getItem('roomId');
    const savedUsername = localStorage.getItem('username');

    if (savedRoomId && savedRoomId === roomId && savedUsername) {
      socket.emit(
        'rejoin_room',
        {
          roomId,
          playerName: savedUsername,
        },
        (response: {
          success: boolean;
          players: Player[];
          fen: string;
          scores: number[];
          currentTurn: string;
          message?: string;
        }) => {
          if (response.success) {
            setCurrentTurn(response.currentTurn);
            setPlayers(response.players);
            setFen(response.fen);
            setScore(response.scores);
          } else {
            console.error('Rejoin failed:', response.message);
            localStorage.removeItem('roomId');
            localStorage.removeItem('username');
            navigate('/');
          }
        }
      );
    } else {
      socket.emit('game_ready', { roomId, username });
      localStorage.setItem('roomId', roomId || '');
    }

    socket.on('game_joined', (data) => {
      setCurrentTurn(data.playerId);
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
      setCurrentTurn(data.currentTurn);
    });

    socket.on('game_error', (data) => {
      console.error('Game error:', data.message);
    });

    return () => {
      socket.off('game_joined');
      socket.off('player_joined');
      socket.off('board_updated');
    };
  }, [roomId, players]);

  const handleLeaveGame = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('leave_room', { roomId });
    }
    localStorage.removeItem('roomId');
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
                isCurrentPlayer={currentTurn === players[0].name}
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
                isCurrentTurn={currentTurn === username}
              />
            </div>

            {currentTurn === username && (
              <WordForm
                selectedCell={selectedCell}
                fen={fen}
                onWordPlaced={(
                  newFen: SetStateAction<string>,
                  word: string
                ) => {
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
            )}

            {currentTurn !== username && (
              <div className="card p-4 text-center text-muted-foreground">
                Очікування ходу гравця:{' '}
                <span className="font-semibold text-foreground">
                  {currentTurn}
                </span>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {players[1] && (
              <PlayerCard
                player={players[1]}
                isCurrentPlayer={currentTurn === players[1].name}
                score={score[1]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
