import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import Message from '../components/message';

const Lobby = () => {
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    localStorage.setItem('username', name);
    socket.emit('createRoom', (newRoomId: string) => {
      navigate(`/game/${newRoomId}`);
    });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) return;
    localStorage.setItem('username', name);
    socket.emit(
      'joinRoom',
      { name, roomId },
      (success: boolean, msg: string) => {
        if (success) navigate(`/game/${roomId}`);
        showMessage(msg);
      }
    );
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-2xl font-bold">Лоббі</h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше ім'я"
          className="border rounded px-3 py-2 w-full"
        />

        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          Створити кімнату
        </button>

        <div className="border-t pt-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ID кімнати"
            className="border rounded px-3 py-2 w-full mb-2"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full bg-green-500 text-white px-4 py-2 rounded"
          >
            Приєднатися
          </button>
        </div>
      </div>
      {message && <Message message={message!} />}
    </div>
  );
};

export default Lobby;
