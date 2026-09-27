import React, { useState, useEffect, useRef } from 'react';
import { initChatAndPresence, sendChatMessage } from '@/lib/chatPresence';

interface ChatBoxProps {
  roomId: string;      // ID della stanza o dell'utente (es. l'id del cliente o del coach)
  userId: string;      // ID dell'utente connesso
  userName: string;    // Nome dell'utente connesso
}

export default function ChatBox({ roomId, userId, userName }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inizializza Realtime Chat & Presence
    const cleanup = initChatAndPresence({
      roomId,
      userId,
      userName,
      onNewMessage: (msg) => {
        setMessages((prev) => [...prev, msg]);
      },
      onPresenceSync: (state) => {
        // Estrae tutti gli utenti attualmente connessi alla stanza
        const users = Object.values(state).flat();
        setOnlineUsers(users);
      },
    });

    return () => {
      cleanup();
    };
  }, [roomId, userId, userName]);

  // Autoscroll verso l'ultimo messaggio
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      sender_id: userId,
      receiver_id: roomId,
      message: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    // Invia il messaggio in tempo reale via Broadcast
    await sendChatMessage(roomId, messageData);

    // Aggiunge il messaggio anche localmente alla lista
    setMessages((prev) => [...prev, messageData]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white shadow-lg">
      {/* Intestazione con indicatore di Presenza (Utenti online) */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <h3 className="font-bold text-sm">Chat Assistenza / Coaching</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>{onlineUsers.length} online</span>
        </div>
      </div>

      {/* Lista dei messaggi */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-3">
        {messages.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-10">Nessun messaggio. Inizia la conversazione!</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === userId;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    isMe ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input di invio */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Invia
        </button>
      </form>
    </div>
  );
}