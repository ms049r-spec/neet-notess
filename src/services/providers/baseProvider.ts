import { NEETResource } from '../../types/resource';

export interface IResourceProvider {
  name: string;
  getResources(): Promise<NEETResource[]>;
}
