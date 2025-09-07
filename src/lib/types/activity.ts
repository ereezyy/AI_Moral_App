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