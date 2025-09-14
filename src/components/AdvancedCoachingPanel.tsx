import React, { useState, useEffect } from 'react';
import { Target, Brain, Heart, Zap, CheckCircle, AlertTriangle, TrendingUp, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationService } from '../lib/services/conversationService';

interface CoachingSession {
  id: string;
  goals: string[];
  interventions: any[];
  skillBuilding: any[];
  emotionalRegulation: any;
  exercises: any[];
  progress: {
    completed: string[];
    inProgress: string[];
    upcoming: string[];
  };
}

export function AdvancedCoachingPanel() {
  const [activeSession, setActiveSession] = useState<CoachingSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('interventions');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    const initializeSession = async () => {
      setIsGenerating(true);
      
      try {
        const conversationHistory = conversationService.getConversationHistory(10);
        const userProfile = conversationService.getUserProfile();
        
        const realSession: CoachingSession = {
          id: 'session-' + Date.now(),
          goals: this.generatePersonalizedGoals(conversationHistory, userProfile),
          interventions: this.generatePersonalizedInterventions(conversationHistory, userProfile),
          skillBuilding: this.generatePersonalizedSkillBuilding(conversationHistory, userProfile),
          emotionalRegulation: {
            currentEmotionalState: this.assessCurrentEmotionalState(conversationHistory),
            regulationNeeded: false,
            techniques: {
              immediate: ['Deep breathing', 'Grounding exercises'],
              shortTerm: ['Journaling', 'Physical movement'],
              longTerm: ['Mindfulness meditation', 'Therapy skills']
            },
            customizedApproach: this.createCustomizedApproach(userProfile)
          },
          exercises: this.generatePersonalizedExercises(conversationHistory, userProfile),
          progress: {
            completed: [],
            inProgress: ['emotional-regulation-1'],
            upcoming: ['cognitive-reframe-1', 'behavioral-activation-1']
          }
        };

        setActiveSession(realSession);
      } catch (error) {
        console.error('Failed to initialize coaching session:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    initializeSession();
  }, []);

  const generatePersonalizedGoals = (history: any[], profile: any): string[] => {
    const goals = [];
    const allText = history.map(msg => msg.content || '').join(' ').toLowerCase();
    
    if (allText.includes('stress') || allText.includes('overwhelm')) {
      goals.push('Develop effective stress management strategies');
    }
    if (allText.includes('decision') || allText.includes('choice')) {
      goals.push('Build confidence in decision-making');
    }
    if (allText.includes('relationship') || allText.includes('communication')) {
      goals.push('Enhance communication and relationship skills');
    }
    
    if (goals.length === 0) {
      goals.push('Increase self-awareness and emotional intelligence');
      goals.push('Develop personalized coping strategies');
    }
    
    return goals.slice(0, 3);
  };

  const generatePersonalizedInterventions = (history: any[], profile: any): any[] => {
    const interventions = [];
    const allText = history.map(msg => msg.content || '').join(' ').toLowerCase();
    
    if (allText.includes('stress') || allText.includes('overwhelm')) {
      interventions.push({
        id: 'stress-management-1',
        type: 'emotional',
        priority: 'high',
        title: 'Stress Regulation Techniques',
        description: 'Immediate and long-term strategies for managing stress and overwhelm',
        techniques: ['Progressive muscle relaxation', 'Cognitive restructuring', 'Time management'],
        expectedOutcome: 'Reduced stress levels and improved coping',
        timeEstimate: '10-15 minutes daily',
        status: 'active'
      });
    }
    
    if (allText.includes('decision') || allText.includes('choice')) {
      interventions.push({
        id: 'decision-support-1',
        type: 'cognitive',
        priority: 'medium',
        title: 'Decision-Making Framework',
        description: 'Structured approach to making decisions with confidence',
        techniques: ['Values-based decision matrix', 'Pros and cons analysis', 'Future self visualization'],
        expectedOutcome: 'Clearer decision-making process and increased confidence',
        timeEstimate: '15-20 minutes per decision',
        status: 'pending'
      });
    }
    
    // Default intervention if no specific needs identified
    if (interventions.length === 0) {
      interventions.push({
        id: 'awareness-building-1',
        type: 'emotional',
        priority: 'medium',
        title: 'Self-Awareness Development',
        description: 'Building foundation skills for emotional and psychological awareness',
        techniques: ['Mindful observation', 'Emotion labeling', 'Pattern recognition'],
        expectedOutcome: 'Enhanced self-understanding and emotional clarity',
        timeEstimate: '5-10 minutes daily',
        status: 'active'
      });
    }
    
    return interventions;
  };

  const generatePersonalizedSkillBuilding = (history: any[], profile: any): any[] => {
    const skills = [];
    const allText = history.map(msg => msg.content || '').join(' ').toLowerCase();
    
    // Always include emotional regulation as foundational
    skills.push({
      skill: 'Emotional Regulation',
      currentLevel: 0.6,
      targetLevel: 0.8,
      exercises: [
        'Daily emotion check-ins',
        'Breathing exercises',
        'Mindfulness practice',
        'Stress response awareness'
      ],
      practiceSchedule: 'Daily 10-minute sessions',
      progressIndicators: [
        'Better emotion recognition',
        'Faster emotional recovery',
        'Reduced emotional reactivity'
      ]
    });
    
    if (allText.includes('decision') || allText.includes('choice')) {
      skills.push({
        skill: 'Decision Making',
        currentLevel: 0.7,
        targetLevel: 0.85,
        exercises: [
          'Values clarification',
          'Decision frameworks',
          'Outcome visualization',
          'Confidence building'
        ],
        practiceSchedule: 'Apply to daily decisions',
        progressIndicators: [
          'Faster decision making',
          'Higher satisfaction with choices',
          'Reduced decision anxiety'
        ]
      });
    }
    
    if (allText.includes('communication') || allText.includes('relationship')) {
      skills.push({
        skill: 'Communication',
        currentLevel: 0.65,
        targetLevel: 0.8,
        exercises: [
          'Active listening practice',
          'Clear expression techniques',
          'Boundary setting',
          'Conflict resolution'
        ],
        practiceSchedule: 'Practice in daily interactions',
        progressIndicators: [
          'Clearer self-expression',
          'Better understanding of others',
          'Stronger relationships'
        ]
      });
    }
    
    return skills.slice(0, 3);
  };

  const generatePersonalizedExercises = (history: any[], profile: any): any[] => {
    const exercises = [];
    const allText = history.map(msg => msg.content || '').join(' ').toLowerCase();
    
    // Always include basic emotional regulation
    exercises.push({
      id: 'breathing-exercise-1',
      title: '4-7-8 Breathing for Calm',
      type: 'emotional',
      description: 'Use this breathing technique when feeling stressed or overwhelmed',
      steps: [
        'Find a comfortable position',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat 3-4 times and notice the change'
      ],
      timeEstimate: '2-3 minutes',
      difficulty: 'beginner'
    });
    
    if (allText.includes('decision') || allText.includes('choice')) {
      exercises.push({
        id: 'values-decision-1',
        title: 'Values-Based Decision Making',
        type: 'cognitive',
        description: 'Make decisions that align with your core values',
        steps: [
          'Identify the decision you need to make',
          'List your top 5 personal values',
          'Rate how each option aligns with your values (1-10)',
          'Calculate total alignment scores',
          'Choose the option with highest value alignment'
        ],
        timeEstimate: '10-15 minutes',
        difficulty: 'intermediate'
      });
    }
    
    if (allText.includes('thought') || allText.includes('worry')) {
      exercises.push({
        id: 'thought-challenge-1',
        title: 'Challenge Unhelpful Thoughts',
        type: 'cognitive',
        description: 'Question and reframe negative or unhelpful thinking patterns',
        steps: [
          'Notice the unhelpful thought',
          'Write it down exactly as it occurred',
          'Ask: What evidence supports this thought?',
          'Ask: What evidence contradicts this thought?',
          'Create a more balanced perspective'
        ],
        timeEstimate: '5-10 minutes',
        difficulty: 'beginner'
      });
    }
    
    return exercises.slice(0, 3);
  };

  const assessCurrentEmotionalState = (history: any[]): string => {
    if (history.length === 0) return 'neutral';
    
    const recentMessages = history.slice(-3);
    const recentText = recentMessages.map(msg => msg.content || '').join(' ').toLowerCase();
    
    if (recentText.includes('happy') || recentText.includes('good')) return 'positive';
    if (recentText.includes('sad') || recentText.includes('down')) return 'low';
    if (recentText.includes('stress') || recentText.includes('overwhelm')) return 'stressed';
    if (recentText.includes('angry') || recentText.includes('frustrated')) return 'agitated';
    
    return 'neutral';
  };

  const createCustomizedApproach = (profile: any): string => {
    if (!profile || Object.keys(profile).length === 0) {
      return 'As I learn more about your unique patterns, I\'ll customize this approach specifically for you.';
    }
    
    const communication = profile.communicationStyle || 'balanced';
    
    if (communication === 'analytical_explorer') {
      return 'Your analytical nature responds well to structured approaches with clear steps and logical frameworks.';
    } else if (communication === 'collaborative_detailed') {
      return 'You benefit from collaborative exploration with detailed discussion and multiple perspectives.';
    } else {
      return 'Your balanced communication style allows for flexible approaches tailored to each situation.';
    }
  };
  const handleCompleteExercise = (exerciseId: string) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
    
    // Move from in progress to completed
    if (activeSession) {
      setActiveSession(prev => ({
        ...prev!,
        progress: {
          ...prev!.progress,
          completed: [...prev!.progress.completed, exerciseId],
          inProgress: prev!.progress.inProgress.filter(id => id !== exerciseId)
        }
      }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 0.8) return 'bg-green-500';
    if (level >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderInterventions = () => (
    <div className="space-y-4">
      {activeSession?.interventions.map((intervention) => (
        <motion.div
          key={intervention.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg bg-white"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">{intervention.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(intervention.priority)}`}>
                {intervention.priority}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                intervention.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {intervention.status}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{intervention.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Techniques</h4>
              <ul className="text-xs space-y-1">
                {intervention.techniques.map((technique: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                    {technique}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Expected Outcome</h4>
              <p className="text-xs text-gray-600">{intervention.expectedOutcome}</p>
              <p className="text-xs text-indigo-600 mt-1">⏱ {intervention.timeEstimate}</p>
            </div>
          </div>

          {intervention.status === 'active' && (
            <button className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
              Start Intervention
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderSkillBuilding = () => (
    <div className="space-y-4">
      {activeSession?.skillBuilding.map((skill, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg bg-white"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {skill.skill}
            </h3>
            <span className="text-sm text-gray-600">
              {Math.round(skill.currentLevel * 100)}% → {Math.round(skill.targetLevel * 100)}%
            </span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Current Progress</span>
              <span>{Math.round(skill.currentLevel * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.currentLevel * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${getSkillLevelColor(skill.currentLevel)}`}
              />
            </div>
            <div className="mt-1 h-1 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-green-200 rounded-full"
                style={{ width: `${skill.targetLevel * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Practice Exercises</h4>
              <ul className="text-xs space-y-1">
                {skill.exercises.map((exercise: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Progress Indicators</h4>
              <ul className="text-xs space-y-1">
                {skill.progressIndicators.map((indicator: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-700">
            <strong>Schedule:</strong> {skill.practiceSchedule}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-4">
      {activeSession?.exercises.map((exercise) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border rounded-lg ${
            completedExercises.includes(exercise.id) ? 'bg-green-50 border-green-200' : 'bg-white'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {exercise.type === 'cognitive' && <Brain className="w-5 h-5 text-indigo-600" />}
              {exercise.type === 'emotional' && <Heart className="w-5 h-5 text-purple-600" />}
              {exercise.type === 'behavioral' && <Target className="w-5 h-5 text-green-600" />}
              <h3 className="font-semibold">{exercise.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-600' :
                exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {exercise.difficulty}
              </span>
              {completedExercises.includes(exercise.id) && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Steps:</h4>
            <ol className="text-sm space-y-1">
              {exercise.steps.map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">⏱ {exercise.timeEstimate}</span>
            {!completedExercises.includes(exercise.id) && (
              <button
                onClick={() => handleCompleteExercise(exercise.id)}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderEmotionalRegulation = () => (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-2">Current Emotional State</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <span className="capitalize font-medium">{activeSession?.emotionalRegulation.currentEmotionalState}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            activeSession?.emotionalRegulation.regulationNeeded ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
          }`}>
            {activeSession?.emotionalRegulation.regulationNeeded ? 'Regulation Needed' : 'Stable'}
          </span>
        </div>
        <p className="text-sm text-purple-700">{activeSession?.emotionalRegulation.customizedApproach}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2 text-sm">Immediate (0-5 min)</h4>
          <ul className="text-xs space-y-1">
            {activeSession?.emotionalRegulation.techniques.immediate.map((technique: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-red-600" />
                {technique}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2 text-sm">Short-term (5-30 min)</h4>
          <ul className="text-xs space-y-1">
            {activeSession?.emotionalRegulation.techniques.shortTerm.map((technique: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-yellow-600" />
                {technique}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2 text-sm">Long-term (daily)</h4>
          <ul className="text-xs space-y-1">
            {activeSession?.emotionalRegulation.techniques.longTerm.map((technique: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-green-600" />
                {technique}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Advanced Coaching</h2>
        {isGenerating && (
          <div className="ml-auto flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Generating session...
          </div>
        )}
      </div>

      {!activeSession && !isGenerating && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Coaching session will be created based on your interactions...</p>
          <p className="text-xs opacity-75 mt-1">
            Personalized interventions, skill building, and psychological exercises
          </p>
        </div>
      )}

      {activeSession && (
        <div className="space-y-6">
          {/* Session Goals */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">Session Goals</h3>
            <ul className="space-y-1">
              {activeSession.goals.map((goal, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-indigo-700">
                  <CheckCircle className="w-4 h-4" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeSession.progress.completed.length}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{activeSession.progress.inProgress.length}</div>
              <div className="text-xs text-yellow-600">In Progress</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeSession.progress.upcoming.length}</div>
              <div className="text-xs text-blue-600">Upcoming</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'interventions', label: 'Interventions', icon: Target },
                { id: 'skills', label: 'Skill Building', icon: TrendingUp },
                { id: 'exercises', label: 'Exercises', icon: Book },
                { id: 'regulation', label: 'Emotion Regulation', icon: Heart }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedTab(id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${
                    selectedTab === id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {selectedTab === 'interventions' && renderInterventions()}
            {selectedTab === 'skills' && renderSkillBuilding()}
            {selectedTab === 'exercises' && renderExercises()}
            {selectedTab === 'regulation' && renderEmotionalRegulation()}
          </div>
        </div>
      )}

      {activeSession && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Personalized Coaching Active</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            This coaching session adapts to your unique psychological profile and provides evidence-based
            interventions tailored to your specific needs and growth goals.
          </p>
        </div>
      )}
    </div>
  );
}