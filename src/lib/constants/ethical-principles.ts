export const ETHICAL_PRINCIPLES = [
  { 
    id: 'autonomy',
    weight: 0.9,
    description: 'Respect for individual choice and self-determination',
    indicators: ['personal_freedom', 'independence', 'self_governance']
  },
  { 
    id: 'beneficence',
    weight: 0.85,
    description: 'Active promotion of well-being and benefit',
    indicators: ['helping_others', 'positive_impact', 'welfare_promotion']
  },
  { 
    id: 'non_maleficence',
    weight: 0.8,
    description: 'Avoiding harm to others',
    indicators: ['harm_prevention', 'safety', 'protection']
  },
  { 
    id: 'justice',
    weight: 0.9,
    description: 'Fair and equitable treatment',
    indicators: ['fairness', 'equality', 'impartiality']
  },
  { 
    id: 'fidelity',
    weight: 0.75,
    description: 'Maintaining trust and keeping commitments',
    indicators: ['loyalty', 'trustworthiness', 'reliability']
  },
  { 
    id: 'utility',
    weight: 0.8,
    description: 'Maximizing overall benefit for all involved',
    indicators: ['efficiency', 'effectiveness', 'optimization']
  },
  { 
    id: 'care',
    weight: 0.85,
    description: 'Showing concern and compassion for others',
    indicators: ['empathy', 'compassion', 'support']
  },
  { 
    id: 'virtue',
    weight: 0.7,
    description: 'Embodying moral excellence and character',
    indicators: ['integrity', 'honesty', 'wisdom']
  }
] as const;

export type EthicalPrinciple = typeof ETHICAL_PRINCIPLES[number];
export type PrincipleId = EthicalPrinciple['id'];