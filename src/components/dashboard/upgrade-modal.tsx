'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { upgradeToProAction } from '@/app/dashboard-actions';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleUpgrade = () => {
    startTransition(async () => {
      try {
        const res = await upgradeToProAction();
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success('¡Felicidades! Tu cuenta ha sido actualizada a PRO.');
          if (onSuccess) onSuccess();
          onClose();
        }
      } catch {
        toast.error('Ocurrió un error al actualizar la cuenta.');
      }
    });
  };

  const modalContent = (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        style={{
          width: '100%', maxWidth: '450px',
          maxHeight: '90vh',
          backgroundColor: '#161b2b',
          borderRadius: '24px',
          padding: '32px',
          position: 'relative',
          overflowY: 'auto',
          overflowX: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex', flexDirection: 'column', gap: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', zIndex: 10
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '16px',
            backgroundColor: 'rgba(168,85,247,0.2)', color: '#c084fc',
            boxShadow: '0 0 15px rgba(168,85,247,0.3)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>workspace_premium</span>
          </div>
          <h2 style={{ fontSize: '24px', color: '#ffffff', fontWeight: 'bold', margin: 0 }}>
            Vink Connect <span style={{ color: '#c084fc' }}>PRO</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', margin: 0, padding: '0 8px' }}>
            Supera el límite de 1 tarjeta y desbloquea herramientas profesionales para expandir tu red de contactos.
          </p>
        </div>

        {/* Feature List */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: '16px', padding: '20px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', gap: '16px',
          position: 'relative', zIndex: 10
        }}>
          {/* Feature 1 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: 'rgba(168,85,247,0.2)', color: '#c084fc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontWeight: 'bold' }}>check</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500, margin: 0 }}>Tarjetas ilimitadas</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Crea tarjetas específicas para cada negocio o rol.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: 'rgba(168,85,247,0.2)', color: '#c084fc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontWeight: 'bold' }}>check</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500, margin: 0 }}>Enlaces (slugs) personalizados</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Haz tu tarjeta fácil de recordar: vink.com/c/tu-nombre</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: 'rgba(168,85,247,0.2)', color: '#c084fc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontWeight: 'bold' }}>check</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500, margin: 0 }}>Estadísticas avanzadas</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Analiza el rendimiento de cada tarjeta por separado.</p>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10, paddingTop: '8px' }}>
          <button
            onClick={handleUpgrade}
            disabled={isPending}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              backgroundColor: '#9333ea', color: '#ffffff',
              border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              fontWeight: 600, fontSize: '15px',
              boxShadow: '0 4px 14px 0 rgba(168,85,247,0.39)',
              opacity: isPending ? 0.5 : 1
            }}
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>refresh</span>
                <span>Activando PRO...</span>
              </>
            ) : (
              <>
                <span>Actualizar a PRO</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'normal' }}>por $9.99/mes</span>
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', margin: 0 }}>
            Modo demostración. La actualización será inmediata.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
