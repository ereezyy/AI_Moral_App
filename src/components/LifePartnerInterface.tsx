import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageSquare, Mic, MicOff, Volume2, VolumeX, Heart, Brain, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedAIService } from '../lib/services/enhancedAiService';
import { speechService } from '../lib/services/speechService';
import { conversationService } from '../lib/services/conversationService';
import type { VideoAnalysis, AudioAnalysis } from '../types/analysis';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotion?: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  predictions?: string[];
  riskFactors?: string[];
  growthOpportunities?: string[];
  psychologicalInsights?: string[];
  soulGuidance?: string;
  cosmicPerspective?: string;
  transcendentWisdom?: string;
  quantumInsights?: string[];
  emergentPossibilities?: string[];
  multidimensionalLevel?: 'human' | 'soul' | 'cosmic' | 'transcendent' | 'quantum';
}

interface LifePartnerInterfaceProps {
  videoAnalysis: VideoAnalysis | null;
  audioAnalysis: AudioAnalysis | null;
}

export function LifePartnerInterface({ videoAnalysis, audioAnalysis }: LifePartnerInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const history = conversationService.getConversationHistory(20);
    const formattedMessages: Message[] = history.map(msg => ({
      id: msg.id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp
    }));
    setMessages(formattedMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: crypto.randomUUID(),
          type: 'assistant',
          content: "Hey there! I'm your AI life partner. I can see and hear you, and I'm here to offer support, guidance, and just be someone to talk to. How are you feeling today?",
          timestamp: Date.now(),
          emotion: 'supportive',
          suggestions: [
            "Tell me about your day",
            "Share what's on your mind", 
            "Ask for advice on anything"
          ]
        };
        setMessages([welcomeMessage]);
        
        if (voiceEnabled) {
          speechService.speak(welcomeMessage.content);
        }
      }, 1000);
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isProcessing) return;

    setInput('');
    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user', 
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response with full context
      const enhancedResponse = await enhancedAIService.analyzeLifeContext(
        text,
        videoAnalysis,
        audioAnalysis
      );

      // Synthesize multidimensional response into conversational format
      const synthesizedResponse = synthesizeIntoConversation(enhancedResponse, text);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: synthesizedResponse.text,
        timestamp: Date.now(),
        emotion: synthesizedResponse.emotion,
        suggestions: synthesizedResponse.suggestions,
        followUpQuestions: synthesizedResponse.followUpQuestions,
        predictions: synthesizedResponse.predictions,
        riskFactors: synthesizedResponse.riskFactors,
        growthOpportunities: synthesizedResponse.growthOpportunities,
        psychologicalInsights: synthesizedResponse.psychologicalInsights,
        soulGuidance: synthesizedResponse.soulGuidance,
        cosmicPerspective: synthesizedResponse.cosmicPerspective,
        transcendentWisdom: synthesizedResponse.transcendentWisdom,
        quantumInsights: synthesizedResponse.quantumInsights,
        emergentPossibilities: synthesizedResponse.emergentPossibilities,
        multidimensionalLevel: 'human'
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is enabled
      if (voiceEnabled && synthesizedResponse.text) {
        setIsSpeaking(true);
        await speechService.speak(synthesizedResponse.text, {
          rate: synthesizedResponse.emotion === 'excited' ? 1.1 : 0.9,
          pitch: synthesizedResponse.emotion === 'supportive' ? 1.0 : 1.1
        });
        setIsSpeaking(false);
      }

    } catch (error) {
      console.error('Failed to process message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "I'm having trouble processing that right now, but I'm still here for you. Can you try rephrasing what you'd like to talk about?",
        timestamp: Date.now(),
        emotion: 'concerned'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, videoAnalysis, audioAnalysis, voiceEnabled, isProcessing]);

  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      const transcript = await speechService.startListening();
      setIsListening(false);
      
      if (transcript.trim()) {
        await handleSendMessage(transcript);
      }
    } catch (error) {
      console.error('Voice input failed:', error);
      setIsListening(false);
      
      // Add user-friendly error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "I'm having trouble with voice recognition right now. This might be due to a network issue or microphone permissions. Please check your internet connection and make sure your browser has microphone access, then try again. You can also type your message instead.",
        timestamp: Date.now(),
        emotion: 'concerned',
        suggestions: [
          "Check your microphone permissions",
          "Try typing your message instead"
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [isListening, handleSendMessage]);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(prev => !prev);
  }, [isSpeaking]);

  const synthesizeIntoConversation = useCallback((multidimensionalResponse: any, userInput: string) => {
    // Synthesize enhanced AI response into natural conversation
    const mainResponse = multidimensionalResponse.text || "I'm here to support you through this.";
    const emotion = multidimensionalResponse.emotion || 'supportive';
    const suggestions = multidimensionalResponse.suggestions || [];
    const followUpQuestions = multidimensionalResponse.followUpQuestions || [];
    
    return {
      text: mainResponse,
      emotion,
      suggestions,
      followUpQuestions,
      predictions: multidimensionalResponse.predictions || [],
      riskFactors: [], // Minimize negative focus
      growthOpportunities: multidimensionalResponse.growthOpportunities || [],
      psychologicalInsights: multidimensionalResponse.psychologicalInsights || [],
      soulGuidance: multidimensionalResponse.soulGuidance,
      cosmicPerspective: multidimensionalResponse.cosmicPerspective,
      transcendentWisdom: multidimensionalResponse.transcendentWisdom,
      quantumInsights: multidimensionalResponse.quantumInsights || [],
      emergentPossibilities: multidimensionalResponse.emergentPossibilities || []
    };
  }, []);

  const handleQuickResponse = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'supportive': return 'text-blue-600';
      case 'encouraging': return 'text-green-600';
      case 'concerned': return 'text-yellow-600';
      case 'excited': return 'text-purple-600';
      case 'thoughtful': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'supportive': return <Heart className="w-4 h-4" />;
      case 'encouraging': return <Sparkles className="w-4 h-4" />;
      case 'concerned': return <Brain className="w-4 h-4" />;
      case 'excited': return <Sparkles className="w-4 h-4 animate-pulse" />;
      case 'thoughtful': return <Brain className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-theme-lg overflow-hidden h-[600px] flex flex-col border border-border">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-foreground">Your AI Life Partner</h2>
              <p className="text-sm text-primary-foreground/80">
                {isProcessing ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-primary-foreground/20' : 'bg-primary-foreground/10'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      {getEmotionIcon(message.emotion)}
                    </div>
                    <span className="text-xs text-muted-foreground">AI Partner</span>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.type === 'assistant' && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Quick suggestions */}
                {message.type === 'assistant' && message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.slice(0, 2).map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickResponse(suggestion)}
                        className="block w-full text-left text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-up questions */}
                {message.type === 'assistant' && message.followUpQuestions && (
                  <div className="mt-2 space-y-1">
                    {message.followUpQuestions.slice(0, 2).map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickResponse(question)}
                        className="block w-full text-left text-xs bg-accent text-accent-foreground px-2 py-1 rounded hover:bg-accent/80 transition-colors"
                      >
                        ❓ {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Predictions */}
                {message.type === 'assistant' && message.predictions && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-muted-foreground mb-1">🔮 Predictions</div>
                    {message.predictions.slice(0, 2).map((prediction, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-info/10 text-info px-2 py-1 rounded border-l-2 border-info/30"
                      >
                        {prediction}
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk Factors */}
                {message.type === 'assistant' && message.riskFactors && message.riskFactors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-orange-600 mb-1">⚠️ Things to Watch</div>
                    {message.riskFactors.slice(0, 2).map((risk, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border-l-2 border-orange-300"
                      >
                        {risk}
                      </div>
                    ))}
                  </div>
                )}

                {/* Growth Opportunities */}
                {message.type === 'assistant' && message.growthOpportunities && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-green-600 mb-1">🌱 Growth Opportunities</div>
                    {message.growthOpportunities.slice(0, 2).map((opportunity, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border-l-2 border-green-300"
                      >
                        {opportunity}
                      </div>
                    ))}
                  </div>
                )}

                {/* Soul Guidance */}
                {message.type === 'assistant' && message.soulGuidance && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-purple-600 mb-1">🕉️ Soul Wisdom</div>
                    <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border-l-2 border-purple-300">
                      {message.soulGuidance}
                    </div>
                  </div>
                )}

                {/* Cosmic Perspective */}
                {message.type === 'assistant' && message.cosmicPerspective && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-indigo-600 mb-1">🌌 Cosmic View</div>
                    <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border-l-2 border-indigo-300">
                      {message.cosmicPerspective}
                    </div>
                  </div>
                )}

                {/* Transcendent Wisdom */}
                {message.type === 'assistant' && message.transcendentWisdom && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-yellow-600 mb-1">✨ Transcendent Wisdom</div>
                    <div className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border-l-2 border-yellow-300">
                      {message.transcendentWisdom}
                    </div>
                  </div>
                )}

                {/* Quantum Insights */}
                {message.type === 'assistant' && message.quantumInsights && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-cyan-600 mb-1">🔮 Quantum Intelligence</div>
                    {message.quantumInsights.slice(0, 2).map((insight, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded border-l-2 border-cyan-300"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                )}

                {/* Emergent Possibilities */}
                {message.type === 'assistant' && message.emergentPossibilities && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-pink-600 mb-1">🚀 Emergent Possibilities</div>
                    {message.emergentPossibilities.slice(0, 2).map((possibility, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded border-l-2 border-pink-300"
                      >
                        {possibility}
                      </div>
                    ))}
                  </div>
                )}

                {/* Multidimensional Level Indicator */}
                {message.type === 'assistant' && message.multidimensionalLevel && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {message.multidimensionalLevel.toUpperCase()} LEVEL
                    </span>
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center ml-2">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Share what's on your mind..."
              className="w-full p-3 border border-input rounded-lg resize-none bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              rows={2}
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`p-3 rounded-lg transition-colors ${
                isListening
                  ? 'bg-error text-error-foreground animate-pulse'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send • Shift+Enter for new line • Voice enabled: {voiceEnabled ? 'On' : 'Off'}
        </div>
      </div>
    </div>
  );
}