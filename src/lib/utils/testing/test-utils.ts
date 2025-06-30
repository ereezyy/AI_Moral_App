import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };

export const mockMoralAnalysis = {
  ethicalAlignment: 0.85,
  conflictingValues: ['autonomy_vs_beneficence'],
  potentialConsequences: {
    shortTerm: ['immediate_impact'],
    longTerm: ['reputation_effect']
  },
  recommendedActions: ['consider_alternatives'],
  moralPrinciples: [
    { principle: 'autonomy', relevance: 0.9 }
  ]
};

export const mockEmotionalState = {
  joy: 0.6,
  sadness: 0.1,
  anger: 0.1,
  fear: 0.1,
  surprise: 0.2,
  neutral: 0.3
};

export const mockSituationalContext = {
  location: {
    type: 'workplace',
    description: 'office',
    riskLevel: 0.3
  },
  timeContext: {
    timeOfDay: 'morning',
    dayType: 'weekday' as const,
    season: 'spring'
  },
  socialContext: {
    numberOfPeople: 3,
    relationshipTypes: ['colleague'],
    socialPressure: 0.4
  }
};