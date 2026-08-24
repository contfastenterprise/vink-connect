'use client';

import { useEffect, useRef } from 'react';
import { trackViewAction } from '@/app/public-actions';

interface ViewTrackerProps {
  cardId: string;
}

export function ViewTracker({ cardId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Solo registra la vista una vez por montaje para evitar cuentas dobles en StrictMode o recargas rápidas
    if (!hasTracked.current) {
      hasTracked.current = true;
      trackViewAction(cardId).catch(err => console.error("Error tracking view", err));
    }
  }, [cardId]);

  return null; // Este componente no renderiza nada visible
}
