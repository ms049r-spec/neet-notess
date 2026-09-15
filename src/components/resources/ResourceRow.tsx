import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { NEETResource } from '../../types/resource';
import { RESOURCE_TYPES, SUBJECTS } from '../../config/constants';

interface ResourceRowProps {
  resource: NEETResource;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ resource }) => {
  const handleOpen = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const typeMeta = RESOURCE_TYPES[resource.type];
  const subjectMeta = SUBJECTS[resource.subject];

  return (
    <div
      id={`resource-row-${resource.id}`}
      role="link"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`${resource.title} - Opens file`}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 hover:bg-[var(--bg)] transition-colors cursor-pointer text-left"
    >
      {/* Row Info */}
      <div className="min-w-0 flex-1 space-y-2">
        <h4 className="text-base sm:text-lg font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
          {resource.title}
        </h4>

        {/* Metadata items */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] opacity-70">
          <span className="font-bold text-[var(--ink)]">
            {subjectMeta?.name || resource.subject}
          </span>
          <span>•</span>
          <span>{typeMeta?.label || resource.type}</span>
          <span>•</span>
          <span>Class {resource.classLevel}</span>
          {resource.pageCount && (
            <>
              <span>•</span>
              <span>{resource.pageCount} Pages</span>
            </>
          )}
        </div>
      </div>

      {/* Variation 3 Open File Button */}
      <div className="shrink-0 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[var(--ink)] text-[var(--bg)] px-5 py-2.5 rounded-[12px] font-bold uppercase tracking-wider text-xs hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,0.15)] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>Open File</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
