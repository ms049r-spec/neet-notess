import React, { useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useDeviceTier } from './hooks/useDeviceTier';
import { useResources } from './hooks/useResources';
import { useSearchFilter } from './hooks/useSearchFilter';
import { Header } from './components/navigation/Header';
import { FilterBar } from './components/navigation/FilterBar';
import { MobileNav } from './components/navigation/MobileNav';
import { HeroSection } from './components/hero/HeroSection';
import { SubjectCard } from './components/resources/SubjectCard';
import { ResourceTable } from './components/resources/ResourceTable';
import { Footer } from './components/layout/Footer';
import { SubjectId } from './types/resource';

export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();
  const tierCapabilities = useDeviceTier();
  const { resources } = useResources();

  const {
    filters,
    setQuery,
    setSubject,
    setResourceType,
    resetFilters,
    filteredResources,
    activeFilterCount,
  } = useSearchFilter(resources);

  const resourceSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToResources = () => {
    resourceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSubject = (subject: SubjectId | 'all') => {
    setSubject(subject);
    handleScrollToResources();
  };

  const handleOpenSearch = () => {
    const input = document.getElementById('global-search-input');
    input?.focus();
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Variation 3 Wrapper */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex-1 flex flex-col">
        {/* 1. Publication Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          activeSubject={filters.subject}
          onSelectSubject={(subj) => setSubject(subj)}
          onScrollToResources={handleScrollToResources}
        />

        <main className="flex-1">
          {/* 2. Hero Section with 3D Spatial Canvas in Sketch Box */}
          <HeroSection
            activeSubject={filters.subject}
            isDark={isDark}
            tier={tierCapabilities.tier}
            prefersReducedMotion={tierCapabilities.prefersReducedMotion}
            searchQuery={filters.query}
            onSearchChange={setQuery}
            onClearSearch={() => setQuery('')}
            resultCount={filteredResources.length}
            totalCount={resources.length}
            onScrollToResources={handleScrollToResources}
          />

          {/* 3. The Subjects */}
          <section aria-labelledby="subjects-heading" className="mb-20 sm:mb-28">
            <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8">
              <h2
                id="subjects-heading"
                className="font-sketch text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--ink)] tracking-wide"
              >
                The Subjects
              </h2>

              {filters.subject !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSubject('all')}
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer"
                >
                  Show all subjects
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              <SubjectCard
                subject="biology"
                isSelected={filters.subject === 'biology'}
                onSelect={handleSelectSubject}
              />
              <SubjectCard
                subject="physics"
                isSelected={filters.subject === 'physics'}
                onSelect={handleSelectSubject}
              />
              <SubjectCard
                subject="chemistry"
                isSelected={filters.subject === 'chemistry'}
                onSelect={handleSelectSubject}
              />
            </div>
          </section>

          {/* 4. Resources Catalogue */}
          <section ref={resourceSectionRef} id="resources-catalogue" className="mb-20 sm:mb-28 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
              <h2 className="font-sketch text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--ink)] tracking-wide">
                Resources
              </h2>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--ink)] opacity-60">
                Official NCERT Aligned Revision Notes & Mind Maps
              </p>
            </div>

            {/* Tag Button Filter Bar */}
            <FilterBar
              filters={filters}
              onSubjectChange={setSubject}
              onResourceTypeChange={setResourceType}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />

            {/* Variation 3 Resource Table */}
            <ResourceTable
              resources={filteredResources}
              searchQuery={filters.query}
              onResetFilters={resetFilters}
              onSuggestSearch={(q) => setQuery(q)}
            />
          </section>
        </main>

        {/* 5. Variation 3 Footer */}
        <Footer
          onSelectSubject={(subj) => handleSelectSubject(subj)}
          onScrollToResources={handleScrollToResources}
        />
      </div>

      {/* 6. Mobile Touch Navigation */}
      <MobileNav
        activeSubject={filters.subject}
        onSelectSubject={(subj) => handleSelectSubject(subj)}
        onOpenSearch={handleOpenSearch}
      />
    </div>
  );
}
