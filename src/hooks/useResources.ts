import { useState, useEffect, useCallback } from 'react';
import { NEETResource } from '../types/resource';
import { searchEngine } from '../services/searchIndex';

export function useResources() {
  const [resources, setResources] = useState<NEETResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/catalog.json', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Catalog HTTP error: ${response.status}`);
      }

      const data = (await response.json()) as NEETResource[];

      if (!Array.isArray(data)) {
        throw new Error('Catalog response is not an array.');
      }

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
