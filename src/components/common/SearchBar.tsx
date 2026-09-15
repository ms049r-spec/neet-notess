import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onClear,
  resultCount,
  totalCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-[480px]">
      <div className="relative flex items-center w-full rounded-full border-[3px] border-[var(--ink)] bg-[var(--bg-surface)] text-[var(--ink)] shadow-[6px_6px_0_var(--ink)] transition-all">
        <div className="flex items-center justify-center pl-5 sm:pl-6 pr-2 text-[var(--ink)] opacity-60">
          <Search className="w-5 h-5 stroke-[2.5]" />
        </div>

        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for something useful..."
          className="w-full py-3.5 sm:py-4 pr-14 text-base font-medium bg-transparent text-[var(--ink)] placeholder:text-[var(--ink)] placeholder:opacity-50 focus:outline-none"
        />

        <div className="absolute right-4 sm:right-5 flex items-center gap-1">
          {query ? (
            <button
              id="clear-search-btn"
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="p-1 rounded-full text-[var(--ink)] hover:opacity-100 opacity-60 transition-opacity"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <span className="text-xs font-semibold font-mono text-[var(--ink)] opacity-50 px-1.5 py-0.5 rounded border border-[var(--ink)] border-opacity-30 select-none">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {query && (
        <div className="absolute top-full left-4 mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] opacity-70">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} found
        </div>
      )}
    </div>
  );
};
