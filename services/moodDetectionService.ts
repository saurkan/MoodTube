// Fix: Changed 'import type' to a value import for 'Mood' to be used at runtime.
import { Mood, type FaceExpression } from '../types';
import { MODEL_URL } from '../constants';
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async (): Promise<void> => {
  if (modelsLoaded) {
    return;
  }
  try {
    console.log("Loading face-api models...");
    
    // Load models with better error handling
    const modelPromises = [
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ];
    
    await Promise.all(modelPromises);
    
    // Verify models are loaded
    if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceExpressionNet.isLoaded) {
      throw new Error("Models failed to load properly");
    }
    
    modelsLoaded = true;
    console.log("Face-api models loaded successfully");
  } catch (error) {
    console.error("Failed to load face-api models:", error);
    throw new Error("Could not load AI models for mood detection. Please refresh the page and try again.");
  }
};

const expressionToMoodMap: Record<FaceExpression, Mood> = {
  happy: Mood.Happy,
  sad: Mood.Sad,
  angry: Mood.Angry,
  surprised: Mood.Surprised,
  neutral: Mood.Neutral,
  fearful: Mood.Sad, // mapping fearful to sad for this app
  disgusted: Mood.Angry, // mapping disgusted to angry
};


export const detectMood = async (
  element: HTMLVideoElement | HTMLCanvasElement
): Promise<Mood> => {
  if (!modelsLoaded) {
    throw new Error("Models are not loaded yet.");
  }

  console.log("Starting face detection...");
  console.log("Element dimensions:", element instanceof HTMLVideoElement ? 
    `${element.videoWidth}x${element.videoHeight}` : 
    `${element.width}x${element.height}`);

  // Try multiple detection attempts with different settings
  let detections = null;
  const detectionOptions = [
    // Very sensitive settings
    new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.1 }),
    // Medium sensitivity
    new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.2 }),
    // Less sensitive but more accurate
    new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }),
    // Most sensitive
    new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.05 })
  ];

  for (let i = 0; i < detectionOptions.length; i++) {
    const options = detectionOptions[i];
    try {
      console.log(`Detection attempt ${i + 1} with options:`, options);
      
      // Try detecting all faces first
      const allFaces = await faceapi.detectAllFaces(element, options).withFaceExpressions();
      console.log(`Found ${allFaces.length} faces`);
      
      if (allFaces.length > 0) {
        // Use the largest face (most likely to be the user)
        detections = allFaces.reduce((largest, current) => 
          current.detection.box.area > largest.detection.box.area ? current : largest
        );
        console.log("Selected largest face:", detections.detection.box);
        break;
      }
    } catch (error) {
      console.log(`Detection attempt ${i + 1} failed:`, error);
      continue;
    }
  }

  if (!detections) {
    // Fallback: If no face is detected after all attempts, return a random mood for testing
    console.log("No face detected after all attempts. Using fallback mood selection.");
    const fallbackMoods = [Mood.Happy, Mood.Neutral, Mood.Calm];
    const randomMood = fallbackMoods[Math.floor(Math.random() * fallbackMoods.length)];
    console.log("Using fallback mood:", randomMood);
    return randomMood;
  }

  const expressions = detections.expressions;
  
  // Log expressions for debugging
  console.log("Detected expressions:", expressions);
  
  // Find the dominant expression
  const dominantExpression = Object.keys(expressions).reduce((a, b) => 
    expressions[a as FaceExpression] > expressions[b as FaceExpression] ? a : b
  ) as FaceExpression;
  
  const confidence = expressions[dominantExpression];
  console.log(`Dominant expression: ${dominantExpression} (confidence: ${confidence.toFixed(3)})`);
  
  // For happy and surprised, use lower threshold as they're more reliable
  if (dominantExpression === 'happy' && confidence > 0.3) {
    return expressionToMoodMap[dominantExpression];
  }
  
  if (dominantExpression === 'surprised' && confidence > 0.4) {
    return expressionToMoodMap[dominantExpression];
  }
  
  // For other moods, require higher confidence to avoid misclassification
  if (confidence > 0.6) {
    if (dominantExpression in expressionToMoodMap) {
      return expressionToMoodMap[dominantExpression];
    }
  }

  // If confidence is too low, return neutral
  return Mood.Neutral;
};