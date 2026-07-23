import { useState, useEffect } from 'react';
import api from '../services/api';

function Shelves() {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const response = await api.get('shelves/');
        setShelves(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to fetch shelves', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelves();
  }, []);

  if (loading) return <p>Loading shelves...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Shelves</h2>
      {shelves.map((shelf) => (
        <div key={shelf.id} style={{ marginBottom: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
          <h3>{shelf.name} <span style={{ color: '#666', fontSize: '14px' }}>({shelf.item_count} items)</span></h3>
          {shelf.items && shelf.items.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {shelf.items.map((item) => (
                <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '10px' }}>
                  <h4>{item.media_item.title}</h4>
                  <p style={{ fontSize: '12px', color: '#666' }}>{item.media_item.creator}</p>
                  {item.rating && <p>⭐ {item.rating}/5</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999' }}>No items in this shelf yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Shelves;