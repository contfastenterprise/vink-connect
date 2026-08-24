'use client';

import { useState, useTransition } from 'react';
import { saveCardAction } from '@/app/dashboard-actions';

interface CardEditorProps {
  initialData: any;
}

export function CardEditor({ initialData }: CardEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setMessage(null);
      try {
        const result = await saveCardAction(formData);
        if (result.error) {
          setMessage({ type: 'error', text: result.error });
        } else {
          setMessage({ type: 'success', text: 'Tarjeta guardada correctamente.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-md text-xl text-on-surface">Editor de Tarjeta</h2>
        {message && (
          <div className={`px-4 py-2 rounded-lg font-label-md text-sm ${message.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
            {message.text}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="name" className="font-label-md text-sm text-on-surface-variant">Nombre Completo *</label>
            <input 
              required
              type="text" 
              id="name" 
              name="name" 
              defaultValue={initialData?.name || ''}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
              placeholder="Ej: Sofía Martínez"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="title" className="font-label-md text-sm text-on-surface-variant">Cargo o Título</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={initialData?.title || ''}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
              placeholder="Ej: Directora de Marketing"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="company" className="font-label-md text-sm text-on-surface-variant">Empresa</label>
          <input 
            type="text" 
            id="company" 
            name="company" 
            defaultValue={initialData?.company || ''}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
            placeholder="Ej: TechCorp S.A."
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1">
            <label htmlFor="phone" className="font-label-md text-sm text-on-surface-variant">Teléfono</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              defaultValue={initialData?.phone || ''}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="font-label-md text-sm text-on-surface-variant">Correo de Contacto</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue={initialData?.email || ''}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
              placeholder="contacto@ejemplo.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="website" className="font-label-md text-sm text-on-surface-variant">Sitio Web</label>
          <input 
            type="url" 
            id="website" 
            name="website" 
            defaultValue={initialData?.website || ''}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
            placeholder="https://midominio.com"
          />
        </div>

        <div className="space-y-1 mt-2">
          <label htmlFor="slug" className="font-label-md text-sm text-on-surface-variant">URL Personalizada (opcional)</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-surface-container-high text-on-surface-variant text-sm font-mono">
              vink.com/c/
            </span>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={initialData?.slug || ''}
              className="flex-1 px-4 py-3 rounded-r-xl bg-surface-container-low border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition duration-150 ease-out font-body-md text-on-surface"
              placeholder="tu-nombre"
            />
          </div>
          <p className="text-xs text-on-surface-variant/70 mt-1">Si lo dejas vacío, se generará uno aleatorio.</p>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="mt-4 w-full py-4 rounded-xl bg-inverse-primary text-white font-label-md transition duration-150 ease-out active:scale-[0.97] shadow-[0_0_15px_rgba(109,59,215,0.2)] hover:shadow-[0_0_25px_rgba(109,59,215,0.4)] flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
