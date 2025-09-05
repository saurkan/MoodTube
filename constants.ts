
import { Mood } from './types';

export const MOOD_TO_QUERY_MAP: Record<Mood, string[]> = {
  [Mood.Happy]: ["funny animal videos", "comedy sketches", "upbeat music", "feel good movies clips"],
  [Mood.Sad]: ["inspirational talks", "calming nature sounds", "ambient music", "comfort food recipes"],
  [Mood.Angry]: ["heavy metal music", "action movie scenes", "intense workout motivation", "rage room compilation"],
  [Mood.Surprised]: ["mind blowing facts", "magic tricks revealed", "unexpected plot twists", "science experiments"],
  [Mood.Neutral]: ["documentaries", "educational videos", "lo-fi hip hop radio", "how-to tutorials"],
  [Mood.Calm]: ["meditation music", "asmr", "peaceful nature scenes", "bob ross painting"],
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
