function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  export async function subscribeUserToPush(
    userId: string,
    supabaseClient?: any
  ): Promise<{ success: boolean; message: string }> {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Ambiente non valido.' };
    }
  
    // 1. Rileva se l'utente è su iPhone/iPad (iOS)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
  
    // Su iOS Apple consente i Web Push SOLO se l'app è installata sulla Home
    if (isIos && !isStandalone) {
      return {
        success: false,
        message: '📱 Su iPhone tocca il tasto Condividi (quadrato con freccia) e seleziona "Aggiungi alla schermata Home" per attivare le notifiche.'
      };
    }
  
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Le notifiche push non sono supportate da questo browser/dispositivo.' };
    }
  
    // Controllo preventivo permessi bloccati
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      return {
        success: false,
        message: '⚠️ Notifiche bloccate! Tocca il lucchetto/cursori a sinistra dell\'indirizzo web e imposta Notifiche su "Consenti".'
      };
    }
  
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return { success: false, message: 'Chiave VAPID pubblica mancante.' };
    }
  
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        return {
          success: false,
          message: '⚠️ Permesso rifiutato. Per abilitarle in seguito dovrai consentirle dalle impostazioni del browser.'
        };
      }
  
      if (permission !== 'granted') {
        return { success: false, message: 'Permesso per le notifiche rifiutato.' };
      }
  
      // Registra e attendi il Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
  
      // Controlla se esiste già una subscription attiva o creane una nuova
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource
        });
      }
  
      const subJson = subscription.toJSON();
  
      if (supabaseClient) {
        // 1. Elimina eventuali sottoscrizioni obsolete per questo utente
        await supabaseClient
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId);
  
        // 2. Inserisce la nuova subscription valida
        const { error } = await supabaseClient
          .from('push_subscriptions')
          .insert({
            user_id: userId,
            subscription: subJson
          });
  
        if (error) {
          console.error('Errore salvataggio Supabase subscription:', error);
          throw error;
        }
      }
  
      return { success: true, message: 'Notifiche push attivate con successo su questo dispositivo!' };
    } catch (error: any) {
      console.error('Errore registrazione push:', error);
      return { success: false, message: `Errore: ${error.message || 'Impossibile registrare le notifiche.'}` };
    }
  }
  
  export async function sendPushNotification(userId: string, title: string, body: string, url: string = '/') {
    try {
      const endpoint = '/api/push/send'; 
  
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body, url })
      });
  
      const data = await res.json();
      if (!res.ok) {
        console.error('Risposta errore dal server push:', data);
      }
      return data;
    } catch (error) {
      console.error('Errore chiamata send-push:', error);
      return null;
    }
  }