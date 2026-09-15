import { useState, useEffect, useCallback } from 'react';
import { NEETResource } from '../types/resource';
import { resourceService } from '../services/resourceService';
import { searchEngine } from '../services/searchIndex';

export function useResources() {
  const [resources, setResources] = useState<NEETResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getAllResources(force);
      setResources(data);
      // Initialize search engine inverted index
      searchEngine.buildIndex(data);
    } catch (err) {
      console.error('Failed to load NEET resources', err);
      setError('Unable to load live catalogue. Offline resources active.');
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
    refresh: () => loadData(true),
  };
}
