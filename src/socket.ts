import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

let userId = localStorage.getItem('userId');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('userId', userId);
}

export const socket = io('http://localhost:3000', {
  autoConnect: false,
  auth: { userId },
});

socket.connect();
