import type { IRssApi } from '../../domain/ports/IRssApi';
import type { RssItem } from '../../domain/types';

const CORS_PROXY = 'https://corsproxy.io/?url=';

/**
 * Adapter fetching RSS feeds via a CORS proxy.
 * Replace with a direct backend proxy route when available.
 */
export class RssApiAdapter implements IRssApi {
  async fetchFeed(url: string): Promise<RssItem[]> {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(`RSS fetch error: ${response.status}`);
    }

    const text = await response.text();
    return this.parseRss(text);
  }

  private parseRss(xml: string): RssItem[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');

    return Array.from(items).map((item) => ({
      title: item.querySelector('title')?.textContent ?? '',
      link: item.querySelector('link')?.textContent ?? '',
      pubDate: item.querySelector('pubDate')?.textContent ?? ''
    }));
  }
}
