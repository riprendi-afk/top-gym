import React, { useState, useEffect, useRef } from 'react';
import { fetchChatHistory, sendPersistentMessage, initChatWithHistory, ChatMessage } from '@/lib/chatPresence';

interface ChatBoxProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function ChatBox({ roomId, userId, userName }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Carica lo storico iniziale dal database
    async function loadHistory() {
      const history = await fetchChatHistory(roomId);
      if (isMounted) {
        setMessages(history);
      }
    }
    loadHistory();

    // 2. Inizializza Realtime e Presence
    const cleanup = initChatWithHistory({
      roomId,
      userId,
      userName,
      onNewMessage: (msg) => {
        setMessages((prev) => {
          // Evita duplicati se il messaggio è già presente
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      },
      onPresenceSync: (state) => {
        const users = Object.values(state).flat();
        setOnlineUsers(users);
      },
    });

    return () => {
      isMounted = false;
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

    const messageData: ChatMessage = {
      room_id: roomId,
      sender_id: userId,
      receiver_id: roomId, // o l'id del destinatario specifico
      message: inputText.trim(),
    };

    setInputText('');
    
    // Invia e salva nel database (il realtime aggiornerà automaticamente la UI)
    await sendPersistentMessage(messageData);
  };

  return (
    <div className="flex flex-col h-[500px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white shadow-lg">
      {/* Intestazione con Indicatore di Presenza */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <h3 className="font-bold text-sm">Chat & Assistenza Top Gym</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>{onlineUsers.length} online</span>
        </div>
      </div>

      {/* Lista dei messaggi (Storico + Realtime) */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 mb-3">
        {messages.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-16">Nessun messaggio precedente. Inizia la conversazione!</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === userId;
            return (
              <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-xl text-sm shadow-sm ${
                    isMe ? 'bg-[#E50914] text-white' : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[10px] text-zinc-500 mt-0.5 px-1">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ora'}
                </span>
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
          placeholder="Scrivi un messaggio al coach..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E50914]"
        />
        <button
          type="submit"
          className="bg-[#E50914] hover:bg-[#b80710] px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow"
        >
          Invia
        </button>
      </form>
    </div>
  );
}