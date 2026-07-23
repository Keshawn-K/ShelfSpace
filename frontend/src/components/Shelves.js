import { useState, useEffect } from 'react';
import api from '../services/api';

function Shelves() {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');

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

  useEffect(() => {
    fetchShelves();
  }, []);

  const startEdit = (item) => {
    setEditingItem(item.id);
    setRating(item.rating || '');
    setReviewText(item.review_text || '');
  };

  const saveReview = async (itemId) => {
    try {
      await api.patch(`shelf-items/${itemId}/`, {
        rating: rating ? parseInt(rating) : null,
        review_text: reviewText
      });
      setEditingItem(null);
      fetchShelves();
    } catch (err) {
      console.error('Failed to save review', err);
    }
  };

  const moveShelf = async (itemId, newShelfId) => {
    try {
      await api.patch(`shelf-items/${itemId}/`, { shelf: newShelfId });
      fetchShelves();
    } catch (err) {
      console.error('Failed to move item', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`shelf-items/${itemId}/`);
      fetchShelves();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  if (loading) return <p>Loading shelves...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Shelves</h2>
      {shelves.map((shelf) => (
        <div key={shelf.id} style={{ marginBottom: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white' }}>
          <h3>{shelf.name} <span style={{ color: '#666', fontSize: '14px' }}>({shelf.item_count} items)</span></h3>
          {shelf.items && shelf.items.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {shelf.items.map((item) => (
                <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '15px' }}>
                  <h4>{item.media_item.title}</h4>
                  <p style={{ fontSize: '12px', color: '#666' }}>{item.media_item.creator} • {item.media_item.media_type_name}</p>
                  
                  {editingItem === item.id ? (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Rating (1-5):</label>
                        <select 
                          value={rating} 
                          onChange={(e) => setRating(e.target.value)}
                          style={{ padding: '5px', width: '100%' }}
                        >
                          <option value="">No rating</option>
                          <option value="1">⭐ </option>
                          <option value="2">⭐⭐ </option>
                          <option value="3">⭐⭐⭐ </option>
                          <option value="4">⭐⭐⭐⭐ </option>
                          <option value="5">⭐⭐⭐⭐⭐ </option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Review:</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write your review..."
                          style={{ width: '100%', padding: '5px', minHeight: '60px' }}
                        />
                      </div>
                      <button onClick={() => saveReview(item.id)} style={{ marginRight: '10px', padding: '6px 12px' }}>Save</button>
                      <button onClick={() => setEditingItem(null)} style={{ padding: '6px 12px' }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '10px' }}>
                      {item.rating && <p>⭐ {item.rating}/5</p>}
                      {item.review_text && <p style={{ fontSize: '14px', fontStyle: 'italic' }}>"{item.review_text}"</p>}
                      <button onClick={() => startEdit(item)} style={{ marginTop: '10px', marginRight: '10px', padding: '6px 12px', fontSize: '12px' }}>
                        {item.rating ? 'Edit Review' : 'Add Review'}
                      </button>
                      <button onClick={() => deleteItem(item.id)} style={{ padding: '6px 12px', fontSize: '12px', color: 'red' }}>
                        Remove
                      </button>
                    </div>
                  )}
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