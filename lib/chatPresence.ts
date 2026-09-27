import { supabase } from './store';

export interface ChatMessage {
  id?: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  sender_name?: string;
  created_at?: string;
}

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

export async function sendPersistentMessage(msg: ChatMessage) {
  const { error } = await supabase
    .from('messages')
    .insert([msg]);

  if (error) {
    console.error('Errore salvataggio messaggio:', error);
  }
}

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