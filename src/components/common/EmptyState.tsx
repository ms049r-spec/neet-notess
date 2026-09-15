import React from 'react';
import { SearchX, RotateCcw, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'empty-category' | 'error';
  searchQuery?: string;
  onReset?: () => void;
  onSuggest?: (query: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onReset,
  onSuggest,
}) => {
  if (type === 'search') {
    const suggestions = ['Genetics', 'Thermodynamics', 'Chemical Bonding', 'Optics', 'Cell Cycle'];

    return (
      <div className="py-16 px-6 text-center rounded-[24px] border-[3px] border-dashed border-[var(--ink-light)] bg-[var(--bg-surface)] shadow-[6px_6px_0_var(--ink-light)]">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--ink-light)] text-[var(--ink)] mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="font-sketch text-2xl sm:text-3xl font-bold text-[var(--ink)]">
          No resources found {searchQuery ? `for "${searchQuery}"` : ''}
        </h3>
        <p className="mt-2 text-sm text-[var(--ink)] opacity-70 max-w-md mx-auto">
          We couldn&apos;t find an exact match in the current filter. Try searching for broader NCERT chapter topics or reset your active filters.
        </p>

        {suggestions.length > 0 && onSuggest && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] opacity-50">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggest(s)}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-surface)] border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors cursor-pointer shadow-[2px_2px_0_var(--ink)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {onReset && (
          <div className="mt-6">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer shadow-[3px_3px_0_rgba(0,0,0,0.15)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-16 px-6 text-center rounded-[24px] border-[3px] border-dashed border-[var(--ink-light)] bg-[var(--bg-surface)]">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--ink-light)] text-[var(--ink)] mb-4">
        <BookOpen className="w-6 h-6" />
      </div>
      <h3 className="font-sketch text-2xl sm:text-3xl font-bold text-[var(--ink)]">
        No resources in this category yet
      </h3>
      <p className="mt-2 text-sm text-[var(--ink)] opacity-70 max-w-sm mx-auto">
        New verified NCERT notes are being staged for this section. Switch to another subject or filter above.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer"
        >
          View All Resources
        </button>
      )}
    </div>
  );
};
