import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import generateRoomId from '../src/utils/generateRoomId.ts';
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let rooms = {};

io.on('connection', (socket) => {
  const { userId } = socket.handshake.auth;
  console.log(`✅ Клієнт підключився: (userId=${userId})`);

  let currentRoom = null;

  socket.on('createRoom', (callback) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
      fen: '00000/00000/ТРАВА/00000/00000',
      players: [],
    };
    socket.join(roomId);
    currentRoom = roomId;
    socket.emit('roomCreated', roomId);
    callback(roomId);
  });

  socket.on('joinRoom', ({ roomId, name }, callback) => {
    const room = rooms[roomId];
    if (!room) {
      callback(false, '❌ Такої кімнати не існує');
      return;
    }

    let player = room.players.find((p) => p.id === userId);
    if (!player) {
      if (room.players.length >= 2) {
        callback(false, '❌ На жаль, гра вже триває');
        return;
      }

      player = { id: userId, name, words: [], socketId: socket.id };
      room.players.push(player);
    } else {
      player.socketId = socket.id;
      player.name = name;
    }

    socket.join(roomId);
    currentRoom = roomId;

    socket.emit('fen', room.fen);
    io.to(roomId).emit('players', room.players);
    callback(true);
  });

  socket.on('move', ({ fen, word }) => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    if (!room) return;

    room.fen = fen;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (player) {
      player.words.push(word);
    }

    io.to(currentRoom).emit('fen', room.fen);
    io.to(currentRoom).emit('players', room.players);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Користувач відключився: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Сервер запущено на http://localhost:3000');
});
