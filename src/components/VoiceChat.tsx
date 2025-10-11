import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff, Send } from 'lucide-react';
import { conversationService } from '../lib/services/conversation.service';
import { mediaPipeService } from '../lib/services/mediapipe.service';

export function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [messages, setMessages] = useState(conversationService.getCurrentMessages());
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

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
      setTextInput('');
      const response = await conversationService.sendMessage(content, {
        useVideoAnalysis: videoEnabled,
        videoElement: videoRef.current || undefined
      });

      setMessages(conversationService.getCurrentMessages());

      setIsSpeaking(true);
      await conversationService.speakMessage(response.content);
      setIsSpeaking(false);
    } catch (err) {
      console.error('Send message error:', err);
      setIsSpeaking(false);
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendTextMessage(textInput);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Life Partner</h1>
        <p className="text-muted-foreground">Real-time voice & video conversation with advanced AI</p>
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
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border'
              }`}
            >
              <p className="text-sm font-semibold mb-1 opacity-90">
                {msg.role === 'user' ? 'You' : 'AI Partner'}
              </p>
              <p className="leading-relaxed">{msg.content}</p>
              {msg.videoAnalysis?.faceDetected && (
                <div className="mt-3 pt-3 border-t border-border text-xs">
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
            <div className="max-w-2xl px-6 py-4 rounded-2xl bg-primary/50 text-primary-foreground border border-primary">
              <p className="text-sm opacity-70 mb-1">Listening...</p>
              <p className="leading-relaxed">{transcript}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-lg bg-error/20 border border-error/50 text-error">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-muted/30 backdrop-blur-xl border-t border-border">
        <div className="max-w-4xl mx-auto space-y-4">
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

          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isListening || isSpeaking}
            />

            <button
              type="submit"
              disabled={!textInput.trim() || isListening || isSpeaking}
              className="p-3 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 transition-all"
              title="Send message"
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </button>

            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-lg transition-all ${
                isListening
                  ? 'bg-error hover:bg-error/90 animate-pulse'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-error-foreground" />
              ) : (
                <Mic className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleVideo}
              className={`p-3 rounded-lg transition-all ${
                videoEnabled
                  ? 'bg-success hover:bg-success/90'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              title={videoEnabled ? 'Disable video' : 'Enable video analysis'}
            >
              {videoEnabled ? (
                <Video className="w-5 h-5 text-success-foreground" />
              ) : (
                <VideoOff className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isSpeaking && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-lg border border-primary/30">
                <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm text-primary">Speaking...</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
