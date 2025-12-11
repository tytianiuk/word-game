import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const rooms = new Map();
const playerSessions = new Map();

let ukrainianWords = new Set();
let fiveLetterWords = [];

try {
  const wordsData = fs.readFileSync('public/ukrainian-words.txt', 'utf-8');
  const words = wordsData.toLowerCase().match(/[а-яіїєґ]+/g) || [];
  ukrainianWords = new Set(words);
  fiveLetterWords = words.filter((word) => word.length === 5);
} catch (error) {
  console.error('Error loading words dictionary:', error);
}

const getRandomFiveLetterWord = () => {
  if (fiveLetterWords.length === 0) return null;
  return fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
};

const placeWordInCenter = (word) => {
  const rows = ['00000', '00000', '00000', '00000', '00000'];
  if (word && word.length === 5) {
    rows[2] = word.toLowerCase();
  }
  return rows.join('/');
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create_room', (data, callback) => {
    const { roomId, playerName } = data;

    if (rooms.has(roomId)) {
      callback({ success: false, message: 'Room already exists' });
      return;
    }

    const centerWord = getRandomFiveLetterWord();
    const fen = placeWordInCenter(centerWord);

    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName, words: [], score: 0 }],
      fen: fen,
      currentTurn: playerName,
    };

    rooms.set(roomId, room);
    playerSessions.set(`${roomId}_${playerName}`, {
      socketId: socket.id,
      roomId,
      playerName,
      createdAt: Date.now(),
    });
    socket.join(roomId);
    callback({ success: true, roomId });
  });

  socket.on('join_room', (data, callback) => {
    const { roomId, playerName } = data;

    if (!rooms.has(roomId)) {
      callback({ success: false, message: 'Room not found' });
      return;
    }

    const room = rooms.get(roomId);

    if (room.players.length >= 2) {
      callback({ success: false, message: 'Room is full' });
      return;
    }

    room.players.push({ id: socket.id, name: playerName, words: [], score: 0 });
    playerSessions.set(`${roomId}_${playerName}`, {
      socketId: socket.id,
      roomId,
      playerName,
      createdAt: Date.now(),
    });
    socket.join(roomId);

    io.to(roomId).emit('player_joined', { players: room.players });
    callback({ success: true, roomId });
  });

  socket.on('rejoin_room', (data, callback) => {
    const { roomId, playerName } = data;
    const room = rooms.get(roomId);

    if (!room) {
      if (callback) callback({ success: false, message: 'Room not found' });
      return;
    }

    const player = room.players.find((p) => p.name === playerName);

    if (!player) {
      if (callback)
        callback({ success: false, message: 'Player not found in room' });
      return;
    }

    player.id = socket.id;
    playerSessions.set(`${roomId}_${playerName}`, {
      socketId: socket.id,
      roomId,
      playerName,
      createdAt: Date.now(),
    });

    socket.join(roomId);
    const scores = room.players.map((p) => p.score);

    if (callback) {
      callback({
        success: true,
        players: room.players,
        fen: room.fen,
        scores,
        currentTurn: room.currentTurn,
      });
    } else {
      socket.emit('game_joined', {
        playerId: room.currentTurn,
        players: room.players,
        fen: room.fen,
      });
    }

    io.to(roomId).emit('player_rejoined', { players: room.players });
  });

  socket.on('game_ready', (data, callback) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (room) {
      const playerId = room.players.find(
        (p) => p.name === room.currentTurn
      )?.name;
      socket.emit('game_joined', {
        playerId,
        players: room.players,
        fen: room.fen,
      });
    }
  });

  socket.on('place_word', (data) => {
    const { roomId, fen, name, word } = data;
    const room = rooms.get(roomId);

    if (room) {
      if (room.currentTurn !== name) {
        console.log(
          `Invalid move: ${name} tried to play but it's ${room.currentTurn}'s turn`
        );
        return;
      }

      room.fen = fen;

      room.players.forEach((p) => {
        if (p.name === name) {
          p.words.push(word);
          p.score += word.length;
          return;
        }
      });

      const hasEmptyCells = fen.includes('0');

      if (!hasEmptyCells) {
        const winner = room.players.reduce((max, current) =>
          current.score > max.score ? current : max
        );

        const gameResult = {
          isGameOver: true,
          winner: winner.name,
          winnerScore: winner.score,
          players: room.players.map((p) => ({
            name: p.name,
            score: p.score,
            words: p.words,
          })),
        };

        io.to(roomId).emit('game_over', gameResult);
        return;
      }

      const currentPlayerIndex = room.players.findIndex(
        (p) => p.name === room.currentTurn
      );
      const nextPlayerIndex = (currentPlayerIndex + 1) % room.players.length;
      room.currentTurn = room.players[nextPlayerIndex].name;

      const scores = room.players.map((p) => p.score);
      io.to(roomId).emit('board_updated', {
        fen,
        scores,
        players: room.players,
        currentTurn: room.currentTurn,
      });
    }
  });

  socket.on('leave_room', (data) => {
    const { roomId } = data;
    socket.leave(roomId);
    const room = rooms.get(roomId);

    if (room) {
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        io.to(roomId).emit('player_left', { players: room.players });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        console.log(
          `Player ${room.players[playerIndex].name} disconnected from room ${roomId}`
        );
      }
    }
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
