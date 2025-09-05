
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { loadModels, detectMood } from '../services/moodDetectionService';
import { Mood } from '../types';

interface MoodDetectorModalProps {
  onClose: () => void;
  onMoodDetected: (mood: Mood) => void;
}

type DetectionStatus = 'idle' | 'loadingModels' | 'initializingCamera' | 'ready' | 'detecting' | 'detected' | 'error';

const statusMessages: Record<DetectionStatus, string> = {
  idle: 'Getting things ready...',
  loadingModels: 'Loading AI models... (this may take a moment on first load)',
  initializingCamera: 'Initializing camera...',
  ready: 'Position your face in the center of the frame, ensure good lighting, and click "Detect Mood"',
  detecting: 'Analyzing your expression...',
  detected: 'Mood detected! Curating your personalized feed...',
  error: 'An error occurred.'
};

const moodEmojis: Record<Mood, string> = {
  [Mood.Happy]: '😊',
  [Mood.Sad]: '😢',
  [Mood.Angry]: '😠',
  [Mood.Surprised]: '😲',
  [Mood.Neutral]: '😐',
  [Mood.Calm]: '😌'
};


export const MoodDetectorModal: React.FC<MoodDetectorModalProps> = ({ onClose, onMoodDetected }) => {
  const [status, setStatus] = useState<DetectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [detectedMood, setDetectedMood] = useState<Mood | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startWebcam = useCallback(async () => {
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setStatus('initializingCamera');
            
            // Try different camera configurations for better face detection
            const constraints = [
              // High resolution
              { 
                video: { 
                  width: { ideal: 1280, min: 640 },
                  height: { ideal: 720, min: 480 },
                  facingMode: 'user',
                  frameRate: { ideal: 30 }
                } 
              },
              // Medium resolution
              { 
                video: { 
                  width: { ideal: 640 },
                  height: { ideal: 480 },
                  facingMode: 'user',
                  frameRate: { ideal: 30 }
                } 
              },
              // Basic resolution
              { 
                video: { 
                  width: { ideal: 320 },
                  height: { ideal: 240 },
                  facingMode: 'user'
                } 
              }
            ];

            let stream = null;
            for (const constraint of constraints) {
              try {
                stream = await navigator.mediaDevices.getUserMedia(constraint);
                console.log("Camera initialized with constraints:", constraint);
                break;
              } catch (err) {
                console.log("Failed to initialize camera with constraints:", constraint, err);
                continue;
              }
            }

            if (!stream) {
              throw new Error("Could not initialize camera with any supported configuration.");
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                  console.log("Video metadata loaded:", {
                    videoWidth: videoRef.current?.videoWidth,
                    videoHeight: videoRef.current?.videoHeight
                  });
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
            } else if (err.name === 'NotFoundError') {
                setError("No camera found. Please make sure your camera is connected and not being used by another application.");
            } else if (err.name === 'NotReadableError') {
                setError("Camera is already in use by another application. Please close other applications using the camera.");
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
  
  const resetDetection = () => {
    setError(null);
    setRetryCount(0);
    setDetectedMood(null);
    setStatus('ready');
  };

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
      setDetectedMood(mood);
      setStatus('detected');
      setRetryCount(0); // Reset retry count on success
      setTimeout(() => {
        onMoodDetected(mood);
      }, 2000); // Wait a moment to show success message
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("No face detected")) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);
          
          if (newRetryCount >= 3) {
            setError("Multiple attempts failed. Please check your lighting, position your face clearly in the center, and ensure you're not wearing glasses or a mask that might interfere with detection.");
            setStatus('error');
          } else {
            setError(`No face detected (attempt ${newRetryCount}/3). Please make sure your face is clearly visible, well-lit, and positioned in the center of the frame.`);
            setStatus('ready'); // Allow retry
          }
        } else {
          setError(err.message);
          setStatus('error');
        }
      } else {
        setError("An unknown error occurred during mood detection.");
        setStatus('error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Detect Your Mood</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            {/* Face positioning guide */}
            {status === 'ready' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white border-dashed rounded-full opacity-50"></div>
                <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  Position your face in the circle
                </div>
              </div>
            )}
            
            {/* Loading overlay */}
            {status !== 'ready' && status !== 'detecting' && status !== 'detected' &&
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  {status === 'loadingModels' || status === 'initializingCamera' ? 
                    <div className="text-center">
                      <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-white text-sm">{statusMessages[status]}</p>
                    </div>
                  : null}
              </div>
            }
            
            {/* Detection overlay */}
            {status === 'detecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="text-center">
                  <svg className="animate-pulse h-12 w-12 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p className="text-white text-sm">Analyzing your expression...</p>
                </div>
              </div>
            )}
            
            {/* Success overlay */}
            {status === 'detected' && detectedMood && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-90">
                <div className="text-center">
                  <div className="text-6xl mb-4">{moodEmojis[detectedMood]}</div>
                  <p className="text-white text-lg font-semibold">Mood Detected: {detectedMood}</p>
                  <p className="text-white text-sm mt-2">Curating your personalized feed...</p>
                </div>
              </div>
            )}
        </div>
        
        <div className="text-center mb-6">
          {error ? (
            <div className="text-red-400 bg-red-900 bg-opacity-20 p-4 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <p className="text-gray-300 min-h-[40px] flex items-center justify-center">
              {statusMessages[status]}
            </p>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          {status === 'error' && (
            <button 
              onClick={resetDetection} 
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Try Again
            </button>
          )}
          <button 
            onClick={handleDetectMood} 
            disabled={status !== 'ready'}
            className="px-8 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {status === 'detecting' ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{error && error.includes("No face detected") ? "Try Again" : "Detect Mood"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
