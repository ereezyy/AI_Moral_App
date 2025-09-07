import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { VideoAnalysis, EmotionalState } from '../types/analysis';

interface DetectorCache {
  detector: faceLandmarksDetection.FaceLandmarksDetector | null;
  initialized: boolean;
  error: string | null;
}

const detectorCache: DetectorCache = {
  detector: null,
  initialized: false,
  error: null
};

// Performance monitoring
const performanceMetrics = {
  initTime: 0,
  avgAnalysisTime: 0,
  totalAnalyses: 0
};

export async function initializeVideoAnalysis(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
  // Return cached detector if available
  if (detectorCache.initialized && detectorCache.detector) {
    console.log('Using cached face landmarks detector');
    return detectorCache.detector;
  }

  // If previous initialization failed, throw cached error
  if (detectorCache.error) {
    throw new Error(`Previous initialization failed: ${detectorCache.error}`);
  }

  const startTime = performance.now();

  try {
    // Ensure TensorFlow.js backend is ready
    if (!tf.ready()) {
      console.log('Initializing TensorFlow.js backend...');
      await tf.setBackend('webgl');
      await tf.ready();
      console.log(`TensorFlow.js backend ready: ${tf.getBackend()}`);
    }

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CPU backend');
      await tf.setBackend('cpu');
      await tf.ready();
    }

    console.log('Creating face landmarks detector...');
    
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig: faceLandmarksDetection.DetectorConfig = {
      runtime: 'tfjs',
      maxFaces: 1,
      refineLandmarks: true,
      staticImageMode: false // Optimized for video streams
    };

    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    
    // Cache successful initialization
    detectorCache.detector = detector;
    detectorCache.initialized = true;
    detectorCache.error = null;

    const initTime = performance.now() - startTime;
    performanceMetrics.initTime = initTime;
    
    console.log(`Face landmarks detector initialized successfully in ${initTime.toFixed(2)}ms`);
    console.log('Model info:', {
      maxFaces: detectorConfig.maxFaces,
      runtime: detectorConfig.runtime,
      refineLandmarks: detectorConfig.refineLandmarks
    });

    return detector;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    detectorCache.error = errorMessage;
    detectorCache.initialized = false;
    
    console.error('Failed to initialize face landmarks detector:', error);
    
    // Try fallback initialization with reduced features
    try {
      console.log('Attempting fallback initialization...');
      const fallbackConfig: faceLandmarksDetection.DetectorConfig = {
        runtime: 'tfjs',
        maxFaces: 1,
        refineLandmarks: false // Disable iris landmarks for performance
      };
      
      const fallbackDetector = await faceLandmarksDetection.createDetector(model, fallbackConfig);
      detectorCache.detector = fallbackDetector;
      detectorCache.initialized = true;
      detectorCache.error = null;
      
      console.log('Fallback detector initialized successfully');
      return fallbackDetector;
    } catch (fallbackError) {
      console.error('Fallback initialization also failed:', fallbackError);
      throw new Error(`Face landmarks detection unavailable: ${errorMessage}`);
    }
  }
}

export async function analyzeVideoFrame(
  videoElement: HTMLVideoElement,
  detector: faceLandmarksDetection.FaceLandmarksDetector
): Promise<VideoAnalysis | null> {
  if (!detector) {
    console.warn('Detector not available for frame analysis');
    return null;
  }

  // Check video readiness
  if (videoElement.readyState < 2) {
    return null;
  }

  const startTime = performance.now();

  try {
    const estimationConfig: faceLandmarksDetection.EstimationConfig = {
      flipHorizontal: false,
      staticImageMode: false
    };
    
    const faces = await detector.estimateFaces(videoElement, estimationConfig);
    
    if (faces.length === 0) {
      return {
        facialExpression: getNeutralEmotionalState(),
        attentiveness: 0,
        environmentalContext: ['no_face_detected']
      };
    }

    const face = faces[0];
    const analysisTime = performance.now() - startTime;
    
    // Update performance metrics
    performanceMetrics.totalAnalyses++;
    performanceMetrics.avgAnalysisTime = 
      (performanceMetrics.avgAnalysisTime * (performanceMetrics.totalAnalyses - 1) + analysisTime) 
      / performanceMetrics.totalAnalyses;

    // Log performance every 100 analyses
    if (performanceMetrics.totalAnalyses % 100 === 0) {
      console.log('Video analysis performance:', {
        avgTime: `${performanceMetrics.avgAnalysisTime.toFixed(2)}ms`,
        totalAnalyses: performanceMetrics.totalAnalyses,
        lastAnalysisTime: `${analysisTime.toFixed(2)}ms`
      });
    }

    return {
      facialExpression: await analyzeEmotionalStateAdvanced(face),
      attentiveness: calculateAttentivenessAdvanced(face),
      environmentalContext: analyzeEnvironmentalContextAdvanced(videoElement, face)
    };
  } catch (error) {
    console.error('Frame analysis error:', error);
    return null;
  }
}

