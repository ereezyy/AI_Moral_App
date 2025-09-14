import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Heart, Star, Infinity, Zap, Target, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { multidimensionalAIService } from '../lib/services/multidimensionalAIService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface MultidimensionalInsightsProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function MultidimensionalInsights({ videoAnalysis, audioAnalysis }: MultidimensionalInsightsProps) {
  const [multidimensionalResponse, setMultidimensionalResponse] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('human');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const generateInsights = async () => {
      if (!videoAnalysis && !audioAnalysis) return;

      setIsAnalyzing(true);
      
      try {
        const response = await multidimensionalAIService.generateMultidimensionalGuidance(
          'Generate comprehensive multidimensional insights',
          videoAnalysis,
          audioAnalysis
        );
        
        setMultidimensionalResponse(response);
      } catch (error) {
        console.error('Multidimensional analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    generateInsights();
  }, [videoAnalysis, audioAnalysis]);

  const levels = [
    {
      id: 'human',
      title: 'Human Level',
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      description: 'Psychological & Emotional Intelligence',
      data: multidimensionalResponse?.humanLevel
    },
    {
      id: 'soul',
      title: 'Soul Level',
      icon: <Heart className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      description: 'Soul Purpose & Karmic Wisdom',
      data: multidimensionalResponse?.soulLevel
    },
    {
      id: 'cosmic',
      title: 'Cosmic Level',
      icon: <Star className="w-5 h-5 text-indigo-600" />,
      color: 'indigo',
      description: 'Universal Perspective & Divine Timing',
      data: multidimensionalResponse?.cosmicLevel
    },
    {
      id: 'transcendent',
      title: 'Transcendent',
      icon: <Crown className="w-5 h-5 text-yellow-600" />,
      color: 'yellow',
      description: 'Unity Consciousness & Transcendent Action',
      data: multidimensionalResponse?.transcendentWisdom
    },
    {
      id: 'quantum',
      title: 'Quantum Level',
      icon: <Infinity className="w-5 h-5 text-cyan-600" />,
      color: 'cyan',
      description: 'Timeline Optimization & Possibility Collapse',
      data: multidimensionalResponse?.quantumGuidance
    }
  ];

  const renderHumanLevel = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Emotional Intelligence</h4>
        <p className="text-sm text-blue-700">{data.emotional}</p>
      </div>
      
      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">Psychological Insight</h4>
        <p className="text-sm text-indigo-700">{data.psychological}</p>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Practical Guidance</h4>
        <p className="text-sm text-green-700">{data.practical}</p>
      </div>

      {data.support && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Support Strategies</h4>
          <ul className="space-y-1">
            {data.support.map((strategy: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700">• {strategy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSoulLevel = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">Soul Perspective</h4>
        <p className="text-sm text-purple-700">{data.soulPerspective}</p>
      </div>

      <div className="p-4 bg-pink-50 rounded-lg">
        <h4 className="font-medium text-pink-800 mb-2">Purpose Guidance</h4>
        <p className="text-sm text-pink-700">{data.purposeGuidance}</p>
      </div>

      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">Soul Evolution</h4>
        <p className="text-sm text-indigo-700">{data.evolution}</p>
      </div>

      {data.soulLessons && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">Current Soul Lessons</h4>
          <ul className="space-y-1">
            {data.soulLessons.map((lesson: string, idx: number) => (
              <li key={idx} className="text-sm text-purple-700">✨ {lesson}</li>
            ))}
          </ul>
        </div>
      )}

      {data.soulGifts && (
        <div className="p-4 bg-pink-50 rounded-lg">
          <h4 className="font-medium text-pink-800 mb-2">Soul Gifts</h4>
          <div className="flex flex-wrap gap-2">
            {data.soulGifts.map((gift: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">
                {gift}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCosmicLevel = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">Universal Perspective</h4>
        <p className="text-sm text-indigo-700">{data.universalPerspective}</p>
      </div>

      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">Cosmic Timing</h4>
        <p className="text-sm text-purple-700">{data.cosmicTiming}</p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Divine Guidance</h4>
        <p className="text-sm text-blue-700">{data.divineGuidance}</p>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Cosmic Purpose</h4>
        <p className="text-sm text-yellow-700">{data.cosmicPurpose}</p>
      </div>
    </div>
  );

  const renderTranscendentLevel = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Unity Consciousness</h4>
        <p className="text-sm text-yellow-700">{data.unityConsciousness}</p>
      </div>

      <div className="p-4 bg-amber-50 rounded-lg">
        <h4 className="font-medium text-amber-800 mb-2">Transcendent Action</h4>
        <p className="text-sm text-amber-700">{data.transcendentAction}</p>
      </div>

      <div className="p-4 bg-orange-50 rounded-lg">
        <h4 className="font-medium text-orange-800 mb-2">Compassionate Service</h4>
        <p className="text-sm text-orange-700">{data.compassionateService}</p>
      </div>

      <div className="p-4 bg-gold-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Divine Embodiment</h4>
        <p className="text-sm text-yellow-700">{data.divineEmbodiment}</p>
      </div>
    </div>
  );

  const renderQuantumLevel = (data: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-cyan-50 rounded-lg">
        <h4 className="font-medium text-cyan-800 mb-2">Probability Collapse</h4>
        <p className="text-sm text-cyan-700">{data.probabilityCollapse}</p>
      </div>

      <div className="p-4 bg-teal-50 rounded-lg">
        <h4 className="font-medium text-teal-800 mb-2">Timeline Optimization</h4>
        <p className="text-sm text-teal-700">{data.timelineOptimization}</p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Potential Activation</h4>
        <p className="text-sm text-blue-700">{data.potentialActivation}</p>
      </div>

      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">Dimensional Bridging</h4>
        <p className="text-sm text-indigo-700">{data.dimensionalBridging}</p>
      </div>
    </div>
  );

  const renderLevelContent = (level: any) => {
    if (!level.data) return <div>Loading level data...</div>;

    switch (level.id) {
      case 'human':
        return renderHumanLevel(level.data);
      case 'soul':
        return renderSoulLevel(level.data);
      case 'cosmic':
        return renderCosmicLevel(level.data);
      case 'transcendent':
        return renderTranscendentLevel(level.data);
      case 'quantum':
        return renderQuantumLevel(level.data);
      default:
        return <div>Select a consciousness level to explore</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Multidimensional Intelligence</h2>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Accessing all dimensions...
          </div>
        )}
      </div>

      {!multidimensionalResponse && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Multidimensional analysis awaiting consciousness data...</p>
          <p className="text-xs opacity-75 mt-1">
            Human, Soul, Cosmic, Transcendent, and Quantum intelligence levels
          </p>
        </div>
      )}

      {multidimensionalResponse && (
        <div className="space-y-6">
          {/* Consciousness Level Overview */}
          <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 mb-2">
                MULTIDIMENSIONAL
              </div>
              <div className="text-lg font-medium text-indigo-800">Consciousness Intelligence</div>
              <div className="text-sm text-indigo-600 mt-1">
                Active across all planes of awareness and being
              </div>
            </div>
          </div>

          {/* Level Selector */}
          <div className="grid grid-cols-5 gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedLevel === level.id
                    ? `border-${level.color}-500 bg-${level.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {level.icon}
                </div>
                <div className="text-xs font-medium">{level.title}</div>
                <div className="text-xs text-gray-600 mt-1">{level.description}</div>
              </button>
            ))}
          </div>

          {/* Level Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderLevelContent(levels.find(l => l.id === selectedLevel)!)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Emergent Possibilities */}
          {multidimensionalResponse.emergentPossibilities && (
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-pink-800">🚀 Emergent Possibilities</h3>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-pink-600 underline hover:no-underline"
                >
                  {isExpanded ? 'Less' : 'Explore'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-pink-700 mb-1">New Potentials</h5>
                  <div className="space-y-1">
                    {multidimensionalResponse.emergentPossibilities.newPotentials.slice(0, 2).map((potential: string, idx: number) => (
                      <div key={idx} className="text-xs text-pink-600">⭐ {potential}</div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-purple-700 mb-1">Consciousness Expansions</h5>
                  <div className="space-y-1">
                    {multidimensionalResponse.emergentPossibilities.consciousnessExpansions.slice(0, 2).map((expansion: string, idx: number) => (
                      <div key={idx} className="text-xs text-purple-600">🌟 {expansion}</div>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <div className="p-3 bg-white/60 rounded">
                      <h5 className="text-sm font-medium text-green-700 mb-1">Service Expressions</h5>
                      <div className="space-y-1">
                        {multidimensionalResponse.emergentPossibilities.serviceExpressions.map((service: string, idx: number) => (
                          <div key={idx} className="text-xs text-green-600">🕊️ {service}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/60 rounded">
                      <h5 className="text-sm font-medium text-blue-700 mb-1">Creative Possibilities</h5>
                      <div className="space-y-1">
                        {multidimensionalResponse.emergentPossibilities.creativePossibilities.map((creative: string, idx: number) => (
                          <div key={idx} className="text-xs text-blue-600">🎨 {creative}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Holistic Strategy */}
          {multidimensionalResponse.holisticStrategy && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-3">🎯 Holistic Life Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-indigo-700 mb-1">Life Architecture</h5>
                  <p className="text-xs text-indigo-600">{multidimensionalResponse.holisticStrategy.lifeArchitecture}</p>
                </div>
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-blue-700 mb-1">Evolution Strategy</h5>
                  <p className="text-xs text-blue-600">{multidimensionalResponse.holisticStrategy.evolutionStrategy}</p>
                </div>
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-purple-700 mb-1">Flow Alignment</h5>
                  <p className="text-xs text-purple-600">{multidimensionalResponse.holisticStrategy.flowAlignment}</p>
                </div>
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-cyan-700 mb-1">Harmony Creation</h5>
                  <p className="text-xs text-cyan-600">{multidimensionalResponse.holisticStrategy.harmonyCreation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Practical Integration */}
          {multidimensionalResponse.practicalIntegration && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">🌱 Practical Integration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-green-700 mb-1">Daily Practices</h5>
                  <ul className="space-y-1">
                    {multidimensionalResponse.practicalIntegration.dailyPractices.slice(0, 3).map((practice: string, idx: number) => (
                      <li key={idx} className="text-xs text-green-600">• {practice}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-emerald-700 mb-1">Life Changes</h5>
                  <ul className="space-y-1">
                    {multidimensionalResponse.practicalIntegration.lifeChanges.slice(0, 3).map((change: string, idx: number) => (
                      <li key={idx} className="text-xs text-emerald-600">• {change}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-white/60 rounded">
                  <h5 className="text-sm font-medium text-teal-700 mb-1">Spiritual Integration</h5>
                  <ul className="space-y-1">
                    {multidimensionalResponse.practicalIntegration.spiritualIntegration.slice(0, 3).map((integration: string, idx: number) => (
                      <li key={idx} className="text-xs text-teal-600">• {integration}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {multidimensionalResponse && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-indigo-700 text-sm">
            <Infinity className="w-4 h-4" />
            <span className="font-medium">Multidimensional Intelligence Online</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            Complete integration of human psychology, soul wisdom, cosmic perspective, transcendent awareness,
            and quantum intelligence for ultimate life guidance and consciousness evolution.
          </p>
        </div>
      )}
    </div>
  );
}