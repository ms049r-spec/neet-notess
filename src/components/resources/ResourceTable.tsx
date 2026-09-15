import React from 'react';
import { NEETResource } from '../../types/resource';
import { ResourceRow } from './ResourceRow';
import { EmptyState } from '../common/EmptyState';

interface ResourceTableProps {
  resources: NEETResource[];
  searchQuery: string;
  onResetFilters: () => void;
  onSuggestSearch: (query: string) => void;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  searchQuery,
  onResetFilters,
  onSuggestSearch,
}) => {
  if (resources.length === 0) {
    return (
      <EmptyState
        type="search"
        searchQuery={searchQuery}
        onReset={onResetFilters}
        onSuggest={onSuggestSearch}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] opacity-60">
        <span>
          Showing {resources.length} {resources.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      {/* Variation 3 Resource Table */}
      <div className="bg-[var(--bg-surface)] border-[3px] border-[var(--ink)] rounded-[24px] overflow-hidden shadow-[10px_10px_0_var(--ink-light)] divide-y-[3px] divide-[var(--ink-light)]">
        {resources.map((item) => (
          <ResourceRow key={item.id} resource={item} />
        ))}
      </div>
    </div>
  );
};
