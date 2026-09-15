import React from 'react';
import { SubjectId } from '../../types/resource';

interface FooterProps {
  onSelectSubject?: (subject: SubjectId | 'all') => void;
  onScrollToResources?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectSubject,
  onScrollToResources,
}) => {
  return (
    <footer className="w-full border-t-[3px] border-[var(--ink)] mt-20 sm:mt-32 pt-12 pb-16 px-4 sm:px-8 transition-colors">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-start gap-8">
        {/* Brand */}
        <div className="space-y-2">
          <div className="font-sketch text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-wide">
            NEET NOTES
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink)] opacity-60">
            © {new Date().getFullYear()} NEET NOTES. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-semibold">
          <button
            type="button"
            onClick={() => onSelectSubject?.('biology')}
            className="text-left text-[var(--ink)] opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Biology
          </button>
          <button
            type="button"
            onClick={() => onSelectSubject?.('physics')}
            className="text-left text-[var(--ink)] opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Physics
          </button>
          <button
            type="button"
            onClick={() => onSelectSubject?.('chemistry')}
            className="text-left text-[var(--ink)] opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Chemistry
          </button>
          <button
            type="button"
            onClick={onScrollToResources}
            className="text-left text-[var(--ink)] opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Resources
          </button>
        </div>
      </div>

      {/* Subtle Creator Credit Signature */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-[var(--ink-light)] flex flex-col items-center justify-center text-center gap-1 text-[11px] sm:text-xs text-[var(--ink)] opacity-50 tracking-wider">
        <span className="font-mono opacity-85">@ms049r-spec</span>
        <span>© 2026 MullaSameer</span>
      </div>
    </footer>
  );
};
