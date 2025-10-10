import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff } from 'lucide-react';
import { conversationService } from '../lib/services/conversation.service';
import { mediaPipeService } from '../lib/services/mediapipe.service';

export function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [messages, setMessages] = useState(conversationService.getCurrentMessages());
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    mediaPipeService.initialize().catch(err => {
      console.error('Failed to initialize MediaPipe:', err);
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      conversationService.stopVoiceInput();
      setIsListening(false);
      setTranscript('');
    } else {
      try {
        setError(null);
        await conversationService.sendVoiceMessage((text, isFinal) => {
          setTranscript(text);

          if (isFinal) {
            setMessages(conversationService.getCurrentMessages());
            setTranscript('');

            const lastMessage = conversationService.getCurrentMessages().slice(-1)[0];
            if (lastMessage && lastMessage.role === 'assistant') {
              setIsSpeaking(true);
              conversationService
                .speakMessage(lastMessage.content)
                .then(() => setIsSpeaking(false))
                .catch(err => {
                  console.error('Speech synthesis error:', err);
                  setIsSpeaking(false);
                });
            }
          }
        });
        setIsListening(true);
      } catch (err) {
        setError('Failed to start voice recognition. Please check microphone permissions.');
        console.error(err);
      }
    }
  };

  const toggleVideo = async () => {
    if (videoEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      conversationService.enableVideoAnalysis(false);
      setVideoEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        conversationService.enableVideoAnalysis(true);
        setVideoEnabled(true);
      } catch (err) {
        setError('Failed to access camera. Please check permissions.');
        console.error(err);
      }
    }
  };

  const sendTextMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setError(null);
      const response = await conversationService.sendMessage(content, {
        useVideoAnalysis: videoEnabled,
        videoElement: videoRef.current || undefined
      });

      setMessages(conversationService.getCurrentMessages());

      setIsSpeaking(true);
      await conversationService.speakMessage(response.content);
      setIsSpeaking(false);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2">AI Life Partner</h1>
        <p className="text-slate-300">Real-time voice & video conversation with advanced AI</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white backdrop-blur-lg'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {msg.role === 'user' ? 'You' : 'AI Partner'}
              </p>
              <p className="leading-relaxed">{msg.content}</p>
              {msg.videoAnalysis?.faceDetected && (
                <div className="mt-3 pt-3 border-t border-white/20 text-xs">
                  <p className="opacity-70">
                    Emotion: {Object.entries(msg.videoAnalysis.facialExpression)
                      .sort(([, a], [, b]) => b - a)[0][0]} •
                    Attention: {(msg.videoAnalysis.attentiveness * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-2xl px-6 py-4 rounded-2xl bg-blue-600/50 text-white">
              <p className="text-sm opacity-70 mb-1">Listening...</p>
              <p className="leading-relaxed">{transcript}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/30 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          {videoEnabled && (
            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={toggleListening}
              className={`p-4 rounded-full transition-all ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                videoEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={videoEnabled ? 'Disable video' : 'Enable video analysis'}
            >
              {videoEnabled ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>

            {isSpeaking && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 rounded-full">
                <Volume2 className="w-5 h-5 text-purple-300 animate-pulse" />
                <span className="text-sm text-purple-200">Speaking...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
