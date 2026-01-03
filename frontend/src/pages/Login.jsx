import { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🩺</div>
          <h1 className="text-2xl font-bold">Silent Disease Detector</h1>
          <p className="text-gray-400">Early screening for diabetes & hypertension</p>
        </div>
        
        <AuthForm 
          mode={mode} 
          onAuthSuccess={onLogin} 
        />
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-400 hover:underline text-sm"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}