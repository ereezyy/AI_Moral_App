import React from 'react';
import { Brain, Heart, AlertCircle } from 'lucide-react';

type AIResponseProps = {
  response: {
    moralPrinciples: string[];
    recommendation: string;
    considerations: string;
  };
};

export function AIResponse({ response }: AIResponseProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">AI Moral Guidance</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-indigo-600" />
          Key Moral Principles
        </h3>
        <ul className="space-y-2">
          {response.moralPrinciples.map((principle, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="min-w-4 mt-1">•</div>
              <span className="text-gray-600">{principle}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Recommendation</h3>
        <p className="text-gray-600">{response.recommendation}</p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-700">Additional Considerations</h3>
        </div>
        <p className="text-gray-600">{response.considerations}</p>
      </div>
    </div>
  );
}