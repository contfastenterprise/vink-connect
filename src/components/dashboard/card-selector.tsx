'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/types';
import { UpgradeModal } from './upgrade-modal';

interface CardSelectorProps {
  cards: Card[];
  activeCardId?: string;
  isPro: boolean;
}

export function CardSelector({
  cards,
  activeCardId,
  isPro,
}: CardSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const activeCard = cards.find((c) => c.id === activeCardId) || cards[0];

  const handleSelectCard = (cardId: string) => {
    const tab = searchParams.get('tab') || 'activity';
    router.push(`/?tab=${tab}&cardId=${cardId}`);
  };

  const handleCreateClick = () => {
    setIsOpenMenu(false);
    if (!isPro && cards.length >= 1) {
      setIsUpgradeModalOpen(true);
    } else {
      router.push(`/?tab=editor&action=new`);
    }
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high/80 border border-white/10 text-on-surface hover:bg-surface-container-highest transition duration-150 ease-out active:scale-[0.98]"
        >
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {activeCard?.name ? activeCard.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <span className="font-label-md text-xs truncate max-w-[120px] sm:max-w-[160px]">
            {activeCard?.name || 'Mi Tarjeta'}
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            {isOpenMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isOpenMenu && (
          <div 
            className="absolute left-0 mt-2 w-64 glass-panel rounded-2xl p-2 z-50 shadow-2xl border border-white/15 animate-fade-in"
            onClick={() => setIsOpenMenu(false)}
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider">
                Tus Tarjetas ({cards.length})
              </span>
              {!isPro && (
                <span className="font-label-md text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-white/10">
                  Plan Gratis (1 max)
                </span>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 py-1">
              {cards.map((card) => {
                const isSelected = card.id === activeCard?.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition duration-150 ${
                      isSelected
                        ? 'bg-primary/20 text-primary border border-primary/30 font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold">
                        {card.name ? card.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <span className="font-body-md text-xs truncate">{card.name}</span>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-1 mt-1">
              <button
                onClick={handleCreateClick}
                className="w-full px-3 py-2 rounded-xl text-xs font-label-md flex items-center justify-between text-secondary hover:bg-secondary/10 transition duration-150"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Crear nueva tarjeta</span>
                </div>
                {!isPro && cards.length >= 1 && (
                  <span className="font-label-md text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">
                    PRO
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