async function analyzeEmotionalStateAdvanced(face: faceLandmarksDetection.AnnotatedPrediction): Promise<EmotionalState> {
  try {
    const keypoints = face.keypoints;
    if (!keypoints || keypoints.length === 0) {
      return getNeutralEmotionalState();
    }

    // Key facial landmarks for emotion detection
    const leftEyeCorner = keypoints[33]; // Left eye outer corner
    const rightEyeCorner = keypoints[263]; // Right eye outer corner
    const leftMouth = keypoints[61]; // Left mouth corner
    const rightMouth = keypoints[291]; // Right mouth corner
    const noseTip = keypoints[1]; // Nose tip
    const upperLip = keypoints[13]; // Upper lip center
    const lowerLip = keypoints[14]; // Lower lip center

    // Calculate facial geometry ratios
    const mouthWidth = Math.abs(leftMouth.x - rightMouth.x);
    const eyeDistance = Math.abs(leftEyeCorner.x - rightEyeCorner.x);
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);
    
    // Smile detection (mouth corners relative to mouth center)
    const mouthCenterY = (leftMouth.y + rightMouth.y) / 2;
    const mouthCenterExpected = (upperLip.y + lowerLip.y) / 2;
    const smileIntensity = Math.max(0, (mouthCenterExpected - mouthCenterY) / mouthHeight);

    // Eye openness (simplified)
    const eyeOpenness = Math.min(1, mouthWidth / eyeDistance * 2);

    // Emotional state calculation
    const joy = Math.min(1, smileIntensity * 2);
    const surprise = Math.min(1, Math.max(0, eyeOpenness - 0.7) * 3);
    const sadness = Math.max(0, 0.5 - smileIntensity);
    const anger = Math.max(0, Math.min(0.3, (0.3 - eyeOpenness) * 2));
    const fear = Math.max(0, Math.min(0.2, surprise * 0.3));
    const neutral = Math.max(0.1, 1 - (joy + surprise + sadness + anger + fear));

    return {
      joy: Math.min(1, joy),
      sadness: Math.min(1, sadness),
      anger: Math.min(1, anger),
      fear: Math.min(1, fear),
      surprise: Math.min(1, surprise),
      neutral: Math.min(1, neutral)
    };
  } catch (error) {
    console.warn('Advanced emotion analysis failed, using neutral state:', error);
    return getNeutralEmotionalState();
  }
}

function calculateAttentivenessAdvanced(face: faceLandmarksDetection.AnnotatedPrediction): number {
  try {
    const keypoints = face.keypoints;
    if (!keypoints || keypoints.length === 0) return 0;

    // Eye landmarks for gaze estimation
    const leftEyeCenter = keypoints[468]; // Left eye center (iris)
    const rightEyeCenter = keypoints[473]; // Right eye center (iris)
    const noseTip = keypoints[1];
    
    if (!leftEyeCenter || !rightEyeCenter || !noseTip) {
      return 0.5; // Default medium attention
    }

    // Calculate head pose (simplified)
    const eyeCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const faceCenterX = noseTip.x;
    
    // Attention based on gaze direction (looking forward = high attention)
    const gazeDeviation = Math.abs(eyeCenterX - faceCenterX);
    const attentiveness = Math.max(0, 1 - gazeDeviation * 5);
    
    // Factor in face confidence
    const faceScore = face.faceInViewConfidence || 1;
    
    return Math.min(1, attentiveness * faceScore);
  } catch (error) {
    console.warn('Advanced attentiveness calculation failed:', error);
    return 0.5;
  }
}

function analyzeEnvironmentalContextAdvanced(
  video: HTMLVideoElement,
  face: faceLandmarksDetection.AnnotatedPrediction
): string[] {
  const context: string[] = [];
  
  try {
    // Video quality assessment
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    if (videoWidth >= 1280) context.push('high_resolution');
    else if (videoWidth >= 640) context.push('medium_resolution');
    else context.push('low_resolution');
    
    // Face size relative to frame (indicates distance)
    if (face.box) {
      const faceArea = face.box.width * face.box.height;
      const frameArea = videoWidth * videoHeight;
      const faceRatio = faceArea / frameArea;
      
      if (faceRatio > 0.15) context.push('close_distance');
      else if (faceRatio > 0.05) context.push('medium_distance');
      else context.push('far_distance');
    }
    
    // Face position in frame
    if (face.box) {
      const centerX = face.box.xMin + face.box.width / 2;
      const centerY = face.box.yMin + face.box.height / 2;
      const frameCenter = { x: videoWidth / 2, y: videoHeight / 2 };
      
      const offsetX = Math.abs(centerX - frameCenter.x) / frameCenter.x;
      const offsetY = Math.abs(centerY - frameCenter.y) / frameCenter.y;
      
      if (offsetX < 0.2 && offsetY < 0.2) context.push('centered');
      else context.push('off_center');
    }
    
    // Lighting estimation (simplified)
    const faceScore = face.faceInViewConfidence || 0;
    if (faceScore > 0.8) context.push('well_lit');
    else if (faceScore > 0.5) context.push('moderate_lighting');
    else context.push('poor_lighting');
    
    // Default indoor assumption (could be enhanced with background analysis)
    context.push('indoor');
    
    return context;
  } catch (error) {
    console.warn('Environmental context analysis failed:', error);
    return ['indoor', 'unknown_lighting', 'unknown_distance'];
  }
}

function getNeutralEmotionalState(): EmotionalState {
  return {
    joy: 0.1,
    sadness: 0.1,
    anger: 0.1,
    fear: 0.1,
    surprise: 0.1,
    neutral: 0.5
  };
}

// Cleanup function for memory management
export function cleanupVideoAnalysis(): void {
  if (detectorCache.detector) {
    // TensorFlow.js detectors don't have explicit cleanup, but we can clear references
    detectorCache.detector = null;
    detectorCache.initialized = false;
    detectorCache.error = null;
    console.log('Video analysis detector cache cleared');
  }
}

// Performance metrics getter
export function getPerformanceMetrics() {
  return { ...performanceMetrics };
}

// Health check function
export function isVideoAnalysisReady(): boolean {
  return detectorCache.initialized && detectorCache.detector !== null;
}