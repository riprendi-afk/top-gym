import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, title, body, url } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID utente mancante' }, { status: 400 });
    }

    // Recupera le sottoscrizioni push registrate per l'atleta
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);

    if (error || !subs || subs.length === 0) {
      return NextResponse.json({ message: 'Nessun dispositivo registrato per questo utente' }, { status: 404 });
    }

    const payload = JSON.stringify({ title, body, url: url || '/' });

    // Spedisce la notifica a tutti i telefoni/browser registrati dall'atleta
    const sendPromises = subs.map(item =>
      webpush.sendNotification(item.subscription, payload).catch(err => {
        console.error('Errore invio singolo push:', err);
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore server send-push:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}