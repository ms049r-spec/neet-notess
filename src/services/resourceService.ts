import { NEETResource, SubjectId } from '../types/resource';

class ResourceService {
  async getAllResources(): Promise<NEETResource[]> {
    const response = await fetch('/catalog.json', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Catalog HTTP error: ${response.status}`);
    }

    const resources = (await response.json()) as NEETResource[];

    if (!Array.isArray(resources)) {
      throw new Error('Catalog response is not an array.');
    }

    return resources;
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
