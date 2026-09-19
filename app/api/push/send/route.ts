import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Assicura che il VAPID_SUBJECT abbia il prefisso mailto: o https://
let vapidSubject = process.env.VAPID_SUBJECT || 'mailto:info@topgym.it';
if (!vapidSubject.startsWith('mailto:') && !vapidSubject.startsWith('http')) {
  vapidSubject = `mailto:${vapidSubject}`;
}

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );
} else {
  console.error('⚠️ [PUSH ERROR] Chiavi VAPID mancanti nelle variabili d\'ambiente!');
}

// Inizializza client Supabase (preferisci sempre il Service Role per bypassare RLS sul server)
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

    // 1. Recupera le sottoscrizioni push per l'atleta
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('id, subscription')
      .eq('user_id', userId);

    if (error) {
      console.error('Errore query Supabase push_subscriptions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      console.warn(`[PUSH] Nessun dispositivo registrato per userId: ${userId}`);
      return NextResponse.json({ message: 'Nessun dispositivo registrato per questo utente' }, { status: 404 });
    }

    const payload = JSON.stringify({ 
      title: title || 'TOP GYM', 
      body: body || 'Hai un nuovo aggiornamento!', 
      url: url || '/' 
    });

    const expiredSubIds: string[] = [];
    const results = await Promise.allSettled(
      subs.map(async (item) => {
        let subObj = item.subscription;
        if (typeof subObj === 'string') {
          try {
            subObj = JSON.parse(subObj);
          } catch (e) {
            throw new Error('Formato subscription JSON non valido');
          }
        }

        if (!subObj?.endpoint || !subObj?.keys) {
          throw new Error('Oggetto subscription incompleto (mancano endpoint o keys)');
        }

        try {
          return await webpush.sendNotification(subObj, payload);
        } catch (err: any) {
          // Se la subscription è scaduta (404/410), la segniamo per eliminarla
          if (err.statusCode === 404 || err.statusCode === 410) {
            expiredSubIds.push(item.id);
          }
          throw err;
        }
      })
    );

    // Pulizia automatica delle subscription scadute
    if (expiredSubIds.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', expiredSubIds);
    }

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');

    if (succeeded === 0 && failed.length > 0) {
      console.error('Tutti i tentativi di invio push sono falliti:', failed);
      return NextResponse.json({ 
        error: 'Invio fallito a tutti i dispositivi registrati', 
        details: failed 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      sent: succeeded, 
      failed: failed.length 
    });
  } catch (error: any) {
    console.error('Errore server send-push:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}