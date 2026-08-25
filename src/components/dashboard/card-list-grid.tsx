'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/types';
import { deleteCardAction } from '@/app/dashboard-actions';
import { toast } from 'sonner';
import { UpgradeModal } from './upgrade-modal';

interface CardListGridProps {
  cards: Card[];
  activeCardId?: string;
  isPro: boolean;
}

export function CardListGrid({ cards, activeCardId, isPro }: CardListGridProps) {
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleDelete = (cardId: string, cardName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la tarjeta "${cardName}"? Esta acción es irreversible.`)) {
      return;
    }

    setIsDeletingId(cardId);
    startTransition(async () => {
      try {
        const res = await deleteCardAction(cardId);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(`Tarjeta "${cardName}" eliminada.`);
        }
      } catch {
        toast.error('Ocurrió un error al eliminar la tarjeta.');
      } finally {
        setIsDeletingId(null);
      }
    });
  };

  const handleCreateNewClick = () => {
    if (!isPro && cards.length >= 1) {
      setIsUpgradeModalOpen(true);
    } else {
      window.location.href = '/?tab=editor&action=new';
    }
  };

  return (
    <>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-md text-xl text-on-surface font-bold">Mis Tarjetas</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Gestiona, edita y comparte todas tus tarjetas digitales.
            </p>
          </div>
          <button
            onClick={handleCreateNewClick}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-label-md text-xs transition duration-150 ease-out active:scale-[0.97] shadow-[0_0_20px_rgba(224,64,251,0.4)] hover:shadow-[0_0_30px_rgba(224,64,251,0.65)] flex items-center gap-2 font-semibold border border-primary/40"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nueva Tarjeta</span>
            {!isPro && cards.length >= 1 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                PRO
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const isActive = card.id === activeCardId;
            const isDeletingThis = isDeletingId === card.id && isPending;

            return (
              <div
                key={card.id}
                className={`neon-card rounded-2xl p-5 flex flex-col justify-between space-y-4 relative group transition duration-200 ${
                  isActive
                    ? 'border-accent shadow-[0_0_25px_rgba(0,229,255,0.35)]'
                    : 'hover:border-primary/50'
                }`}
              >
                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent/20 border border-accent/40 px-2.5 py-0.5 rounded-full text-accent font-label-md text-[10px] uppercase font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    Activa
                  </div>
                )}

                {/* Card Header Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(224,64,251,0.3)]">
                    {card.logo_url ? (
                      <img src={card.logo_url} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-headline-md text-xl text-primary font-bold">
                        {card.name ? card.name.charAt(0).toUpperCase() : 'T'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <h4 className="font-headline-sm text-base text-foreground font-bold truncate">
                      {card.name}
                    </h4>
                    {card.title && (
                      <p className="font-body-sm text-xs text-muted-foreground truncate">
                        {card.title}
                      </p>
                    )}
                    {card.company && (
                      <p className="font-body-sm text-[11px] text-muted-foreground/70 truncate">
                        {card.company}
                      </p>
                    )}
                    <a
                      href={`/c/${card.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline mt-1 truncate max-w-full"
                    >
                      <span>/c/{card.slug}</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-border/60 grid grid-cols-4 gap-2">
                  <a
                    href={`/?tab=editor&cardId=${card.id}`}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-low border border-white/5 hover:bg-surface-container-high transition text-on-surface-variant hover:text-on-surface"
                    title="Editar Tarjeta"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">edit</span>
                    <span className="font-label-md text-[10px] mt-0.5">Editar</span>
                  </a>

                  <a
                    href={`/?tab=qr&cardId=${card.id}`}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-low border border-white/5 hover:bg-surface-container-high transition text-on-surface-variant hover:text-on-surface"
                    title="Ver QR"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_2</span>
                    <span className="font-label-md text-[10px] mt-0.5">QR</span>
                  </a>

                  <a
                    href={`/c/${card.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-low border border-white/5 hover:bg-surface-container-high transition text-on-surface-variant hover:text-on-surface"
                    title="Ver Pública"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface">visibility</span>
                    <span className="font-label-md text-[10px] mt-0.5">Ver</span>
                  </a>

                  <button
                    onClick={() => handleDelete(card.id, card.name)}
                    disabled={isDeletingThis}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-error/10 border border-error/20 hover:bg-error/20 transition text-error disabled:opacity-50"
                    title="Eliminar Tarjeta"
                  >
                    {isDeletingThis ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    )}
                    <span className="font-label-md text-[10px] mt-0.5">Borrar</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Card CTA Card */}
          <div
            onClick={handleCreateNewClick}
            className="glass-panel rounded-2xl p-6 min-h-[160px] flex flex-col items-center justify-center gap-3 cursor-pointer border border-dashed border-white/20 hover:border-primary/50 hover:bg-surface-container-highest/40 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition">
              <span className="material-symbols-outlined text-primary text-2xl">add</span>
            </div>
            <div className="text-center">
              <p className="font-label-md text-sm text-on-surface font-semibold">
                Crear Nueva Tarjeta
              </p>
              {!isPro && cards.length >= 1 ? (
                <p className="font-body-sm text-[11px] text-primary mt-0.5 font-semibold">
                  Requiere Plan PRO
                </p>
              ) : (
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Diseña otra tarjeta para un rol o negocio diferente.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
