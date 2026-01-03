import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { useLifestyleStore } from '../store/lifestyleStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            {entry.dataKey.includes('Score') ? '%' : entry.dataKey === 'exercise' ? ' min' :
             entry.dataKey === 'water' ? ' glasses' : entry.dataKey === 'sleep' ? ' hrs' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressChart = () => {
  const { progressHistory } = useLifestyleStore();

  // Prepare data for charts - last 7 days
  const getLast7Days = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = progressHistory.find(item => item.date === dateStr) || {
        date: dateStr,
        exercise: 0,
        water: 0,
        sleep: 0,
        nutritionScore: 0,
        stressScore: 50
      };

      // Format date for display
      const displayDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      data.push({
        ...dayData,
        displayDate,
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return data;
  };

  const chartData = getLast7Days();

  // Calculate weekly averages
  const getWeeklyAverages = () => {
    const totals = chartData.reduce((acc, day) => ({
      exercise: acc.exercise + day.exercise,
      water: acc.water + day.water,
      sleep: acc.sleep + day.sleep,
      nutritionScore: acc.nutritionScore + day.nutritionScore,
      stressScore: acc.stressScore + day.stressScore,
      days: acc.days + 1
    }), { exercise: 0, water: 0, sleep: 0, nutritionScore: 0, stressScore: 0, days: 0 });

    return {
      exercise: Math.round(totals.exercise / totals.days),
      water: Math.round(totals.water / totals.days * 10) / 10,
      sleep: Math.round(totals.sleep / totals.days * 10) / 10,
      nutritionScore: Math.round(totals.nutritionScore / totals.days),
      stressScore: Math.round(totals.stressScore / totals.days)
    };
  };

  const weeklyAvg = getWeeklyAverages();

  return (
    <div
      className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <TrendingUp className="mr-2 text-blue-400" size={20} />
        Health Progress Trends
      </h2>

      {/* Weekly Summary */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-green-900/20 rounded-lg p-3 border border-green-700 text-center">
          <div className="text-2xl font-bold text-green-400">{weeklyAvg.exercise}</div>
          <div className="text-xs text-gray-300">Avg Exercise (min)</div>
        </div>
        <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700 text-center">
          <div className="text-2xl font-bold text-blue-400">{weeklyAvg.water}</div>
          <div className="text-xs text-gray-300">Avg Water (glasses)</div>
        </div>
        <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-700 text-center">
          <div className="text-2xl font-bold text-purple-400">{weeklyAvg.sleep}</div>
          <div className="text-xs text-gray-300">Avg Sleep (hrs)</div>
        </div>
        <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-700 text-center">
          <div className="text-2xl font-bold text-orange-400">{weeklyAvg.nutritionScore}%</div>
          <div className="text-xs text-gray-300">Nutrition Score</div>
        </div>
        <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-700 text-center">
          <div className="text-2xl font-bold text-pink-400">{weeklyAvg.stressScore}%</div>
          <div className="text-xs text-gray-300">Wellness Score</div>
        </div>
      </div>

      {/* Daily Goals Progress Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Target className="mr-2 text-green-400" size={18} />
          Daily Goals Progress (Last 7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="exercise"
                stroke="#10B981"
                strokeWidth={2}
                name="Exercise (min)"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="water"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Water (glasses)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Sleep (hrs)"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Scores Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="mr-2 text-orange-400" size={18} />
          Health Scores Trend (Last 7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="nutritionScore"
                fill="#F59E0B"
                name="Nutrition Score"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="stressScore"
                fill="#EC4899"
                name="Wellness Score"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-700">
        <h4 className="font-medium text-indigo-400 mb-2">📊 Progress Insights</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Track your daily goals to see improvement patterns over time</p>
          <p>• Higher nutrition scores indicate more mindful eating habits</p>
          <p>• Wellness scores reflect your stress management effectiveness</p>
          <p>• Consistent tracking helps identify areas needing more attention</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;