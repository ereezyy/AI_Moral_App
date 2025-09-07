import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { VideoAnalysis } from '../types/analysis';
import { initializeVideoAnalysis, analyzeVideoFrame } from '../utils/videoAnalysis';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export function VideoAnalyzer({ 
  onAnalysis 
}: { 
  onAnalysis: (analysis: VideoAnalysis) => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detector, setDetector] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);

  useEffect(() => {
    async function setupVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const initializedDetector = await initializeVideoAnalysis();
          setDetector(initializedDetector);
          setIsAnalyzing(true);
        }
      } catch (err) {
        setError('Failed to access camera');
        console.error(err);
      }
    }

    setupVideo();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isAnalyzing || !videoRef.current || !detector) return;

    const analyzeInterval = setInterval(async () => {
      const analysis = await analyzeVideoFrame(videoRef.current!, detector);
      if (analysis) {
        onAnalysis(analysis);
      }
    }, 1000);

    return () => clearInterval(analyzeInterval);
  }, [isAnalyzing, onAnalysis, detector]);

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover"
        />
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <div className="bg-white rounded-full p-2 shadow-lg">
          <Camera className={`w-6 h-6 ${isAnalyzing ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
      </div>
    </div>
  );
}