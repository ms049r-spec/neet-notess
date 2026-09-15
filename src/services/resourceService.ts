import { IResourceProvider } from './providers/baseProvider';
import { LocalResourceProvider } from './providers/localProvider';
import { GoogleAppsScriptProvider } from './providers/gasProvider';
import { NEETResource, SubjectId } from '../types/resource';
import { SUBJECTS } from '../config/constants';

class ResourceService {
  private provider: IResourceProvider;
  private cachedResources: NEETResource[] | null = null;

  constructor() {
    // Auto-detect whether to use GAS or Local provider
    const gasUrl = import.meta.env.VITE_GAS_API_URL as string | undefined;
    if (gasUrl && gasUrl.startsWith('http')) {
      this.provider = new GoogleAppsScriptProvider(gasUrl);
    } else {
      this.provider = new LocalResourceProvider();
    }
  }

  setProvider(provider: IResourceProvider): void {
    this.provider = provider;
    this.cachedResources = null;
  }

  async getAllResources(forceRefresh = false): Promise<NEETResource[]> {
    if (this.cachedResources && !forceRefresh) {
      return this.cachedResources;
    }
    const data = await this.provider.getResources();
    this.cachedResources = data;
    return data;
  }

  async getResourcesBySubject(subject: SubjectId): Promise<NEETResource[]> {
    const all = await this.getAllResources();
    return all.filter((r) => r.subject === subject);
  }

  async getCatalogStats(): Promise<{
    totalResources: number;
    highYieldCount: number;
    biologyCount: number;
    physicsCount: number;
    chemistryCount: number;
    totalUnitsCovered: number;
  }> {
    const all = await this.getAllResources();
    const units = new Set(all.map((r) => r.unitName));

    return {
      totalResources: all.length,
      highYieldCount: all.filter((r) => r.isHighYield).length,
      biologyCount: all.filter((r) => r.subject === 'biology').length,
      physicsCount: all.filter((r) => r.subject === 'physics').length,
      chemistryCount: all.filter((r) => r.subject === 'chemistry').length,
      totalUnitsCovered: units.size,
    };
  }
}

export const resourceService = new ResourceService();
