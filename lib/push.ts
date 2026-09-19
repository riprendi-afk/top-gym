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
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Le notifiche push non sono supportate da questo browser/dispositivo.' };
    }
  
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return { success: false, message: 'Chiave VAPID pubblica mancante (NEXT_PUBLIC_VAPID_PUBLIC_KEY).' };
    }
  
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Permesso per le notifiche rifiutato dal browser o sistema operativo.' };
      }
  
      // Registra e attendi il Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
  
      // Controlla se esiste già una subscription attiva o creane una nuova
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }
  
      const subJson = subscription.toJSON();
  
      if (supabaseClient) {
        // Salva o aggiorna associando sia l'utente che l'endpoint specifico del telefono
        const { error } = await supabaseClient.from('push_subscriptions').upsert(
          {
            user_id: userId,
            subscription: subJson
          },
          { onConflict: 'user_id' } // oppure lascia vuoto se la tabella non ha unique constraint
        );
  
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
      // NOTA: Se la tua route è app/api/push/send/route.ts usa '/api/push/send'
      // Se la route è app/api/send-push/route.ts usa '/api/send-push'
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
      console.error('Errore chiamata sendPushNotification:', error);
      return null;
    }
  }