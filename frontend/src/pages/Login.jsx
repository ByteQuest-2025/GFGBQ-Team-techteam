import { useState } from 'react';
import { Heart, Shield, Activity, Stethoscope } from 'lucide-react';
import AuthForm from '../components/AuthForm';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced aurora elements that complement the global background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-cyan-300/60">
          <Heart size={60} />
        </div>
        <div className="absolute top-40 right-20 text-pink-300/60">
          <Shield size={50} />
        </div>
        <div className="absolute bottom-32 left-20 text-green-300/60">
          <Activity size={45} />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300/60">
          <Stethoscope size={55} />
        </div>
      </div>

      {/* Main login card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative z-10">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 inline-block">
            🩺
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Health Guardian
          </h1>

          <p className="text-blue-100 text-sm">
            Early screening for diabetes & hypertension
          </p>
        </div>

        {/* Auth form */}
        <div>
          <AuthForm
            mode={mode}
            onAuthSuccess={onLogin}
          />
        </div>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-200 hover:text-white transition-colors duration-200 text-sm underline underline-offset-2 hover:underline-offset-4"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full">
        </div>
      </div>
    </div>
  );
}