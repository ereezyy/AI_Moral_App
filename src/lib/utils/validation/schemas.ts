import { z } from 'zod';

export const emotionalStateSchema = z.object({
  joy: z.number().min(0).max(1),
  sadness: z.number().min(0).max(1),
  anger: z.number().min(0).max(1),
  fear: z.number().min(0).max(1),
  surprise: z.number().min(0).max(1),
  neutral: z.number().min(0).max(1)
});

export const situationalContextSchema = z.object({
  location: z.object({
    type: z.string(),
    description: z.string(),
    riskLevel: z.number().min(0).max(1)
  }),
  timeContext: z.object({
    timeOfDay: z.string(),
    dayType: z.enum(['weekday', 'weekend']),
    season: z.string()
  }),
  socialContext: z.object({
    numberOfPeople: z.number().int().min(0),
    relationshipTypes: z.array(z.string()),
    socialPressure: z.number().min(0).max(1)
  })
});

export const moralAnalysisSchema = z.object({
  ethicalAlignment: z.number().min(0).max(1),
  conflictingValues: z.array(z.string()),
  potentialConsequences: z.object({
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string())
  }),
  recommendedActions: z.array(z.string()),
  moralPrinciples: z.array(z.object({
    principle: z.string(),
    relevance: z.number().min(0).max(1)
  }))
});