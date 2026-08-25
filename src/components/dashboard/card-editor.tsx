'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { saveCardAction, deleteCardAction } from '@/app/dashboard-actions';
import { UpgradeModal } from './upgrade-modal';

interface CardEditorProps {
  initialData?: any;
  isNewCard?: boolean;
  onSaved?: (slug: string) => void;
  onDeleted?: () => void;
}

export function CardEditor({ initialData, isNewCard, onSaved, onDeleted }: CardEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setLogoUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('logo_url', logoUrl);
    
    if (initialData?.id && !isNewCard) {
      formData.set('card_id', initialData.id);
    }
    
    startTransition(async () => {
      try {
        const result = await saveCardAction(formData);
        if (result.requiresPro) {
          setIsUpgradeModalOpen(true);
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(isNewCard ? 'Nueva tarjeta creada correctamente.' : 'Tarjeta guardada correctamente.');
          if (onSaved && result.slug) {
            onSaved(result.slug);
          }
        }
      } catch {
        toast.error('Ocurrió un error inesperado.');
      }
    });
  };

  const handleDeleteCard = () => {
    if (!initialData?.id) return;
    if (!confirm('¿Estás seguro de eliminar esta tarjeta? Esta acción no se puede deshacer.')) return;

    startDeleteTransition(async () => {
      try {
        const result = await deleteCardAction(initialData.id);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Tarjeta eliminada.');
          if (onDeleted) onDeleted();
        }
      } catch {
        toast.error('Ocurrió un error al eliminar la tarjeta.');
      }
    });
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-xl text-on-surface">
            {isNewCard ? 'Crear Nueva Tarjeta' : 'Editor de Tarjeta'}
          </h2>
          {initialData?.id && !isNewCard && (
            <button
              type="button"
              onClick={handleDeleteCard}
              disabled={isDeleting}
              className="px-3 py-1.5 rounded-lg bg-error/10 border border-error/20 font-label-md text-xs text-error hover:bg-error/20 transition duration-150 flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          
          {/* Foto / Logo */}
          <div className="flex flex-col items-center justify-center gap-3 mb-2 w-full mt-2">
            <div className="relative w-28 h-28 rounded-full bg-surface-container-high border-2 border-white/10 overflow-hidden group shadow-lg">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-1">person</span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex flex-col items-center pointer-events-none">
              <span className="font-label-md text-sm text-primary tracking-wide">Agregar imagen</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Formato JPG, PNG (Max 5MB)</span>
            </div>
          </div>

          <hr className="border-border my-2" />

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
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
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
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
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

          <div className="space-y-1">
            <label htmlFor="bio" className="font-label-md text-sm text-on-surface-variant">Breve Descripción (Bio)</label>
            <textarea 
              id="bio" 
              name="bio" 
              rows={3}
              defaultValue={initialData?.theme_config?.bio || ''}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground resize-none"
              placeholder="Ej: Crafting intuitive digital experiences that bridge the gap between complex technology and human interaction."
            />
            <p className="text-xs text-on-surface-variant/70 mt-1">Si lo dejas vacío, se mostrará un texto por defecto en tu tarjeta.</p>
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
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
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
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
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
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
              placeholder="https://midominio.com"
            />
          </div>

          {/* Separator */}
          <hr className="border-border my-4" />

          {/* Redes Sociales */}
          <h3 className="font-headline-sm text-[16px] text-on-surface mb-2">Redes Sociales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="social_linkedin" className="font-label-md text-sm text-on-surface-variant">LinkedIn URL</label>
              <input 
                type="url" 
                id="social_linkedin" 
                name="social_linkedin" 
                defaultValue={initialData?.social_links?.linkedin || ''}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="social_twitter" className="font-label-md text-sm text-on-surface-variant">Twitter (X) URL</label>
              <input 
                type="url" 
                id="social_twitter" 
                name="social_twitter" 
                defaultValue={initialData?.social_links?.twitter || ''}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
                placeholder="https://twitter.com/tu-usuario"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="social_instagram" className="font-label-md text-sm text-on-surface-variant">Instagram URL</label>
              <input 
                type="url" 
                id="social_instagram" 
                name="social_instagram" 
                defaultValue={initialData?.social_links?.instagram || ''}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="social_github" className="font-label-md text-sm text-on-surface-variant">GitHub URL</label>
              <input 
                type="url" 
                id="social_github" 
                name="social_github" 
                defaultValue={initialData?.social_links?.github || ''}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
                placeholder="https://github.com/tu-usuario"
              />
            </div>
          </div>

          {/* Separator */}
          <hr className="border-border my-4" />

          {/* Personalización (Theme) */}
          <h3 className="font-headline-sm text-[16px] text-on-surface mb-2">Personalización</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-label-md text-sm text-on-surface-variant">Color Principal (Acento)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/50 transition-colors cursor-pointer">
                  <input 
                    type="color" 
                    id="theme_color" 
                    name="theme_color" 
                    defaultValue={initialData?.theme_config?.color || '#6D3BD7'}
                    className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer"
                  />
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant/80">
                  Aplica a botones y enlaces.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="font-label-md text-sm text-on-surface-variant">Color de Fondo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/50 transition-colors cursor-pointer">
                  <input 
                    type="color" 
                    id="theme_bg_color" 
                    name="theme_bg_color" 
                    defaultValue={initialData?.theme_config?.backgroundColor || '#011230'}
                    className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer"
                  />
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant/80">
                  Color base de tu tarjeta pública.
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-4 w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition duration-150 ease-out active:scale-[0.97] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">save</span>
            )}
            {isPending ? 'Guardando...' : (isNewCard ? 'Crear Tarjeta' : 'Guardar Cambios')}
          </button>
        </form>
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
