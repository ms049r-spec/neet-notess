import { NEETResource } from '../types/resource';

interface IndexedDoc {
  resource: NEETResource;
  tokens: Set<string>;
  searchableText: string;
}

const SYNONYMS: Record<string, string[]> = {
  krebs: ['respiration', 'cellular', 'mitochondria', 'tca'],
  dna: ['molecular', 'replication', 'transcription', 'translation', 'genetics'],
  mendel: ['inheritance', 'variation', 'genetics', 'dihybrid'],
  carnot: ['thermodynamics', 'efficiency', 'engine'],
  lens: ['optics', 'refraction', 'focal', 'telescope', 'microscope'],
  sn1: ['haloalkanes', 'organic', 'nucleophilic', 'carbocation'],
  aldol: ['aldehydes', 'ketones', 'carboxylic', 'condensation'],
  nernst: ['electrochemistry', 'potential', 'emf'],
  vsepr: ['bonding', 'hybridization', 'geometry', 'lone pair'],
  gravity: ['gravitation', 'kepler', 'orbital', 'escape'],
};

export class SearchEngine {
  private index: IndexedDoc[] = [];

  buildIndex(resources: NEETResource[]): void {
    this.index = resources.map((r) => {
      const tokenList = [
        ...this.tokenize(r.title),
        ...this.tokenize(r.chapter),
        ...this.tokenize(r.unitName),
        ...this.tokenize(r.subject),
        ...(r.subCategory ? this.tokenize(r.subCategory) : []),
        ...r.tags.flatMap((t) => this.tokenize(t)),
        ...this.tokenize(r.description),
      ];

      return {
        resource: r,
        tokens: new Set(tokenList),
        searchableText: [
          r.title,
          r.chapter,
          r.unitName,
          r.subject,
          r.subCategory || '',
          r.tags.join(' '),
          r.description,
        ]
          .join(' ')
          .toLowerCase(),
      };
    });
  }

  search(rawQuery: string): NEETResource[] {
    const query = rawQuery.trim().toLowerCase();
    if (!query) {
      return this.index.map((d) => d.resource);
    }

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return this.index.map((d) => d.resource);
    }

    // Expand query with synonyms
    const expandedTokens = new Set<string>(queryTokens);
    for (const token of queryTokens) {
      if (SYNONYMS[token]) {
        SYNONYMS[token].forEach((syn) => expandedTokens.add(syn));
      }
    }

    const scored: { resource: NEETResource; score: number }[] = [];

    for (const doc of this.index) {
      let score = 0;
      const lowerTitle = doc.resource.title.toLowerCase();
      const lowerChapter = doc.resource.chapter.toLowerCase();

      // Exact phrase bonus
      if (doc.searchableText.includes(query)) {
        score += 15;
      }
      if (lowerTitle.includes(query)) {
        score += 30;
      }
      if (lowerChapter.includes(query)) {
        score += 20;
      }

      // Token matching
      for (const qToken of expandedTokens) {
        if (doc.tokens.has(qToken)) {
          score += 10;
        } else {
          // Prefix matching
          for (const docToken of doc.tokens) {
            if (docToken.startsWith(qToken) && qToken.length >= 3) {
              score += 5;
              break;
            }
          }
        }
      }

      if (score > 0) {
        // High yield bonus
        if (doc.resource.isHighYield) {
          score += 2;
        }
        scored.push({ resource: doc.resource, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.resource);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }
}

export const searchEngine = new SearchEngine();
