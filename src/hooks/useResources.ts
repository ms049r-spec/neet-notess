import { useState, useEffect, useCallback } from 'react';
import { NEETResource } from '../types/resource';
import { INITIAL_RESOURCES } from '../data/mockCatalog';
import { searchEngine } from '../services/searchIndex';

export function useResources() {
  const [resources, setResources] = useState<NEETResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = [...INITIAL_RESOURCES];
      setResources(data);
      searchEngine.buildIndex(data);
    } catch (err) {
      console.error('Failed to load NEET resources', err);
      setError('Unable to load resource catalogue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    resources,
    isLoading,
    error,
    refresh: loadData,
  };
}
