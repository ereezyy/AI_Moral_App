import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { useAudioMonitoring } from '../lib/hooks/useAudioMonitoring';
import type { AudioAnalysis } from '../types/analysis';

interface AudioMonitorProps {
  onAnalysis?: (analysis: AudioAnalysis) => void;
}

export function AudioMonitor({ onAnalysis }: AudioMonitorProps) {
  const { 
    isMonitoring, 
    error, 
    currentAnalysis,
    startMonitoring, 
    stopMonitoring 
  } = useAudioMonitoring(onAnalysis);

  return (
    <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isMonitoring ? (
            <Mic className="w-6 h-6 text-success animate-pulse" />
          ) : (
            <MicOff className="w-6 h-6 text-muted-foreground" />
          )}
          <h2 className="text-xl font-semibold text-foreground">Audio Monitor</h2>
        </div>
        
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`px-4 py-2 rounded-md ${
            isMonitoring 
              ? 'bg-error/10 text-error hover:bg-error/20' 
              : 'bg-success/10 text-success hover:bg-success/20'
          }`}
        >
          {isMonitoring ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 text-error rounded-md flex items-center gap-2 border border-error/20">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isMonitoring && currentAnalysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${currentAnalysis.volume * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <span className="text-sm text-muted-foreground">Clarity</span>
              <div className="text-lg font-semibold text-foreground">
                {(currentAnalysis.clarity * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-muted rounded-md border border-border">
              <span className="text-sm text-muted-foreground">Sentiment</span>
              <div className="text-lg font-semibold text-foreground">
                {(currentAnalysis.sentiment * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent rounded-md border border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Emotional Tone</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(currentAnalysis.emotionalTone).map(([emotion, value]) => (
                <div key={emotion} className="text-center">
                  <div className="text-xs text-muted-foreground capitalize">{emotion}</div>
                  <div className="font-medium text-foreground">{(value * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}