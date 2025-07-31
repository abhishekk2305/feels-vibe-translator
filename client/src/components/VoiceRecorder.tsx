import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Play, Pause, RotateCcw } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number; // in seconds
}

export default function VoiceRecorder({ 
  onRecordingComplete, 
  maxDuration = 60 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6 text-center space-y-6">
        {/* Recording Indicator */}
        <div className="relative">
          <div className={`
            w-32 h-32 mx-auto rounded-full flex items-center justify-center relative
            ${isRecording 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
              : 'bg-gradient-to-r from-primary to-secondary'
            }
          `}>
            {isRecording ? (
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
            ) : null}
            
            <Mic className={`w-12 h-12 text-white z-10 ${isRecording ? 'animate-bounce' : ''}`} />
          </div>
          
          {isRecording && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="text-2xl font-mono text-white">
          {formatTime(duration)}
          <span className="text-sm text-gray-400 ml-2">/ {formatTime(maxDuration)}</span>
        </div>

        {/* Status Text */}
        <div className="text-center">
          {!isRecording && !audioBlob && (
            <p className="text-gray-400">Tap to start recording your vibe</p>
          )}
          {isRecording && !isPaused && (
            <p className="text-red-400 font-medium">Recording your voice...</p>
          )}
          {isRecording && isPaused && (
            <p className="text-yellow-400 font-medium">Recording paused</p>
          )}
          {audioBlob && (
            <p className="text-green-400 font-medium">Recording complete! Ready to analyze</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              className="gradient-bg text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                onClick={pauseRecording}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <MicOff className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}

          {audioBlob && (
            <>
              <Button
                onClick={playAudio}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={resetRecording}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
        )}
      </CardContent>
    </Card>
  );
}