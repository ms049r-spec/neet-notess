import { IResourceProvider } from './baseProvider';
import { NEETResource } from '../../types/resource';
import { INITIAL_RESOURCES } from '../../data/mockCatalog';

export class LocalResourceProvider implements IResourceProvider {
  name = 'local-bundled';

  async getResources(): Promise<NEETResource[]> {
    // Simulated instant local provider
    return [...INITIAL_RESOURCES];
  }
}
