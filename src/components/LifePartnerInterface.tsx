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
      const response = await enhancedAIService.analyzeLifeContext(
        text,
        videoAnalysis,
        audioAnalysis
      );

      // Add AI response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        emotion: response.emotion,
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is enabled
      if (voiceEnabled && response.text) {
        setIsSpeaking(true);
        await enhancedAIService.speakResponse(response);
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
    }
  }, [isListening, handleSendMessage]);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(prev => !prev);
  }, [isSpeaking]);

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Your AI Life Partner</h2>
              <p className="text-sm text-indigo-100">
                {isProcessing ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-white/20' : 'bg-white/10'
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
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ${getEmotionColor(message.emotion)}`}>
                      {getEmotionIcon(message.emotion)}
                    </div>
                    <span className="text-xs text-gray-500">AI Partner</span>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
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
                        className="block w-full text-left text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
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
                        className="block w-full text-left text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
                      >
                        ❓ {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center ml-2">
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
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
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
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift+Enter for new line • Voice enabled: {voiceEnabled ? 'On' : 'Off'}
        </div>
      </div>
    </div>
  );
}