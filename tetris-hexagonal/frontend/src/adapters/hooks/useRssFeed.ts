import { useState, useEffect } from 'react';
import { RssApiAdapter } from '../api/RssApiAdapter';
import type { RssItem } from '../../domain/types';

const rssApi = new RssApiAdapter();

/**
 * Hook fetching and exposing RSS feed items.
 */
export function useRssFeed(url: string) {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rssApi.fetchFeed(url)
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { items, loading, error };
}
