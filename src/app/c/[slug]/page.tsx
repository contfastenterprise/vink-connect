import { Card } from '@/types';

import { createClient } from '@/utils/supabase/server';

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
    <div className="dark bg-background text-on-background min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col items-center">
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

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg border-b border-white/10 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-[600px] mx-auto left-0 right-0">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <img alt="User profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEXYdoyEj-GUxk8EkoKBs2JtknlcNqN9RFzJyaN9NInOhr4YEHOaXE4V1NlvdVO0NZbuTN1NkRBgXaosQVi7jd-kJ6HZmF5fh053NiFYg6ZW1JRYN2IXicxuh1DyO6MX8JsSOTLbhBhC3a2UgKbn4D9UpblwQyI6sZf9zEAbVjzGcfsCtUfdOdVQ21rUKfpZElbGPIfZOnLc8zto9WgKU_Q3EOdXvdrOfiQGkDzp1kGhPm0tAydaMkqw"/>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary">{card.company || 'Vink Connect'}</span>
        </div>
        <button aria-label="Settings" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest/50 transition-colors active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="w-full max-w-[600px] pt-20 pb-24 px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
        {/* Profile Section */}
        <section className="flex flex-col items-center text-center gap-4 relative">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-primary-container/40 blur-[32px] group-hover:bg-primary-container/60 transition duration-150 ease-out duration-500"></div>
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-[2px] bg-gradient-to-b from-primary/80 to-surface-container-lowest z-10 glass-border">
              <img alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-surface-container-lowest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClnwgoOchdyFKoytO1v6y9rAa8HDf1BJHuzDa5RY0XP-AEh8PFreopn3V0kv7PgtsLI7f37hGxaDGqz7RoZtlBfY6o0gdattk6TS3s7wBAGigJ4UHt7UD4weQe99BkTTeL8fXNULxinHdYMmE8KAs_hibSmad4pWV4nh5CppOWF2N3aqMg63yo7GSSC7a0DFnaeimk-g90CaUdhC6md5Jwxaeo7X2TUneU3U-8Z82Evhsnz781DFGROA"/>
            </div>
          </div>
          <div className="flex flex-col mt-2 z-10">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">{card.name}</h1>
            <p className="font-body-md text-secondary font-medium">{card.title}</p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col md:flex-row gap-3 w-full justify-center">
          <a href={`/api/vcard/${card.slug}`} className="flex-1 flex items-center justify-center gap-2 bg-inverse-primary text-white font-label-md text-[13px] px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(109,59,215,0.4)] hover:shadow-[0_0_25px_rgba(109,59,215,0.6)] hover:bg-inverse-primary/90 transition duration-150 ease-out active:scale-[0.97]">
            <span className="material-symbols-outlined fill text-[18px]">person_add</span>
            Add to Contacts
          </a>
          <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-secondary text-secondary font-label-md text-[13px] px-6 py-3 rounded-xl hover:bg-secondary/10 transition duration-150 ease-out active:scale-[0.97] glass-border">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share Card
          </button>
        </section>

        {/* About Section */}
        <section className="bg-surface-container/80 backdrop-blur-[20px] rounded-xl p-5 glass-border shadow-sm flex flex-col gap-2">
          <h2 className="font-label-sm text-on-surface-variant uppercase tracking-wider">About</h2>
          <p className="font-body-md text-sm text-on-surface/90 leading-relaxed">
            Crafting intuitive digital experiences that bridge the gap between complex technology and human interaction. Specializing in design systems, micro-interactions, and dark-mode aesthetics for enterprise SaaS platforms.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-2 gap-3 md:gap-4">
          <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={`tel:${card.phone}`}>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined fill text-[20px]">call</span>
            </div>
            <span className="font-label-md text-[12px] text-on-surface">Phone</span>
          </a>
          <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={`mailto:${card.email}`}>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined fill text-[20px]">mail</span>
            </div>
            <span className="font-label-md text-[12px] text-on-surface">Email</span>
          </a>
          <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href="#">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">work</span>
            </div>
            <span className="font-label-md text-[12px] text-on-surface">LinkedIn</span>
          </a>
          <a className="group bg-surface-container-low/80 backdrop-blur-[16px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-border hover:bg-surface-container-highest/60 transition duration-150 ease-out active:scale-[0.97] aspect-[4/3]" href={card.website || '#'}>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </div>
            <span className="font-label-md text-[12px] text-on-surface">Website</span>
          </a>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 pb-[env(safe-area-inset-bottom)] px-4 bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-xl">
        <button className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim bg-secondary-container/20 rounded-xl px-4 py-1 active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined fill mb-1">contact_page</span>
          <span className="font-label-md text-label-md">My Card</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-secondary-fixed transition duration-150 ease-out active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined mb-1">qr_code_2</span>
          <span className="font-label-md text-label-md">QR Code</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-secondary-fixed transition duration-150 ease-out active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined mb-1">insights</span>
          <span className="font-label-md text-label-md">Activity</span>
        </button>
      </nav>
    </div>
  );
}
