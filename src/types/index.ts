export interface Activity {
  id: string;
  timestamp: number;
  type: 'exercise' | 'meditation' | 'social' | 'work' | 'moral_decision';
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  metrics?: {
    [key: string]: number;
  };
  notes?: string;
}

export interface MoralEvent {
  id: string;
  timestamp: number;
  situation: string;
  context: string;
  decision: string;
  analysis: {
    sentiment: number;
    ethicalScore: number;
    considerations: string[];
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  audioContext?: string;
}

export interface UserState {
  activities: Activity[];
  moralEvents: MoralEvent[];
  dailyGoals: {
    meditation: number;
    exercise: number;
    socialInteraction: number;
  };
  stats: {
    weeklyEthicalScore: number;
    consistencyStreak: number;
    totalMoralDecisions: number;
  };
}