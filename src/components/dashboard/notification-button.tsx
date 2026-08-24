'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { sendPushNotificationAction } from '@/app/dashboard-actions';

interface Props {
  cardId?: string;
}

export function NotificationButton({ cardId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
      setIsSuccess(false);
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      document.body.style.overflow = '';
      setIsSuccess(false);
    }
  };

  // Limpiar overflow si se desmonta
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cardId) {
      toast.error('Selecciona una tarjeta primero');
      return;
    }

    startTransition(async () => {
      const result = await sendPushNotificationAction(cardId, title, body, '');
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          closeModal();
          setTitle('');
          setBody('');
          setIsSuccess(false);
        }, 2500);
      }
    });
  };

  return (
    <>
      <button 
        type="button"
        onClick={openModal}
        className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition-all duration-300 ease-out active:scale-[0.97] group relative"
      >
        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-[0_0_8px_rgba(255,180,171,0.6)] animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 ease-out border border-primary/20">
          <span className="material-symbols-outlined text-primary text-xl">
            campaign
          </span>
        </div>
        <span className="font-label-md text-[11px] text-on-surface-variant text-center leading-tight group-hover:text-primary transition-colors">
          Enviar Promoción
        </span>
      </button>

      {mounted && createPortal(
        <dialog 
          ref={dialogRef}
          style={{ width: '90vw', maxWidth: '500px', minWidth: '300px' }}
          className="backdrop:bg-background/80 backdrop:backdrop-blur-md bg-transparent p-0 m-auto rounded-3xl shadow-2xl overflow-hidden open:animate-in open:zoom-in-95 open:fade-in duration-300 border-0"
          onCancel={closeModal}
        >
          <div className="relative w-full h-full glass-panel flex flex-col" style={{ minHeight: '400px' }}>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30">
                  <span className="material-symbols-outlined text-green-400 text-5xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">¡Promoción Lanzada!</h3>
                <p className="text-center text-on-surface-variant font-body-md">
                  Tus clientes han recibido la notificación.
                </p>
              </div>
            ) : (
              <>
            {/* Cabecera con degradado y brillo */}
            <div className="relative px-6 py-8 sm:px-8 sm:py-10 text-center overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
              
              <button 
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface/50 hover:bg-surface text-on-surface-variant hover:text-on-surface transition-all duration-200 z-10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    send_to_mobile
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-2xl text-on-surface font-bold tracking-tight mb-1">
                    Nueva Promoción
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
                    Envía una notificación directa al celular de tus contactos suscritos.
                  </p>
                </div>
              </div>
            </div>

          {/* Formulario */}
          <form onSubmit={handleSend} className="px-6 pb-8 sm:px-8 flex flex-col gap-5">
            {/* Campo: Título */}
            <div className="space-y-1.5 relative group text-left">
              <div className="flex justify-between items-end">
                <label htmlFor="title" className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Título de la notificación
                </label>
                <span className={`text-[10px] font-label-md ${title.length >= 50 ? 'text-error' : 'text-on-surface-variant/50'}`}>
                  {title.length}/50
                </span>
              </div>
              <input 
                required
                type="text" 
                id="title" 
                name="title" 
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-surface-container/50 border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-low focus:outline-none transition-all duration-200 text-on-surface font-body-md placeholder:text-on-surface-variant/40"
                placeholder="Ej: ¡20% de Descuento hoy!"
              />
            </div>

            {/* Campo: Mensaje */}
            <div className="space-y-1.5 relative group text-left">
              <div className="flex justify-between items-end">
                <label htmlFor="body" className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Cuerpo del mensaje
                </label>
                <span className={`text-[10px] font-label-md ${body.length >= 120 ? 'text-error' : 'text-on-surface-variant/50'}`}>
                  {body.length}/120
                </span>
              </div>
              <textarea 
                required
                id="body" 
                name="body"
                rows={3} 
                maxLength={120}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-surface-container/50 border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-low focus:outline-none transition-all duration-200 text-on-surface font-body-md resize-none placeholder:text-on-surface-variant/40"
                placeholder="Ej: Muestra esta notificación en caja para aplicar el descuento..."
              />
            </div>

            {/* Botón de Enviar */}
            <button 
              type="submit" 
              disabled={isPending || title.trim() === '' || body.trim() === ''}
              className="w-full py-4 mt-2 rounded-xl btn-primary-glow text-white font-label-md text-sm transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Enviando notificación...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] fill">rocket_launch</span>
                  Lanzar Promoción
                </>
              )}
            </button>
          </form>
              </>
            )}
        </div>
      </dialog>, document.body)}
    </>
  );
}
