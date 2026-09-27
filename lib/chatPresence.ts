import { supabase } from './store';

export interface ChatMessage {
  id?: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: string;
}

/**
 * 1. Recupera lo storico dei messaggi dal database per una determinata stanza
 */
export async function fetchChatHistory(roomId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Errore caricamento storico chat:', error);
    return [];
  }
  return data || [];
}

/**
 * 2. Salva un nuovo messaggio nel database (il Realtime lo distribuirà a tutti)
 */
export async function sendPersistentMessage(msg: ChatMessage) {
  const { error } = await supabase
    .from('messages')
    .insert([msg]);

  if (error) {
    console.error('Errore salvataggio messaggio:', error);
  }
}

/**
 * 3. Inizializza Realtime (Ascolto Database Changes + Presence)
 */
export function initChatWithHistory({
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

  const channel = supabase.channel(`room-db-${roomId}`, {
    config: {
      presence: { key: userId },
    },
  });

  // Ascolta i nuovi inserimenti nella tabella messages in tempo reale
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => {
      if (payload.new) {
        onNewMessage(payload.new as ChatMessage);
      }
    }
  );

  // Gestione Presence (utenti online)
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      onPresenceSync(state);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          user_name: userName,
          online_at: new Date().toISOString(),
        });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}