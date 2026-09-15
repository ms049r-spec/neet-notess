import React from 'react';
import { Home, Dna, Orbit, FlaskConical, Search } from 'lucide-react';
import { SubjectId } from '../../types/resource';

interface MobileNavProps {
  activeSubject: SubjectId | 'all';
  onSelectSubject: (subject: SubjectId | 'all') => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeSubject,
  onSelectSubject,
  onOpenSearch,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t-[3px] border-[var(--ink)] px-3 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => onSelectSubject('all')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
            activeSubject === 'all'
              ? 'text-[var(--accent)] font-bold'
              : 'text-[var(--ink)] opacity-60'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-semibold">All</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubject('biology')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
            activeSubject === 'biology'
              ? 'text-[var(--bio)] font-bold'
              : 'text-[var(--ink)] opacity-60'
          }`}
        >
          <Dna className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-semibold">Bio</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubject('physics')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
            activeSubject === 'physics'
              ? 'text-[var(--phys)] font-bold'
              : 'text-[var(--ink)] opacity-60'
          }`}
        >
          <Orbit className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-semibold">Phys</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubject('chemistry')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
            activeSubject === 'chemistry'
              ? 'text-[var(--chem)] font-bold'
              : 'text-[var(--ink)] opacity-60'
          }`}
        >
          <FlaskConical className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-semibold">Chem</span>
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-lg text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity"
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-semibold">Search</span>
        </button>
      </div>
    </div>
  );
};
