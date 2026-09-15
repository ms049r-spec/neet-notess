import React from 'react';
import { SubjectId } from '../../types/resource';
import { ThemeToggle } from '../common/ThemeToggle';
import { ThemeMode } from '../../types/theme';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeSubject: SubjectId | 'all';
  onSelectSubject: (subject: SubjectId | 'all') => void;
  onScrollToResources: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  activeSubject,
  onSelectSubject,
  onScrollToResources,
}) => {
  return (
    <header className="w-full pt-6 pb-6 mb-8 sm:mb-12 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Variation 3 Boxed Brand Mark */}
        <button
          type="button"
          onClick={() => onSelectSubject('all')}
          className="group text-left focus-visible:outline-none"
        >
          <span className="inline-block font-sketch text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--ink)] border-[3px] border-[var(--ink)] px-3 sm:px-4 py-0.5 shadow-[4px_4px_0_var(--ink)] bg-[var(--bg-surface)] tracking-wide transition-transform active:translate-x-0.5 active:translate-y-0.5">
            NEET NOTES
          </span>
        </button>

        {/* Clean Sketch Navigation */}
        <nav className="flex items-center gap-4 sm:gap-8 lg:gap-12">
          <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm lg:text-base font-semibold">
            <button
              type="button"
              onClick={() => onSelectSubject('biology')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSubject === 'biology'
                  ? 'text-[var(--ink)] after:w-full'
                  : 'text-[var(--ink)] opacity-80 hover:opacity-100 after:w-0 hover:after:w-full'
              } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:bg-[var(--accent)] after:transition-all`}
            >
              Biology
            </button>

            <button
              type="button"
              onClick={() => onSelectSubject('physics')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSubject === 'physics'
                  ? 'text-[var(--ink)] after:w-full'
                  : 'text-[var(--ink)] opacity-80 hover:opacity-100 after:w-0 hover:after:w-full'
              } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:bg-[var(--accent)] after:transition-all`}
            >
              Physics
            </button>

            <button
              type="button"
              onClick={() => onSelectSubject('chemistry')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSubject === 'chemistry'
                  ? 'text-[var(--ink)] after:w-full'
                  : 'text-[var(--ink)] opacity-80 hover:opacity-100 after:w-0 hover:after:w-full'
              } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:bg-[var(--accent)] after:transition-all`}
            >
              Chemistry
            </button>

            <button
              type="button"
              onClick={onScrollToResources}
              className="relative py-1 transition-colors cursor-pointer text-[var(--ink)] opacity-80 hover:opacity-100 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-0 hover:after:w-full after:bg-[var(--accent)] after:transition-all"
            >
              Resources
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </nav>
      </div>
    </header>
  );
};
