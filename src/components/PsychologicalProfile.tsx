import React, { useState, useEffect } from 'react';
import { Brain, User, Heart, Target, AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { advancedPsychologyService } from '../lib/services/advancedPsychologyService';
import { conversationService } from '../lib/services/conversationService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface PsychologicalProfileProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

interface ProfileSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  data: any;
  confidence: number;
}

export function PsychologicalProfile({ videoAnalysis, audioAnalysis }: PsychologicalProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>([]);

  useEffect(() => {
    const buildProfile = async () => {
      if (!videoAnalysis && !audioAnalysis) return;

      setIsAnalyzing(true);
      
      try {
        const conversationHistory = conversationService.getConversationHistory(50);
        const psychProfile = await advancedPsychologyService.buildComprehensivePsychologicalProfile(
          conversationHistory, videoAnalysis, audioAnalysis
        );

        setProfile(psychProfile);
        setSections([
          {
            id: 'personality',
            title: 'Personality Profile',
            icon: <User className="w-5 h-5 text-blue-600" />,
            data: psychProfile.personality,
            confidence: 0.85
          },
          {
            id: 'emotional-intelligence',
            title: 'Emotional Intelligence',
            icon: <Heart className="w-5 h-5 text-purple-600" />,
            data: psychProfile.emotionalIntelligence,
            confidence: 0.78
          },
          {
            id: 'cognitive-biases',
            title: 'Cognitive Patterns',
            icon: <Brain className="w-5 h-5 text-indigo-600" />,
            data: psychProfile.cognitiveBiases,
            confidence: 0.72
          },
          {
            id: 'attachment-style',
            title: 'Attachment Style',
            icon: <Shield className="w-5 h-5 text-green-600" />,
            data: psychProfile.attachmentStyle,
            confidence: 0.74
          },
          {
            id: 'decision-making',
            title: 'Decision Making',
            icon: <Target className="w-5 h-5 text-orange-600" />,
            data: psychProfile.decisionMakingStyle,
            confidence: 0.81
          },
          {
            id: 'stress-response',
            title: 'Stress Response',
            icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
            data: psychProfile.stressResponse,
            confidence: 0.76
          }
        ]);
      } catch (error) {
        console.error('Psychological profile analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (videoAnalysis || audioAnalysis) {
      buildProfile();
    }
  }, [videoAnalysis, audioAnalysis]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderPersonalityProfile = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(data.bigFive).map(([trait, value]) => (
          <div key={trait} className="text-center">
            <div className="text-xs font-medium text-gray-600 capitalize mb-1">
              {trait.charAt(0)}
            </div>
            <div className="relative h-16 w-6 bg-gray-200 rounded-full mx-auto">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(value as number) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute bottom-0 w-full bg-blue-600 rounded-full"
              />
            </div>
            <div className="text-xs font-medium mt-1">
              {Math.round((value as number) * 100)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Core Strengths</h4>
        <div className="flex flex-wrap gap-2">
          {data.strengthsProfile?.map((strength: string, idx: number) => (
            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {strength}
            </span>
          ))}
        </div>
      </div>

      {data.coreMotivations && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Core Motivations</h4>
          <div className="flex flex-wrap gap-2">
            {data.coreMotivations.map((motivation: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {motivation}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEmotionalIntelligence = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).filter(([key]) => typeof data[key] === 'number').map(([skill, value]) => (
          <div key={skill} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round((value as number) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-purple-600 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
      
      {data.strengths && (
        <div>
          <h4 className="text-sm font-medium mb-2">EQ Strengths</h4>
          <ul className="text-xs space-y-1">
            {data.strengths.map((strength: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.developmentOpportunities && (
        <div>
          <h4 className="text-sm font-medium mb-2">Development Areas</h4>
          <ul className="text-xs space-y-1">
            {data.developmentOpportunities.map((opportunity: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderCognitiveBiases = (data: any) => (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(data).filter(([key, value]) => typeof value === 'number').map(([bias, level]) => (
          <div key={bias} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{bias.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</span>
              <span className="font-medium">{Math.round((level as number) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(level as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  (level as number) > 0.7 ? 'bg-red-500' : 
                  (level as number) > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {data.personalizedInsights && (
        <div>
          <h4 className="text-sm font-medium mb-2">Pattern Insights</h4>
          <div className="text-xs text-gray-600 space-y-1">
            {data.personalizedInsights.map((insight: string, idx: number) => (
              <div key={idx} className="p-2 bg-indigo-50 rounded text-indigo-700">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAttachmentStyle = (data: any) => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-green-800 capitalize mb-2">
          {data.primaryStyle.replace(/-/g, ' ')}
        </h4>
        <div className="text-2xl font-bold text-green-600">
          {Math.round(data.securityLevel * 100)}%
        </div>
        <div className="text-xs text-green-600">Security Level</div>
      </div>

      {data.relationshipPatterns && (
        <div>
          <h4 className="text-sm font-medium mb-2">Relationship Patterns</h4>
          <ul className="text-xs space-y-1">
            {data.relationshipPatterns.map((pattern: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.growthRecommendations && (
        <div>
          <h4 className="text-sm font-medium mb-2">Growth Recommendations</h4>
          <ul className="text-xs space-y-1">
            {data.growthRecommendations.map((rec: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderDecisionMaking = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-orange-50 rounded-lg text-center">
          <div className="font-medium text-orange-800 capitalize">{data.style}</div>
          <div className="text-xs text-orange-600">Decision Style</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg text-center">
          <div className="font-medium text-orange-800">{Math.round(data.confidence * 100)}%</div>
          <div className="text-xs text-orange-600">Confidence</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Risk Tolerance</span>
          <span>{Math.round(data.riskTolerance * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.riskTolerance * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-orange-600 rounded-full"
          />
        </div>
      </div>

      {data.decisionTriggers && (
        <div>
          <h4 className="text-sm font-medium mb-2">Decision Triggers</h4>
          <div className="flex flex-wrap gap-2">
            {data.decisionTriggers.map((trigger: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStressResponse = (data: any) => (
    <div className="space-y-4">
      <div className="p-3 bg-red-50 rounded-lg text-center">
        <div className="font-medium text-red-800 capitalize">{data.primaryResponse}</div>
        <div className="text-xs text-red-600">Primary Response</div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Burnout Risk</span>
          <span>{Math.round(data.burnoutRisk * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.burnoutRisk * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              data.burnoutRisk > 0.7 ? 'bg-red-500' : 
              data.burnoutRisk > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {data.copingMechanisms && (
        <div>
          <h4 className="text-sm font-medium mb-2">Coping Mechanisms</h4>
          <div className="flex flex-wrap gap-2">
            {data.copingMechanisms.map((mechanism: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {mechanism}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.resilienceFactors && (
        <div>
          <h4 className="text-sm font-medium mb-2">Resilience Factors</h4>
          <ul className="text-xs space-y-1">
            {data.resilienceFactors.map((factor: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-green-600" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSectionContent = (section: ProfileSection) => {
    switch (section.id) {
      case 'personality':
        return renderPersonalityProfile(section.data);
      case 'emotional-intelligence':
        return renderEmotionalIntelligence(section.data);
      case 'cognitive-biases':
        return renderCognitiveBiases(section.data);
      case 'attachment-style':
        return renderAttachmentStyle(section.data);
      case 'decision-making':
        return renderDecisionMaking(section.data);
      case 'stress-response':
        return renderStressResponse(section.data);
      default:
        return <div>No data available</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Psychological Profile</h2>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </div>
        )}
      </div>

      {!profile && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Psychological profiling will begin once you interact with the AI...</p>
          <p className="text-xs opacity-75 mt-1">
            Advanced personality, cognitive, and behavioral analysis
          </p>
        </div>
      )}

      {sections.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(
                  selectedSection === section.id ? null : section.id
                )}
                className={`p-4 rounded-lg border transition-all ${
                  selectedSection === section.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {section.icon}
                  <span className={`text-xs font-medium ${getConfidenceColor(section.confidence)}`}>
                    {Math.round(section.confidence * 100)}%
                  </span>
                </div>
                <div className="text-sm font-medium text-left">{section.title}</div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-2 mb-4">
                  {sections.find(s => s.id === selectedSection)?.icon}
                  <h3 className="font-semibold">
                    {sections.find(s => s.id === selectedSection)?.title}
                  </h3>
                  <span className={`text-xs ${getConfidenceColor(sections.find(s => s.id === selectedSection)?.confidence || 0)}`}>
                    {Math.round((sections.find(s => s.id === selectedSection)?.confidence || 0) * 100)}% confidence
                  </span>
                </div>
                {renderSectionContent(sections.find(s => s.id === selectedSection)!)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {profile && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-700 text-sm">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Advanced Analysis Active</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            This psychological profile continuously updates as our AI learns more about your unique patterns,
            providing increasingly personalized insights and recommendations.
          </p>
        </div>
      )}
    </div>
  );
}