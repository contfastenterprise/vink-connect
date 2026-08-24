'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { sendPushNotificationAction } from '@/app/dashboard-actions';

interface Props {
  cardId?: string;
}

export function NotificationButton({ cardId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cardId) {
      toast.error('Selecciona una tarjeta primero');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;

    startTransition(async () => {
      const result = await sendPushNotificationAction(cardId, title, body, '');
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Mensaje enviado exitosamente a ${result.count} suscriptores.`);
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group relative"
      >
        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-[0_0_8px_rgba(255,180,171,0.6)] animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
          <span className="material-symbols-outlined text-primary text-xl">
            campaign
          </span>
        </div>
        <span className="font-label-md text-[11px] text-on-surface-variant text-center leading-tight">
          Enviar Promoción
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface-container-high border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-xl text-on-surface">Enviar Notificación Push</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-on-surface-variant transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <p className="text-sm font-body-sm text-on-surface-variant mb-6">
              Este mensaje aparecerá en la pantalla principal del celular de todos tus contactos que hayan aceptado recibir notificaciones.
            </p>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="title" className="font-label-sm text-xs text-on-surface-variant">Título de la oferta</label>
                <input 
                  required
                  type="text" 
                  id="title" 
                  name="title" 
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition text-on-surface font-body-md"
                  placeholder="¡20% de Descuento!"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="body" className="font-label-sm text-xs text-on-surface-variant">Mensaje corto</label>
                <textarea 
                  required
                  id="body" 
                  name="body"
                  rows={3} 
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition text-on-surface font-body-md resize-none"
                  placeholder="Aprovecha esta promoción exclusiva mostrando esta notificación en el local..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-3 mt-4 rounded-xl bg-primary text-on-primary font-label-md transition active:scale-[0.97] shadow-lg hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">send</span>
                )}
                {isPending ? 'Enviando a todos...' : 'Enviar a mis contactos'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
