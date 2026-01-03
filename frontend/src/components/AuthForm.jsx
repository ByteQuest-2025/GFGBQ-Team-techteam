import { useState } from 'react';

export default function AuthForm({ mode, onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = mode === 'login' ? '/login' : '/register';
    const res = await fetch('http://localhost:5000' + url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      onAuthSuccess(username);
    } else {
      setError(data.error || 'Authentication failed');
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded p-2.5 focus:ring-2 focus:ring-blue-500"
            required
            minLength="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded p-2.5 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-medium transition"
        >
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}