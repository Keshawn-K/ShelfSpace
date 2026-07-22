import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Explore from './components/Explore';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <nav style={{ padding: '15px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>ShelfSpace</h1>
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </nav>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/explore" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/explore" /> : <Register />} />
          <Route 
            path="/explore" 
            element={isLoggedIn ? <Explore /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/explore" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;