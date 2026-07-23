import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const shelvesRes = await api.get('shelves/');
        const shelves = shelvesRes.data.results || shelvesRes.data;
        
        let totalItems = 0;
        let finishedItems = 0;
        let totalRating = 0;
        let ratedItems = 0;
        const genreCounts = {};

        shelves.forEach((shelf) => {
          if (shelf.items) {
            totalItems += shelf.items.length;
            if (shelf.name === 'Finished') {
              finishedItems = shelf.items.length;
            }
            shelf.items.forEach((item) => {
              if (item.rating) {
                totalRating += item.rating;
                ratedItems++;
              }
              const genre = item.media_item.genre_name || 'Unknown';
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        setStats({
          totalItems,
          finishedItems,
          averageRating: ratedItems > 0 ? (totalRating / ratedItems).toFixed(1) : 0,
          genreCounts: Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Items</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.totalItems}</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Finished</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#4caf50' }}>{stats.finishedItems}</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Average Rating</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#ff9800' }}>{stats.averageRating} ⭐</p>
        </div>
      </div>

      <h3>Top Genres</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white' }}>
        {stats.genreCounts.length > 0 ? (
          stats.genreCounts.map(([genre, count]) => (
            <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>{genre}</span>
              <span style={{ fontWeight: 'bold' }}>{count}</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#999' }}>No data yet. Start adding items to your shelves!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;