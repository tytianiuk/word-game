/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initSocket } from '../lib/socket';
import generateRoomId from '../utils/generateRoomId';

export default function Lobby() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [message, setMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showMessage = (msg: string, type: 'error' | 'success' = 'error') => {
    setMessage({ type, text: msg });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      showMessage("Будь ласка, введіть своє ім'я", 'error');
      return;
    }
    setLoading(true);
    localStorage.setItem('username', name);

    const socket = initSocket();
    const newRoomId = generateRoomId();

    socket.emit(
      'create_room',
      { roomId: newRoomId, playerName: name },
      (response: any) => {
        if (response.success) {
          navigate(`/game/${newRoomId}`);
        } else {
          showMessage('Помилка при створенні кімнати', 'error');
          setLoading(false);
        }
      }
    );
  };

  const handleJoinRoom = async () => {
    if (!name.trim() || !roomId.trim()) {
      showMessage("Будь ласка, введіть ім'я та ID кімнати", 'error');
      return;
    }
    setLoading(true);
    localStorage.setItem('username', name);

    const socket = initSocket();
    socket.emit(
      'join_room',
      { roomId: roomId.toUpperCase(), playerName: name },
      (response: any) => {
        if (response.success) {
          navigate(`/game/${roomId.toUpperCase()}`);
        } else {
          showMessage(
            response.message || 'Помилка при входженні в кімнату',
            'error'
          );
          setLoading(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-cyan-50 dark:via-purple-900/20 dark:to-cyan-900/20 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
          Word Master
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Змагайся зі своїм другом у грі на розміщення слів на сітці 5×5
        </p>
      </div>

      <div className="w-full max-w-md card shadow-2xl border-2 border-primary/20">
        <div className="p-8">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Створити
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'join'
                  ? 'bg-accent text-accent-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Приєднатися
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Ваше ім'я
              </label>
              <input
                type="text"
                placeholder="Введіть своє ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            {activeTab === 'join' && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  ID кімнати
                </label>
                <input
                  type="text"
                  placeholder="Введіть ID кімнати"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                />
              </div>
            )}

            <button
              onClick={
                activeTab === 'create' ? handleCreateRoom : handleJoinRoom
              }
              disabled={loading || !name.trim()}
              className={`w-full py-3 font-semibold text-base rounded-lg transition-all ${
                activeTab === 'create' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {loading
                ? 'Завантаження...'
                : activeTab === 'create'
                ? 'Створити кімнату'
                : 'Приєднатися'}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                message.type === 'error'
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-accent/20 text-accent'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center text-muted-foreground max-w-md">
        <p className="text-sm">
          Розміщуйте слова на сітці, набирайте очки та перевершуйте свого
          суперника!
        </p>
      </div>
    </div>
  );
}
