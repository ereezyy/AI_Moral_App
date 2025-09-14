import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Brain, Zap, Target, Infinity, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { holisticLifeAnalysisService } from '../lib/services/holisticLifeAnalysisService';
import { conversationService } from '../lib/services/conversationService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface HolisticLifeDashboardProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function HolisticLifeDashboard({ videoAnalysis, audioAnalysis }: HolisticLifeDashboardProps) {
  const [holisticProfile, setHolisticProfile] = useState<any>(null);
  const [holisticGuidance, setHolisticGuidance] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string>('consciousness');

  useEffect(() => {
    const analyzeHolisticLife = async () => {
      if (!videoAnalysis && !audioAnalysis) return;

      setIsAnalyzing(true);
      
      try {
        const conversationHistory = conversationService.getConversationHistory(30);
        const { profile, guidance } = await holisticLifeAnalysisService.analyzeCompleteLifeContext(
          'Current life analysis', videoAnalysis, audioAnalysis, conversationHistory
        );
        
        setHolisticProfile(profile);
        setHolisticGuidance(guidance);
      } catch (error) {
        console.error('Holistic life analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeHolisticLife();
  }, [videoAnalysis, audioAnalysis]);

  const dimensions = [
    {
      id: 'consciousness',
      title: 'Consciousness',
      icon: <Brain className="w-5 h-5 text-indigo-600" />,
      color: 'indigo',
      data: holisticProfile?.consciousness
    },
    {
      id: 'soul',
      title: 'Soul Alignment',
      icon: <Heart className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      data: holisticProfile?.soulAlignment
    },
    {
      id: 'energy',
      title: 'Energetic State',
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      color: 'yellow',
      data: holisticProfile?.energeticState
    },
    {
      id: 'purpose',
      title: 'Life Purpose',
      icon: <Target className="w-5 h-5 text-green-600" />,
      color: 'green',
      data: holisticProfile?.purposeClarity
    },
    {
      id: 'integration',
      title: 'Life Integration',
      icon: <Infinity className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      data: holisticProfile?.lifeIntegration
    },
    {
      id: 'spiritual',
      title: 'Spiritual Development',
      icon: <Sun className="w-5 h-5 text-orange-600" />,
      color: 'orange',
      data: holisticProfile?.spiritualDevelopment
    }
  ];

  const renderConsciousness = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(data.awarenessLevel * 100)}%
          </div>
          <div className="text-sm text-indigo-600">Awareness Level</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-600">{data.consciousnessExpansion.currentStage}</div>
          <div className="text-sm text-purple-600">Current Stage</div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">Next Evolution</h4>
        <p className="text-sm text-indigo-700">{data.consciousnessExpansion.nextEvolution}</p>
        <p className="text-xs text-indigo-600 mt-1">Timeline: {data.consciousnessExpansion.evolutionTimeframe}</p>
      </div>

      {data.shadowWork.unintegratedAspects.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Shadow Work</h4>
          <ul className="text-sm space-y-1">
            {data.shadowWork.unintegratedAspects.map((aspect: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2 text-amber-700">
                <Moon className="w-3 h-3" />
                {aspect}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSoulAlignment = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">
            {Math.round(data.authenticityLevel * 100)}%
          </div>
          <div className="text-xs text-purple-600">Authenticity</div>
        </div>
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="text-xl font-bold text-pink-600">
            {Math.round(data.valueCongruence * 100)}%
          </div>
          <div className="text-xs text-pink-600">Values</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-xl font-bold text-indigo-600">
            {Math.round(data.purposeAlignment * 100)}%
          </div>
          <div className="text-xs text-indigo-600">Purpose</div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">Current Soul Lessons</h4>
        <ul className="space-y-1">
          {data.soulLessons.currentLessons.map((lesson: string, idx: number) => (
            <li key={idx} className="text-sm text-purple-700">• {lesson}</li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
        <h4 className="font-medium text-pink-800 mb-2">Soul Guidance</h4>
        <ul className="space-y-1">
          {data.soulGuidance.map((guidance: string, idx: number) => (
            <li key={idx} className="text-sm text-pink-700">✨ {guidance}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderEnergeticState = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).filter(([key, value]) => typeof value === 'number').map(([energy, level]) => (
          <div key={energy} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{energy.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round((level as number) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(level as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {data.energySources.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Energy Sources</h4>
          <div className="flex flex-wrap gap-2">
            {data.energySources.map((source: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.energyLeaks.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Energy Leaks</h4>
          <div className="flex flex-wrap gap-2">
            {data.energyLeaks.map((leak: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                {leak}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPurposeClarity = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-lg text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">
          {Math.round(data.purposeClarity * 100)}%
        </div>
        <div className="text-sm text-green-600">Purpose Clarity</div>
        <div className="text-xs text-green-600 mt-1">{data.legacyVision}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {Math.round(data.missionAlignment * 100)}%
          </div>
          <div className="text-xs text-blue-600">Mission</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-lg font-bold text-indigo-600">
            {Math.round(data.impactPotential * 100)}%
          </div>
          <div className="text-xs text-indigo-600">Impact</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(data.contributionScore * 100)}%
          </div>
          <div className="text-xs text-purple-600">Service</div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Purpose Evolution</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Current:</span> {data.purposeEvolution.currentPurpose}</div>
          <div><span className="font-medium">Future:</span> {data.purposeEvolution.futurePurpose.join(', ')}</div>
        </div>
      </div>
    </div>
  );

  const renderLifeIntegration = (data: any) => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {Math.round(data.integrationScore * 100)}%
        </div>
        <div className="text-sm text-blue-600">Life Integration</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).filter(([key, value]) => 
          typeof value === 'number' && key !== 'integrationScore'
        ).map(([area, score]) => (
          <div key={area} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{area.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round((score as number) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {data.harmonizationStrategies.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Harmonization Strategies</h4>
          <ul className="space-y-1">
            {data.harmonizationStrategies.map((strategy: string, idx: number) => (
              <li key={idx} className="text-sm text-blue-700">🎯 {strategy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSpiritualDevelopment = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-orange-50 rounded-lg text-center">
        <div className="text-2xl font-bold text-orange-600 mb-1">{data.awakening.stage}</div>
        <div className="text-sm text-orange-600">Awakening Stage</div>
        <div className="text-xs text-orange-600 mt-1">
          {Math.round(data.awakening.readiness * 100)}% ready for {data.awakening.nextPhase}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            {Math.round(data.spiritualMaturity * 100)}%
          </div>
          <div className="text-xs text-yellow-600">Spiritual Maturity</div>
        </div>
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="text-lg font-bold text-pink-600">
            {Math.round(data.compassionLevel * 100)}%
          </div>
          <div className="text-xs text-pink-600">Compassion</div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
        <h4 className="font-medium text-orange-800 mb-2">Recommended Practices</h4>
        <ul className="space-y-1">
          {data.spiritualPractices.recommended.map((practice: string, idx: number) => (
            <li key={idx} className="text-sm text-orange-700">🧘 {practice}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderDimensionContent = (dimension: any) => {
    if (!dimension.data) return <div>Loading dimension data...</div>;

    switch (dimension.id) {
      case 'consciousness':
        return renderConsciousness(dimension.data);
      case 'soul':
        return renderSoulAlignment(dimension.data);
      case 'energy':
        return renderEnergeticState(dimension.data);
      case 'purpose':
        return renderPurposeClarity(dimension.data);
      case 'integration':
        return renderLifeIntegration(dimension.data);
      case 'spiritual':
        return renderSpiritualDevelopment(dimension.data);
      default:
        return <div>Select a dimension to explore</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Holistic Life Analysis</h2>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </div>
        )}
      </div>

      {!holisticProfile && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Holistic life analysis begins with interaction...</p>
          <p className="text-xs opacity-75 mt-1">
            Consciousness, soul alignment, energy, purpose, integration, and spiritual development
          </p>
        </div>
      )}

      {holisticProfile && (
        <div className="space-y-6">
          {/* Overall Life Integration Score */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-indigo-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                {Math.round(holisticProfile.lifeIntegration.integrationScore * 100)}%
              </div>
              <div className="text-lg font-medium text-indigo-800">Holistic Life Integration</div>
              <div className="text-sm text-indigo-600 mt-1">
                {holisticProfile.lifePhaseEvolution.currentPhase} • {holisticProfile.consciousness.consciousnessExpansion.currentStage}
              </div>
            </div>
          </div>

          {/* Dimension Tabs */}
          <div className="border-b">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {dimensions.map((dimension) => (
                <button
                  key={dimension.id}
                  onClick={() => setSelectedDimension(dimension.id)}
                  className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-1 whitespace-nowrap ${
                    selectedDimension === dimension.id
                      ? `border-${dimension.color}-500 text-${dimension.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {dimension.icon}
                  {dimension.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Dimension Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDimension}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderDimensionContent(dimensions.find(d => d.id === selectedDimension)!)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Holistic Guidance */}
          {holisticGuidance && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-3">Holistic Guidance</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white/60 rounded border border-indigo-100">
                  <div className="text-sm font-medium text-indigo-700 mb-1">Soul Guidance</div>
                  <p className="text-sm text-indigo-600">{holisticGuidance.soulGuidance}</p>
                </div>
                <div className="p-3 bg-white/60 rounded border border-purple-100">
                  <div className="text-sm font-medium text-purple-700 mb-1">Spiritual Guidance</div>
                  <p className="text-sm text-purple-600">{holisticGuidance.spiritualGuidance}</p>
                </div>
                <div className="p-3 bg-white/60 rounded border border-blue-100">
                  <div className="text-sm font-medium text-blue-700 mb-1">Life Strategy</div>
                  <p className="text-sm text-blue-600">{holisticGuidance.lifeStrategy}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {holisticProfile && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 text-sm">
            <Heart className="w-4 h-4" />
            <span className="font-medium">Holistic Integration Active</span>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            This analysis integrates consciousness, soul, energy, purpose, relationships, and spiritual development
            for complete life optimization and authentic self-expression.
          </p>
        </div>
      )}
    </div>
  );
}