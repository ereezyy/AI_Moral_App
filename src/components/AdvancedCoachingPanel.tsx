import React, { useState, useEffect } from 'react';
import { Target, Brain, Heart, Zap, CheckCircle, AlertTriangle, TrendingUp, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { realTimeCoachingService } from '../lib/services/realTimeCoachingService';
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
        // Simulate getting coaching guidance
        const mockSession: CoachingSession = {
          id: 'session-' + Date.now(),
          goals: [
            'Develop emotional regulation skills',
            'Improve decision-making confidence',
            'Strengthen communication patterns'
          ],
          interventions: [
            {
              id: 'emotional-regulation-1',
              type: 'emotional',
              priority: 'high',
              title: 'Emotional Awareness Building',
              description: 'Practice identifying and labeling emotions in real-time',
              techniques: ['Emotion tracking', 'Body awareness', 'Mindful observation'],
              expectedOutcome: 'Increased emotional vocabulary and self-awareness',
              timeEstimate: '5-10 minutes daily',
              status: 'active'
            },
            {
              id: 'cognitive-reframe-1',
              type: 'cognitive',
              priority: 'medium',
              title: 'Thought Pattern Recognition',
              description: 'Identify and challenge unhelpful thinking patterns',
              techniques: ['Thought logging', 'Evidence examination', 'Alternative perspectives'],
              expectedOutcome: 'More balanced and realistic thinking',
              timeEstimate: '10-15 minutes as needed',
              status: 'pending'
            },
            {
              id: 'behavioral-activation-1',
              type: 'behavioral',
              priority: 'medium',
              title: 'Values-Based Action',
              description: 'Align daily actions with core values and goals',
              techniques: ['Value clarification', 'Action planning', 'Progress tracking'],
              expectedOutcome: 'Increased sense of purpose and fulfillment',
              timeEstimate: '15-20 minutes weekly',
              status: 'pending'
            }
          ],
          skillBuilding: [
            {
              skill: 'Emotional Regulation',
              currentLevel: 0.6,
              targetLevel: 0.8,
              exercises: [
                'Daily emotion check-ins',
                'Breathing techniques practice',
                'Progressive muscle relaxation',
                'Cognitive reappraisal exercises'
              ],
              practiceSchedule: 'Daily 10-15 minute sessions',
              progressIndicators: [
                'Faster emotional recovery',
                'Better emotion identification',
                'Reduced emotional reactivity'
              ]
            },
            {
              skill: 'Decision Making',
              currentLevel: 0.7,
              targetLevel: 0.85,
              exercises: [
                'Decision-making framework practice',
                'Values clarification exercises',
                'Outcome prediction practice',
                'Decision confidence building'
              ],
              practiceSchedule: 'Apply to daily decisions',
              progressIndicators: [
                'Faster decision making',
                'Higher satisfaction with choices',
                'Reduced decision regret'
              ]
            }
          ],
          emotionalRegulation: {
            currentEmotionalState: 'focused',
            regulationNeeded: false,
            techniques: {
              immediate: ['Deep breathing', 'Grounding exercises'],
              shortTerm: ['Journaling', 'Physical movement'],
              longTerm: ['Mindfulness meditation', 'Therapy skills']
            },
            customizedApproach: 'Based on your analytical nature, structured approaches work best for you.'
          },
          exercises: [
            {
              id: 'thought-challenge-1',
              title: 'Challenge Negative Thoughts',
              type: 'cognitive',
              description: 'When you notice a negative thought, ask: What evidence supports this? What evidence contradicts it?',
              steps: [
                'Notice the negative thought',
                'Write it down exactly as it occurred',
                'List evidence that supports the thought',
                'List evidence that contradicts the thought',
                'Create a more balanced perspective'
              ],
              timeEstimate: '5-10 minutes',
              difficulty: 'beginner'
            },
            {
              id: 'values-alignment-1',
              title: 'Values Alignment Check',
              type: 'behavioral',
              description: 'Before making decisions, check how well they align with your core values',
              steps: [
                'Identify the decision you need to make',
                'List your top 5 values',
                'Rate how well each option aligns with each value (1-10)',
                'Calculate alignment scores',
                'Choose the option with highest alignment'
              ],
              timeEstimate: '10-15 minutes',
              difficulty: 'intermediate'
            },
            {
              id: 'emotional-regulation-1',
              title: '4-7-8 Breathing for Calm',
              type: 'emotional',
              description: 'Use this breathing technique when feeling overwhelmed or anxious',
              steps: [
                'Inhale through your nose for 4 counts',
                'Hold your breath for 7 counts',
                'Exhale through your mouth for 8 counts',
                'Repeat 3-4 times',
                'Notice the change in your body and mind'
              ],
              timeEstimate: '2-3 minutes',
              difficulty: 'beginner'
            }
          ],
          progress: {
            completed: [],
            inProgress: ['emotional-regulation-1'],
            upcoming: ['cognitive-reframe-1', 'behavioral-activation-1']
          }
        };

        setActiveSession(mockSession);
      } catch (error) {
        console.error('Failed to initialize coaching session:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    initializeSession();
  }, []);

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