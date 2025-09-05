
import React from 'react';
import type { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative">
        <img 
          src={video.snippet.thumbnails.high.url} 
          alt={video.snippet.title} 
          className="w-full h-auto object-cover rounded-xl group-hover:rounded-none transition-all duration-200"
        />
      </div>
      <div className="flex mt-3 space-x-3">
        {/* Placeholder for channel avatar */}
        <div className="w-9 h-9 bg-zinc-700 rounded-full flex-shrink-0"></div>
        <div>
          <h3 className="text-base font-semibold leading-tight text-zinc-100 line-clamp-2">
            {video.snippet.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">{video.snippet.channelTitle}</p>
        </div>
      </div>
    </div>
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full bg-zinc-700 aspect-video rounded-xl"></div>
      <div className="flex mt-3 space-x-3">
        <div className="w-9 h-9 bg-zinc-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
