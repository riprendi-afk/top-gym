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
  
  export async function subscribeUserToPush(userId: string, supabaseClient?: any): Promise<{ success: boolean; message: string }> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Le notifiche push non sono supportate da questo browser/dispositivo.' };
    }
  
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return { success: false, message: 'Chiave VAPID pubblica mancante.' };
    }
  
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Permesso per le notifiche rifiutato.' };
      }
  
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
  
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
  
      if (supabaseClient) {
        const { error } = await supabaseClient.from('push_subscriptions').upsert({
          user_id: userId,
          subscription: subscription.toJSON()
        });
  
        if (error) throw error;
      }
  
      return { success: true, message: 'Notifiche push attivate con successo!' };
    } catch (error: any) {
      console.error('Errore registrazione push:', error);
      return { success: false, message: `Errore: ${error.message || 'Impossibile registrare le notifiche.'}` };
    }
  }
  export async function sendPushNotification(userId: string, title: string, body: string, url: string = '/') {
    try {
      const res = await fetch('/api/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body, url })
      });
      return await res.json();
    } catch (error) {
      console.error('Errore chiamata send-push:', error);
      return null;
    }
  }