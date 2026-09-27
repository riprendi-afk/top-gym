import { supabase } from './store' // Lo importa direttamente da lib/store.ts dove hai l'istanza

interface RealtimeOptions {
  table: string
  onSync: (payload: any) => void
}

export function subscribeToTable({ table, onSync }: RealtimeOptions) {
  const channel = supabase
    .channel(`realtime-${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
      },
      (payload: any) => {
        console.log(`Evento Realtime ricevuto su ${table}:`, payload)
        onSync(payload)
      }
    )
    .subscribe((status: string) => {
      console.log(`Stato connessione Realtime per ${table}:`, status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}