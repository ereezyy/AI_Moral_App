import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { useAudioMonitoring } from '../hooks/useAudioMonitoring';

export function AudioMonitor() {
  const { 
    isMonitoring, 
    error, 
    currentAnalysis,
    startMonitoring, 
    stopMonitoring 
  } = useAudioMonitoring();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isMonitoring ? (
            <Mic className="w-6 h-6 text-green-500 animate-pulse" />
          ) : (
            <MicOff className="w-6 h-6 text-gray-400" />
          )}
          <h2 className="text-xl font-semibold">Audio Monitor</h2>
        </div>
        
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`px-4 py-2 rounded-md ${
            isMonitoring 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isMonitoring && currentAnalysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.volume * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-600">Clarity</span>
              <div className="text-lg font-semibold">
                {(currentAnalysis.clarity * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-600">Sentiment</span>
              <div className="text-lg font-semibold">
                {(currentAnalysis.sentiment * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Emotional Tone</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(currentAnalysis.emotionalTone).map(([emotion, value]) => (
                <div key={emotion} className="text-center">
                  <div className="text-xs text-gray-600 capitalize">{emotion}</div>
                  <div className="font-medium">{(value * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}