import { IResourceProvider } from './baseProvider';
import { NEETResource } from '../../types/resource';
import { INITIAL_RESOURCES } from '../../data/mockCatalog';

const CACHE_KEY = 'neet_notes_gas_cache_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

interface CachedPayload {
  timestamp: number;
  data: NEETResource[];
}

export class GoogleAppsScriptProvider implements IResourceProvider {
  name = 'google-apps-script';
  private endpointUrl: string | null;

  constructor(endpointUrl?: string) {
    this.endpointUrl = endpointUrl || (import.meta.env.VITE_GAS_API_URL as string) || null;
  }

  async getResources(): Promise<NEETResource[]> {
    // 1. Check local cache first for instant response
    const cached = this.readFromCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      // Return cached data immediately
      return cached.data;
    }

    // 2. If no endpoint configured, return bundled data
    if (!this.endpointUrl) {
      return [...INITIAL_RESOURCES];
    }

    // 3. Attempt to fetch remote Google Apps Script JSON
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

      const response = await fetch(this.endpointUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GAS API HTTP error: ${response.status}`);
      }

      const raw = await response.json();
      const items: NEETResource[] = Array.isArray(raw) ? raw : raw.data || [];

      if (items.length > 0) {
        this.saveToCache(items);
        return items;
      }
    } catch (err) {
      console.warn('GoogleAppsScriptProvider: using fallback catalog.', err);
    }

    // 4. Fallback to cached or bundled
    return cached?.data || [...INITIAL_RESOURCES];
  }

  private readFromCache(): CachedPayload | null {
    try {
      const item = localStorage.getItem(CACHE_KEY);
      if (!item) return null;
      return JSON.parse(item) as CachedPayload;
    } catch {
      return null;
    }
  }

  private saveToCache(data: NEETResource[]): void {
    try {
      const payload: CachedPayload = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota exceeded or private mode errors
    }
  }
}
