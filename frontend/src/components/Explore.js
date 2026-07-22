import { useState, useEffect } from 'react';
import { getMediaItems } from '../services/api';

function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getMediaItems();
        setItems(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to fetch items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Explore Media</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3>{item.title}</h3>
            <p><strong>{item.creator}</strong> • {item.media_type_name} • {item.year}</p>
            <p>{item.description}</p>
            <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px' }}>
              {item.genre_name || 'No genre'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;