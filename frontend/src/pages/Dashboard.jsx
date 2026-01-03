import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, History, LogOut } from 'lucide-react';
import RiskForm from '../components/RiskForm';

export default function Dashboard({ username, onLogout }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/history', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.history) {
          setHistory(data.history);
        } else if (res.status === 401) {
          // Session expired, logout
          onLogout();
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, [onLogout]);

  const handlePredict = async (data) => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const prediction = await res.json();
      
      if (!res.ok) {
        // Handle error responses
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          // Optionally, trigger logout
          onLogout();
          return;
        }
        alert(prediction.error || 'Failed to get prediction');
        return;
      }
      
      setResult(prediction);
      // Add to history
      setHistory(prev => [{
        id: Date.now(), // temp id
        disease: prediction.disease,
        risk_level: prediction.riskLevel,
        risk_score: prediction.riskScore,
        timestamp: Date.now()
      }, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Failed to get prediction. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-900/50 border-red-700';
      case 'Medium': return 'bg-yellow-900/50 border-yellow-700';
      case 'Low': return 'bg-green-900/50 border-green-700';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-2xl font-bold flex items-center">
            <Heart className="mr-2 text-red-400" size={24} />
            Hello, {username}!
          </h1>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm flex items-center"
          >
            <LogOut size={16} className="mr-1" />
            Log Out
          </button>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <RiskForm onPredict={handlePredict} loading={loading} />
        </motion.div>

        {/* Result */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-blue-400 flex items-center justify-center"
          >
            <TrendingUp className="mr-2 animate-pulse" size={20} />
            Analyzing your health profile...
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-dark-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <TrendingUp className="mr-2 text-blue-400" size={20} />
              Your Risk for {result.disease === 'diabetes' ? 'Type 2 Diabetes' : 'Hypertension'}
            </h2>
            
            <div className={`inline-block px-4 py-2 rounded-full border mb-4 ${getRiskColor(result.riskLevel)}`}>
              <span className="font-bold">{result.riskLevel} Risk</span> ({Math.round(result.riskScore * 100)}%)
            </div>
            
            <h3 className="font-medium mb-2">Recommended Actions:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-200">
              {result.advice.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
            
            <p className="text-sm text-gray-400 mt-4 italic">
              This is a screening tool, not a diagnosis. Consult a healthcare provider.
            </p>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-dark-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <History className="mr-2 text-green-400" size={20} />
              Prediction History
            </h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-dark-700 p-3 rounded">
                  <div>
                    <span className="font-medium capitalize">{item.disease}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${getRiskColor(item.risk_level)}`}>
                      {item.risk_level}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {Math.round(item.risk_score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}