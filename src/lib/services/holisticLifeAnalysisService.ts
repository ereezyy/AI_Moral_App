import { BaseService } from './baseService';
import { ErrorHandler } from '../utils/error/errorHandler';
import { TextAnalyzer } from '../utils/textAnalysis';
import type { VideoAnalysis, AudioAnalysis } from '../types';

interface HolisticLifeProfile {
  consciousness: ConsciousnessAnalysis;
  lifeIntegration: LifeIntegrationAnalysis;
  soulAlignment: SoulAlignmentAnalysis;
  energeticState: EnergeticStateAnalysis;
  purposeClarity: PurposeAnalysis;
  relationshipDynamics: RelationshipDynamicsAnalysis;
  spiritualDevelopment: SpiritualDevelopmentAnalysis;
  lifePhaseEvolution: LifePhaseAnalysis;
}

interface ConsciousnessAnalysis {
  awarenessLevel: number;
  presenceQuality: number;
  mindfulnessCapacity: number;
  metaCognition: number;
  consciousnessExpansion: {
    currentStage: string;
    nextEvolution: string;
    evolutionTimeframe: string;
    expansionTriggers: string[];
  };
  shadowWork: {
    unintegratedAspects: string[];
    projectionPatterns: string[];
    integrationOpportunities: string[];
  };
}

interface LifeIntegrationAnalysis {
  workLifeBalance: number;
  relationshipHarmony: number;
  healthVitality: number;
  creativeExpression: number;
  spiritualConnection: number;
  communityContribution: number;
  personalGrowth: number;
  integrationScore: number;
  imbalanceAreas: string[];
  harmonizationStrategies: string[];
}

interface SoulAlignmentAnalysis {
  authenticityLevel: number;
  valueCongruence: number;
  purposeAlignment: number;
  soulExpression: number;
  innerWisdomAccess: number;
  lifeVisionClarity: number;
  soulLessons: {
    currentLessons: string[];
    masteredLessons: string[];
    upcomingLessons: string[];
  };
  soulGuidance: string[];
}

interface EnergeticStateAnalysis {
  vitalityLevel: number;
  emotionalEnergy: number;
  mentalClarity: number;
  spiritualEnergy: number;
  creativeEnergy: number;
  socialEnergy: number;
  energyLeaks: string[];
  energySources: string[];
  energyOptimization: string[];
}

interface PurposeAnalysis {
  purposeClarity: number;
  missionAlignment: number;
  impactPotential: number;
  contributionScore: number;
  legacyVision: string;
  purposeEvolution: {
    pastPurpose: string[];
    currentPurpose: string;
    futurePurpose: string[];
  };
  purposeBlocks: string[];
  purposeActivators: string[];
}

interface RelationshipDynamicsAnalysis {
  intimacyCapacity: number;
  communicationMastery: number;
  boundaryHealth: number;
  empathicResonance: number;
  conflictResolution: number;
  loveExpression: number;
  relationshipPatterns: {
    healthyPatterns: string[];
    challengingPatterns: string[];
    evolutionNeeded: string[];
  };
  soulConnections: {
    depth: number;
    authenticity: number;
    growth: number;
  };
}

interface SpiritualDevelopmentAnalysis {
  spiritualMaturity: number;
  transcendenceCapacity: number;
  innerPeaceLevel: number;
  wisdomIntegration: number;
  compassionLevel: number;
  surrenderCapacity: number;
  spiritualPractices: {
    current: string[];
    recommended: string[];
    advanced: string[];
  };
  spiritualChallenges: string[];
  awakening: {
    stage: string;
    nextPhase: string;
    readiness: number;
  };
}

interface LifePhaseAnalysis {
  currentPhase: string;
  phaseCompletion: number;
  nextPhasePreparation: number;
  lifeTransitions: {
    current: string[];
    upcoming: string[];
    preparation: string[];
  };
  developmentalTasks: {
    mastered: string[];
    current: string[];
    future: string[];
  };
  wisdomAcquisition: {
    lifeWisdom: string[];
    experientialLearning: string[];
    integrationOpportunities: string[];
  };
}

interface HolisticGuidance {
  immediateGuidance: string;
  soulGuidance: string;
  lifeStrategy: string;
  spiritualGuidance: string;
  practicalSteps: string[];
  deepWork: string[];
  energeticPractices: string[];
  consciousnessExpansion: string[];
  relationshipHealing: string[];
  purposeActivation: string[];
  shadowIntegration: string[];
  transcendenceOpportunities: string[];
}

