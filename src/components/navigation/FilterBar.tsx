import React from 'react';
import { SubjectId, ResourceTypeId } from '../../types/resource';
import { ActiveFilters } from '../../types/filter';

interface FilterBarProps {
  filters: ActiveFilters;
  onSubjectChange: (subject: SubjectId | 'all') => void;
  onResourceTypeChange: (type: ResourceTypeId | 'all') => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onSubjectChange,
  onResourceTypeChange,
  onReset,
  activeCount,
}) => {
  const subjects: { id: SubjectId | 'all'; label: string }[] = [
    { id: 'all', label: 'All Subjects' },
    { id: 'biology', label: 'Biology' },
    { id: 'physics', label: 'Physics' },
    { id: 'chemistry', label: 'Chemistry' },
  ];

  const resourceTypes: { id: ResourceTypeId | 'all'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'short-notes', label: 'Notes' },
    { id: 'mind-map', label: 'Maps' },
    { id: 'formula-sheet', label: 'Formulas' },
    { id: 'study-plan', label: 'Plans' },
  ];

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Subject Filter Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {subjects.map((s) => {
            const isSelected = filters.subject === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSubjectChange(s.id)}
                className={`border-2 border-[var(--ink)] px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-[2px_2px_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[2px_2px_0_rgba(0,0,0,0.2)]'
                    : 'bg-[var(--bg-surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer"
          >
            Clear filters ({activeCount})
          </button>
        )}
      </div>

      {/* Resource-Type Filters (Variation 3 style tag-btns) */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] opacity-50 mr-1 shrink-0">
          Format:
        </span>
        {resourceTypes.map((t) => {
          const isSelected = filters.resourceType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onResourceTypeChange(t.id)}
              className={`whitespace-nowrap border-2 border-[var(--ink)] px-3.5 py-1 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-[2px_2px_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 ${
                isSelected
                  ? 'bg-[var(--ink)] text-[var(--bg)]'
                  : 'bg-[var(--bg-surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
