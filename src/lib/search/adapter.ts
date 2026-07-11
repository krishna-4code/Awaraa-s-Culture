// Search Interface Contract
// Tomorrow, this will adapt to Algolia, Meilisearch, or Typesense.

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  price?: string;
}

export interface SearchAdapter {
  query(searchTerm: string, filters?: Record<string, any>): Promise<SearchResult[]>;
  index(documents: any[]): Promise<void>;
}

class MockSearch implements SearchAdapter {
  async query(searchTerm: string, filters?: Record<string, any>): Promise<SearchResult[]> {
    if (process.env.NODE_ENV === 'development') console.debug(`[Search] Querying for: ${searchTerm}`);
    return [];
  }
  
  async index(documents: any[]): Promise<void> {
    if (process.env.NODE_ENV === 'development') console.debug(`[Search] Indexing ${documents.length} documents`);
  }
}

export const search = new MockSearch();
