import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CardEditor } from '@/components/dashboard/card-editor';
import { QRView } from '@/components/dashboard/qr-view';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = 'activity' } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch the user's primary card
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuario';

  return (
    <div className="bg-background text-on-background min-h-screen relative font-body-md overflow-x-hidden pt-16 pb-20 md:pb-0">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background-color: rgba(22, 28, 45, 0.8);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .btn-primary-glow {
            background-color: theme('colors.inverse-primary');
            transition: all 0.2s ease-in-out;
        }
        .btn-primary-glow:hover {
            box-shadow: 0 0 16px theme('colors.inverse-primary');
        }
        .ambient-glow {
            position: fixed;
            top: 20%;
            left: 50%;
            width: 80vw;
            height: 80vw;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(14, 19, 34, 0) 70%);
            z-index: -1;
            pointer-events: none;
        }
      `}} />
      <div className="ambient-glow"></div>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg border-b border-white/10 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16">
        <div className="flex items-center gap-sm">
          <img className="w-10 h-10 rounded-full object-cover border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF5fjecyj0rsqYW8oe00C7zcp6lNT5ElRcWJ5Eyjq8rOdv8tqfD5P1Wp9Yn6j_JB_84gVpird3uqu6kmJBDORObJHBg8KO0-RnqLIrChvM4_WGuujUKBi5FaAhxcib3fnGHfWPoxkqAE6z1_3pvpIVCj961K8kla64GZUdn5LpqbXFuhwUp00AVg0TvL1VmsJp3oe3NOehlD6E47Ifs-3GDVu8GiNgyw3N85UBMnfNHHS77qC29pfHLA" alt="Profile" />
          <div className="flex flex-col hidden sm:flex">
            <span className="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant uppercase tracking-wider">Hola,</span>
            <span className="font-headline-md text-[16px] text-primary dark:text-primary font-bold">{userName}</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${tab === 'editor' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`} href="/?tab=editor">My Card</a>
          <a className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${tab === 'qr' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`} href="/?tab=qr">QR Code</a>
          <a className={`font-label-md uppercase tracking-wider transition-colors duration-150 ease-out ${tab === 'activity' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`} href="/?tab=activity">Activity</a>
        </div>

        <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary dark:text-primary hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97]">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-12 space-y-8">
        
        {tab === 'activity' && (
          <>
            {/* Status Header & Stats Grid */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Activity</h1>
                <div className="flex items-center gap-2 bg-secondary-container/10 border border-secondary/30 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="font-label-md text-label-md text-secondary">En línea</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stat Card: Total Scans */}
                <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 group hover:border-primary/30 transition duration-150 ease-out">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-primary text-2xl">qr_code_scanner</span>
                    <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span>+12%</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-headline-xl text-4xl text-on-surface font-bold tracking-tight">128</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Total Scans</p>
                  </div>
                </div>
                {/* Stat Card: New Contacts */}
                <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 group hover:border-primary/30 transition duration-150 ease-out">
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
                    <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span>+4</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-headline-xl text-4xl text-on-surface font-bold tracking-tight">14</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">New Contacts</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="space-y-4">
              <h3 className="font-headline-md text-xl text-on-surface">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <a href="/?tab=qr" className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-xl">share</span>
                  </div>
                  <span className="font-label-md text-[11px] text-on-surface-variant text-center">Share QR</span>
                </a>
                <a href={card ? `/c/${card.slug}` : "/?tab=editor"} className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-xl">badge</span>
                  </div>
                  <span className="font-label-md text-[11px] text-on-surface-variant text-center">View Card</span>
                </a>
                <button className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-highest/50 transition duration-150 ease-out active:scale-[0.97] group relative">
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-[0_0_8px_rgba(255,180,171,0.6)]"></div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition duration-150 ease-out border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
                  </div>
                  <span className="font-label-md text-[11px] text-on-surface-variant text-center">New Alert</span>
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-xl text-on-surface">Recent Contacts</h3>
                <button className="font-label-md text-[12px] text-primary hover:text-primary-fixed transition duration-150 ease-out flex items-center gap-1">
                  Ver todos <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
              <div className="glass-panel rounded-xl divide-y divide-white/10 flex flex-col overflow-hidden">
                {/* Contact Item 1 */}
                <div className="p-4 flex items-center justify-between hover:bg-surface-container-highest/30 transition duration-150 ease-out cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center">
                      <span className="font-headline-md text-[14px] text-primary font-bold">SM</span>
                    </div>
                    <div>
                      <p className="font-body-md text-[14px] font-semibold text-on-surface">Sofía Martínez</p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">Director of Operations</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-label-md text-[11px] text-on-surface-variant">Hace 2h</span>
                    <div className="opacity-0 group-hover:opacity-100 transition duration-150 ease-out">
                      <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
                    </div>
                  </div>
                </div>
                {/* Contact Item 2 */}
                <div className="p-4 flex items-center justify-between hover:bg-surface-container-highest/30 transition duration-150 ease-out cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center">
                      <span className="font-headline-md text-[14px] text-secondary font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-body-md text-[14px] font-semibold text-on-surface">Javier Díaz</p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">Lead Designer</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-label-md text-[11px] text-on-surface-variant">Ayer</span>
                    <div className="opacity-0 group-hover:opacity-100 transition duration-150 ease-out">
                      <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {tab === 'editor' && (
          <section className="pt-4">
            <CardEditor initialData={card} />
          </section>
        )}

        {tab === 'qr' && (
          <section className="pt-4">
            <QRView slug={card?.slug} />
          </section>
        )}

      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 pb-safe px-4">
        <a href="/?tab=editor" className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${tab === 'editor' ? 'text-secondary bg-secondary-container/20 rounded-xl px-4 py-1' : 'text-outline hover:text-secondary-fixed'}`}>
          <span className="material-symbols-outlined mb-1 text-[24px]">contact_page</span>
          <span className="font-label-md text-[10px]">My Card</span>
        </a>
        <a href="/?tab=qr" className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${tab === 'qr' ? 'text-secondary bg-secondary-container/20 rounded-xl px-4 py-1' : 'text-outline hover:text-secondary-fixed'}`}>
          <span className="material-symbols-outlined mb-1 text-[24px]" style={tab === 'qr' ? { fontVariationSettings: "'FILL' 1" } : {}}>qr_code_2</span>
          <span className="font-label-md text-[10px]">QR Code</span>
        </a>
        <a href="/?tab=activity" className={`flex flex-col items-center justify-center transition duration-150 ease-out active:scale-[0.97] ${tab === 'activity' ? 'text-secondary bg-secondary-container/20 rounded-xl px-4 py-1' : 'text-outline hover:text-secondary-fixed'}`}>
          <span className="material-symbols-outlined mb-1 text-[24px]">insights</span>
          <span className="font-label-md text-[10px]">Activity</span>
        </a>
      </nav>
    </div>
  );
}
