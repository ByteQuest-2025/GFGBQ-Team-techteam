import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, History, LogOut } from 'lucide-react';
import RiskForm from '../components/RiskForm';
import LifestyleGoals from '../components/LifestyleGoals';
import StressManagement from '../components/StressManagement';
import ProgressChart from '../components/ProgressChart';
import { useLifestyleStore } from '../store/lifestyleStore';

export default function Dashboard({ username, onLogout }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Risk Assessment');
  const { updateProgress } = useLifestyleStore();

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

  // Update progress when component mounts
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

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
    <div className="min-h-screen p-4 relative">
      {/* Semi-transparent overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] -z-10"></div>
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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-black/20 backdrop-blur-md rounded-lg p-1 border border-white/10">
            {['Risk Assessment', 'Lifestyle Goals', 'Stress Management', 'Progress Chart'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Risk Assessment' && (
            <div className="space-y-6">
              <RiskForm onPredict={handlePredict} loading={loading} />
              
              {loading && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block mb-4"
                    >
                      <TrendingUp className="text-blue-400" size={48} />
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl font-bold mb-4 text-blue-400"
                    >
                      Analyzing Your Health Profile
                    </motion.h3>
                    
                    <div className="w-full bg-dark-700 rounded-full h-2 mb-4">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-300"
                    >
                      Processing your data ... 
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-center mt-4 space-x-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
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
                </div>
              )}

              {history.length > 0 && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'Lifestyle Goals' && <LifestyleGoals />}
          {activeTab === 'Stress Management' && <StressManagement />}
          {activeTab === 'Progress Chart' && <ProgressChart />}
        </motion.div>
      </div>
    </div>
  );
}