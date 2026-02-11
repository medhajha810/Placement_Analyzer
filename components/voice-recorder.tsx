"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  questionId: string;
}

export default function VoiceRecorder({ onRecordingComplete, questionId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mode, setMode] = useState<"voice" | "text">("voice");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecognitionActive = useRef(false);

  useEffect(() => {
    // Setup speech recognition on component mount
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart;
            } else {
              interimTranscript += transcriptPart;
            }
          }
          
          setTranscript(prev => {
            const new_transcript = prev + finalTranscript;
            return new_transcript;
          });
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access for voice transcription.');
          }
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          if (isRecognitionActive.current && isRecording) {
            // Restart recognition if we're still recording
            setTimeout(() => {
              if (isRecognitionActive.current) {
                try {
                  recognition.start();
                } catch (e) {
                  console.log('Recognition restart failed:', e);
                }
              }
            }, 100);
          }
        };
        
        recognitionRef.current = recognition;
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (recognitionRef.current) {
        isRecognitionActive.current = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [audioUrl, isRecording]);

  const startRecording = async () => {
    try {
      // Check for getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm' 
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording failed. Please try again.');
        setIsRecording(false);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript(""); // Clear previous transcript
      
      // Start speech recognition
      if (recognitionRef.current && mode === "voice") {
        try {
          isRecognitionActive.current = true;
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition failed to start:', e);
        }
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      
      let errorMessage = 'Could not access microphone.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow microphone access and reload the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is busy. Please check if another app is using it.';
      } else if (error.message.includes('not supported')) {
        errorMessage = 'Voice recording not supported on this browser. Try Chrome or Firefox.';
      }
      
      alert(errorMessage);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop speech recognition
      if (recognitionRef.current && isRecognitionActive.current) {
        isRecognitionActive.current = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setRecordingTime(0);
      setTranscript("");
    }
  };

  const handleSubmit = async () => {
    console.log("Submit clicked - mode:", mode, "audioUrl:", !!audioUrl, "transcript length:", transcript.length);
    
    if (mode === "text" && !transcript.trim()) {
      alert("Please type your answer");
      return;
    }

    if (mode === "voice" && !audioUrl) {
      alert("Please record your answer first");
      return;
    }

    try {
      // Convert audio URL to blob if voice mode
      let audioBlob: Blob | null = null;
      if (mode === "voice" && audioUrl) {
        const response = await fetch(audioUrl);
        audioBlob = await response.blob();
        console.log("Audio blob created:", audioBlob.size, "bytes");
      }

      console.log("Calling onRecordingComplete with:", {
        audioBlob: !!audioBlob,
        transcript: transcript || "Voice answer recorded"
      });
      
      onRecordingComplete(audioBlob!, transcript || "Voice answer recorded");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Failed to process your answer. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Mode Selector */}
        <div className="flex gap-2">
          <Button
            variant={mode === "voice" ? "default" : "outline"}
            onClick={() => setMode("voice")}
            className="flex-1"
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice Answer
          </Button>
          <Button
            variant={mode === "text" ? "default" : "outline"}
            onClick={() => setMode("text")}
            className="flex-1"
          >
            Text Answer
          </Button>
        </div>

        {mode === "voice" ? (
          <>
            {/* Voice Recording Controls */}
            <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              {!isRecording && !audioUrl && (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="rounded-full w-16 h-16"
                >
                  <Mic className="h-6 w-6" />
                </Button>
              )}

              {isRecording && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={pauseRecording}
                    className="rounded-full w-12 h-12"
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </Button>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 items-center mb-2">
                      <Badge variant="destructive" className="animate-pulse">
                        Recording
                      </Badge>
                      {isListening && (
                        <Badge variant="secondary" className="animate-pulse bg-green-100 text-green-800">
                          Listening
                        </Badge>
                      )}
                    </div>
                    <span className="text-2xl font-mono font-bold">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopRecording}
                    className="rounded-full w-12 h-12"
                  >
                    <Square className="h-5 w-5" />
                  </Button>
                </>
              )}

              {audioUrl && !isRecording && (
                <>
                  <audio controls src={audioUrl} className="flex-1 max-w-md" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={deleteRecording}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {audioUrl && (
              <>
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Recording duration: {formatTime(recordingTime)}
                </p>
                {transcript && (
                  <div className="bg-slate-50 p-3 rounded border">
                    <p className="text-sm font-medium mb-1">Live Transcript:</p>
                    <p className="text-sm text-slate-700">{transcript}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {transcript.split(' ').filter(w => w).length} words
                    </p>
                  </div>
                )}
              </>
            )}
            
            {isRecording && transcript && (
              <div className="bg-blue-50 p-3 rounded border">
                <p className="text-sm font-medium mb-1">Live Transcript:</p>
                <p className="text-sm text-slate-700">{transcript}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {transcript.split(' ').filter(w => w).length} words
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Text Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type your answer:</label>
              <Textarea
                placeholder="Write your detailed answer here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {transcript.split(' ').filter(w => w).length} words
              </p>
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={(mode === "voice" && !audioUrl && !transcript.trim()) || (mode === "text" && !transcript.trim())}
          className="w-full"
          size="lg"
        >
          Submit Answer for AI Analysis {transcript && `(${transcript.split(' ').filter(w => w).length} words)`}
        </Button>
      </CardContent>
    </Card>
  );
}