export class HolisticLifeAnalysisService extends BaseService {
  protected serviceName = 'HolisticLifeAnalysisService';
  private static instance: HolisticLifeAnalysisService;

  private constructor() {
    super();
  }

  static getInstance(): HolisticLifeAnalysisService {
    if (!HolisticLifeAnalysisService.instance) {
      HolisticLifeAnalysisService.instance = new HolisticLifeAnalysisService();
    }
    return HolisticLifeAnalysisService.instance;
  }

  async analyzeCompleteLifeContext(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    conversationHistory: any[]
  ): Promise<{ profile: HolisticLifeProfile; guidance: HolisticGuidance }> {
    
    return await ErrorHandler.withErrorHandling(
      async () => {
        const profile = this.buildHolisticProfile(userInput, videoAnalysis, audioAnalysis, conversationHistory);
        const guidance = this.generateHolisticGuidance(profile, userInput);

        return { profile, guidance };
      },
      'Holistic life analysis',
      this.getDefaultHolisticAnalysis()
    ) || this.getDefaultHolisticAnalysis();
  }

  private buildHolisticProfile(
    userInput: string,
    video: VideoAnalysis | null,
    audio: AudioAnalysis | null,
    history: any[]
  ): HolisticLifeProfile {
    
    const allText = userInput + ' ' + history.map(m => m.content || '').join(' ');
    
    return {
      consciousness: this.analyzeConsciousness(allText, video, audio),
      lifeIntegration: this.analyzeLifeIntegration(allText),
      soulAlignment: this.analyzeSoulAlignment(allText, userInput),
      energeticState: this.analyzeEnergeticState(video, audio, allText),
      purposeClarity: this.analyzePurpose(allText, userInput),
      relationshipDynamics: this.analyzeRelationshipDynamics(allText),
      spiritualDevelopment: this.analyzeSpiritualDevelopment(allText),
      lifePhaseEvolution: this.analyzeLifePhase(allText, userInput)
    };
  }

  private analyzeConsciousness(
    allText: string,
    video: VideoAnalysis | null,
    audio: AudioAnalysis | null
  ): ConsciousnessAnalysis {
    const awarenessWords = ['aware', 'conscious', 'mindful', 'notice', 'observe'];
    const awarenessLevel = Math.min(1, TextAnalyzer.countKeywords(allText, awarenessWords) / 5);
    
    return {
      awarenessLevel,
      presenceQuality: video?.attentiveness || 0.6,
      mindfulnessCapacity: 0.7,
      metaCognition: awarenessLevel * 0.8,
      consciousnessExpansion: {
        currentStage: awarenessLevel > 0.7 ? 'Self-Understanding' : 'Self-Discovery',
        nextEvolution: 'Self-Actualization',
        evolutionTimeframe: '3-6 months with dedicated practice',
        expansionTriggers: ['Deep introspection', 'Spiritual practice', 'Life challenges']
      },
      shadowWork: {
        unintegratedAspects: ['Perfectionism patterns', 'Control tendencies'],
        projectionPatterns: ['External validation seeking'],
        integrationOpportunities: ['Self-compassion development', 'Authentic expression']
      }
    };
  }

  private analyzeLifeIntegration(allText: string): LifeIntegrationAnalysis {
    const workWords = TextAnalyzer.countKeywords(allText, ['work', 'job', 'career']) / 3;
    const relationshipWords = TextAnalyzer.countKeywords(allText, ['relationship', 'family', 'friend']) / 3;
    const healthWords = TextAnalyzer.countKeywords(allText, ['health', 'exercise', 'wellness']) / 3;
    const creativityWords = TextAnalyzer.countKeywords(allText, ['create', 'art', 'express']) / 3;
    
    const areas = {
      work: Math.min(1, workWords),
      relationships: Math.min(1, relationshipWords),
      health: Math.min(1, healthWords),
      creativity: Math.min(1, creativityWords),
      spirituality: 0.6,
      community: 0.5,
      growth: 0.8
    };
    
    const integrationScore = Object.values(areas).reduce((a, b) => a + b, 0) / Object.values(areas).length;
    
    return {
      workLifeBalance: areas.work * 0.7,
      relationshipHarmony: areas.relationships,
      healthVitality: areas.health,
      creativeExpression: areas.creativity,
      spiritualConnection: areas.spirituality,
      communityContribution: areas.community,
      personalGrowth: areas.growth,
      integrationScore,
      imbalanceAreas: Object.entries(areas).filter(([_, value]) => value < 0.5).map(([key]) => key),
      harmonizationStrategies: ['Create life rhythm', 'Integrate practices', 'Balance priorities']
    };
  }

