import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types/theme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className="inline-flex items-center gap-2 border-2 border-[var(--ink)] px-3 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm bg-[var(--bg-surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors cursor-pointer shadow-[2px_2px_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#ff9f43]" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">Switch Theme</span>
    </button>
  );
};

