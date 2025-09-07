import React from 'react';
import { MessageSquare, Brain, Scale, Heart } from 'lucide-react';

type Dilemma = {
  question: string;
  context: string;
  considerations: string[];
};

export function MoralDilemma({ dilemma, onSubmit }: { 
  dilemma: Dilemma;
  onSubmit: (response: string) => void;
  isProcessing?: boolean;
}) {
  const [response, setResponse] = React.useState('');

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response.trim());
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">{dilemma.question}</h2>
      </div>
      
      <p className="text-gray-600 mb-6">{dilemma.context}</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          AI Analysis Features
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {dilemma.considerations.map((point, index) => (
            <li key={index} className="text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-3">
          Describe your situation or dilemma
        </label>
        <textarea
          id="response"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="e.g., 'I have to choose between being honest with my friend about something difficult, or protecting their feelings...'"
          disabled={isProcessing}
        />
        <p className="text-sm text-gray-500 mt-2">
          Be as detailed as possible for more accurate guidance
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!response.trim() || isProcessing}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Analyzing...
          </>
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            Get AI Moral Guidance
          </>
        )}
      </button>
    </div>
  );
}