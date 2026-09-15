import React from 'react';
import { SubjectId } from '../../types/resource';
import { DeviceTier } from '../../types/theme';
import { SpatialCanvas } from '../three/SpatialCanvas';
import { SearchBar } from '../common/SearchBar';

interface HeroSectionProps {
  activeSubject: SubjectId | 'all';
  isDark: boolean;
  tier: DeviceTier;
  prefersReducedMotion?: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
  resultCount: number;
  totalCount: number;
  onScrollToResources: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeSubject,
  isDark,
  tier,
  prefersReducedMotion,
  searchQuery,
  onSearchChange,
  onClearSearch,
  resultCount,
  totalCount,
}) => {
  return (
    <section className="relative pt-4 pb-12 sm:pb-20 mb-12 sm:mb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left / Hero Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)] select-none">
              Ready for revision?
            </div>

            <h1 className="font-sketch text-5xl sm:text-7xl lg:text-[7.5rem] font-bold text-[var(--ink)] leading-[0.88] tracking-[-0.02em] -rotate-1 origin-left">
              Study smart. <br />
              <span className="relative inline-block text-[var(--accent)] mt-1">
                Stay ahead.
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 sm:h-4 bg-[var(--accent)] opacity-25 -z-10 rounded-sm"
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--ink)] opacity-80 max-w-[520px] leading-relaxed pt-3">
              Concise revision notes, formula sheets, and conceptual mind maps designed for focused NEET study.
            </p>

            {/* Search Box */}
            <div className="pt-4 sm:pt-6">
              <SearchBar
                query={searchQuery}
                onChange={onSearchChange}
                onClear={onClearSearch}
                resultCount={resultCount}
                totalCount={totalCount}
              />
            </div>
          </div>

          {/* Right / Variation 3 Sketch Box holding 3D Spatial Canvas */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-[40px] border-4 border-dashed border-[var(--ink-light)] bg-[var(--bg-surface)] p-2 shadow-[8px_8px_0_var(--ink-light)]">
              {/* 3D Interactive Spatial Canvas */}
              <div className="w-full h-full rounded-[32px] overflow-hidden">
                <SpatialCanvas
                  activeSubject={activeSubject}
                  isDark={isDark}
                  tier={tier}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
