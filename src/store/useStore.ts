import { create } from 'zustand';
import { UserState } from '../types';

const initialState: UserState = {
  activities: [],
  moralEvents: [],
  dailyGoals: {
    meditation: 20,
    exercise: 30,
    socialInteraction: 120,
  },
  stats: {
    weeklyEthicalScore: 0,
    consistencyStreak: 0,
    totalMoralDecisions: 0,
  },
};

export const useStore = create<UserState>(() => initialState);