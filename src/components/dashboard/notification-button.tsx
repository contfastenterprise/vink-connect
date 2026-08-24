'use client';

import { toast } from 'sonner';

export function NotificationButton() {
  const handleClick = () => {
    toast.info('Sin nuevas alertas', {
      description: 'Te notificaremos cuando alguien visite o guarde tu tarjeta.',
      duration: 4000,
    });
  };

  return (
    <button 
      onClick={handleClick}
      className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group relative"
    >
      <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-[0_0_8px_rgba(255,180,171,0.6)] animate-pulse"></div>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
        <span className="material-symbols-outlined text-primary text-xl">
          notifications_active
        </span>
      </div>
      <span className="font-label-md text-[11px] text-on-surface-variant text-center">
        Alertas
      </span>
    </button>
  );
}
