
import React from 'react';
import type { VideoItem } from '../types';
import { VideoCard, VideoCardSkeleton } from './VideoCard';

interface VideoGridProps {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-8">
        <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
        <p className="max-w-md">{error}</p>
        <p className="mt-4 text-sm text-zinc-400">Please verify your YouTube API key is correct and has the 'YouTube Data API v3' enabled in the Google Cloud Console.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (videos.length === 0) {
     return (
        <div className="flex items-center justify-center h-full text-center text-zinc-400">
            <p>No videos found for this mood. Try again!</p>
        </div>
     )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 animate-fade-in">
      {videos.map((video) => (
        <VideoCard key={video.id.videoId} video={video} />
      ))}
    </div>
  );
};
