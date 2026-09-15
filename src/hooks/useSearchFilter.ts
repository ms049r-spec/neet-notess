import { useState, useMemo, useCallback } from 'react';
import { NEETResource, SubjectId, ResourceTypeId } from '../types/resource';
import { ActiveFilters } from '../types/filter';
import { searchEngine } from '../services/searchIndex';

const DEFAULT_FILTERS: ActiveFilters = {
  query: '',
  subject: 'all',
  resourceType: 'all',
  classLevel: 'all',
  highYieldOnly: false,
  sortBy: 'high-yield',
};

export function useSearchFilter(initialResources: NEETResource[]) {
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setSubject = useCallback((subject: SubjectId | 'all') => {
    setFilters((prev) => ({ ...prev, subject }));
  }, []);

  const setResourceType = useCallback((resourceType: ResourceTypeId | 'all') => {
    setFilters((prev) => ({ ...prev, resourceType }));
  }, []);

  const setClassLevel = useCallback((classLevel: 11 | 12 | 'all') => {
    setFilters((prev) => ({ ...prev, classLevel }));
  }, []);

  const toggleHighYield = useCallback(() => {
    setFilters((prev) => ({ ...prev, highYieldOnly: !prev.highYieldOnly }));
  }, []);

  const setSortBy = useCallback((sortBy: ActiveFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Compute filtered & searched list
  const filteredResources = useMemo(() => {
    // 1. If search query exists, query searchEngine
    let results: NEETResource[];
    if (filters.query.trim()) {
      results = searchEngine.search(filters.query);
    } else {
      results = [...initialResources];
    }

    // 2. Multi-facet filters
    results = results.filter((item) => {
      if (filters.subject !== 'all' && item.subject !== filters.subject) {
        return false;
      }
      if (filters.resourceType !== 'all' && item.type !== filters.resourceType) {
        return false;
      }
      if (filters.classLevel !== 'all' && item.classLevel !== filters.classLevel) {
        return false;
      }
      if (filters.highYieldOnly && !item.isHighYield) {
        return false;
      }
      return true;
    });

    // 3. Sorting
    if (filters.sortBy === 'high-yield') {
      results.sort((a, b) => (b.isHighYield ? 1 : 0) - (a.isHighYield ? 1 : 0));
    } else if (filters.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (filters.sortBy === 'alphabetical') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }, [initialResources, filters]);

  // Grouping by NCERT Unit
  const groupedByUnit = useMemo(() => {
    const map = new Map<string, NEETResource[]>();
    for (const res of filteredResources) {
      const unit = res.unitName || 'General';
      if (!map.has(unit)) {
        map.set(unit, []);
      }
      map.get(unit)!.push(res);
    }
    return map;
  }, [filteredResources]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subject !== 'all') count++;
    if (filters.resourceType !== 'all') count++;
    if (filters.classLevel !== 'all') count++;
    if (filters.highYieldOnly) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setQuery,
    setSubject,
    setResourceType,
    setClassLevel,
    toggleHighYield,
    setSortBy,
    resetFilters,
    filteredResources,
    groupedByUnit,
    activeFilterCount,
  };
}
