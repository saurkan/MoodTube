
import { Mood } from './types';

export const MOOD_TO_QUERY_MAP: Record<Mood, string[]> = {
  [Mood.Happy]: [
    "funny comedy sketches english", 
    "upbeat music videos 2024", 
    "feel good movie scenes", 
    "funny moments compilation",
    "comedy shows english",
    "happy music hits"
  ],
  [Mood.Sad]: [
    "emotional movie scenes", 
    "sad music videos", 
    "inspirational speeches", 
    "melancholic music",
    "dramatic movie clips",
    "emotional music performances"
  ],
  [Mood.Angry]: [
    "action movie scenes", 
    "heavy metal music videos", 
    "intense movie clips", 
    "rock music performances",
    "action movie trailers",
    "intense music videos"
  ],
  [Mood.Surprised]: [
    "mind blowing movie scenes", 
    "magic tricks revealed", 
    "unexpected plot twists", 
    "amazing movie moments",
    "surprising comedy sketches",
    "shocking movie scenes"
  ],
  [Mood.Neutral]: [
    "documentary clips", 
    "educational content", 
    "lo-fi music", 
    "tutorial videos",
    "informative content",
    "calm music videos"
  ],
  [Mood.Calm]: [
    "peaceful music videos", 
    "meditation music", 
    "calm movie scenes", 
    "relaxing music",
    "peaceful nature videos",
    "soothing music performances"
  ],
};

export const INITIAL_VIDEO_QUERIES: string[] = [
  "latest tech reviews",
  "popular music videos",
  "trending movie trailers",
  "epic drone footage",
  "top 10 travel destinations",
  "amazing cooking recipes",
];

export const MODEL_URL = '/models';
