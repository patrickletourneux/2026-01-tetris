import type { RssItem } from '../types';

/**
 * Port defining RSS feed fetching.
 * Implemented by an adapter using a CORS proxy now, replaced by backend proxy later.
 */
export interface IRssApi {
  fetchFeed(url: string): Promise<RssItem[]>;
}
