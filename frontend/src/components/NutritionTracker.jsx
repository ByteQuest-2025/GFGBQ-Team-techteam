import React, { useState } from 'react';
import { Apple, Plus, X, Clock } from 'lucide-react';
import { useLifestyleStore } from '../store/lifestyleStore';

const NutritionTracker = () => {
  const { nutritionLog, addNutritionEntry } = useLifestyleStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    food: '',
    category: 'vegetables',
    portions: 1,
    calories: 0
  });

  const foodCategories = {
    vegetables: { label: 'Vegetables', color: 'text-green-400', bg: 'bg-green-900/20' },
    fruits: { label: 'Fruits', color: 'text-orange-400', bg: 'bg-orange-900/20' },
    whole_grains: { label: 'Whole Grains', color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
    lean_proteins: { label: 'Lean Proteins', color: 'text-red-400', bg: 'bg-red-900/20' },
    healthy_fats: { label: 'Healthy Fats', color: 'text-purple-400', bg: 'bg-purple-900/20' },
    dairy: { label: 'Low-Fat Dairy', color: 'text-blue-400', bg: 'bg-blue-900/20' },
    beverages: { label: 'Healthy Beverages', color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    sweets: { label: 'Limited Sweets', color: 'text-pink-400', bg: 'bg-pink-900/20' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.food.trim()) return;

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newEntry
    };

    addNutritionEntry(entry);
    setNewEntry({
      food: '',
      category: 'vegetables',
      portions: 1,
      calories: 0
    });
    setIsAdding(false);
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return nutritionLog.filter(entry => entry.date.startsWith(today));
  };

  const todayEntries = getTodayEntries();

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Apple className="mr-2 text-green-400" size={20} />
          Nutrition Tracker
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center text-sm"
        >
          <Plus size={16} className="mr-1" />
          Add Food
        </button>
      </div>

      {/* Add Food Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Food Item</label>
              <input
                type="text"
                value={newEntry.food}
                onChange={(e) => setNewEntry({...newEntry, food: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="e.g., Broccoli, Apple, Chicken breast"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              >
                {Object.entries(foodCategories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Portions</label>
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={newEntry.portions}
                onChange={(e) => setNewEntry({...newEntry, portions: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Approx. Calories</label>
              <input
                type="number"
                min="0"
                value={newEntry.calories}
                onChange={(e) => setNewEntry({...newEntry, calories: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Add Entry
            </button>
          </div>
        </form>
      )}

      {/* Today's Entries */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center">
          <Clock className="mr-2 text-blue-400" size={18} />
          Today's Entries ({todayEntries.length})
        </h3>

        {todayEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Apple size={48} className="mx-auto mb-4 opacity-50" />
            <p>No food entries yet today.</p>
            <p className="text-sm">Start tracking your meals for better health insights!</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {todayEntries.map((entry) => {
              const category = foodCategories[entry.category];
              return (
                <div
                  key={entry.id}
                  className={`${category.bg} rounded-lg p-3 border border-gray-700`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{entry.food}</h4>
                      <p className={`text-sm ${category.color}`}>{category.label}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-400">
                        <span>{entry.portions} portion{entry.portions !== 1 ? 's' : ''}</span>
                        {entry.calories > 0 && (
                          <span className="ml-2">• {entry.calories} cal</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nutrition Tips */}
      <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-700">
        <h4 className="font-medium text-blue-400 mb-2">💡 Nutrition Tips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Focus on vegetables and fruits for fiber and nutrients</li>
          <li>• Choose whole grains over refined grains</li>
          <li>• Include lean proteins and healthy fats in moderation</li>
          <li>• Limit added sugars and processed foods</li>
        </ul>
      </div>
    </div>
  );
};

export default NutritionTracker;