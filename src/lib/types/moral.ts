import { EmotionalState } from './analysis';

export interface MoralPrinciple {
  id: string;
  weight: number;
  description: string;
}

export interface MoralConflict {
  type: string;
  description: string;
  severity: number;
  relatedPrinciples: string[];
}

export interface MoralRecommendation {
  action: string;
  description: string;
  priority: number;
  principles: string[];
}

export interface MoralContext {
  emotional: EmotionalState;
  environmental: string[];
  social: {
    pressure: number;
    relationships: string[];
    groupSize: number;
  };
  behavioral: {
    patterns: string[];
    consistency: number;
  };
}