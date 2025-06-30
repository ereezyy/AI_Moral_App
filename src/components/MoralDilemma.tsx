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
}) {
  const [response, setResponse] = React.useState('');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">{dilemma.question}</h2>
      </div>
      
      <p className="text-gray-600 mb-4">{dilemma.context}</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Key Considerations
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {dilemma.considerations.map((point, index) => (
            <li key={index} className="text-gray-600">{point}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
          Share your thoughts
        </label>
        <textarea
          id="response"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="What do you think about this situation?"
        />
      </div>

      <button
        onClick={() => onSubmit(response)}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Get AI Guidance
      </button>
    </div>
  );
}