  private analyzeSoulAlignment(allText: string, userInput: string): SoulAlignmentAnalysis {
    const authenticWords = TextAnalyzer.countKeywords(allText, ['authentic', 'genuine', 'true']) / 3;
    const purposeWords = TextAnalyzer.countKeywords(allText, ['purpose', 'meaning', 'calling']) / 3;
    
    return {
      authenticityLevel: Math.min(1, authenticWords),
      valueCongruence: 0.7,
      purposeAlignment: Math.min(1, purposeWords),
      soulExpression: 0.65,
      innerWisdomAccess: 0.6,
      lifeVisionClarity: 0.68,
      soulLessons: {
        currentLessons: ['Trusting inner wisdom', 'Authentic self-expression'],
        masteredLessons: ['Self-reflection', 'Emotional awareness'],
        upcomingLessons: ['Service integration', 'Wisdom embodiment']
      },
      soulGuidance: [
        'Trust the wisdom emerging from stillness',
        'Honor both individual path and collective service',
        'Express authentic self regardless of others\' opinions'
      ]
    };
  }

  private analyzeEnergeticState(video: VideoAnalysis | null, audio: AudioAnalysis | null, allText: string): EnergeticStateAnalysis {
    const stressWords = TextAnalyzer.countKeywords(allText, ['stress', 'tired', 'drained']);
    const energyWords = TextAnalyzer.countKeywords(allText, ['energy', 'vibrant', 'alive']);
    
    return {
      vitalityLevel: video?.attentiveness || 0.7,
      emotionalEnergy: 0.7 - (stressWords * 0.1),
      mentalClarity: audio?.clarity || 0.75,
      spiritualEnergy: 0.6,
      creativeEnergy: 0.65,
      socialEnergy: 0.7,
      energyLeaks: stressWords > 2 ? ['Stress and overwhelm', 'Perfectionism'] : ['Minor energy drains'],
      energySources: energyWords > 0 ? ['Meaningful work', 'Relationships'] : ['Growth activities', 'Nature'],
      energyOptimization: ['Regular rest', 'Joyful activities', 'Spiritual practice']
    };
  }

  private analyzePurpose(allText: string, userInput: string): PurposeAnalysis {
    const purposeWords = TextAnalyzer.countKeywords(allText, ['purpose', 'mission', 'calling']) / 3;
    const impactWords = TextAnalyzer.countKeywords(allText, ['impact', 'difference', 'contribute']) / 3;
    
    return {
      purposeClarity: Math.min(1, purposeWords),
      missionAlignment: 0.7,
      impactPotential: Math.min(1, impactWords),
      contributionScore: 0.75,
      legacyVision: 'Creating positive impact through authentic expression and service',
      purposeEvolution: {
        pastPurpose: ['Personal achievement'],
        currentPurpose: 'Developing authentic self-expression and meaningful relationships',
        futurePurpose: ['Service to collective well-being']
      },
      purposeBlocks: purposeWords < 0.3 ? ['Uncertainty about direction'] : [],
      purposeActivators: ['Values clarification', 'Service opportunities', 'Community connection']
    };
  }

  private analyzeRelationshipDynamics(allText: string): RelationshipDynamicsAnalysis {
    const relationshipWords = TextAnalyzer.countKeywords(allText, ['relationship', 'love', 'connection']);
    const communicationWords = TextAnalyzer.countKeywords(allText, ['communicate', 'express', 'share']);
    
    return {
      intimacyCapacity: 0.7,
      communicationMastery: Math.min(1, communicationWords / 3),
      boundaryHealth: 0.65,
      empathicResonance: 0.8,
      conflictResolution: 0.6,
      loveExpression: 0.75,
      relationshipPatterns: {
        healthyPatterns: ['Open communication', 'Emotional support'],
        challengingPatterns: relationshipWords > 3 ? ['Boundary challenges'] : [],
        evolutionNeeded: ['Deeper vulnerability', 'Authentic expression']
      },
      soulConnections: {
        depth: 0.7,
        authenticity: 0.8,
        growth: 0.75
      }
    };
  }

