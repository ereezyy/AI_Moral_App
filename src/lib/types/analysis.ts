export interface EmotionalState {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  neutral: number;
}

export interface VideoAnalysis {
  facialExpression: EmotionalState;
  attentiveness: number;
  environmentalContext: string[];
}

export interface AudioAnalysis {
  sentiment: number;
  toxicity: number;
  emotionalTone: EmotionalState;
  volume: number;
  clarity: number;
}

export interface SituationalContext {
  location: {
    type: string;
    description: string;
    riskLevel: number;
  };
  timeContext: {
    timeOfDay: string;
    dayType: 'weekday' | 'weekend';
    season: string;
  };
  socialContext: {
    numberOfPeople: number;
    relationshipTypes: string[];
    socialPressure: number;
  };
}

export interface MoralAnalysis {
  ethicalAlignment: number;
  conflictingValues: string[];
  potentialConsequences: {
    shortTerm: string[];
    longTerm: string[];
  };
  recommendedActions: string[];
  moralPrinciples: {
    principle: string;
    relevance: number;
  }[];
}