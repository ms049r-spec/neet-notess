import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SubjectId } from '../../types/resource';
import { SUBJECTS } from '../../config/constants';

interface SubjectCardProps {
  subject: SubjectId;
  isSelected: boolean;
  onSelect: (subject: SubjectId) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  isSelected,
  onSelect,
}) => {
  const meta = SUBJECTS[subject];

  const motifs: Record<SubjectId, React.ReactNode> = {
    biology: (
      <svg
        viewBox="0 0 64 64"
        className="w-14 h-14 mb-6"
        stroke="var(--bio)"
        fill="none"
        strokeWidth="3"
      >
        <path d="M16 48C16 48 20 28 44 20M48 16C48 16 28 20 20 44" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3.5" fill="var(--bio)" />
      </svg>
    ),
    physics: (
      <svg
        viewBox="0 0 64 64"
        className="w-14 h-14 mb-6"
        stroke="var(--phys)"
        fill="none"
        strokeWidth="3"
      >
        <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(-30 32 32)" />
        <circle cx="32" cy="32" r="3" fill="var(--phys)" />
      </svg>
    ),
    chemistry: (
      <svg
        viewBox="0 0 64 64"
        className="w-14 h-14 mb-6"
        stroke="var(--chem)"
        fill="none"
        strokeWidth="3"
      >
        <path d="M32 14L46 22V38L32 46L18 38V22L32 14Z" strokeLinejoin="round" />
        <circle cx="32" cy="14" r="2.5" fill="var(--chem)" />
      </svg>
    ),
  };

  const subjectCardStyles: Record<SubjectId, string> = {
    biology:
      'border-[var(--bio)] shadow-[10px_10px_0_var(--bio)] sm:shadow-[12px_12px_0_var(--bio)] hover:shadow-[14px_14px_0_var(--bio)]',
    physics:
      'border-[var(--phys)] shadow-[10px_10px_0_var(--phys)] sm:shadow-[12px_12px_0_var(--phys)] hover:shadow-[14px_14px_0_var(--phys)]',
    chemistry:
      'border-[var(--chem)] shadow-[10px_10px_0_var(--chem)] sm:shadow-[12px_12px_0_var(--chem)] hover:shadow-[14px_14px_0_var(--chem)]',
  };

  return (
    <div
      onClick={() => onSelect(subject)}
      id={`subject-portal-${subject}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(subject);
        }
      }}
      className={`group relative flex flex-col justify-between p-7 sm:p-9 rounded-[20px] border-[3px] bg-[var(--bg-surface)] transition-all duration-200 cursor-pointer text-left hover:-translate-x-1 hover:-translate-y-1 ${
        subjectCardStyles[subject]
      } ${isSelected ? 'ring-4 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]' : ''}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div>{motifs[subject]}</div>
          {isSelected && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--accent)] text-white">
              Selected
            </span>
          )}
        </div>

        <h3 className="font-sketch text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-3 tracking-wide">
          {meta.name}
        </h3>

        <p className="text-sm sm:text-base text-[var(--ink)] opacity-80 leading-relaxed">
          {meta.tagline}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t-2 border-[var(--ink-light)] flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-[var(--ink)] opacity-70 group-hover:opacity-100 transition-opacity">
          {isSelected ? 'Viewing Resources' : 'Explore Subject'}
        </span>
        <ArrowRight className="w-4 h-4 text-[var(--ink)] group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
