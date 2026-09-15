import { SubjectId, ResourceTypeId } from './resource';

export interface ActiveFilters {
  query: string;
  subject: SubjectId | 'all';
  resourceType: ResourceTypeId | 'all';
  classLevel: 11 | 12 | 'all';
  highYieldOnly: boolean;
  sortBy: 'high-yield' | 'recent' | 'alphabetical';
}

export interface SearchResult {
  total: number;
  results: import('./resource').NEETResource[];
  queryTokens: string[];
}
