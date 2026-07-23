import { useState, useEffect } from 'react';
import api from '../services/api';

function Explore() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, shelvesRes] = await Promise.all([
          api.get('media-items/'),
          api.get('shelves/')
        ]);
        const allItems = itemsRes.data.results || itemsRes.data;
        setItems(allItems);
        setFilteredItems(allItems);
        setShelves(shelvesRes.data.results || shelvesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = items;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.creator.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (filterType) {
      result = result.filter(item => item.media_type_name === filterType);
    }

    if (filterGenre) {
      result = result.filter(item => item.genre_name === filterGenre);
    }

    setFilteredItems(result);
  }, [searchQuery, filterType, filterGenre, items]);

  const addToShelf = async (shelfId, mediaItemId) => {
    try {
      await api.post(`shelves/${shelfId}/add_item/`, { media_item_id: mediaItemId });
      setMessage('Added to shelf!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add item');
    }
  };

  // Get unique types and genres for filter dropdowns
  const types = [...new Set(items.map(i => i.media_type_name).filter(Boolean))];
  const genres = [...new Set(items.map(i => i.genre_name).filter(Boolean))];

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Explore Media</h2>
      
      {/* Search and Filter Bar */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by title, creator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: '1', minWidth: '200px' }}
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select 
          value={filterGenre} 
          onChange={(e) => setFilterGenre(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          <option value="">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <p style={{ color: '#666', marginBottom: '15px' }}>
        Showing {filteredItems.length} of {items.length} items
      </p>

      {message && <p style={{ color: 'green', padding: '10px', background: '#e8f5e9', borderRadius: '4px', marginBottom: '15px' }}>{message}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredItems.map((item) => (
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
      
      {filteredItems.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          No items match your search.
        </p>
      )}
    </div>
  );
}

export default Explore;
