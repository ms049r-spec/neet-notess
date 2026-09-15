import React from 'react';
import { SubjectId, ResourceTypeId } from '../../types/resource';
import { RESOURCE_TYPES, SUBJECTS } from '../../config/constants';

interface SubjectBadgeProps {
  subject: SubjectId;
  size?: 'sm' | 'md';
}

export const SubjectBadge: React.FC<SubjectBadgeProps> = ({ subject, size = 'sm' }) => {
  const meta = SUBJECTS[subject];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const colorStyles: Record<SubjectId, string> = {
    biology: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70',
    physics: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/70',
    chemistry: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-wide uppercase select-none ${sizeClasses} ${colorStyles[subject]}`}
    >
      {meta.name}
    </span>
  );
};

interface TypeBadgeProps {
  type: ResourceTypeId;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const meta = RESOURCE_TYPES[type] || { shortLabel: type.toUpperCase() };

  const typeStyles: Record<string, string> = {
    'short-notes': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700',
    'revision-material': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    'mind-map': 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    'formula-sheet': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    'study-plan': 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    'question-bank': 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
    'video': 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border tracking-wider select-none ${
        typeStyles[type] || typeStyles['short-notes']
      }`}
    >
      {meta.shortLabel}
    </span>
  );
};
