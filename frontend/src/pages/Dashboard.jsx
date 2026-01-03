import { useState } from 'react';
import RiskForm from '../components/RiskForm';

export default function Dashboard({ username, onLogout }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setResult(prediction);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Hello, {username}!</h1>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm"
          >
            Log Out
          </button>
        </div>

        {/* Form */}
        <RiskForm onPredict={handlePredict} />

        {/* Result */}
        {loading && (
          <div className="mt-6 text-center text-blue-400">
            Analyzing your health profile...
          </div>
        )}

        {result && (
          <div className="mt-6 bg-dark-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3">
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
          </div>
        )}
      </div>
    </div>
  );
}