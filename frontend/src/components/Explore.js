import { useState, useEffect } from 'react';
import api from '../services/api';

function Explore() {
  const [items, setItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, shelvesRes] = await Promise.all([
          api.get('media-items/'),
          api.get('shelves/')
        ]);
        setItems(itemsRes.data.results || itemsRes.data);
        setShelves(shelvesRes.data.results || shelvesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToShelf = async (shelfId, mediaItemId) => {
    try {
      await api.post(`shelves/${shelfId}/add_item/`, { media_item_id: mediaItemId });
      setMessage('Added to shelf!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add item');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Explore Media</h2>
      {message && <p style={{ color: 'green', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>{message}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white' }}>
            <h3>{item.title}</h3>
            <p><strong>{item.creator}</strong> • {item.media_type_name} • {item.year}</p>
            <p style={{ fontSize: '14px', color: '#555' }}>{item.description}</p>
            <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              {item.genre_name || 'No genre'}
            </span>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '12px', marginBottom: '5px' }}>Add to shelf:</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {shelves.map((shelf) => (
                  <button
                    key={shelf.id}
                    onClick={() => addToShelf(shelf.id, item.id)}
                    style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #333' }}
                  >
                    {shelf.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;