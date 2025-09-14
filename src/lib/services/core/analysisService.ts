import { CentralizedErrorHandler } from '../../utils/error/centralizedErrorHandler';
import type { VideoAnalysis, AudioAnalysis, SituationalContext } from '../../types';

export interface AnalysisRequest {
  userInput: string;
  videoData: VideoAnalysis | null;
  audioData: AudioAnalysis | null;
  contextData?: Partial<SituationalContext>;
}

export interface AnalysisResult {
  ethicalScore: number;
  emotionalState: string;
  riskLevel: number;
  recommendations: string[];
  insights: string[];
}

export class AnalysisService {
  private static instance: AnalysisService;

  private constructor() {}

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  async analyzeUserContext(request: AnalysisRequest): Promise<AnalysisResult | undefined> {
    return await CentralizedErrorHandler.handleAsync(
      async () => {
        const ethicalScore = this.calculateEthicalScore(request);
        const emotionalState = this.determineEmotionalState(request);
        const riskLevel = this.assessRiskLevel(request);
        const recommendations = this.generateRecommendations(ethicalScore, riskLevel);
        const insights = this.generateInsights(request);

        return {
          ethicalScore,
          emotionalState,
          riskLevel,
          recommendations,
          insights
        };
      },
      {
        operation: 'analyzeUserContext',
        component: 'AnalysisService',
        timestamp: Date.now()
      },
      { fallbackValue: this.getDefaultAnalysisResult() }
    );
  }

  private calculateEthicalScore(request: AnalysisRequest): number {
    const baseScore = 0.7;
    let adjustedScore = baseScore;

    if (request.videoData) {
      const positiveEmotions = request.videoData.facialExpression.joy + request.videoData.facialExpression.surprise;
      adjustedScore += positiveEmotions * 0.1;
    }

    if (request.audioData) {
      adjustedScore += request.audioData.sentiment * 0.1;
      adjustedScore -= request.audioData.toxicity * 0.2;
    }

    return Math.max(0, Math.min(1, adjustedScore));
  }

  private determineEmotionalState(request: AnalysisRequest): string {
    if (request.videoData) {
      const emotions = request.videoData.facialExpression;
      const dominantEmotion = Object.entries(emotions)
        .reduce((prev, current) => prev[1] > current[1] ? prev : current)[0];
      return dominantEmotion;
    }

    if (request.audioData) {
      return request.audioData.sentiment > 0.6 ? 'positive' : 'neutral';
    }

    return 'neutral';
  }

  private assessRiskLevel(request: AnalysisRequest): number {
    let riskScore = 0.2; // Base low risk

    // Text-based risk indicators
    const riskKeywords = ['hopeless', 'overwhelming', 'can\'t handle', 'give up'];
    const hasRiskIndicators = riskKeywords.some(keyword => 
      request.userInput.toLowerCase().includes(keyword)
    );
    
    if (hasRiskIndicators) {
      riskScore += 0.4;
    }

    // Video-based risk assessment
    if (request.videoData) {
      riskScore += request.videoData.facialExpression.sadness * 0.3;
      riskScore += request.videoData.facialExpression.fear * 0.2;
    }

    // Audio-based risk assessment
    if (request.audioData) {
      riskScore += (1 - request.audioData.sentiment) * 0.2;
      riskScore += request.audioData.toxicity * 0.3;
    }

    return Math.max(0, Math.min(1, riskScore));
  }

  private generateRecommendations(ethicalScore: number, riskLevel: number): string[] {
    const recommendations = [];

    if (ethicalScore < 0.6) {
      recommendations.push('Consider the long-term impact of your decisions');
      recommendations.push('Seek perspectives from trusted advisors');
    }

    if (riskLevel > 0.6) {
      recommendations.push('Take time for self-care and emotional processing');
      recommendations.push('Connect with your support network');
    } else if (riskLevel > 0.4) {
      recommendations.push('Practice mindfulness and stress management');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue with your thoughtful approach');
      recommendations.push('Trust your instincts while staying open to growth');
    }

    return recommendations;
  }

  private generateInsights(request: AnalysisRequest): string[] {
    const insights = [];

    if (request.videoData && request.videoData.attentiveness > 0.8) {
      insights.push('Your high attention level shows strong engagement and focus');
    }

    if (request.audioData && request.audioData.clarity > 0.8) {
      insights.push('Your clear communication style facilitates effective dialogue');
    }

    const textComplexity = request.userInput.split(' ').length;
    if (textComplexity > 20) {
      insights.push('Your detailed communication shows thoughtful consideration');
    }

    return insights;
  }

  private getDefaultAnalysisResult(): AnalysisResult {
    return {
      ethicalScore: 0.7,
      emotionalState: 'neutral',
      riskLevel: 0.2,
      recommendations: ['Take time to reflect on your values and priorities'],
      insights: ['Continue developing self-awareness']
    };
  }
}

export const analysisService = AnalysisService.getInstance();