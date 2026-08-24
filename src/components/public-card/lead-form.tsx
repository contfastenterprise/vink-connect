'use client';

import { useState, useTransition } from 'react';
import { saveLeadAction } from '@/app/public-actions';

interface LeadFormProps {
  cardId: string;
}

export function LeadForm({ cardId }: LeadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('card_id', cardId);

    const wantsPush = formData.get('subscribe_push') === 'on';

    startTransition(async () => {
      setStatus('idle');
      
      // Intentar suscribir a notificaciones push si el usuario lo marcó
      if (wantsPush) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          alert('Tu navegador o dispositivo no soporta notificaciones Push directamente.');
        } else {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            // Forzar la actualización del Service Worker
            await registration.update();
            
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
              const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
              if (vapidPublicKey) {
                const subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });
                formData.append('push_subscription', JSON.stringify(subscription));
              } else {
                console.error('Faltan las llaves VAPID en el cliente.');
              }
            } else {
              console.warn('Permiso push denegado por el usuario.');
            }
          } catch (err: any) {
            console.error('Error suscribiendo a push:', err);
          }
        }
      }

      const result = await saveLeadAction(formData);

      if (result.error) {
        setStatus('error');
        setErrorMessage(result.error);
      } else {
        setStatus('success');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="bg-primary-container/20 border border-primary/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 text-center transition duration-150 ease-out glass-border">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
          <span className="material-symbols-outlined text-[24px]">check</span>
        </div>
        <h3 className="font-headline-sm text-lg text-on-surface">¡Datos enviados!</h3>
        <p className="font-body-sm text-on-surface-variant">El dueño de esta tarjeta ha recibido tu información de contacto.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-surface-container-high/80 backdrop-blur-[16px] border border-white/10 text-on-surface font-label-md text-[13px] px-6 py-4 rounded-xl hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] glass-border"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">connect_without_contact</span>
          Compartir mis datos
        </button>
      ) : (
        <div className="bg-surface-container-low/80 backdrop-blur-[16px] p-5 rounded-2xl glass-border border border-white/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-lg text-on-surface">Compartir Contacto</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-on-surface-variant transition duration-150 ease-out active:scale-[0.97]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="visitor_name" className="font-label-md text-sm text-on-surface-variant">Nombre completo *</label>
              <input 
                required
                type="text" 
                id="visitor_name" 
                name="visitor_name" 
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
                placeholder="Tu nombre"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="visitor_email" className="font-label-md text-sm text-on-surface-variant">Email</label>
                <input 
                  type="email" 
                  id="visitor_email" 
                  name="visitor_email" 
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="visitor_phone" className="font-label-md text-sm text-on-surface-variant">Teléfono</label>
                <input 
                  type="tel" 
                  id="visitor_phone" 
                  name="visitor_phone" 
                  autoComplete="tel"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="font-label-md text-sm text-on-surface-variant">Mensaje (Opcional)</label>
              <textarea 
                id="message" 
                name="message" 
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface resize-none"
                placeholder="Un placer conocerte..."
              />
            </div>

            <div className="flex items-start gap-3 mt-2 mb-2">
              <input 
                type="checkbox" 
                id="subscribe_push" 
                name="subscribe_push" 
                defaultChecked
                className="mt-1 w-4 h-4 rounded bg-surface-container border-white/10 text-primary focus:ring-primary/50"
              />
              <label htmlFor="subscribe_push" className="font-body-sm text-xs text-on-surface-variant leading-tight">
                Quiero recibir notificaciones sobre ofertas, promociones y actualizaciones exclusivas de esta tarjeta.
              </label>
            </div>

            {status === 'error' && (
              <p className="text-error font-body-sm text-sm">{errorMessage}</p>
            )}

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full py-3 mt-2 rounded-xl bg-inverse-primary text-white font-label-md transition duration-150 ease-out active:scale-[0.97] shadow-[0_0_15px_rgba(var(--color-inverse-primary),0.3)] hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">send</span>
              )}
              {isPending ? 'Enviando...' : 'Enviar mis datos'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
