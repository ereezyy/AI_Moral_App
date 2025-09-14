import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, Activity, Zap, Eye } from 'lucide-react';
import { VideoAnalysis } from '../types/analysis';
import { 
  initializeVideoAnalysis, 
  analyzeVideoFrame, 
  cleanupVideoAnalysis,
  getPerformanceMetrics,
  isVideoAnalysisReady
} from '../utils/videoAnalysis';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

interface VideoAnalyzerProps {
  onAnalysis: (analysis: VideoAnalysis) => void;
}

export function VideoAnalyzer({ onAnalysis }: VideoAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detector, setDetector] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [performanceInfo, setPerformanceInfo] = useState({ avgTime: 0, totalAnalyses: 0 });
  const [lastAnalysis, setLastAnalysis] = useState<VideoAnalysis | null>(null);

  // Initialize video and detector
  useEffect(() => {
    async function setupVideo() {
      setIsInitializing(true);
      setError(null);

      try {
        // Request camera access
        console.log('Requesting camera access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          console.log('Camera stream established');
        }

        // Initialize face detection
        console.log('Initializing face landmarks detector...');
        const faceDetector = await initializeVideoAnalysis();
        setDetector(faceDetector);
        setIsAnalyzing(true);
        
        console.log('Video analysis setup complete');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Video setup failed:', err);
        
        if (errorMessage.includes('Permission denied')) {
          setError('Camera permission denied. Please allow camera access and refresh.');
        } else if (errorMessage.includes('NotFoundError')) {
          setError('No camera found. Please connect a camera and refresh.');
        } else if (errorMessage.includes('Face landmarks detection unavailable')) {
          setError('AI models failed to load. Check your internet connection.');
        } else {
          setError(`Setup failed: ${errorMessage}`);
        }
      } finally {
        setIsInitializing(false);
      }
    }

    setupVideo();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cleanupVideoAnalysis();
    };
  }, []); // Empty dependency array - run once on mount

  // Analysis loop
  useEffect(() => {
    if (!isAnalyzing || !videoRef.current || !detector) return;

    let analysisInterval: number;
    let isProcessing = false;

    const runAnalysis = async () => {
      if (isProcessing || !videoRef.current) return;
      
      isProcessing = true;
      
      try {
        const analysis = await analyzeVideoFrame(videoRef.current, detector);
        if (analysis) {
          setLastAnalysis(analysis);
          onAnalysis(analysis);
          
          // Update performance info periodically
          const metrics = getPerformanceMetrics();
          setPerformanceInfo({
            avgTime: Math.round(metrics.avgAnalysisTime * 100) / 100,
            totalAnalyses: metrics.totalAnalyses
          });
        }
      } catch (err) {
        console.error('Analysis failed:', err);
      } finally {
        isProcessing = false;
      }
    };

    // Start analysis loop (every 500ms for performance)
    analysisInterval = window.setInterval(runAnalysis, 500);

    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [isAnalyzing, detector, onAnalysis]);

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isInitializing) return 'text-yellow-500';
    if (isAnalyzing && isVideoAnalysisReady()) return 'text-green-500';
    return 'text-gray-400';
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-6 h-6" />;
    if (isInitializing) return <Activity className="w-6 h-6 animate-spin" />;
    if (isAnalyzing) return <Eye className="w-6 h-6" />;
    return <Camera className="w-6 h-6" />;
  };

  return (
    <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Video Analysis</h2>
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {error ? 'Error' : 
             isInitializing ? 'Initializing...' : 
             isAnalyzing ? 'Analyzing' : 'Stopped'}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-lg overflow-hidden bg-gray-900 dark:bg-gray-800 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
            onLoadedMetadata={() => console.log('Video metadata loaded')}
          />
          
          {/* Overlay canvas for debugging (optional) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-30"
            width={640}
            height={480}
          />

          {/* Loading overlay */}
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 dark:bg-gray-800/70">
              <div className="bg-background p-4 rounded-lg flex items-center gap-3 border border-border">
                <Activity className="w-6 h-6 text-primary animate-spin" />
                <div>
                  <div className="font-medium text-foreground">Initializing AI Models</div>
                  <div className="text-sm text-muted-foreground">Loading face detection...</div>
                </div>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 dark:bg-gray-800/70">
              <div className="bg-background p-4 rounded-lg max-w-sm border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-6 h-6 text-error" />
                  <span className="font-medium text-error">Setup Failed</span>
                </div>
                <p className="text-sm text-foreground">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status indicators */}
        {isAnalyzing && !error && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Performance metrics */}
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">Performance</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Avg: {performanceInfo.avgTime}ms | Total: {performanceInfo.totalAnalyses}
              </div>
            </div>

            {/* Last analysis preview */}
            {lastAnalysis && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Detection</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Attention: {Math.round(lastAnalysis.attentiveness * 100)}% | 
                  Joy: {Math.round(lastAnalysis.facialExpression.joy * 100)}%
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}