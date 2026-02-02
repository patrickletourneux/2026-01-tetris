import type { JSX } from 'react';
import { useRssFeed } from '../adapters/hooks/useRssFeed';

const RSS_URL = 'https://dwh.lequipe.fr/api/edito/rss?path=/Aussi/Sports-de-combat/';

/**
 * RSS feed panel displaying sports news from L'Equipe.
 */
export function RssFeed(): JSX.Element {
  const { items, loading, error } = useRssFeed(RSS_URL);

  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px' }}>Sports de combat</h3>

      {loading && <div style={{ color: '#888', fontSize: '12px' }}>Loading...</div>}
      {error && <div style={{ color: '#f44336', fontSize: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
        {items.slice(0, 15).map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={itemStyle}
          >
            <div style={{ fontSize: '12px', lineHeight: '1.3' }}>{item.title}</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
              {formatDate(item.pubDate)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const containerStyle: React.CSSProperties = {
  padding: '15px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  color: '#fff',
  width: '200px',
  height: '580px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const itemStyle: React.CSSProperties = {
  color: '#ddd',
  textDecoration: 'none',
  padding: '6px 8px',
  borderRadius: '4px',
  backgroundColor: '#252525',
  transition: 'background-color 0.2s'
};