  private analyzeSpiritualDevelopment(allText: string): SpiritualDevelopmentAnalysis {
    const spiritualWords = TextAnalyzer.countKeywords(allText, ['spiritual', 'divine', 'sacred']) / 3;
    const wisdomWords = TextAnalyzer.countKeywords(allText, ['wisdom', 'insight', 'understanding']) / 3;
    
    return {
      spiritualMaturity: Math.min(1, spiritualWords),
      transcendenceCapacity: 0.6,
      innerPeaceLevel: 0.7,
      wisdomIntegration: Math.min(1, wisdomWords),
      compassionLevel: 0.8,
      surrenderCapacity: 0.65,
      spiritualPractices: {
        current: spiritualWords > 0.3 ? ['Meditation', 'Reflection'] : ['Developing practices'],
        recommended: ['Daily meditation', 'Compassion practice'],
        advanced: ['Non-dual awareness', 'Service meditation']
      },
      spiritualChallenges: ['Integrating insights into daily life'],
      awakening: {
        stage: spiritualWords > 0.5 ? 'Integration' : 'Awakening',
        nextPhase: 'Service',
        readiness: 0.7
      }
    };
  }

  private analyzeLifePhase(allText: string, userInput: string): LifePhaseAnalysis {
    const transitionWords = TextAnalyzer.countKeywords(allText, ['change', 'transition', 'evolve']);
    const stabilityWords = TextAnalyzer.countKeywords(allText, ['stable', 'established', 'grounded']);
    
    return {
      currentPhase: stabilityWords > transitionWords ? 'Integration and Refinement' : 'Exploration and Growth',
      phaseCompletion: 0.6,
      nextPhasePreparation: 0.7,
      lifeTransitions: {
        current: ['Consciousness expansion', 'Authentic expression'],
        upcoming: ['Purpose clarification', 'Service activation'],
        preparation: ['Inner stability cultivation', 'Wisdom integration']
      },
      developmentalTasks: {
        mastered: ['Self-reflection', 'Emotional awareness'],
        current: ['Authentic expression', 'Purpose clarification'],
        future: ['Spiritual service', 'Wisdom sharing']
      },
      wisdomAcquisition: {
        lifeWisdom: ['Authenticity brings fulfillment', 'Growth requires courage'],
        experientialLearning: ['Learning through direct experience'],
        integrationOpportunities: ['Apply insights daily', 'Share wisdom through service']
      }
    };
  }

  private generateHolisticGuidance(profile: HolisticLifeProfile, userInput: string): HolisticGuidance {
    return {
      immediateGuidance: 'Trust the wisdom arising within you and take one authentic step forward.',
      soulGuidance: 'Your soul is calling you to express more of your authentic truth and serve from your unique gifts.',
      lifeStrategy: `Integrate all aspects of your being for ${Math.round(profile.lifeIntegration.integrationScore * 100)}% life harmony.`,
      spiritualGuidance: `You're in the ${profile.spiritualDevelopment.awakening.stage} stage. Trust the unfolding.`,
      practicalSteps: [
        'Clarify values and align daily actions',
        'Strengthen spiritual practice',
        'Express creativity authentically'
      ],
      deepWork: [
        'Shadow integration through self-compassion',
        'Purpose clarification and activation',
        'Wisdom integration into daily life'
      ],
      energeticPractices: [
        'Heart-centered breathing',
        'Energy circulation awareness',
        'Sacred boundary maintenance'
      ],
      consciousnessExpansion: [
        'Non-dual awareness meditation',
        'Unity consciousness practice',
        'Transcendent service orientation'
      ],
      relationshipHealing: [
        'Authentic vulnerability practice',
        'Compassionate communication',
        'Healthy boundary development'
      ],
      purposeActivation: [
        'Service opportunity exploration',
        'Gift identification and development',
        'Legacy vision clarification'
      ],
      shadowIntegration: [
        'Compassionate self-inquiry',
        'Projection recognition and retrieval',
        'Wholeness embodiment'
      ],
      transcendenceOpportunities: [
        'Unity consciousness stabilization',
        'Service from transcendent awareness',
        'Divine embodiment in human form'
      ]
    };
  }

