
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { loadModels, detectMood } from '../services/moodDetectionService';
import type { Mood } from '../types';

interface MoodDetectorModalProps {
  onClose: () => void;
  onMoodDetected: (mood: Mood) => void;
}

type DetectionStatus = 'idle' | 'loadingModels' | 'initializingCamera' | 'ready' | 'detecting' | 'detected' | 'error';

const statusMessages: Record<DetectionStatus, string> = {
  idle: 'Getting things ready...',
  loadingModels: 'Loading AI models... (this may take a moment on first load)',
  initializingCamera: 'Initializing camera...',
  ready: 'Position your face in the frame and capture your mood.',
  detecting: 'Analyzing your expression...',
  detected: 'Mood detected! Curating your feed...',
  error: 'An error occurred.'
};


export const MoodDetectorModal: React.FC<MoodDetectorModalProps> = ({ onClose, onMoodDetected }) => {
  const [status, setStatus] = useState<DetectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startWebcam = useCallback(async () => {
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setStatus('initializingCamera');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                  setStatus('ready');
                }
            }
        } else {
            throw new Error("Your browser does not support webcam access.");
        }
    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                setError("Camera access was denied. Please allow camera permissions in your browser settings to use this feature.");
            } else {
                setError(`Failed to access webcam: ${err.message}`);
            }
        } else {
            setError("An unknown error occurred while accessing the webcam.");
        }
        setStatus('error');
    }
  }, []);

  useEffect(() => {
    async function initialize() {
        setStatus('loadingModels');
        try {
            await loadModels();
            await startWebcam();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during initialization.");
            }
            setStatus('error');
        }
    }
    initialize();
    
    return () => {
        // Cleanup: stop webcam stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [startWebcam]);
  
  const handleDetectMood = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setStatus('detecting');
    setError(null);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      setError("Could not get canvas context.");
      setStatus('error');
      return;
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      const mood = await detectMood(canvas);
      setStatus('detected');
      setTimeout(() => {
        onMoodDetected(mood);
      }, 1500); // Wait a moment to show success message
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during mood detection.");
      }
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-white">Detect Your Mood</h2>
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden mb-4">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {status !== 'ready' && status !== 'detecting' && status !== 'detected' &&
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  {status === 'loadingModels' || status === 'initializingCamera' ? 
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  : null}
              </div>
            }
        </div>
        <p className="text-center text-zinc-300 min-h-[40px] flex items-center justify-center">
            {error ? <span className="text-red-400">{error}</span> : statusMessages[status]}
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-zinc-600 hover:bg-zinc-500 text-white font-semibold transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleDetectMood} 
            disabled={status !== 'ready'}
            className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {status === 'detecting' ? 'Analyzing...' : 'Capture Mood'}
          </button>
        </div>
      </div>
    </div>
  );
};
