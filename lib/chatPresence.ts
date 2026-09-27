import { supabase } from './store';

interface ChatMessage {
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: string;
}

/**
 * 1. Inizializza un canale di chat e presenza in tempo reale per un utente/stanza
 */
export function initChatAndPresence({
  roomId,
  userId,
  userName,
  onNewMessage,
  onPresenceSync,
}: {
  roomId: string;
  userId: string;
  userName: string;
  onNewMessage: (msg: ChatMessage) => void;
  onPresenceSync: (presenceState: any) => void;
}) {
  if (!userId || !roomId) return () => {};

  // Crea un canale unico per la stanza di chat
  const channel = supabase.channel(`room-${roomId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  // Ascolta i nuovi messaggi inviati tramite Broadcast
  channel.on('broadcast', { event: 'new-message' }, (payload) => {
    if (payload.payload) {
      onNewMessage(payload.payload);
    }
  });

  // Gestisce lo stato "Presence" (chi è online nella stanza)
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      onPresenceSync(state);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Traccia l'utente corrente come ONLINE
        await channel.track({
          user_id: userId,
          user_name: userName,
          online_at: new Date().toISOString(),
        });
      }
    });

  // Funzione di pulizia (quando l'utente esce dalla chat)
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * 2. Funzione per inviare un messaggio istantaneo nella chat
 */
export async function sendChatMessage(roomId: string, messageData: ChatMessage) {
  const channel = supabase.channel(`room-${roomId}`);
  
  await channel.send({
    type: 'broadcast',
    event: 'new-message',
    payload: messageData,
  });
}