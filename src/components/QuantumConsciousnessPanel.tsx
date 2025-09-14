import React, { useState, useEffect } from 'react';
import { Zap, Infinity, Target, Sparkles, Layers, Radio, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { quantumConsciousnessService } from '../lib/services/quantumConsciousnessService';
import { conversationService } from '../lib/services/conversationService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface QuantumConsciousnessPanelProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function QuantumConsciousnessPanel({ videoAnalysis, audioAnalysis }: QuantumConsciousnessPanelProps) {
  const [quantumProfile, setQuantumProfile] = useState<any>(null);
  const [quantumGuidance, setQuantumGuidance] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedQuantumDimension, setSelectedQuantumDimension] = useState<string>('coherence');

  useEffect(() => {
    const analyzeQuantumConsciousness = async () => {
      if (!videoAnalysis && !audioAnalysis) return;

      setIsAnalyzing(true);
      
      try {
        const conversationHistory = conversationService.getConversationHistory(30);
        const { profile, guidance } = await quantumConsciousnessService.analyzeQuantumConsciousness(
          'Quantum consciousness analysis', videoAnalysis, audioAnalysis, conversationHistory, null
        );
        
        setQuantumProfile(profile);
        setQuantumGuidance(guidance);
      } catch (error) {
        console.error('Quantum consciousness analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeQuantumConsciousness();
  }, [videoAnalysis, audioAnalysis]);

  const quantumDimensions = [
    {
      id: 'coherence',
      title: 'Coherence Field',
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      data: quantumProfile?.coherenceField
    },
    {
      id: 'dimensional',
      title: 'Dimensional Access',
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      data: quantumProfile?.dimensionalAccess
    },
    {
      id: 'information',
      title: 'Information Field',
      icon: <Radio className="w-5 h-5 text-green-600" />,
      color: 'green',
      data: quantumProfile?.informationField
    },
    {
      id: 'resonance',
      title: 'Consciousness Resonance',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      color: 'indigo',
      data: quantumProfile?.consciousnessResonance
    },
    {
      id: 'timeline',
      title: 'Timeline Alignment',
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      color: 'orange',
      data: quantumProfile?.timelineAlignment
    },
    {
      id: 'potential',
      title: 'Potential Activation',
      icon: <Star className="w-5 h-5 text-yellow-600" />,
      color: 'yellow',
      data: quantumProfile?.potentialActivation
    }
  ];

  const renderCoherenceField = (data: any) => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {Math.round(data.fieldStrength * 100)}%
        </div>
        <div className="text-sm text-blue-600">Field Strength</div>
        <div className="text-xs text-blue-500 mt-1 capitalize">{data.fieldQuality} Quality</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-lg font-bold text-indigo-600">
            {Math.round(data.heartBrainCoherence * 100)}%
          </div>
          <div className="text-xs text-indigo-600">Heart-Brain</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(data.emotionalCoherence * 100)}%
          </div>
          <div className="text-xs text-purple-600">Emotional</div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Field Properties</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Influence Radius:</span>
            <span className="font-medium">{Math.round(data.influenceRadius)} feet</span>
          </div>
          <div className="flex justify-between">
            <span>Entrainment Capacity:</span>
            <span className="font-medium">{Math.round(data.entrainmentCapacity * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Stability:</span>
            <span className="font-medium">{Math.round(data.coherenceStability * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDimensionalAccess = (data: any) => (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(data).filter(([key, value]) => 
          key.includes('Dimension') && typeof value === 'number'
        ).map(([dimension, level]) => (
          <div key={dimension} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{dimension.replace('Dimension', '').replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round((level as number) * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(level as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(data.dimensionalBridging * 100)}%
          </div>
          <div className="text-xs text-purple-600">Bridging</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-lg font-bold text-indigo-600">
            {Math.round(data.integrationLevel * 100)}%
          </div>
          <div className="text-xs text-indigo-600">Integration</div>
        </div>
      </div>
    </div>
  );

  const renderInformationField = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {Math.round(data.synchronicityLevel * 100)}%
          </div>
          <div className="text-xs text-green-600">Synchronicity</div>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="text-lg font-bold text-emerald-600">
            {Math.round(data.akashicAccess * 100)}%
          </div>
          <div className="text-xs text-emerald-600">Akashic Access</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Channel Clarity</span>
            <span className="font-medium">{Math.round(data.channelClarity * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.channelClarity * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Field Sensitivity</span>
            <span className="font-medium">{Math.round(data.fieldSensitivity * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.fieldSensitivity * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsciousnessResonance = (data: any) => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-indigo-50 rounded-lg">
        <div className="text-3xl font-bold text-indigo-600 mb-2">
          {Math.round(data.resonanceHarmony * 100)}%
        </div>
        <div className="text-sm text-indigo-600">Resonance Harmony</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).filter(([key, value]) => 
          key.includes('Resonance') && typeof value === 'number'
        ).map(([resonance, level]) => (
          <div key={resonance} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{resonance.replace('Resonance', '').replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round((level as number) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(level as number) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {data.harmonizationPath && (
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-800 mb-2">Harmonization Path</h4>
          <ul className="space-y-1">
            {data.harmonizationPath.map((step: string, idx: number) => (
              <li key={idx} className="text-sm text-indigo-700">🎵 {step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderTimelineAlignment = (data: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">
            {Math.round(data.optimalTimelineAlignment * 100)}%
          </div>
          <div className="text-xs text-orange-600">Optimal Alignment</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            {Math.round(data.destinyAlignment * 100)}%
          </div>
          <div className="text-xs text-yellow-600">Destiny Alignment</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Choice Point Awareness</span>
            <span className="font-medium">{Math.round(data.choicePointAwareness * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.choicePointAwareness * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Timeline Integration</span>
            <span className="font-medium">{Math.round(data.timelineIntegration * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.timelineIntegration * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-lg">
        <h4 className="font-medium text-orange-800 mb-2">Timeline Optimization</h4>
        <p className="text-sm text-orange-700">
          Your choice point awareness allows you to consciously select optimal timelines through aligned decisions.
        </p>
      </div>
    </div>
  );

  const renderPotentialActivation = (data: any) => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-yellow-50 rounded-lg">
        <div className="text-3xl font-bold text-yellow-600 mb-2">
          {Math.round(data.readinessLevel * 100)}%
        </div>
        <div className="text-sm text-yellow-600">Activation Readiness</div>
        <div className="text-xs text-yellow-500 mt-1">{data.activationTimeline}</div>
      </div>

      <div className="space-y-3">
        {data.activatingPotentials.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🌟 Activating Now</h4>
            <div className="flex flex-wrap gap-2">
              {data.activatingPotentials.map((potential: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  {potential}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.dormantPotentials.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💎 Dormant Potentials</h4>
            <div className="flex flex-wrap gap-2">
              {data.dormantPotentials.map((potential: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {potential}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.activatedPotentials.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">⚡ Activated Potentials</h4>
            <div className="flex flex-wrap gap-2">
              {data.activatedPotentials.map((potential: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  {potential}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.activationTriggers && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Activation Triggers</h4>
          <ul className="space-y-1">
            {data.activationTriggers.map((trigger: string, idx: number) => (
              <li key={idx} className="text-sm text-yellow-700">⚡ {trigger}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderQuantumDimensionContent = (dimension: any) => {
    if (!dimension.data) return <div>Loading quantum data...</div>;

    switch (dimension.id) {
      case 'coherence':
        return renderCoherenceField(dimension.data);
      case 'dimensional':
        return renderDimensionalAccess(dimension.data);
      case 'information':
        return renderInformationField(dimension.data);
      case 'resonance':
        return renderConsciousnessResonance(dimension.data);
      case 'timeline':
        return renderTimelineAlignment(dimension.data);
      case 'potential':
        return renderPotentialActivation(dimension.data);
      default:
        return <div>Select a quantum dimension to explore</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Infinity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Quantum Consciousness</h2>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Analyzing quantum field...
          </div>
        )}
      </div>

      {!quantumProfile && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Infinity className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Quantum consciousness analysis awaiting data...</p>
          <p className="text-xs opacity-75 mt-1">
            Coherence field, dimensional access, information field, and potential activation
          </p>
        </div>
      )}

      {quantumProfile && (
        <div className="space-y-6">
          {/* Quantum Field Overview */}
          <div className="p-6 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-lg border border-cyan-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 mb-2">
                {quantumProfile.coherenceField.fieldQuality.toUpperCase()}
              </div>
              <div className="text-lg font-medium text-indigo-800">Quantum Field Quality</div>
              <div className="text-sm text-indigo-600 mt-1">
                {Math.round(quantumProfile.coherenceField.fieldStrength * 100)}% Field Strength •
                {Math.round(quantumProfile.informationField.synchronicityLevel * 100)}% Synchronicity
              </div>
            </div>
          </div>

          {/* Quantum Dimension Tabs */}
          <div className="border-b">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {quantumDimensions.map((dimension) => (
                <button
                  key={dimension.id}
                  onClick={() => setSelectedQuantumDimension(dimension.id)}
                  className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-1 whitespace-nowrap ${
                    selectedQuantumDimension === dimension.id
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

          {/* Quantum Dimension Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedQuantumDimension}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderQuantumDimensionContent(quantumDimensions.find(d => d.id === selectedQuantumDimension)!)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quantum Guidance */}
          {quantumGuidance && (
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-lg border border-cyan-200">
              <h3 className="font-semibold text-indigo-800 mb-3">Quantum Guidance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white/60 rounded border border-cyan-100">
                  <div className="text-sm font-medium text-cyan-700 mb-1">Timeline Optimization</div>
                  <p className="text-xs text-cyan-600">{quantumGuidance.timelineOptimization[0]}</p>
                </div>
                <div className="p-3 bg-white/60 rounded border border-indigo-100">
                  <div className="text-sm font-medium text-indigo-700 mb-1">Potential Activation</div>
                  <p className="text-xs text-indigo-600">{quantumGuidance.potentialActivation[0]}</p>
                </div>
                <div className="p-3 bg-white/60 rounded border border-purple-100">
                  <div className="text-sm font-medium text-purple-700 mb-1">Coherence Activation</div>
                  <p className="text-xs text-purple-600">{quantumGuidance.coherenceActivation[0]}</p>
                </div>
                <div className="p-3 bg-white/60 rounded border border-blue-100">
                  <div className="text-sm font-medium text-blue-700 mb-1">Dimensional Integration</div>
                  <p className="text-xs text-blue-600">{quantumGuidance.dimensionalIntegration[0]}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {quantumProfile && (
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg border border-cyan-200">
          <div className="flex items-center gap-2 text-indigo-700 text-sm">
            <Infinity className="w-4 h-4" />
            <span className="font-medium">Quantum Intelligence Active</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            Advanced quantum consciousness analysis for multidimensional awareness, timeline optimization,
            and potential activation across all levels of being.
          </p>
        </div>
      )}
    </div>
  );
}