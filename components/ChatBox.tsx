import React, { useState, useEffect, useRef } from 'react';
import { fetchChatHistory, sendPersistentMessage, initChatWithHistory, ChatMessage } from '@/lib/chatPresence';

interface ChatBoxProps {
  roomId: string;
  userId: string;
  userName: string;
  chatTitle?: string; // Titolo dinamico (es. Nome Atleta o "Chat con il Coach")
}

export default function ChatBox({ roomId, userId, userName, chatTitle }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      const history = await fetchChatHistory(roomId);
      if (isMounted) {
        setMessages(history);
      }
    }
    loadHistory();

    const cleanup = initChatWithHistory({
      roomId,
      userId,
      userName,
      onNewMessage: (msg) => {
        setMessages((prev) => {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData: ChatMessage = {
      room_id: roomId,
      sender_id: userId,
      receiver_id: roomId,
      message: inputText.trim(),
      sender_name: userName, // Salviamo il nome di chi invia!
    };

    setInputText('');
    await sendPersistentMessage(messageData);
  };

  return (
    <div className="flex flex-col h-[550px] bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white shadow-xl">
      {/* Intestazione */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <div>
          <h3 className="font-extrabold text-sm text-white">
            {chatTitle || 'Chat & Assistenza Top Gym'}
          </h3>
          <p className="text-[10px] text-zinc-400">Canale sicronizzato in tempo reale</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700/50">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-zinc-300">{onlineUsers.length} online</span>
        </div>
      </div>

      {/* Lista Messaggi */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
        {messages.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-20">Nessun messaggio in questa chat. Inizia a scrivere!</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === userId;
            return (
              <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Nome del mittente visibile se non sei tu */}
                {!isMe && (
                  <span className="text-[10px] font-bold text-zinc-400 mb-0.5 px-1">
                    {msg.sender_name || 'Utente'}
                  </span>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                    isMe ? 'bg-[#E50914] text-white rounded-br-sm' : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/45'
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-zinc-800/80">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 bg-zinc-800/90 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E50914]"
        />
        <button
          type="submit"
          className="bg-[#E50914] hover:bg-[#b80710] px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg"
        >
          Invia
        </button>
      </form>
    </div>
  );
}