  private getDefaultHolisticAnalysis(): { profile: HolisticLifeProfile; guidance: HolisticGuidance } {
    return {
      profile: {
        consciousness: {
          awarenessLevel: 0.7,
          presenceQuality: 0.6,
          mindfulnessCapacity: 0.65,
          metaCognition: 0.68,
          consciousnessExpansion: {
            currentStage: 'Self-Discovery',
            nextEvolution: 'Self-Understanding',
            evolutionTimeframe: '3-6 months',
            expansionTriggers: ['Deep practice', 'Life challenges']
          },
          shadowWork: {
            unintegratedAspects: ['Control patterns'],
            projectionPatterns: ['External validation seeking'],
            integrationOpportunities: ['Self-compassion development']
          }
        },
        lifeIntegration: {
          workLifeBalance: 0.6,
          relationshipHarmony: 0.7,
          healthVitality: 0.65,
          creativeExpression: 0.5,
          spiritualConnection: 0.6,
          communityContribution: 0.55,
          personalGrowth: 0.8,
          integrationScore: 0.64,
          imbalanceAreas: ['Creative expression'],
          harmonizationStrategies: ['Integrate creativity', 'Balance priorities']
        },
        soulAlignment: {
          authenticityLevel: 0.7,
          valueCongruence: 0.75,
          purposeAlignment: 0.6,
          soulExpression: 0.65,
          innerWisdomAccess: 0.7,
          lifeVisionClarity: 0.6,
          soulLessons: {
            currentLessons: ['Authentic expression', 'Self-trust'],
            masteredLessons: ['Self-awareness'],
            upcomingLessons: ['Service integration']
          },
          soulGuidance: ['Trust inner wisdom', 'Express authentically']
        },
        energeticState: {
          vitalityLevel: 0.7,
          emotionalEnergy: 0.65,
          mentalClarity: 0.75,
          spiritualEnergy: 0.6,
          creativeEnergy: 0.55,
          socialEnergy: 0.7,
          energyLeaks: ['Stress patterns'],
          energySources: ['Growth activities', 'Meaningful connections'],
          energyOptimization: ['Regular rest', 'Joyful activities']
        },
        purposeClarity: {
          purposeClarity: 0.6,
          missionAlignment: 0.7,
          impactPotential: 0.75,
          contributionScore: 0.7,
          legacyVision: 'Creating positive impact through authentic service',
          purposeEvolution: {
            pastPurpose: ['Personal development'],
            currentPurpose: 'Developing authentic expression',
            futurePurpose: ['Service to others']
          },
          purposeBlocks: ['Direction uncertainty'],
          purposeActivators: ['Values clarification', 'Service opportunities']
        },
        relationshipDynamics: {
          intimacyCapacity: 0.7,
          communicationMastery: 0.75,
          boundaryHealth: 0.6,
          empathicResonance: 0.8,
          conflictResolution: 0.65,
          loveExpression: 0.75,
          relationshipPatterns: {
            healthyPatterns: ['Emotional support', 'Open communication'],
            challengingPatterns: ['Boundary setting'],
            evolutionNeeded: ['Deeper vulnerability']
          },
          soulConnections: {
            depth: 0.7,
            authenticity: 0.75,
            growth: 0.8
          }
        },
        spiritualDevelopment: {
          spiritualMaturity: 0.6,
          transcendenceCapacity: 0.5,
          innerPeaceLevel: 0.7,
          wisdomIntegration: 0.65,
          compassionLevel: 0.8,
          surrenderCapacity: 0.6,
          spiritualPractices: {
            current: ['Reflection', 'Mindfulness'],
            recommended: ['Daily meditation', 'Compassion practice'],
            advanced: ['Non-dual awareness']
          },
          spiritualChallenges: ['Integration into daily life'],
          awakening: {
            stage: 'Integration',
            nextPhase: 'Service',
            readiness: 0.7
          }
        },
        lifePhaseEvolution: {
          currentPhase: 'Exploration and Growth',
          phaseCompletion: 0.6,
          nextPhasePreparation: 0.7,
          lifeTransitions: {
            current: ['Consciousness expansion'],
            upcoming: ['Purpose activation'],
            preparation: ['Stability cultivation']
          },
          developmentalTasks: {
            mastered: ['Self-awareness'],
            current: ['Authentic expression'],
            future: ['Wisdom sharing']
          },
          wisdomAcquisition: {
            lifeWisdom: ['Authenticity brings peace'],
            experientialLearning: ['Growth through challenge'],
            integrationOpportunities: ['Daily application']
          }
        }
      },
      guidance: {
        immediateGuidance: 'Trust the wisdom arising within you.',
        soulGuidance: 'Express your authentic truth with courage.',
        lifeStrategy: 'Integrate all aspects for wholeness.',
        spiritualGuidance: 'Deepen practice and trust the unfolding.',
        practicalSteps: ['Clarify values', 'Strengthen practice', 'Express creativity'],
        deepWork: ['Shadow integration', 'Purpose clarification'],
        energeticPractices: ['Heart breathing', 'Energy awareness'],
        consciousnessExpansion: ['Unity meditation', 'Transcendent service'],
        relationshipHealing: ['Authentic vulnerability', 'Boundary development'],
        purposeActivation: ['Service exploration', 'Gift development'],
        shadowIntegration: ['Self-compassion', 'Wholeness embodiment'],
        transcendenceOpportunities: ['Service from unity', 'Divine embodiment']
      }
    };
  }
}

export const holisticLifeAnalysisService = HolisticLifeAnalysisService.getInstance();