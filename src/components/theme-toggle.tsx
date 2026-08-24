'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-xl opacity-50">dark_mode</span>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full bg-surface-container-highest/50 hover:bg-primary/20 border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-95 group"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-xl text-on-surface group-hover:text-primary transition-colors">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
