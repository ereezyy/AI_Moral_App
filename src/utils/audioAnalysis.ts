import * as speechCommands from '@tensorflow-models/speech-commands';

let recognizer: speechCommands.SpeechCommandRecognizer | null = null;

export async function initializeAudioAnalysis() {
  try {
    recognizer = speechCommands.create('BROWSER_FFT');
    await recognizer.ensureModelLoaded();
    console.log('Audio analysis model loaded');
    return true;
  } catch (error) {
    console.error('Failed to initialize audio analysis:', error);
    return false;
  }
}

export async function startAudioMonitoring(
  onResult: (result: { scores: Float32Array }) => void
) {
  if (!recognizer) {
    throw new Error('Audio analysis not initialized');
  }

  await recognizer.listen(
    (result) => {
      onResult(result);
    },
    {
      includeSpectrogram: true,
      probabilityThreshold: 0.75,
    }
  );
}