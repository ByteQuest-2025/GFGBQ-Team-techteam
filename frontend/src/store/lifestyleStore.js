import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLifestyleStore = create(
  persist(
    (set) => ({
      // Daily goals
      dailyGoals: {
        exercise: { target: 30, current: 0, unit: 'minutes' },
        water: { target: 8, current: 0, unit: 'glasses' },
        sleep: { target: 8, current: 0, unit: 'hours' }
      },

      // Nutrition data
      nutritionLog: [], // Array of { date, food, category, portions, calories }

      // Stress management
      stressLog: [], // Array of { date, mood, stressLevel, activities }

      // Progress history
      progressHistory: [], // Array of { date, metrics: { exercise, water, sleep, stressScore } }

      // Actions
      updateDailyGoal: (type, value) => set((state) => ({
        dailyGoals: {
          ...state.dailyGoals,
          [type]: {
            ...state.dailyGoals[type],
            current: Math.min(value, state.dailyGoals[type].target)
          }
        }
      })),

      updateTarget: (type, value) => set((state) => ({
        dailyGoals: {
          ...state.dailyGoals,
          [type]: {
            ...state.dailyGoals[type],
            target: value,
            current: Math.min(state.dailyGoals[type].current, value)
          }
        }
      })),

      resetDailyGoals: () => set((state) => ({
        dailyGoals: {
          exercise: { ...state.dailyGoals.exercise, current: 0 },
          water: { ...state.dailyGoals.water, current: 0 },
          sleep: { ...state.dailyGoals.sleep, current: 0 }
        }
      })),

      addStressEntry: (entry) => set((state) => ({
        stressLog: [entry, ...state.stressLog]
      })),

      updateProgress: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const metrics = {
          exercise: state.dailyGoals.exercise.current,
          water: state.dailyGoals.water.current,
          sleep: state.dailyGoals.sleep.current,
          stressScore: calculateStressScore(state.stressLog.filter(item =>
            item.date.startsWith(today)
          )),
          date: today
        };

        // Update or add today's progress
        const existingIndex = state.progressHistory.findIndex(item => item.date === today);
        const newHistory = [...state.progressHistory];
        if (existingIndex >= 0) {
          newHistory[existingIndex] = metrics;
        } else {
          newHistory.push(metrics);
        }

        return { progressHistory: newHistory };
      })
    }),
    {
      name: 'lifestyle-storage',
      partialize: (state) => ({
        dailyGoals: state.dailyGoals,
        stressLog: state.stressLog,
        progressHistory: state.progressHistory
      })
    }
  )
);

// Helper functions
function calculateStressScore(todayStress) {
  if (todayStress.length === 0) return 50; // Neutral
  const avgStress = todayStress.reduce((sum, entry) => sum + entry.stressLevel, 0) / todayStress.length;
  // Convert stress level (1-10) to score (100-0)
  return Math.max(0, 100 - (avgStress * 10));
}