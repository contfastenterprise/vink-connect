import { Card } from '@/types';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { LeadForm } from '@/components/public-card/lead-form';
import { ViewTracker } from '@/components/public-card/view-tracker';
import { ShareButton } from '@/components/public-card/share-button';

// Revalidar la página cada hora (ISR) — tarjetas públicas servidas desde CDN
export const revalidate = 3600;

// Fetch card from Supabase
async function getCardBySlug(slug: string): Promise<Card | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  
  return data as Card;
}
export default async function PublicCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h1 className="text-2xl font-headline-lg text-primary">Tarjeta no encontrada</h1>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col items-center"
      style={{
        '--color-background': card.theme_config?.backgroundColor || '#0e1322',
        '--color-surface': card.theme_config?.backgroundColor || '#0e1322',
        '--color-inverse-primary': card.theme_config?.color || '#6d3bd7',
        '--color-primary': card.theme_config?.color || '#d0bcff',
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-border {
            position: relative;
        }
        .glass-border::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }
      `}} />

      {/* Tracker de Vistas (No visible) */}
      <ViewTracker cardId={card.id} />

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg border-b border-white/10 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-[600px] mx-auto left-0 right-0">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 relative">
            {/* Imagen de empresa en header — usa next/image para URLs externas */}
            <Image
              alt="Company Logo"
              className="object-cover"
              fill
              sizes="32px"
              src={card.logo_url?.startsWith('data:') ? card.logo_url : (card.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${card.company}`)}
              unoptimized={card.logo_url?.startsWith('data:')}
            />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary">{card.company || 'Vink Connect'}</span>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="w-full max-w-[600px] pt-24 pb-24 px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
        {/* Profile Section */}
        <section className="flex flex-col items-center text-center gap-4 relative">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-primary-container/40 blur-[32px] transition duration-150 ease-out"></div>
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-[2px] bg-gradient-to-b from-primary/80 to-surface-container-lowest z-10 glass-border overflow-hidden">
              {/* Avatar principal — next/image con prioridad alta (above the fold) */}
              <Image
                alt="Profile"
                className="rounded-full object-cover border-4 border-background"
                fill
                sizes="(max-width: 768px) 112px, 128px"
                src={card.logo_url?.startsWith('data:') ? card.logo_url : (card.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${card.name}`)}
                unoptimized={card.logo_url?.startsWith('data:')}
                priority
              />
            </div>
          </div>
          <div className="flex flex-col mt-2 z-10">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">{card.name}</h1>
            <p className="font-body-md text-primary font-medium">{card.title}</p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col md:flex-row gap-3 w-full justify-center">
          <a href={`/api/vcard/${card.slug}`} className="flex-1 flex items-center justify-center gap-2 bg-inverse-primary text-white font-label-md text-[13px] px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(var(--color-inverse-primary),0.4)] hover:opacity-90 transition duration-150 ease-out active:scale-[0.97]">
            <span className="material-symbols-outlined fill text-[18px]">person_add</span>
            Añadir a Contactos
          </a>
          <ShareButton title={`Tarjeta de ${card.name}`} url={`https://vink.com/c/${card.slug}`} />
        </section>

        {/* About Section */}
        <section className="bg-surface-container/80 backdrop-blur-[20px] rounded-xl p-5 glass-border shadow-sm flex flex-col gap-2">
          <h2 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Acerca de</h2>
          <p className="font-body-md text-sm text-on-surface/90 leading-relaxed whitespace-pre-wrap">
            {card.theme_config?.bio || "Creando experiencias digitales intuitivas que unen la tecnología con la interacción humana."}
          </p>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
          
          {(card.phone || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={`tel:${card.phone}`}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined fill text-[20px]">call</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">Teléfono</span>
            </a>
          )}

          {(card.email || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={`mailto:${card.email}`}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined fill text-[20px]">mail</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">Email</span>
            </a>
          )}

          {(card.website || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.website} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">language</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">Sitio Web</span>
            </a>
          )}

          {(card.social_links?.linkedin || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.social_links?.linkedin} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">work</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">LinkedIn</span>
            </a>
          )}

          {(card.social_links?.twitter || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.social_links?.twitter} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform font-bold">
                X
              </div>
              <span className="font-label-md text-[12px] text-on-surface">Twitter (X)</span>
            </a>
          )}

          {(card.social_links?.instagram || "").trim() !== "" && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.social_links?.instagram} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">Instagram</span>
            </a>
          )}

          {card.social_links?.github && (
            <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.social_links.github} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">code</span>
              </div>
              <span className="font-label-md text-[12px] text-on-surface">GitHub</span>
            </a>
          )}
        </section>

        {/* Lead Capture Section */}
        <section className="mt-4">
          <LeadForm cardId={card.id} />
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 pb-[env(safe-area-inset-bottom)] px-4 bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-xl">
        <a href="/" className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-primary transition duration-150 ease-out active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined mb-1 text-[24px]">contact_page</span>
          <span className="font-label-md text-[10px]">Dashboard</span>
        </a>
      </nav>
    </div>
  );
}
