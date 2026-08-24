import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CardEditor } from '@/components/dashboard/card-editor';
import { QRView } from '@/components/dashboard/qr-view';
import { LeadList } from '@/components/dashboard/lead-list';
import { UserSettings } from '@/components/dashboard/user-settings';
import { NotificationButton } from '@/components/dashboard/notification-button';
import { CardSelector } from '@/components/dashboard/card-selector';
import { CardListGrid } from '@/components/dashboard/card-list-grid';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; cardId?: string; action?: string }>;
}) {
  const { tab = 'activity', cardId, action } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's cards list
  const { data: cardsData } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  const cards: Card[] = (cardsData as Card[]) || [];
  const isPro = profile?.plan === 'pro';

  // Determine active card
  const activeCard = cards.find((c) => c.id === cardId) || cards[0];
  const isNewCard = action === 'new';

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuario';
  const activeCardId = activeCard?.id || '';

  // Fetch real leads count for active card
  let leadsCount = 0;
  if (activeCardId) {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('card_id', activeCardId);
    if (!error && count !== null) {
      leadsCount = count;
    }
  }

  // Si existe una columna 'views' en cards, la usamos, sino 0
  const viewsCount = (activeCard as any)?.views || 0;

  return (
    <div className="min-h-screen relative font-body-md overflow-x-hidden pt-16 pb-20 md:pb-0">
      {/* Main Container */}
      <div className="ambient-glow"></div>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg border-b border-white/10 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16">
        <div className="flex items-center gap-3">
          <a href="/?tab=settings" className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                className="w-10 h-10 rounded-full object-cover border border-white/10"
                src={profile.avatar_url}
                alt="Profile"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center">
                <span className="font-headline-md text-sm text-primary font-bold">
                  {userName
                    .split(' ')
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
            )}
          </a>

          {/* Card Selector Component in Header */}
          {cards.length > 0 && (
            <CardSelector
              cards={cards}
              activeCardId={activeCardId}
              isPro={isPro}
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${
              tab === 'cards'
                ? 'text-secondary font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
            href={`/?tab=cards${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          >
            Mis Tarjetas
          </a>
          <a
            className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${
              tab === 'editor'
                ? 'text-secondary font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
            href={`/?tab=editor${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          >
            Editor
          </a>
          <a
            className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${
              tab === 'qr'
                ? 'text-secondary font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
            href={`/?tab=qr${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          >
            Código QR
          </a>
          <a
            className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${
              tab === 'activity'
                ? 'text-secondary font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
            href={`/?tab=activity${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          >
            Actividad
          </a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/?tab=settings"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${
              tab === 'settings'
                ? 'bg-primary/20 text-primary'
                : 'text-primary dark:text-primary hover:bg-surface-container-highest/50'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={tab === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              settings
            </span>
          </a>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-12 space-y-8">
        {tab === 'activity' && (
          <>
            {/* Status Header & Stats Grid */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                    Actividad
                  </h1>
                  {activeCard && (
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Viendo métricas de: <span className="text-primary font-semibold">{activeCard.name}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-secondary-container/10 border border-secondary/30 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="font-label-md text-label-md text-secondary">En línea</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stat Card: Total Scans */}
                <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 group hover:border-primary/30 transition duration-150 ease-out">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      qr_code_scanner
                    </span>
                    <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-headline-xl text-4xl text-on-surface font-bold tracking-tight">
                      {viewsCount}
                    </h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Vistas de Tarjeta</p>
                  </div>
                </div>
                {/* Stat Card: New Contacts */}
                <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 group hover:border-primary/30 transition duration-150 ease-out">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      person_add
                    </span>
                    <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-headline-xl text-4xl text-on-surface font-bold tracking-tight">
                      {leadsCount}
                    </h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Contactos Recibidos</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: All User Cards */}
            <section className="pt-2">
              <CardListGrid cards={cards} activeCardId={activeCardId} isPro={isPro} />
            </section>

            {/* Quick Actions */}
            <section className="space-y-4">
              <h3 className="font-headline-md text-xl text-on-surface">Acciones Rápidas</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <a
                  href={`/?tab=qr${activeCardId ? `&cardId=${activeCardId}` : ''}`}
                  className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-xl">share</span>
                  </div>
                  <span className="font-label-md text-[11px] text-on-surface-variant text-center">
                    Compartir QR
                  </span>
                </a>
                <a
                  href={activeCard ? `/c/${activeCard.slug}` : `/?tab=editor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-xl">badge</span>
                  </div>
                  <span className="font-label-md text-[11px] text-on-surface-variant text-center">
                    Ver Tarjeta
                  </span>
                </a>
                <NotificationButton 
                  initialCardId={activeCardId} 
                  cards={cards.map(c => ({ id: c.id, name: c.name }))} 
                />
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-xl text-on-surface">Contactos Recientes</h3>
              </div>
              <div className="glass-panel rounded-xl divide-y divide-white/10 flex flex-col overflow-hidden">
                <LeadList cardId={activeCard?.id} />
              </div>
            </section>
          </>
        )}

        {tab === 'cards' && (
          <section className="pt-4">
            <CardListGrid cards={cards} activeCardId={activeCardId} isPro={isPro} />
          </section>
        )}

        {tab === 'editor' && (
          <section className="pt-4">
            <CardEditor
              initialData={isNewCard ? null : activeCard}
              isNewCard={isNewCard}
            />
          </section>
        )}

        {tab === 'qr' && (
          <section className="pt-4">
            <QRView slug={activeCard?.slug} />
          </section>
        )}

        {tab === 'settings' && (
          <section>
            <UserSettings
              profile={{
                id: user.id,
                full_name: profile?.full_name,
                avatar_url: profile?.avatar_url,
                email: user.email,
                plan: profile?.plan || 'free',
              }}
              email={user.email || ''}
            />
          </section>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 pb-safe px-2">
        <a
          href={`/?tab=cards${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${
            tab === 'cards'
              ? 'text-secondary bg-secondary-container/20 rounded-xl px-3 py-1'
              : 'text-outline hover:text-secondary-fixed'
          }`}
        >
          <span className="material-symbols-outlined mb-1 text-[22px]">style</span>
          <span className="font-label-md text-[10px]">Mis Tarjetas</span>
        </a>
        <a
          href={`/?tab=editor${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${
            tab === 'editor'
              ? 'text-secondary bg-secondary-container/20 rounded-xl px-3 py-1'
              : 'text-outline hover:text-secondary-fixed'
          }`}
        >
          <span className="material-symbols-outlined mb-1 text-[22px]">contact_page</span>
          <span className="font-label-md text-[10px]">Editor</span>
        </a>
        <a
          href={`/?tab=qr${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${
            tab === 'qr'
              ? 'text-secondary bg-secondary-container/20 rounded-xl px-3 py-1'
              : 'text-outline hover:text-secondary-fixed'
          }`}
        >
          <span
            className="material-symbols-outlined mb-1 text-[22px]"
            style={tab === 'qr' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            qr_code_2
          </span>
          <span className="font-label-md text-[10px]">Código QR</span>
        </a>
        <a
          href={`/?tab=activity${activeCardId ? `&cardId=${activeCardId}` : ''}`}
          className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${
            tab === 'activity'
              ? 'text-secondary bg-secondary-container/20 rounded-xl px-3 py-1'
              : 'text-outline hover:text-secondary-fixed'
          }`}
        >
          <span className="material-symbols-outlined mb-1 text-[22px]">insights</span>
          <span className="font-label-md text-[10px]">Actividad</span>
        </a>
      </nav>
    </div>
  );
}
