import React from 'react';
import { Target, Droplets, Moon, Activity, Plus, Minus } from 'lucide-react';
import { useLifestyleStore } from '../store/lifestyleStore';

const LifestyleGoals = () => {
  const { dailyGoals, updateDailyGoal } = useLifestyleStore();

  const goals = [
    {
      key: 'exercise',
      label: 'Exercise',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700'
    },
    {
      key: 'water',
      label: 'Water Intake',
      icon: Droplets,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700'
    },
    {
      key: 'sleep',
      label: 'Sleep Hours',
      icon: Moon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700'
    }
  ];

  const handleIncrement = (key) => {
    const current = dailyGoals[key].current;
    const target = dailyGoals[key].target;
    if (current < target) {
      updateDailyGoal(key, current + 1);
    }
  };

  const handleDecrement = (key) => {
    const current = dailyGoals[key].current;
    if (current > 0) {
      updateDailyGoal(key, current - 1);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Target className="mr-2 text-yellow-400" size={20} />
        Daily Health Goals
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const current = dailyGoals[goal.key].current;
          const target = dailyGoals[goal.key].target;
          const percentage = getProgressPercentage(current, target);
          const isComplete = current >= target;

          return (
            <div
              key={goal.key}
              className={`${goal.bgColor} rounded-lg p-4 border ${goal.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Icon className={`${goal.color} mr-2`} size={20} />
                  <span className="font-medium text-white">{goal.label}</span>
                </div>
                <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-gray-300'}`}>
                  {current}/{target} {dailyGoals[goal.key].unit}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleDecrement(goal.key)}
                  disabled={current <= 0}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <Minus size={14} />
                </button>

                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={current}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(target, parseInt(e.target.value) || 0));
                      updateDailyGoal(goal.key, value);
                    }}
                    className="w-16 text-center bg-transparent border-none text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    min="0"
                    max={target}
                  />
                  <span className="text-xs text-gray-400">/{target}</span>
                </div>

                <button
                  onClick={() => handleIncrement(goal.key)}
                  disabled={current >= target}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => updateDailyGoal(goal.key, target)}
                  disabled={current >= target}
                  className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors border border-blue-500/30"
                >
                  Set to Goal
                </button>
              </div>

              {isComplete && (
                <div className="mt-2 text-center">
                  <span className="text-green-400 text-sm font-medium">Goal achieved! 🎉</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => useLifestyleStore.getState().resetDailyGoals()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          Reset Today's Progress
        </button>
      </div>
    </div>
  );
};

export default LifestyleGoals;