import React, { useState } from 'react';
import { Brain, Plus, Smile, Meh, Frown, Heart, Wind, Play } from 'lucide-react';
import { useLifestyleStore } from '../store/lifestyleStore';

const StressManagement = () => {
  const { stressLog, addStressEntry } = useLifestyleStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [activities, setActivities] = useState([]);

  const moods = [
    { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-green-400' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-400' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-400' },
    { value: 'stressed', label: 'Stressed', icon: Frown, color: 'text-orange-400' },
    { value: 'anxious', label: 'Anxious', icon: Frown, color: 'text-red-400' }
  ];

  const relaxationExercises = [
    {
      title: 'Deep Breathing',
      description: '4-7-8 breathing technique',
      duration: '2 min',
      instructions: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.',
      icon: Wind
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Tension release technique',
      duration: '5 min',
      instructions: 'Tense and release each muscle group from toes to head.',
      icon: Heart
    },
    {
      title: 'Mindful Walking',
      description: 'Present moment awareness',
      duration: '10 min',
      instructions: 'Walk slowly, focus on each step and your surroundings.',
      icon: Play
    },
    {
      title: 'Gratitude Practice',
      description: 'Positive reflection',
      duration: '3 min',
      instructions: 'Write down 3 things you\'re grateful for today.',
      icon: Heart
    }
  ];

  const handleSubmitMood = () => {
    if (!selectedMood) return;

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      stressLevel: stressLevel,
      activities: activities
    };

    addStressEntry(entry);
    setSelectedMood(null);
    setStressLevel(5);
    setActivities([]);
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return stressLog.filter(entry => entry.date.startsWith(today));
  };

  const todayEntries = getTodayEntries();
  const latestEntry = todayEntries[0]; // Most recent entry

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Brain className="mr-2 text-purple-400" size={20} />
        Stress Management
      </h2>

      {/* Current Mood Check-in */}
      <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>

        {/* Mood Selection */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMood === mood.value
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <Icon className={`mx-auto mb-1 ${mood.color}`} size={24} />
                <span className="text-xs text-gray-300">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stress Level Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Stress Level: {stressLevel}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitMood}
          disabled={!selectedMood}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Log Mood Check-in
        </button>
      </div>

      {/* Today's Summary */}
      {latestEntry && (
        <div className="mb-6 bg-purple-900/20 rounded-lg p-4 border border-purple-700">
          <h3 className="text-lg font-medium mb-2">Today's Latest Check-in</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {React.createElement(
                moods.find(m => m.value === latestEntry.mood)?.icon || Meh,
                { className: `mr-2 ${moods.find(m => m.value === latestEntry.mood)?.color || 'text-gray-400'}`, size: 20 }
              )}
              <span className="capitalize">{latestEntry.mood}</span>
            </div>
            <div className="text-sm text-gray-400">
              Stress Level: {latestEntry.stressLevel}/10
            </div>
          </div>
        </div>
      )}

      {/* Relaxation Exercises */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Heart className="mr-2 text-pink-400" size={18} />
          Quick Relaxation Exercises
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {relaxationExercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <div
                key={exercise.title}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-pink-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Icon className="mr-2 text-pink-400" size={18} />
                    <h4 className="font-medium">{exercise.title}</h4>
                  </div>
                  <span className="text-xs bg-pink-900/20 text-pink-400 px-2 py-1 rounded">
                    {exercise.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{exercise.description}</p>
                <p className="text-xs text-gray-300">{exercise.instructions}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stress Management Tips */}
      <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
        <h4 className="font-medium text-green-400 mb-2">🧘 Stress Management Tips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Practice deep breathing when feeling overwhelmed</li>
          <li>• Take short breaks during work to stretch and move</li>
          <li>• Maintain a consistent sleep schedule</li>
          <li>• Connect with friends and family regularly</li>
          <li>• Consider mindfulness or meditation apps</li>
        </ul>
      </div>
    </div>
  );
};

export default StressManagement;