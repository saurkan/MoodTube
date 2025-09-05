// Fix: Changed 'import type' to a value import for 'Mood' to be used at runtime.
import { Mood, type FaceExpression } from '../types';
import { MODEL_URL } from '../constants';

// face-api.js is loaded from CDN, so we declare it to satisfy TypeScript
declare const faceapi: any;

let modelsLoaded = false;

export const loadModels = async (): Promise<void> => {
  if (modelsLoaded) {
    return;
  }
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error("Failed to load face-api models:", error);
    throw new Error("Could not load AI models for mood detection.");
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

  const detections = await faceapi
    .detectSingleFace(element, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (!detections) {
    throw new Error("No face detected. Please make sure your face is clearly visible.");
  }

  const expressions = detections.expressions;
  const dominantExpression = Object.keys(expressions).reduce((a, b) => 
    expressions[a as FaceExpression] > expressions[b as FaceExpression] ? a : b
  ) as FaceExpression;
  
  if (dominantExpression === 'happy' || dominantExpression === 'surprised') {
    return expressionToMoodMap[dominantExpression];
  }
  
  // For other moods, require a higher confidence to avoid misclassification
  if (expressions[dominantExpression] > 0.6) {
      if (dominantExpression in expressionToMoodMap) {
          return expressionToMoodMap[dominantExpression];
      }
  }

  return Mood.Neutral; // Default to neutral if no dominant expression is strong enough
};