
import React from 'react';
import type { VideoItem } from '../types';
import { Mood } from '../types';
import { VideoCard, VideoCardSkeleton } from './VideoCard';

interface VideoGridProps {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
  currentMood?: Mood;
  searchQuery?: string | null;
}

const getMoodTitle = (mood?: Mood, searchQuery?: string | null): string => {
  if (searchQuery) return `Search results for "${searchQuery}"`;
  if (!mood) return "Random videos for you";
  
  const moodTitles: Record<Mood, string> = {
    [Mood.Happy]: "Timeline curated for your happy mood 😊",
    [Mood.Sad]: "Timeline curated for your sad mood 😢", 
    [Mood.Angry]: "Timeline curated for your angry mood 😠",
    [Mood.Surprised]: "Timeline curated for your surprised mood 😲",
    [Mood.Neutral]: "Timeline curated for your neutral mood 😐",
    [Mood.Calm]: "Timeline curated for your calm mood 😌"
  };
  
  return moodTitles[mood] || "Timeline curated for you";
};

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading, error, currentMood, searchQuery }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-8">
        <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
        <p className="max-w-md">{error}</p>
        <p className="mt-4 text-sm text-gray-400">Please verify your YouTube API key is correct and has the 'YouTube Data API v3' enabled in the Google Cloud Console.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{getMoodTitle(currentMood, searchQuery)}</h1>
          <p className="text-gray-400">
            {searchQuery ? "Loading search results..." : "Loading videos that match your mood..."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  if (videos.length === 0) {
     return (
        <div className="p-6">
                  <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{getMoodTitle(currentMood, searchQuery)}</h1>
          <p className="text-gray-400">
            {searchQuery ? "No videos found for your search. Try different keywords!" : "No videos found for this mood. Try again!"}
          </p>
        </div>
        </div>
     )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{getMoodTitle(currentMood, searchQuery)}</h1>
        <p className="text-gray-400">
          {searchQuery 
            ? "Search results for your query" 
            : currentMood 
              ? "Videos selected based on your current mood" 
              : "Random videos to get you started"
          }
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};
