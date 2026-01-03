import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, loading, setUser, setLoading, logout } = useAuthStore();

  // Check if user is already logged in (via session)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/me', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.username);
        }
      } catch {
        // Ignore
      }
      setLoading(false);
    };
    checkAuth();
  }, [setUser, setLoading]);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    logout();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Dashboard username={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;