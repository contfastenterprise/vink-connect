'use client';

import { useState, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { saveProfileAction, signOutAction } from '@/app/dashboard-actions';
import { UpgradeModal } from './upgrade-modal';

interface UserSettingsProps {
  profile: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
    plan?: 'free' | 'pro' | null;
  };
  email: string;
}

export function UserSettings({ profile, email }: UserSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [isSigningOut, startSignOut] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || '');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPro = profile?.plan === 'pro';

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('avatar_url', avatarPreview);

    startTransition(async () => {
      try {
        const result = await saveProfileAction(formData);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Perfil actualizado correctamente.');
        }
      } catch {
        toast.error('Ocurrió un error inesperado.');
      }
    });
  };

  const handleSignOut = () => {
    startSignOut(async () => {
      await signOutAction();
    });
  };

  const initials = (profile?.full_name || email)
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-xl text-on-surface">Ajustes de Cuenta</h2>
        </div>

        {/* ── Plan y Suscripción ── */}
        <section className="glass-panel rounded-2xl p-6 space-y-4 border border-primary/20 bg-gradient-to-r from-primary/10 via-surface-container-low to-surface-container-low">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                  Plan Actual
                </h3>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 font-label-md text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 font-bold">
                    <span className="material-symbols-outlined text-[14px]">stars</span>
                    PRO (Ilimitado)
                  </span>
                ) : (
                  <span className="font-label-md text-xs px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-white/10 font-medium">
                    Gratuito (1 tarjeta max)
                  </span>
                )}
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {isPro
                  ? 'Tienes acceso a tarjetas digitales ilimitadas y soporte prioritario.'
                  : 'Estás utilizando el Plan Gratuito. Actualiza a PRO para crear tarjetas ilimitadas.'}
              </p>
            </div>

            {!isPro && (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-inverse-primary text-white font-label-md text-xs transition duration-150 ease-out active:scale-[0.97] shadow-[0_0_15px_rgba(109,59,215,0.3)] hover:shadow-[0_0_25px_rgba(109,59,215,0.5)] flex items-center gap-1.5 font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Actualizar a PRO
              </button>
            )}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Foto de Perfil ── */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
              Foto de Perfil
            </h3>
            <div className="flex items-center gap-6">
              <div
                className="relative w-24 h-24 rounded-full bg-surface-container-high border-2 border-white/10 overflow-hidden group shadow-lg cursor-pointer flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20">
                    <span className="font-headline-md text-2xl text-primary font-bold">
                      {initials}
                    </span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">
                    add_a_photo
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-body-md text-sm text-on-surface-variant">
                  Sube una foto para personalizar tu cuenta.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:bg-muted/80 transition duration-150 ease-out"
                  >
                    Cambiar foto
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setAvatarPreview('')}
                      className="px-4 py-2 rounded-lg bg-error/10 border border-error/20 font-label-md text-sm text-error hover:bg-error/20 transition duration-150 ease-out"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant/60">
                  JPG, PNG o WebP. Máximo 5 MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </section>

          {/* ── Información Personal ── */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
              Información Personal
            </h3>

            <div className="space-y-1">
              <label
                htmlFor="full_name"
                className="font-label-md text-sm text-on-surface-variant"
              >
                Nombre para mostrar
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name || ''}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-sm text-on-surface-variant">
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border opacity-70 cursor-not-allowed">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  mail
                </span>
                <span className="font-body-md text-on-surface-variant text-sm">{email}</span>
                <span className="ml-auto font-label-md text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded-full">
                  No editable
                </span>
              </div>
            </div>
          </section>

          {/* ── Preferencias ── */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
              Preferencias
            </h3>

            {/* Notificaciones por email */}
            <div className="flex items-center justify-between py-1">
              <div className="space-y-0.5">
                <p className="font-body-md text-sm text-on-surface">
                  Notificaciones por email
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Recibe alertas cuando alguien escanee tu tarjeta.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notify_email"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:bg-primary/80 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            <hr className="border-white/10" />

            {/* Resumen semanal */}
            <div className="flex items-center justify-between py-1">
              <div className="space-y-0.5">
                <p className="font-body-md text-sm text-on-surface">
                  Resumen semanal
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Un reporte cada lunes con tus métricas de la semana.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notify_weekly"
                  defaultChecked={false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:bg-primary/80 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            <hr className="border-white/10" />

            {/* Perfil público */}
            <div className="flex items-center justify-between py-1">
              <div className="space-y-0.5">
                <p className="font-body-md text-sm text-on-surface">
                  Tarjeta pública visible
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Permite que cualquier persona con el enlace vea tu tarjeta.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="card_public"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:bg-primary/80 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </section>

          {/* ── Guardar ── */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-xl bg-inverse-primary text-white font-label-md transition duration-150 ease-out active:scale-[0.97] shadow-[0_0_15px_rgba(109,59,215,0.2)] hover:shadow-[0_0_25px_rgba(109,59,215,0.4)] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">save</span>
            )}
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>

        {/* ── Zona de Peligro ── */}
        <section className="glass-panel rounded-2xl p-6 space-y-4 border border-error/20">
          <h3 className="font-label-md text-sm text-error uppercase tracking-wider">
            Zona de Peligro
          </h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-body-md text-sm text-on-surface">Cerrar sesión</p>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Finaliza tu sesión en este dispositivo.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-5 py-2.5 rounded-xl bg-error/10 border border-error/30 font-label-md text-sm text-error hover:bg-error/20 transition duration-150 ease-out active:scale-[0.97] flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              {isSigningOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </div>
        </section>
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
