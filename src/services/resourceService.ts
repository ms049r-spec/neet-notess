import { NEETResource, SubjectId } from '../types/resource';
import { INITIAL_RESOURCES } from '../data/mockCatalog';

class ResourceService {
  async getAllResources(): Promise<NEETResource[]> {
    return [...INITIAL_RESOURCES];
  }

  async getResourcesBySubject(subject: SubjectId): Promise<NEETResource[]> {
    const all = await this.getAllResources();
    return all.filter((resource) => resource.subject === subject);
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
    const units = new Set(all.map((resource) => resource.unitName));

    return {
      totalResources: all.length,
      highYieldCount: all.filter((resource) => resource.isHighYield).length,
      biologyCount: all.filter((resource) => resource.subject === 'biology').length,
      physicsCount: all.filter((resource) => resource.subject === 'physics').length,
      chemistryCount: all.filter((resource) => resource.subject === 'chemistry').length,
      totalUnitsCovered: units.size,
    };
  }
}

export const resourceService = new ResourceService();
