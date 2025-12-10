import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create_room', (data, callback) => {
    const { roomId, playerName } = data;

    if (rooms.has(roomId)) {
      callback({ success: false, message: 'Room already exists' });
      return;
    }

    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName, words: [], score: 0 }],
      fen: '00000/00000/ТРАВА/00000/00000',
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
        currentTurn: room.currentTurn,
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
      const currentTurn = room.players.find(
        (p) => p.name === room.currentTurn
      )?.name;
      socket.emit('game_joined', {
        currentTurn,
        players: room.players,
        fen: room.fen,
      });
    }
  });

  socket.on('place_word', (data) => {
    const { roomId, fen, name, word } = data;
    const room = rooms.get(roomId);

    if (room) {
      room.fen = fen;

      room.players.forEach((p) => {
        if (p.name === name) {
          p.words.push(word);
          p.score += word.length;
          return;
        }
      });

      const scores = room.players.map((p) => p.score);
      io.to(roomId).emit('board_updated', {
        fen,
        scores,
        players: room.players,
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
